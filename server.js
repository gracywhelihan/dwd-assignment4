
var fs = require('fs');
var data = fs.readFileSync('words.json');
var additional = JSON.parse(data);

var afinndata = fs.readFileSync('afin111.json');
var afinn = JSON.parse(afinndata);


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

app.post('/analyze', analyzeThis);

function analyzeThis(request, response){
    var txt =  request.body.text;
    var words = txt.split(/\W+/);
    var totalScore = 0;
    var found = false;
    var wordlist = [];
    for(var i =0; i < words.length; i++){
        var word = words[i];
        var score = 0;
        if(additional.hasOwnProperty(word)){
            found = true;
            score += Number(additional[word]);
        }else if(afinn.hasOwnProperty(word)){
            found = true;
            score += Number(additional[word]);
        }

        if(found){
            wordlist.push({
                word: word,
                score: score
            })
        }
        totalScore += score;
    }
    var comp = totalScore/words.length;
    var reply ={
        score: totalScore,
        comparative: comp
    }
    response.send(reply);
}

app.get('/add/:word/:score?', addWord);

function addWord(request, response) {
    var data = request.params;
    var word = data.word;
    var score = Number(data.score);
    if(!score){
        var reply = {
            msg: "score is required"
        }
    }else{
        additional[word] = score;
        console.log(additional, word);
        var data = JSON.stringify(additional, null);
        console.log(data);
        //write to file
        fs.writeFile('words.json', data, finished);
        function finished(err) {
            console.log('all set');

            var reply = {
               word: word,
               score: score,
               status: "success"
            }

            response.send(reply);
        }

    }
    

}

app.get('/all', sendAll);

function sendAll(request, response) {
    var data = {
        additional: additional,
        afinn: afinn
    }

    response.send(data);
}


app.get('/search/:word', searchWord);

function searchWord(request, response){
    var word = request.params.word;
    var reply;
    if(words[word]){
        reply = {
            status: "found",
            word: word,
            scrore: words[word]
        }
    }else{
        reply = {
            status: "not found",
            word: word
        }
    }
    response.send(reply);
}
