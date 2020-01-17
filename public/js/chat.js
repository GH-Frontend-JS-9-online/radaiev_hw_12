 let tokenGlobal;
 let userIdGlobal;
 let userRecipientId;
 let idNewThreadGlobal;
 let arrayUsersGlobal;

 function CreateUserForSignUP(email, password) {
 	this.email= email;
 	this.password = password;
 }

  function pullDataFromForm() {
 	let email = form.email.value;
 	let password = form.password.value;

 	return new CreateUserForSignUP(email, password);
 }

// == Log in ==
 function logInUser() {
 	let urlLogIn = 'http://localhost:3000/api/users/login';

 	let headers = {
 		"Content-Type": "application/json",
 	}

 	let user = pullDataFromForm();

 	return fetch(urlLogIn, {
 		method: 'POST',
 		body: JSON.stringify(user),
 		headers: headers,
 	}).then(response => {
 		if(response.ok) {
 			let user =  response.json();
 			return {
 				token: response.headers.get('x-auth-token'),
 				user:  user,
 			}
 		}

 		return response.json().then(err => {
 			let e = new Error(err);
 			e.data = err;
 			throw e;
 		})
 	})
 }


btnLogIn.onclick = async () => {
		// == get toket == 
	 	tokenGlobal = await logInUser().then(data => {
			let signUp = document.querySelector('.signUp');
			let chat = document.querySelector('.inner');

			setTimeout(() => {
				signUp.style.display = 'none';
				chat.style.display = 'block';
			 }, 500);

			console.log(data);
			return data.token;
		}).catch(err => {
			console.log(err);
			formError.innerHTML = err;
		})
		// == get id ==
		userIdGlobal = await logInUser()
		.then(data => data.user)
		.then(user => user._id);


		// == show user == 
		let arrayUsers = await showUsers();
		
		arrayUsers.forEach((item) => {
			if(userIdGlobal == item._id) {
		  		let blockInfo = document.querySelector('.messenger_interlocutor-info');
		  		blockInfo.innerHTML = `<div class="messenger_interlocutor-info_photo">
								<img src="img/messenger/avatar.png" alt="">
							</div>
							<div class="messenger_interlocutor-info_name">
								${item.name}
							</div>
							<div class="messenger_interlocutor-info_position">
								${item.position}
							</div>
							<div class="messenger_interlocutor-info_specific">
								${item.description}
							</div>
							<div class="messenger_interlocutor-info_email">
								<span>Email</span>
								${item.email}
							</div>
							<div class="messenger_interlocutor-info_phone">
								<span>Phone</span>
								${item.phone}
							</div>
							<div class="messenger_interlocutor-info_adress">
								<span>Adress</span>
								${item.address}
							</div>
							<div class="messenger_interlocutor-info_organization">
								<span>Organization</span>
								${item.organization}
							</div>`;
			}
		});

		//await chackingNewPosts();
		await updateAside();
}

