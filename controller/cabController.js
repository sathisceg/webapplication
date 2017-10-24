var bodyParser = require('body-parser');
var mongoose = require('mongoose');

var urlencodedParser = bodyParser.urlencoded({ extended: false })

//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
mongoose.connect('mongodb://localhost/mydb',{ useMongoClient: true });

mongoose.connection.once('open',function(){

  console.log("connected mongo db success");

}).on('error',function(){

  console.log("connection to  mongo db is failed");

});


const Schema = mongoose.Schema;

const RegisterUserSchema = new Schema({

  username:String,
  password:String,
  email:String

});

const RegisterUser = mongoose.model('registerusercollections',RegisterUserSchema);
//////////////////////////////////////////////////////////////////////////////////


const ConfirmedUserSchema = new Schema({
    name: String,
    email: String
});

const RequestedUserSchema = new Schema({
    name: String,
    email: String
});

const SharedUserSchema = new Schema({
    name: String,
    email: String,
    source:String,
    destination:String,
    dateandtime:String,
    confirmeduser: [ConfirmedUserSchema],
    requesteduser: [RequestedUserSchema],
});

const SharedUser = mongoose.model('sharedusercollections', SharedUserSchema);



//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////




module.exports = function (app) {


app.get('/login',function(req,res){

    //res.end("login page");
      res.render('login');
});


app.get('/register',function(req,res,next){

  //  res.end("register page");
    console.log("register");

    //var data = [{item:'get milk'},{item:'get water'},{item:'get biscuit'}];

    //res.render('register',{todos:data});
    //return res.redirect('/register');

    res.render('register');
});






// app.post('/register',urlencodedParser,function(req,res){
//
//   //  res.end("register page");
//
//     console.log("register post");
//     res.redirect('/register');
// });


// app.get('/generateotp',function(req,res){
//
//   //console.log("generateotp");
//
//   //res.render('register');
//
// });



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

app.post('/register_user_database',urlencodedParser,function(req,res){


      console.log("register_user_database");
      console.log(req.body);

      const user = new RegisterUser({
        username:req.body.username,
        password:req.body.password,
        email:req.body.email
      });

      user.save().then(function(){
            console.log("file inserted to register_user_database");
      });


});



app.post('/share_ride_database',urlencodedParser,function(req,res){

      console.log("share_ride_database");
      console.log(req.body);
      const shareduser = new SharedUser({
        name:'sachin',
        email:'asdf@gmail.com',
        source:req.body.source,
        destination:req.body.destination,
        dateandtime:req.body.dateandtime,
        confirmeduser: [],
        requesteduser: [],
      });

      shareduser.save().then(function(){
            console.log("file inserted to share_ride_database");
      });

});


app.post('/search_ride_database',urlencodedParser,function(req,res){

      console.log("search_ride_database");
      console.log(req.body);

      // const shareduser = new SharedUser({
      //   name:'sachin',
      //   email:'asdf@gmail.com',
      //   source:req.body.source,
      //   destination:req.body.destination,
      //   dateandtime:req.body.dateandtime,
      //   confirmeduser: [],
      //   requesteduser: [],
      // });
      //
      // shareduser.save().then(function(){
      //       console.log("file inserted to share_ride_database");
      // });


      var data = [{item:'get milk'},{item:'get water'},{item:'get biscuit'}];


      SharedUser.find().then(function (result) {
              res.json(result);
      });


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
