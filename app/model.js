var mongoose    = require('mongoose');
var Schema      = mongoose.Schema;

// Creates a User Schema. This will be the basis of how user data is stored in the db
var ToiletSchema = new Schema({
    name: {type: String, required: true},
    gender: {type: String, required: true},
    cleanliness_level: {type: String, required: true},
    ply_number: {type: Number, required: true},
    number_bathroom_stalls: {type: Number, required: true},
    notes: {type: String, required: true},
    location: {type: [Number], required: true}, // [Long, Lat]
    created_at: {type: Date, default: Date.now},
    updated_at: {type: Date, default: Date.now}
});

// Sets the created_at parameter equal to the current time
ToiletSchema.pre('save', function(next){
    now = new Date();
    this.updated_at = now;
    if(!this.created_at) {
        this.created_at = now
    }
    next();
});

// Indexes this schema in 2dsphere format (critical for running proximity searches)
ToiletSchema.index({location: '2dsphere'});

// Exports the UserSchema for use elsewhere. Sets the MongoDB collection to be used as: "scotch-users"
module.exports = mongoose.model('bathrooms', ToiletSchema);