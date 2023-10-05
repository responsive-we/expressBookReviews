const express = require("express");
const jwt = require("jsonwebtoken");
let books = require("./booksdb.js");
const regd_users = express.Router();

let users = [{
  "username":"andy43",
  "password":"123456789"
}];

const isValid = (username) => {
  //returns boolean
  //write code to check is the username is valid
  if (users.includes(username)) {
    return false;
  } else {
    return true;
  }
};

const authenticatedUser = (username, password) => {
  //returns boolean
  //write code to check if username and password match the one we have in records.
  
  let validusers = users.filter((user)=>{
    return (user.username === username && user.password === password)
  });
  if(validusers.length > 0){
    return true;
  } else {
    return false;
  }
  };

//only registered users can login
regd_users.post("/login", (req, res) => {
  //Write your code here
  const { username, password } = req.body;
  if (!username || !password) {
    return res.status(404).json({message: "Error logging in"});
}

if (authenticatedUser(username,password)) {
  let accessToken = jwt.sign({
    data: password
  }, 'fingerprint_customer', { expiresIn: 60 * 60 });
// req.session.user=username;
  req.session.authorization = {
    accessToken,username
}
// res.send(req.session.authorization);
return res.status(200).send("User successfully logged in");
} else {
  return res.status(208).json({message: "Invalid Login. Check username and password"});
}
});

// Add a book review
regd_users.put("/auth/review/:isbn", (req, res) => {
  //Write your code here
  const {isbn} = req.params;
  const input = req.query.review;
  const review = input.replace(/"/g, '');
  const {username} = req.session.authorization;
  console.log(username);
  if (!isbn || !review) {
    return res.status(404).json({message: "Error in adding review"});
  }
  let book = books[isbn]
  const existingReview = book.reviews[username];
  if(book){
    if (existingReview){
      book.reviews[username]=review;
    }
    else{
      book.reviews={...book.reviews,[username]:review};
    }
   
    // return res.status(200).json({message: "Review added successfully"}).send(book.reviews);;
    return res.send(book.reviews);
  } else {
    return res.status(404).json({message: "Error in adding review"});
  }
});

regd_users.delete("/auth/review/:isbn",(req,res)=>{
  const {isbn} = req.params;
  const book=books[isbn];
  const {username} = req.session.authorization;
  if(!isbn){
    return res.status(404).json({message: "Error in deleting review"});
  }
  if(book){
    delete book.reviews[username];
    return res.status(200).json({message: "Review deleted successfully"});
  }
  else{
    return res.status(404).json({message: "Error in deleting review"});
  }
})

module.exports.authenticated = regd_users;
module.exports.isValid = isValid;
module.exports.users = users;
