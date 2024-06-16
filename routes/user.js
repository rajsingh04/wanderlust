const express = require("express");
const router = express.Router();
const User = require("../models/user.js");
const passport = require("passport");
const { saveRedirectUrl } = require("./middleware.js");
const listingUser = require("../controllers/user.js");

router
.route("/signup")
.get(listingUser.signupForm)
.post(listingUser.signup);

router 
.route("/login")
.get(listingUser.loginForm)
.post(saveRedirectUrl,
  passport.authenticate("local",{
  failureRedirect : "/login",
  failureFlash : true
}),
listingUser.afterLogin);

//logout
router.get("/logout",listingUser.logOut);

module.exports = router;