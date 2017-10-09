var express = require('express');
var bodyParser = require('body-parser');
var config = require('./config');
var GameManager = require('./game-manager');

var app = express();
app.set('view engine', 'ejs');
app.use(express.static('./public'));
app.use(bodyParser.urlencoded({extended: false}));

var gameManager = new GameManager();
var playerId = 0;
var allCharName = ['modulator','were wolf','bodyguard','villager','villager','villager','were wolf','sear','villager','hunter','villager','villager'];
var character = [];
var randomed = [];

setInterval(function(){
	gameManager.gameLoop();
	if(gameManager.players.filter(function(item){return item.host}).length === 0 ){
		gameManager.reset();
		playerId = 0;
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
		gameManager.players[p].char = character[ch];
		randomed.push(gameManager.players[p]);
		gameManager.players.splice(p,1);
		character.splice(ch,1);
	}
	gameManager.players = randomed;
}

app.get('/',function(req,res){
	if(gameManager.state === "waiting"){
		res.render("name",{msg:""});
	}
	else if(gameManager.state === "start"){
		res.render("name",{msg:"The game was started pls wait for next round"});
	}
});

app.get('/wait/:name/:id',function(req,res){
	let s = 0;
	for(var i=0;i<gameManager.players.length;i++){
		if(gameManager.players[i].id.toString() === req.params.id){
			res.json({name:req.params.name,id:req.params.id,char:gameManager.players[i].char,round:gameManager.round,data:gameManager.players[i].data});
			gameManager.players[i].time =  30000;
			s = 1;
		}
	}
	if( s === 0){
		res.redirect('/');
	}
	//console.log(req.params.name,req.params.id); 
});

app.post('/wait', function(req,res){
	if(gameManager.state === "waiting"){
		gameManager.players.push({name:req.body.name,id:playerId,host:false,char:null,data:null,time:30000});
		res.render('wait',{name:req.body.name,id:playerId,char:null,round:gameManager.round});
		playerId+=1;
	}
	else if(gameManager.state === "start"){
		res.redirect('/');
	}
});

app.get('/login',function(req,res){
	res.render("login",{pwdst:""});
});

app.post('/host', function(req,res){
	//console.log(req.body.pwd);
	if(gameManager.state === "waiting"){
		if(req.body.pwd === config.PWD){
			console.log("host password is correct");
			gameManager.players.push({name:req.body.name,id:playerId,host:true,char:null,data:null,time:30000});
			res.render('hostwaiting',{pwd:req.body.pwd,id:playerId,name:req.body.name,players:[]});
			playerId+=1;
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
		gameManager.state = "waiting";
		if(gameManager.players[i].id.toString() === req.params.id && gameManager.players[i].name === req.params.name && req.params.pwd === config.PWD && gameManager.players[i].host){
			gameManager.players[i].time =  30000;
			return res.render('hostwaiting',{pwd:req.params.pwd,id:req.params.id,name:req.params.name,players:[]});
		}
	}
});

app.get('/host/:pwd/:name/:id/:char',function(req,res){
	let s = 0;
	for(var i=0;i<gameManager.players.length;i++){
		gameManager.state = "waiting";
		if(gameManager.players[i].id.toString() === req.params.id && gameManager.players[i].name === req.params.name && req.params.pwd === config.PWD && gameManager.players[i].host){
			gameManager.players[i].time =  30000;
			res.send({pwd:req.params.pwd,id:req.params.id,name:req.params.name,players:gameManager.players})
			s = 1;
			return 0;
		}
	}
	if(s === 0  ){
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
			if(gameManager.players[i].char === "modulator"){
				let nonModulator = gameManager.players.filter(function(item){return item.char !== "modulator"});
				data = nonModulator.map(function(item){ return {name:item.name,char:item.char} });
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
		gameManager.players[i].char = null;
		gameManager.players[i].data = null;
	}
	res.json({data:req.body});
	console.log(" >> Round :",gameManager.round," <<");
});

app.get('/hostshowchar/:pwd/:name/:id/:char/:data',function(req,res){
	for(var i=0;i<gameManager.players.length;i++){
		if(gameManager.players[i].id.toString() === req.params.id && gameManager.players[i].name === req.params.name && req.params.pwd === config.PWD && gameManager.players[i].host){
			gameManager.players[i].time =  30000;
			return res.render('hostshowchar',{pwd:req.params.pwd,name:req.params.name,id:req.params.id,char:req.params.char,round:gameManager.round,data:req.params.data});
		}
	}
})

app.get('/hostshowchar/:pwd/:name/:id',function(req,res){
	for(var i=0;i<gameManager.players.length;i++){
		if(gameManager.players[i].id.toString() === req.params.id && gameManager.players[i].name === req.params.name && req.params.pwd === config.PWD && gameManager.players[i].host){
			gameManager.players[i].time =  30000;
			return res.json({name:req.params.name,id:req.params.id,char:gameManager.players[i].char,round:gameManager.round,data:gameManager.players[i].data});
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