const express = require('express')
const app = express()

const db = require('./models/models')

const http = require('http')
const httpServer = http.createServer(app)

const io = require('socket.io')(httpServer)

app.set('view engine', 'pug')
app.locals.pretty = true
app.use(express.json())

let questions
let currentQuestion

startUp = (async () => await db.find())().then(dbQuestions => {
  questions = dbQuestions
})


const pickaQuestion = (questions)=>{
  const random = Math.floor(Math.random() * questions.length)
  const answers = Array.from(questions[random].incorrect_answers)
  answers.splice(Math.floor(Math.random()* answers.length), 0,  questions[random].correct_answer)
  currentQuestion = questions[random]
  currentQuestion.answers = answers
  return currentQuestion
}

app.get('/quiz', (req, res) => {
  if(!req.query.username){
    res.redirect('/')
    return
  }
  currentQuestion = pickaQuestion(questions)
  res.status(200).render('quiz.pug', {username: req.query.username})
})

app.get('/', (req, res)=>{
  res.status(200).render('lounge.pug')
})




io.of('/quiz').on('connection', (socket)=>{
  socket.leave('lounge')
  socket.join('playRoom')
})

const users = []

io.of('/').on("connection", (socket)=>{
  socket.leave('playRoom')
  socket.join('lounge')
  users.length = 0


  socket.on('answer', (answer)=>{
    if (answer === currentQuestion.correct_answer) return socket.emit('checkAnswer', true, currentQuestion.correct_answer)
    socket.emit('checkAnswer', false, currentQuestion.correct_answer)
  })

  socket.on('endGame', (points, username, id)=>{
    users.push({user: username, points: points, id: id})
    setTimeout(()=>{ 
      socket.broadcast.emit('usersScores', users) 
      socket.emit('usersScores', users) 
      users.length = 0
    }, 200)
  })

  
})

let countdown = 10


setInterval(()=>{
  io.to('lounge').emit('timer', countdown)
  countdown -= 1

  /*
  if(countdown === 5){
    io.emit('enterLounge')
  }
  if(countdown === 0){
    io.emit('enterPlayRoom')
    countdown = 20
  }
  if(countdown % 5){
    currentQuestion = pickaQuestion(questions)
    io.emit('newQuestion', currentQuestion.question, currentQuestion.answers)
  }
  */

  if(countdown === 19){
    currentQuestion = pickaQuestion(questions)
    io.emit('newQuestion', currentQuestion.question, currentQuestion.answers, 1)
  }
  if(countdown === 15){
    currentQuestion = pickaQuestion(questions)
    io.emit('newQuestion', currentQuestion.question, currentQuestion.answers, 2)
  }
  if(countdown === 10){
    currentQuestion = pickaQuestion(questions)
    io.emit('newQuestion', currentQuestion.question, currentQuestion.answers, 3)
  }
  if(countdown === 5){
    io.emit('enterLounge')
  }
  if(countdown === 0){
    io.emit('enterPlayRoom')
    countdown = 20
  }
}, 1000)



httpServer.listen(3000, () => {
    console.log('Server is listening on port 3000 ...')
})
