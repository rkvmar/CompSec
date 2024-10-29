let usertxt = document.getElementById("usertxt");
let permstxt = document.getElementById("permissions");
let userinput = document.getElementById('userinput');
let user = '';
let users = ["sam", "wes", "jeffery", "jacob"];
let userdata = {}
let messages = [];
let bannedUsers = [];

function login() {
    const xhr = new XMLHttpRequest();
    xhr.open("POST", "http://localhost:3000/login");
    xhr.setRequestHeader("Content-Type", "application/json; charset=UTF-8");
    const body = JSON.stringify({
        user: userinput.value.toLowerCase()
    });
    console.log(body)
    xhr.onload = () => {
        if (xhr.readyState == 4 && xhr.status == 200) {
            userdata = JSON.parse(xhr.responseText);
            console.log(userdata);
            usertxt.innerText = 'logged in as: ' + userinput.value.toLowerCase();
            user = userinput.value.toLowerCase();
            userinput.value = '';
            updateChatDisplay();
            if(userdata.canManageServer){
                document.getElementById('server').innerHTML = '<button onclick="crashServer()">crash server</button>';
            }
        } else {
            window.alert('no user found');
        }
    };
    xhr.send(body);
}

let messagebox = document.getElementById("msgtxt");

function send() {
    if(messagebox.value != ''){
    if (user != '') {
        const xhr = new XMLHttpRequest();
        xhr.open("POST", "http://localhost:3000/data");
        xhr.setRequestHeader("Content-Type", "application/json; charset=UTF-8");
        const body = JSON.stringify({
            userId: user,
            message: messagebox.value,
            auth: userdata.key
        });
        xhr.onload = () => {
            if (xhr.readyState == 4 && xhr.status == 200) {
                messages = JSON.parse(xhr.responseText);
                console.log(messages);
                updateChatDisplay();
            } else {
                console.log(`Error: ${xhr.status}`);
            }
        };
        xhr.send(body);
        messagebox.value = '';
    } else {
        window.alert("you are not logged in");
    }
} else {
    window.alert("no message")
}
}

function deleteMessage(mid) {
    if (document.getElementById(mid).classList.contains(user)) {
        document.getElementById(mid).remove();
        const xhr = new XMLHttpRequest();
        xhr.open("POST", "http://localhost:3000/remove");
        xhr.setRequestHeader("Content-Type", "application/json; charset=UTF-8");
        const body = JSON.stringify({
            userId: user,
            messageId: parseInt(mid),
            auth: userdata.key
        });
        xhr.onload = () => {
            if (xhr.readyState == 4 && xhr.status == 200) {
                messages = JSON.parse(xhr.responseText);
                console.log(messages);
                updateChatDisplay();
            } else {
                console.log(`Error: ${xhr.status}`);
            }
        };
        xhr.send(body);
    }
}


function fetchData() {
    const xhr = new XMLHttpRequest();
    xhr.open("GET", "http://localhost:3000/data");
    xhr.onload = () => {
        if (xhr.status === 200) {
            messages = JSON.parse(xhr.responseText);
            updateChatDisplay();
        } else {
            console.log(`Error: ${xhr.status}`);
        }
    };
    xhr.send();
    if(userdata.canManageUsers){
        const xhr2 = new XMLHttpRequest();
        xhr2.open("GET", "http://localhost:3000/banned");
        xhr2.onload = () => {
            if (xhr2.status === 200) {
                bannedUsers = JSON.parse(xhr2.responseText);
            } else {
                console.log(`Error: ${xhr2.status}`);
            }
        }; 
        xhr2.send();
    }
}
function crashServer(){
    const xhr = new XMLHttpRequest();
    xhr.open("POST", "http://localhost:3000/crash");
    xhr.setRequestHeader("Content-Type", "application/json; charset=UTF-8");
    const body = JSON.stringify({
        userId: user,
        auth: userdata.key
    });
    xhr.send(body);
    document.getElementById('chat').innerHTML = '';
}
function banUser(userId){
    const xhr = new XMLHttpRequest();
    xhr.open("POST", "http://localhost:3000/ban");
    xhr.setRequestHeader("Content-Type", "application/json; charset=UTF-8");
    xhr.send(JSON.stringify({ban: userId, user: user, auth: userdata.key}));
    updateChatDisplay();
}
function unbanUser(userId){
    const xhr = new XMLHttpRequest();
    xhr.open("POST", "http://localhost:3000/unban");
    xhr.setRequestHeader("Content-Type", "application/json; charset=UTF-8");
    xhr.send(JSON.stringify({unban: userId, user: user, auth: userdata.key}));
    updateChatDisplay();
}
function updateChatDisplay() {
    document.getElementById('chat').innerHTML = '';
    messages.forEach(message => {
        let m = document.createElement('div');
        m.className = 'message';
        m.id = message.id;
        m.classList.add(message.userId);
        m.innerHTML = message.userId + ' ';
        if (message.userId === user) {
            m.innerHTML += '<button onclick="deleteMessage(' + message.id + ')">delete</button> ';
        }
        if(userdata.canManageUsers && message.userId != user){
            if(bannedUsers.includes(message.userId)){
                m.innerHTML += '<button onclick="unbanUser(\'' + message.userId + '\')">unban user</button> ';
            } else {
                m.innerHTML += '<button onclick="banUser(\'' + message.userId + '\')">ban user</button> ';
            }
        }
        m.innerHTML += "<div class='txt'>" + message.message + '</div>';
        m.style.backgroundColor = message.bgcolor;
        document.getElementById('chat').prepend(m);
    });
}

setInterval(fetchData, 1000);
