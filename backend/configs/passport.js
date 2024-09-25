const GoogleStrategy = require("passport-google-oauth20").Strategy;
const passport = require("passport");
require("dotenv").config({ path: ".env.local" });

passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.CLIENT_ID,
      clientSecret: process.env.CLIENT_SECRET,
      callbackURL: "http://localhost:4000/users/google/callback",
      passReqToCallback: true,  // Set to true if you need the request object in the callback
    },
    function (req, accessToken, refreshToken, profile, done) {
      // Handle the authentication result here
      done(null, profile);  
      console.log("profile", profile);
    }
  )
);

passport.serializeUser((user, done) => {
  done(null, user);
});

passport.deserializeUser((user, done) => {
  done(null, user);
});
