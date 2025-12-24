const mongoose = require("mongoose");
const validator = require ('validator');
const bcrypt = require('bcrypt')
const jwt = require("jsonwebtoken")

const userSchema = new mongoose.Schema({
firstName : {
type : String,
required : true,
minLength: 4,
maxLength : 50
},
lastName : {
    type : String
},
emailId : {
    type : String,
    lowercase: true,
    required : true,
    unique : true,
    trim : true,
    validate(value){
if(!validator.isEmail(value)){
throw new Error ("Invalid email address " + value)
}
    }
},
password: {
    type : String,
    required : true,
        validate(value){
if(!validator.isStrongPassword(value)){
    throw new Error("Enter a strong password:" + value)
}
},
},
age : {
    type : Number,
    min : 18,
    max : 50,
    },

gender : {
    type : String,
    validate(value) {
      if  (!["male", "female", "other"].includes(value)){
      throw new Error ("Gender data is not valid")
      }
    }
},
photoUrl : {
    type : String,
    default : ("https://img.freepik.com/premium-vector/cute-bunny-with-bun_547598-57.jpg?w=360"),
    validate(value){
        if(!validator.isURL(value)){
throw new Error("worng URL " + value)
        }
    }
},
about : {
    type : String,
    default : "Hey! I'm new here 👋",
},
skills : {
    type : [String]
}

},
{
timestamps : true,
}
);

userSchema.methods.getJWT = async function () {
const user = this;
 const token = await jwt.sign({_id: user._id}, 'kashish@1234cjc', {expiresIn : "7d"});

 return token;
};

userSchema.methods.validatePassword = async function (passwordInputByUser) {
    const user = this;
    const passwordHash =  user.password
    const isPasswordValid = await bcrypt.compare(
        passwordInputByUser,
        passwordHash
    );

    return isPasswordValid;
};
const User = mongoose.model('User', userSchema);
module.exports = User;
