var app = require('express')();
var port = 2500;

var playerNum = 6
var allCharName = ['were wolf','villager','villager','villager','villager','sear'];
var charecter = [];

var randomChar = function(){
	charecter = [];
	for(var i=0;i<allCharName.length();i++){
		var our = Math.random()
		charecter.add();	
	}
}

app.get('/',function(req,res){
	res.sendFile(__dirname+'/index.html');
});

app.listen(port,function(){
	console.log('SERVER IS RUNNING AT PORT : ',port);
});