// == update and show aside == 
async function updateAside() {
	let ull = document.querySelector('.messenger_contacts > ul');
	let arrayAllThreads = await getAllThreads();
	console.log('Помлучение массива комнат/тем');
	console.log(arrayAllThreads);
	let ulAside = document.querySelector('.aside');


		if(ulAside.children.length == 0) {

			arrayAllThreads.forEach((item) => {
				let name;
				item.users.forEach(item => {
					if(item.me == false) name = item.name;
				});

				if(item.length != 0) {
					if(item.last_message == "No messages yet") {
						let li = document.createElement('li');
						li.thread = item._id;
						li.dataset.idThread = item._id;
						li.className = "messenger_contacts_item";
						li.insertAdjacentHTML('beforeend', `<div class="messenger_contacts_item_user">
																<div class="messenger_contacts_item_inner">
																	<div class="messenger_contacts_item_user_photo">
																		<img src="img/messenger/avatar.png" alt="">
																	</div>
																	<div class="messenger_contacts_item_user_name">
																		${name}
																	</div>
																</div>

																<div class="messenger_contacts_item_date">
																	Today. 5:32 PM
																</div>
															</div>

															<div class="messenger_contacts_item_last-letter">
																Сообщений пока нет.
															</div>`);
						console.dir(li);
						ulAside.append(li);
					} else {
						let li = document.createElement('li');
						li.thread = item._id;
						li.dataset.idThread = item._id;
						li.className = "messenger_contacts_item";
						li.insertAdjacentHTML('beforeend', `<div class="messenger_contacts_item_user">
																<div class="messenger_contacts_item_inner">
																	<div class="messenger_contacts_item_user_photo">
																		<img src="img/messenger/avatar.png" alt="">
																	</div>
																	<div class="messenger_contacts_item_user_name">
																		${name}
																	</div>
																</div>

																<div class="messenger_contacts_item_date">
																	Today. 5:32 PM
																</div>
															</div>

															<div class="messenger_contacts_item_last-letter">
																${item.last_message.body}
															</div>`);
						console.dir(li);
						ulAside.append(li);
					}
				}

		});
	}else if (ulAside.children.length != 0) {
		arrayAllThreads.forEach((item) => {
			let name;
				item.users.forEach(item => {
					if(item.me == false) name = item.name;
				});
			let result = true;
				for(let i of ulAside.children) {
					if(i.dataset.idThread == item._id) {
						result = false;
						break;
					}
				}
			if(result) {
				if(item.last_message == "No messages yet") {
					let li = document.createElement('li');
					li.thread = item._id;
					li.dataset.idThread = item._id;
					li.className = "messenger_contacts_item";
					li.insertAdjacentHTML('beforeend', `<div class="messenger_contacts_item_user">
															<div class="messenger_contacts_item_inner">
																<div class="messenger_contacts_item_user_photo">
																	<img src="img/messenger/avatar.png" alt="">
																</div>
																<div class="messenger_contacts_item_user_name">
																	${name}
																</div>
															</div>

															<div class="messenger_contacts_item_date">
																Today. 5:32 PM
															</div>
														</div>

														<div class="messenger_contacts_item_last-letter">
															Сообщений пока нет.
														</div>`);
					console.dir(li);
					ulAside.append(li);
				} else {
					let li = document.createElement('li');
					li.thread = item._id;
					li.dataset.idThread = item._id;
					li.className = "messenger_contacts_item";
					li.insertAdjacentHTML('beforeend', `<div class="messenger_contacts_item_user">
															<div class="messenger_contacts_item_inner">
																<div class="messenger_contacts_item_user_photo">
																	<img src="img/messenger/avatar.png" alt="">
																</div>
																<div class="messenger_contacts_item_user_name">
																	${name}
																</div>
															</div>

															<div class="messenger_contacts_item_date">
																Today. 5:32 PM
															</div>
														</div>

														<div class="messenger_contacts_item_last-letter">
															${item.last_message.body}
														</div>`);
					console.dir(li);
					ulAside.append(li);
				}
			}		

		});
	}

	setTimeout(() => {updateAside()}, 1000);
}

function test() {
	let ulAside = document.querySelector('.aside');
	console.dir(ulAside);
	let arrChildren = ulAside.children;
	console.log(arrChildren.length)

}

chat.onclick = () => {
	test();
}




// == get messages form threads aside for chat == 
// async function getInfo(event) {
// 	if(event.target.dataset.idThread) {
	
// 	  console.log(users);
// 	  idNewThreadGlobal = event.target.thread;
//    	  await createInfoIntoChat(event);
// 	}
// }


// buttons.addEventListener('click',getInfo);


// == Get all threads ==
let urlThreads = 'http://localhost:3000/api/threads';
function getAllThreads() {
		let headers = {
		Authorization: tokenGlobal,
	}

	return fetch(urlThreads, {
		headers: headers,
	}).then(response => response.json());
}

getAllthrads.onclick = async () => {
	getAllThreads().then(data => console.log(data))
}

// == Show users ==
function showUsers() {
	let urlUsers = 'http://localhost:3000/users';

	return fetch(urlUsers).then(res => res.json());
}

showUsers().then(data => {
	let table = document.querySelector('.table');
	console.log(`Создан массив пользователей`);
	console.log(data);
	arrayUsersGlobal = data;

	for(let item of data) {
		let tr = document.createElement('tr');
		tr.dataset.id = item._id;
		tr.innerHTML = `<td>${item.name}</td><td>${item.email}</td>`;
		table.append(tr);
	}


})

// == Send message == 
function sendMessage(idThread, message) {
	let urlSendMess = 'http://localhost:3000/api/threads/messages';

	let headers = {
		Authorization: tokenGlobal,
		"Content-Type": "application/json",
	}

	let data = {
		"thread": {
			"_id": idThread, // id from threads
		},
		"message": {
			"body": message,
		}
	}

	return fetch(urlSendMess, {
		method: "POST",
		body: JSON.stringify(data),
		headers: headers,
	}).then(res => res.json());
}

