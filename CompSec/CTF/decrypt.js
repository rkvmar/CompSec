const keyinput = document.getElementById('key');
const encryptedinput = document.getElementById('encrypted');
const decryptbutton = document.getElementById('decrypt');
const encryptbutton = document.getElementById('encrypt');
const plaintextinput = document.getElementById('plaintext');
const result = document.getElementById('result');

decryptbutton.addEventListener('click', async () => {
    const key = keyinput.value;
    const encrypted = encryptedinput.value;

    if (key.length !== 64) {
        result.innerText = 'Key must be a 64-character hex string (32 bytes).';
        return;
    }
    if (encrypted.length < 32 || (encrypted.length - 32) % 2 !== 0) {
        result.innerText = 'Invalid encrypted data.';
        return;
    }

    try {
        const decrypted = await AESDecrypt(encrypted, key);
        result.innerText = decrypted;   
    } catch (error) {
        result.innerText = error.message;
    }
});

encryptbutton.addEventListener('click', async () => {
    const key = keyinput.value;
    const plaintext = plaintextinput.value;

    try {
        const encrypted = await AESEncrypt(plaintext, key);
        result.innerText = encrypted;
    } catch (error) {
        result.innerText = error.message;
    }
});

async function AESEncrypt(plaintext, key) {
    const iv = new Uint8Array(16);
    window.crypto.getRandomValues(iv);
    const keyBuffer = new Uint8Array(hexToBytes(key));
    const cryptoKey = await window.crypto.subtle.importKey('raw', keyBuffer, { name: 'AES-CBC' }, false, ['encrypt']);
    const encryptedBuffer = await window.crypto.subtle.encrypt({ name: 'AES-CBC', iv: iv }, cryptoKey, new TextEncoder().encode(plaintext));
    
    // Convert ArrayBuffer to hex string
    const encryptedArray = new Uint8Array(encryptedBuffer);
    const encryptedHex = Array.from(encryptedArray).map(byte => byte.toString(16).padStart(2, '0')).join('');
    
    // Convert IV to hex string
    const ivHex = Array.from(iv).map(byte => byte.toString(16).padStart(2, '0')).join('');
    
    return ivHex + encryptedHex; // Concatenate IV and encrypted data
}

async function AESDecrypt(encrypted, key) {
    // Ensure the encrypted data is long enough
    if (encrypted.length < 32) {
        throw new Error('Encrypted data is too short.');
    }

    const iv = new Uint8Array(hexToBytes(encrypted.slice(0, 32))); // Read the first 32 hex characters for IV
    const encryptedText = new Uint8Array(hexToBytes(encrypted.slice(32))); // Read the rest for encrypted data
    const keyBuffer = new Uint8Array(hexToBytes(key));

    console.log('IV:', iv);
    console.log('Encrypted Text:', encryptedText);

    const cryptoKey = await window.crypto.subtle.importKey('raw', keyBuffer, { name: 'AES-CBC' }, false, ['decrypt']);
    
    try {
        const decrypted = await window.crypto.subtle.decrypt({ name: 'AES-CBC', iv: iv }, cryptoKey, encryptedText);
        return new TextDecoder().decode(decrypted);
    } catch (error) {
        throw new Error('Decryption failed: ' + error.message);
    }
}

function hexToBytes(hex) {
    const bytes = new Uint8Array(hex.length / 2);
    for (let i = 0; i < hex.length; i += 2) {
        bytes[i / 2] = parseInt(hex.substr(i, 2), 16);
    }
    return bytes;
}

