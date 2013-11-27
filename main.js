var express = require('express'),
	app = express(),
  	server = require('http').createServer(app),
  	io = require('socket.io').listen(server);

server.listen(1337);

//Demo list of devices
var devices = {'devices':[
		{'name':'MattLaptop'},
		{'name':'TV'},
		{'name':'KatiesLaptop'}]
}

//Demo list of videos
var videos = {
	'videos' : [
		{
			'name':'Bunny',
			'description':'A movie about a bunny',
			'location': '/videos/bunny.mp4',
		},
		{
			'name':'Happy Feet',
			'description':'A trailer for Happy Feet 2',
			'location': '/videos/happy.mp4',
		},
	]
}

app.use('/css', express.static(__dirname + '/css'));
app.use('/videos', express.static(__dirname + '/videos'));

//Code for Media Player (Browser with not input devices, relies on API)
app.get('/', function (req, res) {
	res.sendfile(__dirname + '/html/app/index.html');
});

app.get('/videos', function (req, res) {
	res.sendfile(__dirname + '/html/app/videos.html');
});

app.get('/videos/play/:id', function (req, res) {
	res.sendfile(__dirname + '/html/app/play.html');
	video_id = req.params.id;
	location = videos.videos[video_id].location;
	try{
		io.sockets.emit('play', {'location':location});
	} catch (err){
		res.send('Failure');
	}
});

//-------------------------------------
//API Code
//-------------------------------------

//Gets a list of the functions in the API
app.get('/api', function (req, res) {
  	res.send('Welcome to the API');
});

//Gets a list of available devices
app.get('/api/devices', function (req, res) {
  	res.send(devices);
});

//Gets a list of the videos
app.get('/api/videos', function (req, res){
	try{
		io.sockets.emit('redirect', {'page':'/videos'});
		res.send(videos);
	} catch (err){
		res.send({'status':'Failed with error: ' + err});
	}
});

//Returns information of specific video
app.get('/api/videos/:id', function (req, res){
	video_id = req.params.id;
	page = '/videos/play/' + video_id;
	console.log("ALERT: " + page);
	try{
		io.sockets.emit('redirect', {'page':page});
		res.send("Success");
	} catch (err){
		res.send('Failure');
	}
});


//-----------------------------------------
// Controller Code 
//-------------------------------------------
app.get('/controller' , function (req, res){
	res.sendfile(__dirname + '/html/controller/controller.html');
});

app.get('/controller/videos', function (req, res){
	res.sendfile(__dirname+ '/html/controller/video_list.html');
});

app.get('/controller/videos/play', function (req, res){
	res.sendfile(__dirname+ '/html/controller/play.html')
});


