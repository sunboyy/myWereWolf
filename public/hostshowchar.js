window.onload = function(){
	var pwd = document.getElementById("pwd");
	var name = document.getElementById("name");
	var id = document.getElementById("id");

	$("#restart").click(function(){
		console.log('Hello World');
		$.post("/submit",{state:true,pwd:pwd.innerHTML,name:name.innerHTML,id:id.innerHTML},
			function(data){
				window.location = "/hostwait/"+data.data.pwd+'/'+data.data.name+'/'+data.data.id+'/'+data.char;
			}
		);
	});
}