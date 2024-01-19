const env = require('dotenv'); 
env.config(); 
const express = require('express'); 
const { Server } = require('socket.io');
const app = express(); 
var server = require("http").Server(app);
const cors = require('cors'); 
const PORT = process.env.PORT || 5000
const connectDatabase = require('./src/database/connect');
app.use(express.json());
app.use(cors()); 
connectDatabase(); 
const io = new Server(server, {
    cors: {
        origin: "*",
        methods: ["GET", "POST"],
        transports: ['websocket', 'polling'],
        credentials: true
    }
});

const {getInstanceSocketIo} = require('./src/socket')
getInstanceSocketIo(io);

const postRouter = require('./src/router/postRouter'); 
const authRouter = require('./src/router/accountRouter'); 
const commentRouter = require('./src/router/commentRouter');
const userRouter = require('./src/router/userRouter');
const notificationRouter = require('./src/router/notificationRouter'); 
const chatRouter = require('./src/router/chatRouter')

app.use(postRouter); 
app.use(authRouter); 
app.use(commentRouter); 
app.use(userRouter); 
app.use(notificationRouter)
app.use(chatRouter);


server.listen(PORT,()=>console.log(`server is runing at http://localhost:${PORT}`))
