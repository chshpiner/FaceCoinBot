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
            switch (check(text)) {
                case 1:
                    createAccount(sender);
                    break;
                case 2:
                    charge(sender, text);
                    break;
                case 3:
                    setShop(sender, text);
                    break;
                case 4:
                    setName(sender, text);
                    break;
                case 5:
                    setItem(sender, text);
                    break;
                case 6:
                    buyItem(sender, text);
                    break;
                case 7:
                    printBalance(sender);
                    break;
                default:
                    sendTextMessage(sender, "Oops! I didn't understand you :( Well, I am very smart, but not as much as you... can you please try again?")
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
var acc=["Account","Accounts","account","accounts","Create","create"];
var charg = ["Charge","charge","money"];
var uniqueName = ["name","Name"];
var shop = ["Shop","Sell","shop","sell"];
var buy = ["Buy","buy"];
var add = ["Add","add"];
var bal = ["Current","current"];
function setItem(sender,text){
     if(!isAccountExist(sender)){
         sendTextMessage(sender, "Do you want to add an item? That's great! You need to create an account first");
         return;
     }
    var words = text.split(" ");
    var item = {name:words[1],amount:  parseInt(words[2]),price: parseInt(words[3])};
    let users = mem.users;
    for(var i = 0; i < users.length;++i){
        if(users[i].id == sender){
            break;
        }
    }
    users[i].Items.push(item);
    console.log(users[i].Items);
    let msg = "";
        msg += "Item: " + item.name + " Amount: "+ item.amount + " Price: " + item.price; + "\n";
    sendTextMessage(sender, "Your Items for sell: \n" + msg + " The buyer needs to write: buy <your unique name> <Item> <amount>");
}

function buyItem(sender, text){
      if(!isAccountExist(sender)){
         sendTextMessage(sender, "Do you want to buy an item? That's great! You need to create an account first");
         return;
     }
    var words = text.split(" ");
    var seller = words[1];
    var itemName = words[2];
    var amount = parseInt(words[3]);
    let users = mem.users;
    let user;
    for(var i = 0; i < users.length;++i){
        if(users[i].id == sender){
            user = users[i];
            break;
        }
    }
    if(!isTheNameUsed(seller)){
        sendTextMessage(sender,"You are trying to buy an item from a seller that dosen't exist");
        return;
    } else {
        for(var i = 0; i < users.length;i++){
        if(users[i].name == seller){
            seller = users[i];
            var items = users[i].Items;
            for(var j = 0 ; j < items.length; j++){
                var item = items[j];
                if(item.name == itemName){
                    if (amount > item.amount){
                        sendTextMessage(sender,"The seller has only " + item.amount + " of this item");
                        return;
                    } else {
                        if(user.balance < item.price * amount){
                            sendTextMessage(sender, "You don't have enough money");
                            return;
                        } else {
                            user.balance -= item.price * amount;
                            seller.balance += item.price * amount;
                            item.amount -= amount;
                            sendTextMessage(sender,"Your purchase has been procced successfully Your balance is: "+ user.balance);
                            sendTextMessage(seller.id, user.name + " bought " + amount +" "+ itemName+" Your balance is: "+ seler.balance);
                            return;
                        }
                    }
                }
            }
            sendTextMessage(sender, "The seller dosen't have that item");
            return;
         }

        }  
    }
}

function setName(sender,text){
     if(!isAccountExist(sender)){
         sendTextMessage(sender, "Do you want to sell? great! please create an account first");
         return;
     }
     var words = text.split(" ");
     var name = words[1];
     if (!name){
         sendTextMessage(sender, "Please write a name")
     }
     if(isTheNameUsed(name)){
         sendTextMessage(sender, "Sorry, the name is already taken. Try again");
         return;
    }
    let users = mem.users;
    let user;
    for(var i = 0; i < users.length;i++){
        if(users[i].id == sender){
            user = users[i];
            break;
        }
    }
    user.name = name;
    sendTextMessage(sender, "Your unique name is "+ name+ "! now you can sell items :) If you want to add an item to sell, please write: add <item name> <amount> <price>");
}
function isTheNameUsed(name){
    let users = mem.users;
    let user;
    for(var i = 0; i < users.length; i++){
        console.log("check:"+users[i].name);
        if(users[i].name == name){
            return true;
        }
    return false;
  }
}
function setShop(sender){
    sendTextMessage(sender, "In order to sell items you need to setup an unique name first, please write: name <your chosen name>");
}
function charge(sender,text){
    var a= /\d+/g;
    var x = text.match(a);
    x = parseInt(x);
    if(isAccountExist(sender)){
        if(x){
        setBalance(sender,x)
        sendTextMessage(sender, "Charging your account...");
        printBalance(sender);
    }
    else {
        sendTextMessage(sender, "You are trying to charge money, but you didn't tell me how much... please specify an amount");
    }
    }
    else{
        sendTextMessage(sender, "Oy, you are trying to charge your account, but you don't have one! Please creat a Facecoin account first")
    }
}

function check(text){
    var words = text.split(" ");
    for(var i = 0; i< words.length; i++){
        if(acc.indexOf(words[i])>-1){
            return 1;
        }
        else if(charg.indexOf(words[i])>-1){
            return 2;
        }
        else if(shop.indexOf(words[i])>-1){
            return 3;
        }
        else if(uniqueName.indexOf(words[i])>-1){
            return 4;
        }
        else if(add.indexOf(words[i])>-1){
            return 5;
        }
        else if(buy.indexOf(words[i])>-1){
            return 6;
        }
        else if(bal.indexOf(words[i])>-1){
            return 7;
        }
    }
}
function createAccount(sender) {
    if(!isAccountExist(sender)) {
        let user;
        user = {id : sender,
            balance : 0,
            name : sender,
            Items: []
        };
        mem.users.push(user);
        
        //sendTextMessage(sender, "Creating your Facecoin account...");
        sendTextMessage(sender, "Congrasulations! you have created a brand new Facecoin account!");   
    } else {
        sendTextMessage(sender, "You already have a Facecoin account")
    }
    printBalance(sender);
}
function isAccountExist(sender){
    let users = mem.users;
    let user;
    for(var i = 0; i < users.length;++i){
        if(users[i].id == sender){
            return true;
        }
    }
    return false;
}
function printBalance(sender){
    setTimeout(function(){
        let msg = " Your balance is: ";
        msg +=  getBalance(sender);
        sendTextMessage(sender, msg);
    },500);
}
function getBalance(sender){
    let users = mem.users;
    let user;
    for(var i = 0; i < users.length;++i){
        if(users[i].id == sender){
            user = users[i];
            break;
        }
    }
    return user.balance;
}
function setBalance(sender,x){
    let users = mem.users;
    let user;
    for(var i = 0; i < users.length;++i){
        if(users[i].id == sender){
            user = users[i];
        }
    }
    user.balance = user.balance + x;
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

const token = "EAAPleZB81ZAuABAERwUoYyQYkhGgkqyboCE1CKs8VEQpZAYKeOr2ZAi0lAjlTCMpgJfK4dVWO6ZC884sE69yps32TgHyu8Gb1IRBWYUidceFjiIRy0qxMVP57nTu2VrZB4rirlXTWSQHZA2UpuIOF9E8MVoUkZBpQW3wLXAZCLzeM3Dvfkq4xmdkF";
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