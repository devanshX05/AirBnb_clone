const mongoose= require('mongoose');

const userSchema= mongoose.Schema({
    firstname:{
        type: String,
        required:[true, "First name is reuqired"]
    },
    lastname: String,
    email:{
        type: String,
        required:[true, "Email is reuqired"],
        unique: true
    },
    password:{
        type: String,
        required:[true, "Password is reuqired"]
    },
    userType:{
        type: String,
        enum: ["guest", "host"],
        default: "guest"
    },
    favourite: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Home",
            required: true
        }
    ]
});

module.exports= mongoose.model("User",userSchema);

