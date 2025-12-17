
const jwt = require('jsonwebtoken')
const User = require("../models/user")


const userAuth = async (req, res , next) =>{
  try {
       
const cookies = req.cookies;

const {token} = cookies;
if(!token){
    throw new Error("token is not valid!!!!!1");
}

const decodedObj = await jwt.verify(token, 'kashish@1234cjc') ;

const {_id} = decodedObj;
const user = await User.findById(_id);
if(!user){
    throw new Error("user does not found");
}
req.user = user
next(); 
    } catch (error) {
        res.status(400).send("Error : " + error.message );
    }

};

module.exports = {
    userAuth
}


