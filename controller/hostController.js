    const path = require('path');
    const Home = require('../models/homes');

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
    exports.postAddhome=(req,res,next)=>{
                // console.log("Home registration successful for:",req.body);
                const {houseName,price,location,rating,discription}=req.body; //alternate of below line Destructuring
                // const home=new Home(req.body.homeName,req.body.Price,req.body.Location,req.body.Rating,req.body.photo)
                console.log(req.file);
                if(!req.file){
                    console.log("no image provided");
                    return res.redirect("/host/add-home")
                }

                const photo = "/uploads/" + req.file.filename;
                const home = new Home({
                    houseName,
                    price,
                    location,
                    rating,
                    photo,
                    discription
                });
                home.save().then(()=>{
                    console.log("Home saved successfully");
                    res.render(path.join(__dirname,"../",'views','host','home_added.ejs'));
                })
                
    }

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
    exports.postEdithome=(req,res,next)=>{
        const {houseName,price,location,rating,discription,id}=req.body; 
        const photo= req.file.path;
                Home.findById(id).then((home)=>{
                    home.houseName=houseName;
                    home.price=price;
                    home.location=location;
                    home.rating=rating;
                    home.photo=photo;
                    home.discription=discription;
                    // home._id=id;
                    home.save().then(result=>{
                    console.log("Home updated",result);

                });
                res.redirect("/host/host_home");
            })
                .catch(err=>{
                    console.log(err);
                });
                
    }

    


        //res.render() is an Express.js response
        // method used to render a template (HTML page) and send it to the browser.

        //res.send(path.join(__dirname,"../",'views','home.html')); //adding html file from core module
        //sendFile() sends an entire file to the browser.   Why not just write? Because Node.js needs the absolute path to the file.
        //__dirname is the directory where the current JavaScript file is located.
        // ../ means Go one folder up.
        // path.join safely joins folder names together.