send.onclick = () => {
	sendMessage().then(data => console.log(data));
};

// == get text form form == 
async function getText(event) {

	let textarea = document.querySelector('.messenger_chat_write_message_textarea');
	let MessageChat = document.querySelector('.messenger_chat_inner');

	if(event.key == "Enter") {

		if(!idNewThreadGlobal) {
			alert('Select user!');
			let popup = document.querySelector('.popup');
			popup.style.display = 'flex';

		}else {
			await sendMessage(idNewThreadGlobal, textarea.innerText);
			let arrAllThreads = await getAllThreads().then(data => data);

			arrAllThreads.forEach((item) => {
  				if(item._id == idNewThreadGlobal) {

  					if(item.last_message.user == userIdGlobal) {
  						let divSender = document.createElement('div');
  						divSender.className = 'messenger_chat_sender';

  						divSender.innerHTML = `	<div class="messenger_chat_sender_mess">
  													<div class="messenger_chat_sender_mess_text">
  														${item.last_message.body}
  													</div>
  													<div class="messenger_chat_sender_avatar">
  														<img src="img/messenger/avatar.png" alt="">
  													</div>
  												</div>
  												<div class="messenger_chat_sender_mess_date">
  													${item.last_message.created_at}
  												</div>`;
  						MessageChat.append(divSender);
  					} else {
  						let divRecipient = document.createElement('div');
  						divRecipient.className = 'messenger_chat_recipient';

  						divRecipient.innerHTML = `	<div class="messenger_chat_recipient_mess">

  													<div class="messenger_chat_recipient_avatar">
  														<img src="img/messenger/avatar.png" alt="">
  													</div>
  													<div class="messenger_chat_recipient_mess_text">
  														${item.last_message.body}
  													</div>
  												</div>
  												<div class="messenger_chat_recipient_mess_date">
  													${item.last_message.created_at}
  												</div>`;
  						MessageChat.append(divRecipient);
  					}

  				}
			});

		textarea.innerText = "";
	}
 
 }
}

document.addEventListener('keydown', getText);


// == Create a thread == 
function createThread(userId) {
	let urlCreateThread = 'http://localhost:3000/api/threads';

	let headers = {
		Authorization: tokenGlobal,
		"Content-Type": "application/json",
	}

	let user = {
		"user": {
			"_id": userId,
		}
	}

	return fetch(urlCreateThread, {
		method: "POST",
		body: JSON.stringify(user),
		headers: headers,
	}).then(res => res.json())
}

iconLetter.onclick = () => {
	createThread().then(data => console.log(data));
}

// == Retrieve all threads == 
function retrieveAllThreads() {
	let urlAllThreads = 'http://localhost:3000/api/threads';

	let headers = {
		Authorization: tokenGlobal,
	}

	return fetch(urlAllThreads, {
		headers: headers,
	}).then(res => res.json())
}

// == get id for create chat == 
 function getIdForChat(event) {

		let nameUser = document.querySelector('.Recipient');
		nameUser.innerHTML = event.path[1].children[0].innerText;

		userRecipientId = event.path[1].dataset.id;
}

btnTableUsers.addEventListener('click', getIdForChat);


// == create chat with user Recipient == 
async function createChat() {

	idNewThreadGlobal = await createThread(userRecipientId)
	.then(data => data._id);
	console.log(idNewThreadGlobal);
	let popup = document.querySelector('.popup');
	popup.style.display = 'none';

	let arrMessages = await getMessFromThread(idNewThreadGlobal).then(data => data.messages);

	console.log(arrMessages);
	let MessageChat = document.querySelector('.messenger_chat_inner');

	if(arrMessages.length == 0) {
		MessageChat.innerHTML = '<div class="textInfo">Write anything!</div>';
	}

}

createNewChat.addEventListener('click', createChat);


// == get messages form thread == 
function getMessFromThread(id) {
	let url = `http://localhost:3000/api/threads/messages/${id}`;

	let headers = {
		Authorization: tokenGlobal,
	}

	return fetch(url, {
		headers: headers,
	}).then(res => res.json());
}

getMessages.onclick = async () => {
	await getMessFromThread(idNewThreadGlobal).then(data => console.log(data))
}

