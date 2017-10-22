



module.exports = function (app) {


app.get('/login',function(req,res){

    //res.end("login page");
      res.render('login');
});


app.get('/register',function(req,res){

  //  res.end("register page");
    res.render('register');
});



app.get('/generateotp',function(req,res){

  //console.log("generateotp");

  //res.render('register');

});



app.get('/home',function(req,res){

  //console.log("home");
  res.render('home');


});


app.get('/shareride',function(req,res){

  //console.log("shareride");
  res.render('shareride');


});


app.get('/searchride',function(req,res){

  //console.log("searchride");
  res.render('searchride');


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
