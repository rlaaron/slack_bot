//All tutorial Node.Js code examples are for reference only and shouldn't be used in production code as is. In production, a new new pipedrive.ApiClient() instance should be initialised separately for each request.
const pipedrive = require('pipedrive');
const defaultClient = new pipedrive.ApiClient();
require('dotenv').config();

// Configure authorization by settings api key
// PIPEDRIVE_API_KEY is an environment variable that holds real api key
defaultClient.authentications.api_key.apiKey = process.env.PIPEDRIVE_API_KEY;

async function getDeals() {
    try {
        console.log('Sending request...');

        const api = new pipedrive.DealsApi(defaultClient);

        const response = await api.getDeals();

        const deals = response.data.map( deal => {
            return {
                id: deal.id,
                title: deal.title,
                value: deal.value,
                currency: deal.currency,
                status: deal.status,
                won_time: deal.won_time,
                lost_reason: deal.lost_reason,
                lost_time: deal.lost_time,
            };
        });

        // const wonDeals = deals.filter( deal => deal.status === 'won');
        // const wonDeals = deals.map( deal => {
        //     if (deal.status === 'won') {
        //         return {
        //             id: deal.id,
        //             title: deal.title,
        //             value: deal.value,
        //             currency: deal.currency,
        //             status: deal.status,
        //             won_time: deal.won_time,
        //         };
        //     }
        // });
        const wonDeals = deals.filter( deal => deal.status === 'won');
        // const wonDealPerMont = wonDeals.filter( deal => deal.won_time.includes('2024'));
        // console.log('Got deals successfully!', deals);
        // console.log('Won deals:', wonDeals);

        return wonDeals[0];

        // console.log('Got deals successfully!', response);
    } catch (err) {
        const errorToLog = err.context?.body || err;

        console.log('Getting deals failed', errorToLog);
    }
}
module.exports = { getDeals}
// getDeals();
