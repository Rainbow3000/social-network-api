const express = require('express'); 
const router = express.Router(); 

const notificationController = require('../controller/notificationController'); 
const  {verifyToken,verifyTokenAndAuthorization,verifyTokenAndAdmin} = require('../utils/verifyToken')

router.get('/api/notification/:id',notificationController.get); 
router.get('/api/notification/getbypost/:id',notificationController.getByPost); 
router.get('/api/notification/getbyuser/:id',notificationController.getByUserId); 
router.get('/api/notification',notificationController.getAll); 
router.post('/api/notification',notificationController.create); 
router.post('/api/notification/byadmin',notificationController.createByAdmin); 
router.put('/api/notification/:id',notificationController.update);  
router.delete('/api/notification/:id',notificationController.delete); 
 
 
module.exports = router; 


