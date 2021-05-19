require('dotenv').config()

const mongoose = require('mongoose')

mongoose.connect(process.env.DB_PATH, {useNewUrlParser: true, useUnifiedTopology: true })

const db = mongoose.connection
db.on('error', console.error.bind(console, 'connection error'))
db.once('open', ()=>{
  console.log('connected to Lab5')
})

const questionSchema = new mongoose.Schema({
  category: {
    type: String
    }, 
  type:{
    type: String
  },
  difficulty:{
    type: String
  },
  question:{
    type: String
  },
  correct_answer:{
    type: String
  },
  incorrect_answers:{
    type: Array
  }
})

const QuizModel = mongoose.model('questions', questionSchema)



module.exports = QuizModel