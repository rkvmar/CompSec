def hex_to_string(hex_string):
    result = ""
    for i in range(0, len(hex_string), 2):
        hex_pair = hex_string[i:i+2]
        decimal_value = int(hex_pair, 16)
        char = chr(decimal_value)
        result += char
    return result
word = input()
key = 'iufdhsgakjghjghdlfkafhjgkldhjgflkfvtucgybdahjnkmscdavfjnbiugfivhndoamcokfigbnuifndsomuvbfyfvincdomowenrbugrfviuhnecdoofeuvghbgfincdoimfvubguifhncdmoqjnfbuggfehuindjmoubgufvncoidmofvubgyuvfnceiodojfubgyyruenimpoubyvyirufnecodmcfbgh78g9nuvfoicoibghyyirufnedomwpiubygguinrvomflkdajslfkjdsalkfjadslkfjadlfdhjksagflhjewahlfibamsdjkhuibmdsfiukbjaefdsouifbkjdhvosifbkjdvofibdvofuesdbkjoufdvilbkjfioeudvsbjkvdifoubjkfvdifoubkjvdfioulbs'
security = list(word)
security3 = ''
x=0
pos = word.split('A',1)[0]
pos = pos.replace('À','0')
pos = pos.replace('Á','1')
security = word.split('A',1)[1]

for letter, diffa in {'0':'À','1':'Á','2':'Â','3':'Ã','4':'Ä','5':'Å','6':'Ā','7':'Ă','8':'Ą','9':'Ǎ','a':'Ǟ','b':'Ǡ','c':'Ȁ','d':'Ȃ','e':'Ȧ','f':'Ḁ','x':'Ấ'}.items():
    security = security.replace(diffa, letter)
security2 = hex_to_string(security)
for i in security2 :
    security3 = ''.join((security3,chr(ord(i) - ord(key[x+int(pos,2)]))))
    x=x+1
print(security3)