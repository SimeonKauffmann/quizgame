const socket = io()

const countdownDisplay = document.querySelector('#countdown')

const names = ["Banana", "Apple", "Orange", "Kiwi", "Pear", "Pineapple", "Mango", "Grape", "Peach"]
let username = names[Math.floor(Math.random()*names.length)]

socket.on('enterPlayRoom', ()=>{
  window.location.replace(`http://localhost:3000/quiz/?username=${username}`);
})

socket.on('timer', (countdown)=>{
  countdownDisplay.innerHTML = countdown - 1
})