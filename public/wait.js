$(document).ready(function(){
	var name = document.getElementById("name");
	var id = document.getElementById("id");
	var char = document.getElementById("char");
	var round = document.getElementById("round");
	$.ajax({
		url:"/wait/"+name.innerHTML+"/"+id.innerHTML,
		type: "GET",
		complete: function(data){
			if(round !== data.responseJSON.round){
						char.textContent = data.responseJSON.char;
						round.textContent = round.responseJSON.round;
				}
			//window.location = '/showchar/'+data.responseJSON.id+'/'+data.responseJSON.name+'/'+data.responseJSON.char;					
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
					}
					//window.location = '/showchar/'+data.responseJSON.id+'/'+data.responseJSON.name+'/'+data.responseJSON.char;					
				},
			});
		},2000)
	}
    askServer();
});

