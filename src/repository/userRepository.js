const User = require('../model/userModel'); 
const moment = require('moment')
const mongoose = require('mongoose')
module.exports = {

    getBlockingUser:async(id)=>{
        try {
            return await User.findById(id).populate(
                {
                    path:'_id',
                    select:'-password',
                },
            ).populate({
                path:'blocking',
                populate:{
                    path:'_id',
                    select:'-password',
                }
            })
        } catch (error) {
            
        }
    },


    get: async(id)=>{
        try {
            return await User.findById(id).populate(
                {
                    path:'_id',
                    select:'-password',
                },
            ).populate({
                path:'friends',
                select:'-requestAddFriend -requestAddFriendFromUser -friends -blocking -followers -followings -createdAt -updatedAt -status',
                populate:{
                    path:'_id',
                    select:'-password -email -role -status -createdAt -updatedAt'
                }
            }).
            populate({
                path:'chats',
                select:'-requestAddFriend -requestAddFriendFromUser -friends -blocking -followers -followings -createdAt -updatedAt -status',
                populate:{
                    path:'_id',
                    select:'-password -email -role -status -createdAt -updatedAt'
                }
            }).populate({
                path:'requestAddFriendFromUser',
                select:'-requestAddFriend -requestAddFriendFromUser -friends -blocking -followers -followings -createdAt -updatedAt -status',
                populate:{
                    path:'_id',
                    select:'-password -email -role -status -createdAt -updatedAt'
                }
            })
            .populate({
                path:'requestAddFriend',
                select:'-requestAddFriend -requestAddFriendFromUser -friends -blocking -followers -followings -createdAt -updatedAt -status',
                populate:{
                    path:'_id',
                    select:'-password -email -role -status -createdAt -updatedAt'
                }
            })
        } catch (error) {
            throw error;
        }
    },
    getAll: async()=>{
        try {
            return await User.find().sort({createdAt:-1}).populate(
                {
                    path:'_id',
                    select:'-password',
                    
                },
            ).populate({
                path:'friends',
                select:'-requestAddFriend -requestAddFriendFromUser -friends -blocking -followers -followings -createdAt -updatedAt -status',
                populate:{
                    path:'_id',
                    select:'-password -email -role -status -createdAt -updatedAt'
                }
            }).
            populate({
                path:'chats',
                select:'-requestAddFriend -requestAddFriendFromUser -friends -blocking -followers -followings -createdAt -updatedAt -status',
                populate:{
                    path:'_id',
                    select:'-password -email -role -status -createdAt -updatedAt '
                }
            }).select('-requestAddFriend -requestAddFriendFromUser -blocking -chats -friends -followings -followers ');
        } catch (error) {
            throw error;
        }
    },




    create: async(data)=>{
        try {
            const user = new User(data);
            return await user.save();  
        } catch (error) {
            throw error;
        }
    },

    update: async(data,id)=>{
        try {
            const user =  await User.findByIdAndUpdate({_id:mongoose.Types.ObjectId(id)},data,{
                new:true
            })

            return await User.findById(user._id).populate(
                {
                    path:'_id',
                    select:'-password',
                },
            ).populate({
                path:'friends',
                select:'-requestAddFriend -requestAddFriendFromUser -friends -blocking -followers -followings -createdAt -updatedAt -status',
                populate:{
                    path:'_id',
                    select:'-password -email -role -status -createdAt -updatedAt'
                }
            }).
            populate({
                path:'chats',
                select:'-requestAddFriend -requestAddFriendFromUser -friends -blocking -followers -followings -createdAt -updatedAt -status',
                populate:{
                    path:'_id',
                    select:'-password -email -role -status -createdAt -updatedAt'
                }
            })
            
            
        } catch (error) {
            throw error;
        }
    },

   
    addFriend: async(data,id)=>{
        try {
            const userSendRequest = await User.findById({_id:id});
            if(userSendRequest){
                const requestExisted =  userSendRequest.requestAddFriend.find(item => item.equals(data.userId));
                if(requestExisted === undefined){         
                        userSendRequest.requestAddFriend.push(data.userId);              
                }
            }

            const requestAddFriendUpdated =  await User.findByIdAndUpdate({_id:id},userSendRequest,{
                new:true
            });


            const userReceiveRequest  = await User.findById({_id:data.userId}); 

            if(userReceiveRequest){
                const requestExisted = userReceiveRequest.requestAddFriendFromUser.find(item => item.equals(id));
                if(requestExisted === undefined){                  
                    userReceiveRequest.requestAddFriendFromUser.push(id)             
                }
            }


            const requestAddFriendFromUserUpdated =  await User.findByIdAndUpdate({_id:data.userId},userReceiveRequest,{
                new:true
            }).populate({
                path:'requestAddFriendFromUser',
                select:'-requestAddFriend -requestAddFriendFromUser -friends -blocking -followers -followings -createdAt -updatedAt -status',
                populate:{
                    path:'_id',
                    select:'-password -email -role -status -createdAt -updatedAt'
                }
            })
            .populate({
                path:'requestAddFriend',
                select:'-requestAddFriend -requestAddFriendFromUser -friends -blocking -followers -followings -createdAt -updatedAt -status',
                populate:{
                    path:'_id',
                    select:'-password -email -role -status -createdAt -updatedAt'
                }
            });



           return requestAddFriendFromUserUpdated.requestAddFriendFromUser;
            
        } catch (error) {
            throw error;
        }
    },
   

    acceptAddFriend: async(data,id)=>{
        try {
            const userSendRequest = await User.findById({_id:id});
            if(userSendRequest){
                const requestExisted = userSendRequest.requestAddFriend.find(item => item.equals(data.userId));
                if(requestExisted !== undefined){         
                    userSendRequest.requestAddFriend =  userSendRequest.requestAddFriend.filter(item => !item.equals(data.userId));              
                }

                const findFriendExisted = userSendRequest.friends.find(item => !item.equals(data.userId)); 
                if(findFriendExisted === undefined){
                    userSendRequest.friends.push(data.userId);
                }
            }

            const requestAddFriendUpdated =  await User.findByIdAndUpdate({_id:id},userSendRequest,{
                new:true
            }).populate({
                path:'friends',
                select:'-requestAddFriend -requestAddFriendFromUser -friends -blocking -followers -followings -createdAt -updatedAt -status',
                populate:{
                    path:'_id',
                    select:'-password -email -role -status -createdAt -updatedAt'
                }
            }).populate({
                path:'requestAddFriendFromUser',
                select:'-requestAddFriend -requestAddFriendFromUser -friends -blocking -followers -followings -createdAt -updatedAt -status',
                populate:{
                    path:'_id',
                    select:'-password -email -role -status -createdAt -updatedAt'
                }
            })
            .populate({
                path:'requestAddFriend',
                select:'-requestAddFriend -requestAddFriendFromUser -friends -blocking -followers -followings -createdAt -updatedAt -status',
                populate:{
                    path:'_id',
                    select:'-password -email -role -status -createdAt -updatedAt'
                }
            });

    
            const userReceiveRequest  = await User.findById({_id:data.userId}); 

            if(userReceiveRequest){
                const requestExisted =  userReceiveRequest.requestAddFriendFromUser.find(item => item.equals(id));
                if(requestExisted !== undefined){                  
                    userReceiveRequest.requestAddFriendFromUser = userReceiveRequest.requestAddFriendFromUser.filter(item => !item .equals(id));              
                }

                const findFriendExisted = userReceiveRequest.friends.find(item => item.equals(id)); 
                if(findFriendExisted === undefined){
                    userReceiveRequest.friends.push(id);
                }
            }


            const requestAddFriendFromUserUpdated =  await User.findByIdAndUpdate({_id:data.userId},userReceiveRequest,{
                new:true
            });



           return  {
                requestAddFriend:requestAddFriendUpdated.requestAddFriend,
                friends:requestAddFriendUpdated.friends
           };
            
        } catch (error) {
            throw error;
        }
    },


    unAddFriend: async(data,id)=>{
        try {
            const userSendRequest = await User.findById({_id:id});
            if(userSendRequest){      
                    userSendRequest.requestAddFriend = userSendRequest.requestAddFriend.filter(item => !item.equals(data.userId));                  
                }

            userSendRequest.friends = userSendRequest.friends.filter(item => !item.equals(data.userId))
            const requestAddFriendUpdated =  await User.findByIdAndUpdate({_id:id},userSendRequest,{
                new:true
            });

            const userRecieveRequest = await User.findById({_id:data.userId}).populate({
                path:'requestAddFriendFromUser',
                select:'-requestAddFriend -requestAddFriendFromUser -friends -blocking -followers -followings -createdAt -updatedAt -status',
                populate:{
                    path:'_id',
                    select:'-password -email -role -status -createdAt -updatedAt'
                }
            })
            .populate({
                path:'requestAddFriend',
                select:'-requestAddFriend -requestAddFriendFromUser -friends -blocking -followers -followings -createdAt -updatedAt -status',
                populate:{
                    path:'_id',
                    select:'-password -email -role -status -createdAt -updatedAt'
                }
            }); 
            if(userRecieveRequest){              
                userRecieveRequest.requestAddFriendFromUser = userRecieveRequest.requestAddFriendFromUser.filter(item => !item.equals(id));               
            }
            userRecieveRequest.friends = userRecieveRequest.friends.filter(item => !item.equals(id))

            const requestAddFriendFromUserUpdated = await User.findByIdAndUpdate({_id:data.userId},userRecieveRequest,{
                new:true
            }).populate({
                path:'requestAddFriendFromUser',
                select:'-requestAddFriend -requestAddFriendFromUser -friends -blocking -followers -followings -createdAt -updatedAt -status',
                populate:{
                    path:'_id',
                    select:'-password -email -role -status -createdAt -updatedAt'
                }
            })
            .populate({
                path:'requestAddFriend',
                select:'-requestAddFriend -requestAddFriendFromUser -friends -blocking -followers -followings -createdAt -updatedAt -status',
                populate:{
                    path:'_id',
                    select:'-password -email -role -status -createdAt -updatedAt'
                }
            });


            if(data.type !== undefined && data.type === 2){
                return {
                    type:2,
                    requestAddFriend:requestAddFriendUpdated.requestAddFriendFromUser,
                    friends:requestAddFriendUpdated.friends
                }
            }
            return {
                requestAddFriendFromUser:requestAddFriendFromUserUpdated.requestAddFriendFromUser,
                friends:requestAddFriendFromUserUpdated.friends
            }
            
        } catch (error) {
            throw error;
        }
    },
    delete: async(id)=>{
        try {
            await User.findByIdAndDelete(id);
            return 1;
        } catch (error) {
            throw error;
        }
    },

    userStat:async()=>{
            try {
                const date = new Date();
                const currentMonth = new Date(date.setMonth(date.getMonth() + 1));

                const user = await User.aggregate([
                    {
                        $match:{
                            createdAt: { $lte: currentMonth }
                        }
                    },
                    {
                        $project:{
                            month:{$month:"$createdAt"},
                            year:{$year:"$createdAt"},
                        }
                    }, 
                    {
                        $group:{
                            _id: { year: '$year', month: '$month' },
                            quantity:{$count:{}},
                        }
                    },
                    {
                        $sort:{_id:1}
                    }
                ])
                
                const userList = await User.find({status: - 1}); 
                return {user,blockNumber:userList.length}
            } catch (error) {
              
            }
    },
    userDob:async()=>{
        try {
       
            const currentMonth = moment().format();  
            
            const getFullDate = currentMonth.toString().split('T')[0]

           
            const user = await User.aggregate([            
                {
                    $match:{
                        dob: { $eq: getFullDate }
                    }
                },
                {
                    $project:{
                        avatar:1,   
                        friends:1                    
                    }
                }, 
               
                {
                    $sort:{_id:1}
                }
            ])
            return user
        } catch (error) {
            console.log(error); 
        }
}
}