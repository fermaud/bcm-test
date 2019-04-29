'use strict';
const axios = require('axios');
const Encryptor = require('./encryptor.js');

// https://github.com/BCM-ENERGY-team/bcm-backend-interview/blob/master/code.README.md

module.exports = function (app) {
    function renameKeys (obj, newKeys) {
        const keyValues = Object.keys(obj).map(key => {
            const newKey = newKeys[key] || key;
            return { [newKey]: obj[key] };
        });
        return Object.assign({}, ...keyValues);
    }

    function formatForAirBeam (flightsTab) {
        var newTab = flightsTab.split('\n');
        newTab.shift();
        for (var flight in newTab) {
            newTab[flight] = newTab[flight].split(',');
            let newFormat = {
                provider: 'AIR_BEAM',
                id: newTab[flight][0],
                price: parseInt(newTab[flight][1]),
                departure_time: newTab[flight][2],
                arrival_time: newTab[flight][3]
            };
            newTab[flight] = newFormat;
        }
        return (newTab);
    }

    function addCompanyName (flightsTab, companyName) {
        for (let flight in flightsTab) {
            flightsTab[flight].provider = companyName;
        }
        return flightsTab;
    }

    function formatForAirJazz (flightsTab) {
        const newKeys = { id: 'id', price: 'price', dtime: 'departure_time', atime: 'arrival_time' };
        for (let flight in flightsTab) {
            flightsTab[flight] = renameKeys(flightsTab[flight], newKeys);
            flightsTab[flight].provider = 'AIR_JAZZ';
        }
        return flightsTab;
    }

    function giveFlightsSameFormat (flightsTab) {
        if (flightsTab.includes('id,p,departure,arrival')) {
            flightsTab = formatForAirBeam(flightsTab);
        } else if (-1 !== Object.keys(flightsTab[0]).indexOf('dtime')) {
            flightsTab = formatForAirJazz(flightsTab);
        } else if (-1 !== Object.keys(flightsTab[0]).indexOf('departure_time')) {
            flightsTab = addCompanyName(flightsTab, 'AIR_MOON');
        }
        return flightsTab;
    };

    function setFlightLimitTo50 (flightsTab) {
        let sliced = [];
        for (var i = 0; i < flightsTab.length; i++) {
            if (50 === i) {
                return sliced;
            }
            sliced[i] = flightsTab[i];
        }
        return sliced;
    };

    function joinAllTabs (flightsTab) {
        let properFlightTab = [];
        for (let tab in flightsTab) {
            for (let flight in flightsTab[tab]) {
                properFlightTab.push(flightsTab[tab][flight]);
            }
        }
        return properFlightTab;
    };

    function sortFlightsInTab (flightsTab) {
        let allFlightstab = [];
        for (let companyTab in flightsTab) {
            allFlightstab.push(giveFlightsSameFormat(flightsTab[companyTab]));
        }
        return allFlightstab;
    };

    const getFlightsFromCompany = async (company) => {
        try {
            return await axios.get('https://my.api.mockaroo.com/' + company + '/flights?key=dd764f40');
        } catch (error) {
            await Promise.reject(new Error(error));
        }
    };

    const getAllFlights = async (myCompanies) => {
        let flightsTab = [];
        for (var company in myCompanies) {
            try {
                let flights = await getFlightsFromCompany(myCompanies[company]);
                flightsTab.push(flights.data);
            } catch (err) {
                console.warn(err);
            }
        }
        flightsTab = sortFlightsInTab(flightsTab);
        flightsTab = joinAllTabs(flightsTab);   
        flightsTab = flightsTab.sort(function (a, b) {
            return parseFloat(a.price) - parseFloat(b.price);
        });
        flightsTab = setFlightLimitTo50(flightsTab);
        return flightsTab;
    };

    app.get('/api/flights', async (req, res) => {
        const myCompanies = ['air-jazz', 'air-moon', 'air-beam'];
        let flightsTab = await getAllFlights(myCompanies);
        res.end(JSON.stringify(flightsTab));
    });
};
