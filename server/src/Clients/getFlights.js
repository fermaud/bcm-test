'use strict';
const axios = require('axios');
const flightsApi = require('./flightsApi.js');

// Air Beam 519 493 495
// https://github.com/BCM-ENERGY-team/bcm-backend-interview/blob/master/code.README.md
const testTab1 = 'id,p,departure,arrival\n8c4e85c2-5010-4d79-8c9a-88609b155bcb,519.69,12:15 PM,3:32 PM\n57e5cce6-1b1f-4f49-8a4a-b7ef0a9718a8,493.09,7:24 PM,5:50 PM\n54c57054-fd78-4524-8bb8-a32293be3df1,495.19,8:08 AM,8:46 AM';

// Air Jazz 511 512 
const testTab2 = [
{
    "id": "c2e91bdf-ccc0-45d5-b4ea-ef75bc932ae8",
    "price": 511.78,
    "dtime": "9:15 PM",
    "atime": "5:35 AM"
},
{
    "id": "c2e91bdf-ccc0-45d5-b4ea-ef75bc932ae8",
    "price": 512.78,
    "dtime": "9:15 PM",
    "atime": "5:35 AM"
}
];

// Air Moon 5011 5323011
const testTab3 = [
{
    "id": "c2e91bdf-ccc0-45d5-b4ea-ef75bc932ae8",
    "price": 5011.78,
    "departure_time": "9:15 PM",
    "arrival_time": "5:35 AM"
},
{
    "id": "c2e91bdf-ccc0-45d5-b4ea-ef75bc932ae8",
    "price": 5323011.78,
    "departure_time": "9:15 PM",
    "arrival_time": "5:35 AM"
}
];


module.exports = function (app) {

    function renameKeys(obj, newKeys) {
        const keyValues = Object.keys(obj).map(key => {
            const newKey = newKeys[key] || key;
            return { [newKey]: obj[key] };
        });
        return Object.assign({}, ...keyValues);
    }

    function format_for_air_beam(flightsTab) {
        var newTab = testTab1.split('\n');
        newTab.shift();
        // checker si ca delete le dernier element
        // newTab.pop();
        for (var flight in newTab) {
            newTab[flight] = newTab[flight].split(',');
            let newFormat = {
                provider: 'AIR_BEAM',
                id: newTab[flight][0],
                price: parseInt(newTab[flight][1]),
                departure_time: newTab[flight][2],
                arrival_time: newTab[flight][3]
            }
            newTab[flight] = newFormat;
        }
        return (newTab);
    }

    function add_company_name (flightsTab, companyName) {
        for (let flight in flightsTab) {
            flightsTab[flight].provider = companyName
        }
        return flightsTab;
    }

    function format_for_air_jazz(flightsTab) {
        const newKeys = { id: "id", price: "price", dtime: "departure_time", atime: "arrival_time" };
        for (let flight in flightsTab) {
            flightsTab[flight] = renameKeys(flightsTab[flight], newKeys);
            flightsTab[flight].provider = 'AIR_JAZZ'
        }
        return flightsTab;
    }

    function give_flights_same_format (flightsTab) {
        if (flightsTab.includes('id,p,departure,arrival')) {
            flightsTab = format_for_air_beam(flightsTab);
        } else if (-1 !== Object.keys(flightsTab[0]).indexOf('dtime')) {
            flightsTab = format_for_air_jazz(flightsTab);
        } 
        else if (-1 !== Object.keys(flightsTab[0]).indexOf('departure_time')) {
            flightsTab = add_company_name(flightsTab, 'AIR_MOON');
        }
        return flightsTab
    };

    function sort_flights_in_tab (flightsByCompanies) {
        let allFlightstab = [];
        for (let flightsTab in flightsByCompanies) {
            allFlightstab.push(give_flights_same_format(flightsByCompanies[flightsTab]));
        }
        return allFlightstab;
    };

    function join_all_tabs (flightsTab) {
        let properFlightTab = [];
        for (let tab in flightsTab) {
            for (let flight in flightsTab[tab]) {
                properFlightTab.push(flightsTab[tab][flight]);
            }
        }
        return properFlightTab;
    };

    function get_all_flights (myCompanies) {
        // for (var company in myCompanies) {
        //     flightsApi.get_flights_from_company(myCompanies[company], company).then(response => {
        //         let companyFlights = {
        //             flights: response.data
        //         }
        //         flightsTab.push(companyFlights);
        //         if (cnt === myCompanies.length) {
        //             sort_flights_in_tab(flightsTab);
        //         }
        //         cnt += 1;
        //     }).catch((error) => {
        //         console.warn('error ' + error);
        //     });
        // }
        let flightsTab = [];
        flightsTab.push(testTab1, testTab2, testTab3);
        flightsTab = sort_flights_in_tab(flightsTab);
        flightsTab = join_all_tabs(flightsTab);    
        flightsTab = flightsTab.sort(function(a, b){
            return parseFloat(a.price) - parseFloat(b.price);
        });
        console.log(flightsTab);
        return flightsTab;
    };

    app.get('/api/flights', (req, res) => {
        const myCompanies = ['air-jazz', 'air-moon', 'air-beam'];
        const mySortedFlights = get_all_flights(myCompanies);
        res.end(JSON.stringify(mySortedFlights));
    })
};
