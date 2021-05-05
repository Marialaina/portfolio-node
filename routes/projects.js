require('dotenv').config()
const router2 = require("express").Router();

//  IMPORTING MY MONOGO DATABASE! :)
const User = require("../models/User");

const {isAuthorized, addUserToRequest, router} = require("./home.js");

//  RENDERING ALL OF MY PROJECTS
router2.get(`/projects`, isAuthorized, (req, res) => {
    res.send("all the projects")
});

