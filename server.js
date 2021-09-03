//KAREL ATLAN 1304758
//NAOMI BAROGHEL 1476994
let path = require('path');
const fetch = require("node-fetch");
var bodyParser = require('body-parser');
const multer = require('multer');
const mime = require('mime');
const flash = require("express-flash");
var  favicon  = require('serve-favicon')
var mongodbfunction = require ("./models/mongodbscript.js");
const passport = require('passport');
const bcrypt = require('bcrypt');
var hash = require('object-hash');
const nodemailer = require("nodemailer");
const LocalStrategy = require('passport-local').Strategy;



let express = require('express');
var  app  = express ( )
app. use(favicon(path.join( __dirname , 'public/images' , 'iconefleur.ico')))



app.set('views', __dirname + '/public/views');
app.set('view engine', 'ejs');

app.use(express.static(path.join(__dirname, 'public')));
app.use(express.json());


// support parsing of application/json type post data
app.use(bodyParser.json());
//support parsing of application/x-www-form-urlencoded post data
app.use(bodyParser.urlencoded({ extended: true }));


var jsonParser = bodyParser.json()

const fs = require('fs')
var MongoClient = require('mongodb').MongoClient;

 // Connection URL de dick
 var url = "mongodb+srv://dickcasablanca:casablanca2647@cluster0.qftia.mongodb.net/myFirstDatabase?retryWrites=true&w=majority";



//authentification for the user
                                       /////////////////////////////////passport moment//////////////////////////////////////
passport.use('local-signin',new LocalStrategy({
        usernameField: 'name',
        passwordField: 'password',
         passReqTodone : true

    },

  async  function (usernameField, passwordField, done) {
    console.log("je rentre dans func1");


        console.log(usernameField);
            console.log(passwordField);
        process.nextTick( async function () {
            console.log("je rentre dans nextTick");
          const client = await MongoClient.connect(url, { useNewUrlParser: true })
              .catch(err => { console.log(err); });

          var dbo = client.db("FlowersDB");
            dbo.collection('users', async function (error, collection) {
              console.log("rnetre dans mongodb");
                if (!error) {
                  const hashpassword = await hash(passwordField)
                  console.log(hashpassword)
                  let query= {$and:[{"name":usernameField},{"password":hashpassword}]};
                  console.log(query);
                    console.log("query faite");
                await dbo.collection("users").findOne(query,function(err, user) {
                    console.log("findone fait");

            if (err) {

                console.log("Error in login: " + err);
                  return done(null, false);
            }
            //If user already exists in DB
            if (user) {

                console.log("User  exists");
                console.log(user);
                return done(null, user);
            }
            if(!user)
            {
                return done(null, false);
            }
console.log("gros soucis rien marche");

        })
    }})})}));


    app.post('/auth', function(req, res, next) {
      console.log("body:");
      console.log(req.body.name);
      console.log(req.body.password);
        console.log("je rentre dans auth");
        passport.authenticate('local-signin', function(err, user, info) {
          console.log("je vais retourner le status");
                if (err) {
                    return res.status(400).json({ errors: err });
                }
                if (!user) {
                    return res.status(400).json({ errors: "No user found" });
                }
              else if (user){

                return res.status(200).send({user:user});

              }

                })(req, res, next);
          });


          //authentification for the user
                                                 /////////////////////////////////passport moment//////////////////////////////////////
          passport.use('local-signup',new LocalStrategy({

                  usernameField: 'name',
                  emailField: 'email',
                  passwordField: 'password',
                   passReqToCallback : true

              },

            async  function (req,usernameField, passwordField, done) {
              console.log(req.body);
              console.log("je rentre dans func1");
              console.log(usernameField);
            console.log(passwordField);

                  process.nextTick( async function () {
                      console.log("je rentre dans nextTick");
                    const client = await MongoClient.connect(url, { useNewUrlParser: true })
                        .catch(err => { console.log(err); });

                    var dbo = client.db("FlowersDB");
                      dbo.collection('users', async function (error, collection) {
                        console.log("rentre dans mongodb");
                          if (!error) {
                            let query= {$or:[{"name":usernameField},{"email":req.body.email}]};
                            console.log(query);
                            console.log("query faite");

                          await dbo.collection("users").findOne(query,async function(err, user) {
                              console.log("findone fait");

                      if (err) {

                          console.log("Error in login: " + err);
                      }
                      //If user already exists in DB
                      if (user) {
                          console.log("User already exists");
                          return done(null, false);


                      }
                      if (!user) {
                          console.log("ok tu vas etre cree");
                        let counter=  await dbo.collection("counters").findOne({'name':'counters'});
                        let isworker=0;
                        let isadmin=0;
                        let isclient=0;
                        if(req.body.isworker==true){ isworker=1};
                        if(req.body.isadmin==true){ isadmin=1};
                        if(req.body.isclient==true){ isclient=1};
                          const hashpassword = await hash(passwordField)
                          console.log(hashpassword);

                          let newuser= {'id':counter.user_id,'name':usernameField, 'email':req.body.email,'password':hashpassword,'isAdmin':isadmin,'isWorker':isworker,'isClient':isclient}
                          await dbo.collection("users").insertOne(newuser);
                          counter.user_id= counter.user_id +1;
                          let  result = await dbo.collection("counters").updateOne( {'name':'counters'},
                           {$set: { user_id: counter.user_id}});
                          console.log(newuser);
                          return done(null, newuser);
                      }
          console.log("gros soucis rien marche");

                  })
              }})})}));


              app.post('/signup', function(req, res, next) {
                console.log("body:");
                console.log(req.body.name);
                  console.log(req.body.email);
                console.log(req.body.password);
                  console.log(req.body.isworker);
                    console.log(req.body.isadmin);
                      console.log(req.body.isclient);
                  console.log("je rentre dans signup");
                  passport.authenticate('local-signup', function(err, user, info) {
                    console.log("je vais retourner le status");
                          if (err) {
                              return res.status(400).json({ errors: err });
                          }
                          if (!user) {
                              return res.status(400).json({ errors: "No user found" });
                          }
                        else if (user){

                          return res.status(200).send({newuser:user});

                        }

                          })(req, res, next);
                    });


