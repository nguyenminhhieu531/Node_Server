const mongoose = require('@config/mongodb')
const Schema = mongoose.Schema;
const userSchema = new Schema({
  email: {
    type: String,
    required: true,
    unique: true,
    trim: true
  },
  name: {
    type: String,
    required: true,
    trim: true
  },
  password: {
    type: String,
    required: true
  },
  role: {
    type: String,
    required: true,
    enum: ['user', 'admin', 'moderator'], // example roles, modify as needed
    default: 'user'
  },
  avatar: {
    type: String,
    default: ''
  }
}, {
    collection: 'user',
    timestamps: true
});

const User = mongoose.model('User', userSchema);

module.exports = User;
