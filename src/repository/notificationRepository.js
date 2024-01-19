const Notification = require('../model/notificationModel'); 
module.exports = {
    get: async(id)=>{
        try {
            return await Notification.findById(id)
        } catch (error) {
            throw error;
        }
    },

    getByPost: async(id)=>{
        try {
            return await Notification.find({post:id}).limit(10).populate(
                {
                    path:'user',
                    populate: { path: '_id' }
                },
            )
        } catch (error) {
            throw error;
        }
    },

    getByUserId: async(id)=>{
        try {
            return await Notification.find({user:id}).limit(20).sort({createdAt:-1}).populate(
                {
                    path:'fromUser',
                    populate: { path: '_id' }
                },
            )
        } catch (error) {
            throw error;
        }
    },
    getAll: async()=>{
        try {
            return await Notification.find().populate({
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
            const notification = new Notification(data);
            const notificationCreated =  await notification.save();
            return notificationCreated.populate(
                {
                    path:'fromUser',
                    populate: { path: '_id' }
                },
            );
        } catch (error) {
            console.log(error);
            throw error;
        }
    },

    update: async(commentId,data)=>{
        try {
            return await Notification.findByIdAndUpdate({_id:commentId},data,{
                new:true
            }).populate({
                path: 'user',
                populate: {
                    path:'_id',
                    select:'userName'
                }
              }).populate(
                {
                    path:'fromUser',
                    populate: { path: '_id' }
                },
            );
            
        } catch (error) {
            throw error;
        }
    },
    delete: async(id)=>{
        try {
            await Notification.findByIdAndDelete(id);
            return 1;
        } catch (error) {
            throw error;
        }
    },

    deleteMany: async(id)=>{
        try {
            await Notification.deleteMany({$or:[
                {
                    user:id
                },
                {
                    fromUser:id
                }
        ]});
            return 1;
        } catch (error) {
            throw error;
        }
    },
}