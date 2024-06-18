var passport = require('passport');
var LocalStrategy = require('passport-local');
var GoogleStrategy = require('passport-google-oauth20').Strategy;
const { findOrCreate, getUserByEmail } = require('@services/user');
const bcrypt = require('bcrypt')
const saltRounds = 10
passport.serializeUser( (user, done) => {
    done(null, user)
})
  
passport.deserializeUser((user, done) => {
    done (null, user)
})

passport.use(new LocalStrategy({
        usernameField: 'email',
        passwordField: 'password'
    },
    function(email, password, done) {
        getUserByEmail(email)
        .then(user=>{
            console.log("user: ", user)
            if(!user){
                return done(null, false)
            }

            if(user){
                if(bcrypt.compareSync(password, user.password)){
                    return done(null, user)
                }else{
                    return done(null, false) 
                }
            }
        })
        .catch(err=>{
            return done(err)
        })
    }
));


passport.use(new GoogleStrategy({
    clientID: process.env.CLIENT_ID,
    clientSecret: process.env.CLIENT_SECRET,
    callbackURL: "http://localhost:4000/api/auth/google/callback"
  },
  function(accessToken, refreshToken, profile, cb) {
    
   if(profile._json){
        const newUser = profile._json
        newUser.avatar = newUser.picture
        newUser.password = bcrypt.hashSync("Default" + (Math.random() * 100000000), saltRounds)
        findOrCreate({email: profile._json.email}, newUser).then(user=>{
            user = user.toObject()
            cb(null, user)
        })
        .catch(err=>{
            cb(err)
        })
   }else{
        cb(new Error("Khong dang nhap thanh cong"))
   }
  }
));