var express = require('express');
var bodyParser = require('body-parser');
var urlencodeParser = bodyParser.urlencoded({extended: false});

const PWD = "ong";
var gameState = "waiting";
var Round = 0;

var app = express();
var port = 2500;

var players = [];
var playerId = 0;
var allCharName = ['modulator','were wolf','sear','villager','villager','villager','villager'];
var charecter = [];
var randomed = [];

var randomChar = function(){
	for(var i=0;i<players.length;i++){
		charecter.push(allCharName[i]);
	}
	let length = players.length;
	for(var i=0;i<length;i++){
		var p = Math.floor(Math.random()*(length-i));
		var ch = Math.floor(Math.random()*(length-i));
		players[p].char = charecter[ch];
		randomed.push(players[p]);
		players.splice(p,1);
		charecter.splice(ch,1);
	}
	players = randomed;
}


app.use(express.static('./public'));

app.get('/',function(req,res){
	if(gameState === "waiting"){
		res.render("../public/name.ejs",{msg:""});
	}
	else if(gameState === "start"){
		res.render("../public/name.ejs",{msg:"The game was started pls wait for next round"});
	}
});

app.get('/wait/:name/:id',function(req,res){
	for(var i=0;i<players.length;i++){
		//console.log("hello");
		if(players[i].id.toString() === req.params.id){
			res.json({name:req.params.name,id:req.params.id,char:players[i].char,round:Round});
		}
	}
	//console.log(req.params.name,req.params.id); 
});

app.post('/wait',urlencodeParser,function(req,res){
	if(gameState === "waiting"){
		players.push({name:req.body.name,id:playerId,host:false,char:null});
		res.render('../public/wait.ejs',{name:req.body.name,id:playerId,char:null,round:Round});
		playerId+=1;
	}
	else if(gameState === "start"){
		res.redirect('/');
	}
});

app.get('/login',function(req,res){
	res.render("../public/login.ejs",{pwdst:""});
});

app.post('/host',urlencodeParser,function(req,res){
	//console.log(req.body.pwd);	
	if(req.body.pwd === PWD){
		console.log("host password is correct");
		players.push({name:req.body.name,id:playerId,host:true,char:null});
		res.render('../public/hostwaiting.ejs',{pwd:req.body.pwd,id:playerId,name:req.body.name,players:[]});
		playerId+=1;
	}
	else{
		res.render("../public/login.ejs",{pwdst:"password is not correct!"});
	}
});

app.get('/hostwait/:pwd/:name/:id/:char',urlencodeParser,function(req,res){
	gameState = "waiting";
	if(req.params.pwd === PWD){
		res.render('../public/hostwaiting.ejs',{pwd:req.params.pwd,id:req.params.id,name:req.params.name,players:[]});
	}
});

app.get('/host/:pwd/:name/:id/:char',function(req,res){
	if(req.params.pwd === PWD){
		res.send({pwd:req.params.pwd,id:req.params.id,name:req.params.name,players:players})
	}
	else{
		res.render("../public/login.ejs",{pwdst:"password is not correct!"});
	}
});

app.get('/host',function(req,res){
	res.render("../public/login.ejs",{pwdst:"password is not correct!"});
});


app.post('/submit',urlencodeParser,function(req,res){
	gameState = "start";
	Round += 1;
	randomChar();	
	console.log(randomed);
	let mydata = randomed.filter(function(player){return player.name === req.body.name;});
	res.json({data:req.body,char:mydata[0].char});
});

app.post('/restart',urlencodeParser,function(req,res){
	console.log(Round);
});

app.get('/hostshowchar/:pwd/:name/:id/:char',function(req,res){
	res.render('../public/hostshowchar.ejs',{pwd:req.params.pwd,name:req.params.name,id:req.params.id,char:req.params.char,round:Round});
})

app.get('/showchar/:id/:name/:char',function(req,res){
	res.render('../public/showchar.ejs',{id:req.params.id,name:req.params.name,char:req.params.char});
});

app.listen(port,function(){
	console.log('SERVER IS RUNNING AT PORT : ',port);
});