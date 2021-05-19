const socket = io()

const pointsDisplay = document.querySelector('#points')
const buttons = document.querySelectorAll('button')
const round = document.querySelector('#round')
const questionDisplay = document.querySelector('#question')
const usernameDisplay = document.querySelector('#username')
const game = document.querySelector('#quiz')
const pause = document.querySelector('#pause')
const scoresList = document.getElementById("scores")

pause.style.display = 'none'

let points = 0

let questionNumber = 1

const names = ["Banana", "Apple", "Orange", "Kiwi", "Pear", "Pineapple", "Mango", "Grape", "Peach"]
let username = names[Math.floor(Math.random()*names.length)]

usernameDisplay.innerHTML = username

let currentAnswer 
const buttonClick = (key)=>{
  let answer = document.querySelector(`#${key}`).value
  socket.emit('answer', answer)
  currentAnswer = answers
}

socket.on('timer', (countdown)=>{
  countdownDisplay.innerHTML = countdown
})

socket.on('enterLounge', ()=>{
  game.style.display = 'none'
  socket.emit('endGame', points, username, socket.id)
  questionNumber = 1
  pause.style.display = 'visible'
})

socket.on('usersScores', (users)=>{
  for(user in users){
    let score = document.createElement("li").appendChild(document.createTextNode(`${user.user}: ${user.points}`))
    scoresList.appendChild(score)
  }
})

socket.on('newQuestion', (question, answers)=>{
  pause.style.display = 'none'
  game.style.display = 'visible'
  questionDisplay.innerHTML = question
  scoresList.innerHTML = ''

  for(x = 0; x < buttons.length; x++){
    buttons[x].value = answers[x]
    buttons[x].textContent = answers[x]
    buttons[x].style.backgroundColor = ''
  }

  questionNumber += 1
  round.innerHTML = `This is question ${questionNumber} out of 3`
})


socket.on('checkAnswer', (right, correctAnswer) => {
  for(i = 0; i < buttons.length; i++){
    if(buttons[i].value === correctAnswer){
      buttons[i].style.backgroundColor = 'green'
    } else {
      buttons[i].style.backgroundColor = 'red'
    }
  }

  if(right){points += 1}
  pointsDisplay.textContent = points
})



