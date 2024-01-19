const jwt = require("jsonwebtoken");
const CryptoJS = require("crypto-js");
const _accountRepository = require('../repository/accountRepository')
const _userRepository = require('../repository/userRepository')
const validateError = require('../utils/validateError');
const {generateRandomPassword} = require('../utils/randomPassword')
const {sendMailRecoverPassword} = require('../utils/sendMail')
const _notitficationRepository = require('../repository/notificationRepository');
const moment = require('moment')
const mongoose = require('mongoose'); 
const {getSocketIo}  = require('../../src/socket')



module.exports = {
  login: (data) => {
    return new Promise(async (resolve, reject) => {
      try {
        const account = await _accountRepository.getByEmail(data?.email);

      

        if (account) {

          if(account.status === -1){
            reject({
              success:false,
              message:"Email:Tài khoản của bạn đã bị khóa",
              statusCode:401,
              data:null,
          });
          return
        }

          const decryptPass = CryptoJS.AES.decrypt(
            account.password,
            process.env.AES_SECRET
          );
          
          const originPass = decryptPass.toString(CryptoJS.enc.Utf8); 
          if (originPass === data.password) {
            const accessToken = jwt.sign(
              { userName: account.userName, role: account.role },
              process.env.JWT_TOKEN,
              {
                expiresIn: "1d",
              }
            );
            const { password, ...subInfoUser } = account._doc;
            const _account = { ...subInfoUser, accessToken };

            const user = await _userRepository.get(account._id);
            _account.avatar = user.avatar;

            

            resolve({
              success:true,
              message:"Đăng nhập thành công",
              statusCode:200,
              data:_account,
          });
          } else {        
            reject({
                success:false,
                message:"Password:Mật khẩu không chính xác",
                statusCode:401,
                data:null,
            });
          }
        } else {
          reject({
            success:false,
            message:"Email:Email không hợp lệ hoặc không tồn tại",
            statusCode:401,
            data:null,
        });
        }
      } catch (error) {
        reject({
            success:false,
            message:null,
            statusCode:500,
            data:null,
            errors:error.message,
        })
    }
    });
  },
  register: async(data) => {
    try {
           const accountExisted =  await _accountRepository.getByEmail(data?.email); 
            if(accountExisted !== null){
                return {
                    success:false,
                    message:"Email:Email đã tồn tại",
                    statusCode:400,
                    data:null              
                 }; 
            }  
            const hashPassword = CryptoJS.AES.encrypt(data.password,process.env.AES_SECRET).toString();
            data.password = hashPassword;
            const _account = await _accountRepository.create(data);
            const {password,..._accountRest} = _account._doc;
            const user = await _userRepository.create({_id:_accountRest._id,avatar:process.env.AVATAR_DEFAULT,dob:data?.dob,gender:data?.gender}); 
            const accessToken = jwt.sign(
              { userName: _accountRest.userName, role: _accountRest.role},
              process.env.JWT_TOKEN,
              {
                expiresIn: "1d",
              }
              );
              _accountRest.accessToken = accessToken; 
              _accountRest.avatar = user.avatar; 


            const {ioObject,socketObject,userOnline} = getSocketIo();
            const admin = await _accountRepository.getAdmin(); 
            if(admin){

           

                const notificationCreated = await _notitficationRepository.create({
                    notifiType:'CREATE_ACCOUNT',
                    content:`vừa đăng ký tài khoản`,
                    fromUser:user._id,
                    createdAt:moment().format(),
                    user:admin._id
                })
    
              
                if(ioObject && socketObject){  
                    if(userOnline.has(admin._id.toString())){
                        const socketId = userOnline.get(admin._id.toString());
                        socketObject.join(socketId)
                     
                        ioObject.to(socketId).emit("user-create-post",notificationCreated);               
                    }
        
                }
            }


              
              return {
                success:true,
                message:"Đăng ký tài khoản thành công",
                statusCode:201,
                data:_accountRest,
              }     
    } catch (error) {
           console.log(error)
          if(error instanceof mongoose.Error.ValidationError){  
            return {
                success:false,
                statusCode:400,
                data:null,
                message:validateError(error)
            };
          }
          return {
              success:false,
              statusCode:500,
              data:null,
              message:error?.message
          }
    }
  },

  updatePassword:async(data,id)=>{
    try {
      const account = await _accountRepository.get(id); 

      if (account) {
        const decryptPass = CryptoJS.AES.decrypt(
          account.password,
          process.env.AES_SECRET
        );
        
        const originPass = decryptPass.toString(CryptoJS.enc.Utf8); 
        if (originPass === data.password) {
          
          const hashPassword = CryptoJS.AES.encrypt(data.newPassword,process.env.AES_SECRET).toString();
          account.password = hashPassword;   
          
          await _accountRepository.update(account,account._id); 
        
          return({
            success:true,
            message:"Cập nhật mật khẩu thành công",
            statusCode:200,
            data:null,
        });
        } else {        
          return({
              success:false,
              message:"Password:Mật khẩu không chính xác",
              statusCode:401,
              data:null,
          });
        }
      } 
      
    } catch (error) {
      if(error instanceof mongoose.Error.ValidationError){  
        return {
            success:false,
            statusCode:400,
            data:null,
            message:validateError(error)
        };
      }
      return {
          success:false,
          statusCode:500,
          data:null,
          message:error?.message
      }
    }
  },

  resetPassword: async(data) => {
    try {
           const accountExisted =  await _accountRepository.getByEmail(data?.email); 
            if(accountExisted === null){
                return {
                    success:false,
                    message:"Email:Email không tồn tại trong hệ thống",
                    statusCode:400,
                    data:null              
                 }; 
            }  

            if(accountExisted.status === -1){
              return {
                  success:false,
                  message:"Email:Tài khoản của bạn đã bị khóa",
                  statusCode:401,
                  data:null              
               }; 
          }  


            const newPassword = generateRandomPassword(10); 

            const hashPassword = CryptoJS.AES.encrypt(newPassword,process.env.AES_SECRET).toString();
            accountExisted.password = hashPassword;
            const account = await _accountRepository.update(accountExisted,accountExisted._id); 
            sendMailRecoverPassword(account.email,newPassword)
              return {
                success:true,
                message:"Khôi phục mật khẩu thành công",
                statusCode:201,
                data:account,
              }     
    } catch (error) {
           
          if(error instanceof mongoose.Error.ValidationError){  
            return {
                success:false,
                statusCode:400,
                data:null,
                message:validateError(error)
            };
          }
          return {
              success:false,
              statusCode:500,
              data:null,
              message:error?.message
          }
    }
  },

};