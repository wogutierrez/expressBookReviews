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
  
    const username = req.session.username;
    const review_text = req.body.review;
    const isbn = req.params.isbn;
  
    if (!req.session.isLoggedIn || !username) {
    return res.status(401).json({message: "User needs to login first"})
    }    

    if (!review_text) {
    return res.status(400).json({message: "Please provide a review text"})
    }    
    
    if (!books[isbn]){
        return res.status(404).json({message: "The book does not exist"})
    }

    if (!books[isbn].reviews){
        books[isbn].reviews = {};
    }

    books[isbn].reviews[username] = review_text;

    return res.status(200).json({message: `Review has been updated for user ${username}`,
    reviews: books[isbn].reviews
    })
});

// Delete a book review
regd_users.delete("/auth/review/:isbn", (req, res) => {
    const isbn = req.params.isbn;
    const username = req.session.username

      // Check if user is logged in
      if (!req.session.isLoggedIn || !username) {
        return res.status(401).json({message: "User needs to login first"});
    }    
    
    // Check if book exists
    if (!books[isbn]) {
        return res.status(404).json({message: "The book does not exist"});
    }
    
    // Check if book has any reviews
    if (!books[isbn].reviews) {
        return res.status(404).json({message: "No reviews found for this book"});
    }
    
    // Check if the user has a review for this book
    if (!books[isbn].reviews[username]) {
        return res.status(404).json({message: "You have not reviewed this book yet"});
    }
    
    // Delete the user's review
    delete books[isbn].reviews[username];
    
    // Optional: If reviews object becomes empty, you can delete it or leave it as empty object
    if (Object.keys(books[isbn].reviews).length === 0) {
        books[isbn].reviews = {}; // Keep as empty object
    }
    
    return res.status(200).json({
        message: `Review for ISBN ${isbn} has been deleted for user ${username}`,
        reviews: books[isbn].reviews
    });
})

module.exports.authenticated = regd_users;
module.exports.isValid = isValid;
module.exports.users = users;
