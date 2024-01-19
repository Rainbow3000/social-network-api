const mongoose = require('mongoose')

const commentSchema = new mongoose.Schema(
  {
    content: {
      type:String,
      required:[function(){ return this.video?.trim().length === 0 && this.image?.trim().length === 0},"Nội dung bình luận không được bỏ trống"],
    },
    image:{
      type:String
    },
    video:{
      type:String
    },
    parentName:{
      type:String
    },
    level:{
      type:Number,
      default:0
    },
    like:{
      number:{
        type:Number,
        default:0
      },
      userLiked:{
        type:[mongoose.Schema.Types.ObjectId],
        ref:"User",
      }
    },
    parent:{
      type:mongoose.Schema.Types.ObjectId,
      ref:"Comment"
    },
    children:{
      type:[mongoose.Schema.Types.ObjectId],
      ref:'Comment'
    },
    user:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"User", 
        required: true
    },
    post:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"Post", 
        required: true
    },
    
    createdDate:{
        type:String,
    },

    modifiedDate:{
    type:String
    }

  },{timestamps:true})


module.exports =  mongoose.model('Comment', commentSchema);


