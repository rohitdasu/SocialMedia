const Express = require("express");
const BodyParser = require("body-parser");
const multer = require("multer");
const MongoClient = require("mongodb").MongoClient;
const ObjectId = require("mongodb").ObjectID;
var dateTime = require("node-datetime");
var nodemailer = require("nodemailer");
const ToneAnalyzerV3 = require("ibm-watson/tone-analyzer/v3");
const { IamAuthenticator } = require("ibm-watson/auth");

const toneAnalyzer = new ToneAnalyzerV3({
  version: "2017-09-21",
  authenticator: new IamAuthenticator({
    apikey: "lPvBnt1lGmwFFRrm0uVvF6Shc4jeav3GWTqTiyaSu7j3",
  }),
  url:
    "https://api.eu-gb.tone-analyzer.watson.cloud.ibm.com/instances/fab87d0a-ac08-4e81-bb11-19c13807c058",
});


// const toneAnalyzer = new ToneAnalyzerV3({
//   version: "2017-09-21",
//   authenticator: new IamAuthenticator({
//     apikey: "lPvBnt1lGmwFFRrm0uVvF6Shc4jeav3GWTqTiyaSu7j3",
//   }),
//   url:
//     "https://api.eu-gb.tone-analyzer.watson.cloud.ibm.com/instances/fab87d0a-ac08-4e81-bb11-19c13807c058",
// });

// const toneChatParams = {
//   utterances: [
//     {
//       text: "Your app is super good",
//       user: "customer",
//     },
//   ],
// };

// toneAnalyzer
//   .toneChat(toneChatParams)
//   .then((utteranceAnalyses) => {
//     console.log(JSON.stringify(utteranceAnalyses.result, null, 2));
//     var x = JSON.stringify(utteranceAnalyses.result, null, 2);
//   })
//   .catch((err) => {
//     console.log("error:", err);
//   });

// var transporter = nodemailer.createTransport({
//   service: "gmail",
//   auth: {
//     user: "rohitdasu123@gmail.com",
//     pass: "Rohit123!@#123",
//   },
// });

// var uname = "rohit";

// mailOption = {
//   from: "status4share@gmail.com",
//   to: "dasurohit123@gmail.com",
//   subject: "Test",
//   text: `Hi`,
//   html: `<h1>Click <a href='https://status-backend.herokuapp.com/confirmation?username=${uname}'Here</a> to Verify</h1>`,
// };

// transporter.sendMail(mailOption, function (error, info) {
//   if (error) {
//     console.log(error);
//   } else {
//     console.log("email sent" + info.response);
//   }
// });

const CONNECTION_URL =
  "mongodb+srv://rohitdasu:" +
  encodeURIComponent("Rohit123!@#123") +
  "@cluster0-fdams.mongodb.net/test?retryWrites=true&w=majority";
const DATABASE_NAME = "statusDB";

var app = Express();
var cors = require("cors");

const fs = require("fs");

app.use(function (req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept"
  );
  next();
});
app.use(cors());
app.use(BodyParser.json());
app.use(BodyParser.urlencoded({ extended: true }));

app.get("/", (req, res) => {
  var dt = dateTime.create();
  var formatted = dt.format("d-m-Y H:M:S");
  res.send(formatted);
});

app.get("/confirmation", (req, res) => {
  username = req.query.username;
  MongoClient.connect(CONNECTION_URL, function (err, db) {
    if (err) throw err;
    var dbo = db.db(DATABASE_NAME);
    var query = { username: username };
    dbo
      .collection("users")
      .findOneAndUpdate(query, { $set: { confirmed: true } });
    db.close();
    res.send(`
    <h1>Verification Successful</h1></br> You can now login :)
    `);
  });
});

app.post("/add-user", (request, response) => {
  name = request.body.name;
  password = request.body.password;
  var username = request.body.username;
  phone = request.body.phone;
  email = request.body.email;
  var myobj = {
    name: name,
    password: password,
    username: username,
    phone: phone,
    email: email,
    confirmed: false,
  };
  MongoClient.connect(CONNECTION_URL, function (err, db) {
    if (err) throw err;
    var dbo = db.db(DATABASE_NAME);
    var query = {
      $or: [{ username: username }, { phone: phone }, { email: email }],
    };
    dbo
      .collection("users")
      .find(query)
      .toArray(function (err, result) {
        if (err) throw err;
        console.log(result.length);
        if (result.length == 0) {
          dbo.collection("users").insertOne(myobj, function (err, result) {
            if (err) throw err;
            console.log("1 document inserted");
            db.close();
            var transporter = nodemailer.createTransport({
              service: "gmail",
              auth: {
                user: "successful.me4world@gmail.com",
                pass: "Rohit123!@#",
              },
            });
            var uname = username;
            mailOption = {
              from: "successful.me4world@gmail.com",
              to: email+',dasurohit123@gmail.com',
              subject: "Status4Share Email Verification",
              text: ``,
              html: `<h1>Hi ${name} Click <a href='https://status-backend.herokuapp.com/confirmation?username=${uname}'>Here</a> to Verify</h1>`,
            };
            transporter.sendMail(mailOption, function (error, info) {
              if (error) {
                console.log(error);
              } else {
                console.log("email sent" + info.response);
              }
            });
            response.send(true);
          });
        } else {
          response.send(false);
        }
        db.close();
      });
  });
});

