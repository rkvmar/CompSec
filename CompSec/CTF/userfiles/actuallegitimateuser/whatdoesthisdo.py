from Crypto.Cipher import AES
from Crypto.Util.Padding import unpad

def decrypt(cipher_text, key):
    if len(key) not in (16, 24, 32):
        raise ValueError("Incorrect AES key length. Must be 16, 24, or 32 bytes.")
    
    iv = cipher_text[:16]
    ct = cipher_text[16:]
    cipher = AES.new(key, AES.MODE_CBC, iv)
    plain_text = unpad(cipher.decrypt(ct), AES.block_size)
    return plain_text.decode()

key_input = input("Enter key: ")
try:
    key = eval(key_input)
except Exception as e:
    print("Error converting key:", e)
    key = None

if key and len(key) in (16, 24, 32):
    cipher_text_input = input("Enter text to decrypt: ")
    try:
        cipher_text = eval(cipher_text_input)
        decrypted_text = decrypt(cipher_text, key)
        print("Decrypted:", decrypted_text)
    except Exception as e:
        print("Error during decryption:", e)
else:
    print("Invalid key length. Please ensure the key is 16, 24, or 32 bytes long.")