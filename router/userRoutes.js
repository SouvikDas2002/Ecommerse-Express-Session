const express=require('express');
const route=express.Router();
const path=require("path");


route.get("/dashboard/:x",(req,res)=>{
    // res.sendFile(path.join(__dirname,"../public/dashboard.html"));
    console.log(req.params.x);
    res.render("dashboard",{name:req.session.username})


})
route.get("/profile",(req,res)=>{
    // res.sendFile(path.join(__dirname,"../public/dashboard.html"));
    res.send("user profile page");
})
route.get("/history",(req,res)=>{
    // res.sendFile(path.join(__dirname,"../public/dashboard.html"));
    res.send("user history page");
})
module.exports=route;
