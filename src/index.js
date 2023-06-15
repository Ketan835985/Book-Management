const express = require('express')
const app = express()
const mongoose = require('mongoose')
const routes = require('./routes/routes')
const {PORT, MONGO_URI} = require('../config.js')



app.use(express.json())
app.use(express.urlencoded({ extended: true }))

mongoose.connect(MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true })
.then(() => console.log('MongoDB connected'))
.catch((err) => console.log(err))


app.use('/', routes)

app.listen(PORT, () => console.log(`Server running on port ${PORT}`))