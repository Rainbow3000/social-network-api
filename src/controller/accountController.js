const _accountService = require('../service/accountService')
module.exports = {
    login:async(req,res,next)=>{
        try {
            const result = await _accountService.login(req.body); 
            res.status(result.statusCode).json(result); 
        } catch (error) {
            res.status(error.statusCode).json(error); 
        }
    }, 
    register:async(req,res,next)=>{
        try {
            const result = await _accountService.register(req.body); 
            res.status(result.statusCode).json(result); 
        } catch (error) {
            res.status(error.statusCode).json(error); 
        }
    },

    updatePassword:async(req,res,next)=>{
        try {
            const result = await _accountService.updatePassword(req.body,req.params.id); 
            res.status(result.statusCode).json(result); 
        } catch (error) {
            res.status(error.statusCode).json(error); 
        }
    },

    resetPassword:async(req,res,next)=>{
        try {
            const result = await _accountService.resetPassword(req.body); 
            res.status(result.statusCode).json(result); 
        } catch (error) {
            res.status(error.statusCode).json(error); 
        }
    },
}