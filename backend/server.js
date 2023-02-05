const express = require('express');
const bodyParser = require('body-parser')
const mongoose = require('mongoose');
var bcrypt = require('bcryptjs');
var jwt = require('jsonwebtoken');
const {v4 : uuidv4} = require("uuid")
const cors = require('cors');

const { MoneyOff } = require('@material-ui/icons');
const app = express();


// APP Stuff
app.use(cors())
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: true }));


// MONGOOSE STUFF
const con = mongoose.connection
mongoose.connect('mongodb+srv://Dass_Data:1234@cluster0.weu4u3b.mongodb.net/?retryWrites=true&w=majority')
con.on('open', function () {
    console.log("Connnected ..")
})

// DEFINING SCHEMA
const userschema = new mongoose.Schema({
    firstname: String,
    lastname: String,
    username: { type: String, unique: true },
    Email: { type: String, unique: true },
    Contactno: { type: String, unique: true },
    Age: Number,
    Password: String,
    numfollowing: { type: Number, default: 0 },
    numfollowers: { type: Number, default: 0 },
    Followers: {
        type: [{
            firstname: String,
            lastname: String,
            fusername: { type: String },
        }], sparse: true
    },
    Following: {
        type: [{
            firstname: String,
            lastname: String,
            fusername: { type: String },
        }], sparse: true
    }
});

const subgredditschema = new mongoose.Schema({
    PageId: { type: String, unique: true },
    Moderator: { type: String},
    Name:String, // Name of Subreddit Page
    Description:String,
    Banned_keywords : String,
    Tags: String,
    numfollowers: Number,
    Followers: {
        type: [{
            mfirstname: String,
            mlastname: String,
            musername: String,
            blocked: Boolean,
        }], sparse: true
    },
    numposts: Number,
    numvisitors: Number,
    PendingRequest: {
        type: [{
            pfirstname: String,
            plastname: String,
            pusername: String,
        }], sparse: true
    },
    numdeletedposts: Number,
    numreportedposts: Number,
    Reporters: {
        type: [{
            reportid: String,
        }], sparse: true
    },

}, { timestamps: true })

const reportschema = new mongoose.Schema({
    ReportId: { type: String, unique: true },
    Reportedby: String, // username of the person who reported
    whomreported: String, // pageid of the subgreddit page reported
    concern: String,
    Postid: String, // to get text of post
    Status: String, // ignored / blocked / reported / notselected
    createdAt: { type: Date, default: Date.now },
    expire_at: { type: Date, default: Date.now, expires: 60 * 60 * 24 * 10 }, // expire after 10 days of non-activity , further do myDocument.expire_at = null to remove expiry
},{ timestamps: true })

const postschema = new mongoose.Schema({
    PostId: { type: String, unique: true },
    Postedby: String, // username of the person who posted,
    PostedIn: String, // pageid of the subgreddit page posted in,
    Title:String,
    Text: String,
    Upvotes: Number,
    Downvotes: Number,
},{timestamps:true})

const User = mongoose.model('User', userschema);
const Subgreddit = mongoose.model('Subgreddit',subgredditschema);
const Report = mongoose.model('Report',reportschema);
const Post = mongoose.model('Post',postschema);

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
        "Password": encryptedpassword,
        "numfollowers": 0,
        "numfollowing": 0,
    }
    const user = new User(data);
    await user.save()
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
            let token = jwt.sign({ id: tempuser[0]._id, firstname: tempuser[0].firstname, lastname: tempuser[0].lastname, username: tempuser[0].username, email: tempuser[0].Email, contactno: tempuser[0].Contactno, age: tempuser[0].Age, numfollowers: tempuser[0].numfollowers, numfollowing: tempuser[0].numfollowing }, 'jwtsecret');
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


        let token = jwt.sign({ id: req.body.newdata.id, firstname: req.body.newdata.firstname, lastname: req.body.newdata.lastname, username: req.body.newdata.username, email: req.body.newdata.email, contactno: req.body.newdata.contactno, age: req.body.newdata.age, numfollowers: tempuser[0].numfollowers, numfollowing: tempuser[0].numfollowing }, 'jwtsecret');

        // console.log(resp)

        res.status(200).json({ success: true, token: token });
    }
})

app.post("/api/getfollowers", async (req, res) => {
    let username = req.body.username;
    const tempuser = await User.find({ username: username })

    if (!tempuser.length) // user not found
        res.status(400).json({ success: false, error: "User Not Found" })
    else {
        res.status(200).json(tempuser[0].Followers);
    }
})
app.post("/api/getfollowing", async (req, res) => {
    let username = req.body.username;
    const tempuser = await User.find({ username: username })

    if (!tempuser.length) // user not found
        res.status(400).json({ success: false, error: "User Not Found" })
    else {
        res.status(200).json(tempuser[0].Following);
    }
})

