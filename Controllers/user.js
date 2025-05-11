const UserModels = require("../Models/user");
const bcrypt = require('bcryptjs');
const jwt = require("jsonwebtoken");
const nodemailer = require('nodemailer')
const crypto = require('crypto')
const dotenv = require('dotenv');
dotenv.config();

const cookieOptions = {
    httpOnly: true,
    secure: true, // Set to true in production
    sameSite: 'None', // Set to 'None' for cross-origin cookies

};

const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: deepakguptak9369@gmail.com,
        pass: wwdxjasedilainl
    }
});

exports.register = async (req, res) => {
    try {
        const { name, email, password, roll } = req.body;
        const isExist = await UserModels.findOne({ email });

        if (isExist) {
            res.status(400).json({ error: "Already have an account with this email or roll." });
        } else {
            let updatedPass = await bcrypt.hash(password, 10);
            const user = new UserModels({ name, email, roll, password: updatedPass });
            await user.save();
            res.status(201).json({ message: 'User registered successfully', success: "yes", data: user });
        }
    } catch (err) {
        res.status(500).json({
            error: "Something Went Wrong",
            issue: err.message
        })
    }
}

exports.login = async (req, res) => {
    try {
        const { email, password } = req.body;

        const user = await UserModels.findOne({ email });
        if (user && await bcrypt.compare(password, user.password)) {
            const token = jwt.sign({ userId: user._id }, 'Its_My_Secret_Key');

            res.cookie('token', token, cookieOptions);

            res.json({ message: 'Logged in successfully', success: "true", token, user });

        } else {
            res.status(400).json({ error: 'Invalid credentials' });
        }
    } catch (err) {
        res.status(500).json({
            error: "Something Went Wrong",
            issue: err.message
        })
    }
}

exports.sendOtp = async (req, res) => {
    try {
        const { email } = req.body;

        // Check if the email is provided
        if (!email) {
            return res.status(400).json({ error: 'Email is required' });
        }

        const user = await UserModels.findOne({ email });

        if (!user) {
            return res.status(400).json({ error: 'User not found' });
        }

        // Generate OTP
        const buffer = crypto.randomBytes(4); // Get random bytes
        const token = buffer.readUInt32BE(0) % 900000 + 100000; // Modulo to get a 6-digit number

        // Update user with OTP and expiration
        user.resetPasswordToken = token;
        user.resetPasswordExpires = Date.now() + 3600000; // 1 hour expiry
        await user.save();

        // Email configuration
        const mailOptions = {
            from: 'deepakguptak9369@gmail.com',
            to: email,
            subject: 'Password Reset',
            text: `You requested a password reset. Your OTP is : ${token}`
        };

        // Send email
        transporter.sendMail(mailOptions, (error, info) => {
            if (error) {
                console.error('Error sending email:', error); // Log the error
                return res.status(500).json({ error: 'Error sending OTP email', errorMsg: error });
            } else {
                console.log('Email sent:', info); // Log the info
                return res.status(200).json({ message: "OTP Sent to your email" });
            }
        });

    } catch (err) {
        console.error('Error during OTP process:', err); // Log the error
        return res.status(500).json({
            error: "Something Went Wrong",
            issue: err.message
        });
    }
}


exports.checkOtp = async (req, res) => {
    try {
        const { otp, email } = req.body;
        const user = await UserModels.findOne({
            email,
            resetPasswordToken: otp,
            resetPasswordExpires: { $gt: Date.now() }
        });

        if (!user) {
            return res.status(400).json({ error: 'Opt is invalid or has expired, Please Try Again.' });
        }
        res.status(200).json({ message: "OTP is Successfully Verified" })



    } catch (err) {
        res.status(500).json({
            error: "Something Went Wrong",
            issue: err.message
        })
    }
}


exports.resetPassword = async (req, res) => {
    try {
        const { email, newPassword } = req.body;

        const user = await UserModels.findOne({ email });
        if (!user) {
            return res.status(400).json({ error: 'Some Technical Issue , please try again later' });
        }
        let updatedPassword = await bcrypt.hash(newPassword, 10);
        user.password = updatedPassword;
        user.resetPasswordExpires = undefined;
        user.resetPasswordToken = undefined;

        await user.save();
        res.status(200).json({ message: "Password Reset Successfully" })

    } catch (err) {
        res.status(500).json({
            error: "Something Went Wrong",
            issue: err.message
        })
    }
}