// == create info into chat == 
async function getIdThreadFromAside(event) {
	if(event.target.dataset.idThread) {
		let MessageChat = document.querySelector('.messenger_chat_inner');
		MessageChat.innerHTML = "";
		console.log('klick');
		let arrMessages = await getMessFromThread(event.target.dataset.idThread).then(data => data.messages);
		console.log(`получаем массив сообщений с комнаты`);
		console.log(arrMessages);
		idNewThreadGlobal = event.target.dataset.idThread;
		console.log('проверяем глобальную переменную');
		console.log(idNewThreadGlobal);
		if(arrMessages.length == 0) {
			alert('is ampty');
			MessageChat.innerHTML = '<div class="textInfo">Write anything!</div>';
		}

		arrMessages.forEach((item) => {
			if(item.user == userIdGlobal) {
				let divSender = document.createElement('div');
				divSender.className = 'messenger_chat_sender';

				divSender.innerHTML = `	<div class="messenger_chat_sender_mess">
											<div class="messenger_chat_sender_mess_text">
												${item.body}
											</div>
											<div class="messenger_chat_sender_avatar">
												<img src="img/messenger/avatar.png" alt="">
											</div>
										</div>
										<div class="messenger_chat_sender_mess_date">
											${item.created_at}
										</div>`;
				MessageChat.prepend(divSender);
			} else {
				let divRecipient = document.createElement('div');
				divRecipient.className = 'messenger_chat_recipient';

				divRecipient.innerHTML = `	<div class="messenger_chat_recipient_mess">

											<div class="messenger_chat_recipient_avatar">
												<img src="img/messenger/avatar.png" alt="">
											</div>
											<div class="messenger_chat_recipient_mess_text">
												${item.body}
											</div>
										</div>
										<div class="messenger_chat_recipient_mess_date">
											${item.created_at}
										</div>`;
				MessageChat.prepend(divRecipient);
			}
		});		
	}
}

buttons.addEventListener('click',getIdThreadFromAside);

//== chacking for new posts ==
async function chackingNewPosts() {
	if(idNewThreadGlobal) {
		let arrAllThreads = await getAllThreads().then(data => data);
		let MessageChat = document.querySelector('.messenger_chat_inner');

		await arrAllThreads.forEach((item) => {
			if(item._id == idNewThreadGlobal && item.last_message != "No messages yet") {
				console.log('условие не равно - No messages yet ');
				if(item.last_message.user != userIdGlobal) {
					console.log('условие не равно - ади пользователя ');
					let divChat = document.querySelector('.messenger_chat_inner');

					if(divChat.lastElementChild.className == "messenger_chat_recipient"
						&& divChat.lastElementChild.children[0].children[1].innerText != item.last_message.body) {
							console.log('условие не равно - проверка детей');
							let divRecipient = document.createElement('div');
							divRecipient.className = 'messenger_chat_recipient';

							divRecipient.innerHTML = `	<div class="messenger_chat_recipient_mess">

														<div class="messenger_chat_recipient_avatar">
															<img src="img/messenger/avatar.png" alt="">
														</div>
														<div class="messenger_chat_recipient_mess_text">
															${item.last_message.body}
														</div>
													</div>
													<div class="messenger_chat_recipient_mess_date">
														${item.last_message.created_at}
													</div>`;
							divChat.append(divRecipient);
					} else if(divChat.lastElementChild.className == "messenger_chat_sender"){
						console.log('условие не равно - проверка детей');
						let divRecipient = document.createElement('div');
						divRecipient.className = 'messenger_chat_recipient';

						divRecipient.innerHTML = `	<div class="messenger_chat_recipient_mess">

													<div class="messenger_chat_recipient_avatar">
														<img src="img/messenger/avatar.png" alt="">
													</div>
													<div class="messenger_chat_recipient_mess_text">
														${item.last_message.body}
													</div>
												</div>
												<div class="messenger_chat_recipient_mess_date">
													${item.last_message.created_at}
												</div>`;
						divChat.append(divRecipient);
					}
					
				}
			}
		});
		console.log(arrAllThreads);
	}
	console.log('произошел запросс');

	//await setTimeout(()=> chackingNewPosts(), 1000);
}

setInterval(() => {chackingNewPosts()}, 1000);


// == Buttons for popup
let btnGetUsers = document.querySelector('.btn_new-coversation');
btnGetUsers.onclick = () => {
	let popup = document.querySelector('.popup');
	popup.style.display = 'flex';
}

iconUser.onclick = () => {
	let popup = document.querySelector('.popup');
	popup.style.display = 'flex';
}

closePopup.onclick = () => {
	let popup = document.querySelector('.popup');
	popup.style.display = 'none';
}