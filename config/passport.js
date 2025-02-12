const passport = require("passport");
const GoogleStartegy = require("passport-google-oauth20").Strategy;
const mongoose = require("mongoose");
const User = mongoose.model("users");
const {CLIENT_ID , CLIENT_SECRET_ID} = require("../config/keys");

passport.use(
    new GoogleStartegy({
           clientID: CLIENT_ID,
           clientSecret:CLIENT_SECRET_ID,
           callbackURL:"http://localhost:4000/auth/google/callback",
    },	
    async(accessToken , refreshToken , profile , done)=>{
        const newUser = {
            googleId:profile.id,
            firstName:profile.name.givenName,
            lastName:profile.name.familyName,
            displayName:profile.displayName,
            email:profile.emails[0].value,
            image:profile.photos[0].value,
        };
        
        try {
            let user = await User.findOne({ email: newUser.email });
            if (user) {
              // User Exists
              console.log("EXISTS ", user);
              done(null, user);
            } else {
              // Sign Up for the first time
              user = await User.create(newUser);
              console.log("NEW ", user);
              done(null, user);
            }
          } catch (error) {
            console.log(error);
            done(error);
          }
        }
    
)
);

//pass user id to session afte that user log in
passport.serializeUser((user,done) => {
    done(null , user.id);
});


passport.deserializeUser(async (id , done) =>{
    try{
        const user = await User.findById(id);
        done(null , user);
    }
    catch(error){
        done(error)
    }
});
