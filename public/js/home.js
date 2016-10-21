
  if(localStorage.getItem("code")!==null){
  	location.assign("/app");
  }
    $(document).keypress(function(e) {
    if(e.which == 13 && document.getElementById("fridgeCode").value!=="" ) {

		localStorage.setItem("code",document.getElementById("fridgeCode").value);
		//console.log(localStorage.getItem("fridgeCode"));
		//alert(localStorage.getItem("code")+" in form "+document.getElementById("fridgeCode").value);
         location.assign("/app");
    }
});
