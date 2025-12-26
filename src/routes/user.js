const express = require("express");
const userRouter = express.Router();
const { userAuth } = require("../middleware/auth");
const ConnectionRequest = require("../models/connectionRequest");
const User = require("../models/user");

const USER_SAFE_DATA = "firstName lastName photoUrl age skills gender about "

userRouter.get('/user/requests/received', userAuth, async(req, res)=>{
    try {
          const loggedInUser = req.user;

            const connectionRequest = await ConnectionRequest.find({
                toUserId: loggedInUser._id,
                status: "interested",
            }).populate(
                "fromUserId", 
                USER_SAFE_DATA
            );

            res.json ({
                message: "data fetch succussfully", data : connectionRequest,
            });
    } catch (error) {
        res.status(404).send("Error : " + error.message);
    };

});

userRouter.get('/user/connection', userAuth, async(req, res)=>{
    try {

        const loggedInUser = req.user; 

        const connectionRequest = await ConnectionRequest.find({
           $or: [
            {toUserId: loggedInUser._id, status:"accepted"},
            {fromUserId: loggedInUser._id, status: "accepted"}
           ]
        }).populate("fromUserId", USER_SAFE_DATA) 
          .populate("toUserId" , USER_SAFE_DATA);

          const data = connectionRequest.map((row)=> {
            if(row.fromUserId._id.toString() === loggedInUser._id.toString() ){
            return row.toUserId;
            }
             return row.fromUserId;
          })

        res.json({data });
    } catch (error) {
        res.status(400).send({message : error.message});
    }
})

userRouter.get('/feed', userAuth, async(req, res)=>{
    try {
        const loggedInUserId = req.user._id.toString();
 const page = parseInt(req.query.page) || 1;
 let limit = parseInt(req.query.limit) || 10;
 limit = limit > 50 ? 50 : limit;
 const skip = (page - 1) * limit;

    const connectionRequest = await ConnectionRequest.find({
        $or: [
            {fromUserId: loggedInUserId},
            {toUserId: loggedInUserId}
        ],
    }).select("fromUserId toUserId");

        const hideUsersfromFeed = new Set();
        connectionRequest.forEach((req) =>{
        hideUsersfromFeed.add(req.fromUserId.toString());
        hideUsersfromFeed.add(req.toUserId.toString());
 })
        hideUsersfromFeed.add(loggedInUserId);

        const users = await User.find({
         _id: { $nin: Array.from(hideUsersfromFeed) }
            
        })
        .select(USER_SAFE_DATA)
        .skip(skip)
        .limit(limit);

        res.json({data : users});
   

    
    } catch (error) {
      res.status(400).json({message : error.message}) 
    }
  
})
module.exports = userRouter;





