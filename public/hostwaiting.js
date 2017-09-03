$(document).ready(function(){
	var playerlist = document.getElementById("playerlist");
	var pwd = document.getElementById("pwd");
	var name = document.getElementById("name");
	var id = document.getElementById("id");
	var players = [];
	$("#submit").click(function(){
		$.post("/submit",{state:true,pwd:pwd.innerHTML,name:name.innerHTML,id:id.innerHTML},
			function(data){
				window.location = "/hostshowchar/"+data.data.pwd+'/'+data.data.name+'/'+data.data.id+'/'+data.char;
			}
		);
	});
	
	var askServer = function(){
		setInterval(function(){
			$.ajax({
				url:"/host/"+pwd.innerHTML+"/"+name.innerHTML+"/"+id.innerHTML+"/"+null,
				type: "GET",
				complete: function(data){
					//console.log(data.responseJSON.players === players);
					if(data.responseJSON.players !== players){
						players = data.responseJSON.players;
						$("#playerlist").empty();
						players.forEach(function(player){
							$("#playerlist").append($("<li></li>").text(player.name));
						});
					}
				}
			});
		},2000)
	}
	askServer();
});

