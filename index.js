const express = require("express");
const app = express();
const PORT=3000;
const fs = require("fs");
const path = require("path");
let data=require('./mongodb/connection');
const login=require("./login");
const signup=require('./signup');
const cookieparser = require("cookie-parser");
const session = require("express-session");
app.use(cookieparser());
const oneday = 1000 * 60 * 60 * 24;



app.set("view engine","ejs")

//express
//express-session
//cookie-parser

// session management

app.use(
  session({
    saveUninitialized: true,
    resave: false,
    secret: "askjh34asdf345#@#43",
    cookie: { maxAge: oneday },
  })
);

// route and authentication middleware

const userRoute = require("./router/userRoutes");
const adminRoute = require("./router/adminRoutes");

app.use("/users", userRoute);  //user route
app.use("/admin", adminRoute); //admin route

//session-authentication
function auth(req, res, next) {
  if (req.session.email)
  next();
else res.redirect("/");
}

// app.use(express.static("public"));
app.use(express.urlencoded({ extended: true }));

//logout
app.get("/logout", (req, res) => {
  req.session.destroy();
  res.redirect("/login");
});

// log-in

app.use("/", login);


//signup
app.use('/signup',signup);

// Update password

app.get('/changepwd',(req,res)=>{
  res.render('changepwd');
})
app.post('/changepwd',(req,res)=>{
  if(req.body.newPass==req.body.conPass){
    console.log(req.body);
  }
  res.end();
})

// single product details


app.get('/productdetails/:id',async(req,res)=>{
  // console.log(req.params.id);
  // fs.readFile('products.jso','utf-8',(err,data)=>{

  //   let products=JSON.parse(data);
  //   let single=products.filter(item=>{
  //     if(item.id==req.params.id)
  //     return 1;
  //   })
  //   res.render('productdetails',{detail:single});
  // })
  let single=await data.collection('products').find({"id":req.params.id}).toArray();
    res.render('productdetails',{detail:single});
  // console.log(single);
})

data(function(res){
  if(data)
  data=res;
else
console.log("got some issue");
})

app.listen(PORT, (err) => {
  console.log(`Server running on port number ${PORT}`);
});
