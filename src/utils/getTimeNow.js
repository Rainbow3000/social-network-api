
const moment = require('moment'); 

const getTimeNow = ()=>{
   const date =  moment().format().split('T')[0].split("-").reverse().join('-'); 
   console.log(date);
   const time = moment().format().split('T')[1].split('+')[0]; 
   return `${time} / ${date}`
}

module.exports = getTimeNow; 