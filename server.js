const express = require('express')
const app = express()
const port = 3004
const request = require('request');
const admin = require('firebase-admin');
var passwordHash = require("password-hash");
const serviceAccount = require('./musickey.json');
const bodyParser = require('body-parser');
const { name } = require('ejs');

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount)
});
const db = admin.firestore();
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({extended:false}));
app.set("views engine", "ejs");

app.get('/home', (req, res) => {
    res.render(__dirname+"/public/"+"home.ejs");
  });

app.get('/login', (req, res) => {
    res.render(__dirname+"/public/"+"login.ejs");
  });

  app.post('/loginSubmit', function (req, res) {

    const enteredPassword = req.body.password;
  
  
    db.collection('submit')
    .where("Email" ,"==",req.body.email)
    .get()
    .then((docs)=>{
      if (docs.size>0){
        docs.forEach((doc)=>{
          const hashedPassword=doc.data().Password;
          if (passwordHash.verify(enteredPassword,hashedPassword)){
            res.render(__dirname+"/public/"+"loginSubmit.ejs");
          }else{
            res.send("Username or Password is Incorrect, Please try again");
          }
        })
      }else{
        res.send("Failed");
      }
    
    });
    
  });

app.get('/signup', (req, res) => {
    res.render(__dirname+"/public/"+"signup.ejs");
  });

  app.post('/signupSubmit', function (req, res) {
    const hashedPassword = passwordHash.generate(req.body.password);
    db.collection('submit').where("Email","==",req.body.email).get()
    .then((docs) => {
      if(docs.size>0){
        res.send("This email is already exists")
      }
      else{
        db.collection('submit').add({
          Name:req.body.name,
          Email:req.body.email,
          Password:hashedPassword,
        }).then(()=>{
        res.render(__dirname+"/public/"+"signupSubmit.ejs");
        });
      }
    });
    
  });

app.get('/events', (req, res) => {
    res.render(__dirname+"/public/"+"events.ejs");
  });

app.get('/theme', (req, res) => {
    res.render(__dirname+"/public/"+"theme.ejs");
  });

app.get('/about', (req, res) => {
    res.render(__dirname+"/public/"+"about.ejs");
  });

app.get('/registration', (req, res) => {
    res.render(__dirname+"/public/"+"registration.ejs");
  });

  app.post('/registrationSubmit', (req, res) => {
    const data = {
      FirstName: req.body.firstName, 
      LastName: req.body.lastName,
      PhoneNo: req.body.phone,
      Email: req.body.email,
      EventType: req.body.eventType,
      Date: req.body.date,
      Budget: req.body.budget
    };
  
    db.collection('todo')
      .add(data)
      .then(() => {
        res.render(__dirname + '/public/registrationSubmit.ejs');
      })
      .catch((error) => {
        console.error('Error adding document: ', error);
      });
  });

  app.get('/contact', (req, res) => {
    res.render(__dirname+"/public/"+"contact.ejs");
  });
  




app.listen(port, () => {
    console.log(`Example app listening on port ${port}`)
  })