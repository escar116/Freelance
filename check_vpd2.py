with open('src/main.js', 'r', encoding='utf-8') as f:
    js = f.read()

start = js.find('window.openViewProfileDialog = async function(userId)')
# find the showModal call
sm = js.find('showModal', start)
print("showModal at char", sm)
print(js[sm-100:sm+100].encode('ascii','ignore').decode('ascii'))
