require('dotenv').config()
//IMPORTING THE SHCEMA FOR MONGOS
// const { text } = require("express");
const { Schema, model } = require(`../db/connection`);

const Skills = new Schema({
    skillList: String,
});

const Projects = new Schema({
    nameP: String,
    image: String,
    typeOfProject: String,
    dateP: String,
    descprtionP: String,
    linksP: String
});

const Experience = new Schema({
    nameE: String,
    dateE: String,
    currentStatus: String,
    descriptionE: String
});

const About = new Schema({
    about: String,
});

const MyPortfolioLogin = new Schema({
    username: { type: String, Unique: true, required: true },
    password: { type: String, required: true },

    //going to create embedded schemas and put them in an array
    skills: [Skills], 
    projects:[Projects],
    experience:[Experience],
    about:[About]}, 
{ timestamps: true })

const User = model("User", MyPortfolioLogin)

module.exports = User