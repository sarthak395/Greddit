const express = require('express');
const bodyParser = require('body-parser')
const mongoose = require('mongoose');
var bcrypt = require('bcryptjs');
var jwt = require('jsonwebtoken');
const cors = require('cors');
const { response } = require('express');
const app = express();

// APP Stuff
app.use(cors())
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: true }));


// MONGOOSE STUFF
mongoose.connect('mongodb+srv://Dass_Data:1234@cluster0.weu4u3b.mongodb.net/?retryWrites=true&w=majority')

// DEFINING SCHEMA
const userschema = new mongoose.Schema({
    firstname: String,
    lastname: String,
    username: { type: String, unique: true },
    Email: { type: String, unique: true },
    Contactno: { type: String, unique: true },
    Age: Number,
    Password: String
});

const User = mongoose.model('User', userschema)

app.get('/api/hello', (req, res) => {
    res.json({ message: 'Hello World!' });
});

app.get('/api/signup', (req, res) => {
    res.json({ message: 'Welcome to Signup Backend Api' });
});

app.post('/api/signup', async (req, res) => {
    console.log(req.body)
    var password = req.body.password;

    // encrypt password
    var salt = await bcrypt.genSaltSync(10);
    var encryptedpassword = await bcrypt.hashSync(password, salt);

    // var truth = bcrypt.compareSync(password, hash); // To Check Password
    data = {
        "firstname": req.body.firstname,
        "lastname": req.body.lastname,
        "username": req.body.username,
        "Email": req.body.email,
        "Contactno": req.body.contactno,
        "Age": req.body.age,
        "Password": encryptedpassword
    }
    const user = new User(data);
    user.save()
    res.json({ message: "hi baby" });
});

app.get('/api/login', (req, res) => {
    res.json({ message: 'Welcome to Login Backend Api' });
});

app.post('/api/login', async (req, res) => {
    console.log(req.body)
    var password = req.body.password;
    var username = req.body.username

    const tempuser = await User.find({ username: username })
    if (!tempuser.length) // user not found
        res.status(400).json({ success: false, error: "User Not Found" })
    else {
        // console.log(tempuser[0])
        var truth = await bcrypt.compareSync(password, tempuser[0].Password); // To Check Password
        console.log(tempuser[0])
        if (!truth)
            res.status(400).json({ success: false, error: "Incorrect Password" })
        else {
            let token = jwt.sign({ id: tempuser[0]._id, firstname: tempuser[0].firstname, lastname: tempuser[0].lastname, username: tempuser[0].username, email: tempuser[0].Email, contactno: tempuser[0].Contactno, age: tempuser[0].Age }, 'jwtsecret');
            res.status(200).json({ success: true, token: token });
        }
    }
});

app.post('/api/updatedetails', async (req, res) => {
    // console.log(req.body.newdata)

    const tempuser = await User.find({ _id: req.body.newdata.id })
    // console.log(tempuser, req.body.password)
    var truth = await bcrypt.compareSync(req.body.password, tempuser[0].Password);

    if (!truth) {
        res.status(400).json({ success: false, error: "Incorrect Password" })
    }
    else {
        
        
        tempuser[0].firstname = req.body.newdata.firstname;
        tempuser[0].lastname = req.body.newdata.lastname;
        tempuser[0].username = req.body.newdata.username;
        tempuser[0].Email = req.body.newdata.email;
        tempuser[0].Contactno = req.body.newdata.contactno;
        tempuser[0].Age = req.body.newdata.age;

        // console.log(tempuser[0])

        await tempuser[0].save();


        let token = jwt.sign({ id: req.body.newdata.id, firstname: req.body.newdata.firstname, lastname: req.body.newdata.lastname, username: req.body.newdata.username, email: req.body.newdata.email, contactno: req.body.newdata.contactno, age: req.body.newdata.age }, 'jwtsecret');

        // console.log(resp)

        res.status(200).json({ success: true, token: token });
    }
})

app.listen(3001, () => {
    console.log('Server started on port 3001');
});