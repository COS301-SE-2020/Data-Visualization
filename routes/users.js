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
    let userPassword = checkUserPassword(req.body.password);
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
    let userPassword = checkUserPassword(req.body.password);

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
function checkName(userName){
    // Do user name validation
}
function checkUserEmail(userEmail){
    // Do user email validation
}
function checkUserPassword(userPassword){
    // Do user password validation
}

module.exports = router;
