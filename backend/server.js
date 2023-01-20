const express = require('express');
const bodyParser = require('body-parser')
var bcrypt = require('bcryptjs');
const cors = require('cors');
const app = express();
app.use(cors())
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: true }));


app.get('/api/hello', (req, res) => {
    res.json({message:'Hello World!'});
});

app.get('/api/signup', (req, res) => {
    res.json({message:'Welcome to Signup Backend Api'});
});
 
app.post('/api/signup', async(req, res) => {
    console.log(req.body)
    var name = req.body.fullname;
    var email = req.body.email;
    var password = req.body.password;
    
    // encrypt password
    var salt = await bcrypt.genSaltSync(10);
    var encryptedpassword = await bcrypt.hashSync(password, salt);
    
    // var truth = bcrypt.compareSync(password, hash); // To Check Password
    
    res.json({message:"hi baby"});
});

app.listen(3001, () => {
    console.log('Server started on port 3001');
});