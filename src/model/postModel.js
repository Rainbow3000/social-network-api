const mongoose = require('mongoose')

const postSchema = new mongoose.Schema(
  {
    content: {
      type:String,
      required:[function(){ return this.video?.trim().length === 0 && this.images.length === 0},"Nội dung bài viết phải được cung cấp"]
    },
    images:{
      type:[String],
      required:[function(){ return this.video?.trim().length === 0 && this.content.trim().length === 0},"Ảnh hoặc video phải được cung cấp"],
      validate: {
        validator: function(value) {
            for (var i = 0; i < value.length; i++) {
                if(value[i]?.trim().length === 0){
                   return false; 
                }
            }
            return true;
        },
        message: 'Ảnh không hợp lệ'
    }
    },
    video:{
      type:String,
      required:[function(){ return this.images.length === 0 && this.content.trim().length === 0},"Ảnh hoặc video phải được cung cấp"],
    },
    thumb:{
      type:String
    },
    user:{
      type:mongoose.Schema.Types.ObjectId,
      ref:"User", 
      required: true
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
    comment:{
      number:{
        type:Number,
        default:0
      },
      userCommented:{
        type:[mongoose.Schema.Types.ObjectId],
        ref:"User",
      }
    },
    denounce:{
      type:[
        {
          user:{
            type:mongoose.Schema.Types.ObjectId,
            ref:"User",
          },
          denounceContent:{
            type:[String],
          },
          denounceDate:{
            type:String
          }
        }
      ]
    },
    share:{
      number:{
        type:Number,
        default:0
      },
      userShared:{
        type:[{
              user:{
                type:mongoose.Schema.Types.ObjectId,
                ref:"User"
              },
              timeShare:{
                type:String
              }
        }
        ],   
       
      }
    },
    status: {
      type:Number,
      required:true,
      default:1,
    },
    createdDate:{
      type:String,
    },
    modifiedDate:{
      type:String
    }
  },{timestamps:true})


module.exports =  mongoose.model('Post', postSchema);


