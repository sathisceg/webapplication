



module.exports = function (app) {


app.get('/login',function(req,res){

    //res.end("login page");
      res.render('login');
});


app.get('/register',function(req,res){

  //  res.end("register page");
    res.render('register');
});


// app.post('/todo',urlencodedParser,function(req,res){
//
//
//
//
// });
//
//
// app.delete('/todo/:item',function(req,res){
//
//
//
// });


};
