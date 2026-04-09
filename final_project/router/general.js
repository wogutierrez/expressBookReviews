const express = require('express');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();


public_users.post("/register", (req,res) => {
  //Write your code here
  const username = req.body.username;
  const password = req.body.password;
  
  if (!username || !password) {
    return res.status(400).json({message: "Username and password are required"});
  }

  if (users.find(user => user.username === username )) {
    return res.status(409).json({message: "User already exist"});
  }

  users.push({username: username, password: password});
  return res.status(201).json({message: "User registered successfully"});

});

// Get the book list available in the shop
public_users.get('/',function (req, res) {
  //Write your code here
  res.status(200).json(JSON.stringify(books,null,2));
});

// Get book details based on ISBN
public_users.get('/isbn/:isbn',function (req, res) {
  //Write your code here
    const isbn = req.params.isbn; 
    const book = books[isbn];

    if (book) {
        res.status(200).json(book);
    } else {
        res.status(404).json({message: "Book not found"});
    }

 });
  
// Get book details based on author
public_users.get('/author/:author',function (req, res) {
  //Write your code here
    const author = req.params.author;
    let booksbyauthor = [];

    for (let id in books) {
        if(books[id].author.toLowerCase() === author.toLowerCase()){
            booksbyauthor.push(books[id]);
        }
    }

    if (booksbyauthor.length > 0) {    
        res.status(200).json(booksbyauthor)
    } else {
        res.status(404).json({message: "Book by that author were not found"});
    }

});

// Get all books based on title
public_users.get('/title/:title',function (req, res) {
    //Write your code here
    const title = req.params.title;
    let booksbytitle = [];

    for (let id in books) {
        if(books[id].title.toLowerCase() === title.toLowerCase()){
            booksbytitle.push(books[id]);
        }
    }

    if (booksbytitle.length > 0) {    
        res.status(200).json(booksbytitle)
    } else {
        res.status(404).json({message: "Book by that title were not found"});
    }
});

//  Get book review
public_users.get('/review/:isbn',function (req, res) {

    const isbn = req.params.isbn;
    const booksearched = books[isbn];
    
    if (booksearched) {
        res.status(200).json(booksearched.reviews)
    } else {
        res.status(404).json({message: "Book not found"});
    }
});

module.exports.general = public_users;
