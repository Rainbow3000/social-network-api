
const getMongooseErrors = (errorObject)=>{
    const errorData = []; 
    const {errors} = errorObject; 
    const keysError = Object.keys(errors); 
    for(let key of keysError){
        const errorItem = errors[key]?.properties; 
        errorData.push(errorItem);
    }
    return errorData; 
}

module.exports = getMongooseErrors; 