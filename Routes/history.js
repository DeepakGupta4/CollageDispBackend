const express = require("express");
const router = express.Router()
const Authentication = require('../Authentication/auth');
const HistoryController = require("../Controllers/history");


router.post('/add',Authentication.adminFacultyAuth,HistoryController.addHistory)
router.get('/get',Authentication.studentAuth,HistoryController.getStudentHistory);
router.get('/get-history',Authentication.adminFacultyAuth,HistoryController.getHistoryByDate)
// router.delete('/delete/:id',Authentication.adminFacultyAuth,GallaryController.deleteImageById)

module.exports = router;