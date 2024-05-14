const Pipedrive = require("pipedrive");
let apiClient = new Pipedrive.ApiClient();
let api_key = apiClient.authentications["api_key"];
api_key.apiKey = process.env.PIPEDRIVE_API_KEY;

// const getDeals = async (startDate, interval, amount) => {
const getDeals = async () => {
  try {
    let apiInstance = new Pipedrive.DealsApi(apiClient);
    let startDate = new Date("2024-01-01"); // Date | The date when the first interval starts. Format: YYYY-MM-DD.
    let interval = "month"; // String | The type of the interval<table><tr><th>Value</th><th>Description</th></tr><tr><td>`day`</td><td>Day</td></tr><tr><td>`week`</td><td>A full week (7 days) starting from `start_date`</td></tr><tr><td>`month`</td><td>A full month (depending on the number of days in given month) starting from `start_date`</td></tr><tr><td>`quarter`</td><td>A full quarter (3 months) starting from `start_date`</td></tr></table>
    let amount = 5; // Number | The number of given intervals, starting from `start_date`, to fetch. E.g. 3 (months).
    let fieldKey = "add_time"; // String | The date field key which deals will be retrieved from

    const response = await apiInstance.getDealsTimeline(
      startDate,
      interval,
      amount,
      fieldKey
    );

    const data = response.data;
    // Initialize an empty array to store all deals from all periods
    const allDeals = {};
    const totals = {};

    // Iterate over each key in the response object (keys like '0', '1', '2', ...)
    Object.keys(data).forEach((key) => {
      const periodData = data[key];
      const dealsInPeriod = periodData.deals;

      //   Append deals from current period to allDeals array
      if (Array.isArray(dealsInPeriod)) {
        // const deal = dealsInPeriod.map((deal) => {
        //   return {
        //     id: deal.id,
        //     title: deal.title,
        //     value: deal.value,
        //     currency: deal.currency,
        //     status: deal.status,
        //     won_time: deal.won_time,
        //     lost_reason: deal.lost_reason,
        //     lost_time: deal.lost_time,
        //     // stage: deal.stage.name,
        //     // person: deal.person.name,
        //   };
        // });
        // allDeals.push(...deal);
        // allDeals[key] = deal;
        // allDeals.push(...dealsInPeriod);
        allDeals[key] = dealsInPeriod;
      }

    //   if (periodData.totals) {
    //     // totals[key] = {
    //     //   won_count: periodData.totals.won_count,
    //     //   won_values: periodData.totals.won_values,

    //     // };
    //     totals[key] = periodData.totals;
    //   }
    });

    // return allDeals, totals;

    console.log("All deals:", allDeals);
    // console.log("Totals:", totals);
    return { allDeals, totals };
  } catch (err) {
    const errorToLog = err.context?.body || err;

    console.log("Getting deals failed", errorToLog);
  }
};

const searchDealByName = async (name) => {
  try {
    let apiInstance = new Pipedrive.ItemSearchApi(apiClient);
    const term = name;

    const response = await apiInstance.searchItem(term);
    const item = response.data.items[0].item;
    // const data = response.data;
    // console.log("Search deals by name:", item);
    return item;
  } catch (err) {
    const errorToLog = err.context?.body || err;

    console.log("Getting deals failed", errorToLog);
  }
};

getDeals();
// searchDealByName("#loreal_lanzamiento-campaña-comunicación-interna");

module.exports = {
  getDeals,
  searchDealByName,
};
