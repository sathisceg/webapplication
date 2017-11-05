var bodyParser = require('body-parser');
var mongoose = require('mongoose');

var urlencodedParser = bodyParser.urlencoded({ extended: false })

///////////////////////////////////////////////////////////////////////////

///node mailer to send mail

var nodemailer = require('nodemailer');

var fs = require('fs');
var readfile = fs.readFileSync('readme.txt','utf8');

var obj = JSON.parse(readfile);


//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
mongoose.connect('mongodb://localhost/mydb',{ useMongoClient: true });

mongoose.connection.once('open',function(){

  console.log("connected mongo db success");

}).on('error',function(){

  console.log("connection to  mongo db is failed");

});


const Schema = mongoose.Schema;
///////////////////////////////////////////////////////////////////////////////////////
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

const NotificationSchema = new Schema({
    requestername: String,
    ownername: String,
    source: String,
    destination: String
});


const NotifyUser = mongoose.model('notificationcollections', NotificationSchema);



/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
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
///////////////////////////////////////////////////////////////////////////////////////////////////////////////

/////////////////////////code for database////////////////////////////////////////////////////////////////////

////////////////////////////////////////////////////////////////////////////////////////////////////////////////
app.post('/register_user_database',urlencodedParser,function(req,res){


      console.log("register_user_database");
      console.log(req.body);

      const user = new RegisterUser({
        username:req.body.username,
        password:req.body.password,
        email:req.body.email
      });

      user.save().then(function(result){

            console.log("file inserted to register_user_database");
            res.json(result);
      });


});


/////////////////////////////////////////////////////////////////////////////////////////////////////////
app.post('/share_ride_database',urlencodedParser,function(req,res){

      console.log("share_ride_database");
      console.log(req.body);

      const shareduser = new SharedUser({
        name:req.body.name,
        email:req.body.email,
        source:req.body.source,
        destination:req.body.destination,
        dateandtime:req.body.dateandtime,
        confirmeduser: [],
        requesteduser: [],
      });

      shareduser.save().then(function(result){
            console.log("file inserted to share_ride_database");
              res.json(result);
      });

});

///////////////////////////////////////////////////////////////////////////////////////////////////////////
app.post('/search_ride_database',urlencodedParser,function(req,res){

      console.log("search_ride_database");
      console.log(req.body);

      //var data = [{item:'get milk'},{item:'get water'},{item:'get biscuit'}];

      SharedUser.find().then(function (result) {
              res.json(result);
      });


});

////////////////////////////////////////////////////////////////////////////////////////////////////////////////
app.post('/request_ride_database',urlencodedParser,function(req,res){

      console.log("request_ride_database");

      //to push into requesteduser

      var obj = req.body;

      console.log(obj);

       SharedUser.findOne({email: req.body.owner_email}).then(function(record){

         console.log("inside find one");

         console.log(record);

         record.requesteduser.push({name:obj.name,email:obj.user_email});

          console.log(record);

         console.log(obj);

         record.save().then(function(result){
                   console.log("making update to request user");
                   res.json(result);
               });


      });

});
///////////////////////////////////////////////////////////////////////////////////////////

app.post('/check_for_ride_request',urlencodedParser,function(req,res){

      console.log("search_ride_database");
      console.log(req.body);
      var email=req.body.email;
      //var data = [{item:'get milk'},{item:'get water'},{item:'get biscuit'}];

      SharedUser.find({email: email}).then(function (result) {
              res.json(result);
      });
});
////////////////////////////////////////////////////////////////////////////////////////////


app.post('/update_notification',urlencodedParser,function(req,res){

      console.log("update_notification");

      console.log(req.body);

      const notifyUser = new NotifyUser({
        requestername: req.body.requestername,
        ownername: req.body.ownername,
        source: req.body.source,
        destination: req.body.destination,
      });

      notifyUser.save().then(function(result){


            console.log("Notification updated");


            //to send notification as mail
            ///////////////////////////////////////////

            var textContent = req.body.ownername+" accepted your jouney request from "+req.body.source+" to "+req.body.destination;

            var transporter = nodemailer.createTransport({
              service: 'gmail',
              secure: false,
              port: 25,
              auth: {
                user: obj.username,
                pass: obj.password
              },
              tls: {
                rejectUnauthorized: false
              }
            });

            var HelperOptions = {
              from: obj.password,
              to: req.body.requestername,
              subject: 'your journey is confirmed',
              text: textContent
            };

              transporter.sendMail(HelperOptions, (error, info) => {
                if (error) {
                  return console.log(error);
                }
                console.log("The message was sent!");
                console.log(info);
              });



            ///////////////////////////////////////////////

            res.json(result);
      });
});

/////////////////////////////////////////////////////////////////////////////////////////////////////////

app.post('/check_notification',urlencodedParser,function(req,res){

      console.log("check_notification");

      console.log(req.body);


     var requestername=req.body.requestername;


      //var requestername = "chennai@gmail.com";


      console.log(requestername);
      //var data = [{item:'get milk'},{item:'get water'},{item:'get biscuit'}];

      NotifyUser.find({requestername: requestername}).then(function (result) {

          console.log(result);

          console.log("inside check_notification");

              res.json(result);
      });
});


//////////////////////////////////////////////////////////////////////////////////////////////////////////////////

//called from login to check presence of username

////////////////////////////////////////////////////////////////////////////////////////////////////////////////

app.post('/check_for_username_login',urlencodedParser,function(req,res){

      console.log("check_for_username_login");

      console.log(req.body.email);

      //var data = [{item:'get milk'},{item:'get water'},{item:'get biscuit'}];

      RegisterUser.find({email:req.body.email}).then(function (result) {

              res.json(result);

            console.log("checking for username during login");
          //  console.log(result);

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
