const express=require('express');
const route=express.Router();
const path=require("path");
const fs=require('fs');
const session = require('express-session');
route.use(express.urlencoded({extended:true}));

route.use(express.json());
// route.set('view engine','ejs');

route.get("/dashboard/:x",(req,res)=>{
    // res.sendFile(path.join(__dirname,"../public/admindash.html"));
    res.render('admindash');
    console.log(req.params.x);

})
//product details
route.get("/productdetails",(req,res)=>{
    res.render('productmodify');
})
//product modify

//add product
route.get("/productadd",(req,res)=>{
    fs.readFile("products.json","utf-8",(err,data)=>{
        let products=JSON.parse(data);
        // console.log(products);
        // console.log(req.session.email);
        res.render("viewproducts",{productdetails:products,admin:req.session.email});
    })
})
route.post("/productadd",(req,res,next)=>{
    console.log(req.body);
    // res.redirect("/admin/productadd");
    fs.readFile("products.json","utf-8",(err,data)=>{
        let products=JSON.parse(data);
        console.log(products);
        let prod=products.filter(item=>{
            if(item.name==req.body.name)
            return true;
        })
        if(prod.length!=0){
            console.log("sir please add Your product with different name");
            
        }
        else{
            
            let newProduct;
            newProduct=products;
            newProduct.push(req.body);
        

        fs.writeFile("products.json",JSON.stringify(newProduct),(err)=>{
            if(err) throw err;
            else{
                res.redirect("/admin/productadd");
            }
        })
    }
    })

})
route.post("/productupdate",(req,res)=>{
    
    fs.readFile("products.json","utf-8",(err,data)=>{
        let products=JSON.parse(data);
    
        let index=products.filter(item=>{
            if(item.id!=req.body.id)
            return true;
        })
        // console.log(index);
        let updateProduct=index;
        updateProduct.push(req.body);

        updateProduct.sort((a,b)=> a.id-b.id);

        fs.writeFile("products.json",JSON.stringify(updateProduct),(err)=>{
            if(err) throw err;
            else
            res.redirect("/admin/productadd");
        // console.log("success");

        })
    })
})
route.post("/productdelete",(req,res)=>{
    console.log(req.body);
    fs.readFile("products.json","utf-8",(err,data)=>{
        let deleteItem=JSON.parse(data);
        let item=deleteItem.filter(x=>{
            if ( x.id != req.body.id ) 
            return true ;
        })
        fs.writeFile("products.json",JSON.stringify(item),(err)=>{
            if(err) throw err;
            else
            res.redirect("/admin/productadd");
        })
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
