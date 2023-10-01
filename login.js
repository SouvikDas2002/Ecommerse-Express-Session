const express=require('express');
const login=express.Router();
const fs=require('fs');
const bcrypt=require('bcrypt');
const { equal } = require('assert');

login.get("/", (req, res) => {
    if (req.session.email && req.session.role=="user")
    res.redirect(`/users/dashboard/:${req.session.email}`);
else if(req.session.email && req.session.role=="admin")
res.redirect(`/admin/dashboard/:${req.session.email}`);
  else res.render('login',{message:""});
});

login.get('/login',(req, res) => {
    if (req.session.email && req.session.role=="user")
      res.redirect(`/users/dashboard/:${req.session.email}`);
  else if(req.session.email && req.session.role=="admin")
  res.redirect(`/admin/dashboard/:${req.session.email}`);
    else res.render('login',{message:""});
  });
  
login.post("/login", async(req, res) => {
  
    // let checkPass=await bcrypt.hash(req.body.password,10);
    
      if (req.body.role != "user") {
        fs.readFile("admin.json", "utf-8", async(err, data) => {
          let records = JSON.parse(data);
          let results = await Promise.all(records.map(async (item) => {
            const checkPass = await bcrypt.compare(req.body.password, item.password);
            if (item.email === req.body.email && checkPass && item.role === req.body.role) {
              return true;
            }
            return false;
          }));   
          console.log(results);

          if(results.includes(true)){
            req.session.email=req.body.email;
               req.session.role=req.body.role;
               console.log("role "+req.session.role);
            res.redirect(`/admin/dashboard/${req.session.email}`)
          }
          else {
            res.render('login');
               
          }
        });
      } else if(req.body.role=="user"){
        fs.readFile("users.json", "utf-8",async (err, data) => {
          let records = JSON.parse(data);
      
          let results = await Promise.all(records.map(async (item) => {
            const checkPass = await bcrypt.compare(req.body.password, item.password);
            if (item.email === req.body.email && checkPass && item.role === req.body.role) {
              return true;
            }
            return false;
          }));   
          console.log(results);

          if(results.includes(true)){
            req.session.email=req.body.email;
               req.session.role=req.body.role;
               console.log("role "+req.session.role);
            res.redirect(`/users/dashboard/${req.session.email}`)
          }
          else {
            res.render('login');
               
            // res.send("welcome user");
          }
        });
      }
    });
module.exports=login;