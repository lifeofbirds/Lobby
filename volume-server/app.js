var fs = require('fs');
var osc = require('node-osc');
var express = require('express');
var app = express();

var SAVESTATE = 'state.json';
var CREDS = 'creds.json';

if(process.argv.length <= 1){
	return usage();
}

var args = process.argv.slice(2);
var hostport = args[0].split(/:/);
console.log("Opening OSC client to " + hostport[0] + " on port " + hostport[1]);
var client = new osc.Client(hostport[0], hostport[1]);

var state = loadPersistedValues();
var creds = JSON.parse(fs.readFileSync(CREDS));

var auth = require('./auth').auth(creds);

var bodyParser = require('body-parser')
app.use(bodyParser.text())


app.use('/static', auth, express.static(__dirname + '/static', {
	index: false
}));

app.engine('jade', require('jade').__express);
app.set('view engine', 'jade');

app.get('/', auth, function(req, res){
	var values = loadPersistedValues();
	res.render('index', values);
});

app.post('/vol/:zone', auth, function(req, res){
	console.log("Changing zone: " + req.params.zone + " to " + req.body);
	client.send('/' + req.params.zone, parseInt(req.body), function(){
		//nop
	});
	state[req.params.zone] = req.body;
	saveState(state);
	res.set('Conent-Type', 'text/plain');
	res.send('ok');
});

app.listen(8080);
console.log("Server listening on port 8080");

function loadPersistedValues(){
	if(fs.existsSync(SAVESTATE)){
		return JSON.parse(fs.readFileSync(SAVESTATE));
	}
	return { zone1: 100, zone2: 100, zone3: 100 };
}

function saveState(state){
	fs.writeFileSync(SAVESTATE, JSON.stringify(state));
}

function usage(){
	console.log("Usage: node app.js <host>:<port>");
	console.log("  where <host>:<port> is the OSC target.");
}