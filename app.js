//require package and other local files
if(process.env.NODE_ENV != "production"){
    require("dotenv").config();
}
const express = require("express");
const app = express();
const mongoose = require("mongoose");
const Mongo_URL = 'mongodb://127.0.0.1:27017/wanderlust';
const path = require("path");
const methodoverride = require("method-override");
const ejsmate = require("ejs-mate");
const ExpressError = require("./utilities/expressError.js");
const cookieParser=require("cookie-parser");
const session = require("express-session");
const flash = require("connect-flash");
const passport = require("passport");
const LocalStrategy = require("passport-local");
const User = require("./models/user.js");

//router paths
const listingRouter = require("./routes/listings.js");
const reviewRouter = require("./routes/reviews.js");
const userRouter = require("./routes/user.js");

app.set("view engine","ejs");
app.set("views",path.join(__dirname,"views"));
app.use(express.urlencoded({extended:true}));
app.use(methodoverride("_method"));
app.engine("ejs",ejsmate);
app.use(express.static(path.join(__dirname,"/public")));
app.use(cookieParser("secretcode"));
app.use(flash());

//express session
const sessionOption = {secret:"mysecretstringcode",
    resave: false,
    saveUninitialized: true,
    cookie :{
         expires : Date.now() + (7* 24 * 60 * 60*1000),
        maxage :(7*24*60*60*1000),
        httpOnly : true
    } 
};
app.use(session(sessionOption));

//passport 
app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

//stablize connection with mongo using mongoose
main().then(()=>{
    console.log("connected to DB");
})
.catch((err)=>{
    console.log(err);
});

async function main(){
    return mongoose.connect(Mongo_URL);
}
 
//express server 
app.listen(8080,()=>{
    console.log("app is listening on port 8080");
});

// app.get("/",(req,res)=>{
//     res.send("respond send");
// });

app.get("/demouser",async(req,res)=>{
    let fakeUser = new User ({
        email: "raj@gamil.com",
        username:"rajsingh"
    });
   let newUser =  await User.register(fakeUser, "hello bro");
    res.send(newUser);
});

//flash middleware
app.use((req,res,next)=>{
    res.locals.success = req.flash("success");
    res.locals.error = req.flash("error");
    res.locals.currUser = req.user;
    next();
});

//routes using router
 app.use("/listings", listingRouter);
 app.use("/listings/:id/review",reviewRouter);
 app.use("/",userRouter); 

//handling error
app.all("*",(req,res,next)=>{
    next (new ExpressError(400,"Page not found :("));
});

app.use((err,req,res,next)=>{
    let {status = 500,message = "something went wrong"} = err;
    res.status(status).render("listings/error.ejs",{message});
});

