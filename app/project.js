<<<<<<< HEAD
var mongoose = require('mongoose');

// project schema
var projectSchema = new mongoose.Schema({
  username:  String,
  projects: [{ name: String, Files: [{ name: String, text: String }], editData: Date, createData: Date }],
  follows: [{ username: String, date: Date }]
});

=======
var mongoose = require('mongoose');

// project schema
var projectSchema = new mongoose.Schema({
  username:  String,
  projects: [{ name: String, Files: [{ name: String, text: String }], editData: Date, createData: Date }],
  follows: [{ username: String, date: Date }]
});

>>>>>>> 8653cc6130a353f48d8edc1dd024df8d080eff10
module.exports = mongoose.model('Project', projectSchema);