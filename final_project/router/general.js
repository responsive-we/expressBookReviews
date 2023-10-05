const express = require('express');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();
const axios = require('axios');

async function getBooks(author, title, isbn) {
  try {
    if(author) {
      const response = await axios.get(`/author/${author}`);
      return response.data;
    }
    if(title) {
      const response = await axios.get(`/title/${title}`);
      return response.data;
    }
    if(isbn) {
      const response = await axios.get(`/isbn/${isbn}`);
      return response.data;
    }
    const response = await axios.get(`/`);
    return response.data;
  } catch (error) {
    console.error(error);
  }
}
public_users.post("/register", (req,res) => {
  //Write your code here
  const {username,password} = req.body;
  if (isValid(username)){
    if(username.length <= 5){
      res.status(400).json({message: "Username must be at least 5 characters long"});
    }
    if (password.length <= 8){
      res.status(400).json({message: "Password must be at least 8 characters long"});
    }
    users.push({username,password});
    res.status(200).json({message: "User succesfully created"});
  }
  else{
    res.status(400).json({message: "Username already exists"});
  }
});

// Get the book list available in the shop
public_users.get('/',function (req, res) {
  //Write your code here
  const bookList = JSON.stringify(books,null,4);
  res.send(bookList);

});

// Get book details based on ISBN
public_users.get('/isbn/:isbn',function (req, res) {
  //Write your code here
 const {isbn} = req.params;
  const book = books[isbn];
  res.send(JSON.stringify(book,null,4));

 });
  
// Get book details based on author
public_users.get('/author/:author',function (req, res) {
  //Write your code here
  const {author} = req.params;
  for (let i in books){
    if (books[i].author === author){
      res.send(JSON.stringify(books[i],null,4));
    }
    else{
      res.status(404).json({message: "Book not found"});
    }
  }
});

// Get all books based on title
public_users.get('/title/:title',function (req, res) {
  //Write your code here
  const {title} = req.params;
  for (let i in books){
    if (books[i].title = title){
      res.send(JSON.stringify(books[i],null,4));
    }
    else{
      res.status(404).json({message: "Book not found"});
    }
  }
});

//  Get book review
public_users.get('/review/:isbn',function (req, res) {
  //Write your code here
  const {isbn} = req.params;
  const book = books[isbn];
  res.send(JSON.stringify(book.reviews,null,4));
});

module.exports.general = public_users;
