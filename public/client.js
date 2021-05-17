const socket = io()

document.querySelector('#send').addEventListener('submit', (e)=>{
  e.preventDefault()
  socket.emit('chatEvent', document.getElementById('chatBox').value)
  document.getElementById('chatBox').value = ''
  document.getElementById('chatBox').focus()
})


socket.on('messageEvent', (message) => {
  document.querySelector('#messages').innerHTML += `<div class='chats'>${message}</div>`
})

