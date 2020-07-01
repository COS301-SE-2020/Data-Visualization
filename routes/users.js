require('dotenv').config();
const express = require('express');
const router = express.Router();

const { Rest } = require('../controllers');
//TODO:
// login user
// create user
// logout uer
// do necessary regex
// store user details in session: firstname, lastname, email
router.use(express.urlencoded({ extended: true }));

router.use(session({
    store: new pgStore({
        pool : db.pg_pool,
        tableName : 'session'
    }),
    name: SESS_NAME,
    resave: false,
    saveUninitialized: false,
    secret: SESS_SECRET,
    cookie: {
        maxAge : SESS_LIFETIME,
        sameSite: true,
        secure: false //PRODUCTION => true
    }
}));

router.post('/user-login', (req, res) => {
    let userName = checkName(req.body.name);
    let userPassword = checkUserPasswordLogin(req.body.password);
    Rest.login(
        userName,
        userPassword,
        () => {
            res.status(200).json({ message: 'Successfully Logged In User' });
        },
        (err) => error(res, err)
    );
});
router.post('/user-register', (req, res) => {
    let userName = checkName(req.body.name);
    let userSurname = checkName(req.body.surname);
    let userEmail = checkUserEmail(req.body.email);
    let userPassword = checkUserPasswordRegister(req.body.password, req.body.password,req.body.name );

    Rest.register(
        userName,
        userSurname,
        userEmail,
        userPassword,
        () => {
            res.status(200).json({ message: 'Successfully Logged In User' });
        },
        (err) => error(res, err)
    );
});
router.post('/user-logout', (req, res) => {
   // Kill session and redirect ?
});

function error(res, err) {
    console.error(err);
    res.status(400).json({ message: 'Error Occurred' });
}
function checkName(name){
    let re = /^\w+$/;
    let valid = true;
    if (name.trim().length === 0) {
        // name can not be blank
        valid = false;
    } else if (!re.test(name)) {
        valid = false;
    }
    return valid
}
function checkUserEmail(email){
    let emailReg = new RegExp(/^(("[\w-\s]+")|([\w-]+(?:\.[\w-]+)*)|("[\w-\s]+")([\w-]+(?:\.[\w-]+)*))(@((?:[\w-]+\.)*\w[\w-]{0,66})\.([a-z]{2,6}(?:\.[a-z]{2})?)$)|(@\[?((25[0-5]\.|2[0-4][0-9]\.|1[0-9]{2}\.|[0-9]{1,2}\.))((25[0-5]|2[0-4][0-9]|1[0-9]{2}|[0-9]{1,2})\.){2}(25[0-5]|2[0-4][0-9]|1[0-9]{2}|[0-9]{1,2})\]?$)/i);
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
function checkUserPasswordLogin(userPassword){
    // Do user password validation
}
function checkUserPasswordRegister(password, confirmPassword, name){
    let valid = true;
    if (password.trim().length === 0) {
        // password cannot be empty
        valid = false;
    } else if (password !== "" && password === confirmPassword) {
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
        //confirm password
    }
    return valid;
}
module.exports = router;
