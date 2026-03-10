const express = require('express')
const bodyParser = require('body-parser')
const app = express()
const port = process.env.PORT
process.env.NODE_TLS_REJECT_UNAUTHORIZED = "0"
app.use(express.static("uploads"));
app.use(bodyParser.json())
app.use(
  bodyParser.urlencoded({
    extended: true,
  })
)

// app.use('/doc')

require('./endpoints')(app)

app.listen(port, () => {
  console.log(`App running on port ${port}.`)
})