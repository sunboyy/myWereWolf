var express = require('express');
var bodyParser = require('body-parser');
var config = require('./config');
var GameManager = require('./game-manager');
var Player = require('./player');

var app = express();
app.set('view engine', 'ejs');
app.use(express.static('./public'));
app.use(bodyParser.urlencoded({extended: false}));

var gameManager = new GameManager();
var allCharName = ['moderator','were wolf','bodyguard','villager','villager','villager','were wolf','sear','villager','hunter','villager','villager'];
var character = [];
var randomed = [];

setInterval(function(){
	gameManager.gameLoop();
	if(gameManager.players.filter(function(item){return item.isHost}).length === 0 ){
		gameManager.reset();
		character = [];
		randomed = [];
		if(gameManager.players.length !== 0){
			console.log(" >> RESTART << ")
		}
	}
},1000);

var randomChar = function(){
	for(var i=0;i<gameManager.players.length;i++){
		character.push(allCharName[i]);
	}
	let length = gameManager.players.length;
	for(var i=0;i<length;i++){
		var p = Math.floor(Math.random()*(length-i));
		var ch = Math.floor(Math.random()*(length-i));
		gameManager.players[p].role = character[ch];
		randomed.push(gameManager.players[p]);
		gameManager.players.splice(p,1);
		character.splice(ch,1);
	}
	gameManager.players = randomed;
}

app.get('/',function(req,res){
	if(!gameManager.isStarted){
		res.render("name",{msg:""});
	}
	else {
		res.render("name",{msg:"The game was started pls wait for next round"});
	}
});

app.get('/wait/:name/:id',function(req,res){
	let found = false;
	for(var i=0;i<gameManager.players.length;i++){
		if(gameManager.players[i].id.toString() === req.params.id){
			res.json({name:req.params.name,id:req.params.id,char:gameManager.players[i].role,round:gameManager.round,data:gameManager.players[i].data});
			gameManager.players[i].refresh();
			found = true;
			break;
		}
	}
	if(!found){
		res.redirect('/');
	}
	//console.log(req.params.name,req.params.id); 
});

app.post('/wait', function(req,res){
	if(!gameManager.isStarted){
		let player = new Player(req.body.name, false, null, null);
		gameManager.players.push(player);
		//gameManager.players.push({name:req.body.name,id:playerId,host:false,char:null,data:null,time:30000});
		res.render('wait',{name:req.body.name,id:player.id,char:null,round:gameManager.round});
	}
	else {
		res.redirect('/');
	}
});

app.get('/login',function(req,res){
	res.render("login",{pwdst:""});
});

app.post('/host', function(req,res){
	//console.log(req.body.pwd);
	if(!gameManager.isStarted){
		if(req.body.pwd === config.PWD){
			console.log("host password is correct");
			let player = new Player(req.body.name, true, null, null);
			gameManager.players.push(player);
			//gameManager.players.push({name:req.body.name,id:playerId,host:true,char:null,data:null,time:30000});
			res.render('hostwaiting',{pwd:req.body.pwd,id:player.id,name:req.body.name,players:[]});
		}
		else{
			res.render("login",{pwdst:"password is not correct!"});
		}	
	}
	else{
		res.render("login",{pwdst:"The game was started pls wait for next round"});
	}
	
});

app.get('/hostwait/:pwd/:name/:id/:char', function(req,res){
	for(var i=0;i<gameManager.players.length;i++){
		gameManager.isStarted = false;
		if(gameManager.players[i].id.toString() === req.params.id && gameManager.players[i].name === req.params.name && req.params.pwd === config.PWD && gameManager.players[i].isHost){
			gameManager.players[i].refresh();
			return res.render('hostwaiting',{pwd:req.params.pwd,id:req.params.id,name:req.params.name,players:[]});
		}
	}
});

app.get('/host/:pwd/:name/:id/:char',function(req,res){
	let found = false;
	for(var i=0;i<gameManager.players.length;i++){
		gameManager.isStarted = false;
		if(gameManager.players[i].id.toString() === req.params.id && gameManager.players[i].name === req.params.name && req.params.pwd === config.PWD && gameManager.players[i].isHost){
			gameManager.players[i].refresh();
			found = true;
			res.json({pwd:req.params.pwd,id:req.params.id,name:req.params.name,players:gameManager.players})
			break;
		}
	}
	if(!found){
		res.render("login",{pwdst:"password is not correct!"});
	}
});

app.get('/host',function(req,res){
	res.render("login",{pwdst:"password is not correct!"});
});

app.post('/submit', function(req,res){
	// todos edit player.length
	if(gameManager.players.length > 0){
		gameManager.start();
		randomChar();
		for(var i=0;i<gameManager.players.length;i++){
			let data = null;
			if(gameManager.players[i].char === "moderator"){
				let nonModulator = gameManager.players.filter(function(item){return item.role !== "moderator"});
				data = nonModulator.map(function(item){ return {name:item.name,char:item.role} });
			}
			else if(gameManager.players[i].char === "were wolf"){
				let werewolfs = gameManager.players.filter(function(item){ return item.id !== gameManager.players[i].id && item.char === "were wolf"});
				data = werewolfs.map(function(item){ return {name:item.name,char:item.char} });
			}
			gameManager.players[i].data = data;
		}
		//console.log(randomed);
		let mydata = randomed.filter(function(player){return player.name === req.body.name;});
		return res.json({data:req.body,char:mydata[0].char,msg:""});
	}
	else{
		res.json({msg:"players must be more than 5."});
	}
	
});

app.post('/restart', function(req,res){
	for(var i=0;i<gameManager.players.length;i++){
		gameManager.players[i].restart();
	}
	res.json({data:req.body});
	console.log(" >> Round :",gameManager.round," <<");
});

app.get('/hostshowchar/:pwd/:name/:id/:char/:data',function(req,res){
	for(var i=0;i<gameManager.players.length;i++){
		if(gameManager.players[i].id.toString() === req.params.id && gameManager.players[i].name === req.params.name && req.params.pwd === config.PWD && gameManager.players[i].isHost){
			gameManager.players[i].refresh();
			return res.render('hostshowchar',{pwd:req.params.pwd,name:req.params.name,id:req.params.id,char:req.params.char,round:gameManager.round,data:req.params.data});
		}
	}
})

app.get('/hostshowchar/:pwd/:name/:id',function(req,res){
	for(var i=0;i<gameManager.players.length;i++){
		if(gameManager.players[i].id.toString() === req.params.id && gameManager.players[i].name === req.params.name && req.params.pwd === config.PWD && gameManager.players[i].isHost){
			gameManager.players[i].refresh();
			return res.json({name:req.params.name,id:req.params.id,char:gameManager.players[i].role,round:gameManager.round,data:gameManager.players[i].data});
		}
	}
});

app.get('/showchar/:id/:name/:char/:data',function(req,res){
	res.render('showchar',{id:req.params.id,name:req.params.name,char:req.params.char});
});

app.listen(config.port,function(){
	console.log();
	console.log('SERVER IS RUNNING AT PORT : ',config.port);
	console.log(" >> WEREWOLFS IS START NOW! <<");
});