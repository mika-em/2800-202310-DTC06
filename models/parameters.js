const mongoose = require('mongoose');

// parameter collection schema
const parameterSchema = new mongoose.Schema(
    {
        userId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User'
        },
        title: String,
        description: String,
        date: Date,
        parameterSet: Array,
    },
    // name of the collection in database
    { collection: 'parameters' }
);


const parameterModel = mongoose.model('Parameter', parameterSchema);

module.exports = parameterModel;