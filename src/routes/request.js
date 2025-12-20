const express = require("express");
const requestRouter = express.Router();
const ConnectionRequest = require("../models/connectionRequest") 
const {userAuth} = require('../middleware/auth');
const User = require("../models/user");

requestRouter.post('/request/send/:status/:toUserId',userAuth, async (req, res)=>{
try {
const fromUserId = req.user._id;
const toUserId = req.params.toUserId;
const status = req.params.status;

const allowedStatus = ["interested", "ignored"];
if(!allowedStatus.includes(status)){
    throw new Error("Invalid Status")
}

const toUser = await User.findById(toUserId);
if(!toUser){
return res.status(404).json({ message: "User not found" })
}
const existingConnectionRequest = await ConnectionRequest.findOne({
    $or : [
       {fromUserId, toUserId} ,
       {fromUserId : toUserId, toUserId : fromUserId},
    ],
});
if(existingConnectionRequest){
   return res.status(400).send({message: "Connection Request Already Exists!!!"})
}

const connectionRequest = new ConnectionRequest({
    fromUserId,
    toUserId,
    status
})
const data = await connectionRequest.save();

res.json({
    message : 
   req.user.firstName + " is " + status + " in " + toUser.firstName,
    data,
})

} catch (error) {
    res.status(400).json({ error: error.message })
}
})  

requestRouter.post('/request/review/:status/:requestId', userAuth, async(req, res)=>{
    try {
      const loggedInUser = req.user;
const {status, requestId } = req.params;

const allowedStatus = ["rejected", "accepted"];
if(!allowedStatus.includes(status)){
    throw new Error("Status is not valited")
}

const connectionRequest = await ConnectionRequest.findOne({
    _id: requestId,
    toUserId: loggedInUser._id,
    status: "interested"
});
if(!connectionRequest){
    return res
    .status(404)
    .json({message : "Connection request not found"})
}  

connectionRequest.status = status;

const data = await connectionRequest.save();

res.json({message : "Connection request " + status, data});


    } catch (error) {
      res.status(400).send("Error: " + error.message);
    }


})
module.exports = requestRouter ; 