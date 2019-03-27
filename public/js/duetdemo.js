function sendComment(){
	const xmlHttp = new XMLHttpRequest();
    const url = document.getElementById("urlVal").value;
    xmlHttp.open( "GET", "/getjson/"+encodeURIComponent(url), true );
    xmlHttp.send();
    xmlHttp.onreadystatechange=function(){
        if(this.readyState == 4){
            document.getElementById("dataspot").innerHTML = xmlHttp.responseText;
        }
    }
    
    return
}