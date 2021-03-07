//jshint esversion:6
require('dotenv').config();
const express=require("express");
const _=require("lodash");
const bodyParser=require("body-parser");
const mongoose=require("mongoose");
const encrypt=require("mongoose-encryption");

const app=express();
app.use(express.static("public"));

app.set('view engine','ejs');

app.use(bodyParser.urlencoded({extended:true}));

mongoose.connect("mongodb://localhost:27017/userDB",{useNewUrlParser:true});

//CREATING NEW DATABASE
//CREATING DB SCHEMA

const userSchema=new mongoose.Schema({
  email:String,
  password:String
});

//using secret instead of two keys
//const secret="Thisisourlittlesecret.";
//userSchema.plugin(encrypt,{secret:secret});//na ovaj način kriptirali bismo cijelu bazu podataka što nije uvijek poželjno
//moramo navesti change opcije kojima navodimo da želimo kriptirati samo određena polja
//CREATING DB MODEL BASED ON DB userSchema
//userSchema.plugin(encrypt,{secret:secret, encryptedFields:["password"]});

userSchema.plugin(encrypt,{secret:prosess.env.SECRET, encryptedFields:["password"]});


const User=new mongoose.model("User",userSchema);


app.get("/",(req,res)=>{
  res.render("home");
});

app.get("/login",(req,res)=>{
  res.render("login");
});

app.get("/register",(req,res)=>{
  res.render("register");
});

app.post("/register",function(req,res){
  const newUser=new User({
    email:req.body.username,
    password:req.body.password
  });
  newUser.save(function(err){
    if(!err){
      console.log("Successfully saved new user")
      res.render("secrets");
    }
    else(console.log(errr));
  });
});

app.post("/login",(req,res)=>{
  const username=req.body.username;
  const password=req.body.password;

  User.findOne({email:username},function(err,foundUser){
    if(err){
      console.log(err);
    }
    else{
      if(foundUser){
        if(foundUser.password===password){
          res.render("secrets");
        }
      }
    }
  });
});




app.listen("3000",function(){
  console.log("Server started on port 3000");
});
