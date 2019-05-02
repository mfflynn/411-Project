

function sendPlaylist(){
	const playlistid = escape(document.getElementById("playlistid").value);
	var playName = 'New Playlist';
	
	const xmlHttp = new XMLHttpRequest();
	xmlHttp.open( "GET", "/getjson/"+playlistid, true );
	
	const xmlHttpName = new XMLHttpRequest();
	xmlHttpName.open( "GET", "/getname/"+playlistid, true );

	xmlHttp.onreadystatechange=function(){
		if(this.readyState == 4){
			displayPlaylist(JSON.parse(xmlHttp.responseText),playName);
		}
	}
	xmlHttpName.onreadystatechange=function(){
		if(this.readyState == 4){
			playName = JSON.parse(xmlHttpName.responseText)["name"]
			xmlHttp.send();
			
		}
	}
	xmlHttpName.send();


    
    return
}

function displayPlaylist(jsonData,playName){
    output = "";
    songInfo = [];
    artistInfo = [];
    for (i = 0; i < jsonData["items"].length; i++){
        songInfo.push((jsonData["items"][i]["track"]["name"]));
        artistInfo.push((jsonData["items"][i]["track"]["artists"][0]["name"]));
    }
    console.log("songInfo");
    console.log(songInfo);
    songNums = songInfo.length;
    for (i = 0; i < songInfo.length; i++){
        output = output + "<p>" + songInfo[i] + " by " + artistInfo[i] + "<p>"
    }
    document.getElementById("dataspot").innerHTML = output;
    findYoutube(songInfo, artistInfo, songNums, playName);
    
}

function findYoutube(songInfo, artistInfo, songNums, playName){
    console.log("paramSI");
    console.log(songInfo);
    toDisplay = [];
    for (i = 0; i < songInfo.length; i++){
        const xmlHttp = new XMLHttpRequest();
        xmlHttp.open( "GET", "/getyoutube/"+encodeURIComponent(songInfo[i] + " " + artistInfo[i]), true );
        xmlHttp.send();
        xmlHttp.onreadystatechange=function(){
            if(this.readyState == 4){
                console.log(songInfo[i]);
                //displayYout(JSON.parse(xmlHttp.responseText));
                toDisplay.push(xmlHttp.responseText);


                if(songNums==toDisplay.length){
                    console.log("finalReached");
					makePlaylist(toDisplay,playName);
                    displayYout(toDisplay);
                }
            }
        }
    }
    

}

function displayYout(vidids){
    output="";
    for (i = 0; i < vidids.length; i++){
        console.log(vidids[i]);
        output+="<p><iframe width='560' height='315' src='https://www.youtube.com/embed/" + vidids[i]+ "' frameborder='0' allow='accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture' allowfullscreen></iframe></p>";
    }
    document.getElementById("datayout").innerHTML = output;
    
}

function makePlaylist(vidids,name){
    var playlistLink = "nah";
	var playlistID = "0";
	const xmlHttp = new XMLHttpRequest();
	xmlHttp.open( "GET", "/newPlaylist/"+name, true );
    xmlHttp.send();
	xmlHttp.onreadystatechange=function(){
        if(this.readyState == 4){
			playlistID = JSON.parse(xmlHttp.responseText)["id"];
			console.log("playlistID");
			console.log(playlistID);
			playlistLink = "https://www.youtube.com/playlist?list="+playlistID;
			document.getElementById("playlisturl").innerHTML = "<a href='"+ playlistLink +"'>Playlist is here!</a>";
			for (i = 0; i < vidids.length; i++){
				//var delayInMilliseconds = 1000; 
				//setTimeout(function() {
				const xmlHttpSongSend = new XMLHttpRequest();
				xmlHttpSongSend.open( "GET", "/addsong/"+playlistID+"/"+encodeURIComponent(vidids[i])+"/"+i, true );
				xmlHttpSongSend.send();
				//}, delayInMilliseconds);
			}
		}
	}
}
