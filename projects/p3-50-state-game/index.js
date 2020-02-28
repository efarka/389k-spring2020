// This is a subset of the states.
// Use this to actually run the game
// (assume this is the full set of states.
// This will make it easier to test.
var states = ["Idaho", "South Dakota", "Hawaii", "Alaska", "Alabama", "New York"];

// These are all the states. It maps the state name to the number which you'll
// want to use in your API call.
var abvMap = {
    "Alabama": "01",
    "Alaska": "02",
    "Arizona": "04",
    "Arkansas": "05",
    "California": "06",
    "Colorado": "08",
    "Connecticut": "09",
    "Delaware": "10",
    "District Of Columbia": "11",
    "Florida": "12",
    "Georgia": "13",
    "Hawaii": "15",
    "Idaho": "16",
    "Illinois": "17",
    "Indiana": "18",
    "Iowa": "19",
    "Kansas": "20",
    "Kentucky": "21",
    "Louisiana": "22",
    "Maine": "23",
    "Maryland": "24",
    "Massachusetts": "25",
    "Michigan": "26",
    "Minnesota": "27",
    "Mississippi": "28",
    "Missouri": "29",
    "Montana": "30",
    "Nebraska": "31",
    "Nevada": "32",
    "New Hampshire": "33",
    "New Jersey": "34",
    "New Mexico": "35",
    "New York": "36",
    "North Carolina": "37",
    "North Dakota": "38",
    "Ohio": "39",
    "Oklahoma": "40",
    "Oregon": "41",
    "Pennsylvania": "42",
    "Rhode Island": "44",
    "South Carolina": "45",
    "South Dakota": "46",
    "Tennessee": "47",
    "Texas": "48",
    "Utah": "49",
    "Vermont": "50",
    "Virginia": "51",
    "Washington": "53",
    "West Virginia": "54",
    "Wisconsin": "55",
    "Wyoming": "56",
}

var total =0;
var gotten = [];
document.getElementById("state").disabled = true;



  for (var i=0; i<states.length; i++){
      states[i]=states[i].toUpperCase();
  }

function start(){
    document.getElementById("state").disabled = false;

    countDown();
    document.getElementById("start").disabled = true;

}

function capitalize(str)
{
 return str.replace(/\w\S*/g, function(txt){return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();});
}

function lose(){
    clearInterval(interval);
            document.getElementById("time").innerHTML = "0";

            document.getElementById("state").disabled = true;
            var percent = total/states.length *100;
            document.getElementById("win").innerHTML= "percentage: " + percent.toString();
            document.getElementById("lose").innerHTML= "you missed:";

            for (var i=0; i<states.length; i++){
                if(gotten.includes(states[i])==false){
                    var node = document.createElement("LI");
                    node.setAttribute("onmouseover", "spanish(this)")
                    var textnode = document.createTextNode(states[i]);
                    node.appendChild(textnode);
                    document.getElementById("missed").appendChild(node);
                }
            }
}
var global;
var global2;
function spanish(a){
    global=a;
    var xhttp = new XMLHttpRequest();
    xhttp.onreadystatechange = function() {
        if (this.readyState == 4 && this.status == 200) {
        result= this.responseText;
        g3=result.replace(/['"]+/g, '');
        g3=g3.replace(/[\[\]']+/g,'');
        a=g3.split(",");
        document.getElementById("spanish").innerHTML = "Spanish speakers in " + state + ":" + a[5];
        global2=this.responseText;
        }
    };
    var state= a.innerHTML;
    state = state.toLowerCase();
    var num = abvMap[capitalize(state)];

    xhttp.open("GET", "https://api.census.gov/data/2013/language?get=EST,LANLABEL,NAME&for=state:"+ num + "&LAN=625", true);
    xhttp.send();
    
}
// $(document).ready(function(){
// $("ul li").hover(function(){
//     $(this).css("background-color", "yellow");
//     }, function(){
//     $(this).css("background-color", "pink");
//   });
// });

// $(document).ready(function(){
//     $("p").hover(function(){
//       $(this).css("background-color", "yellow");
//       }, function(){
//       $(this).css("background-color", "pink");
//     });
//   }); 

function countDown(){
    var timeLeft = 20;
    interval = setInterval(function(){
        document.getElementById("time").innerHTML = timeLeft;
        

        if(timeLeft ==0){
            lose();
        }
        timeLeft--;
    }, 1000);    

};


function myFunction() {
    var x = document.getElementById("state").value;
    if(states.includes(x.toUpperCase())){
        document.getElementById("state").value="";
        var node = document.createElement("LI");
        node.setAttribute("onmouseover", "spanish(this)")

        var textnode = document.createTextNode(x.toUpperCase());
        node.appendChild(textnode);
        document.getElementById("myList").appendChild(node);

        gotten.push(x.toUpperCase());

        total++;
        if(total==states.length){
            clearInterval(interval);
            document.getElementById("win").innerHTML= "you win!";

        }
    }
    
  }

  

/*
 * The majority of this project is done in JavaScript.
 *
 * 1. Start the timer when the click button is hit. Also, you must worry about
 *    how it will decrement (hint: setInterval).
 * 2. Check the input text with the group of states that has not already been
 *    entered. Note that this should only work if the game is currently in
 * 3. Realize when the user has entered all of the states, and let him/her know
 *    that he/she has won (also must handle the lose scenario). The timer must
 *    be stopped as well.
 *
 * There may be other tasks that must be completed, and everyone's implementation
 * will be different. Make sure you Google! We urge you to post in Piazza if
 * you are stuck.
 */
