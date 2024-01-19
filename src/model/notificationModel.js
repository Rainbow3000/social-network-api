const mongoose = require('mongoose')
const notificationSchema = new mongoose.Schema(
  {
    notifiType:{
      type:String,
      required:true
    },
    isReaded:{
      type:Boolean,
      default:false
    },
    user:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'User',
        required:true
    },
    fromUser:{
      type:mongoose.Schema.Types.ObjectId,
      ref:'User',
      required:true
    },
    content:{
        type:String
    },
    status: {
      type:Number,
      required:true,
      default:1,
    },
    createdAt:{
      type:String,
      required:true
    }

  },{timestamps:true})


module.exports =  mongoose.model('Notification', notificationSchema);


