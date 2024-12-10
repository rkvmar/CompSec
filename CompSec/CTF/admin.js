function loadAdmin(){
    console.log('admin.js loaded');
    document.getElementById('random-container').style.display = 'none';
    adminstuff = document.createElement('div');
    adminstuff.id = 'adminstuff';
    adminstuff.innerHTML = '<h1>admin stuff</h1><button onclick="window.location.href=\'/files\'">Files Directory</button><h1>nothing else here :)</h1>';
    document.body.appendChild(adminstuff);
    console.log('flag?')
    xhr = new XMLHttpRequest();
    xhr.open('GET', '/flag', true);
    xhr.setRequestHeader('Authorization', auth);
    xhr.onload = function() {
        console.log(xhr.responseText);
    };
    xhr.send();
}