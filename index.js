'use strict'

const express = require('express')
const bodyParser = require('body-parser')
const request = require('request')
const app = express()

app.set('port', (process.env.PORT || 5000))

// Process application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({extended: false}))

// Process application/json
app.use(bodyParser.json())


// for Facebook verification
app.get('/webhook/', function (req, res) {
	if (req.query['hub.verify_token'] === 'my_voice_is_my_password_verify_me') {
		res.status(200).send(req.query['hub.challenge']);
	}
    res.sendStatus(403); 
	res.send('Error, wrong token')
})
// Index route
app.get('/', function (req, res) {
  res.status(200).send(req.query['hub.challenge']);
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

const token = "EAAPleZB81ZAuABALZBsCFxi5znTisZCTf1LOty7AryCzapfe2Mk54XGscg109wnvXvTLGalcgmhgkiV9ME2OmmFnhtEgkRgZCqnylFMbW8kP3ZBy6Xa5QY62k8YAg3115NJYUIWGzdtgBQ3hH1QAM1ON3pEbH5WDnJ6czCDEjgZAQZDZD";
// Spin up the server
app.listen(app.get('port'), function() {
	console.log('running on port', app.get('port'))
})
/*
EAAPleZB81ZAuABALZBsCFxi5znTisZCTf1LOty7AryCzapfe2Mk54XGscg109wnvXvTLGalcgmhgkiV9ME2OmmFnhtEgkRgZCqnylFMbW8kP3ZBy6Xa5QY62k8YAg3115NJYUIWGzdtgBQ3hH1QAM1ON3pEbH5WDnJ6czCDEjgZAQZDZD
*/