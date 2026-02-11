const express = require('express');
const axios = require('axios');

let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;

const public_users = express.Router();


// ======================
// Task 6 – Register User
// ======================
public_users.post("/register", (req,res) => {

  const username = req.body.username;
  const password = req.body.password;

  if (!username || !password) {
    return res.status(400).json({ message: "Username and password required" });
  }

  if (isValid(username)) {
    return res.status(409).json({ message: "User already exists" });
  }

  users.push({ username: username, password: password });

  return res.status(201).json({ message: "User successfully registered" });
});


// ======================
// Task 1 – Get All Books
// ======================
public_users.get('/', function (req, res) {
  return res.status(200).send(JSON.stringify(books, null, 4));
});


// ==============================
// Task 2 – Get Book by ISBN
// ==============================
public_users.get('/isbn/:isbn', function (req, res) {

  const isbn = req.params.isbn;

  if (books[isbn]) {
    return res.status(200).json(books[isbn]);
  }

  return res.status(404).json({ message: "Book not found" });
});


// ==============================
// Task 3 – Get Books by Author
// ==============================
public_users.get('/author/:author', function (req, res) {

  const author = req.params.author;
  let filteredBooks = {};

  Object.keys(books).forEach(key => {
    if (books[key].author.toLowerCase() === author.toLowerCase()) {
      filteredBooks[key] = books[key];
    }
  });

  if (Object.keys(filteredBooks).length > 0) {
    return res.status(200).json(filteredBooks);
  }

  return res.status(404).json({ message: "No books found for this author" });
});


// ==============================
// Task 4 – Get Books by Title
// ==============================
public_users.get('/title/:title', function (req, res) {

  const title = req.params.title;
  let filteredBooks = {};

  Object.keys(books).forEach(key => {
    if (books[key].title.toLowerCase() === title.toLowerCase()) {
      filteredBooks[key] = books[key];
    }
  });

  if (Object.keys(filteredBooks).length > 0) {
    return res.status(200).json(filteredBooks);
  }

  return res.status(404).json({ message: "No books found with this title" });
});


// ==============================
// Task 5 – Get Book Reviews
// ==============================
public_users.get('/review/:isbn', function (req, res) {

  const isbn = req.params.isbn;

  if (books[isbn]) {
    return res.status(200).json(books[isbn].reviews);
  }

  return res.status(404).json({ message: "Book not found" });
});


// ===================================================
// Task 10 – Get All Books (Async/Await with Axios)
// ===================================================
public_users.get('/async/books', async (req, res) => {
  try {
    const response = await axios.get("http://localhost:5000/");
    return res.status(200).json(response.data);
  } catch (error) {
    return res.status(500).json({ message: "Error fetching books" });
  }
});


// ===================================================
// Task 11 – Get Book by ISBN (Async/Await with Axios)
// ===================================================
public_users.get('/async/isbn/:isbn', async (req, res) => {

  const isbn = req.params.isbn;

  try {
    const response = await axios.get(`http://localhost:5000/isbn/${isbn}`);
    return res.status(200).json(response.data);
  } catch (error) {
    return res.status(404).json({ message: "Book not found" });
  }
});


// ===================================================
// Task 12 – Get Books by Author (Async/Await with Axios)
// ===================================================
public_users.get('/async/author/:author', async (req, res) => {

  const author = req.params.author;

  try {
    const response = await axios.get(`http://localhost:5000/author/${author}`);
    return res.status(200).json(response.data);
  } catch (error) {
    return res.status(404).json({ message: "No books found for this author" });
  }
});


// ===================================================
// Task 13 – Get Books by Title (Async/Await with Axios)
// ===================================================
public_users.get('/async/title/:title', async (req, res) => {

  const title = req.params.title;

  try {
    const response = await axios.get(`http://localhost:5000/title/${title}`);
    return res.status(200).json(response.data);
  } catch (error) {
    return res.status(404).json({ message: "No books found with this title" });
  }
});


module.exports.general = public_users;
