//Node Package Inclusion
var unirest = require("unirest");
var async = require("async");
var express = require("notebook")("runkit/express-endpoint/1.0.0"); //RunKit Express port
var bodyParser = require("body-parser");

//Export API
var app = express(module.exports);

//API Endpoint
app.get('/', function(req, res) {

  /* Fetchname
  /    Makes Words API call to return a word based on search pattern 
  /    and number of syllables.
  /    *  pattern = regular expression string to search
  /    *  syllables = integer string, an exact number of syllables for the word
  /    *  random = boolean switch, return a random word from possible matches, 
  /                set to true by default
  /    *  callback = function to alert async.js of call completion
  */
  var fetchName = function( pattern, syllables, random, callback ) {
    //Check values and set defaults
    var
      pattern = pattern || "",
      syllables = syllables || "",
      random = random || "true",
      endpoint = "";

    //Set Words API endpoint path
    endpoint = `https://wordsapiv1.p.mashape.com/words/?letterPattern=${encodeURI(pattern)}&syllables=${syllables}&random=${random}`;

    //Get Words API endpoint
    //Words API Key from mashape.com
    unirest.get(endpoint)
    .header("X-Mashape-Key", process.env.mashapeTest)
    .header("Accept", "application/json")
    .end( function( result ) {
    
       //Signal completion and return result
       callback(null, result.body.word );
    });
  };

  //Run parallel API calls
  async.parallel([

    function (callback) {

      //Return random, three-syllable word starting with "b"
      fetchName( "^b.{4,26}$", "3", "true", callback);
        
    },
    function (callback) {

      //Return random, three-syllable word starting with "b"
      fetchName( "^c.{4,26}$", "3", "true", callback);
    }
  ], function (err, results) {
      
    //Return JSON message
    res.json({ 
      theName: results.map(i => i[0].toUpperCase() + i.substring(1).toLowerCase())
      .join(' ')
    }); 
    //Add error handling
  });
});
