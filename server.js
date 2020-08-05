const http = require('http') //protocol (http inkludiert in node)
const fs = require('fs') //filesystem (fs inkludiert in node))
const db = require('./db.json')
const { v4: uuidv4 } = require('uuid')
const server = http.createServer((req, res) => {
  //http Server wird kreiert, createServer hat eine Funktion als Parameter
  console.log(req.method, req.url) //methode = Get oder Post, url = /energy, /buddys
  const routes = {
    '/buddys': () => {
      //buddys ist ein Endpoint
      //buddys ist der key, die arrow-function ist der value, wenn der key requestet wird, wird die arrow-function aufgerufen
      res.setHeader('Content-Type', 'application/json') //setHeader ist eine Funktion, content-type ist der key, application/json ist der value
      res.setHeader('Access-Control-Allow-Origin', 'http://localhost:5000')
      res.end(JSON.stringify(db.buddyList)) //am Objekt res wird durch end abgeschickt, die Antwort (der Body) steht im Parameter. JSON stringyfy nimmt JSON nimmt Objekte und macht einen string daraus
    },
    '/energy': () => {
      //energy ist der key, die arrow-function ist der value
      if (req.method === 'GET') {
        res.setHeader('Content-Type', 'application/json')
        res.setHeader('Access-Control-Allow-Origin', 'http://localhost:5000')
        res.end(JSON.stringify(db.energyData))
      } else if (req.method === 'POST') {
        let bodyString = ''
        req.on('data', (chunk) => (bodyString += chunk)) //wenn Daten reinkommen, dann...(data repräsentiert ein event). Chunk ist ein Stückchen von Daten, es wird an bodystring angehängt
        req.on('end', () => {
          //wenn der Request zu Ende ist, dann...(end repräsentiert ein event)
          const body = JSON.parse(bodyString) //JSON.parse: aus Strings werden Objekte gemacht
          const energyEntry = { ...body, id: uuidv4() } //{...body} macht eine Kopie von body und id: uuidv4() hängt eine random id dran
          db.energyData.push(energyEntry) //push fügt ein neues Element am Ende eines Arrays hinzu
          fs.writeFile(
            //writeFile schreibt eine Datei mit dem Inhalt aus db (was in der Zeile darüber hinzugefügt wurde)
            'db.json', //dateiname, der das Ziel ist, aktuelles Verzeichnis, in dem das Backend läuft
            JSON.stringify(db, null, 2), //null weil nicht replaced werden soll, 2 spaces
            'utf8', //default
            (error) => {
              res.statusCode = error ? 500 : 200 //statusCode ist eine number property
              const response = error ? error : energyEntry //wenn es true ist, wird der response error zugewiesen, wenn es false ist, wird der response energyEntry zugewiesen
              res.end(JSON.stringify(response)) //end als Imperativ
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
  const route = routes[req.url] || routes['404'] //routes ist ein Objekt, auf das durch die [] zugegriffen wird, req.url ist ein String (zB. /buddys) und sucht die urls in Routes (gibt es die url als key in routes?) oder das Objekt mit dem Key 404 in routes
  route()
})
server.listen(4000, () => {
  //wenn der Server unter der Portnummer 4000 listened, gibt er das aus
  console.log('server started on port 4000')
})
