const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const allianceSchema = new Schema({
    name: String,
    hideoutStrength: Number,
    members: Array,
})

module.exports = mongoose.model('Alliance', allianceSchema)