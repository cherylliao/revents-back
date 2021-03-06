const User = require('../models/user');
const jwt = require('jsonwebtoken');//to generate signed token
const expressJwt = require('express-jwt')//for authorization check
const {errorHandler} = require('../helpers/dbErrorHandler');


exports.signup=(req,res) => {
    // console.log(req.body);
    const user = new User(req.body);
    user.save((err, user)=> {
        if(err){
            return res.status(400).json({
                err: errorHandler(err)
            });
        }
        user.salt = undefined;
        user.hashed_password = undefined;
        res.json({
            user
        });

    });
};

exports.signin = (req,res) => {
    //find the user based on email
    const {email, password} = req.body
    User.findOne({email}, (err,user) => {
        if(err || !user) {
            return res.status(400).json({
                error: 'User with that email does not exist. Please sign up'

            });
        }
        //if user found make sure email and password match
        //create authenticate method in user model
        if(!user.authenticate(password)) {
            return res.status(401).json({
                error: 'Email and password dont match'
            })
        }
        //generate a signed token with user id and secret
        const token = jwt.sign({_id: user._id},process.env.JWT_SECRET)
        //persist the token as 't' in cookie with expiry date
        res.cookie('t', token, {expire: new Date() + 9999})
        //return response with user and token to frontend client
        const {_id, name, email, role} = user //deconstruct to not have to say user.name, user.email.....
        return res.json({token, user: {_id, name, email, role}});

    });


}

exports.signout = (req, res) => {
    res.clearCookie('t')
    res.json({message:"success"})

};

exports.requireSignin = expressJwt({
    secret: process.env.JWT_SECRET,
    userProperty: "auth"

});

exports.isAuth = (req, res, next)=>{
    let user = req.profile && req.auth && req.profile._id == req.auth._id
        if(!user) {
            return res.staus(403).json({
                error: "Access denied"
            });
        }
        next();
};

