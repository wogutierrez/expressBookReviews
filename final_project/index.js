const express = require('express'); //Done
const jwt = require('jsonwebtoken'); //Done
const session = require('express-session') //Done

const customer_routes = require('./router/auth_users.js').authenticated; //Done
const genl_routes = require('./router/general.js').general; //Done

let users = []

// Check if a user wiht the given username already exists
const doesExist = (username) =>{
    //Filter the users array for any user with the same username
    const userwithsamename = users.filter((user) => {
        return user.username === username;
    });
    //Return true if any user with the same username is found, otherwise false 
    if (userwithsamename.length > 0) {
        return true;
    } else {
        return false;
    }
}

// Check if the user with the given username and password exists
const authenticateduser = (username, password) => {
    let validusers = users.filter((user) => {
        return (user.username === username && user.password === password);
    });
    // Return true if any valid user is found, otherwise false
    if (authenticateduser.length > 0) {
        return true;
    } else {
        return false;
    }
}

const app = express();
app.use(express.json());

app.use("/customer",session({secret:"fingerprint_customer",resave: true, saveUninitialized: true}))

app.use("/customer/auth/*", function auth(req,res,next){
// Check if user is logged in and has valid access token


});
 

// Register a new User
app.post("/register", (req, res) => {
    const username = req.body.username;
    const password = req.body.password;

    if (username && password) {
        //Check if exist already
        if (!doesExist(username)) {
            //Add the new uesr to the users array
            users.push({"username": username, "password": password});
            return res.status(200).json({message: "User successfully registered. Now you can login"});
        } else {
            return res.status(404).json({message: "User already exists!"});
        }
    }

    // Return error if username or password is missing
    return res.status(404).json({message: "Unable to register user. Make sure the username and password was provided"});
})



const PORT =5000;

app.use("/customer", customer_routes);
app.use("/", genl_routes);

app.listen(PORT,()=>console.log("Server is running"));
