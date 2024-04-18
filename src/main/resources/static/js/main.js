'use strict';

const usernamePage = document.querySelector('#username-page');
const chatPage = document.querySelector('#chat-page');
const usernameForm = document.querySelector('#username-form');
const messageForm = document.querySelector('#message-form');
const messageInput = document.querySelector('#message');
const connectingElement = document.querySelector('.connecting');
const chatArea = document.querySelector('#chat-messages');
const logout = document.querySelector('#logout');

let stompClient = null;
let nickName = null;
let fullName = null;
let selectedUser = null;

function connect(event) {
    nickName = document.querySelector('#nickname');
    fullName = document.querySelector('#fullname');

    if (nickName && fullName) {
        usernamePage.classList.add('hidden');
        chatPage.classList.remove('hidden');

        const socket = new SockJS('/ws');
        stompClient = Stomp.over(socket);

        stompClient.connect({}, onConnected, onError);
    }

    event.preventDefault();
}

function onConnected() {
    stompClient.subscribe('/user/${nickname}/queue/messages', onMessageReceived);
    stompClient.subscribe('/user/public', onMessageReceived);

    //register the connected user
    stompClient.send('/app/user.addUser',
        {},
        JSON.stringify({nickName: nickName, fullName: fullName, status: 'ONLINE'}));

    //find and display the connected users
    findAndDisplayConnectedUsers().then();

}

function findAndDisplayConnectedUsers() {
    const connectedUserResponse = await fetch('/users');
    let connectedUsers = await connectedUserResponse.json();

    connectedUsers = connectedUsers.filter(user => user.nickName !== nickName);
    const connectedUserList = document.getElementById('connected-users');
    connectedUserList.innerHTML = '';

    connectedUsers.forEach(user => {
        appendUserElement(user, connectedUserList));
        //check if it is not the last element
        if (connectedUsers.index(user) < connectedUsers.length-1) {
            //create separator
            const separator = document.createElement('li');
            separator.classList.add('separator');
            connectedUserList.appendChild(separator);
        }

    });
}

function appendUserElement(user, connectedUserList) {
    const listItem = document.createElement('li');
    listItem.classList.add('user-item');
    listItem.id = user.nickName;

    const userImage = document.createElement('img');
    userImage.src = '../img/user_icon.png';
    userImage.alt = user.fullName;

    const userNameSpan = document.createElement('span');
    userNameSpan.textContent = user.fullName;

    const receivedMsgs = document.createElement('span');
    receivedMsgs.textContent = ;
    receivedMsgs.classList.add('nbr-msg', 'hidden');

    listItem.appendChild(userImage);
    listItem.appendChild(userNameSpan);
    listItem.appendChild(receivedMsgs);

    connectedUserList.appendChild(listItem);
}

function onMessageReceived() {
}

function onError() {
}


usernameForm.addEventListener('submit', connect, true);