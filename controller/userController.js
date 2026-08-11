const Home = require('../models/homes');
const User = require('../models/user');

exports.getIndex = (req, res, next) => {
    console.log("Session value",req.session);
    
    Home.find() //Calls the model.
    .then((registeredhome, fields) => {//Since it returns a Promise, we wait using .then().
        //sqaure bracket tells "Take the first element of the
        //  returned array and store it in registeredhome, and the second element in fields."
        res.render('store/index', {
            registeredhome: registeredhome,
            isLoggedIn:req.isLoggedIn,
            user: req.session.user
        });
    })
    .catch(err => console.log(err));
};

exports.gethomes = (req, res, next) => {
    Home.find()
    .then((registeredhome, fields) => {
        res.render('store/home', {
            registeredhome: registeredhome,
            isLoggedIn:req.isLoggedIn,
            user: req.session.user
        });
    })
    .catch(err => console.log(err));
};

exports.getBookings = (req, res, next) => {
    Home.find()
    .then((registeredhome, fields) => {
        res.render('store/bookings', {
            registeredhome: registeredhome,
            isLoggedIn:req.isLoggedIn,
            user: req.session.user
        });
    })
    .catch(err => console.log(err));
};

exports.getFavouritelist =async (req, res, next) => {
     try {

        const userId = req.session.user.id;

        const user = await User.findById(userId).populate("favourite");

        res.render("store/favourite_list", {
            favouriteHomes: user.favourite,
            isLoggedIn: req.isLoggedIn,
            user: req.session.user
        });

    } catch (err) {
        console.log(err);
        next(err);
    }
    
}


exports.postAddToFavourite = async (req, res, next) => {
    try {
        const homeId = req.body.homeId;
        const userId = req.session.user.id;

        const user = await User.findById(userId);

        // Already in favourites?
        if (user.favourite.includes(homeId)) {
            return res.redirect("/favourite_list");
        }

        user.favourite.push(homeId);

        await user.save();

        res.redirect("/favourite_list");

    } catch (err) {
        console.log(err);
        next(err);
    }
};

exports.getHomedetail = (req, res, next) => {

    const homeId = req.params.homeId;

    Home.findById(homeId)
    .then((home) => {
    console.log(home);

    if (!home) {
        return res.redirect("/");
    }

    res.render("store/home_detail", {
        home: home,
        isLoggedIn:req.isLoggedIn,
        user: req.session.user
    });
    }).catch(err => 
        console.log(err));
};

//Always remeber--The controller never talks directly to MySQL. It always asks the model to do it.


        //res.render() is an Express.js response. render is only for ejs extensions
        // method used to render a template (HTML page) and send it to the browser.

        //res.send(path.join(__dirname,"../",'views','home.html')); //adding html file from core module
        //sendFile() sends an entire file to the browser.   Why not just write? Because Node.js needs the absolute path to the file.
        //__dirname is the directory where the current JavaScript file is located.
        // ../ means Go one folder up.
        // path.join safely joins folder names together.