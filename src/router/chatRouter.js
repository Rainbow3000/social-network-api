const express = require('express'); 
const router = express.Router(); 

const chatController = require('../controller/chatController'); 
const  {verifyToken,verifyTokenAndAuthorization,verifyTokenAndAdmin} = require('../utils/verifyToken')

router.get('/api/chat/:id',chatController.get); 
router.get('/api/chat/getbyuser/:id',chatController.getByUser); 
router.get('/api/chat/getOnebyuser/:id',chatController.getOneByUser); 
router.get('/api/chat',chatController.getAll); 
router.post('/api/chat',chatController.create); 
router.put('/api/chat/:id',chatController.update);  
router.delete('/api/chat/:id',chatController.delete); 

module.exports = router; 