app.post("/api/removefollower", async (req, res) => {
    let followee = req.body.followee;
    let follower = req.body.follower;

    console.log(followee, follower)

    let tempuser = await User.find({ username: followee })

    for (var i = 0; i < tempuser[0].Followers.length; i++) {
        if (tempuser[0].Followers[i].fusername === follower) {
            var spliced = tempuser[0].Followers.splice(i, 1);
            break;
        }
    }
    tempuser[0].numfollowers = tempuser[0].numfollowers - 1;
    await tempuser[0].save()

    let token = jwt.sign({ id: tempuser[0]._id, firstname: tempuser[0].firstname, lastname: tempuser[0].lastname, username: tempuser[0].username, email: tempuser[0].Email, contactno: tempuser[0].Contactno, age: tempuser[0].Age, numfollowers: tempuser[0].numfollowers, numfollowing: tempuser[0].numfollowing }, 'jwtsecret');

    // Logic for removal from follower's following list 

    let tempuser1 = await User.find({ username: follower });
    for (var i = 0; i < tempuser1[0].Following.length; i++) {
        if (tempuser1[0].Following[i].fusername === followee) {
            var spliced = tempuser1[0].Following.splice(i, 1);
            break;
        }
    }
    tempuser1[0].numfollowing = tempuser1[0].numfollowing - 1;
    await tempuser1[0].save()

    res.status(200).json({ Usertoken: token, Follower: tempuser1[0].Following })

})

app.post("/api/removefollowing", async (req, res) => {
    let followee = req.body.followee;
    let following = req.body.following;


    let tempuser = await User.find({ username: followee })

    for (var i = 0; i < tempuser[0].Following.length; i++) {
        if (tempuser[0].Following[i].fusername === following) {
            var spliced = tempuser[0].Following.splice(i, 1);
            break;
        }
    }
    tempuser[0].numfollowing = tempuser[0].numfollowing - 1;
    await tempuser[0].save()

    let token = jwt.sign({ id: tempuser[0]._id, firstname: tempuser[0].firstname, lastname: tempuser[0].lastname, username: tempuser[0].username, email: tempuser[0].Email, contactno: tempuser[0].Contactno, age: tempuser[0].Age, numfollowers: tempuser[0].numfollowers, numfollowing: tempuser[0].numfollowing }, 'jwtsecret');

    // Logic for removal from following's follower list pending !!
    let tempuser1 = await User.find({ username: following });
    for (var i = 0; i < tempuser1[0].Followers.length; i++) {
        if (tempuser1[0].Followers[i].fusername === followee) {
            var spliced = tempuser1[0].Followers.splice(i, 1);
            break;
        }
    }
    tempuser1[0].numfollowers = tempuser1[0].numfollowers - 1;
    await tempuser1[0].save()

    res.status(200).json({ Usertoken: token, Following: tempuser1[0].Followers })

})

app.post('/api/fetchprofile', async (req, res) => {
    let username = req.body.username;
    let tempuser = await User.find({ username: username })

    let token = jwt.sign({ id: tempuser[0]._id, firstname: tempuser[0].firstname, lastname: tempuser[0].lastname, username: tempuser[0].username, email: tempuser[0].Email, contactno: tempuser[0].Contactno, age: tempuser[0].Age, numfollowers: tempuser[0].numfollowers, numfollowing: tempuser[0].numfollowing }, 'jwtsecret');

    res.status(200).json({ token: token });
})

app.post('/api/follow', async (req, res) => {
    let user = req.body.user;
    let whotofollow = req.body.whotofollow;

    let tempuser = await User.find({ username: user });
    let tempuser1 = await User.find({ username: whotofollow });

    tempuser[0].Following.push({
        firstname: tempuser1[0].firstname,
        lastname: tempuser1[0].lastname,
        fusername: tempuser1[0].username
    })
    tempuser[0].numfollowing = tempuser[0].numfollowing + 1;

    tempuser1[0].Followers.push({
        firstname: tempuser[0].firstname,
        lastname: tempuser[0].lastname,
        fusername: tempuser[0].username
    })
    tempuser1[0].numfollowers = tempuser1[0].numfollowers + 1;

    console.log(tempuser[0]);

    await tempuser[0].save();
    await tempuser1[0].save();

    let token = jwt.sign({ id: tempuser[0]._id, firstname: tempuser[0].firstname, lastname: tempuser[0].lastname, username: tempuser[0].username, email: tempuser[0].Email, contactno: tempuser[0].Contactno, age: tempuser[0].Age, numfollowers: tempuser[0].numfollowers, numfollowing: tempuser[0].numfollowing }, 'jwtsecret');

    res.status(200).json({ token: token });
})

