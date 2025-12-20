const express = require('express');
const profileRouter = express.Router();
const bcrypt  = require("bcrypt") ; 
const {userAuth} = require("../middleware/auth");
const { validateEditProfileData } = require('../utils/validation');
const authRouter = require('./auth');

profileRouter.get('/profile/view', userAuth, async  (req, res) =>{
    try {
    const user = req.user;

    res.send(user);
    } catch (error) {
       res.status(400).send("Error : " + error.message);
    }
  
})

profileRouter.patch('/profile/edit', userAuth ,async (req, res)=>{
    try {
         if(!validateEditProfileData(req)) {
            throw new Error("Invalid Edit Requiest")
         }

         const loggeedInUser = req.user;

         Object.keys(req.body).forEach((key) => (loggeedInUser[key] = req.body[key]));
         await loggeedInUser.save();
       res.json({message : `${loggeedInUser.firstName}, your profile updated successfuly`, data: loggeedInUser})

    } catch (error) {
        res.status(400).send("Error : " + error.message)
    }
  
})

profileRouter.post("/profile/password", userAuth , async (req, res) => {
    try{
        const loggedInUser = req.user ; 
        const {password} = req ; 
        const isSame = bcrypt.compare(password,loggedInUser.password)
        if(isSame){
            throw new Error("Please use different password !!!")
        }
        if(!validator.isStrongPassword(password)){
            throw new Error("Weak Password !!!")
        }
        const hashPassword = bcrypt.hash(password,10);
        loggedInUser.password  = hashPassword ; 


        await loggedInUser.save();
        res.send("User password updated Successfully !!!")
        
    }
    catch(error){
        res.status(400).send("Error : " + error.message)
    }
});




module.exports = profileRouter;
