const router= require("express").Router();
const {createAppointment} =require('../controllers/appointmentController.js');
router.post('/create',createAppointment);
module.exports=router;