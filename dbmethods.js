const {userModel,excerciseModel} = require('./models')
const mongoose = require('mongoose')

/**
 * 
 * @param {String} username 
 */
function saveUser(username) {
    const user = new userModel({
        username : username
    })
    
    return user.save()
}

function getUser(userid) {
   return userModel.findOne({_id : mongoose.Types.ObjectId(userid)}).select('_id username').exec()
}

function getAllUsers() {
    return userModel.find({}).exec()
}

async function saveExcercise({_id, description, duration, date = new Date()}) {
    const user = await getUser(_id)
    const excercise = new excerciseModel({
        id : user._id,
        description,
        duration,
        date
    })
    return excercise.save()
}

async function getLogs(userid) {
    let user = await getUser(userid)
    user = user.toObject()
    let logs = await excerciseModel.find({id : user._id.toString(), date : {"$lte" : new Date()}}).exec()
    logs = logs.map(val =>({description : val.description, duration : val.duration, date : val.date.toString().slice(0,15)}))
    user.count = logs.length
    user.logs = logs
    return user
}

async function getLogsInRange(userid, {from = null, to = null, limit = null}) {
    let user = await getUser(userid)
    user = user.toObject()
    let query = {}
    query.id = user._id.toString()
    if(from) {
        if(!query.date)
            query.date = {}
        query.date["$gte"] = new Date(from)
    }
    if(to) {
        if(!query.date)
            query.date = {}
        query.date["$lte"] = new Date(to)
    }
    if(!limit) {
        let logs = await excerciseModel.find(query).exec()
        logs = logs.map(val =>({description : val.description, duration : val.duration, date : val.date.toString().slice(0,15)}))
        user.count = logs.length
        user.logs = logs
    }
    else {
        let logs = await excerciseModel.find(query).limit(limit).exec()
        logs = logs.map(val =>({description : val.description, duration : val.duration, date : val.date.toString().slice(0,15)}))
        user.count = logs.length
        user.logs = logs
    }
    return user
}

module.exports.saveUser = saveUser
module.exports.getUser = getUser
module.exports.getAllUsers = getAllUsers
module.exports.saveExcercise = saveExcercise
module.exports.getLogs = getLogs
module.exports.getLogsInRange = getLogsInRange

