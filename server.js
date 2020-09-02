var path = require('path')
const http = require('http')
const https = require('https')
const express = require('express')
const app = express()
var fontsList = null

function checkHttps (req, res, next) {
  if (req.get('X-Forwarded-Proto').indexOf('https') !== -1) {
    return next()
  } else {
    res.redirect('https://' + req.hostname + req.url)
  }
}

if (process.env.NODE_ENV !== 'production') {
  console.log('TEST')
  require('dotenv').config()
} else {
  app.all('*', checkHttps)
}

app.use(express.static('public'))

app.get('/', (request, response) => {
  response.sendFile(path.join(__dirname, 'public/index.html'))
})

function rndNum (max) {
  const rnd = Math.round(Math.random() * max)
  return rnd
}

function fontFromIndex (index) {
  const font = fontsList[index].family
  return font
}

function updateFontsList () {
  const apiKey = process.env.API_KEY
  https
    .get(
      `https://www.googleapis.com/webfonts/v1/webfonts?key=${apiKey}`,
      (resp) => {
        if (resp.statusCode === 200) {
          let data = ''
          // A chunk of data has been recieved.
          resp.on('data', (chunk) => {
            data += chunk
          })

          // The whole response has been received. Print out the result.
          resp.on('end', () => {
            fontsList = JSON.parse(data).items
          })
        } else {
          console.error('Error in updateFontsList:' + resp.statusMessage)
        }
      }
    )
    .on('error', (err) => {
      console.log('Error: ' + err.message)
    })
}

updateFontsList()

app.get('/font', (request, response) => {
  const rnd = rndNum(fontsList.length)
  const font = fontFromIndex(rnd)
  response.status('200').send(font)
})

app.get('/engines', (request, response) => {
  response.sendFile(path.join(__dirname, 'public/engines.json'))
})

const port = process.env.PORT || 3000

http.createServer(app).listen(port, () => console.log(`Listening on ${port}`))

setInterval(updateFontsList, 3600000)
