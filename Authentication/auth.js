const jwt = require('jsonwebtoken');
const User = require('../Models/user');

exports.studentAuth = async (req, res, next) =>{
    
    const token = req.cookies.token;
    if(!token){
        return res.status(401).json({ error: 'No token, authorization denied' });
    }else{
        try{
            const decode = jwt.verify(token, "Its_My_Secret_Key");
            req.user = await User.findById(decode.userId).select('-password');
            next();
        }catch(err){
            res.status(401).json({ error: 'Token is not valid' });
        }
    }
}

exports.adminFacultyAuth = async (req, res, next) =>{
    
    const token = req.cookies.token;
    if(!token){
        return res.status(401).json({ error: 'No token, authorization denied' });
    }else{
        try{
            const decode = jwt.verify(token, "Its_My_Secret_Key");
            req.user = await User.findById(decode.userId).select('-password');
            if(req?.user?.role==="student"){
                throw new Error("You have not access to this page");
                
            }
            next();
        }catch(err){
            res.status(500).json({
                error:"Something Went Wrong",
                issue:err.message
            })
        }
    }
}

