const _chatRepository = require('../repository/chatRepository');
const _userRepository = require('../repository/userRepository')
const validateError = require('../utils/validateError');
const mongoose = require('mongoose'); 
const moment = require('moment')
const {getSocketIo}  = require('../../src/socket')
const {sendMailHaveMess} = require('../utils/sendMail')
module.exports = {
    get: async(id)=>{
        try {
            const chat =  await _chatRepository.findById(id); 
            if(!chat){
                return {
                    success:false,
                    message:"Chat không tồn tại",
                    statusCode:404,
                    data:null
                }
            }
            return {
                    success:true,
                    message:"Lấy chat thành công",
                    statusCode:200,
                    data:chat
            };
        } catch (error) {
            
        }
    },

    getByUser: async(idParams)=>{
        const paramsSplit = idParams.split('&');
        const id = paramsSplit[0];
        const otherId =paramsSplit[1]; 
        try {
            const chat =  await _chatRepository.getByUser(id,otherId); 
            if(!chat){
                return {
                    success:false,
                    message:"Chat không tồn tại",
                    statusCode:404,
                    data:null
                }
            }
            return {
                    success:true,
                    message:"Lấy chat thành công",
                    statusCode:200,
                    data:chat
            };
        } catch (error) {
            
        }
    },

    getOneByUser: async(idParams)=>{
        const paramsSplit = idParams.split('&');
        const id = paramsSplit[0];
        const otherId =paramsSplit[1]; 
        try {
            const chat =  await _chatRepository.getOneByUser(id,otherId); 
            if(!chat){
                return {
                    success:false,
                    message:"Chat không tồn tại",
                    statusCode:404,
                    data:null
                }
            }
            return {
                    success:true,
                    message:"Lấy chat thành công",
                    statusCode:200,
                    data:chat
            };
        } catch (error) {
            
        }
    },
    getAll: async()=>{
        try { 
            const chatList =  await _chatRepository.getAll(); 
            return {
                success:true,
                message:"Lấy danh sách chat thành công",
                statusCode:200,
                data:chatList
            }
        } catch (error) {
            
        }
    },

    create: async(data)=>{
        try {
            data.createdDate = moment().format();
            const chatCreated = await _chatRepository.create(data);   
            
            const fromUser = await _userRepository.get(chatCreated.from._id._id); 

            if(!fromUser){
                return {
                    success:false,
                    message:"Người dùng không tồn tại",
                    statusCode:404,
                    data:null
                }
            }

            if(fromUser.chats.find(item => item.equals(chatCreated.to._id._id)) === undefined){
                fromUser.chats = fromUser.chats.push(chatCreated.to._id._id); 
            }
           

            await _userRepository.update(fromUser,chatCreated.from._id._id);


            const toUser = await _userRepository.get(chatCreated.to._id._id); 

            if(!toUser){
                return {
                    success:false,
                    message:"Người dùng không tồn tại",
                    statusCode:404,
                    data:null
                }
            }

            if(toUser.chats.find(item => item.equals(chatCreated.from._id._id)) === undefined){
                toUser.chats = toUser.chats.push(chatCreated.from._id._id); 
            }
            

            await _userRepository.update(toUser,chatCreated.to._id._id);




            const {ioObject,socketObject,userOnline} = getSocketIo();

            if(ioObject && socketObject){  
                const toId = chatCreated.to?._id?._id.toString();
                const fromId = chatCreated.from?._id?._id.toString(); 
                if(userOnline.has(toId)){
                    const socketId = userOnline.get(toId);
                    socketObject.join(socketId)
                    ioObject.to(socketId).emit("receive-message-single-user",chatCreated);               
                }else{
                    const userExisted = await _userRepository.get(toId); 
             
                    sendMailHaveMess(userExisted._id.email, userExisted._id.userName); 
                } 

                if(userOnline.has(fromId)){
                    const socketId = userOnline.get(fromId);
                    socketObject.join(socketId)
                    ioObject.to(socketId).emit("receive-message-single-user",chatCreated);               
                } 
            }

            return {
                success:true,
                message:"Tạo chat thành công",
                statusCode:201,
                data:chatCreated,
                errors:null
            } 
        } catch (error) {       
                 if(error instanceof mongoose.Error.ValidationError){  
                    return {
                        success:false,
                        message:"Tạo chat thất bại",
                        statusCode:400,
                        data:null,
                        errors:validateError(error)
                    };
                }
                    return {
                        success:false,
                        message:"Tạo chat thất bại",
                        statusCode:500,
                        data:null,
                        errors:error?.message
                    };
        }
    },

    update: async(data,id)=>{
        try {

            const {id} = data; 
            const chatExisted = await _chatRepository.get(id); 
            if(!chatExisted){
                return {
                    success:false,
                    message:"Chat không tồn tại",
                    statusCode:404,
                    data:null
                }
            }

            const chatUpdated =  await _chatRepository.update(id,data);
            return {
                success:true,
                message:"Cập nhật chat thành công",
                statusCode:200,
                data:chatUpdated
            }
        } catch (error) {
            
        }
    },
    delete: async(id)=>{
        try {
            const chatExisted = await _chatRepository.get(id); 
            if(!chatExisted){
                return {
                    success:false,
                    message:"Chat không tồn tại",
                    statusCode:403,
                    data:null
                }
            }
          
            const chatDeleted = await _chatRepository.delete(id); 
            return {
                success:true,
                message:"Xóa chat thành công",
                statusCode:200,
                data:chatDeleted
            }

        } catch (error) {
            
        }
    },
}