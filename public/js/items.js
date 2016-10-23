
var database = firebase.database();
	// Remove and complete icons in SVG format
	var removeSVG = '<svg version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" x="0px" y="0px" viewBox="0 0 22 22" style="enable-background:new 0 0 22 22;" xml:space="preserve"><rect class="noFill" width="22" height="22"/><g><g><path class="fill" d="M16.1,3.6h-1.9V3.3c0-1.3-1-2.3-2.3-2.3h-1.7C8.9,1,7.8,2,7.8,3.3v0.2H5.9c-1.3,0-2.3,1-2.3,2.3v1.3c0,0.5,0.4,0.9,0.9,1v10.5c0,1.3,1,2.3,2.3,2.3h8.5c1.3,0,2.3-1,2.3-2.3V8.2c0.5-0.1,0.9-0.5,0.9-1V5.9C18.4,4.6,17.4,3.6,16.1,3.6z M9.1,3.3c0-0.6,0.5-1.1,1.1-1.1h1.7c0.6,0,1.1,0.5,1.1,1.1v0.2H9.1V3.3z M16.3,18.7c0,0.6-0.5,1.1-1.1,1.1H6.7c-0.6,0-1.1-0.5-1.1-1.1V8.2h10.6V18.7z M17.2,7H4.8V5.9c0-0.6,0.5-1.1,1.1-1.1h10.2c0.6,0,1.1,0.5,1.1,1.1V7z"/></g><g><g><path class="fill" d="M11,18c-0.4,0-0.6-0.3-0.6-0.6v-6.8c0-0.4,0.3-0.6,0.6-0.6s0.6,0.3,0.6,0.6v6.8C11.6,17.7,11.4,18,11,18z"/></g><g><path class="fill" d="M8,18c-0.4,0-0.6-0.3-0.6-0.6v-6.8c0-0.4,0.3-0.6,0.6-0.6c0.4,0,0.6,0.3,0.6,0.6v6.8C8.7,17.7,8.4,18,8,18z"/></g><g><path class="fill" d="M14,18c-0.4,0-0.6-0.3-0.6-0.6v-6.8c0-0.4,0.3-0.6,0.6-0.6c0.4,0,0.6,0.3,0.6,0.6v6.8C14.6,17.7,14.3,18,14,18z"/></g></g></g></svg>';
	var user = firebase.auth().currentUser;
  var list={};

  if (user) {
    console.log("good");
  } else {
    console.log("bad");
  }
  //var userId = firebase.auth().currentUser.uid;
  var expires_dates;
  var fridge;
  firebase.database().ref('/data').once('value').then(function(snapshot) {
   expires_dates = snapshot.val();

 });

  var userId=localStorage.getItem("code");
  console.log(localStorage.getItem("code"));
    if(localStorage.getItem("code")==null){
    location.assign("/");
  }
	// User clicked on the add button
	// If there is any text inside the item field, add that text to the todo list
	document.getElementById('add').addEventListener('click', function() {
		var value = document.getElementById('item').value;
		if (value) {
			addItemTodo(value);
			document.getElementById('item').value = '';
		}
	});
    document.getElementById('signOut').addEventListener('click', function() {
      localStorage.removeItem("code");
      location.assign("/");
  });

	function removeItem() {
		var item = this.parentNode.parentNode;
    var parent = item.parentNode;

    item.classList.add('del');
    $('li.del').addClass('animated fadeOutRight');
    $('li.del').one('webkitAnimationEnd mozAnimationEnd MSAnimationEnd oanimationend animationend', function() {
      $('li.del').removeClass('del animated fadeOutRight');
      parent.removeChild(item);
      firebase.database().ref('users/' + userId+'/'+item.innerText).remove();
    });
  }

  function writeUserData(userId, food, date) {
    firebase.database().ref('users/' + userId+'/'+food).set({
      food_name: food,
      buy_date: date
    });
  }
