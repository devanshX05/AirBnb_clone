const crypto= require("crypto"); //for encryption of the data 
const Razorpay=require("razorpay");
const Home = require("../models/homes");

//Initialize the razorpay client with our keys

const razorpay= new Razorpay({
    key_id: process.env.RAZORPAY_KEY_ID,
    key_secret: process.env.RAZORPAY_KEY_SECRET,
})
//frontend making order
const createOrder= async (req,res,next)=>{//creating an api call
    try{
        const {homeId}= req.body; //the amount will be in ruppees from the client
        console.log("Home ID:", homeId);

        if (!homeId) {
            return res.status(400).json({
                success: false,
                message: "Home ID is required"
            });
        }

        // Find the home
        const home = await Home.findById(homeId);

        if (!home) {
            return res.status(404).json({
                success: false,
                message: "Home not found"
            });
        }
        const amount = home.price;

        console.log("Amount from database:", amount);

        if(!amount || amount<=0){
            return res.status(400).json({
                success: false,
                message: "Valid amount required"
            })
        }

        const option ={                          //these are the things that we will be sending to razorpay
            amount: Math.round(amount *100), //razorpay uses paisa that is why we are converting the amount
            currency: "INR",
            receipt: `receipt_${Date.now()}`, //it is for our refernce
        };

        //now sending data to razorpay

        const order= await razorpay.orders.create(option); //send this order to the razorpay

        //now after the success the reposnse will be sent to the frontend
        res.status(201).json({
            success: true,
            order,  //contain order id 
            key_id: process.env.RAZORPAY_KEY_ID //frontend need this public key
        })
    }catch(error){
        console.log("Razorpay error:", error);
        next(error)
    }
}   

//verifying payment 

const verifyPayment= async (req,res,next)=>{
    try{
        const {razorpay_order_id, razorpay_payment_id, razorpay_signature}= req.body;  //these we get from frontend
        //frontend i.e. razorpay sends these three values to the backend

        const expectedSignature= crypto.createHmac("sha256", process.env.RAZORPAY_KEY_SECRET).update  //creaing encryption, hmac= hashing package  
        (`${razorpay_order_id}|${razorpay_payment_id}`).digest("hex");  //.digest finalize the hash computation 
        
        //this const expectedSignature will create a random signature for us using razorpay_order_id and razorpay_payment_id

        // we use "sha256" becoz razorpay use this to create its signature
        //RAZORPAY_KEY_ID 

        //comparing
        if(expectedSignature === razorpay_signature){ //we have to match expectedSignature with razorpay_signature to verify
            return res.json({
                success: true,
                message: "Payment verified successfully"
            })
        }
        res.status(400).json({
            success: false,
            message: "Payment verification failed"
        })
    }catch(error){
        next(error)
    }
}

module.exports = {createOrder, verifyPayment}