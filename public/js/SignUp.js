 function CreateUserForSignUP(name, email, password) {
 	this.name = name;
 	this.email= email;
 	this.password = password;
 }

 function pullDataFromForm() {
 	let name = form.name.value;
 	let email = form.email.value;
 	let password = form.password.value;

 	return new CreateUserForSignUP(name, email, password);
 }

 function signUpNewUser() {
 	let urlSignUp = 'http://localhost:3000/api/users';

 	let headers = {
 		"Content-Type": "application/json",
 	}

 	let user = pullDataFromForm()

 	return fetch(urlSignUp, {
 		method: "POST",
 		body: JSON.stringify(user),
 		headers: headers,
 	}).then(response => {
 		if(response.ok) return response.json();

 		return response.json().then(error => {
 			let e = new Error(error);
 			e.data = error;
 			throw e;

 		})
 	})
 }

 btnSignUp.onclick = () => {
 	signUpNewUser()
 	.then(data => {
 		console.log(data);
 		alert(`Вы зарегистрировали нового пользователя:
			id: ${data._id}
			name: ${data.name}
			Email: ${data.email} 
			Перезагрузите сервер, чтобы увидеть новых созданных пользователей!
 			`);
 		document.location.href = 'http://localhost:3000/chat.html';
 	})
 	.catch(err => {
 		console.log(err);
 		formError.innerHTML = err;
 		if(err == 'Error: User already exists') {
 			setTimeout(() => {
 				document.location.href = 'http://localhost:3000/chat.html';
 			}, 1000);
 		}
 	})
 }
