const express = require('express');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();



const axios = require("axios");

// Task 10 – Get all books (async/await with Axios)
public_users.get("/async/books", async (req,res) => {
  try {
    const response = await axios.get("http://localhost:5000/");
    return res.status(200).json(response.data);
  } catch(err){
    return res.status(500).json({message:"Error fetching books"});
  }
});

// Task 11 – Get book by ISBN using Promises with Axios
public_users.get("/async/isbn/:isbn", (req,res) =>{
    axios.get(`http://localhost:5000/isbn/${req.params.isbn}`)
      .then(response => res.status(200).json(response.data))
      .catch(err => res.status(500).json({message:"Error fetching book"}));
  });



// Task 12 – Get book by Author (async/await with Axios)
public_users.get("/async/author/:author", async (req,res)=>{
    try{
      const response = await axios.get(`http://localhost:5000/author/${req.params.author}`);
      return res.status(200).json(response.data);
    } catch(err){
      return res.status(500).json({message:"Error fetching books for author"});
    }
  });



// Task 13 – Get book by Title (async/await with Axios)
public_users.get("/async/title/:title", async (req,res)=>{
    try{
      const response = await axios.get(`http://localhost:5000/title/${req.params.title}`);
      return res.status(200).json(response.data);
    }catch(err){
      return res.status(500).json({message:"Error fetching books for title"});
    }
  });

















public_users.post("/register", (req,res) => {
    const username = req.body.username;
    const password = req.body.password;
  
    // Validation
    if (!username || !password) {
      return res.status(400).json({message: "Username and password are required"});
    }
  
    // Check if user already exists
    let users = require("./auth_users.js").users;
    let userExists = users.find(user => user.username === username);
  
    if (userExists) {
      return res.status(409).json({message: "Username already exists"});
    }
  
    // Add new user
    users.push({username, password});
    return res.status(200).json({message: "User registered successfully"});
});

// Get the book list available in the shop
public_users.get('/',function (req, res) {
  return res.status(200).send(JSON.stringify(books, null, 2));
});

// Get book details based on ISBN
public_users.get('/isbn/:isbn',function (req, res) {
    const isbn = req.params.isbn;
    const book = books[isbn];
  
    if(book){
      return res.status(200).json(book);
    } else {
      return res.status(404).json({message: "Book not found"});
    }
 });
  
// Get book details based on author
public_users.get('/author/:author',function (req, res) {
    const author = req.params.author.toLowerCase();
    let result = [];
  
    Object.keys(books).forEach((key) => {
      if (books[key].author.toLowerCase() === author) {
        result.push(books[key]);
      }
    });
  
    if (result.length > 0){
      return res.status(200).json(result);
    } else {
      return res.status(404).json({message: "No books found for this author"});
    }
});

// Get all books based on title
public_users.get('/title/:title',function (req, res) {
    const title = req.params.title.toLowerCase();
    let result = [];
  
    Object.keys(books).forEach((key) => {
      if (books[key].title.toLowerCase() === title) {
        result.push(books[key]);
      }
    });
  
    if (result.length > 0){
      return res.status(200).json(result);
    } else {
      return res.status(404).json({message: "No books found with this title"});
    }
});

//  Get book review
public_users.get('/review/:isbn',function (req, res) {
    const isbn = req.params.isbn;
    const book = books[isbn];
  
    if (book){
      return res.status(200).json(book.reviews);
    } else {
      return res.status(404).json({message: "Book not found"});
    }
});







module.exports.general = public_users;
