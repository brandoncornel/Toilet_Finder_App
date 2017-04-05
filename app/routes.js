// Dependencies
var mongoose        = require('mongoose');
var Toilet            = require('./model.js');

// Opens App Routes
module.exports = function(app) {

    // GET Routes
    // --------------------------------------------------------
    // Retrieve records for all users in the db
    app.get('/toilets', function(req, res){

        // Uses Mongoose schema to run the search (empty conditions)
        var query = Toilet.find({});
        query.exec(function(err, toilets){
            if(err)
                res.send(err);

            // If no errors are found, it responds with a JSON of all users
            res.json(toilets);
        });
    });

    // POST Routes
    // --------------------------------------------------------
    // Provides method for saving new users in the db
    app.post('/toilets', function(req, res){

        // Creates a new User based on the Mongoose schema and the post bo.dy
        var newToilet = new Toilet(req.body);

        // New User is saved in the db.
        newToilet.save(function(err){
            if(err)
                res.send(err);

            // If no errors are found, it responds with a JSON of the new user
            res.json(req.body);
        });
    });
};  