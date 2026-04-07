const express = require('express');
const jwt = require('jsonwebtoken');
let books = require("./booksdb.js");
const regd_users = express.Router();

let users = [];

const isValid = (username)=>{ //returns boolean
//write code to check is the username is valid
}

const authenticatedUser = (username,password)=>{ 
    //returns boolean 
    //write code to check if username and password match the one we have in records.
    let validuser = users.filter((user) => {
        return (user.username === username && user.password === password);
    });

    if (validuser.length > 0) {
        return true;
    } else {
        return false;
    }
}

//only registered users can login
regd_users.post("/login", (req,res) => {
  //Write your code here
    const username = req.body.username;
    const password = req.body.password;

    //checking if username and password were provided
    if (!username || !password) {
        return res.status(400).json({message: "Username and password required"});
    }

    if (authenticatedUser(username, password)) {
        req.session.isLoggedIn = true;
        req.session.username = username;
        return res.status(200).json({message: "login sucessful"});
    } else {
        return res.status(401).json({message: "Invalid username or password"});
    }

});

// Add a book review
regd_users.put("/auth/review/:isbn", (req, res) => {
  //Write your code here
  return res.status(300).json({message: "Yet to be implemented"});
});

module.exports.authenticated = regd_users;
module.exports.isValid = isValid;
module.exports.users = users;
