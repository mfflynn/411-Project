

function sendPlaylist(){
	const xmlHttp = new XMLHttpRequest();
    const playlistid = document.getElementById("playlistid").value;
    xmlHttp.open( "GET", "/getjson/"+playlistid, true );
    xmlHttp.send();
    xmlHttp.onreadystatechange=function(){
        if(this.readyState == 4){
            displayPlaylist(JSON.parse(xmlHttp.responseText));
        }
    }
    
    return
}

function displayPlaylist(jsonData){
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
    console.log("HEEEERE1");
    findYoutube(songInfo, artistInfo, songNums);
    
}

function findYoutube(songInfo, artistInfo, songNums){
    console.log("paramSI");
    console.log(songInfo);
    toDisplay = [];
    for (i = 0; i < songInfo.length; i++){
        console.log("HEEEERE1");
        const xmlHttp = new XMLHttpRequest();
        xmlHttp.open( "GET", "/getyoutube/"+encodeURIComponent(songInfo[i] + " " + artistInfo[i]), true );
        xmlHttp.send();
        xmlHttp.onreadystatechange=function(){
            if(this.readyState == 4){
                console.log(songInfo[i]);
                //displayYout(JSON.parse(xmlHttp.responseText));
                toDisplay.push(JSON.parse(xmlHttp.responseText));
                console.log(toDisplay);

                console.log(toDisplay.length);

                if(songNums==toDisplay.length){
                    console.log("finalReached");
                    displayYout(toDisplay);
                }
            }
        }
    }
    

}

function displayYout(jsonData){
    output="";
    for (i = 0; i < jsonData.length; i++){
        console.log(jsonData[i].items[0].id.videoId);
        output+="<p><iframe width='560' height='315' src='https://www.youtube.com/embed/" + jsonData[i].items[0].id.videoId+ "' frameborder='0' allow='accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture' allowfullscreen></iframe></p>";
    }
    document.getElementById("datayout").innerHTML = output;
    
}