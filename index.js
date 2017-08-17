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
    console.log("aaaaaaaa");
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

app.post('/webhook/', function (req, res) {
    console.log(req.body);
    let messaging_events = req.body.entry[0].messaging
    for (let i = 0; i < messaging_events.length; i++) {
	    let event = req.body.entry[0].messaging[i]
	    let sender = event.sender.id
	    if (event.message && event.message.text) {
		    let text = event.message.text
            switch (text) {
                case 'create account':
                    createAccount(sender);
                    break;
                case 'set selling':
                    setSelling(sender, text);
                    break;
                default:
                    sendTextMessage(sender, "Text received, echo: " + text.substring(0, 200))
                    break;
            }
	    }
    }
    res.sendStatus(200)
});
var mem;
mem = {
    "users": []
}
function createAccount(sender) {
    let user;
    user = {id : sender,
            balance : 0};
    mem.users.push(user);
    sendTextMessage(sender, "Congrasulations! you have a Facecoin account");
    printBalance(sender);
}
function printBalance(sender){
    var counter = 0;
    while(counter != 3000)
        counter++;
    if(counter == 3000){
        let msg = " Your balance is: ";
        msg +=  getBalance(sender);
        sendTextMessage(sender, msg);
    }
}
function getBalance(sender){
    let users = mem.users;
    let user;
    for(var i = 0; i < users.length;++i){
        if(users[i].id == sender){
            user = users[i];
        }
    }
    return user.balance;
}
function setSelling(sender, text) {
    let obj = {sender:sender,text:text};
    arr.push(obj);
    console.log(arr[0]);
}
function sendTextMessage(sender, text) {
    let messageData = { text:text }
    request({
	    url: 'https://graph.facebook.com/v2.10/me/messages',
	    qs: {access_token:token},
	    method: 'POST',
		json: {
		    recipient: {id:sender},
			message: messageData,
		}
	}, function(error, response, body) {
		if (error) {
		    console.log('Error sending messages: ', error)
		} else if (response.body.error) {
		    console.log('Error: ', response.body.error)
	    }
    })
}

const token = "EAAPleZB81ZAuABALZBsCFxi5znTisZCTf1LOty7AryCzapfe2Mk54XGscg109wnvXvTLGalcgmhgkiV9ME2OmmFnhtEgkRgZCqnylFMbW8kP3ZBy6Xa5QY62k8YAg3115NJYUIWGzdtgBQ3hH1QAM1ON3pEbH5WDnJ6czCDEjgZAQZDZD";
// Spin up the server
app.listen(app.get('port'), function() {
	console.log('running on port', app.get('port'))
})
/*
EAAPleZB81ZAuABALZBsCFxi5znTisZCTf1LOty7AryCzapfe2Mk54XGscg109wnvXvTLGalcgmhgkiV9ME2OmmFnhtEgkRgZCqnylFMbW8kP3ZBy6Xa5QY62k8YAg3115NJYUIWGzdtgBQ3hH1QAM1ON3pEbH5WDnJ6czCDEjgZAQZDZD
*/

// Index route
app.get('/', function (req, res) {
    res.writeHead(200, {'Content-Type': 'text/html'});
    res.write(messengerButton);
    res.end();
})


