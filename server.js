const http = require('http')
const fs = require('fs')
const db = require('./db.json')
const { v4: uuidv4 } = require('uuid')
const server = http.createServer((req, res) => {
  console.log(req.method, req.url)
  const routes = {
    '/buddys': () => {
      res.setHeader('Content-Type', 'application/json')
      res.setHeader('Access-Control-Allow-Origin', 'http://localhost:5000')
      res.end(JSON.stringify(db.buddyList))
    },
    '/energy': () => {
      if (req.method === 'GET') {
        res.setHeader('Content-Type', 'application/json')
        res.setHeader('Access-Control-Allow-Origin', 'http://localhost:5000')
        res.end(JSON.stringify(db.energyData))
      } else if (req.method === 'POST') {
        let bodyString = ''
        req.on('data', (chunk) => (bodyString += chunk))
        req.on('end', () => {
          const body = JSON.parse(bodyString)
          const energyEntry = { ...body, id: uuidv4() }
          db.energyData.push(energyEntry)
          fs.writeFile(
            'db.json',
            JSON.stringify(db, null, 2),
            'utf8',
            (error) => {
              res.statusCode = error ? 500 : 200
              const response = error ? error : energyEntry
              res.end(JSON.stringify(response))
            }
          )
        })
      }
    },
    '404': () => {
      res.statusCode = 404
      res.end(
        '<h1 style="color: crimson">404</h1><p>Sorry, this does not exist</p>'
      )
    },
  }
  const route = routes[req.url] || routes['404']
  route()
})
server.listen(4000, () => {
  console.log('server started on port 4000')
})
