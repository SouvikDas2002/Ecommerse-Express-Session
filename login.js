const express=require('express');
const login=express.Router();
const fs=require('fs');

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
  
login.post("/login", (req, res) => {
    //   console.log(req.body);
      if (req.body.role != "user") {
        fs.readFile("admin.json", "utf-8", (err, data) => {
          let records = JSON.parse(data);
          let results = records.filter((item) => {
            if (
              item.email == req.body.email &&
              item.password == req.body.password &&
              item.role == req.body.role
            )
              return true;
          });
          if (results.length == 0) res.render('login',{message:"Invalid email/Password"});
          else {
            req.session.email = req.body.email;
            req.session.role = req.body.role;
            console.log("role "+req.session.role);
            res.redirect(`/admin/dashboard/:${req.session.email}`);
            // res.send("hii admin")
          }
        });
      } else if(req.body.role=="user"){
        fs.readFile("users.json", "utf-8", (err, data) => {
          let records = JSON.parse(data);
          let results = records.filter((item) => {
            if (
              item.email == req.body.email &&
              item.password == req.body.password &&
              item.role==req.body.role
            )
              return true;
          });
          if (results.length == 0) res.render('login',{message:"Invalid email/password"});
          else {
               req.session.email=req.body.email;
               req.session.role=req.body.role;
               console.log("role "+req.session.role);
            res.redirect(`/users/dashboard/:${req.session.email}`)
            // res.send("welcome user");
          }
        });
      }
    });
module.exports=login;