//display list shops
app.get("/shops", async function (req, res) {


     let result = await mongodbfunction.data.displayshops();
 if(result==null)
 {
   return res.sendStatus(404);

 }
 else {
   console.log("else");
   console.log(result);
   return res.status(200).send({shops:result});

    }

});


//display catalog of flowers
app.get("/flowers", async function (req, res) {

console.log(req.query);
let result = await mongodbfunction.data.displayflowers(req.query.shopid);
 if(result==null)
 {
   return res.sendStatus(404);

 }
 else {
   console.log("else");
   console.log(result);
   return res.status(200).send({listflowers:result});

    }

});


//display list of users
app.get("/users", async function (req, res) {



console.log("pour display users");
console.log(req.query);
     let result = await mongodbfunction.data.displayusers(req.query);
 if(result==null)
 {
   return res.sendStatus(404);

 }
 else {
   console.log("else");
   console.log(result);
   return res.status(200).send({users:result});

 }

    });

    app.get("/profile", async function (req, res) {



    console.log("pour display profile");
    console.log(req.query);
         let leuser = await mongodbfunction.data.displayprofile(req.query);
     if(leuser==null)
     {
       return res.sendStatus(404);

     }
     else {
       console.log("else");
       console.log(leuser);
       return res.status(200).send({user:leuser});

     }

        });


//add user

app.post("/add",jsonParser, async function (req, res) {



console.log("inadd");
console.log(req.body);


          let user = {"name":req.body.name, "password":req.body.password,"isAdmin":"","isWorker":"","isClient":"" };
          if(req.body.isworker)
          {
            user.isWorker=1;
            user.isAdmin=0;
            user.isClient=0;
          }
          else if(req.body.isadmin) {
            user.isAdmin=1;
            user.isWorker=0;
              user.isClient=0;
          }
          else {
            user.isAdmin=0;
            user.isWorker=0;
            user.isClient=1;
          }
let result = await mongodbfunction.data.adduser(user);
console.log(result);

      if(result==false)
      {
        return res.sendStatus(401);

      }
      else {
        return res.sendStatus(200);

      }

    });



//update user
app.post("/updateuser",jsonParser, async function (req, res) {
console.log(req.body);

    let result = await mongodbfunction.data.updateuser(req.body);
if(result==false)
{
  return res.sendStatus(401);

}
else {
  return res.sendStatus(200);

}


  });


