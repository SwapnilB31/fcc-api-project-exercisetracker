const express = require('express')
const app = express()
const cors = require('cors')
const formidable = require('express-formidable')
const {saveUser,getUser,getAllUsers,saveExcercise,getLogs,getLogsInRange} = require('./dbmethods')
const { json } = require('express')


app.use(cors())
app.use(formidable())
app.use(express.static('public'))
app.get('/', (req, res) => {
  res.sendFile(__dirname + '/views/index.html')
});

app.post('/api/users', async (req,res)=>{
  const username = req.fields['username']
  try {
    const user = await saveUser(username)
    res.status(200).json({_id : user._id, username : user.username})
  } catch(err) {
    console.error(err)
    res.status(500).json({error : "Something went wrong"})
  } 
}).get('/api/users', async (req,res) => {
  try {
    const users = await getAllUsers()
    res.status(200).json(users)
  } catch(err) {
    console.error(err)
    res.status(500).json({error : "Something went wrong"})
  }
})

app.post('/api/users/:_id/exercises', async (req,res) => {
  const _id = req.params["_id"]
  const description = req.fields["description"]
  const duration = req.fields["duration"]
  const date = req.fields["date"] || new Date()
  try {
    const user = await getUser(_id)
    const excerciseObj = await saveExcercise({_id,description,duration,date})
    res.status(200).json({_id : user._id, username : user.username, date : excerciseObj.date.toString().slice(0,15), duration: excerciseObj.duration, description : excerciseObj.description})
  } catch(err) {
    console.error(err)
    res.status(500).json({error : "Something went wrong"})
  }
})

app.get('/api/users/:_id/logs', async (req,res) => {
  const id = req.params["_id"]
  const from = req.query["from"] || null
  const to = req.query["to"] || null
  const limit = parseInt(req.query["limit"]) || null

  if(!from && !to && !limit) {
    try {
      const logs = await getLogs(id)
      res.status(200).json(logs)
    } catch(err) {
      console.error(err)
      res.status(500).json({error : "Something went wrong"})
    }
  }
  else {
    try {
      const logs = await getLogsInRange(id,{from, to, limit})
      res.status(200).json(logs)
    } catch(err) {
      console.error(err)
      res.status(500).json({error : "Something went wrong"})
    }
  }
})



const listener = app.listen(process.env.PORT || 3000, () => {
  console.log('Your app is listening on port ' + listener.address().port)
})
