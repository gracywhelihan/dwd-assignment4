function setup() {
    // createCanvas(400, 400);
    // background(0);
    console.log("running");

    //drawData();

    var button = select('#add');
    button.innerText = 'Add Pasta';
    button.mousePressed(addPasta);

    // var buttonA = select('#analyze');
    // buttonA.mousePressed(analyzeThis);
  
  }

  function dataPosted(result){
    console.log(result);
  }

  function postErr(err){
    console.log(err);
  }
  
// function submitWord(){
//   var word = select('#word').value();
//   var score = select('#score').value();
//   console.log(word, score);

//   loadJSON('add/'+word+'/'+score, finished);
//   // drawData();
// }

function addPasta(){
  var dish = select('#dish').value();
  var r = select('#rating').value();
    var data = {
      pasta: dish,
      rating: r
    }
     httpPost('addDish', data, "json", dataPosted, postErr);
     drawData();
}

function finished(data){
  //onsole.log(data);
}

function drawData(){
  loadJSON('all', gotData);
}


