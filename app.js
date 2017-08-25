var express = require('express');
var bodyParser = require('body-parser');
var urlencodeParser = bodyParser.urlencoded({extended: false});

const PWD = "ong";
var gameState = "waiting"

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
	//let length = players.length;
	for(var i=0;i<players.length;i++){
		match = [];
		var p = Math.floor(Math.random()*players.length);
		var ch = Math.floor(Math.random()*players.length);
		players[i].char = charecter[ch];
		randomed.push(players[p]);
		players.splice(p,1);
		charecter.splice(ch,1);
	}
}

var myTrim = function(x){
	return 	x.replace(":","");
}

app.use(express.static('./public'));

app.get('/',function(req,res){
	res.sendFile(__dirname+'/name.html');
});

app.get('/wait/:name/:id/:char',function(req,res){
	for(var i=0;i<players.length;i++){
		if(players[i].id.toString() === myTrim(req.params.id)){
			res.json({name:req.params.name,id:req.params.id,char:players[i].char});
		}
	}
	//console.log(req.params.name,req.params.id); 
});

app.post('/wait',urlencodeParser,function(req,res){
	players.push({name:req.body.name,id:playerId,host:false,char:null});
	res.render('../public/wait.ejs',{name:req.body.name,id:playerId,char:null});
	playerId+=1;
	console.log(req.body.name);
});

app.get('/login',function(req,res){
	res.render("../public/login.ejs",{pwdst:""});
});

app.post('/host',urlencodeParser,function(req,res){
	console.log(req.body.pwd);	
	if(myTrim(req.body.pwd) === PWD){
		console.log("host password is correct");
		players.push({name:req.body.name,id:playerId,host:true,char:null});
		res.render('../public/hostwaiting.ejs',{pwd:req.body.pwd,id:playerId,name:req.body.name,players:[]});
		playerId+=1;
	}
	else{
		res.render("../public/login.ejs",{pwdst:"password is not correct!"});
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
	//console.log(req.body.state);
	gameState = req.body.state;
	randomChar();
	let mydata = randomed.filter(function(player){return player.name === req.body.name;});
	res.json({data:req.body,char:mydata[0].char});
});


app.get('/hostshowchar/:pwd/:name/:id/:char',function(req,res){
	res.render('../public/showchar.ejs',{pwd:req.params.pwd,name:req.params.name,id:req.params.id,char:req.params.char});
})

app.listen(port,function(){
	console.log('SERVER IS RUNNING AT PORT : ',port);
});