require('dotenv').config();
const express = require("express");
const app = express();
const path = require("path");
const mongoose = require("mongoose");
const Chat = require("./models/chat.js");
const methodOverride = require("method-override");
const ExpressError = require("./ExpressError");
app.use(express.static(path.join(__dirname,"public")));
app.use(express.urlencoded({ extended: true }));
app.use(methodOverride("_method"));
app.set("view engine","ejs");
app.set("views",path.join(__dirname,"views"));

const multer = require("multer");
const { storage } = require("./cloudConfig");  // AFTER dotenv
const upload = multer({ storage });

console.log("CLOUD_NAME:", process.env.CLOUD_NAME);
console.log("CLOUD_API_KEY:", process.env.CLOUD_API_KEY);
console.log("CLOUD_API_SECRET:", process.env.CLOUD_API_SECRET);


main().then(()=>{
    console.log("Connection Succesful");
})
.catch((err)=>{
    console.log(err);
})

// async function main() {
//   await mongoose.connect("mongodb://127.0.0.1:27017/whatsapp");
// };


 async function main() {
  await mongoose.connect("mongodb://127.0.0.1:27017/fakewhatsapp");
};

// function wrapAsync (fn){
//     return function(req,res,next){
//         fn(req,res,next).catch(err => next(err));
//     }
// }

function wrapAsync (fn) {
 return function(req,res,next){
    console.log("heelo wrap");
   fn(req,res,next).catch(err => next(err));
 }
}

//Index Route
app.get("/chats",async (req,res)=>{
  let chats = await Chat.find();
  res.render("index.ejs",{chats});
});

//new msg
app.get("/chats/new",(req,res)=>{
    res.render("new.ejs")
});

//Create Route
// app.post("/chats",upload.single("image"),wrapAsync(async (req,res)=>{
// res.send(req.file)
//   // console.log(`req.body ${req.body}`);
//     //     let { from,msg,to,image} = req.body;
//     //     let newChat = new Chat({
//     //     from : from,
//     //     to : to,
//     //     msg : msg,
//     //     image : image,
//     //     created_at : new Date(),
//     // });
//     // let newdata = await newChat.save();
//     // res.redirect("/chats");
//   }
// ));
app.post("/chats", upload.single("image"), async (req,res)=>{
  let url = req.file.path;
  let filename = req.file.filename;
  let { from,msg,to,image} = req.body;
          let newChat = new Chat({
          from : from,
          to : to,
          msg : msg,
          image : image,
          created_at : new Date(),
     });
       newChat.image = {url,filename}; 
    //  newChat.image.url = url;
    //  newChat.image.filename = filename;
     let chat = await newChat.save();
     console.log(chat);
});

//Show route
app.get("/chats/:id", (async(req,res,next)=>{
  let { id} = req.params;
  let chat = await Chat.findById(id);
  res.render("edit.ejs", { chat});
}));


//edit route
app.get("/chats/:id/edit",async (req,res)=>{
    console.log(req.file);
    let { id} = req.params;
    let chat = await Chat.findById(id);
    console.log(chat);
    res.render("edit.ejs",{ chat});
})

//update Route
app.put("/chats/:id",async (req,res)=>{
   let { id} = req.params;
   let { msg : newmsg } = req.body;
   let updatedChat = await Chat.findByIdAndUpdate(id, 
  {msg : newmsg}, {runValidators : true, new : true});
  console.log(updatedChat);
  res.redirect("/chats");
})

//Delete Msg
app.delete("/chats/:id", async (req,res)=>{
   let { id } = req.params;
   console.log(id);
   let deletedMsg = await Chat.findByIdAndDelete(id);
   console.log(deletedMsg);
   res.redirect("/chats");
});

// const handleValidation = (err) =>{
//   console.log("Error is empty fields....");
//   console.log(err);
//   console.dir(err.message);
//   return err;
// };

// app.use((err,req,res,next)=>{
//     console.log(err.name);
//     if(err.name === "ValidationError"){
//         handleValidation();
//     } 
//        next(err);
// });




let handleValidationError = (err) => {
  console.log("this is validation error follow rules");
  console.log("i am function");
 
}

app.use((err,req,res,next) => {
    console.log(err.name);
    if(err.name == "ValidationError"){
     handleValidationError(err);
    }
    next(err);
});

// Error middleware
app.use((err,req,res,next)=>{
let { status=500, message="some error"} = err;
res.status(status).send(message);
});












// let obj1 = {
//   name: "priti",
//   age : 20
// }

// let {name, age} = obj1;
// console.log(`name = ${name}, age = ${age}`);

// let name = "sdf";
// const age = "2f0";

// obj1 = {name,age};
// console.log(obj1);





app.listen("8080",()=>{
    console.log("app is listening....");
})