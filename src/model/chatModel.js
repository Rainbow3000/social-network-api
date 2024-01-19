const mongoose = require('mongoose')

const chatSchema = new mongoose.Schema(
  {
    content: {
      type:String,
      required:[function(){ return this.video?.trim().length === 0 && this.image?.trim().length === 0 && this.file?.trim().length === 0},"Nội dung tin nhắn không được bỏ trống"],
    },
    image:{
      type:String
    },
    video:{
      type:String
    },
    file:{
        type:String
    }
    ,
    from:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"User",
        required:[true,'Người dùng không hợp lệ hoặc không tồn tại']
    },

    to:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"User",
        required:[true,'Người dùng không hợp lệ hoặc không tồn tại']
    },    
    createdDate:{
        type:String,
    },

    isReaded:{
        type:Number,
        default:0
    },

    status:{
        type:Number,
        default:1
    }
  },{timestamps:true})


module.exports =  mongoose.model('Chat', chatSchema);