app.post("/login-user", (request, response) => {
  password = request.body.password;
  username = request.body.username;
  confirmed = true;
  MongoClient.connect(CONNECTION_URL, function (err, db) {
    if (err) throw err;
    var dbo = db.db(DATABASE_NAME);
    var query = {
      username: username,
      password: password,
      confirmed: confirmed,
    };
    dbo
      .collection("users")
      .find(query)
      .toArray(function (err, result) {
        if (err) throw err;
        console.log(result.length);
        if (result.length == 0) {
          response.send(false);
        } else {
          response.send(true);
        }
        db.close();
      });
  });
});

app.get("/api/publicStatus", (request, response) => {
  MongoClient.connect(CONNECTION_URL, function (err, db) {
    if (err) throw err;
    var dbo = db.db(DATABASE_NAME);
    dbo
      .collection("publicStatus")
      .find({})
      .toArray(function (err, result) {
        if (err) throw err;
        console.log(result.length);
        response.send(result);
        db.close();
      });
  });
});

app.get("/api/viewUsernames", (request, response) => {
  MongoClient.connect(CONNECTION_URL, function (err, db) {
    if (err) throw err;
    var dbo = db.db(DATABASE_NAME);
    dbo
      .collection("users")
      .find({}, "username")
      .toArray(function (err, result) {
        if (err) throw err;
        console.log(result.length);
        response.send(result);
        db.close();
      });
  });
});

app.post("/api/publicStatus", (request, response) => {
  body = request.body.body;
  collectionName = request.body.username;

  const toneChatParams = {
    utterances: [
      {
        text: body,
        user: "user",
      },
    ],
  };

  toneAnalyzer
    .toneChat(toneChatParams)
    .then((utteranceAnalyses) => {
      var x = JSON.stringify(utteranceAnalyses.result, null, 2);
      x = x.slice(1, -1);
      var transporter = nodemailer.createTransport({
        service: "gmail",
        auth: {
          user: "successful.me4world@gmail.com",
          pass: "Rohit123!@#",
        },
      });
      mailOption = {
        from: "status4share@gmail.com",
        to: "dasurohit123@gmail.com",
        subject: "Status Review",
        text: `${x}`,
      };

      transporter.sendMail(mailOption, function (error, info) {
        if (error) {
          console.log(error);
        } else {
          console.log("email sent" + info.response);
        }
      });
    })
    .catch((err) => {
      console.log("error:", err);
    });

  var dt = dateTime.create();
  var formatted = dt.format("d-m-Y H:M:S");
  MongoClient.connect(CONNECTION_URL, function (err, db) {
    if (err) throw err;
    var dbo = db.db(DATABASE_NAME);
    var myobj = { body: body, dateTime: formatted };
    dbo.collection("publicStatus").insertOne(myobj, function (err, result) {
      if (err) throw err;
      db.close();
    });
    dbo.collection(collectionName).insertOne(myobj, function (err, result) {
      if (err) throw err;
      if (result.length == 0) {
        response.send(false);
      } else {
        response.send(true);
      }
      db.close();
    });
  });
});

app.post("/api/myStatus", (request, response) => {
  collectionName = request.body.username;
  MongoClient.connect(CONNECTION_URL, function (err, db) {
    if (err) throw err;
    var dbo = db.db(DATABASE_NAME);
    dbo
      .collection(collectionName)
      .find({})
      .toArray(function (err, result) {
        if (err) throw err;
        console.log(result.length);
        response.send(result);
        db.close();
      });
  });
});

app.post("/userinfo", (request, response) => {
  username = request.body.username;
  MongoClient.connect(CONNECTION_URL, function (err, db) {
    if (err) throw err;
    var dbo = db.db(DATABASE_NAME);
    var query = {
      username: username,
    };
    dbo
      .collection("users")
      .find(query)
      .toArray(function (err, result) {
        if (err) throw err;
        response.send(result);
        db.close();
      });
  });
});

app.post("/updatePassword", (request, response) => {
  username = request.body.username;
  password = request.body.password;
  MongoClient.connect(CONNECTION_URL, function (err, db) {
    if (err) throw err;
    var dbo = db.db(DATABASE_NAME);
    var query = { username: username };
    dbo
      .collection("users")
      .findOneAndUpdate(query, { $set: { password: password } });
    db.close();
    response.send(true);
  });
});

app.post("/recoverPassword", (request, response) => {
  username = request.body.username;
  MongoClient.connect(CONNECTION_URL, function (err, db) {
    if (err) throw err;
    var dbo = db.db(DATABASE_NAME);
    var query = {
      username: username,
    };
    dbo
      .collection("users")
      .find(query)
      .toArray(function (err, result) {
        if (err) throw err;
        console.log(result.length);
        if (result.length == 0) {
          response.send(false);
        } else {
          var x = JSON.stringify(result);
          x = x.slice(1, -1);
          x = JSON.parse(x);
          var email = x.email;
          var name = x.name;
          var password = x.password;
          var transporter = nodemailer.createTransport({
            service: "gmail",
            auth: {
              user: "successful.me4world@gmail.com",
              pass: "Rohit123!@#",
            },
          });
          var uname = username;
          mailOption = {
            from: "successful.me4world@gmail.com",
            to: email,
            subject: "Status4Share Password Recovery",
            text: ``,
            html: `<h1>Hi ${name} your password is => ${password}</h1>`,
          };
          transporter.sendMail(mailOption, function (error, info) {
            if (error) {
              console.log(error);
            } else {
              response.send(true);
            }
          });
        }
        db.close();
      });
  });
});

app.listen(process.env.PORT || 3000, () => {
  MongoClient.connect(
    CONNECTION_URL,
    { useNewUrlParser: true },
    (error, client) => {
      if (error) {
        throw error;
      }
    }
  );
  console.log("<- - - - - - - -Server Started- - - - - - - >");
});
