
const express = require('express'); 
const router = express.Router(); 

const accountController = require('../controller/accountController'); 


router.post('/api/account/register',accountController.register); 
router.post('/api/account/login',accountController.login); 
router.put('/api/account/password/:id',accountController.updatePassword); 
router.post('/api/account/password/reset',accountController.resetPassword); 
 
module.exports = router; 


