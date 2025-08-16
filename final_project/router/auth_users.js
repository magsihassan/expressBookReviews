const express = require('express');
const jwt = require('jsonwebtoken');
let books = require("./booksdb.js");
const regd_users = express.Router();

let users = [];

const isValid = (username)=>{ //returns boolean
//write code to check is the username is valid
}

const authenticatedUser = (username,password)=>{ //returns boolean
//write code to check if username and password match the one we have in records.
}

//only registered users can login
regd_users.post("/login", (req,res) => {
    const { username, password } = req.body;

    if (!username || !password) {
      return res.status(400).json({ message: "Username and password are required" });
    }
  
    // Check if user exists
    const user = users.find(u => u.username === username && u.password === password);
    if (!user) {
      return res.status(401).json({ message: "Invalid credentials" });
    }
  
    // Generate JWT token
    let accessToken = jwt.sign({ username: username }, "access", { expiresIn: 60 * 60 });
  
    // Store token in session
    req.session.authorization = { token: accessToken };
    return res.status(200).json({ message: "User successfully logged in" });
});

// Add a book review
regd_users.put("/auth/review/:isbn", (req, res) => {
    const isbn = req.params.isbn;
    const review = req.query.review;
    const username = req.user.username;
  
    if (!books[isbn]) {
      return res.status(404).json({ message: "Book not found" });
    }
  
    if (!review) {
      return res.status(400).json({ message: "Review is required" });
    }
  
    // Add or update review using username as the key
    books[isbn].reviews[username] = review;
    return res.status(200).json({ message: "Review added/modified successfully" });
});



regd_users.delete("/auth/review/:isbn", (req, res) => {
    const isbn = req.params.isbn;
    const username = req.user.username;
  
    if (!books[isbn]) {
      return res.status(404).json({ message: "Book not found" });
    }
  
    const review = books[isbn].reviews[username];
    if (!review) {
      return res.status(404).json({ message: "No review by this user to delete" });
    }
  
    // Remove the user’s review
    delete books[isbn].reviews[username];
    return res.status(200).json({ message: "Review deleted successfully" });
  });
  



module.exports.authenticated = regd_users;
module.exports.isValid = isValid;
module.exports.users = users;
