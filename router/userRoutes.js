const express=require('express');
const route=express.Router();
const path=require("path");
const fs=require('fs');
const Objid=require('mongodb').ObjectId;
let data=require('../mongodb/connection.js');

route.get("/dashboard/:x",async(req,res)=>{

    // fs.readFile('products.json','utf-8',(err,data)=>{
    //     res.render("dashboard",{products:JSON.parse(data)});
    // })

    let products=await data.collection("products").find({}).toArray();
    res.render("dashboard",{products:products});
})

route.get("/profile",(req,res)=>{
    // res.sendFile(path.join(__dirname,"../public/dashboard.html"));
    res.send("user profile page");
})
route.get("/history",(req,res)=>{
    // res.sendFile(path.join(__dirname,"../public/dashboard.html"));
    res.send("user history page");
})
data(function(res){
    if(data)
    data=res;
else
console.log("got some issue");
})

module.exports=route;
