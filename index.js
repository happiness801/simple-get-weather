var express = require('express')
var app = express()

app.get('/weather', function(req, res){
   res.send("It's gonna be hot!")
})

app.get('/health', function(req, res) {
    res.send("It's all good, son")
})

app.listen(3000)
