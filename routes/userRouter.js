//core modules
const path=require('path')

//External Modules
const express=require('express');
const { registeredhome, gethomes } = require('../controller/hostController'); //connected it to the controller  
const userRouter=express.Router();
const homeController=require("../controller/hostController");
const home2Controller=require("../controller/userController"); //it is the controller that we have added 
//homeController is the name ofthe path of home.js in controller file so that we can directly acces

userRouter.get("/",home2Controller.gethomes);
userRouter.get("/bookings",home2Controller.getBookings);
userRouter.get("/favourite_list",home2Controller.getFavouritelist);
userRouter.get("/index",home2Controller.getIndex);
userRouter.get("/home/:homeId",home2Controller.getHomedetail); //"Whatever comes after /home/, store it in req.params.homeId."
//as seen in user controller.... const homeId=req.params.homeId;

userRouter.post("/favourite_list",home2Controller.postAddToFavourite);

module.exports=userRouter;