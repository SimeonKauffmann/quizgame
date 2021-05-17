const path = require('path')

const express = require('express')
const app = express()

const db = require('./models/models')

const getQuestion = async ()=>{
  try{
  const questions = await db.find()
  random = Math.floor(Math.random() * questions.length)
  console.log(questions[random])
  }catch(err){
    console.log(err)
  }
}
getQuestion()

const http = require('http')
const { truncate } = require('fs')
const httpServer = http.createServer(app)

const io = require('socket.io')(httpServer)

app.use(express.json())

app.use(express.static(path.join(__dirname, '/public')))

app.get('/', (req, res) => {
    res.render('index')
})

io.on("connection", (socket)=>{
  console.log('connected ' + socket.id)
  socket.send('hi client!')

  socket.on('chatEvent', (message)=>{
    socket.emit('messageEvent', `Client ${socket.id} says ${message}`)
  })

  socket.on('chatEvent', (message)=>{
    socket.broadcast.emit('messageEvent', `Client ${socket.id} says ${message}`)
  })
  
  socket.on('disconnect', ()=>{
    console.log('disconnected '+ socket.id)
  }) 
})


httpServer.listen(3000, () => {
    console.log('Server is listening on port 3000 ...')
});
