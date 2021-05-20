const socket = io()

const pointsDisplay = document.querySelector('#points')
const buttons = document.querySelectorAll('button')
const round = document.querySelector('#round')
const countdownDisplay = document.querySelector('#countdown')
const questionDisplay = document.querySelector('#question')
const usernameDisplay = document.querySelector('#username')
const game = document.querySelector('#quiz')
const pause = document.querySelector('#pause')
const scoresList = document.getElementById("scores")

pause.style.display = 'none'

let points = 0

let questionNumber = 0

const names = ["Banana", "Apple", "Orange", "Kiwi", "Pear", "Pineapple", "Mango", "Grape", "Peach"]
let username = names[Math.floor(Math.random()*names.length)]

usernameDisplay.innerHTML = username


const buttonClick = (key)=>{
  let answer = document.querySelector(`#${key}`).value
  socket.emit('answer', answer)
  for(i=0; i< buttons.length; i++){
    buttons[i].disabled = true
  }
  // buttons.forEach(button => button.disabled = true)
}

socket.on('timer', (countdown)=>{
  countdownDisplay.innerHTML = countdown
})

socket.on('enterLounge', ()=>{
  game.style.display = 'none'
  socket.emit('endGame', points, username, socket.id)
  questionNumber = 0
  points = 0
  pointsDisplay.textContent = points
  pause.style.display = 'unset'
})

socket.on('usersScores', (users)=>{
  console.log(users[0].user)
  for(y = 0; y < users.length; y++){
    let score = document.createElement("li")
    let text = document.createTextNode(`${users[y].user === username ? 'You' : users[y].user}: ${users[y].points}`)
    score.appendChild(text)
    scoresList.appendChild(score)
  }
})

socket.on('newQuestion', (question, answers)=>{
  for(i=0; i< buttons.length; i++){
    buttons[i].disabled = false
  }

  pause.style.display = 'none'
  game.style.display = 'unset'
  questionDisplay.innerHTML = question
  
  while (scoresList.firstChild) {
    scoresList.removeChild(scoresList.firstChild);
  }

  for(x = 0; x < buttons.length; x++){
    buttons[x].value = answers[x]
    buttons[x].textContent = decodeHTML(answers[x])
    buttons[x].style.backgroundColor = ''
  }


  questionNumber += 1
  round.innerHTML = `This is question ${questionNumber} out of 3`
})

function decodeHTML(html) {
  var txt = document.createElement("textarea");
  txt.innerHTML = html;
  return txt.value;
}


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



