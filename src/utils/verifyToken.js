const jwt = require('jsonwebtoken'); 

const verifyToken = (req,res,next)=>{
    const authHeader  = req.headers; 
    if(authHeader){
        const token = authHeader.authorization.split(" ")[1]; 
        jwt.verify(token, process.env.JWT_TOKEN,(err,user)=>{
            if(err){
                res.status(500).json({
                    success:false,
                    message:"Token không hợp lệ",
                    statusCode:401,
                    data:null          
                }); 
            }
            req.user = user; 
        
            next(); 
        })
    }else{
        res.status(401).json({
            success:false,
            message:"Tài khoản không được xác thực",
            statusCode:401,
            data:null     
        });
    }
}


 const verifyTokenAndAuthorization = (req,res,next)=>{
    verifyToken(req,res,()=>{
        if(req.user.role ==='USER' || req.user.role ==='ADMIN'){
            next(); 
        }else{
            res.status(403).json({
                success:false,
                message:"Tài khoản không có quyền",
                statusCode:401,
                data:null 
            });
        }
    })
}


 const verifyTokenAndAdmin  = (req,res,next)=>{
    verifyToken(req,res,()=>{
        if(req.user.role === 'ADMIN'){
            next(); 
        }else{
            res.status(403).json({
                success:false,
                message:"Tài khoản không có quyền",
                statusCode:401,
                data:null 
            }); 
        }
    })
}

module.exports ={verifyToken,verifyTokenAndAdmin,verifyTokenAndAuthorization}