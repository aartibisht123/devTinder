
const mongoose = require('mongoose');

const connectionRequestSchema = new mongoose.Schema({
      fromUserId :{
        type : mongoose.Schema.Types.ObjectId,
        ref : "User",
        required : true
    },
    toUserId :{
        type : mongoose.Schema.Types.ObjectId,
         ref : "User",
        required : true
    },
    status :{
        type : String,
        enum : {
          values : ["interested", "ignored", "accepted", "rejected"],
required : true
        }
    }

},{
    timestamps : true
})

connectionRequestSchema.index({fromUserId: 1, toUserId:1})
connectionRequestSchema.pre("save", function(){
    const connectionRequest = this;

    //check if the fromUserId is same as toUserId

   if(connectionRequest.fromUserId.equals(connectionRequest.toUserId)){
 throw new Error("cannot send connection request to youself")
   }

});

const ConnectionRequestModel = new mongoose.model(
    "ConnectionRequestModel",
    connectionRequestSchema
);

module.exports = ConnectionRequestModel;


