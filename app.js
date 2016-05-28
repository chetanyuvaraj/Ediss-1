
/**
 * Module dependencies.
 */
var express = require('express');
var mysql = require("mysql");
var http = require('http');
var url = require('url') ;
var app = express();
var bodyParser = require('body-parser');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var session = require('express-session');
app.use(bodyParser.json()); 
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(session({ cookieName:'session' ,secret: 'chetan', resave: false, saveUninitialized: false,maxAge:15 * 60 * 1000,httpOnly: true, secure: true,ephemeral: true}));
app.set('port', process.env.PORT || 3000);

var con = mysql.createConnection({
  host: "assignment-1.cwkx3zi039zq.us-east-1.rds.amazonaws.com",
  user: "ckovvuri",
  password: "Reddy8344",
  database: "users"
});

app.post('/login', function(req,res){
var username = req.body.username;
var password = req.body.password;


  if (typeof username != 'undefined' && (typeof req.session.username == 'undefined' || req.session.username === "" || req.session.username === undefined)){
  
  console.log('Connection established');
  con.query('SELECT * FROM user where username=? AND password=?',[username,password],function(err,rows){
     if(err) {
      console.log("Error Selecting : %s ",err );
    }
    if(rows.length <= 0 || typeof rows == 'undefined') {
        res.send('There seems to be an issue with the username/password combination that you entered');
    }
      else {
        req.session.username = true;
        res.send('Welcome'+ " " + rows[0].name); 
      }
    });
  }
  else{
      res.json('you are already logged in');
    }
});

app.post('/add', function(req,res){

if(req.session.username){
var num1 = req.body.num1;
var num2 = req.body.num2;
res.json({'result':(num1-0) + (num2-0)});
}
else{
  res.json("You must be logged in to access this function");
}
 });
 app.post('/divide', function(req,res){
if(req.session.username){
var num1 = req.body.num1;
var num2 = req.body.num2;
if((num2-0) ==0){
  res.json("The numbers you entered are not valid”");
}
else{
res.json({'result':((num1-0) / (num2-0))});
}
}
   else{
     res.json("You must be logged in to access this function");
   }
 }
 );
 app.post('/multiply', function(req,res){
   if(req.session.username){
var num1 = req.body.num1;
var num2 = req.body.num2;
res.json({'result' : ((num1-0)*(num2-0))});
   }
  else{
     res.json("You must be logged in to access this function");
   }
 });
 
 app.post('/logout', function(req,res){
   if(req.session.username){
     req.session.destroy();
     res.json("You have been successfully logged out");
   }
   else{
     res.json("You are not currently logged in");
   }
   
 });
var serve = http.createServer(app);
serve.listen(app.get('port'), function () {
    console.log('Express server listening on port ' + app.get('port'));
});



