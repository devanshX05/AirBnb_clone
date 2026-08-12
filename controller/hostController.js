    const path = require('path');
    const Home = require('../models/homes');
    const cloudinary = require('../config/cloudinary');
    
    const uploadToCloudinary = (buffer) => {
    return new Promise((resolve, reject) => {
        const stream = cloudinary.uploader.upload_stream(
            {
                folder: "airbnb_clone"
            },
            (error, result) => {
                if (error) {
                    reject(error);
                } else {
                    resolve(result);
                }
            }
        );

        stream.end(buffer);
    });
};

    //constroller of get from hostrouter
    exports.getAddhome = (req,res,next)=>{
        res.render("host/edit_home", {
            editing: false,
            home: {},
            isLoggedIn:req.isLoggedIn,
            user: req.session.user
        });
}
    exports.getHosthome = (req,res,next)=>{
    Home.find()
        .then((rows)=>{
            res.render("host/host_home",{
                registeredhome: rows,
                isLoggedIn:req.isLoggedIn,
                user: req.session.user
            });
        })
        .catch(err=>{
            console.log(err);
        });
}
    ////constroller of post from hostrouter
    exports.postAddhome = async (req, res, next) => {
    try {
        const {
            houseName,
            price,
            location,
            rating,
            discription
        } = req.body;

        console.log(req.file);

        if (!req.file) {
            console.log("No image provided");
            return res.redirect("/host/add-home");
        }

        const result = await uploadToCloudinary(req.file.buffer);

        const photo = result.secure_url;

        const home = new Home({
            houseName,
            price,
            location,
            rating,
            photo,
            discription
        });

        await home.save();

        console.log("Home saved successfully");

        res.render(
            path.join(
                __dirname,
                "../",
                "views",
                "host",
                "home_added.ejs"
            )
        );

        } catch (err) {
            console.log("Error while adding home:", err);
            res.redirect("/host/add-home");
        }
    };

exports.getEdithome = (req, res, next) => {

    const homeId = req.params.homeId;
    const editing = req.query.editing === "true";

    Home.findById(homeId)
        .then((home) => {

            console.log(home);

            if (!home) {
                return res.redirect("/host/host_home");
            }

            res.render("host/edit_home", {
                editing: editing,
                home: home,
                isLoggedIn:req.isLoggedIn,
                user: req.session.user
            });

        })
        .catch(err => {
            console.log(err);
        });
};
    exports.postEdithome = async (req, res, next) => {
    try {
        const {
            houseName,
            price,
            location,
            rating,
            discription,
            id
        } = req.body;

        const home = await Home.findById(id);

        if (!home) {
            return res.redirect("/host/host_home");
        }

        home.houseName = houseName;
        home.price = price;
        home.location = location;
        home.rating = rating;
        home.discription = discription;

        // Only upload a new image if the user selected one
        if (req.file) {
            const result = await uploadToCloudinary(req.file.buffer);

            home.photo = result.secure_url;
        }

        await home.save();

        console.log("Home updated", home);

        res.redirect("/host/host_home");

    } catch (err) {
        console.log("Error while updating home:", err);
        res.redirect("/host/host_home");
    }
};

    


        //res.render() is an Express.js response
        // method used to render a template (HTML page) and send it to the browser.

        //res.send(path.join(__dirname,"../",'views','home.html')); //adding html file from core module
        //sendFile() sends an entire file to the browser.   Why not just write? Because Node.js needs the absolute path to the file.
        //__dirname is the directory where the current JavaScript file is located.
        // ../ means Go one folder up.
        // path.join safely joins folder names together.