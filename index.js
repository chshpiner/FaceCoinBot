'use strict'

const express = require('express')
const bodyParser = require('body-parser')
const request = require('request')
const path = require('path');
const app = express()
var messengerButton = "<html><head><title>Facebook Messenger Bot</title></head><body><h1>Facebook Messenger Bot</h1>This is a bot based on Messenger Platform QuickStart. For more details, see their <a href=\"https://developers.facebook.com/docs/messenger-platform/guides/quick-start\">docs</a>.<script src=\"https://button.glitch.me/button.js\" data-style=\"glitch\"></script><div class=\"glitchButton\" style=\"position:fixed;top:20px;right:20px;\"></div></body></html>";
app.set('port', (process.env.PORT || 5000))

// Process application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({extended: true}))

// Process application/json
app.use(bodyParser.json())

// for Facebook verification
app.get('/webhook/', function (req, res) {
	if (req.query['hub.mode'] === 'subscribe' &&req.query['hub.verify_token'] === 'my_voice_is_my_password_verify_me') {
        console.log("Validating webhook");
		res.status(200).send(req.query['hub.challenge']);
	}
	else{
    res.sendStatus(403); 
	res.send('Error, wrong token')}
})
// Index route
app.get('/', function (req, res) {
    console.log("bla bla");
  res.writeHead(200, {'Content-Type': 'text/html'});
  res.status(200).send(req.query['hub.challenge']);
  res.end();
})

// Index route
app.get('/', function (req, res) {
    res.writeHead(200, {'Content-Type': 'text/html'});
    res.write(messengerButton);
    res.end();
})


// Spin up the server
app.listen(app.get('port'), function() {
	console.log('running on port', app.get('port'))
})