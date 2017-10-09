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
var allCharName = ['modulator','were wolf','bodyguard','villager','villager','villager','were wolf','sear','villager','hunter','villager','villager'];
var charecter = [];
var randomed = [];



setInterval(function(){
	if(gameState === 'waiting'){
		for(var i=0;i<players.length;i++){
			players[i].time-=1000;
		}
/*		players = players.filter(function(item){
			return item.time > 0;
		});*/
		for (let i = 0; i < players.length; i++) {
			if (players[i].time <= 0) {
				players.splice(i, 1);
			}
		}
	}
	if(gameState === 'start'){
		for(var i=0;i<players.length;i++){
			if(players[i].host){
				players[i].time-=1.67;
			}
		}
	}
	if(players.filter(function(item){return item.host}).length === 0 ){
		gameState = "waiting";
		Round = 0;
		players = [];
		playerId = 0;
		charecter = [];
		randomed = [];
		if(players.length !== 0){
			console.log(" >> RESART << ")
		}
	}
},1000);


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

app.set('view engine', 'ejs');
app.use(express.static('./public'));

app.get('/',function(req,res){
	if(gameState === "waiting"){
		res.render("name",{msg:""});
	}
	else if(gameState === "start"){
		res.render("name",{msg:"The game was started pls wait for next round"});
	}
});

app.get('/wait/:name/:id',function(req,res){
	let s = 0;
	for(var i=0;i<players.length;i++){
		if(players[i].id.toString() === req.params.id){
			res.json({name:req.params.name,id:req.params.id,char:players[i].char,round:Round,data:players[i].data});
			players[i].time =  30000;
			s = 1;
		}
	}
	if( s === 0){
		res.redirect('/');
	}
	//console.log(req.params.name,req.params.id); 
});

app.post('/wait',urlencodeParser,function(req,res){
	if(gameState === "waiting"){
		players.push({name:req.body.name,id:playerId,host:false,char:null,data:null,time:30000});
		res.render('wait',{name:req.body.name,id:playerId,char:null,round:Round});
		playerId+=1;
	}
	else if(gameState === "start"){
		res.redirect('/');
	}
});

app.get('/login',function(req,res){
	res.render("login",{pwdst:""});
});

app.post('/host',urlencodeParser,function(req,res){
	//console.log(req.body.pwd);
	if(gameState === "waiting"){
		if(req.body.pwd === PWD){
			console.log("host password is correct");
			players.push({name:req.body.name,id:playerId,host:true,char:null,data:null,time:30000});
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

app.get('/hostwait/:pwd/:name/:id/:char',urlencodeParser,function(req,res){
	for(var i=0;i<players.length;i++){
		gameState = "waiting";
		if(players[i].id.toString() === req.params.id && players[i].name === req.params.name && req.params.pwd === PWD && players[i].host){
			players[i].time =  30000;
			return res.render('hostwaiting',{pwd:req.params.pwd,id:req.params.id,name:req.params.name,players:[]});
		}
	}
});

app.get('/host/:pwd/:name/:id/:char',function(req,res){
	let s = 0;
	for(var i=0;i<players.length;i++){
		gameState = "waiting";
		if(players[i].id.toString() === req.params.id && players[i].name === req.params.name && req.params.pwd === PWD && players[i].host){
			players[i].time =  30000;
			res.send({pwd:req.params.pwd,id:req.params.id,name:req.params.name,players:players})
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


app.post('/submit',urlencodeParser,function(req,res){
	// todos edit player.length
	if(players.length > 0){
		gameState = "start";
		Round += 1;
		randomChar();
		for(var i=0;i<players.length;i++){
			let data = null;
			if(players[i].char === "modulator"){
				let nonModulator = players.filter(function(item){return item.char !== "modulator"});
				data = nonModulator.map(function(item){ return {name:item.name,char:item.char} });
			}
			else if(players[i].char === "were wolf"){
				let werewolfs = players.filter(function(item){ return item.id !== players[i].id && item.char === "were wolf"});
				data = werewolfs.map(function(item){ return {name:item.name,char:item.char} });
			}
			players[i].data = data;
		}
		//console.log(randomed);
		let mydata = randomed.filter(function(player){return player.name === req.body.name;});
		return res.json({data:req.body,char:mydata[0].char,msg:""});
	}
	else{
		res.json({msg:"players must be more than 5."});
	}
	
});

app.post('/restart',urlencodeParser,function(req,res){
	for(var i=0;i<players.length;i++){
		players[i].char = null;
		players[i].data = null;
	}
	res.json({data:req.body});
	console.log(" >> Round :",Round," <<");
});

app.get('/hostshowchar/:pwd/:name/:id/:char/:data',function(req,res){
	for(var i=0;i<players.length;i++){
		if(players[i].id.toString() === req.params.id && players[i].name === req.params.name && req.params.pwd === PWD && players[i].host){
			players[i].time =  30000;
			return res.render('hostshowchar',{pwd:req.params.pwd,name:req.params.name,id:req.params.id,char:req.params.char,round:Round,data:req.params.data});
		}
	}
})

app.get('/hostshowchar/:pwd/:name/:id',function(req,res){
	for(var i=0;i<players.length;i++){
		if(players[i].id.toString() === req.params.id && players[i].name === req.params.name && req.params.pwd === PWD && players[i].host){
			players[i].time =  30000;
			return res.json({name:req.params.name,id:req.params.id,char:players[i].char,round:Round,data:players[i].data});
		}
	}
});

app.get('/showchar/:id/:name/:char/:data',function(req,res){
	res.render('showchar',{id:req.params.id,name:req.params.name,char:req.params.char});
});

app.listen(port,function(){
	console.log("");
	console.log('SERVER IS RUNNING AT PORT : ',port);
	console.log(" >> WEREWOLFS IS START NOW! <<");
});