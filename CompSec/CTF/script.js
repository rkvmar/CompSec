//MAIN
const urlParams = new URLSearchParams(window.location.search);
user = urlParams.get('user');
auth = urlParams.get('auth');

if (user == null && window.location.pathname == "/") {
    window.location.href = "/login";
}
//LOGIN
if (window.location.pathname == "/login") {
    document.querySelector('button').addEventListener('click', () => {
        let username = document.querySelector('#username').value;
        let password = document.querySelector('#password').value;
        sendRequest(username, password);
    });


function sendRequest(username, password) {
    let xhr = new XMLHttpRequest();
    xhr.open('POST', '/login', true);
    xhr.setRequestHeader('Content-Type', 'application/json');
    let body = JSON.stringify({ username, password });
    xhr.send(body);
    xhr.onload = () => {
        console.log(xhr.responseText);
        let response = JSON.parse(xhr.responseText);
        if(response.message === 'Login successful') {
            window.location.href = response.redirect;
        } else if (response.message == 'Incorrect username or password') {
            document.querySelector('.error-container').innerText = response.message;
        }
    }
}

document.querySelector('#forgot-password').addEventListener('click', () => {
    let xhr = new XMLHttpRequest();
    xhr.open('GET', '/forgot-password', true);
        xhr.send();
        xhr.onload = () => {
            document.querySelector('.error-container').innerText = xhr.responseText;
        }
    });
}   
//ADMIN
if (window.location.pathname == "/admin/") {
    auth = urlParams.get('auth');
    xhr = new XMLHttpRequest();
    xhr.open('GET', '/admin/auth?auth=' + auth, true);
    xhr.onload = function() {
        if(xhr.responseText == 'no'){
            console.log('no.');
        }
        if(xhr.responseText == 'yes'){
            script = document.createElement('script');
            script.src = '/admin.js?auth=' + auth;
            document.body.appendChild(script);
            script.onload = function() {
                loadAdmin();
            };
        }
    }
    xhr.send();
}
//FILES
function showFiles() {
    document.getElementById('auth').style.display = 'none';
    document.getElementById('files').style.display = 'block';
    let fileList = document.getElementById('fileList');
    let xhr = new XMLHttpRequest();
    xhr.open('GET', '/filelist', true);
    xhr.onload = () => {
        let files = JSON.parse(xhr.responseText);
        for (let file of files) {
            if (!['style.css', 'script.js', 'index.html'].includes(file)) {
                let a = document.createElement('a');
                a.textContent = '/' + file;
                a.href = '/files/' + file;
                fileList.appendChild(a);
            }
        }
    }
    xhr.send();
}
//CLIENT
if (window.location.pathname == "/client/") {
    let money = 0;
    xhr = new XMLHttpRequest();
    xhr.open('GET', '/client/auth?auth=' + auth, true);
    xhr.onload = function() {
        if(xhr.responseText == 'no'){
            console.log('no.');
            window.location.href = '/login';
        }
        if(xhr.responseText == 'yes'){
            console.log('yes.');
            let cash = document.createElement('h1');
            cash.id = 'cash';
            cash.className = 'centertext';
            cash.innerText = 'You have given us ' + money + ' dollars';
            document.body.appendChild(cash);
        }
    }
    xhr.send();
    function sendmoney() {
        money += 100;
        cash.innerText = 'You have given us ' + money + ' dollars';
    }
}
