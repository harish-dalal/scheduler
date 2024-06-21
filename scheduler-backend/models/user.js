const mongoose = require("mongoose");

const schema = new mongoose.Schema({
  username: {
    type: String,
  },
});

const User = mongoose.model("user", schema);

module.exports = User;
