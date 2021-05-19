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
  currentQuestion = pickaQuestion(questions)
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
  if(!questions){
    res.redirect('/')
  }
  currentQuestion = pickaQuestion(questions)
  res.status(200).render('quiz.pug', {question: currentQuestion.question, answers: currentQuestion.answers})
})

app.get('/', (req, res)=>{
  res.status(200).render('lounge.pug', {users : users})
})




io.of('/quiz').on('connection', (socket)=>{

  socket.leave('lounge')
  socket.join('playRoom')
  
})

let users = []

io.of('/').on("connection", (socket)=>{
  socket.leave('playRoom')
  socket.join('lounge')
  users = []

  socket.on('answer', (answer)=>{
    if (answer === currentQuestion.correct_answer) return socket.emit('checkAnswer', true, currentQuestion.correct_answer)
    socket.emit('checkAnswer', false, currentQuestion.correct_answer)
  })

  socket.on('endGame', (points, username, id)=>{
    users.push({user: username, points: points, id: id})
    socket.emit('usersScores', users)
  })
  
})

let countdown = 5
setInterval(()=>{
  io.to('lounge').emit('timer', countdown)
  countdown -= 1
  if(countdown === 15){
    currentQuestion = pickaQuestion(questions)
    io.emit('newQuestion', currentQuestion.question, currentQuestion.answers)
  }
  if(countdown === 10){
    currentQuestion = pickaQuestion(questions)
    io.emit('newQuestion', currentQuestion.question, currentQuestion.answers)
  }
  if(countdown === 5){
    io.emit('enterLounge')
  }
  if(countdown === 0){
    io.emit('enterPlayRoom')
    io.emit('newQuestion', currentQuestion.question, currentQuestion.answers)
    countdown = 20
  }
}, 1000)



httpServer.listen(3000, () => {
    console.log('Server is listening on port 3000 ...')
})
