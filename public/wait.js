$(document).ready(function(){
	var name = document.getElementById("name");
	var id = document.getElementById("id");
	var char = document.getElementById("char");
	var xhttp = new XMLHttpRequest();

	var askServer = function(){
		setTimeout(function(){
			$.ajax({
				url:"/wait/"+name.innerHTML+"/"+id.innerHTML+"/"+null,
				type: "GET",
				complete: function(data){
					console.log(data.responseJSON);
				},
			});
			//xhttp.open("GET","/wait/:"+name.innerHTML+"/:"+id.innerHTML+"/:"+,true);
			//xhttp.send()
			askServer();
		},2000)
	}
    askServer();
});

