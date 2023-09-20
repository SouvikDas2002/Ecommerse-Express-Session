const express = require("express");
const app = express();
const PORT=3000;
const fs = require("fs");
const path = require("path");
const cookieparser = require("cookie-parser");
const session = require("express-session");
app.use(cookieparser());
const oneday = 1000 * 60 * 60 * 24;

app.set("view engine","ejs")

//express
//express-session
//cookie-parser

// *session management

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

app.use("/users", auth, userRoute);  //user route
app.use("/admin", auth, adminRoute); //admin route

function auth(req, res, next) {
  if (req.session.username)
  next();
  else res.redirect("/");
}

// app.get("/dashboard.html", (req, res) => {
//   res.redirect(`/users/dashboard/:${req.session.username}`);
// });

// app.use(express.static("public"));
app.use(express.urlencoded({ extended: true }));


//logout

app.get("/logout", (req, res) => {
  req.session.destroy();
  res.redirect("/login");
});

app.get("/", (req, res) => {
    if (req.session.username && req.session.role=="user")
    res.redirect(`/users/dashboard/:${req.session.username}`);
else if(req.session.username && req.session.role=="admin")
res.redirect(`/admin/dashboard/:${req.session.username}`);
  else res.render('login');
});

//* log-in

app.get("/login", (req, res) => {
  if (req.session.username && req.session.role=="user")
    res.redirect(`/users/dashboard/:${req.session.username}`);
else if(req.session.username && req.session.role=="admin")
res.redirect(`/admin/dashboard/:${req.session.username}`);
  else res.render('login');
});

//* user and admin login authorization

app.post("/login", (req, res) => {
//   console.log(req.body.role);
  if (req.body.role != "user") {
    fs.readFile("admin.txt", "utf-8", (err, data) => {
      let records = JSON.parse(data);
      let results = records.filter((item) => {
        if (
          item.username == req.body.username &&
          item.password == req.body.password &&
          item.role == req.body.role
        )
          return true;
      });
      if (results.length == 0) res.send("Invalid user/password");
      else {
        req.session.username = req.body.username;
        req.session.role = req.body.role;
        console.log("role "+req.session.role);
        res.redirect(`/admin/dashboard/:${req.session.username}`);
        // res.send("hii admin")
      }
    });
  } else if(req.body.role=="user"){
    fs.readFile("users.txt", "utf-8", (err, data) => {
      let records = JSON.parse(data);
      let results = records.filter((item) => {
        if (
          item.username == req.body.username &&
          item.password == req.body.password &&
          item.role==req.body.role
        )
          return true;
      });
      if (results.length == 0) res.send("Invalid user/password");
      else {
           req.session.username=req.body.username;
           req.session.role=req.body.role;
           console.log("role "+req.session.role);
        res.redirect(`/users/dashboard/:${req.session.username}`)
        // res.send("welcome user");
      }
    });
  }
});

//*sign-up authorization for user and admin

app.get("/signup", (req, res) => {
  res.render('signUp');
});

app.post("/signup", (req, res) => {
  // console.log(req.body);

  if(req.body.role=="user"){
  fs.readFile("users.txt", "utf-8", (err, data) => {
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
      if (item.username == req.body.username && item.password == req.body.password && item.role == req.body.role)
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
    fs.writeFile("users.txt", JSON.stringify(newUser), (err) => {
      if (err) throw err;
      else console.log(`user signUp successful`);
    });
}
  });
  res.redirect('/login');
}
else{
    fs.readFile("admin.txt", "utf-8", (err, data) => {
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
          if (item.username == req.body.Name && item.password == req.body.pass)
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
        fs.writeFile("admin.txt", JSON.stringify(newUser), (err) => {
          if (err) throw err;
          else console.log(`admin signUp successful`);
        });
    }
      });
      res.redirect('/login');
}
});

app.listen(PORT, (err) => {
  console.log(`Server running on port number ${PORT}`);
});
