var express = require('express');
var cors = require('cors')
var bodyParser = require('body-parser');
var buffer = require('buffer');
var Buffer = buffer.Buffer;

var app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cors());
app.use(express.static('public'));


var tokenLifetime = 3 * 60 * 1000; // 3 minutes


app.all('/api/services*', function (request, response, next) {
	var auhtorization = request.get('Authorization');

	if (!!auhtorization) {
		var tokenString = new Buffer(auhtorization, 'base64').toString('ascii');

		var token = JSON.parse(tokenString);
		if (!!token.expire && new Date(token.expire) > new Date()) {
			next();
			return;
		}
	}

	response.status(401).send({
		errors: {
			common: 'You are not authenticated.'
		}
	});
});


app.post('/api/user/login', function (request, response) {
	var data = request.body;

	if (!data.login) {
		return response.send({
			errors: {
				login: 'Login is required.'
			}
		});
	}

	if (!data.password) {
		return response.send({
			errors: {
				password: 'Password is required.'
			}
		});
	}	

	if (data.login === data.password) {
		var expire = new Date(new Date().getTime() + tokenLifetime);

		var tokenData = {
			login: data.login,
			expire: expire
		};

		var token = new Buffer(JSON.stringify(tokenData)).toString('base64');

		return response.send({
			token: token
		});
	} else {
		return response.status(401).send({
			errors: {
				common: 'Invalid credentials.'
			}
		});
	}
});


app.get('/api/services', function (request, response) {
	return response.send({
		services: [{
			id: 'google',
			name: 'Google'
		}, {
			id: 'office365',
			name: 'Office 365'
		}, { 
			id: 'ldap',
			name: 'LDAP' 
		}],
		errors: {}
	});
});


app.post('/api/services/passwords', function (request, response) {
	var data = request.body;

	if (!data.password) {
		return response.send({
			errors: {
				password: 'Password is required.'
			}
		});
	}

	if (!data.services || data.services.length === 0) {
		return response.send({
			errors: {
				common: 'At least 1 service is required.'
			}
		});		
	}

	var result = {};
	var errors = {};

	data.services.forEach(function (service) {
		var isChanged = Math.random() < 0.5;

		result[service] = isChanged;
		
		if (!isChanged) {
			errors[service] = 'Failed to change password.';
		}
	});

	return response.send({
		result: result,
		errors: errors
	});
});


var server = app.listen(8080, function () {
    console.log('Listening on port %s...', server.address().port);
});