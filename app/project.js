var mongoose = require('mongoose');

// project schema
var projectSchema = new mongoose.Schema({
  username:  String,
  projects: [{ name: String, Files: [{ name: String, text: String }], editData: Date, createData: Date }],
  follows: [{ username: String, date: Date }]
});

module.exports = mongoose.model('Project', projectSchema);