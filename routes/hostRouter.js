        const cloudinary = require("../config/cloudinary");
        const path=require('path');
        const multer = require("multer");
        const express=require('express'); //This imports the Express module.
        const hostRouter=express.Router();// This creates a mini Express application (or mini router). making the router for hostrequest
        const homeController=require("../controller/hostController");
        const storage = multer.memoryStorage();
        
        const fileFilter = (req, file, cb) => {
                if (
                        file.mimetype === "image/png" ||
                        file.mimetype === "image/jpg" ||
                        file.mimetype === "image/jpeg"
                ) {
                cb(null, true);
                } else {
                        cb(null, false);
                }
        };
        
        const upload = multer({
                storage: storage,
                fileFilter
        });
        
                
        

       
        const home2Controller=require("../controller/userController"); //it is the controller that we have added 

        hostRouter.get("/host/add-home",homeController.getAddhome);// homeController is the const in which there is getAddhome,so it is written like this
        hostRouter.post("/host/add-home",
                upload.single("photo"),
                homeController.postAddhome);
        hostRouter.get("/host/host_home",homeController.getHosthome);
        hostRouter.get("/host/edit_home/:homeId",homeController.getEdithome) //colon tells that "This part of the URL is a variable."
        //otherwise it woukd be considered as the variable
        hostRouter.post("/host/edit_home",
                upload.single("photo"),
                homeController.postEdithome)

        exports.hostRouter=hostRouter;  

//NOTE; Route pass to the controller and controller ask model for the data
//controller is the function that does the work
//model is the shape of data