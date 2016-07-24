const express = require('express');
const bodyParser = require('body-parser');
const app = express();
const server = require('http').createServer(app);
const io = require('socket.io')(server);

server.listen(1234, () => {
    console.log("Open http://localhost:1234 in your browser");
});
var messages = [];


app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

// Setting up for rendering jade(pug) files
app.set('view engine', 'pug');


// The Directory where the template files are located
app.set('views', __dirname + '/public');

// Static file directory
app.use(express.static(__dirname + '/public'));


app.get('/', (req, res) => {
    res.render('indexAJAX');
});

app.get('/socket', (req, res) => {
    res.render('indexSocket');
});

app.get('/messages', (req, res) => {
    res.json(messages);
});

app.post('/messages', (req, res) => {
    var message = req.body;
    messages.push(message);
    res.json(message);
});


io.on('connection', (socket) => {
    console.log('A User Connected!');
    socket.on('disconnect', function() {
        console.log('A User Disconnected!');
    });

    socket.on('message', (msg) => {
        messages.push(msg);
        io.emit('message', msg);
    });

    socket.emit('chat history', messages);
});