app.post('/api/createsubgreddit',async(req,res)=>{
    let data = req.body;
    // console.log(data)
    pagedata = {
        "PageId":uuidv4(),
        "Moderator":req.body.moderator,
        "Name":req.body.name,
        "Description":req.body.description,
        "Banned_keywords":req.body.banned_keywords,
        "Tags":req.body.tags,
        "numfollowers":1,
        "Followers":[{
            "mfirstname":req.body.modfname,
            "mlastname":req.body.modlname,
            "musername":req.body.moderator,
            "blocked":false
        }],
        "numposts":0,
        "numvisitors":0,
        "PendingRequest":[],
        "numdeletedposts":0,
        "numreportedposts":0,
        "Reporters":[]
    }

    const page = new Subgreddit(pagedata);
    await page.save();

    console.log(page)
    let token = jwt.sign({page}, 'jwtsecret');  
    res.status(200).json({token:token})  ;
})

app.post("/api/getmysubgreddits",async(req,res)=>{
    let data = req.body;
    let mysubgredits = await Subgreddit.find({Moderator:data.username})
    let token = jwt.sign({mysubgredits},'jwtsecret');
    res.status(200).json({token:token})
})

app.post("/api/createpost",async(req,res)=>{
    let data = req.body;
    console.log(data)
    let postdata = {
        "PostId":uuidv4(),
        "PostedIn":data.pageid,
        "Postedby":data.postedby,
        "Title":data.title,
        "Text":data.text,
        "Upvotes":0,
        "Downvotes":0,
    }

    let pagedata = await Subgreddit.find({PageId:data.pageid});
    pagedata[0].numposts = pagedata[0].numposts + 1;
    await pagedata[0].save();

    const post = new Post(postdata);
    await post.save();

    let token = jwt.sign({post},'jwtsecret');
    res.status(200).json({token:token});
})

app.post('/api/fetchposts',async (req,res)=>{
    let data = req.body;
    let posts = await Post.find({PostedIn:data.pageid});
    let subgreddit = await Subgreddit.find({PageId:data.pageid});

    let token = jwt.sign({posts},'jwtsecret');
    res.status(200).json({token:token , moderator:subgreddit[0].Moderator});
})

app.post('/api/fetchsubmembers',async(req,res)=>{
    let data = req.body;
    console.log(data)
    let subdata = await Subgreddit.find({PageId:data.pageid});
    
    let followers = subdata[0].Followers;

    let token = jwt.sign({followers},'jwtsecret');
    res.status(200).json({token:token});
})

app.post('/api/fetchjoiningreq',async(req,res)=>{
    let data = req.body;
    let pagedata = await Subgreddit.find({PageId:data.pageid});

    let requests = pagedata[0].PendingRequest;
    let token = jwt.sign({requests},'jwtsecret');
    res.status(200).json({token:token});
})

app.post('/api/acceptjoiningreq',async(req,res)=>{
    let data = req.body;
    let pagedata = await Subgreddit.find({PageId:data.pageid});

    let requests = pagedata[0].PendingRequest;
    let followers = pagedata[0].Followers;

    let temp = requests.filter((request)=>{
        return request.pusername === data.username;
    });

    followers.push({
        mfirstname:temp[0].pfirstname,
        mlastname:temp[0].plastname,
        musername:temp[0].pusername,
        blocked:false
    });

    pagedata[0].numfollowers = pagedata[0].numfollowers + 1;
    
    requests = requests.filter((request)=>{
        return request.pusername !== data.username;
    });

    pagedata[0].PendingRequest = requests;
    await pagedata[0].save();

    let token = jwt.sign({requests},'jwtsecret');
    res.status(200).json({token:token});
})

app.post('/api/rejectjoiningreq',async(req,res)=>{
    let data = req.body;
    let pagedata = await Subgreddit.find({PageId:data.pageid});

    let requests = pagedata[0].PendingRequest;
    
    requests = requests.filter((request)=>{
        return request.pusername !== data.username;
    });

    pagedata[0].PendingRequest = requests;
    await pagedata[0].save();

    let token = jwt.sign({requests},'jwtsecret');
    res.status(200).json({token:token});
})

app.get('/api/getallsubgreddits',async(req,res)=>{
    let subgreddits = await Subgreddit.find({});
    console.log(subgreddits);
    let token = jwt.sign({subgreddits},'jwtsecret');

    res.status(200).json({token:token});
})

app.listen(3001, () => {
    console.log('Server started on port 3001');
});