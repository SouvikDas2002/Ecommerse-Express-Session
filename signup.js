const express = require("express");
const signUp = express.Router();
const fs = require("fs");
const bcrypt=require('bcrypt');

signUp.get("/", (req, res) => {
  res.render("signUp");
});
signUp.post("/", async(req, res) => {
  // console.log(req.body);
  let hashedPass= await bcrypt.hash(req.body.password,10);
  
  if (req.body.role == "user") {
    fs.readFile("users.json", "utf-8", (err, data) => {
      // console.log(data);
      let newUser;
      let oldrecord;
      if (data == "") {
        oldrecord = [];
      } else {
        oldrecord = JSON.parse(data);
      }
      //* checking user exist or not
      let results = oldrecord.filter((item) => {
        if (
          item.email == req.body.email &&
          item.role == req.body.role
          )
          return true;
        });
        
        if (results.length != 0) {
          console.log("user already present please login");
        } else {
          // console.log(hashedPass);
          let userCredentials=
          {
            email:req.body.email,
            password:hashedPass,
            role:req.body.role
          }
          
        // console.log(credentials);
        newUser = oldrecord;
        newUser.push(userCredentials);

        // console.log(newUser);
        fs.writeFile("users.json", JSON.stringify(newUser), (err) => {
          if (err) throw err;
          else console.log(`user signUp successful`);
        });
      }
    });
    res.redirect("/login");
  } else {
    fs.readFile("admin.json", "utf-8", (err, data) => {
      // console.log(data);
      let newUser;
      let oldrecord;
      if (data == "") {
        oldrecord = [];
      } else {
        oldrecord = JSON.parse(data);
      }
      // * checking admin exist or not
      let results = oldrecord.filter((item) => {
        if (item.email == req.body.email &&item.role == req.body.role)
          return true;
        
      });
      // console.log(results.length);
      if (results.length != 0) {
        console.log("user already present please login");
      } else {
        let adminCredentials=
          {
            email:req.body.email,
            password:hashedPass,
            role:req.body.role
          }
        newUser = oldrecord;
        newUser.push(adminCredentials);

        // console.log(newUser);
        fs.writeFile("admin.json", JSON.stringify(newUser), (err) => {
          if (err) throw err;
          else console.log(`admin signUp successful`);
        });
      }
    });
    res.redirect("/login");
  }
});

module.exports = signUp;
