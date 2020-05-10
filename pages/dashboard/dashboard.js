let ip = "0.0.0.0:5000";
let latestevents = document.getElementById("latestevents");
let latestposts = document.getElementById("latestposts");

var query = window.location.search.substring(1);
console.log(query);
var qs = parse_query_string(query);
console.log(qs);
let token = qs["token"];
console.log(token);
let username = qs["username"];
console.log(username);

// function getposts(token, username, ip) {
//     fetch("http://" + ip + "/getposts?token=" + token + "&username=" + username)
//     .then(response => response.json())
//     .then(response => {
    
//         console.log(response);
//         var posts = JSON.parse(response._bodyText);
//         return posts;
    
//     });
// }

// function getposts(token, username) {
//     fetch("http://" + ip + "/getposts?token=" + token + "&username=" + username)
//     .then(response => response.json());
// }

// function getposts(token, username, ip) {
//     fetch("http://" + ip + "/getposts?token=" + token + "&username=" + username, {
//             method: 'GET',
//             headers: {
//             "Accept": "application/json",
//             'Content-Type': 'application/json'
//             }
//         })
//         .then(response => { return response.json();})
//         .then(responseData => {console.log(responseData); return responseData;})
//         .then(data => {this.setState({"questions" : data});})

//         .catch(err => {
//             console.log("fetch error" + err);
//         });
// }

function getposts(token, username, ip) {
    return fetch("http://" + ip + "/getposts?token=" + token + "&username=" + username)
    .then(data => {
        console.log(data.text);
        return data.text();
    })
    .then(data => JSON.parse(data))
    .then(data => {
        console.log(data);
        return data;
    })
}

// function getposts(t, u, i) {
//     return fetch("http://" + i + "/getposts?token=" + t + "&username=" + u)
//     .then(data => data.text());
// }

function parse_query_string(query) {
    var vars = query.split("&");
    var query_string = {};
    for (var i = 0; i < vars.length; i++) {
        var pair = vars[i].split("=");
        var key = decodeURIComponent(pair[0]);
        var value = decodeURIComponent(pair[1]);
        // If first entry with this name
        if (typeof query_string[key] === "undefined") {
            query_string[key] = decodeURIComponent(value);
            // If second entry with this name
        } else if (typeof query_string[key] === "string") {
            var arr = [query_string[key], decodeURIComponent(value)];
            query_string[key] = arr;
            // If third or later entry with this name
        } else {
            query_string[key].push(decodeURIComponent(value));
        }
    }
    return query_string;
}

function readdata(token, username, ip) {
    getposts(token, username, ip).then(posts => {
        posts.array.forEach(post => {
            day = posts.post["date"][0];
            month = posts.post["date"][1];
            year = posts.post["data"][2];
            console.log(day + "/" + month + "/" + year + "/");
        });
    });
}

// console.log(getposts(token, username, ip));
// var posts = getposts(token, username, ip);
// var processed = JSON.parse(posts);
// console.log(processed);

function getpostsdata(token, username, ip) {
    fetch("http://" + ip + "/getposts?token=" + token + "&username=" + username)
    .then(data => {
        console.log(data.text);
        return data.text();
    })
    .then(data => JSON.parse(data))
    .then(data => {
        console.log(data);
        return data;
    })
    .then(posts => {
        console.log("==========[Below]==========");
        console.log(posts);
        console.log(posts["Hello Students, Hello World!"]);
        console.log(posts["Hello Students, Hello World!"]["author"]);
        for (var post in posts) {
            console.log("==========[Below]==========");
            console.log("Author is " + getNestedObject(posts, [post, "author"]))
            console.log("Posted on " + getNestedObject(posts, [post, "date", 0]) + "/" + getNestedObject(posts, [post, "date", 1]) + "/" + getNestedObject(posts, [post, "date", 2]));
            console.log(posts);
            console.log(posts.post);
            console.log(post);

            var postdiv = document.createElement("div");
            postdiv.className = "post";

            var maindiv = document.createElement("div");
            maindiv.className = "main";

            var message = document.createElement("h1");
            message.textContent = post;

            var author = document.createElement("h2");
            author.textContent = getNestedObject(posts, [post, "author"]);

            var date = document.createElement("h3");
            date.textContent = "Posted on " + getNestedObject(posts, [post, "date", 0]) + "/" + getNestedObject(posts, [post, "date", 1]) + "/" + getNestedObject(posts, [post, "date", 2]);

            maindiv.appendChild(author);
            maindiv.appendChild(date);
            maindiv.appendChild(message);

            var commentheader = document.createElement("h3");
            commentheader.className = "header";
            commentheader.textContent = "Comments:";

            var commentdiv = document.createElement("div");
            commentdiv.className = "comment";
            for (comment in getNestedObject(posts, [post, "comments"])) {

                var message = document.createElement("h4");
                message.textContent = comment;

                var author = document.createElement("h5");
                author.textContent = getNestedObject(posts, [post, "comments", comment, "author"]);

                var date = document.createElement("h6");
                date.textContent = "Posted on " + getNestedObject(posts, [post, "comments", comment, "date", 0]) + "/" + getNestedObject(posts, [post, "comments", comment, "date", 1]) + "/" + getNestedObject(posts, [post, "comments", comment, "date", 2]);

                commentdiv.appendChild(author);
                commentdiv.appendChild(date);
                commentdiv.appendChild(message);
            }
            postdiv.appendChild(maindiv);
            postdiv.appendChild(commentheader);
            postdiv.appendChild(commentdiv);

            latestposts.appendChild(postdiv);
        };
    });
}

const getNestedObject = (nestedObj, pathArr) => {
    return pathArr.reduce((obj, key) =>
        (obj && obj[key] !== 'undefined') ? obj[key] : undefined, nestedObj);
}

// readdata(token, username, ip);

getpostsdata(token, username, ip);

let test = {"test1": {"test2":{"test3":"test4"}}};
let test1 = "test1";
console.log(test.test1["test2"]["test3"]);