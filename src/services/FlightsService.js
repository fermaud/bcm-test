import Api from '@/services/Api';

export default {
    fetchFlights () {
        return Api().get('flights');
    }
};
