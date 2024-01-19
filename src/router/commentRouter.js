const express = require('express'); 
const router = express.Router(); 

const commentController = require('../controller/commentController'); 

const  {verifyToken,verifyTokenAndAuthorization,verifyTokenAndAdmin} = require('../utils/verifyToken')
router.get('/api/comment/:id',commentController.get); 
router.get('/api/comment/getbypost/:id',commentController.getByPost); 
router.get('/api/comment',commentController.getAll); 
router.post('/api/comment',commentController.create); 
router.put('/api/comment/:id',commentController.update);  
router.delete('/api/comment/:id',commentController.delete); 

module.exports = router; 


