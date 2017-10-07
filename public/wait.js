$(document).ready(function(){
	var name = document.getElementById("name");
	var id = document.getElementById("id");
	var char = document.getElementById("char");
	var round = document.getElementById("round");
	var DATA = document.getElementById("data");
	var askServer = function(){
		setInterval(function(){
			$.ajax({
				url:"/wait/"+name.innerHTML+"/"+id.innerHTML,
				type: "GET",
				complete: function(data){
					//console.log(data.responseJSON);
					char.textContent = data.responseJSON.char;
					if(round.textContent !== "Round : "+data.responseJSON.round.toString()){
						DATA.innerHTML = "";
						for(var i=0;i<data.responseJSON.data.length;i++){
							var item = document.createElement("p");
							item.textContent = data.responseJSON.data[i].name+" : "+data.responseJSON.data[i].char;
							DATA.appendChild(item);
						}	
					}
					round.textContent = "Round : "+data.responseJSON.round;
				},
			});
		},2000)
	}
    askServer();
});