// Adds a new item to the todo list
function addItemTodo(text) {
  list = document.getElementById('todo');

  var item = document.createElement('li');
  item.classList.add('new');
  item.innerText = text;

  var buttons = document.createElement('div');
  buttons.classList.add('buttons');

  var remove = document.createElement('button');
  remove.classList.add('remove');
  remove.innerHTML = removeSVG;

  // Add click event for removing the item
  remove.addEventListener('click', removeItem);

  // Add click event for completing the item

  buttons.appendChild(remove);
  item.appendChild(buttons);

  list.insertBefore(item, list.childNodes[0]);
  var today = new Date();

  $('li.new').addClass('animated fadeInLeft');
  $('li.new').one('webkitAnimationEnd mozAnimationEnd MSAnimationEnd oanimationend animationend', function() {
    $('li.new').removeClass('new animated fadeInLeft');
    writeUserData(userId,text,today.getTime());
  });
}

    $(document).keypress(function(e) {
    if(e.which == 13 && document.getElementById("item").value!=="" ) {
    addItemTodo(document.getElementById("item").value);
    document.getElementById("item").value="";
    }
});

function getFridge(){
  firebase.database().ref('users/' + userId).once('value').then(function(snapshot) {
   fridge = snapshot.val();
 });
}

function expireNotice(){

	var today=new Date();
  getFridge();
   // console.log("2 "+fridge);
  var keys0 = Object.keys(expires_dates);
  //console.log(keys0.length);

  for(var z=0;z<keys0.length;z++){
    var i =keys0[z];
    var keys1 = Object.keys(expires_dates[i]);

    for(var a = 0; a < keys1.length-1; a++) {
      var c = keys1[a];
      var n = keys1[a + 1];
      for(var f in fridge){
       var keys = Object.keys(fridge[f]);

       for(var e = 1; e < keys.length; e++) {
         var current = keys[e];
         var previous = keys[e - 1];
    // console.log(expires_dates[i][c]+" == "+fridge[f][current]);
    if(expires_dates[i][c]===fridge[f][current]){
       // console.log(expires_dates[i][c]);
       if(today.getTime()>fridge[f][previous]+86400000*expires_dates[i][n]){
         $('#alerts').append("<div class=\"alert alert-warning\"><a href=\"#\" class=\"close\" data-dismiss=\"alert\" aria-label=\"close\">&times;</a>Eat your "+fridge[f][current]+" soon before they expire!</div>");
      }
    }

  }

}
}
}

}

window.onload = function() {
  setInterval(function() {
    expireNotice();
  }, 5000);

    firebase.database().ref('users/' + userId).once('value').then(function(snapshot) {
   fridge = snapshot.val();

  //console.log("1 "+fridge);
  var keys0 = Object.keys(fridge);

  for(var f=0;f<keys0.length;f++){
    var c= keys0[f];

    var keys = Object.keys(fridge[c]);
    //console.log(keys.length);
    for(var g=1;g<keys.length;g++){
     // console.log(g);
      var current=keys[g];
      addItemTodo(fridge[c][current]);
    }

  }
 });

};

//____________________________________________________________________________________________________________________________________________________

