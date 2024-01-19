const Comment = require('../model/commentModel'); 
module.exports = {
    get: async(id)=>{
        try {
          
            return await Comment.findById(id).populate(
                {
                    path:'children',
                    populate:{
                        path:'user',
                        populate:{
                            path:'_id'
                        }
                    }
                    
                }
            ); 
        } catch (error) {
            throw error;
        }
    },

    getByPost: async(id)=>{
        try {
            return await Comment.find({post:id,parent:null}).populate(
                {
                    path:'user',
                    populate: { path: '_id' }
                },
            )
        } catch (error) {
            throw error;
        }
    },



    getAll: async()=>{
        try {
            return await Comment.find().populate({
                path: 'user',
                populate: {
                    path:'_id',
                    select:'userName'
                }
              })
        } catch (error) {
           throw error; 
        }
    },

    create: async(data)=>{
        try {
            const comment = new Comment(data);
            const commentCreated =  await comment.save(); 
            return await Comment.findById({_id:commentCreated._id}).populate(
                {
                    path:'user',
                    populate: { path: '_id' }
                },
            ).populate(
                {
                    path:'children',
                    populate:{
                        path:'user',
                        populate:{
                            path:'_id'
                        }
                    }
                    
                }
            );
        } catch (error) {
            console.log(error);
            throw error;
        }
    },

    update: async(commentId,data)=>{
        try {
            return await Comment.findByIdAndUpdate({_id:commentId},data,{
                new:true
            }).populate({
                path: 'user',
                populate: {
                    path:'_id',
                    select:'userName'
                }
              });
            
        } catch (error) {
            throw error;
        }
    },
    delete: async(id)=>{
        try {
            await Comment.findByIdAndDelete(id);
            return 1;
        } catch (error) {
            throw error;
        }
    },
    deleteMany: async(id)=>{
        try {
            await Comment.deleteMany({user:id});
            return 1;
        } catch (error) {
            throw error;
        }
    },
}