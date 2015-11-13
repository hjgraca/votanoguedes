var express = require("express"),
    app = express(),
    bodyParser = require('body-parser'),
    rest = require('restler'),
    uuid = require('node-uuid'),
    _ = require("underscore"),
    hostname = process.env.HOSTNAME || 'localhost',
    port = parseInt(process.env.PORT, 10) || 4567,
    publicDir = process.argv[2] || __dirname + '/public';

app.get("/", function (req, res) {
  res.sendFile(publicDir + '/index.html');
});

app.get("/votes", function (req, res) {
  getVotes(function(votes){
    res.send({vote: votes});
  });
});

app.post('/votar', function(req, res) {
    rest.post('http://www.playbuzz.com/Gamereport/home/PostVote', {
      headers:{
        'content-type': ' application/x-www-form-urlencoded; charset=UTF-8'
      },
      data: 'Signature='+ uuid.v1() +'&SessionId='+uuid.v1()+'&articleId=19bd33f4-6ddf-433f-81ff-14d42121fe9a&itemId=e7d58853-3825-48aa-8655-dcc1cc4431ec&upVote=true&UserId='+uuid.v1()
    }).on('complete', function(data) {
      getVotes(function(vote){
        res.send({result : data, votes: vote});  
      });
      console.log(data);
    });
});

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
  extended: true
}));
app.use(express.static(publicDir));

function getVotes(callback){
  rest.post('http://www.playbuzz.com/Gamereport/home/GetPosts', {
      headers:{
        'content-type': ' application/x-www-form-urlencoded; charset=UTF-8'
      },
      data: 'Signature='+ uuid.v1() +'&SessionId='+uuid.v1()+'&articleId=19bd33f4-6ddf-433f-81ff-14d42121fe9a&itemId=e7d58853-3825-48aa-8655-dcc1cc4431ec&upVote=true&UserId='+uuid.v1()
    }).on('complete', function(data) {
      var vote = _.where(data, {ItemId: "e7d58853-3825-48aa-8655-dcc1cc4431ec"})[0];
      console.log(vote.UpVote);
      if(callback){
        callback(vote.UpVote);
      }
    });
}

console.log("Simple static server showing %s listening at http://%s:%s", publicDir, hostname, port);
app.listen(port, hostname);