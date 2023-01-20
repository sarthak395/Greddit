const express = require('express');
const bodyParser = require('body-parser')
const mongoose = require('mongoose');
var bcrypt = require('bcryptjs');
const cors = require('cors');
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
    lastnme:String,
    username:{type:String,unique:true},
    Email: {type:String,unique:true},
    Contactno:{type:String,unique:true},
    Age:Number,
    Password: String
});

const User = mongoose.model('User', userschema)

app.get('/api/hello', (req, res) => {
    res.json({message:'Hello World!'});
});

app.get('/api/signup', (req, res) => {
    res.json({message:'Welcome to Signup Backend Api'});
});
 
app.post('/api/signup', async(req, res) => {
    console.log(req.body)
    var password = req.body.password;
    
    // encrypt password
    var salt = await bcrypt.genSaltSync(10);
    var encryptedpassword = await bcrypt.hashSync(password, salt);
    
    // var truth = bcrypt.compareSync(password, hash); // To Check Password
    data = {
        "firstname":req.body.firstname,
        "lastname":req.body.lastname,
        "username":req.body.username,
        "Email":req.body.email,
        "Contactno":req.body.contactno,
        "Age":req.body.age,
        "Password":encryptedpassword
    }
    const user = new User(data);
    user.save()
    res.json({message:"hi baby"});
});

app.listen(3001, () => {
    console.log('Server started on port 3001');
});