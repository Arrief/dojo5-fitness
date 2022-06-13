require('dotenv').config();
const express = require('express');
const cors = require('cors');
const connection = require('./conf');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const app = express();
const port = process.env.PORT || 5000;

app.use(express.urlencoded({ extended: false }));
app.use(express.json());
app.use(cors());

// establish the connection to the MySQL db with credentials from config.js
connection.connect((err) => {
  if(err) {
    console.error(`ERROR!!! Connection to the db failed: ${err}`);
    return;
  }
  console.log("Great! Your DB connection is working!")
})

app.post("/register", (req, res) => {
  bcrypt.hash(req.body.password, 10)
  .then((hashedPassword) => {
    let newUser = {
      username: req.body.email,
      password: hashedPassword
    }
    connection.query("INSERT INTO users SET ?", newUser, (err) => {
      if(err) {
        console.error(err);
        res.status(500).send("Server error, could not register the new user into the DB");
      } else {
        res.status(201).send("Successfully registered the new user");
      }
    });
  })
  .catch((hashError) => console.error(`There was an error encrypting the password: ${hashError}`))
})

app.post("/login", (req, res) => {
  const registerData = {
    username: req.body.email,
    password: req.body.password
  }
  connection.query("SELECT * FROM users WHERE username=?", registerData.username, 
  (err, results) => {
    if(err) {
      res.status(500).send("Email not found");
    } else {
      bcrypt.compare(registerData.password, results[0].password)
      .then((isAMatch) => {
        if(isAMatch) {
          // creating a JWT for user just before sending their data to the frontend
          const generatedToken = jwt.sign(registerData, process.env.ACCESS_TOKEN_SECRET);
          // send user data to frontend
          res.status(200).json({
          message: "Successfully logged in!",
          token: generatedToken,
          });
        } else {
          res.status(500).send("Wrong password");
        }
      })
      .catch((passwordError) => console.error("Error trying to decrypt the password", passwordError));
    }
  });
});

app.post("/update", (req, res) => {
    let userData = {
      date: req.date,
      weight: req.weight,
      calories: req.calories,
      workout: req.workout
    }
    connection.query("INSERT INTO users SET ? WHERE password = ?", userData, (err) => {
      if(err) {
        console.error(err);
        res.status(500).send("Error, could not update user data in the DB");
      } else {
        res.status(201).json(userData);
      }
    });
})

app.listen(port, (err) => {
  if(err) {
    throw new Error("Sorry, looks like something is not working as expected :/");
  }
  console.log(`Great success! Your server is running at port: ${port}`);
})