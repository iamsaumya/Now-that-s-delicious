const passport = require('passport')
const mongoose = require('mongoose')
const User = mongoose.model('User')
const crypto = require('crypto');
const promisify = require('es6-promisify')

exports.login = passport.authenticate('local',{
    failureRedirect: '/login',
    failureFlash: 'Failed Login',
    successFlash: 'You are now logged in!',
    successRedirect: '/'
});

exports.logout = (req,res) => {
    req.logout()
    req.flash('success','You are now logged out!')
    res.redirect('/')
}

exports.isLoggedIn = (req,res,next) => {
    if(req.isAuthenticated()){
        next();
        return;
    }
    else{
        req.flash('error','You must be logged in to do that!')
        res.redirect('/login')
    }
}

exports.forgot = async (req,res,next) => {
    const user = await User.findOne({email: req.body.email})

    console.log(user)

    if(!user){
        req.flash('error','No account with that email address exists!')
        return res.redirect('/login')
    }

    user.resetPasswordToken = crypto.randomBytes(20).toString('hex')
    user.resetPasswordExpires = Date.now() + 3600000

    await user.save()

    const resetURL = `http://${req.headers.host}/account/reset/${user.resetPasswordToken}`
    req.flash('success',`You have been emailed a password reset link. ${resetURL}`)
    res.redirect('/login')
}

exports.reset = async (req,res) => {
    const user = await User.findOne({
        resetPasswordToken: req.params.token,
        resetPasswordExpires: { $gt: Date.now()}
    })

    if(!user){
        req.flash('error','Password reset is invalid or has expired');
        return res.redirect('/login')
    }

    res.render('reset',{title: 'Reset Password'})
}

exports.confirmedPasswords = (req,res,next) => {
    if(req.body.password === req.body['password-confirm']){
        next();
        return;
    }
    req.flash('error','Passwords do not match');
    res.redirect('back');
}

exports.update = async (req,res) => {
    const user = await User.findOne({
        resetPasswordToken: req.params.token,
        resetPasswordExpires: { $gt: Date.now()}
    })

    if(!user){
        req.flash('error','Password reset is invalid or has expired');
        return res.redirect('/login')
    }

    const setPassword = promisify(user.setPassword,user);
    await setPassword(req.body.password)
    user.resetPasswordExpires = undefined;
    user.resetPasswordToken = undefined;

    const updateUser = await user.save()
    await req.login(updateUser)
    req.flash('Success','Nice! your password has been reset!');
    res.redirect('/')
}