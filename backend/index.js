require('dotenv').config();
const express = require('express');
const cors = require('cors');
const connection = require('./conf');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const app = express();
const port = process.env.PORT || 5000;

// middleware
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

// route to register a new user with data from frontend
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

// route to login, check if frontend-data corresponds to data in MySQL db
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

// middleware to check if user has valid JWT
const authenticateUser = (req, res, next) => {
  const authHEader = req.headers.authorization;
  /* this will be a string: Bearer [the actual token afterwards] 
  if authHeader is true/exists -> go and split string into array: [0] = Bearer, we want [1] to get just the token itself */
  const token = authHEader && authHEader.split(" ")[1]
  if (token === undefined) return res.sendStatus(401);
  // else: .verify(token you want to test, env.acces_token, callbackFn(err, user)) */
  jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, user) => {
    if(err) return res.sendStatus(403);
    // else:
    req.foundUser = user;
    // built-in method that jumps to the next step after function call once the fn is done
    next();
  });
}

// path to get user data after checking with middleware if user has a valid token
app.get("/dashboard", authenticateUser, (req, res) => {
  connection.query(
    // we have access to the new foundUser property that we added to req in the middleware
    "SELECT username, date, weight, calories, workout FROM users WHERE username=?", 
    req.foundUser.username,
    (err, results) => {
      if(err) {
        res.sendStatus(500);
      } else {
        res.json(results[0]);
      }
    }
  );
})

// route to update db with values submitted from dashboard page 
app.put("/update", (req, res) => {
    let {username, date, weight, calories, workout} = req.body;
    connection.query("UPDATE users SET date=?, weight=?, calories=?, workout=? WHERE username=?", [date, weight, calories, workout, username], (err) => {
      if(err) {
        console.error(err);
        res.status(500).send("Error, could not update user data in the DB");
      } else {
        res.sendStatus(201)
      }
    });
})

app.listen(port, (err) => {
  if(err) {
    throw new Error("Sorry, looks like something is not working as expected :/");
  }
  console.log(`Great success! Your server is running at port: ${port}`);
})
