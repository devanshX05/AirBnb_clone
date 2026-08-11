const path = require('path');
const User = require('../models/user');
const { check,validationResult } = require('express-validator');
const bcryptjs= require("bcryptjs")

exports.getLogin = (req, res, next) => {
    res.render("auth/login",{
        isLoggedIn:false,
        error:[],
        oldInput:{email:""}, //oldInput is used to remember what the user typed in the form so that if validation fails, the form doesn't become empty.
        user: {}
    });
};

exports.postLogin = async (req, res, next) => {
    //these are the conditions to be checked i.e. finding email and matching password.. if not matched then false 
    const {email, password}= req.body;
    const user=await User.findOne({email});
    if(!user){
        return res.status(422).render("auth/login",{
            isLoggedIn: false,
            error: ["User does not exist"],
            oldInput: {email},
            user: {}
        });
    }
    const isMatch= await bcryptjs.compare(password, user.password);
    if(!isMatch){
        return res.status(422).render("auth/login",{
            isLoggedIn:false,
            error:["Invalid credentials"],
            oldInput:{email}
        });
    }
    //if matched then true
    req.session.isLoggedIn = true; //It stores a value inside the session object.

    //now these lines
    //Instead of storing the entire Mongoose document. (which contains a lot of internal Mongoose and BSON data),
    //you're storing a plain JavaScript object.This is much safer and easier to serialize.
    req.session.user = {
        id: user._id.toString(),
        firstname: user.firstname,
        email: user.email,
        userType: user.userType
    };
    //This keeps the session small, avoids stale data if the user updates their profile,
    //and is the most common pattern used in Express applications.
    req.session.save(err => { //save the session first, then continue.becoz save the session first, then continue.
        //But you're redirecting immediately:Sometimes the redirect happens before the session has finished saving.
        if (err) {
            console.log(err);
            return res.redirect("/login");
        }

        res.redirect("/");
    });
};

exports.getSignup = (req, res, next) => {
    res.render("auth/signup",{
        isLoggedIn:false,
        errorMessage:[],
        oldInput:{firstname:"", lastname:"", email:"", password:"", userType:""},
        user: {}
    });
};

//adding validators to the postlogin
exports.postSignup = [
    check("firstname")
    .trim()
    .isLength({min:2})
    .withMessage("first name should be atleast 2 character long")
    .matches(/^[A-Za-z\s]+$/)
    .withMessage("First name should contain only alphabets."),

    check("lastname")
    .trim()
    .matches(/^[A-Za-z\s]+$/)
    .withMessage("Last name should contain only alphabets."),

    check("email")
    .isEmail()
    .withMessage("please enter a valid email")
    .normalizeEmail(),

    check("password")
    .isLength({min:8})
    .withMessage("Password should be atleast 8 character long")
    .matches(/[A-Z]/)
    .withMessage("Password should contain atlest one uppercase letter")
    .matches(/[a-z]/)
    .withMessage("Password should contain atlest one lowercase letter")
    .matches(/[@!$&]/)
    .withMessage("Password should contain atlest one special character"),

    check("confirmpassword")
    .trim()
    .custom((value,{req})=>{
        if(value!==req.body.password){
            throw new Error("Password donot match");
        }
        return true
    }),

    check("userType")
    .isIn(["guest","host"])
    .withMessage("Please select a valid user type."),

    check("terms")
    .custom((value)=>{
        if(value!=="on"){
            throw new Error("You must accept the terms and condition");
            
        }
        return true;
    }),

    (req, res, next) => {
    const {firstname, lastname, email, password, confirmpassword, userType}= req.body;
    const errors= validationResult(req);

    if(!errors.isEmpty()){
        return res.status(422).render("auth/signup", {
            errorMessage: errors.array().map(err=> err.msg),
            isLoggedIn: false,
            oldInput:{
                firstname,
                lastname,
                email,
                userType, 
            },
            user: {}
        })

    }

    bcryptjs.hash(password, 12).then(hashedPassword=>{
        const user= new User({firstname,lastname,password: hashedPassword,email,userType});
        return user.save(); //this is a promise
    }).then(()=>{
        res.redirect("/login");
    }).catch(err=>{
        return res.status(422).render("auth/signup", {
            isLoggedIn: false,
            error: [err.message],
            oldInput:{
                firstname,
                lastname,
                email,
                userType,  
            },
            user: {}
        })
    })

}];

   

//Now this (postLogout) removes the session from the server (and the session cookie becomes unusable), 
//which is the correct way to log out.
exports.postLogout = (req, res) => {
    req.session.destroy((err) => {
        if (err) {
            console.log(err);
            return res.redirect("/");
        }

        res.redirect("/login");
    });
};
//Browser cookies are small text files websites save on your device.
//They act as the internet’s "memory," allowing sites to remember your login status,
//shopping cart items, and customized preferences. When you return to a website, your 
//browser sends these cookies back so the site can recognize you


//always remember This is why sessions are preferred over storing isLoggedIn directly in a cookie: the browser 
//only holds an opaque session ID, while all important information stays securely on the server.