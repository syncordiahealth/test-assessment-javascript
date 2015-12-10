# Test Assessment for "Senior Software Engineer — JavaScript"

Implement password management application that allows the user to change the password for the selected services.

You can find UI mockups in [mockup.pdf](mockup/mockup.pdf) (but you are not obliged to follow it).

Send the pull request when you are ready. If you have any comments or instructions - write them to [COMMENTS.md](COMMENTS.md).


## Authentication
Before the user starts working with the system, he must log in. Use '/api/user/login' to authenticate user. Any login === password combination is valid (e.g. { login: 'johngold', password: 'johngold' }).

In the response you will receive an authorization token. All following requests require authorization token in 'Authorization' header. If the token has expired (back-end will respond with 401 status code) - the application should prompt the user to re-login and restore the work without loss of form data.

The user should be able to change login by clicking on 'Sign off' button.


## Change password
Use '/api/services' to get the list of services.
Application must ensure that new password satisfies the following restrictions:
- Min length: 3 symbols.
- Max length: 30 symbols.
- There is at least 1 character in lowercase.
- There is at least 1 character in UPPERCASE.
- There is at least 1 special character: !@#$%^&*
- There are no forbidden characters: <>'"`

Use '/api/services/passwords' to submit the new password and a list of affected services. There is a chance that server will fail to change the password for some services. In this case, the application should allow the user to make another attempt for these services.


## Bonuses
- You can use any JavaScript framework, but angular/angular2 prefered.
- TypeScript / ES6.
- Unit tests.
- Build scripts.
- Module loader.
- Good UX & UI.

## API
### Authentication
```
POST: '/api/user/login'
request:
{
	login: string;
	password: string;
}
response:
{
	token: string; // Authorization token.
	errors: {
		login: string;
		password: string;
		common: string;
	}
}
e.g.:
$.ajax({
	type: 'POST',            
	url: 'http://localhost:8080/api/user/login',
	data: { login: 'johngold', password: 'johngold' }
});
```

### Get services list
```
GET: '/api/services'
response:
{
	services: {
		id: string;
		name: string;
	}[];
	errors: {
		common: string;
	}
}
e.g.:
$.ajax({
	type:'GET',
	url: 'http://localhost:8080/api/services',
	beforeSend: function (request)
	{
	    request.setRequestHeader('Authorization', 'NjRkNDA0M2ItOTJjZi00OGVlLThmZjYtZGQ5ODM5ZWQxZDI4');
	}            
});
```

### Change passwords
```
POST: '/api/services/passwords'
request:
{
	password: string;
	services: string[]; // services ID's.
}
response:
{
	errors: {		
		password: string;
		[service:string]: string; // e.g. { 'google': 'Failed to change google password' }
		common: string;
	}
}
e.g.:
$.ajax({
	type:'POST',
	url: 'http://localhost:8080/api/services/passwords',
	data: { password: 'jOhnG@ld', services: ['google', 'ldap'] },
	beforeSend: function (request)
	{
	    request.setRequestHeader('Authorization', 'NjRkNDA0M2ItOTJjZi00OGVlLThmZjYtZGQ5ODM5ZWQxZDI4');
	}
});
```
