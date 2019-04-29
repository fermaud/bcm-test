import Api from '@/services/Api';

export default {
    fetchFlights (apiKey) {
        return Api().get('flights');
    }
};
