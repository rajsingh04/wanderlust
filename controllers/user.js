const User = require("../models/user.js");

module.exports.signupForm = (req,res)=>{
    res.render("./user/signup.ejs");
}

module.exports.signup = async(req,res)=>{
    try {
        let {username,email,password} = req.body;
        const newUser = new User({email,username});
        await User.register(newUser,password);
        req.login(newUser,(err)=>{
            if(err){
                return next(err);
            }
            req.flash("success","welcome to WANDERLUST");
            res.redirect("/listings");
        });
    } catch (e){
        req.flash("error", e.message);
        res.redirect("/signup");
    }
}

module.exports.loginForm = (req,res)=>{
    res.render("./user/login.ejs");
}

module.exports.afterLogin = (req,res)=>{
    req.flash("success","Welcome back to WANDERLUST!");
    let redirectUrl = res.locals.redirectUrl || "/listings";
    res.redirect(redirectUrl);
}

module.exports.logOut = (req,res)=>{
    req.logout((err)=>{
        if(err){
          return  next(err);
        }
        req.flash("success","You are logged out!");
        res.redirect("/listings");
    })
}