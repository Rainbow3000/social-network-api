
const express = require('express'); 
const router = express.Router(); 

const postController = require('../controller/postController'); 
const  {verifyToken,verifyTokenAndAuthorization,verifyTokenAndAdmin} = require('../utils/verifyToken')

router.get('/api/post/stat',postController.postStat); 
router.get('/api/post/:id',postController.get); 
router.get('/api/post',postController.getAll); 
router.get('/api/post/all/byadmin',postController.getByAdmin); 
router.get('/api/post/byadmin/:id',postController.getByAdminCreated); 
router.get('/api/post/denounce/getlist',postController.getDenounceList); 
router.put('/api/post/denounce/:id',postController.denounce); 
router.put('/api/post/offence/:id',postController.confirmOffence); 
router.put('/api/post/lock/:id',postController.lockPost); 
router.get('/api/post/getbyuser/:id',postController.getByUser); 
router.post('/api/post',postController.create); 
router.put('/api/post/:id',postController.update); 
router.put('/api/post/status/:id',postController.updateStatus); 
router.put('/api/post/update/byotheruser/:id',postController.updatePostByOtherUser); 
router.delete('/api/post/:id',postController.delete); 

module.exports = router; 


