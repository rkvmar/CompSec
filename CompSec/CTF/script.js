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
            let cashContainer = document.getElementById('cashContainer');
            cashContainer.appendChild(cash);
        }
    }
    xhr.send();
    function sendmoney() {
        money += 100;
        cash.innerText = 'You have given us ' + money + ' dollars';
    }
}
//USERFILES
if (window.location.pathname == "/userfiles") {
    let fileList = document.getElementById('fileList');
    let files = document.getElementById('files');
    files.style.display = 'block';
    xhr = new XMLHttpRequest();
    xhr.open('GET', '/userfiles/files?auth=' + auth, true);
    xhr.onload = () => {
        let files = JSON.parse(xhr.responseText);
        for (let file of files) {
            if (!['style.css', 'script.js', 'index.html'].includes(file)) {
                let a = document.createElement('a');
                a.textContent = '/' + file;
                a.href = '/userfiles/files/' + file + '?auth=' + auth;
                fileList.appendChild(a);
            }
        }
    }
    xhr.send();
}
//RULES
function doConfetti() {
    const count = 400,
    defaults = {
      origin: { y: 0.7 },
    };
  
  function fire(particleRatio, opts) {
    confetti(
      Object.assign({}, defaults, opts, {
        particleCount: Math.floor(count * particleRatio),
      })
    );
  }
  
  fire(0.25, {
    spread: 26,
    startVelocity: 55,
  });
  
  fire(0.2, {
    spread: 60,
  });
  
  fire(0.35, {
    spread: 100,
    decay: 0.91,
    scalar: 0.8,
  });
  
  fire(0.1, {
    spread: 120,
    startVelocity: 25,
    decay: 0.92,
    scalar: 1.2,
  });
  
  fire(0.1, {
    spread: 120,
    startVelocity: 45,
  });
}
function fishConfetti() {
    const count = 400,
    defaults = {
      origin: { y: 0.7 },
      shapes: ["emoji"],
      shapeOptions: {
        emoji: {
          value: ["🐟", "🐠"],
        },
      },
      scalar: 2.2,
    };
  
  function fire(particleRatio, opts) {
    confetti(
      Object.assign({}, defaults, opts, {
        particleCount: Math.floor(count * particleRatio),
      })
    );
  }
  
  fire(0.25, {
    spread: 26,
    startVelocity: 55,
  });
  
  fire(0.2, {
    spread: 60,
  });
  
  fire(0.35, {
    spread: 100,
    decay: 0.91,
    scalar: 0.8,
  });
  
  fire(0.1, {
    spread: 120,
    startVelocity: 25,
    decay: 0.92,
    scalar: 1.2,
  });
  
  fire(0.1, {
    spread: 120,
    startVelocity: 45,
  });
}


if (window.location.pathname == "/rules") {
    document.getElementById('submit').addEventListener('click', () => {
        let flag = document.getElementById('flag').value;
        let bonus = document.getElementById('bonus').value;
        xhr = new XMLHttpRequest();
        xhr.open('POST', '/rules/submit', true);
        xhr.setRequestHeader('Content-Type', 'application/json');
        xhr.send(JSON.stringify({flag, bonus}));
        xhr.onload = () => {
            console.log(xhr.responseText);
            let result = JSON.parse(xhr.responseText);
            if(result.flag){
                document.getElementById('result').innerText = 'Flag Correct!';  
                doConfetti();
            } else {
                document.getElementById('result').innerText = 'Flag Incorrect';
            }   
            if(result.bonus == 'none'){
                document.getElementById('bonusresult').innerText = ''
            } else if(result.bonus){
                document.getElementById('bonusresult').innerText = 'Bonus Correct!';
                fishConfetti();
            } else {
                document.getElementById('bonusresult').innerText = 'Bonus Incorrect';
            }
        }
    });
}