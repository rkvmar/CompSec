function loadAdmin(){
    console.log('admin.js loaded');
    document.getElementById('random-container').style.display = 'none';
    adminstuff = document.createElement('div');
    adminstuff.id = 'adminstuff';
    adminstuff.innerHTML = '<h1>admin stuff</h1><button onclick="window.location.href=\'/files\'">Files Directory</button>';
    document.body.appendChild(adminstuff);
}
