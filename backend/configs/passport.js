const GoogleStrategy = require('passport-google-oauth20').Strategy;
const passport = require('passport');
const JwtStrategy = require('passport-jwt').Strategy;
const ExtractJwt = require('passport-jwt').ExtractJwt;
const User = require('../models/User');
require('dotenv').config({path: '.env.local'});


// JWT strategy
const opts = {
  jwtFromRequest: ExtractJwt.fromExtractors([(req) => req.cookies.accessToken]),
  secretOrKey: process.env.JWT_SECRET,
  issuer: process.env.ISSUER,
};

passport.use(
    new GoogleStrategy(
        {
          clientID: process.env.CLIENT_ID,
          clientSecret: process.env.CLIENT_SECRET,
          callbackURL: 'http://localhost:4000/auth/google/callback',
          passReqToCallback: true,
        },
        async function(req, accessToken, refreshToken, profile, done) {
          try {
            // Check if user already exists
            let user = await User.findOne({email: profile.emails[0].value});

            if (!user) {
              // Create a new user if not found
              user = new User({
                name: profile.displayName,
                email: profile.emails[0].value,
                googleId: profile.id,
              });
              await user.save();
            } else {
              // Verify user
              user = await User.findOne({email: profile.emails[0].value});
              user.googleId = profile.id;
            }

            done(null, user);
          } catch (error) {
            console.log(error);
            done(error, false);
          }
        },
    ),
);

passport.serializeUser((user, done) => {
  done(null, user);
});

passport.deserializeUser((user, done) => {
  done(null, user);
});

// JWT strategy

passport.use(
    new JwtStrategy(opts, async (jwtPayload, done) => {
      try {
        const user = await User.findById(jwtPayload.id);
        if (user) {
          return done(null, user);
        } else {
          return done(null, false);
        }
      } catch (err) {
        return done(err, false);
      }
    }),
);

module.exports = passport;
