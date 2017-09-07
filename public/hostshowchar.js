window.onload = function(){
	var pwd = document.getElementById("pwd");
	var name = document.getElementById("name");
	var id = document.getElementById("id");
	var DATA = document.getElementById("data");
	var round = document.getElementById("round")
	var askServer = function(){
		setInterval(function(){
			$.ajax({
				url:"/hostshowchar/"+pwd.innerHTML+"/"+name.innerHTML+"/"+id.innerHTML,
				type: "GET",
				complete: function(data){
					//console.log(data.responseJSON);
					char.textContent = data.responseJSON.char;
					DATA.innerHTML = "";
					for(var i=0;i<data.responseJSON.data.length;i++){
						var item = document.createElement("p");
						item.textContent = data.responseJSON.data[i].name+" : "+data.responseJSON.data[i].char;
						DATA.appendChild(item);
					}	
					round.textContent = "Round : "+data.responseJSON.round;				
				},
			});
		},2000)
	}
    askServer();

	$("#restart").click(function(){
		$.post("/restart",{state:true,pwd:pwd.innerHTML,name:name.innerHTML,id:id.innerHTML},
			function(data){
				window.location = "/hostwait/"+data.data.pwd+'/'+data.data.name+'/'+data.data.id+'/'+data.char;
			}
		);
	});
}