//Prepare form data
 var uploadEvt = function (evt) {
      //alert(document.getElementById('input').files);
      var files = document.getElementById('input').files [0];

      var storageRef = firebase.storage().ref();

      var metadata = {
        contentType: 'image/*',
      };

      var uploadTask = storageRef.child('images/' + files.name).put(files, metadata);

      // Listen for state changes, errors, and completion of the upload.
uploadTask.on(firebase.storage.TaskEvent.STATE_CHANGED, // or 'state_changed'
  function(snapshot) {
    // Get task progress, including the number of bytes uploaded and the total number of bytes to be uploaded
    var progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
    console.log('Upload is ' + progress + '% done');
    switch (snapshot.state) {
      case firebase.storage.TaskState.PAUSED: // or 'paused'
        console.log('Upload is paused');
        break;
      case firebase.storage.TaskState.RUNNING: // or 'running'
        console.log('Upload is running');
        break;
    }
  }, function(error) {
  switch (error.code) {
    case 'storage/unauthorized':
      // User doesn't have permission to access the object
      break;

    case 'storage/canceled':
      // User canceled the upload
      break;

    case 'storage/unknown':
      // Unknown error occurred, inspect error.serverResponse
      break;
  }
}, function() {
  // Upload completed successfully, now we can get the download URL

  var downloadURL = uploadTask.snapshot.downloadURL;
  //alert(downloadURL);
});
console.log(1);
var formData = new FormData();
//formData.append("url","http://normalness.com/wp-content/uploads//2016/01/Veggie-Grocery-Receipt.jpeg");
formData.append("file", document.getElementById('input').files [0]);
formData.append("language"
    , "eng");
formData.append("apikey"
    , "5e1bb1322188957");

formData.append("isOverlayRequired", false);

//Send OCR Parsing request asynchronously
console.log(1.5);
var settings = {
  "async": true,
  "crossDomain": true,
  "url": "https://api.ocr.space/parse/image",
  "method": "POST",
  "headers": {
    "cache-control": "no-cache",
    "postman-token": "f392d8da-9db8-6ca4-6a7d-4614825601aa"
  },
  "processData": false,
  "contentType": false,
  "mimeType": "multipart/form-data",
  "data": formData
}

$.ajax(settings).done(function (responsee) {

var response=jQuery.parseJSON(responsee);
  var parsedResults = response.ParsedResults;

var ocrExitCode = response.OCRExitCode;
var isErroredOnProcessing = response.IsErroredOnProcessing;
var errorMessage = response.ErrorMessage;
var errorDetails = response.ErrorDetails;
var processingTimeInMilliseconds = response.ProcessingTimeInMilliseconds;


console.log(3);
//If we have got parsed results, then loop over the results to do something
if (parsedResults!= null) {
//Loop through the parsed results
console.log("4");
$.each(parsedResults, function (index, value) {

var exitCode = value["FileParseExitCode"];
var parsedText = value["ParsedText"];
var errorMessage = value["ParsedTextFileName"];
var errorDetails = value["ErrorDetails"];

var textOverlay = value["TextOverlay"];

var pageText = '';
switch (+exitCode) {
case 1:
pageText = parsedText;
pageText = pageText.replace(/\r?\n|\r/g, '').toLowerCase();
console.log(pageText);
var words=pageText.split(" ");
for (var a in expires_dates){
 var keys0=Object.keys(expires_dates[a]);
 for(var s=0;s<keys0.length-1;s++){
  var current=keys0[s];
  for(var d in words){

    console.log("data: "+expires_dates[a][current]+" receipt: "+words[d]);
  if(expires_dates[a][current]===words[d].toLowerCase()){
    addItemTodo(expires_dates[a][current]);
  }
  }
 }

}
break;
case 0:
case -10:
case -20:
case -30:
case -99:
default:
pageText += "Error: " + errorMessage;
break;
}

$.each(textOverlay["Lines"], function (index, value) {

});
});

}

});
/*
jQuery.ajax({
    url: "https://api.ocr.space/parse/image",
data: formData,
dataType: 'form/multipart',
cache: false,
contentType: false,
processData: false,
type: 'json',
success: function (ocrParsedResult) {
  console.log(2);
//Get the parsed results, exit code and error message and details
var parsedResults = ocrParsedResult["ParsedResults"];
var ocrExitCode = ocrParsedResult["OCRExitCode"];
var isErroredOnProcessing = ocrParsedResult["IsErroredOnProcessing"];
var errorMessage = ocrParsedResult["ErrorMessage"];
var errorDetails = ocrParsedResult["ErrorDetails"];

var processingTimeInMilliseconds = ocrParsedResult["ProcessingTimeInMilliseconds"];
console.log(3);
//If we have got parsed results, then loop over the results to do something
if (parsedResults!= null) {
//Loop through the parsed results
$.each(parsedResults, function (index, value) {
var exitCode = value["FileParseExitCode"];
var parsedText = value["ParsedText"];
var errorMessage = value["ParsedTextFileName"];
var errorDetails = value["ErrorDetails"];

var textOverlay = value["TextOverlay"];

var pageText = '';
switch (+exitCode) {
case 1:
pageText = parsedText;
  console.log(pageText);
break;
case 0:
case -10:
case -20:
case -30:
case -99:
default:
pageText += "Error: " + errorMessage;
break;
}

$.each(textOverlay["Lines"], function (index, value) {

});


});

}
}
});
*/

    };

    document.getElementById('upload').addEventListener('click', uploadEvt);



