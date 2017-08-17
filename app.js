var express = require('express');
var bodyParser = require('body-parser');
var urlencodeParser = bodyParser.urlencoded({extended: false});

var app = express();
var port = 2500;

var players = [];
var playerId = 0;
var allCharName = ['were wolf','sear','villager','villager','villager','villager'];
var charecter = [];
var randomed = [];

var randomChar = function(){
	for(var i=0;i<players.length();i++){
		charecter.push(allCharName[i]);
	}
	for(var i=0;i<players.length();i++){
		match = [];
		var p = Math.floor(Math.random()*players.length())+1;
		var ch = Math.floor(Math.random()*players.length())+1;
		players.char = charecter[ch];
		randomed.push(players[p]);
		players.splice(p,1);
		chrecter.splice(ch,1);
	}
}

app.use(express.static('./public'));

app.get('/',function(req,res){
	res.sendFile(__dirname+'/name.html');
});
app.post('/setname',urlencodeParser,function(req,res){

	players.push({name:req.body.name,id:playerId,host:false,char:null});
	playerId+=1;
	console.log(req.body.name);
	res.sendFile(__dirname+'/waiting.html');
});

app.get('/host',function(req,res){
	res.sendFile(__dirname+'/hostname.html');
});

app.post('/sethostname',urlencodeParser,function(req,res){
	
	players.push({name:req.body.name,id:playerId,host:true,char:null});
	playerId+=1;
	res.sendFile(__dirname+'/hostwaiting.html');
});

app.get('/play',function(req,res){
	res.sendFile(__dirname+'/index.html');
})

app.listen(port,function(){
	console.log('SERVER IS RUNNING AT PORT : ',port);
});