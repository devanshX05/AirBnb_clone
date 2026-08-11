const mongoose= require("mongoose");

const favouriteSchema= mongoose.Schema({
    homeId:{
        type: mongoose.Schema.Types.ObjectId ,  //ObjectId is the id from our mongo
        ref: "Home", //which model
        required: true,
        unique: true
    }
});

module.exports= mongoose.model("favourite", favouriteSchema)

//mongoose.model(...) creates a class for you automatically.Internally Mongoose creates something similar to
// class Favourite {

//     constructor(data){ ... }
//     save(){ ... }
//     static find(){ ... }
//     static findOne(){ ... }
//     static findById(){ ... }
//     static deleteOne(){ ... }
//     static updateOne(){ ... }
//     static create(){ ... }
//     static findByIdAndUpdate(){ ... }
// }
//You don't see that code because Mongoose already wrote it.
