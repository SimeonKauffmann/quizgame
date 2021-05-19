const socket = io()

const countdownDisplay = document.querySelector('#countdown')

socket.on('enterPlayRoom', ()=>{
  window.location.replace("http://localhost:3000/quiz");
})

socket.on('timer', (countdown)=>{
  countdownDisplay.innerHTML = countdown
})