
const postService = require('../service/postService')


module.exports = {
    get: async(req,res,next)=>{
        try {
            const result = await postService.findById(req.params?.id); 
            res.status(result.statusCode).json(result); 
        } catch (error) {
            
        }
    },
    getByUser: async(req,res,next)=>{
        try {
            const result = await postService.getByUser(req.params?.id); 
            res.status(result.statusCode).json(result); 
        } catch (error) {
            
        }
    },
    getAll: async(req,res,next)=>{
        try { 
            const result =  await postService.getAll(); 
            res.status(result.statusCode).json(result);
        } catch (error) {
            
        }
    },

    getByAdmin: async(req,res,next)=>{
        try { 
            const result =  await postService.getByAdmin(); 
            res.status(result.statusCode).json(result);
        } catch (error) {
            
        }
    },

    getByAdminCreated: async(req,res,next)=>{
        try { 
            const result =  await postService.getByAdminCreated(req.params?.id); 
            res.status(result.statusCode).json(result);
        } catch (error) {
            
        }
    },



    getDenounceList: async(req,res,next)=>{
        
        try { 
            const result =  await postService.getDenouncePostList(); 
            res.status(result.statusCode).json(result);
        } catch (error) {
            
        }
    },

    create: async(req,res,next)=>{
        try {
            const result = await postService.create(req.body); 
            res.status(result.statusCode).json(result); 
        } catch (error) {
            
        }
    },

    update: async(req,res,next)=>{
        try {
            const result = await postService.update(req.body,req.params?.id); 
            res.status(result.statusCode).json(result);
        } catch (error) {
            
        }
    },

    confirmOffence: async(req,res,next)=>{
        try {
            const result = await postService.confirmOffense(req.body,req.params?.id); 
            res.status(result.statusCode).json(result);
        } catch (error) {
            
        }
    },
    lockPost: async(req,res,next)=>{
        try {
            const result = await postService.lockPost(req.params?.id); 
            res.status(result.statusCode).json(result);
        } catch (error) {
            
        }
    },

    denounce: async(req,res,next)=>{
        try {
            const result = await postService.denounce(req.body,req.params?.id); 
            res.status(result.statusCode).json(result);
        } catch (error) {
            
        }
    },
    updateStatus: async(req,res,next)=>{
        try {
            const result = await postService.updateStatus(req.body,req.params?.id);           
            res.status(result.statusCode).json(result);
        } catch (error) {
            console.log(error)
        }
    },

    updatePostByOtherUser: async(req,res,next)=>{
        try {
            const result = await postService.updatePostByOtherUser(req.body,req.params?.id); 
            res.status(result.statusCode).json(result);
        } catch (error) {
            
        }
    },
    delete: async(req,res,next)=>{
        try {
            const result = await postService.delete(req.params?.id); 
            res.status(result.statusCode).json(result);
        } catch (error) {
            
        }
    },

    postStat: async(req,res,next)=>{
        try {
            const result = await postService.postStat(); 
            res.status(result.statusCode).json(result);
        } catch (error) {
            
        }
    },
}