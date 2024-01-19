const Chat = require('../model/chatModel'); 
module.exports = {
    get: async(id)=>{
        try {
            return await Chat.findById(id)
        } catch (error) {
            throw error;
        }
    },

    getByUser: async(id,otherId)=>{
        try {
            return await Chat.find( { $or: [{from:id,to:otherId}, {from:otherId,to:id}] })
            .populate(
                {
                    path:'from',
                    populate: { path: '_id' }
                },
            ).populate(
                {
                    path:'to',
                    populate:{
                        path:'_id',                   
                    }
                    
                }
            );
        } catch (error) {
            throw error;
        }
    },

    getOneByUser: async(id,otherId)=>{
        try {
            return await Chat.find( { $or: [{from:id,to:otherId}, {from:otherId,to:id}] }).sort({"createdDate": -1}).limit(1)
            .populate(
                {
                    path:'from',
                    populate: { path: '_id' }
                },
            ).populate(
                {
                    path:'to',
                    populate:{
                        path:'_id',                   
                    }
                    
                }
            );
        } catch (error) {
            throw error;
        }
    },

    getAll: async()=>{
        try {
            return await Chat.find().populate({
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
            const chat = new Chat(data);
            const chatCreated =  await chat.save(); 
            return await Chat.findById({_id:chatCreated._id}).populate(
                {
                    path:'from',
                    populate: { path: '_id' }
                },
            ).populate(
                {
                    path:'to',
                    populate:{
                        path:'_id',                   
                    }
                    
                }
            );
        } catch (error) {
            console.log(error);
            throw error;
        }
    },

    update: async(chatId,data)=>{
        try {
            return await Chat.findByIdAndUpdate({_id:chatId},data,{
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
            await Chat.findByIdAndDelete(id);
            return 1;
        } catch (error) {
            throw error;
        }
    },

    deleteMany: async(id)=>{
        try {
            await Chat.deleteMany({
                $or:[
                    {from:id},
                    {to:id}
                ]
            });
            return 1;
        } catch (error) {
            throw error;
        }
    },
}