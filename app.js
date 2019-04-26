const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const morgan = require('morgan');

const app = express();
app.use(morgan('combined'));
app.use(bodyParser.json());
app.use(cors());

var getFlights = require('./server/Clients/getFlights');
getFlights(app);

app.listen(process.env.PORT || 8081);