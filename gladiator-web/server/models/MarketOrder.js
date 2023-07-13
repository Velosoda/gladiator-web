var mongoose = require('mongoose');
var uniqueValidator = require('mongoose-unique-validator');
var crypto = require('crypto');
var jwt = require('jsonwebtoken');
var secret = require('../config').secret

const MarketOrderSchema = new mongoose.Schema({
    sellerId:{
        type: String,
        index: true
    },
    buyerId:{
        type: String,
        index: true
    },
    assetType:{
        type: String
    },
    assetId:{
        type: String,
        index: true
    },
    orderStatus: {
        type: String
    }   
},{timeseries: true});

MarketOrderSchema.methods.getAsset = () => {
    
}