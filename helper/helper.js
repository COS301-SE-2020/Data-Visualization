function error(res, err) {
	const status = err.status || 400;
	const message = err.error || 'Unkown Error';
	const hint = err.hint || 'No hint provided';

	console.error(err);
	res.status(status).json({ error: message, hint });
}

const LogAuthUsers = (users) => {
	console.log('=====================================');
	console.log(
		'USERS',
		Object.keys(users).map((key) => `${key} : ${users[key].email}`)
	);
	console.log('=====================================');
};

const LogAuthKeys = (keys) => {
	console.log('=====================================');
	console.log(
		'KEYS',
		Object.keys(keys).map((email) => `${email} : ${keys[email]}`)
	);
	console.log('=====================================');
};

const LogReqParams = (req) => {
	console.log('=====================================');
	console.log('METHOD\t', req.method);
	console.log('BODY\t', req.body);
	console.log('QUERY\t', req.query);
	console.log('=====================================');
};

const LogFetchedSources = (datasources) => {
	console.log('================================================');
	console.log('Meta Data retrieved for sources:');
	console.log(datasources);
	console.log('================================================');
};

module.exports = { LogAuthUsers, LogAuthKeys, LogReqParams, LogFetchedSources, error };
