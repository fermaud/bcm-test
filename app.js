var sslRedirect = require('heroku-ssl-redirect');
const express = require('express');
var path = require('path');
const bodyParser = require('body-parser');
const cors = require('cors');
const morgan = require('morgan');
const rateLimit = require('express-rate-limit');

var serveStatic = require('serve-static');
const app = express();
app.enable('trust proxy');
const limiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 100 // limit each IP to 100 requests per windowMs
});
app.use(sslRedirect(['production'], 301));
app.use(serveStatic(path.join(__dirname, 'dist')));
app.use(limiter);
app.use(morgan('combined'));

app.use(bodyParser.json());
app.use(cors());

var getFlights = require('./server/Clients/getFlights');
getFlights(app);

app.listen(process.env.PORT || 8081);
