var express = require('express');
var bodyParser = require('body-parser');
var fs = require('fs');
var pokeDataUtil = require("./poke-data-util");
var _ = require("underscore");
var app = express();
var PORT = 3000;

// Restore original data into poke.json. 
// Leave this here if you want to restore the original dataset 
// and reverse the edits you made. 
// For example, if you add certain weaknesses to Squirtle, this
// will make sure Squirtle is reset back to its original state 
// after you restard your server. 
pokeDataUtil.restoreOriginalData();

// Load contents of poke.json into global variable. 
var _DATA = pokeDataUtil.loadData().pokemon;

/// Setup body-parser. No need to touch this.
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

app.get("/", function(req, res) {
    // HINT: 
    var contents = "";
    _.each(_DATA, function(i) {
        contents += `<tr><td>1</td><td><a href="/pokemon/`+i.id + `">`+ i.name + `</a></td></tr>\n`;
    })
    var html = `<html>\n<body>\n<table>` + contents + `</table>\n</body>\n</html>`;
    res.send(html);
  
});

app.get("/pokemon/:pokemon_id", function(req, res) {
    // HINT : 
    // <tr><td>${i}</td><td>${JSON.stringify(result[i])}</td></tr>\n`;

    var _id = parseInt(req.params.pokemon_id);
    var result = _.findWhere(_DATA, { id: _id });
    if (!result) return res.send("Error: pokemon not found");

    contents = "";
    for (var key in result){
        console.log(key);

        console.log(result[key].toString());
        contents += `<tr><td>` + key.toString() + `</td><td>` + JSON.stringify(result[key]) + `</td></tr>\n`
    }
    var html = `<html>\n<body>\n<table>` + contents + `</table>\n</body>\n</html>`;
    res.send(html);

});

app.get("/pokemon/image/:pokemon_id", function(req, res) {
    var _id = parseInt(req.params.pokemon_id);
    var result = _.findWhere(_DATA, { id: _id });
    if (!result) return res.send("Error: pokemon not found");

    contents = `<img src="`+ result.img + `">`;
    var html = `<html>
    <body>
    ` + contents + `
    </body>
    </html>` ;

    res.send(html);

});

app.get("/api/id/:pokemon_id", function(req, res) {
    // This endpoint has been completed for you.  
    var _id = parseInt(req.params.pokemon_id);
    var result = _.findWhere(_DATA, { id: _id })
    if (!result) return res.json({});
    res.json(result);
});

app.get("/api/evochain/:pokemon_name", function(req, res) {
    var _name = req.params.pokemon_name;
    var result = _.findWhere(_DATA, {name: _name});
    var final= [];
    if(!result) return res.send([]);

    final.push(result.name);
    if(result.hasOwnProperty("next_evolution")){
        for(pkmn of result.next_evolution){
            final.push(pkmn.name);
        }
    }
    if(result.hasOwnProperty("prev_evolution")){
        for(pkmn of result.prev_evolution){
            final.push(pkmn.name);
        }
    }
    final = final.sort();
    res.send(final);
    
});

app.get("/api/type/:type", function(req, res) {
    var _type = req.params.type;
    var result = _.filter(_DATA, function(pkmn){return pkmn.type.includes(_type)});
    if(!result){
        return res.send([]);
    }
    final = [];
    for(pkmn of result){
        final.push(pkmn.name);
    }
    res.send(final);
});
function sortNumber(a, b) {
    return a - b;
  }

app.get("/api/type/:type/heaviest", function(req, res) {
    var _type = req.params.type;
    
    var result = _.filter(_DATA, function(pkmn){return pkmn.type.includes(_type)});
    if(!result || result.length==0){
        return res.json({});
    }
    weights = [];
    weights2 = [];
    //console.log(result);
    


    for(pkmn of result){
        weights.push(pkmn.weight);
    }
    for(w of weights){
        var g = w.replace(" kg", '');
        g = parseFloat(g);
        weights2.push(g);
    }
    weights2 = weights2.sort(sortNumber);
    console.log(weights2);

    var max=weights2[weights2.length -1];

    var search = "";
    console.log(max%1);
    if(max %1 >0){
        search = max.toString() + " kg";
    }
    else{
        search = max.toString() + ".0 kg";
    }
    console.log(search);
    var result2=  _.findWhere(_DATA, {weight: search});
    
    var asdf = result2.weight.replace(" kg", '');
    var final =
     {"name": result2.name, "weight":asdf};
    res.send(final);
});

//todo change get to post
app.post("/api/weakness/:pokemon_name/add/:weakness_name", function(req, res) {
    // HINT: 
    // Use `pokeDataUtil.saveData(_DATA);`
    var _weakness = req.params.weakness_name;

    var _name = req.params.pokemon_name;
    var result = _.findWhere(_DATA, {name: _name});
    console.log(result);
    var final= [];
    if(!result) return res.json({});

    console.log(_DATA[result.id - 1]);
    if(result.weaknesses.includes(_weakness.toString())){
        console.log("already includes");
        
    }
    else{
        result.weaknesses.push(_weakness.toString());
    }
    _DATA[result.id-1] = result;
    console.log(_DATA[result.id - 1]);

    pokeDataUtil.saveData(_DATA);
    var final =
     {"name": result.name, "weaknesses":result.weaknesses};
    return res.send(final);
});

app.delete("/api/weakness/:pokemon_name/remove/:weakness_name", function(req, res) {
    var _weakness = req.params.weakness_name;

    var _name = req.params.pokemon_name;
    var result = _.findWhere(_DATA, {name: _name});
    console.log(result);
    var final= [];
    if(!result) return res.json({});

    console.log(_DATA[result.id - 1]);
    asdf = [];
    if(result.weaknesses.includes(_weakness.toString())){
        for (y in result.weaknesses){
            x=result.weaknesses[y];
            if(x != _weakness){
                console.log("asdfasdf:" + x.toString());
                asdf.push(x);
            }
        }
        console.log(asdf);
        result.weaknesses= asdf;
    }
    else{
        console.log("not even there");
    }
    _DATA[result.id-1] = result;

    pokeDataUtil.saveData(_DATA);
    var final =
     {"name": result.name, "weaknesses":result.weaknesses};
    return res.send(final);});


// Start listening on port PORT
app.listen(PORT, function() {
    console.log('Server listening on port:', PORT);
});

// DO NOT REMOVE (for testing purposes)
exports.PORT = PORT
