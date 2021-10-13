const config = require('./Utils/config')

const app = require('./app') 
const http = require('http')

// Palvelimen määritys: Portit ja varsinaisen sovelluksen importit

const server = http.createServer(app)


server.listen(config.PORT, () => {
  console.log(`Server starting on ${config.PORT}`)
});
