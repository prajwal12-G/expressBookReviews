const express = require('express');
const jwt = require('jsonwebtoken');
let books = require("./booksdb.js");
const regd_users = express.Router();

let users = [];

// =================================
// Check if username already exists
// =================================
const isValid = (username) => { 
  return users.some(user => user.username === username);
}

// =================================
// Check username & password match
// =================================
const authenticatedUser = (username,password) => { 
  return users.some(user => 
    user.username === username && user.password === password
  );
}


// =================================
// Task 7 – Login (customer/login)
// =================================
regd_users.post("/login", (req,res) => {

  const username = req.body.username;
  const password = req.body.password;

  if (!username || !password) {
    return res.status(400).json({ message: "Username and password required" });
  }

  if (authenticatedUser(username, password)) {

    // Create JWT token
    const accessToken = jwt.sign(
      { username: username },
      "fingerprint_customer",
      { expiresIn: "1h" }
    );

    // Save JWT in session
    req.session.authorization = {
      accessToken,
      username
    };

    return res.status(200).json({
      message: "User successfully logged in",
      accessToken: accessToken
    });
  }

  return res.status(401).json({ message: "Invalid login credentials" });
});


// =================================
// Task 8 – Add / Modify Book Review
// =================================
regd_users.put("/auth/review/:isbn", (req, res) => {

  const isbn = req.params.isbn;
  const review = req.query.review;

  if (!review) {
    return res.status(400).json({ message: "Review text is required" });
  }

  if (!books[isbn]) {
    return res.status(404).json({ message: "Book not found" });
  }

  const username = req.session.authorization.username;

  // Add or update review
  books[isbn].reviews[username] = review;

  return res.status(200).json({
    message: "Review successfully added/updated",
    reviews: books[isbn].reviews
  });
});


// =================================
// Task 9 – Delete Book Review
// =================================
regd_users.delete("/auth/review/:isbn", (req, res) => {

  const isbn = req.params.isbn;

  if (!books[isbn]) {
    return res.status(404).json({ message: "Book not found" });
  }

  const username = req.session.authorization.username;

  if (books[isbn].reviews[username]) {
    delete books[isbn].reviews[username];

    return res.status(200).json({
      message: "Review successfully deleted"
    });
  }

  return res.status(404).json({
    message: "You have not posted a review for this book"
  });

});


module.exports.authenticated = regd_users;
module.exports.isValid = isValid;
module.exports.users = users;
