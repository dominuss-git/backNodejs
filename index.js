const express = require('express')
const config = require('config')
const mongoose = require('mongoose')

const app = express()

app.use(express.json({extended: true}))

app.use('/api/auth', require('./rotes/auth.routes'))
app.use('/api/book', require('./rotes/search.routes'))
app.use('/api/book', require('./rotes/changeBook.routes'))

const PORT = config.get('port') || 3030

async function start() {
  try {
    await mongoose.connect(config.get('mongodb'), {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      useCreateIndex: true
    })
    
    app.listen(PORT, () => {
      console.log(`Has been started on 192.168.31.5:${PORT}`)
    })
  } catch (e) {
    console.log('Serever Error', e.message)
    process.exit(1)
  }
}

start()