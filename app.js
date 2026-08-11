require("dotenv").config();

const path=require('path')
//External module
const express=require('express');
const session =require("express-session") //establishing session
const MongoDBStore= require("connect-mongodb-session")(session) //Without it,sessions disappear whenever the server restarts.
//this line creates a session store.
//We are using session becoz, anyone can change the data of the stored cookie as cookies alone are not secure for storing sensitive data.
const DBpath=process.env.MONGO_URI;

const multer=require("multer");

//DNS fixture 
const dns = require('dns');
dns.setServers(['8.8.8.8', '1.1.1.1']);

//local module
const userRouter=require("./routes/userRouter");
const {hostRouter}=require("./routes/hostRouter");
const authRouter= require("./routes/authRouter") //auth router
const paymentRouter = require("./routes/paymentRouter"); //payment router

const app=  express();

const Errorcontroller=require("./controller/404"); //adding the controoler for 404 page

//EJS

app.set('view engine','ejs'); //This tells Express which template engine it should use to generate HTML pages.
// View engine = a tool that combines HTML with dynamic data.
// EJS (Embedded JavaScript) allows you to write JavaScript inside HTML files.

app.set('views','views') //This tells Express where your view files are stored. the path

const bodyparser=require('body-parser');
const { Result } = require('postcss');
const { default: mongoose, Collection } = require('mongoose'); //mongoose 

const store= new MongoDBStore({
    uri: DBpath,
    collection: "session"
}) //this means, Save all sessions inside MongoDB, collection name, session


app.use(bodyparser.urlencoded({ extended: false })); //alternater of parsing
app.use(express.json());
const fileFilter=(req,file,cb)=>{
    if(file.mimetype === "image/png" || "image/jpg" || file.mimetype==="image/jpeg"){
        cb(null,true);
    }
    else{
        cb(null,false)
    }
}
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, "uploads/");
    },
    filename: (req, file, cb) => {
        cb(null, Date.now() + "-" + file.originalname);
    }
});
const upload = multer({
    storage,fileFilter
});


app.use(upload.single("photo"));
app.use(express.static(path.join(__dirname, 'public')));
// express.static(...): This is a built-in helper function in Express. It tells the server to serve
//  "static assets"—files that don't change dynamically (like CSS, images, or client-side JS files).

app.use("/uploads", express.static(path.join(__dirname, "uploads")));
app.use("/host/uploads", express.static(path.join(__dirname, "uploads")));


//establishing the session middleware
app.use(session({
    secret: process.env.SESSION_SECRET, //This is used to sign the Session ID cookie so it cannot be easily tampered with.
    //it is like a Digital Signature
    resave: false, //it means Don't save the session again if nothing changed.
    saveUninitialized: true, //this means, Create a session for every visitor.Even if they haven't logged in.
    store //this means.. Instead of storing sessions in RAM, store them in MongoDB.
}))

app.use((req,res,next)=>{
    console.log(req.url,req.method); //now we have no need to write this log everywhere
    next();
});

const cookieParser = require("cookie-parser");
//The cookie-parser middleware reads the Cookie header from incoming HTTP requests and makes the cookies easy to access in Express.
//this tells express "Before handling any request, parse all cookies and store them in req.cookies."
app.use(cookieParser());
app.use((req, res, next) => {
    req.isLoggedIn = req.session.isLoggedIn;
    next();
});

app.use(userRouter);  
app.use(authRouter);
app.use("/payment", paymentRouter);


//we have added this middleware because, so that if i am not logged in and try to visit any other page
//eg. http://localhost:3001/host/add-home it should redirect me to the login page rather than that page 
app.use("/host", (req, res, next) => {
    if (!req.isLoggedIn) {
        return res.redirect("/login");
    }

    // Logged in but not a host
    if (req.session.user.userType !== "host") {
        return res.redirect("/");
    }

    next();
});

app.use(hostRouter); // alternate= for adding common path.... app.use("/host",hostRouter);

app.use(Errorcontroller.Notfound); //Error controller added


const PORT=process.env.PORT || 3001;
mongoose.connect(DBpath).then(()=>{
    console.log("Connection established successfull");
    app.listen(PORT,()=>{
    console.log(`Server running on address http://localhost:${PORT}`);
    })
}).catch(err=>{
    console.log("Error while connecting to Mongo", err);
})


// req.body should be parsed by the body-parser middleware first, 
// and only then should the request continue to the route handler via next().

//Note: EJS (Embedded JavaScript) is a template engine for Express and Node.js that lets you write JavaScript inside HTML.
//__dirname is a built-in environment variable that returns the absolute path of the directory containing the currently executing JavaScript file