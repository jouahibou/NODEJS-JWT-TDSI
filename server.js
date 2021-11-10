const express = require('express')
const bodyParser = require('body-parser')
const cors = require('cors')
const app = express()

const admin = require('firebase-admin')
const serviceAccount = require('./config/serviceAccount.json')

admin.initializeApp({
    credential: admin.credential.cert(serviceAccount)
  });

app.use(bodyParser.urlencoded({ extended: true }))
app.use(cors())
app.use(bodyParser.json())
app.use(express.json())

app.use('/api/register', require('./routes/api/register'))
app.use('/api/login', require('./routes/api/login'))
app.use('/api/private', require('./routes/api/private'))
app.use('/api/beacon', require('./routes/api/beacon'))
app.use('/api/raspberry', require('./routes/api/raspberry'))
app.use('/api/coordBeacon', require('./routes/api/coordBeacon'))


app.get('/', (req, res) => {
    res.send('Try with: /api/beacon or /api/raspberry or /api/coordBeacon or /api/coordBeacon or /api/login or /api/register')
})

const port = process.env.PORT || 9000

app.listen(port, () => {
    console.log(`server started: ${port}`)
})

