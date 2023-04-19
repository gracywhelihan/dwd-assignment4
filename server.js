
var fs = require('fs');
var data = fs.readFileSync('pastas.json');
var pastas = JSON.parse(data);


console.log("server is running");

var express = require('express');
var bodyParser = require('body-parser');
var cors = require('cors');


var app = express();

var server = app.listen(3000, listenting);

function listenting() {
    console.log('listening...');

}

app.use(express.static('website'));
app.use(bodyParser.urlencoded({ extended: false}));
app.use(bodyParser.json());
app.use(cors());

app.post('/addDish', addDish);

function addDish(request, response){
    var data =  request.body;
    var pasta = data.pasta;
    var rating = Number(data.rating);
    if(!rating){
        var reply = {
            msg: "score is required"
        }
    }else{
            pastas[pasta] = rating;
            var jsondata = JSON.stringify(pastas, null);
            console.log(jsondata);
            //write to file
            fs.writeFile('pastas.json', jsondata, finished);
            function finished(err) {
                console.log('all set');
    
                var reply = {
                   pasta: pasta,
                   rating: rating,
                   status: "success"
                }
    
                response.send(reply);
            }
    
        }
}

app.get('/best', bestPasta);

function bestPasta(request, response) {
    var bestRating = -1;
    var bestPasta;
     for(pasta in pastas){
        if(pastas[pasta] > bestRating){
            bestPasta = pasta;
            bestRating = pastas[pasta];
        }
    }

            var data = {
               pasta: bestPasta,
               rating: bestRating
            }

            response.send(data);
    

}

app.get('/all', sendAll);

function sendAll(request, response) {
    //pasta = request.params
    var data = {
        pastas: pastas,
    }

    response.send(data);
}


app.get('/search/:pasta', searchPasta);

function searchPasta(request, response){
    var pasta = request.params.pasta;
    var reply;
    if(pastas[pasta]){
        reply = {
            status: "found",
            pasta: pasta,
            rating: pastas[pasta]
        }
    }else{
        reply = {
            status: "not found",
            pasta: pasta
        }
    }
    response.send(reply);
}
