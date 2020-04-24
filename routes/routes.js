const router = require('express').Router();
const User = require('./../models/user');
const bcrypt = require('bcryptjs');
const passport = require('passport');
const { Authentication } = require('./../config/auth');
const { ValidateSession } = require('./../config/session');

// Home or Login Form Rooute
router.get('/',ValidateSession,(req,res)=>{
    console.log(req.user);
    res.render('login');
});

//Register or sign up Form router
router.get('/register',ValidateSession,(req,res)=>{
    res.render('register');
});

// Dashboard Page
router.get('/dashboard',Authentication,(req,res)=>{
    res.render('dashboard',{
        user : req.user.name,
    });
});


// User Registration Handling
router.post('/register',(req,res)=>{
    const {name,email,password,password2} = req.body;

    let errors = [];

    //Check if nothing is empty
    if (!name || !email || !password || !password2) {
        errors.push({msg : "Some Fields Are Empty !!!"});
    }

    // Match Both Passwords
    if (password !== password2) {
        errors.push({msg : "Password do not match"});
    }

    // Check Password Length
    if (password.length < 6) {
        errors.push({msg : "Password length is less than 6 Character"});
    }

    //Check For Errors and pass
    if (errors.length > 0) {
        res.render('register',{
            name,
            email,
            password,
            password2,
            errors
        });

        
    } else {  // if there is no error
        User.findOne({email : email})
            .then((user) => {
                if (user) {
                    errors.push({msg : 'Email is already Registered'});
                    res.render('register',{
                        name,
                        email,
                        password,
                        password2,
                        errors
                    });
                }else {
                    const newUser =new User({ // set new user
                        name,
                        email,
                        password
                    });

                    //Genrate Hased Passworrd
                    bcrypt.genSalt(10,(err,salt)=>bcrypt.hash(newUser.password,salt,(err,hash)=>{
                        if(err) throw err;
                        // generated hash password set to user
                        newUser.password = hash;
                        //saving using in DataBase
                        newUser.save()
                            .then((user) => {
                                req.flash('success_msg' , 'Registration Successfull ! Login to Continue');
                                res.redirect('/');
                            })
                                .catch((err)=> console.log(err));
                    }));
                }                
            }).catch(err => console.log(err))
    }
});

// Handling Login Request

router.post('/login',(req,res,next)=>{

    passport.authenticate('local',{
        successRedirect : '/dashboard',
        failureRedirect : '/',
        failureFlash : true
    })(req,res,next);
});

// Handling LogOut Request
router.get('/logout',(req,res)=>{
    req.logout();
    req.flash("success_msg","You're logged out");
    res.redirect('/');
});

// Invalid Route
router.get('*',(req,res)=>{
    res.redirect('/');
});

module.exports =router;