

const userOnline = new Map(); 
let socketObject = null;
let ioObject = null;  
let online = [] 
let callId = [] 
module.exports = {
    getSocketIo:()=>{
        return {ioObject,socketObject,userOnline};
    },
    getInstanceSocketIo :(io)=>{
        io.on('connection', async(socket) => {

            socket.on('user-connected',(data)=>{
                if(!userOnline.has(data)){
                    userOnline.set(data,socket.id); 
                    online.push(data); 
                }  
                socket.broadcast.emit('user-online',online)      
             
            })

            socket.on('user-end-call',(userEndCallId) =>{
                socket.broadcast.emit('end-call',userEndCallId)
            });


            socket.on('user-call-id',(data)=>{
                if(callId.length === 0){
                    callId.push(data); 
                }else {
                    if(callId.find(item => item.userId === data.userId) !== undefined){
                        callId = callId.filter(item => item.userId !== data.userId); 
                        callId.push(data); 
                    }else{
                        callId.push(data); 
                    }
                }
                socket.broadcast.emit('send-callId-to-client',callId)
              
            })

            socket.on('user-call',(data)=>{
                const {currentId,user} = data;
                const socketId = userOnline.get(currentId._id._id); 
                socket.join(socketId); 
                socket.broadcast.emit('user-calling',user); 
            })

            socket.on('disconnect', () => {     
                
               const keys = Array.from(userOnline.keys()); 
               let keyDisconnected = null; 
               
               keys.forEach(item =>{
                if(userOnline.get(item) === socket.id){
                    keyDisconnected = item; 
                }
               })
               online = online.filter(item => item !== keyDisconnected); 
               socket.broadcast.emit('user-online',online)
               userOnline.delete(keyDisconnected);              
            });
            
            socketObject = socket; 
            
        });

        ioObject = io;
      
    }
}




