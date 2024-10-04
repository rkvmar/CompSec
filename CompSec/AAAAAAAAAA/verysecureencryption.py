import random

# define things
word = input()
key = 'iufdhsgakjghjghdlfkafhjgkldhjgflkfvtucgybdahjnkmscdavfjnbiugfivhndoamcokfigbnuifndsomuvbfyfvincdomowenrbugrfviuhnecdoofeuvghbgfincdoimfvubguifhncdmoqjnfbuggfehuindjmoubgufvncoidmofvubgyuvfnceiodojfubgyyruenimpoubyvyirufnecodmcfbgh78g9nuvfoicoibghyyirufnedomwpiubygguinrvomflkdajslfkjdsalkfjadslkfjadlfdhjksagflhjewahlfibamsdjkhuibmdsfiukbjaefdsouifbkjdhvosifbkjdvofibdvofuesdbkjoufdvilbkjfioeudvsbjkvdifoubjkfvdifoubkjvdfioulbs'

# get a random point in the key to start at
randompoint = random.randrange(0, len(key) - len(word))

# convert the word to an array because why not
security = list(word)

# define more things
security2 = ''
randompoint3 = ''
x=0

# add character codes of string and key together
for i in security:
    security2 = ''.join((security2,chr(ord(i) + ord(key[x+randompoint]))))
    x=x+1

# turn the array into a string of hexes
security3 = ''.join([str(hex(ord(i)))[2:4] for i in security2])

# convert everything to A
for letter, diffa in {'0':'À','1':'Á','2':'Â','3':'Ã','4':'Ä','5':'Å','6':'Ā','7':'Ă','8':'Ą','9':'Ǎ','a':'Ǟ','b':'Ǡ','c':'Ȁ','d':'Ȃ','e':'Ȧ','f':'Ḁ','x':'Ấ'}.items():
    security3 = security3.replace(letter, diffa)

# encode the random starting point with As
randompoint2 = str(bin(randompoint)[2:])
randompoint2 = randompoint2.replace('0','À')
randompoint2 = randompoint2.replace('1','Á')

# output AAAAAA
print(randompoint2 +'A'+ security3)