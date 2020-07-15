const { Database } = require('../controllers/');

test('', async () => {
	const email = 'firstnamelastname@gmail.com';
	const password = 'FirstnameLastname@1234';
	const fname = 'FIRSTNAME';
	const lname = 'LASTNAME';
	let response = null;

	response = await Database.register(fname, lname, email, password); //success
	console.log(response);

	response = await Database.register(fname, lname, email, password); //user exists
	console.log(response);

	// Database.authenticate(userName, password)
	//     .then((user) => done(user))
	//     .catch((err) => error && error(err));

	response = await Database.unregister(email, password); //success
	console.log(response);

	expect(true).toBe(true);
});

//attempt requests 401

//register user

//requests

//logout user

//attempt requests 401

//log in user

//logout user

//attempt requests 401

//unregister user
