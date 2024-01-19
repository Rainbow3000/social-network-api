
const commentService = require('../service/commentService')


module.exports = {
    get: async(req,res,next)=>{
        try {
           
            const result = await commentService.get(req.params?.id); 
            res.status(result.statusCode).json(result); 
        } catch (error) {
            
        }
    },

    getByPost: async(req,res,next)=>{
        try {
            const result = await commentService.getByPost(req.params?.id); 
            res.status(result.statusCode).json(result); 
        } catch (error) {
            
        }
    },

    getAll: async(req,res,next)=>{
        try { 
            const result =  await commentService.getAll(); 
            res.status(result.statusCode).json(result);
        } catch (error) {
            
        }
    },

    create: async(req,res,next)=>{
        try {
            const result = await commentService.create(req.body); 
            res.status(result.statusCode).json(result); 
        } catch (error) {
            
        }
    },

    update: async(req,res,next)=>{
        try {
            const result = await commentService.update(data,req.params?.id); 
            res.status(result.statusCode).json(result);
        } catch (error) {
            
        }
    },

    updatecommentByOtherUser: async(req,res,next)=>{
        try {
            const result = await commentService.updatecommentByOtherUser(req.body,req.params?.id); 
            res.status(result.statusCode).json(result);
        } catch (error) {
            
        }
    },
    delete: async(req,res,next)=>{
        try {
            console.log(req.params?.id)
            const result = await commentService.delete(req.params?.id); 
            res.status(result.statusCode).json(result);
        } catch (error) {
            
        }
    },
}