const express = require('express');
const cors = require('cors');
const app = express();
let messages = [];
let messageIdCounter = 0;

let userdata = {
    sam: {
        canSendMessage: true,
        canSendWaterCar: true,
        canDeleteMessage: true,
        canManageUsers: false,
        canManageServer: false,
        bgcolor: '#bae0ff',
        key: "94MDPJZyrsTSUG/KYMfxsM,6c:Mcq_",
        banned: false 
    },
    jeffery: {
        canSendMessage: true,
        canSendWaterCar: false,
        canDeleteMessage: true,
        canManageUsers: false,
        canManageServer: false,
        bgcolor: '#f6baff',
        key: 'JtpVNXkQd-]Kxwm=5y(iy4g,toqGYN',
        banned: false
    },
    wes: {
        canSendMessage: true,
        canSendWaterCar: true,
        canDeleteMessage: true,
        canManageUsers: true,
        canManageServer: true,
        bgcolor: '#baffce',
        key: "V+OO>ck;oVB+eiObFOg}]D1!&/H=L_",
        banned: false
    },
    jacob: {
        canSendMessage: true,
        canSendWaterCar: false,
        canDeleteMessage: false,
        canManageUsers: false,
        canManageServer: false,
        bgcolor: '#ffbabb',
        key: "Xy-Wb5vKY#m@w:2q3OdGbBU&@m<cxj",
        banned: false
    },
};

app.use(cors());
app.use(express.json());

function sanitize(str) {
    const map = {
        '&': '&amp;',
        '<': '&lt;',
        '>': '&gt;',
        '"': '&quot;',
        "'": '&#x27;',
        "/": '&#x2F;',
    };
  
    const reg = /[&<>"'/]/ig;
  
    return str.replace(reg, (match) => (map[match]));
}
app.post('/login', (req, res) => {
    console.log(req.body);
    if(userdata.hasOwnProperty(req.body.user.toLowerCase())){
        res.json(userdata[req.body.user]);
    }
    else{
        res.status(403).json({ message: 'User does not exist', status: 'error' });
    }
})

app.post('/data', (req, res) => {
    console.log(req.body);
    let user = req.body.userId;
    if (userdata[user] && userdata[user].canSendMessage && userdata[user].key == req.body.auth && req.body.message != '' && !userdata[user].banned) {
        let msg = sanitize(req.body.message);
        if (userdata[user].canSendWaterCar) {
            msg = msg.replaceAll('https://tenor.com/view/water-cat-cat-cat-bath-gif-8375496536506751533', '<img src=water-car.gif>');
            msg = msg.replaceAll(':watercar:', '<img src=water-car.gif>');
        }
        const messageObject = {
            id: ++messageIdCounter,
            userId: user,
            message: msg,
            bgcolor: userdata[user].bgcolor,
            timestamp: new Date().toISOString()
        };

        messages.push(messageObject);

        res.json(messages);
    } else {
        res.status(403).json({ message: 'error', status: 'error' });
    }
});

app.post('/remove', (req, res) => {
    console.log(req.body);
    let user = req.body.userId;
    let mid = req.body.messageId;

    if(userdata[user] && userdata[user].canDeleteMessage && userdata[user].key == req.body.auth){
        messages = messages.filter(message => message.id !== mid);
        console.log(messages);
        res.json(messages);
    }
});
app.post('/ban', (req, res) => {
    if(userdata[req.body.user] && userdata[req.body.user].canManageUsers && userdata[req.body.user].key == req.body.auth){  
        userdata[req.body.ban].banned = true;
        res.json({ message: 'User banned', status: 'success' });
    } else {
        res.status(403).json({ message: 'error', status: 'error' });
    }
});
app.post('/unban', (req, res) => {
    console.log(req.body);
    if(userdata[req.body.user] && userdata[req.body.user].canManageUsers && userdata[req.body.user].key == req.body.auth){  
        userdata[req.body.unban].banned = false;
        res.json({ message: 'User unbanned', status: 'success' });
    } else {
        res.status(403).json({ message: 'error', status: 'error' });
    }
});
app.listen(3000, () => {
    console.log('Server started on http://localhost:3000');
});

app.get('/data', (req, res) => {
    res.json(messages);
});

app.get('/banned', (req, res) => {
    let bannedUsers = Object.keys(userdata).filter(user => userdata[user].banned);
    res.json(bannedUsers);
});

app.post('/crash', (req, res) => {
    if(userdata[req.body.user] && userdata[req.body.user].canManageServer && userdata[req.body.user].key == req.body.auth){
        console.log(req.body);
        res.json({ message: 'Server shutting down', status: 'success' });
        process.exit(0);
    } else {
        res.status(403).json({ message: 'error', status: 'error' });
    }
});