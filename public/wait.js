$(document).ready(function(){
	var name = document.getElementById("name");
	var id = document.getElementById("id");
	var char = document.getElementById("char");
	var round = document.getElementById("round");
	var data = document.getElementById("data");
	var mydata = null
	$.ajax({
		url:"/wait/"+name.innerHTML+"/"+id.innerHTML,
		type: "GET",	
		complete: function(data){
			if(round !== data.responseJSON.round || mydata !== data){
				char.textContent = data.responseJSON.char;
				round.textContent = data.responseJSON.round;
				mydata = data.responseJSON.data;
				for(var i=0;i<data.responseJSON.data;i++){
					var item = document.createElement("p");
					item.textContent = i.name+" : "+i.char;
					data.appendChild(item);
				}
			}					
		},
	});
	var askServer = function(){
		setInterval(function(){
			$.ajax({
				url:"/wait/"+name.innerHTML+"/"+id.innerHTML,
				type: "GET",
				complete: function(data){
					console.log(data.responseJSON);
					if(round !== data.responseJSON.round){
						char.textContent = data.responseJSON.char;
						round.textContent = "Round : "+data.responseJSON.round;
						mydata = data.responseJSON.data;
						for(var i=0;i<data.responseJSON.data;i++){
							var item = document.createElement("p");
							item.textContent = i.name+" : "+i.char;
							data.appendChild(item);
						}
					}					
				},
			});
		},2000)
	}
    askServer();
});

