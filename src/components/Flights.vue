l<template>
    <div class="users">
        <h1>My Flights</h1>
        <table v-if="!isLoading" align="center">
            <tr>
                <td width="150">Provider</td>
                <td width="100">Price</td>
                <td width="100">Departure Time</td>
                <td width="250">Arrival Time</td>
            </tr>
            <tr v-for="flight in flightTab">
                <td>{{ flight.provider }}</td>
                <td>{{ flight.price }} €</td>
                <td>{{ flight.departure_time }}</td>
                <td>{{ flight.arrival_time }}</td>
            </tr>
        </table>
        <p v-else>Loading ...</p>
    </div>
</template>

<script>
import FlightsService from '@/services/FlightsService';
import Encryptor from '@/services/Encryptor';

export default {
    name: 'users',
    data () {
        return {
            flightTab: '',
            isLoading: true
        };
    },
    mounted () {
        this.getFlight();
    },
    methods: {
        async getFlight () {
            const apiKey = btoa(Encryptor.encryptStr(process.env.APP_API_KEY));
            const response = await FlightsService.fetchFlights(apiKey);
            this.flightTab = response.data;
            this.isLoading = false;
        }
    }
};

</script>

<style type="text/css">
.table-wrap {
    width: 60%;
    margin: 0 auto;
    text-align: center;
}
table th, table tr {
    text-align: left;
}
table thead {
    background: #f2f2f2;
}
table tr td {
    padding: 10px;
}
table tr:nth-child(odd) {
    background: #f2f2f2;
}
table tr:nth-child(1) {
    background: #4d7ef7;
    color: #fff;
}
a {
    color: #4d7ef7;
    text-decoration: none;
}
a.add_user_link {
    background: #4d7ef7;
    color: #fff;
    padding: 10px 80px;
    text-transform: uppercase;
    font-size: 12px;
    font-weight: bold;
}
</style>
