const express = require('express')
const conversions = require('./routes/conversions')
const login = require('./routes/login')

const app = express()

app.use(express.urlencoded({ extended: true }));
app.use(express.json());


login(app)
conversions(app)


app.listen(80)