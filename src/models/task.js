const mongoose = require('mongoose');
const { Schema } = mongoose;

const TaskSchema = new Schema({
    name: { type: String, required: true },
    coords: {
        lat: {type: Number},
        long: {type: Number}
        }
})

module.exports = mongoose.model('Task', TaskSchema);
