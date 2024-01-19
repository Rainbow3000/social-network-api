const Account = require('../model/accountModel'); 

module.exports = {
    get: async(id)=>{
        try {
            return await Account.findById(id); 
        } catch (error) {
            throw error;
        }
    },

    getAdmin:async()=>{
        return await Account.findOne({role:'ADMIN'}); 
    },
    getAll: async()=>{
        try {
            return await Account.find();
        } catch (error) {
            throw error;
        }
    },

    getByEmail: async(email)=>{
        try {
            return await Account.findOne({email:email})
        } catch (error) {
            throw error;
        }
    },

    create: async(data)=>{
        try {
            const account = new Account(data);
            return await account.save();  
        } catch (error) {
            throw error;
        }
    },

    update: async(data,id)=>{
   
        try {
            return await Account.findByIdAndUpdate({_id:id},data,{
                new:true
            });
        } catch (error) {
            throw error;
        }
    },
    delete: async(id)=>{
        try {
            await Account.findByIdAndDelete(id);
            return 1;
        } catch (error) {
            throw error;
        }
    },
}