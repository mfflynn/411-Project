const express = require('express');
const XMLHttpRequest = require("xmlhttprequest").XMLHttpRequest;
const path = require('path')
const app = express();
const router = express.Router();
const cors = require('cors');

app.use(express.static(path.join(__dirname, 'public')));
app.use(cors());


router.get('/',function(req,res){
  res.sendFile(path.join(__dirname+'/views/duetdemo.html'));
  //__dirname : It will resolve to your project folder.
});

router.get('/getjson/:urlval',function(req,res){
	const xmlHttp = new XMLHttpRequest();
    const key = "naaah";
    const submission = "https://secure.galiboo.com/api/analyzer/analyze_url/?token="+key+"&url="+encodeURIComponent(req.params["urlval"]);
    console.log(submission);
    xmlHttp.open( "GET", submission, true );
    xmlHttp.send();
    xmlHttp.onreadystatechange=function(){
        if(this.readyState == 4){
            console.log(xmlHttp.responseText);
            const jsonResponse = JSON.parse(xmlHttp.responseText);
            res.send(jsonResponse);
        }
    }

})

//add the router
app.use('/', router);
app.listen(process.env.port || 3000);

console.log('Running at Port 3000');