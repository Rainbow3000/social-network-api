const Post = require('../model/postModel'); 

module.exports = {
    get: async(id)=>{
        try {
            return await Post.findById(id).populate({
                path: 'user',
                populate: {
                    path:'_id',
                    select:'userName _id'
                }
              }); 
        } catch (error) {
            throw error;
        }
    },

    getByUser: async(id)=>{
        try {
            let postShare = await Post.find({$and:[{'share.userShared.user':id},{status:1}]}).populate({
                path: 'user',
                populate: {
                    path:'_id',
                    select:'userName'
                }
              }).populate({
                path:'share.userShared.user',
                populate: {
                    path:'_id',
                    select:'userName'
                }
              }).populate(
                {
                    path: 'like.userLiked',
                    populate: {
                            path:'_id',
                            select:'userName email'
                    }
                },
              )

              const postList =  await Post.find({ $and:[{status:1,user:id}]}).populate({
                  path: 'user',
                  populate: {
                      path:'_id',
                      select:'userName'
                  }
                }).populate(
                    {
                        path: 'like.userLiked',
                        populate: {
                                path:'_id',
                                select:'userName email'
                        }
                    },
                  ); 

                      
            return {postShare,postList}
        } catch (error) {
            throw error;
        }
    },
    getAll: async()=>{
        try {
            return await Post.find({status:1}).sort({createdAt:1}).populate(
                {
                    path: 'user',
                    populate: {
                        path:'_id',
                        select:'userName email'
                    }
                },
              ).populate(
                {
                    path: 'denounce.user',
                    populate: {
                        path:'_id',
                        select:'userName email'
                    }
                },
              ).populate(
                {
                    path: 'like.userLiked',
                    populate: {
                            path:'_id',
                            select:'userName email'
                    }
                },
              )
        } catch (error) {
           throw error; 
        }
    },
    getByAdmin: async()=>{
        try {
            return await Post.find().sort({createdAt:1}).populate(
                {
                    path: 'user',
                    populate: {
                        path:'_id',
                        select:'userName email'
                    }
                },
              ).populate(
                {
                    path: 'denounce.user',
                    populate: {
                        path:'_id',
                        select:'userName email'
                    }
                },
              ).populate(
                {
                    path: 'like.userLiked',
                    populate: {
                            path:'_id',
                            select:'userName email'
                    }
                },
              )
        } catch (error) {
           throw error; 
        }
    },

    getByAdminCreated: async(adminId)=>{
        try {
            return await Post.find({user:adminId}).sort({createdAt:1}).populate(
                {
                    path: 'user',
                    populate: {
                        path:'_id',
                        select:'userName email'
                    }
                },
              ).populate(
                {
                    path: 'denounce.user',
                    populate: {
                        path:'_id',
                        select:'userName email'
                    }
                },
              ).populate(
                {
                    path: 'like.userLiked',
                    populate: {
                            path:'_id',
                            select:'userName email'
                    }
                },
              )
        } catch (error) {
           throw error; 
        }
    },
  
    create: async(data)=>{
        try {
            const post = new Post(data);
            return (await post.save()).populate({
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

    update: async(postId,data)=>{
        try {
            return await Post.findByIdAndUpdate({_id:postId},data,{
                new:true
            }).populate({
                path: 'user',
                populate: {
                    path:'_id',
                    select:'userName'
                }
              }).populate({
                path:'share.userShared.user',
                populate: {
                    path:'_id',
                    select:'userName'
                }
              }).populate(
                {
                    path: 'like.userLiked',
                    populate: {
                            path:'_id',
                            select:'userName email'
                    }
                },
              ).populate(
                {
                    path: 'comment.userCommented',
                    populate: {
                            path:'_id',
                            select:'userName email'
                    }
                },
              )
            
        } catch (error) {
            throw error;
        }
    },
    delete: async(id)=>{
        try {
            await Post.findByIdAndDelete(id);
            return 1;
        } catch (error) {
            throw error;
        }
    },
    deleteMany: async(id)=>{
        try {
            await Post.deleteMany({user:id});
            return 1;
        } catch (error) {
            throw error;
        }
    },

    postStat:async()=>{
        try {
            const date = new Date();
            const currentMonth = new Date(date.setMonth(date.getMonth() + 1));
            const post = await Post.aggregate([
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
            return post
        } catch (error) {
          
        }
}
}