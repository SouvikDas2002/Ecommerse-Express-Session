const express=require('express');
const signUp=express.Router();
const fs=require('fs');

signUp.get('/',(req,res)=>{
    res.render('signUp');
})
signUp.post("/", (req, res) => {
    // console.log(req.body);
  
    if(req.body.role=="user"){
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
        if (item.email == req.body.email && item.password == req.body.password && item.role == req.body.role)
          return true;
        // else return false;
      });
      // console.log(results.length);
      if (results.length!=0) {
        console.log("user already present please login");
      }
      else{
      newUser = oldrecord;
      newUser.push(req.body);
  
      // console.log(newUser);
      fs.writeFile("users.json", JSON.stringify(newUser), (err) => {
        if (err) throw err;
        else console.log(`user signUp successful`);
      });
  }
    });
    res.redirect('/login');
  }
  else{
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
            if (item.email == req.body.email && item.password == req.body.pass)
              return true;
            else return false;
          });
          // console.log(results.length);
          if (results.length!=0) {
            console.log("user already present please login");
          }
          else{
          newUser = oldrecord;
          newUser.push(req.body);
      
          // console.log(newUser);
          fs.writeFile("admin.json", JSON.stringify(newUser), (err) => {
            if (err) throw err;
            else console.log(`admin signUp successful`);
          });
      }
        });
        res.redirect('/login');
  }
  });

module.exports=signUp;