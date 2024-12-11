const express = require('express');
const app = express();
const port = 3000;
const fs = require('fs');
const { exec } = require('child_process');
const userdata = require('./files/userdata.json');
const crypto = require('crypto');
let authdata = {};
for (let user in userdata) {
    authdata[user] = {
        auth: crypto.randomBytes(16).toString('hex')
    }
}
const flag = 'how_to_hack_appel?'
const bonus = 'sofihs!'
// Middleware to set Content Security Policy
app.use((req, res, next) => {
    res.setHeader("Content-Security-Policy", "default-src 'self'; script-src 'self' 'unsafe-inline'; style-src 'self' 'unsafe-inline';");
    next();
});

// Middleware to parse JSON and URL-encoded bodies
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(express.static(__dirname + '/script.js'));
app.use(express.static(__dirname + '/main'));
app.use(express.static(__dirname + '/login'));
app.use(express.static(__dirname + '/files'));
app.use(express.static(__dirname + '/admin'));
app.use(express.static(__dirname + '/rules'));
app.get('/admin.js', (req, res) => {
  for (let user in authdata) {
    if (authdata[user].auth === req.query.auth && userdata[user].role === 'admin') {
      res.sendFile(__dirname + '/admin.js');
      return;
    }
  }
  res.send('no');
});
app.get('/', (req, res) => {
  res.sendFile(__dirname + '/main/index.html');
});
app.get('/login', (req, res) => {
  res.sendFile(__dirname + '/login/login.html');
});
app.get('/admin', (req, res) => {
  res.sendFile(__dirname + '/admin/admin.html');
});
app.get('/files', (req, res) => {
  res.redirect('/files/index.html');
});
app.get('/files/*', (req, res) => {
  const filePath = req.params[0];
  res.sendFile(__dirname + '/files/' + filePath, (err) => {
    if (err) {
      res.status(err.status).send('404: File not found');
    }
  });
});

app.get('/filelist', (req, res) => {
  res.send(JSON.stringify(fs.readdirSync(__dirname + '/files')));
});
app.post('/login', (req, res) => {
  console.log(req.body);
  console.log(userdata[req.body.username]);
  console.log(authdata[req.body.username]);
  if (req.body.username in userdata && userdata[req.body.username].password === req.body.password) {
    if (userdata[req.body.username].role === 'admin') {
      res.send(JSON.stringify({message: 'Login successful', redirect: '/admin/?auth=' + authdata[req.body.username].auth}));
    } else {
      res.send(JSON.stringify({message: 'Login successful', redirect: '/client/?auth=' + authdata[req.body.username].auth}));
    }
  } else {
    res.send(JSON.stringify({message: 'Incorrect username or password', redirect: null}));
  }
});

app.get('/forgot-password', (req, res) => {
  res.send('error: cannot get /files/forgot-password.asm');
});

app.get('/admin/auth', (req, res) => {
  for (let user in authdata) {
    if (authdata[user].auth === req.query.auth && userdata[user].role === 'admin') {
      res.send('yes');
      return;
    }
  }
  res.send('no');
});
app.get('/client', (req, res) => {
  res.sendFile(__dirname + '/client.html');
});
app.get('/client/auth', (req, res) => {
  for (let user in authdata) {
    if (authdata[user].auth === req.query.auth) {
      res.send('yes');
      return;
    }
  }
  res.send('no');
});
app.get('/userfiles', (req, res) => {
  res.sendFile(__dirname + '/userfiles.html');
});
app.get('/userfiles/files', (req, res) => {
  for (let user in authdata) {
    if (authdata[user].auth === req.query.auth) {
      res.send(JSON.stringify(fs.readdirSync(__dirname + '/userfiles/' + user)));
      return;
    }
  }
  res.send('no');
});
app.get('/userfiles/files/*', (req, res) => {
  const filePath = req.params[0];
  for (let user in authdata) {
    if (authdata[user].auth === req.query.auth) {
      res.sendFile(__dirname + '/userfiles/' + user + '/' + filePath, (err) => {
        if (err) {
          res.status(err.status).send('404: File not found');
        }
      });
      return;
    }
  }
  res.send('no');
});
app.get('/rules', (req, res) => {
  res.sendFile(__dirname + '/rules/rules.html');
});
app.post('/rules/submit', (req, res) => {
  console.log(req.body);
  result = {flag: false, bonus: false};
  if (req.body.flag === flag) {
    result.flag = true;
  }
  if (req.body.bonus === bonus) {
    result.bonus = true;
  }
  if (req.body.bonus === '') {
    result.bonus = 'none';
  }
  res.send(JSON.stringify(result));
});
app.get('/script.js', (req, res) => {
  res.sendFile(__dirname + '/script.js');
});
app.get('/style.css', (req, res) => {
  res.sendFile(__dirname + '/style.css');
});
app.get('/flag', (req, res) => {
  let flag = fs.readFileSync(__dirname + '/flag.txt', 'utf8');
  console.log(req.headers);
  for (let user in authdata) {
    if (authdata[user].auth === req.headers.authorization) {
      res.send(flag);
      return;
    }
  }
  res.send('no');
});
app.get('/decrypt', (req, res) => {
  res.sendFile(__dirname + '/decrypt/decrypt.html');
});
app.get('/decrypt.js', (req, res) => {
  res.sendFile(__dirname + '/decrypt.js');
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});