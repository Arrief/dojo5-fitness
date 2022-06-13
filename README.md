# Fullstack exercise

## The application

You will need to build a web app where a user can register their account and log in. Once logged in, they will see a page with several inputs to fill their weight, the calorie intake, the workout and the current day and a button to submit. Once submitted, the information will appear there coming from a backend.

You will need to work on databases, frontend and backend

## Databases

 Create a database with a table `users`. This table will have an `id` a `username` and a  `password` as mandatory fields. It will also have other fields like: `day`, `weight`, `calories` and `workout`

 ## Frontend

 The frontend will consist on at least, 3 pages. The registration page, the login page and the user dashboard page.
 The dashboard page will only be accessible if the user is logged in.
 On this page, the user will see their username and any information they already submitted. If there's no information yet, they will have the chance to submit it through a form.
 Once the info is submitted it will appear on that screen.

 ## Backend

 The backend will be handled by express and mysql to control what happens on each route the user tries to `get` or `post` some information.
 `bcrypt` will be used to encrypt user passwords and `json web token` to handle the user  authorization and authentication.
 You might need to use also `cors` to disable localhost being blocked

 ## BONUS

 Refactor the application in a way that the database will be able to store a historic of the user info. Meaning that you can store your weight, calories and workout from different days.
 You will need to add a new table and create the relation between the user and that new table so whenever you query that data, everything will still be shown as expected **check how to add a foreign key to a table schema**

 Do a log out process
 Do a control error page
