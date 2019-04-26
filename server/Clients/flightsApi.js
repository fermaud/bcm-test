'use strict';
const axios = require('axios');
const VAR_ENV = require('../config.js');

module.exports = {
    get_flights_from_company: function (company, index) {
        // if (2 === index ) {
        //     return false;
        // }
        const url = VAR_ENV.MOCKAROO_BASE_URL;
        const headers = {
            headers: {
                'Content-type': 'application/json',
                'X-API-Key': VAR_ENV.MOCKAROO_API_KEY
            }
        };
        return axios.get(url + company + '/flights', headers);
    }
};
