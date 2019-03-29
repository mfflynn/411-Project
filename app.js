const cf = require('./config').config;
const express = require('express');
const XMLHttpRequest = require("xmlhttprequest").XMLHttpRequest;
const path = require('path')
const app = express();
const router = express.Router();
const cors = require('cors');
var tempkey = 0;
var youtaccesscode = 0;
var youtrealcode = 0;
const spotclientkey = cf.spotclientkey;
const youtclientid = cf.youtclientid;
const youtclientkey = cf.youtclientkey;

app.use(express.static(path.join(__dirname, 'public')));
app.use(cors());

router.get('/',function(req,res){
    const submissionY = "https://accounts.google.com/o/oauth2/v2/auth?scope=https%3A%2F%2Fwww.googleapis.com%2Fauth%2Fyoutube.readonly&access_type=offline&include_granted_scopes=true&state=state_parameter_passthrough_value&redirect_uri=http%3A%2F%2Flocalhost%3A3000%2Foauth2callback&response_type=code&client_id="+youtclientid;
    res.redirect(submissionY);
});

router.get('/oauth2callback',function(req,res){
    console.log("OAUTH2CALLBACK!");
    youtaccesscode = req.query.code;
    console.log(youtaccesscode);
    res.redirect("/begin");
})


router.get('/begin',function(req,res){
	const xmlHttp = new XMLHttpRequest();

    const submission = "https://accounts.spotify.com/api/token";
    xmlHttp.open( "POST", submission, true );
    xmlHttp.setRequestHeader("Authorization", spotclientkey);
    xmlHttp.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
    xmlHttp.send("grant_type=client_credentials");
    xmlHttp.onreadystatechange=function(){
        if(this.readyState == 4){
            const jsonResponse = JSON.parse(xmlHttp.responseText);
            tempkey = jsonResponse["access_token"];
        }
    }

    
    const xmlHttpY = new XMLHttpRequest();

    const submissionY = "https://www.googleapis.com/oauth2/v4/token";
    xmlHttpY.open( "POST", submissionY, true );
    xmlHttpY.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
    toSend = "grant_type=authorization_code" + "&code="+encodeURIComponent(youtaccesscode) + "&client_id="+encodeURIComponent(youtclientid) + "&client_secret="+encodeURIComponent(youtclientkey) + "&redirect_uri="+encodeURIComponent("http://localhost:3000/oauth2callback");
    console.log(toSend);
    xmlHttpY.send(toSend);
    xmlHttpY.onreadystatechange=function(){
        if(this.readyState == 4){
            console.log(xmlHttpY);
            const jsonResponseY = JSON.parse(xmlHttpY.responseText);
            console.log(jsonResponseY);
            youtrealcode = jsonResponseY["access_token"];
            console.log("REALCODE:");
            console.log(youtrealcode);
        }
    }
    res.sendFile(path.join(__dirname+'/views/duetdemo.html'));

});

router.get('/youtubedone',function(req,res){

  res.sendFile(path.join(__dirname+'/views/duetdemo.html'));
  //__dirname : It will resolve to your project folder.
});



router.get('/getjson/:playlistid',function(req,res){
	const xmlHttp = new XMLHttpRequest();
    const submission = "https://api.spotify.com/v1/playlists/"+req.params["playlistid"]+"/tracks";
    xmlHttp.open( "GET", submission, true );
    xmlHttp.setRequestHeader("Authorization", "Bearer " + tempkey);
    xmlHttp.send();
    xmlHttp.onreadystatechange=function(){
        if(this.readyState == 4){
            const jsonResponse = JSON.parse(xmlHttp.responseText);
            res.send(jsonResponse);
        }
    }

})

router.get('/getyoutube/:songInfo',function(req,res){
	const xmlHttp = new XMLHttpRequest();
    const submission = "https://www.googleapis.com/youtube/v3/search"+formatParams({'maxResults': '1', 'part': 'snippet', 'q': req.params["songInfo"],'type': 'video'});
    xmlHttp.open( "GET", submission, true );
    xmlHttp.setRequestHeader("Authorization", "Bearer " + youtrealcode);
    xmlHttp.send();
    xmlHttp.onreadystatechange=function(){
        if(this.readyState == 4){
            console.log(xmlHttp.responseText);
            const jsonResponse = JSON.parse(xmlHttp.responseText);
            res.send(jsonResponse);
        }
    }

})

function formatParams( params ){
  return "?" + Object
        .keys(params)
        .map(function(key){
          return key+"="+encodeURIComponent(params[key])
        })
        .join("&")
}

//add the router
app.use('/', router);
app.listen(process.env.port || 3000);

console.log('Running at Port 3000');