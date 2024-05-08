const dotenv = require('dotenv')
dotenv.config();

const express = require('express');

const app = express();

const cors = require('cors');

const db = require('./Config/Connection');

const fetchuser = require('./Config/AdminFetch');

const PORT = process.env.PORT || 9000;

var bodyParser = require('body-parser')

const session = require('express-session');
const path = require('path');

app.use(session({
    secret: 'jwt',
    saveUninitialized: true,
    resave: false,
    cookie: {
        maxAge: 1000 * 60 * 60 * 24
    }
}));

app.use(cors());
app.use(bodyParser.urlencoded());
app.use(bodyParser.json())
// app.use(express.static('assets'));
app.use('/assets', express.static(path.join(__dirname, 'assets')));

app.get('/', (req, res) => {
    return res.send('hello Developer........');
})
app.use('/api', require('./Routes/index'));

app.listen(PORT, async (err) => {
    if (err) {
        console.log(err);
    }
    console.log('Server Start On This PORT : ' + PORT);
});