const _userRepository = require('../repository/userRepository');
const _accountRepository = require('../repository/accountRepository');
const _notitficationRepository = require('../repository/notificationRepository');
const _postRepository = require('../repository/postRepository');
const _notificationRepository = require('../repository/notificationRepository');
const _chatRepository = require('../repository/chatRepository');
const _commentRepository = require('../repository/commentRepository');

const validateError = require('../utils/validateError');
const mongoose = require('mongoose'); 
const moment = require('moment')
const {getSocketIo}  = require('../../src/socket')
module.exports = {
    get: async(id)=>{
        try {
            const user =  await _userRepository.get(id); 
            if(!user){
                return {
                    success:false,
                    message:"Người dùng không tồn tại",
                    statusCode:404,
                    data:null
                }
            }
            return {
                    success:true,
                    message:"Lấy người dùng thành công",
                    statusCode:200,
                    data:user
            };
        } catch (error) {
            
        }
    },
    getAll: async()=>{
        try { 
            const userList =  (await _userRepository.getAll()).filter(item => item._id.role !== 'ADMIN'); 

            return {
                success:true,
                message:"Lấy danh sách người dùng thành công",
                statusCode:200,
                data:userList
            }
        } catch (error) {
            
        }
    },

    create: async(data)=>{
        try {
            const userCreated = await _userRepository.create(data);
            return {
                success:true,
                message:"Tạo người dùng thành công",
                statusCode:201,
                data:userCreated,
                errors:null
            } 
        } catch (error) {
           
                 if(error instanceof mongoose.Error.ValidationError){  
                    return {
                        success:false,
                        message:"Tạo người dùng thất bại",
                        statusCode:400,
                        data:null,
                        errors:validateError(error)
                    };
                 }
          
                return {
                    success:false,
                    message:"Tạo người dùng thất bại",
                    statusCode:500,
                    data:null,
                    errors:error?.message
                };
             
        }
    },

    update: async(data,id)=>{
        try {
            const userExisted = await _userRepository.get(id); 
            if(!userExisted){
                return {
                    success:false,
                    message:"Người dùng không tồn tại",
                    statusCode:404,
                    data:null
                }
            }
            if(data.timeDisconnect === 1){
                data.timeDisconnect = moment().format(); 
            }

            if(data.userName?.trim() !== ""){
                const account = await _accountRepository.get(id); 
                account.userName = data.userName; 
                const {_id, ...accountData}= account._doc; 
                await _accountRepository.update(accountData,account._id); 
             
            }
            const userUpdated =  await _userRepository.update(data,id);
            return {
                success:true,
                message:"Cập nhật người dùng thành công",
                statusCode:200,
                data:userUpdated
            }
        } catch (error) {
            
            if(error instanceof mongoose.Error.ValidationError){  
                return {
                    success:false,
                    message:"Cập nhật dùng thất bại",
                    statusCode:400,
                    data:null,
                    errors:validateError(error)
                };
             }
      
            return {
                success:false,
                message:"Cập nhật dùng thất bại",
                statusCode:500,
                data:null,
                errors:error?.message
            };
        }
    },
    updateStatus: async(data,id)=>{
        try {
            const userExisted = await _userRepository.get(id); 
            if(!userExisted){
                return {
                    success:false,
                    message:"Người dùng không tồn tại",
                    statusCode:404,
                    data:null
                }
            }
            if(data.timeDisconnect === 1){
                data.timeDisconnect = moment().format(); 
            }

            if(data.userName?.trim() !== ""){
                const account = await _accountRepository.get(id); 
                account.userName = data.userName; 
                const {_id, ...accountData}= account._doc; 
                await _accountRepository.update(accountData,account._id); 
             
            }
            const userUpdated =  await _userRepository.update(data,id);
            return {
                success:true,
                message:"Cập nhật người dùng thành công",
                statusCode:200,
                data:userUpdated
            }
        } catch (error) {
            
            if(error instanceof mongoose.Error.ValidationError){  
                return {
                    success:false,
                    message:"Cập nhật dùng thất bại",
                    statusCode:400,
                    data:null,
                    errors:validateError(error)
                };
             }
      
            return {
                success:false,
                message:"Cập nhật dùng thất bại",
                statusCode:500,
                data:null,
                errors:error?.message
            };
        }
    },
    delete: async(id)=>{
        try {
            const userExisted = await _userRepository.get(id); 
            if(!userExisted){
                return {
                    success:false,
                    message:"Người dùng không tồn tại",
                    statusCode:403,
                    data:null
                }
                
            }

            await _postRepository.deleteMany(id); 
            await _notificationRepository.deleteMany(id); 
            await _commentRepository.deleteMany(id);
            await _chatRepository.deleteMany(id); 

            const postList = await _postRepository.getAll(); 
            await Promise.all( postList.map(async item =>{   
                 if(item.denounce.find(deno => deno.user?._id._id.equals(id) !== undefined)){
                    item.denounce = item.denounce.filter(deno => !deno.user?._id._id.equals(id))
                    return await _postRepository.update(item._id,item); 
                 }
            }))
            
            const userDeleted = await _userRepository.delete(id); 
            await _accountRepository.delete(id); 

            return {
                success:true,
                message:"Xóa người dùng thành công",
                statusCode:200,
                data:userDeleted
            }

        } catch (error) {
            console.log(error)
            if(error instanceof mongoose.Error.ValidationError){  
                return {
                    success:false,
                    message:"Xóa người dùng thất bại",
                    statusCode:400,
                    data:null,
                    errors:validateError(error)
                };
             }
      
            return {
                success:false,
                message:"Xóa người dùng thất bại",
                statusCode:500,
                data:null,
                errors:error?.message
            };
        }
    },

    getBlockingUser:async(id)=>{
        try {
            const {blocking} =  await _userRepository.getBlockingUser(id);          
            return {
                    success:true,
                    message:"Lấy danh sách chặn thành công",
                    statusCode:200,
                    data:blocking
            };
        } catch (error) {
            
        }
    },

    updateBlock:async(data,id)=>{
        try {
            const userExisted = await _userRepository.get(data.userId); 
            if(!userExisted){
                return {
                    success:false,
                    message:"Người dùng không tồn tại",
                    statusCode:404,
                    data:null
                }
            }
            if(userExisted.blocking.find(item => item.equals(id)) === undefined){
                userExisted.blocking.push(id); 
            }else {
                userExisted.blocking = userExisted.blocking.filter(item => !item.equals(id)); 
            }

            const userUpdated =  await _userRepository.update(userExisted,data.userId);

            return {
                success:true,
                message:"Cập nhật người dùng thành công",
                statusCode:200,
                data:userUpdated
            }

        } catch (error) {
            
        }
    },

    blockAccount:async(data,id)=>{
        try {
            const userExisted = await _userRepository.get(id); 
            if(!userExisted){
                return {
                    success:false,
                    message:"Người dùng không tồn tại",
                    statusCode:400,
                    data:null
                }
            }
            
            const account = await _accountRepository.get(id);  
            if(userExisted.status !== -1 && account.status !== -1){
                userExisted.status = -1; 
                account.status = -1; 
            }else {
                userExisted.status = 1; 
                account.status = 1; 
            }
            await _accountRepository.update(account,account._id);                        
            const userUpdated =  await _userRepository.update(userExisted,id);
            return {
                success:true,
                message:"Cập nhật trạng thái tài khoản thành công",
                statusCode:200,
                data:userUpdated
            }

        } catch (error) {
            
        }
    },

    addFriend: async(data,id)=>{
        try {
            const userExisted = await _userRepository.get(id); 
            if(!userExisted){
                return {
                    success:false,
                    message:"Người dùng không tồn tại",
                    statusCode:404,
                    data:null
                }
            }

            const userUpdated =  await _userRepository.addFriend(data,id);
            const notificationCreated = await _notitficationRepository.create({
                notifiType:'ADD_FRIEND',
                content:`đã gửi cho bạn lời mời kết bạn`,
                fromUser:id,
                createdAt:moment().format(),
                user:data.userId
            })

            const {ioObject,socketObject,userOnline} = getSocketIo();

            if(ioObject && socketObject){  
                
                if(userOnline.has(data.userId)){
                    const socketId = userOnline.get(data.userId);
                    socketObject.join(socketId)
                    console.log(data.userId); 
                    console.log('socket receive',socketId)
                    ioObject.to(socketId).emit("notifi-add-friend-single-user",notificationCreated);               
                } 
            }
            return {
                success:true,
                message:"Cập nhật người dùng thành công",
                statusCode:200,
                data:userUpdated
            }
        } catch (error) {
            
            if(error instanceof mongoose.Error.ValidationError){  
                return {
                    success:false,
                    message:"Cập nhật dùng thất bại",
                    statusCode:400,
                    data:null,
                    errors:validateError(error)
                };
             }
      
            return {
                success:false,
                message:"Cập nhật dùng thất bại",
                statusCode:500,
                data:null,
                errors:error?.message
            };
        }
    },

    acceptAddFriend: async(data,id)=>{
        try {
            const userExisted = await _userRepository.get(id); 
            if(!userExisted){
                return {
                    success:false,
                    message:"Người dùng không tồn tại",
                    statusCode:404,
                    data:null
                }
            }

            const userUpdated =  await _userRepository.acceptAddFriend(data,id);

            const notificationCreated = await _notitficationRepository.create({
                notifiType:'ACCEPT_ADD_FRIEND',
                content:`đã chấp nhận lời mời mời kết bạn`,
                fromUser:data.userId,
                createdAt:moment().format(),
                user:id
            })

            const {ioObject,socketObject,userOnline} = getSocketIo();

            if(ioObject && socketObject){  
                
                if(userOnline.has(id)){
                    const socketId = userOnline.get(id);
                    socketObject.join(socketId)
                    ioObject.to(socketId).emit("notifi-accept-add-friend-single-user",notificationCreated);               
                } 
            }



            return {
                success:true,
                message:"Cập nhật người dùng thành công",
                statusCode:200,
                data:userUpdated
            }
        } catch (error) {
            
            if(error instanceof mongoose.Error.ValidationError){  
                return {
                    success:false,
                    message:"Cập nhật dùng thất bại",
                    statusCode:400,
                    data:null,
                    errors:validateError(error)
                };
             }
      
            return {
                success:false,
                message:"Cập nhật dùng thất bại",
                statusCode:500,
                data:null,
                errors:error?.message
            };
        }
    },

    unAddFriend: async(data,id)=>{
        try {
            const userExisted = await _userRepository.get(id); 
            if(!userExisted){
                return {
                    success:false,
                    message:"Người dùng không tồn tại",
                    statusCode:404,
                    data:null
                }
            }

            const userUpdated =  await _userRepository.unAddFriend(data,id);
            return {
                success:true,
                message:"Cập nhật người dùng thành công",
                statusCode:200,
                data:userUpdated
            }
        } catch (error) {
            
            if(error instanceof mongoose.Error.ValidationError){  
                return {
                    success:false,
                    message:"Cập nhật người dùng thất bại",
                    statusCode:400,
                    data:null,
                    errors:validateError(error)
                };
             }
      
            return {
                success:false,
                message:"Cập nhật người dùng thất bại",
                statusCode:500,
                data:null,
                errors:error?.message
            };
        }
    },

    userStat: async()=>{
        try {
            const {user,blockNumber} =  await _userRepository.userStat(); 
            const userList = await _userRepository.getAll();
            const count = userList.filter(item => {
                let date = item.createdAt.toISOString().split('T')[0].split('-')[2]; 
                let dateArr = item.createdAt.toISOString().split('T')[0].split('-'); 
                let dateCreate = parseInt(date) + 1;
                dateArr[2] = dateCreate; 
                dateArr = dateArr.join('-'); 
                const currentDate = moment().format().split('T')[0]; 
                
             
                if(dateArr === currentDate){
                    return item; 
                }
            });  
        
        
            return {
                success:true,
                message:"Thống kê người dùng thành công",
                statusCode:200,
                data:{user,blockNumber,registerToday:count.length}
            }
        } catch (error) {
            console.log(error)
            if(error instanceof mongoose.Error.ValidationError){  
                return {
                    success:false,
                    message:"Thống kê người dùng thất bại",
                    statusCode:400,
                    data:null,
                    errors:validateError(error)
                };
             }
      
            return {
                success:false,
                message:"Thống kê người dùng thất bại",
                statusCode:500,
                data:null,
                errors:error?.message
            };
        }
    },
    userDob: async(id)=>{
        try {
            const user =  await _userRepository.userDob(); 
            let friendList = user.filter(item =>{
                return item.friends.find(f => f.equals(id)) !== undefined; 
            }); 

            const data  =  await Promise.all(friendList.map(async item =>{
                const account = await _accountRepository.get(item._id); 
                const userName = account._doc.userName; 
                item.userName = userName; 
                return item; 
            }))

            return {
                success:true,
                message:"Lấy sinh nhật người dùng thành công",
                statusCode:200,
                data:data
            }
        } catch (error) {
            
            if(error instanceof mongoose.Error.ValidationError){  
                return {
                    success:false,
                    message:"Lấy sinh nhật người dùng thất bại",
                    statusCode:400,
                    data:null,
                    errors:validateError(error)
                };
             }
      
            return {
                success:false,
                message:"Lấy sinh nhật người dùng thất bại",
                statusCode:500,
                data:null,
                errors:error?.message
            };
        }
    },
}