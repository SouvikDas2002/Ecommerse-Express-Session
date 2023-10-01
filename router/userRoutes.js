const express=require('express');
const route=express.Router();
const path=require("path");
const fs=require('fs');


route.get("/dashboard/:x",(req,res)=>{
    // res.sendFile(path.join(__dirname,"../public/dashboard.html"));
    console.log(req.params.x);
    fs.readFile('products.json','utf-8',(err,data)=>{
        // console.log(data);
        res.render("dashboard",{products:JSON.parse(data)});
    })
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
