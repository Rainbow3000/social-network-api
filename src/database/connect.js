const mongoose = require('mongoose'); 


const connectDb = ()=>{
    try {
        mongoose.connect(process.env.DB_URL).then(()=> console.log('Database is connected !')) 
    } catch (error) {
        console.log('Database connect error:',error)
    }
}

module.exports = connectDb; 