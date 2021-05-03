const mongoose = require('mongoose')
require('dotenv').config()

let mongooseConnect = false

mongoose.connect(process.env.MONGO_URI, {useNewUrlParser: true, useUnifiedTopology: true})

const db = mongoose.connection
db.on('error',() => {
  mongooseConnect = false
  console.error("Failed to connect to MongoDB")
})

db.once('open',() => {
  mongooseConnect = true
  console.info("Succesfully connected to MongoDB")
})

const userSchema = mongoose.Schema({
    username : {
        type : String,
        required: true
    }
})

const userModel = mongoose.model('user',userSchema)

const excerciseSchema = mongoose.Schema({
    id : {
        type : String,
        required : true
    },
    description : {
        type : String,
        required : true
    },
    duration : {
        type : Number,
        required : true
    },
    date: mongoose.Schema.Types.Date
}) 

const excerciseModel = mongoose.model('excercise',excerciseSchema)

module.exports.userModel = userModel
module.exports.excerciseModel = excerciseModel