require('dotenv').config();
const express = require('express');
const router = express.Router();

const { Rest } = require('../controllers');

let loggedUsers = {};

router.post('/login', (req, res) => {
  if (Object.keys(req.body).length === 0){
    error(res, {error: 'Body Undefined'}, 400);
  }
   else if(!checkUserEmail(req.body.email)){
    error(res, { error: 'User Email Incorrect' }, 400);
  }
  else if (!checkUserPasswordLogin(req.body.password)){
    error(res, { error: 'User Password Incorrect' }, 400);
  }
  else{
    Rest.loginUser(
      req.body.email,
      req.body.password,
      (user) => {
        if (user === false) {
          res.status(401).json({ message: 'Failed to Log In User' });
        } else {
          // if (!req.session.sid) req.session.sid = {};
          // req.session.sid[user.apikey] = user;
          loggedUsers[user.apikey] = user;
          res.status(200).json({ message: 'Successfully Logged In User', apikey: user.apikey });
        }
      },
      (err) => error(res, err, 404)
    );
  }
});
router.post('/register', (req, res) => {
  if(Object.keys(req.body).length === 0){
    error(res, { error: 'Body Undefined' }, 400);
  }
  else if(!checkName(req.body.name)){
    error(res, { error: 'User Name Incorrect' }, 400);
  }
  else if (!checkName(req.body.surname)){
    error(res, { error: 'User Surname Incorrect' }, 400);
  }
  else if(!checkUserEmail(req.body.email)){
    error(res, { error: 'User Email Incorrect' }, 400);
  }
  else if (!checkUserPasswordRegister(req.body.password, req.body.confirmPassword, req.body.name)){
    error(res, { error: 'User Password Incorrect' }, 400);
  }
  else{
    Rest.registerUser(
      req.body.name,
      req.body.surname,
      req.body.email,
      req.body.password,
      (user) => {
        // if (!req.session.sid) req.session.sid = {};
        // req.session.sid[user.apikey] = user;
        loggedUsers[user.apikey] = user;
        res.status(200).json({ message: 'Successfully Registered User', apikey: user.apikey });
      },
      (err) => error(res, err,404)
    );
  }
});
router.post('/logout', (req, res) => {
  delete loggedUsers[req.body.apikey];
  res.status(200).json({ message: 'Successfully Logged out' });

  // req.session.destroy((err) => {
  //   if (err) {
  //     res.status(200).json({ message: 'Failed to Log out' });
  //   } else {
  //     if (req.session && req.session.sid) {
  //       res.clearCookie(sid);
  //     }
  //     res.status(200).json({ message: 'Successfully Logged out' });
  //   }
  // });
});

function error(res, err, status= 404) {
  console.error(err);
  res.status(status).json(err);
}

function checkName(name) {
  let re = /^\w+$/;
  let valid = true;
  if (name.trim().length === 0) {
    // name can not be blank
    valid = false;
  } else if (!re.test(name)) {
    valid = false;
  }
  return valid;
}
function checkUserEmail(email) {
  let emailReg = new RegExp(
    /^(("[\w-\s]+")|([\w-]+(?:\.[\w-]+)*)|("[\w-\s]+")([\w-]+(?:\.[\w-]+)*))(@((?:[\w-]+\.)*\w[\w-]{0,66})\.([a-z]{2,6}(?:\.[a-z]{2})?)$)|(@\[?((25[0-5]\.|2[0-4][0-9]\.|1[0-9]{2}\.|[0-9]{1,2}\.))((25[0-5]|2[0-4][0-9]|1[0-9]{2}|[0-9]{1,2})\.){2}(25[0-5]|2[0-4][0-9]|1[0-9]{2}|[0-9]{1,2})\]?$)/i
  );
  let valid = true;
  if (email.trim().length === 0) {
    // email required
    valid = false;
  } else if (!emailReg.test(email)) {
    //email does not exist
    valid = false;
  }
  return valid;
}
function checkUserPasswordLogin(password) {
  let valid = true;
  let re;
  if (password.trim().length === 0) {
    // password cannot be empty
    valid = false;
  } else {
    re = /^[0-9a-zA-Z!@#\$%\^&\*]{9,}$/;
    return re.test(password);
  }

  return valid;
}
function checkUserPasswordRegister(password, confirmPassword, name) {
  let valid = true;
  let re;
  if (password.trim().length === 0) {
    // password cannot be empty
    valid = false;
  }
  if (password !== '' && password === confirmPassword) {
    if (password.length < 8) {
      //password must be 8 letters
      valid = false;
    }
    if (password === name) {
      //Password must be different than name
      valid = false;
    }
    re = /[0-9]/;
    if (!re.test(password)) {
      valid = false;
      // password password must contain at least one number (0-9)
    }
    re = /[a-z]/;
    if (!re.test(password)) {
      valid = false;
      // password must contain at least one lowercase letter (a-z)!
    }
    re = /[A-Z]/;
    if (!re.test(password)) {
      valid = false;
      // password must contain at least one capital letter
    }
    re = /[!@#$%^&*]/;
    if (!re.test(password)) {
      valid = false;
      // password must contain at least one special character
    }
  } else {
    valid = false;
    //confirm password incorrect
  }
  return valid;
}
module.exports = { router, loggedUsers };
