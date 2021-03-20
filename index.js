const express = require('express')
const config = require('config')
const mongoose = require('mongoose')
const logger = require('./config/logger')

const app = express()

app.use(express.json({extended: true}))

app.use('/api/auth', require('./routes/auth.routes'))
app.use('/api/books', require('./routes/search.routes'))
app.use('/api/books', require('./routes/changeBook.routes'))
app.use('/api/account', require('./routes/user.routes'))

if (process.env.NODE_ENV === 'production') {
  console.log('production server started', __dirname);
  app.use(express.static(__dirname + '/client/build'));
  app.get('*', function(req, res) {
    res.redirect('/');
  });
}

const PORT = process.env.PORT || config.get('port') || 3030

async function start() {
  try {
    await mongoose.connect(config.get('mongodb'), {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      useCreateIndex: true
    })
    
    app.listen(PORT, () => {
      logger.info(`Has been started on 192.168.31.5:${PORT}`)
    })
  } catch (e) {
    logger.info('Serever Error', e.message)
    process.exit(1)
  }
}

start()