const _commentRepository = require('../repository/commentRepository');
const _postRepository = require('../repository/postRepository')
const validateError = require('../utils/validateError');
const mongoose = require('mongoose'); 
const moment = require('moment')
module.exports = {
    get: async(id)=>{
        try {
            const comment =  await _commentRepository.get(id); 
            if(!comment){
                return {
                    success:false,
                    message:"Bình luận không tồn tại",
                    statusCode:404,
                    data:null
                }
            }
            return {
                    success:true,
                    message:"Lấy bình luận thành công",
                    statusCode:200,
                    data:comment.children
            };
        } catch (error) {
            
        }
    },

    getByPost: async(postId)=>{
        try {
            const comment =  await _commentRepository.getByPost(postId); 
            if(!comment){
                return {
                    success:false,
                    message:"Bình luận không tồn tại",
                    statusCode:404,
                    data:null
                }
            }
            return {
                    success:true,
                    message:"Lấy bình luận thành công",
                    statusCode:200,
                    data:comment
            };
        } catch (error) {
            
        }
    },
    getAll: async()=>{
        try { 
            const commentList =  await _commentRepository.getAll(); 
            return {
                success:true,
                message:"Lấy danh sách bình luận thành công",
                statusCode:200,
                data:commentList
            }
        } catch (error) {
            
        }
    },

    create: async(data)=>{
        try {
            data.createdDate = moment().format();
            const commentCreated = await _commentRepository.create(data);   
            const postExisted = await _postRepository.get(data.post);        
            const userComment = postExisted.comment.userCommented.find(item => mongoose.Types.ObjectId(item).equals(mongoose.Types.ObjectId(data.user)));
            if(userComment === undefined){
                postExisted.comment.userCommented.push(data.user); 
                postExisted.comment.number ++; 
            }else{
               
                postExisted.comment.number ++; 
            }
             await _postRepository.update(data.post,postExisted);
            const {parent} = data; 
            if(parent !== null){
                const parentComment =  await _commentRepository.get(parent); 
                if(parentComment){
                    parentComment._doc.children?.push(commentCreated._doc._id); 
                }
                await _commentRepository.update(parentComment._doc._id,parentComment); 
            }
            return {
                success:true,
                message:"Tạo bình luận thành công",
                statusCode:201,
                data:commentCreated,
                errors:null
            } 
        } catch (error) {       
                 if(error instanceof mongoose.Error.ValidationError){  
                    return {
                        success:false,
                        message:"Tạo bình luận thất bại",
                        statusCode:400,
                        data:null,
                        errors:validateError(error)
                    };
                }
                    return {
                        success:false,
                        message:"Tạo bình luận thất bại",
                        statusCode:500,
                        data:null,
                        errors:error?.message
                    };
        }
    },

    update: async(data,id)=>{
        try {

            const {id} = data; 
            const commentExisted = await _commentRepository.get(id); 
            if(!commentExisted){
                return {
                    success:false,
                    message:"bình luận không tồn tại",
                    statusCode:404,
                    data:null
                }
            }

            const commentUpdated =  await _commentRepository.update(id,data);
            return {
                success:true,
                message:"Cập nhật bình luận thành công",
                statusCode:200,
                data:commentUpdated
            }
        } catch (error) {
            
        }
    },

    delete: async(id)=>{
        try {
            const commentExisted = await _commentRepository.get(id); 
            if(!commentExisted){
                return {
                    success:false,
                    message:"bình luận không tồn tại",
                    statusCode:403,
                    data:null
                }
            }

            const commentDeleted = await _commentRepository.delete(id); 
            return {
                success:true,
                message:"Xóa bình luận thành công",
                statusCode:200,
                data:commentDeleted
            }

        } catch (error) {
            
        }
    },

    deleteMany: async(id)=>{
        try {
            const commentDeleted = await _commentRepository.deleteMany({user:id}); 
            return {
                success:true,
                message:"Xóa bình luận thành công",
                statusCode:200,
                data:commentDeleted
            }

        } catch (error) {
            
        }
    },
}