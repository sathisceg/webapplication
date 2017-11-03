
var express = require('express');
var cabController = require('./controller/cabController');


var app = express();

app.set('view engine','ejs');
app.use('/assets',express.static('./stuff'));


cabController(app);

app.listen(4000,function(){
  console.log("server cab controller  is running");
});
