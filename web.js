var async   = require('async');
var express = require('express');
var util    = require('util');
var nodemailer = require('nodemailer');

// create an express webserver
var app = express.createServer(
  express.logger(),
  express.static(__dirname + '/public'),
  express.bodyParser(),
  express.cookieParser(),
  express.session({ secret: process.env.SESSION_SECRET || 'secret123' })
);

var sendMail = function(mailOptions, cb) {
  mailOptions.from = "Mariage <christelleandbenjamin@gmail.com>";
  mailOptions.to = "Mariage <christelleandbenjamin@gmail.com>";

  var transport = nodemailer.createTransport("SMTP", {
      service: "",
      auth: {
          user: "christelleandbenjamin@gmail.com",
          pass: ""
      }
  });
  transport.sendMail(mailOptions, function(error, response){
        if(error){
            console.log(error);
            cb({success:false,error:error});
        }else{
            console.log("Message sent: " + response.message);
            cb({success:true,mailOptions:mailOptions}); 
        }
    });
  transport.close(); // close the pool
  console.log("Transport closed");

};

app.post('/rsvp', function(req, res) {
  console.log("new rsvp");
  var names = req.body.names,
      brunch = req.body.brunch,
      diner = req.body.diner;

  console.log("Names : "+names+" diner "+diner+" et brunch "+brunch);

  if(names && brunch && diner) {
    var mailOptions = {
        subject: "RVSP", // Subject line
        html: "<h3>Hey !</h3><p>Nouvel invité pour le mariage.</p><p><ul><li>Name : "+names+"</li><li>Nb de personnes au diner : "+diner+"</li><li>Nb de personnes au brunch : "+brunch+"</li></ul></p><p>The registration happened on : "+new Date()+" from IP address "+req.socket.remoteAddress+"."
    };
    sendMail(mailOptions, function(data) {
      res.send(data);
    });
  }
  else {
    res.send({success:false,error:"missing"});
  }
});

app.post('/music', function(req, res) {
  console.log("new music");
  
  var band = req.body.band,
      title = req.body.title;

  console.log("Music : ");

  if(band && title) {
    var mailOptions = {
        subject: "Musique", // Subject line
        html: "<h3>Hey !</h3><p>Nouvelle suggestion de musique pour le mariage.</p><p><ul><li>Groupe/Artiste : "+band+"</li><li>Titre : "+title+"</li></ul></p><p>La suggestion a été envoyée : "+new Date()+" from IP address "+req.socket.remoteAddress+"."
    };
    sendMail(mailOptions, function(data) {
      res.send(data);
    });
  }
  else {
    res.send({success:false,error:"missing"});
  }
});

app.post('/contact', function(req, res) {
  console.log("new message");
  
  var email = req.body.email,
      message = req.body.contenu;

  console.log("Music : ");

  if(email && message) {
    var mailOptions = {
        subject: "Message depuis le site du mariage", // Subject line
        html: "<h3>Hey !</h3><p>Nouveau message depuis le site du mariage.</p><p><ul><li>Email : "+email+"</li><li>Message : "+message+"</li></ul></p><p>Le message a été envoyé le : "+new Date()+" from IP address "+req.socket.remoteAddress+"."
    };
    sendMail(mailOptions, function(data) {
      res.send(data);
    });
  }
  else {
    res.send({success:false,error:"missing"});
  }
});

app.get('/', function(req, res) {
  res.sendfile('public/index.html'); 
});



// listen to the PORT given to us in the environment
var port = process.env.PORT || 3000;

app.listen(port, function() {
  console.log("Listening on " + port);
});

