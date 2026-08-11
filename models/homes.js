/***
 *  this.houseName=houseName
        this.price=price
        this.location=location
        this.rating=rating
        this.photo=photo
        this.discription=discription

        this._id = _id;
        save()
        static find
        static findById
        constructor(houseName,price,location,rating,photo,discription,_id)

 */

const { ObjectId } = require('mongodb');
const mongoose= require('mongoose');

const homeSchema= mongoose.Schema({
    houseName:{
        type: String,
        required: [true, "Product name is required"]
    },
    price:{
        type: Number,
        required: true
    },
    location:{
        type: String,
        required: true
    },
    rating:{
        type: Number,
        required: true
    },
    photo: String,
    discription: String,
});

module.exports= mongoose.model("Home",homeSchema);

