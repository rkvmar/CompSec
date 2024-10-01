word = input()
security = ''.join([hex(ord(i)) for i in word])
for letter, diffa in {'0':'À','1':'Å','2':'Ä','3':'ã','4':'Ā','5':'å','6':'Ă','7':'Ǟ','8':'Ǻ','9':'Ȁ','a':'ạ','b':'Â','c':'Ằ','d':'ª','e':'Ą','f':'Ầ','x':'Ạ'}.items():
    security = security.replace(letter, diffa)
print(security)