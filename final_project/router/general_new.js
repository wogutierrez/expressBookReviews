const express = require('express');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();
const axios = require("axios")

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
public_users.get('/',async function (req, res) {
  //Write your code here
  //res.status(200).json(JSON.stringify(books,null,2));

  try {
        const bookList = await new Promise((resolve) => {
            resolve(JSON.stringify(books,null, 2));
        });
        res.status(200).json(bookList);
  } catch (error) {
    res.status(500).json({message: "Error fetching books", error: error.message});    
  }

  console.log("6. Function complete - ready for new request");

});

// Get book details based on ISBN
public_users.get('/isbn/:isbn', async function (req, res) {
    
    const isbn = req.params.isbn; 
    const book = books[isbn];

    if (book) {
        try {
            const bookdetails = await new Promise((resolve) => {
                resolve(JSON.stringify(book,null,2))
            }) 
            res.status(200).json(bookdetails);
        } catch (error) {
            res.status(500).json({message: "Error fetching details for this book"})
        }
    
    } else {
            res.status(404).json({message: "That book does not exist"})
    }

 });

  
// Get book details based on author
public_users.get('/author/:author',async function (req, res) {
  //Write your code here
    const author = req.params.author;

    if (author) {
        try {
            const booksbyauthor = await new Promise((resolve, reject) => {
                let booksbyauthor = [];
                for (let book in books) {
                    if (books[book].author.toLowerCase() === author.toLowerCase()) {
                        booksbyauthor.push(books[book]);
                    }
                }
    
                if (booksbyauthor.length > 0) {
                    resolve(JSON.stringify(booksbyauthor, null, 2));
                } else {
                    reject(new Error("No books found"));
                }
            });
    
            res.status(200).json(booksbyauthor);
        } catch (error) {
            res.status(404).json({message: "We do not have books with that author"});
        }

    } else {
        res.status(400).json({message: "Author parameter is required"});
    }    
});


// Get all books based on title
public_users.get('/title/:title', async function (req, res) {
    //Write your code here

    const title = req.params.title;
    
    if (title){
        try {
                const bookresult = await new Promise((resolve, reject)=>{
                    const bookresult = []
                    for (let id in books){
                        if (books[id].title.toLowerCase() === title.toLowerCase()) {
                            bookresult.push(books[id]);
                        };
                    }

                    if (bookresult.length > 0){
                        resolve(JSON.stringify(bookresult, null, 2));
                    }
                    else {
                        reject(new Error("No books found"));
                    }   
                })     

                res.status(200).json(bookresult);
                
        } catch (error) {
             res.status(404).json({message: "We do not have books with that title"});
        }

    } else {
        res.status(400).json({message: "Title parameter is required"});
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
