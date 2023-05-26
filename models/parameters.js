const mongoose = require('mongoose');
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
    { collection: 'parameters' }
);


const parameterModel = mongoose.model('Parameter', parameterSchema);

module.exports = parameterModel;