exports.addStaffsByAdmin = async (req, res) => {
    try {
        const { name, email, password, designation, mobileNo } = req.body;
        const searchStaff = await UserModels.findOne({ email });
        if (searchStaff) {
            return res.status(400).json({ error: "Already have an account with this email id." });
        }
        let updatedPass = await bcrypt.hash(password, 10);
        const user = new UserModels({ name, email, designation, mobileNo, password: updatedPass, role: "staff" });
        await user.save();

        const mailOptions = {
            from: 'deepakguptak9369@gmail.com',
            to: email,
            subject: 'Your Password for SAM Bhopal medicine admin portal',
            text: `Welcome ${name}. Your Password for login in staff portal is : ${password}, You can reset your Password by clicking on Forgot password later.`
        };

        transporter.sendMail(mailOptions, (error, info) => {
            if (error) {
                res.status(500).json({ error: 'Staff Account has beend created , but having some issue in sending password in registered mail.', errorMsg: error });
            } else {
                res.status(200).json({ message: "Password has been sent to registered email", user })

            }
        });

    } catch (err) {
        res.status(500).json({
            error: "Something Went Wrong",
            issue: err.message
        })
    }
}


exports.getAllStaffs = async (req, res) => {
    try {
        const staffs = await UserModels.find({ role: "staff" });
        res.status(200).json({
            staffs
        })
    } catch (err) {
        res.status(500).json({
            error: "Something Went Wrong",
            issue: err.message
        })
    }
}

exports.getStaffById = async (req, res) => {
    try {
        const { id } = req.params;
        const staff = await UserModels.findById(id);
        if (staff) {
            return res.status(200).json({ staff });
        }
        return res.status(400).json({ error: "No Such Staff is there" })
    } catch (err) {
        res.status(500).json({
            error: "Something Went Wrong",
            issue: err.message
        })
    }
}

exports.updateStaffById = async (req, res) => {
    try {
        const { id } = req.params;
        const { name, designation, mobileNo } = req.body;
        const staff = await UserModels.findById(id);
        if (staff) {
            staff.name = name;
            staff.designation = designation;
            staff.mobileNo = mobileNo;
            await staff.save();
            return res.status(200).json({ message: "Successfully Updated" });
        }
        return res.status(400).json({ error: "No Such Staff is there" })
    } catch (err) {
        res.status(500).json({
            error: "Something Went Wrong",
            issue: err.message
        })
    }
}


exports.deleteStaff = async (req, res) => {
    try {
        const { id } = req.params;
        const deletedUser = await UserModels.findByIdAndDelete(id);

        if (deletedUser) {
            return res.status(200).json({ message: "Staff Getting Deleted" });
        }
        return res.status(400).json({ error: "No Such Staff is there" })
    } catch (err) {
        res.status(500).json({
            error: "Something Went Wrong",
            issue: err.message
        })
    }
}


exports.updateStudentById = async (req, res) => {
    try {
        const { id } = req.params;
        const updateStudent = await UserModels.findByIdAndUpdate(id, req.body, { new: true });

        if (updateStudent) {
            return res.status(200).json({ message: "Staff Update Successfully" });
        }
        return res.status(400).json({ error: "No Such Student is there" })
    } catch (err) {
        res.status(500).json({
            error: "Something Went Wrong",
            issue: err.message
        })
    }
}

exports.getStudentByRollNo = async (req, res) => {
    try {
        const { roll } = req.params;
        const student = await UserModels.findOne({ roll });

        if (student) {
            return res.status(200).json({ message: "Student fetched Successfully", student });
        }
        return res.status(400).json({ error: "No Such Student is there" })
    } catch (err) {
        res.status(500).json({
            error: "Something Went Wrong",
            issue: err.message
        })
    }
}

exports.registerStudentByStaff = async (req, res) => {
    try {
        const buffer = crypto.randomBytes(4); // Get random bytes
        let token = buffer.readUInt32BE(0) % 900000 + 100000; // Modulo to get a 6-digit number
        let { _id, ...body } = req.body;
        const isExist = await UserModels.findOne({ email: body.email });
        if (isExist) {
            return res.status(400).json({ error: "Already have an account with this email" });
        }
        token = token.toString();
        let updatedPass = await bcrypt.hash(token, 10);

        const user = new UserModels({ ...body, password: updatedPass });
        await user.save();


        const mailOptions = {
            from: 'deepakguptak9369@gmail.com',
            to: body.email,
            subject: 'Password for your ',
            text: `Your password of. Your OTP is : ${token}`
        };

        transporter.sendMail(mailOptions, (error, info) => {
            if (error) {
                res.status(500).json({ error: 'Server error', errorMsg: error });
            } else {
                res.status(200).json({ message: "Registered Successfully.Password has sent to student's email" })

            }
        });


    } catch (err) {
        res.status(500).json({
            error: "Something Went Wrong",
            issue: err.message
        })
    }
}

exports.logout = async (req, res) => {
    res.clearCookie('token', cookieOptions).json({ message: 'Logged out successfully' });
}
