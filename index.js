'use strict'

const express = require('express')
const bodyParser = require('body-parser')
const request = require('request')
const path = require('path');
const app = express()
var messengerButton = "<html><head><title>Facebook Messenger Bot</title></head><body><h1>Facebook Messenger Bot</h1>This is a bot based on Messenger Platform QuickStart. For more details, see their <a href=\"https://developers.facebook.com/docs/messenger-platform/guides/quick-start\">docs</a>.<script src=\"https://button.glitch.me/button.js\" data-style=\"glitch\"></script><div class=\"glitchButton\" style=\"position:fixed;top:20px;right:20px;\"></div></body></html>";
app.set('port', (process.env.PORT || 5000))
const token = "<EAAPleZB81ZAuABADMpmZAFoKvIx9kdvbz0H06NlsqgjcC1G6p5zgZAhtAOZCMSrC4A2UgNmYk0wzCRNvtpOrmN9hW6cNde3GCvfEDpgzZAxkTxhE82vX4LswzWNF08ABUO9RJgYF7OXRagCvCXHK8HZC4RFQCoP3GmoWVLdKgzrCQZDZD>"
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
});
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

app.post('/webhook/', function (req, res) {
    let messaging_events = req.body.entry[0].messaging
    for (let i = 0; i < messaging_events.length; i++) {
        let event = req.body.entry[0].messaging[i]
        let sender = event.sender.id
        if (event.message && event.message.text) {
            let text = event.message.text
            sendTextMessage(sender, "Text received, echo: " + text.substring(0, 200))
        }
    }
    res.sendStatus(200)
})

