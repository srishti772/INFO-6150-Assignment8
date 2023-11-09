const express = require('express');
const mongoose = require('mongoose');

//defining the model for users

const userSchema = new mongoose.Schema({
    fullName: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        required: true,
        unique: true,
        
    },
    password: {
        type: String,
        required: true,
       
    },
});

module.exports = mongoose.model('User', userSchema);

