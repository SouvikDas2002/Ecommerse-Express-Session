const express = require("express");
const login = express.Router();
const fs = require("fs");
const bcrypt = require("bcrypt");
const { equal } = require("assert");
let user = require("./mongodb/connection");

login.get("/", (req, res) => {
  if (req.session.email && req.session.role == "user")
    res.redirect(`/users/dashboard/:${req.session.email}`);
  else if (req.session.email && req.session.role == "admin")
    res.redirect(`/admin/dashboard/:${req.session.email}`);
  else res.render("login", { message: "" });
});

login.get("/login", (req, res) => {
  if (req.session.email && req.session.role == "user")
    res.redirect(`/users/dashboard/:${req.session.email}`);
  else if (req.session.email && req.session.role == "admin")
    res.redirect(`/admin/dashboard/:${req.session.email}`);
  else res.render("login", { message: "" });
});

login.post("/login", async (req, res) => {
  // let checkPass=await bcrypt.hash(req.body.password,10);

  if (req.body.role != "user") {
    // fs.readFile("admin.json", "utf-8", async (err, data) => {
    //   let records = JSON.parse(data);
    //   let results = await Promise.all(
    //     records.map(async (item) => {
    //       const checkPass = await bcrypt.compare(
    //         req.body.password,
    //         item.password
    //       );
    //       if (
    //         item.email === req.body.email &&
    //         checkPass &&
    //         item.role === req.body.role
    //       ) {
    //         return true;
    //       }
    //       return false;
    //     })
    //   );
    //   console.log(results);

    //   if (results.includes(true)) {
    //     req.session.email = req.body.email;
    //     req.session.role = req.body.role;
    //     console.log("role " + req.session.role);
    //     res.redirect(`/admin/dashboard/${req.session.email}`);
    //   } else {
    //     res.render("login");
    //   }
    // });
    const email = req.body.email;
    const password = req.body.password;
    const role = req.body.role;

    try {
      const validUser = await user
        .collection("admin")
        .findOne({ email: email });
      // console.log(validUser.password);
      // console.log(validUser.role);
      if (validUser) {
        const isPasswordValid = await bcrypt.compare(
          password,
          validUser.password
        );

        if (isPasswordValid && validUser.role == role) {
          console.log(validUser);
          
          req.session.email=req.body.email;
           req.session.role=req.body.role;
           res.redirect(`/admin/dashboard/${req.session.email}`)

        } else {
          console.log("Invalid password or role");
          res.render('login');
        }
      } else {
        console.log("user not found");
        res.render('login');
      }
    } catch (err) {
      console.error(`Error: ${err}`);
    }
  } else if (req.body.role == "user") {
    // fs.readFile("users.json", "utf-8",async (err, data) => {
    //   let records = JSON.parse(data);

    //   let results = await Promise.all(records.map(async (item) => {
    //     const checkPass = await bcrypt.compare(req.body.password, item.password);
    //     if (item.email === req.body.email && checkPass && item.role === req.body.role) {
    //       return true;
    //     }
    //     return false;
    //   }));
    //   console.log(results);

    //   if(results.includes(true)){
    //     req.session.email=req.body.email;
    //        req.session.role=req.body.role;
    //        console.log("role "+req.session.role);
    //     res.redirect(`/users/dashboard/${req.session.email}`)
    //   }
    //   else {
    //     res.render('login');
    //   }
    // });
    const email = req.body.email;
    const password = req.body.password;
    const role = req.body.role;

    try {
      const validUser = await user
        .collection("users")
        .findOne({ email: email });
      // console.log(validUser.password);
      // console.log(validUser.role);
      if (validUser) {
        const isPasswordValid = await bcrypt.compare(
          password,
          validUser.password
        );

        if (isPasswordValid && validUser.role == role) {
          console.log(validUser);
          
          req.session.email=req.body.email;
           req.session.role=req.body.role;
           res.redirect(`/users/dashboard/${req.session.email}`)

        } else {
          console.log("Invalid password or role");
          res.render('login');
        }
      } else {
        console.log("user not found");
        res.render('login');
      }
    } catch (err) {
      console.error(`Error: ${err}`);
    }
  }
});

user(function (res) {
  if (user) user = res;
  else {
    console.log("not valid user");
  }
});

module.exports = login;
