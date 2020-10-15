const express = require('express')
const conversions = require('./routes/conversions')
const login = require('./routes/login')
require('dotenv').config()

const app = express()

app.use(express.urlencoded({ extended: true }));
app.use(express.json());


login(app)
conversions(app)


app.listen(process.env.PORT || 3000)