//delete user
app.post("/deleteuser",jsonParser, async function (req, res) {


    let result = await mongodbfunction.data.deleteuser(req.body);
    if(result==false)
    {
      return res.sendStatus(409);

    }
    else {
      return res.sendStatus(200);

    }
  });



let storage = multer.diskStorage({
    destination: function(req, file, ca) {
        ca(null, 'public/images');
    },
    filename: function (req, file, cb) {
      //cb(null, file.fieldname + '-' + Date.now()+"."+mime.getExtension(file.mimetype))
      cb(null,   Date.now()+file.originalname)
    }
});
const upload2 = multer({ storage }).single('flowerimg');


//upload new flower in catalog
app.post('/upload', function (req, res) {
  upload2(req, res, function (err) {
    if (err) {
      console.log("error");
       return res.sendStatus(409);

    }
    else {

          console.log(req.file);
          return res.sendStatus(200);
    }
  })
});

const uploadbis = multer({ storage }).single('pic');

app.post('/uploadbis', function (req, res) {
  console.log('inupload');



  uploadbis(req, res, async function (err) {
    if (err) {
      console.log("error");
    //   return res.sendStatus(409);


    }
    else {

          console.log(req.file);
          console.log(req.body);
          let newflower = {"id":"","name":req.body.name,"price":req.body.price,"picture":req.file.filename,'isURL':0}
          let result = await mongodbfunction.data.addflower(newflower,req.body.shopid);


    }
  })
  res.redirect('index.html');

});


app.post('/url',jsonParser, async function (req, res) {
  console.log("in url");
  console.log(req.body);

  let newflower = {"id":"","name":req.body.name,"price":req.body.price,"picture":req.body.url,"isURL":1}
  let result = await mongodbfunction.data.addflower(newflower,req.body.shopid);
  res.redirect('index.html');



});
app.post("/sendmail",jsonParser, async function (req, res) {
console.log(req.body);

let result = await mongodbfunction.data.finduserbymail(req.body);

if(result==null)
{
  return res.sendStatus(404);

}
else {
    let id= result.id;
    let mail=result.email;



/*    let testAccount = await nodemailer.createTestAccount();

     // create reusable transporter object using the default SMTP transport
     let transporter = nodemailer.createTransport({
       host: "smtp.ethereal.email",
       port: 587,
       secure: false, // true for 465, false for other ports
       auth: {
         user: 'abdullah.wintheiser@ethereal.email',
         pass: 'wVrRCrqgPG5wCUyZCd'
       },
     });

     // send mail with defined transport object
     let info = await transporter.sendMail({
       from: '"Fred Foo" <foo@example.com>', // sender address
       to: mail, // list of receivers
       subject: "Hello ✔", // Subject line
       text: "Hello world?", // plain text body
       html: "<b>Hello world?</b>", // html body
     });

     console.log("Message sent: %s", info.messageId);
     // Message sent: <b658f8ca-6296-ccf4-8306-87d57a0b4321@example.com>

     // Preview only available when sending through an Ethereal account
     console.log("Preview URL: %s", nodemailer.getTestMessageUrl(info));
     // Preview URL: https://ethereal.email/message/WaQKMgKddxQDoou...*/

     const transporter = nodemailer.createTransport({
       service: 'gmail',
         auth: {
             user: 'kalibeauville@gmail.com',
             pass: 'Kali2647'
         }
     });

var mailOptions = {
  from: '"Support Team Fleur Site" <from@example.com>',
  to: mail,
  subject: 'Reset Password',
  text: 'Hello, there is the link to reset your password',
  html: '<b>Hello </b><br> There is the link to reset your password : <br/> <a href="http://localhost:8080/forgotpassword.html?='+id+ '"> http://localhost:8080/forgotpassword.html</a>',

};

transporter.sendMail(mailOptions, (error, info) => {
  if (error) {
    return console.log(error);
  }
  console.log('Message sent: %s', info.messageId);
});



  return res.sendStatus(200);


}});


//resete password user
app.post("/resetpassword",jsonParser, async function (req, res) {


    let result = await mongodbfunction.data.resetpassword(req.body);
    if(result==false)
    {
      return res.sendStatus(400);

    }
    else {
      return res.sendStatus(200);

    }
  });

app.listen(8080, function () {
    console.log('Example app listening on port 8080!');
});
