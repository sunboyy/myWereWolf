window.onload = function(){
	var pwd = document.getElementById("pwd");
	var name = document.getElementById("name");
	var id = document.getElementById("id");
	var askServer = function(){
		setInterval(function(){
			$.ajax({
				url:"/hostshowchar/"+pwd.innerHTML+"/"+name.innerHTML+"/"+id.innerHTML,
				type: "GET",
				complete: function(data){
					console.log(data.responseJSON);					
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