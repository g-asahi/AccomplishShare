import requests, random, string, json, os, requests
from flask import Flask, send_from_directory, request, redirect, jsonify

app = Flask(__name__)

with open("./users.json", "r") as read_file:
    users = json.load(read_file)

print(users)

with open("./tokens.json", "r") as read_file:
    tokens = json.load(read_file)

print(tokens)

with open("./classrooms.json", "r") as read_file:
    classrooms = json.load(read_file)

print(classrooms)

def newtoken(tokens):
    return  "".join(random.SystemRandom().choice(string.ascii_letters + string.digits) for _ in range(20))

print(newtoken(tokens))

@app.route("/<path:path>")
def sendfindpath(path):
    return send_from_directory("pages/", path)



@app.route("/getposts", methods=["GET"])
def get():
    print("received request for getposts")
    token = request.args["token"]
    username = request.args["username"]
    req = requests.get("http://0.0.0.0:5000/login/validatetoken?token=" + token + "&username=" + username)
    print("validation result is " + req.text)
    send = {}
    if req.text == "invalid":
        return "$"
    else:
        print(users[username]["classrooms"])
        for classroom in users[username]["classrooms"]:
            print(classroom)
            for post in classrooms[classroom]["posts"]:
                print(post)
                send[post] = classrooms[classroom]["posts"][post]
        print("valid token for getposts")
        print(json.dumps(send))
        return json.dumps(send)



@app.route("/")
def sendhome():
    return redirect("/home/")



@app.route("/home/")
def home():
    return send_from_directory("pages/home", "home.html")



@app.route("/about/")
def about():
    return send_from_directory("pages/home", "about.html")



@app.route("/login/")
def login():
    return send_from_directory("pages/login", "login.html")



@app.route("/dashboard/", methods=["GET"])
def dashboard():
    token = request.args["token"]
    username = request.args["username"]
    print("user dashboard token " + token)
    req = requests.get("http://0.0.0.0:5000/login/validatetoken?token=" + token + "&username=" + username)
    print(req.text)
    if req.text == "invalid":
        print("invalid dashboard token")
        return redirect("/login/")
    else:
        return send_from_directory("pages/dashboard", "dashboard.html")



@app.route("/login/signup/")
def signup():
    return send_from_directory("pages/login", "signup.html")



@app.route("/login/assigntoken", methods=["GET"])
def assigntoken():
    username = request.args["username"]
    password = request.args["password"]
    print("User entered username: " + username + " and password: " + password)

    try:
        if users[username]["password"] == password:
            print("User authenticated")
            token = newtoken(tokens)
            tokens[username] = token
            print(tokens)
            return token
        else:
            print("User rejected: Incorrect password")
            return "$"
    except KeyError:
        print("User rejected: Unmatching username")
        return "$"
            


@app.route("/login/validatetoken", methods=["GET"])
def validatetoken():
    token = request.args["token"]
    username = request.args["username"]
    try:
        if tokens[username] == token:
            return "valid"
        else:
            return "invalid"
    except KeyError:
        return "invalid"



#==========[TEST]==========
@app.route("/redir/")
def redir():
    return redirect('/you_were_redirected')

@app.route("/you_were_redirected")
def redirected():
    return "You were redirected. Congrats :)!"

try:

    if __name__ == "__main__":
        port = int(os.environ.get('PORT', 5000))
        app.run(host='0.0.0.0', port=port, debug=True)

finally:

    with open("users.json", "w") as write_file:
        json.dump(users, write_file, indent=4)

    with open("tokens.json", "w") as write_file:
        json.dump(tokens, write_file, indent=4)

    with open("classrooms.json", "w") as write_file:
        json.dump(classrooms, write_file, indent=4)