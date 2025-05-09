const express = require("express");
const router = express.Router()
const UserControllers = require("../Controllers/user")
const Authentication = require('../Authentication/auth');

router.post("/register",UserControllers.register);
router.post("/login",UserControllers.login);
router.post("/send-otp",UserControllers.sendOtp);
router.post("/check-otp",UserControllers.checkOtp);
router.post("/reset-password",UserControllers.resetPassword)

router.put("/update-student/:id",Authentication.adminFacultyAuth,UserControllers.updateStudentById)
router.get("/get-student-by-roll/:roll",Authentication.adminFacultyAuth,UserControllers.getStudentByRollNo)
router.post("/registerStudentByStaff",Authentication.adminFacultyAuth,UserControllers.registerStudentByStaff)

router.post("/add-staff",Authentication.adminFacultyAuth,UserControllers.addStaffsByAdmin)
router.get("/get-staff",UserControllers.getAllStaffs)
router.get("/get-staff/:id",Authentication.adminFacultyAuth,UserControllers.getStaffById)
router.put("/update-staff/:id",Authentication.adminFacultyAuth,UserControllers.updateStaffById)
router.delete("/delete-staff/:id",Authentication.adminFacultyAuth,UserControllers.deleteStaff)


router.post('/logout',Authentication.studentAuth,UserControllers.logout)

module.exports = router;