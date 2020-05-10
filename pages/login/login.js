let ip = "0.0.0.0:5000";
let username = document.getElementById("username");
let password = document.getElementById("password");

let login = document.getElementById("login");
let signup = document.getElementById("signup");
let errormessage = document.getElementById("errormessage");

console.log("JS Loaded")

function assigntoken(u, p, i) {
    return fetch("http://" + i + "/login/assigntoken?username=" + u + "&password=" + p)
    .then(data => data.text());
}

login.addEventListener("click", () => {
    let user = username.value;
    let pass = password.value;
    console.log(user);
    console.log(pass);
    assigntoken(user, pass, ip).then(result => {
        if (result == "$") {
            errormessage.textContent = ("Username or Password is Incorrect");
            console.log("Username or Password is Incorrect");
        } else {
            window.location.href = "http://" + ip + "/dashboard/?token=" + result + "&username=" + user;
        }
    })
})

signup.addEventListener("click", () => {
    window.location.href = "http://" + ip + "/login/signup";
})