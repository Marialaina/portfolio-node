require('dotenv').config()
const router = require("express").Router();

//IMPORTING BCRYPT
const bcrypt = require("bcrypt");

// IMPORTING USER MODEL
const User = require("../models/User");

//CHECKING IF USER IS IN SESSION
const addUserToRequest = async (req, res, next) => {
    if (req.session.userId) {
        req.user = await User.findById(req.session.userId);
        next();
    } else {
        next();
    }
    console.log(req)
}

// AUTH MIDDLEWARE
const isAuthorized = (req, res, next) => {
    if (req.user) {
        next();
    }
    else {
        res.redirect("/auth/login");
    }
}

// SIGNUP ROUTES
router.get("/auth/signup", (req, res) => {
    res.render("auth/signup")
});

router.post("/auth/signup", async (req, res) => {
    try {
        //generate salt for hashing
        const salt = await bcrypt.genSalt(10);
        //hash the password
        req.body.password = await bcrypt.hash(req.body.password, salt);
        //CREATE THE USER
        await User.create(req.body);
        //redirect to login page
        res.redirect("/auth/login");
        console.log(User);
    } catch (error) {
        res.json(error)
    }
});

//LOGIN ROUTES
router.get("/auth/login", (req, res) => {
    res.render("auth/login");
});

router.post("/auth/login", async (req,res) => {
    try{
        //check if the user exists (must use findOne and not find)
        const user = await User.findOne({ username: req.body.username })
        if (user) {
            //create user session property
            const result = await bcrypt.compare(req.body.password, user.password)
            if (result) {
                req.session.userId = user._id
                //redirect to /images
                res.redirect("/home")
            } 
            //send error is password does not match
            else {
                res.json({ error: "User does not exist"})
            }
        } 
        //send error if user does not match
        else {
            res.json({ error: "user does not exist"})
          }
        } catch (error) {
        res.json(error)
    }
});

//LOGOUT ROUTE
router.get("/auth/logout", (req, res) => {
    // remove the user property from the session
    req.session.userId = null
    // redirect back to the main page
    res.redirect("/")
});

module.exports = {
    router,
    isAuthorized,
    addUserToRequest
}
module.exports = router;
