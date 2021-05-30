const request = require("sync-request");
const chalk = require("chalk");

const parser = require("./parser");
const limit = 24;

module.exports = (callback) => {
    const headers = {"User-Agent": "Mozilla/5.0"};

    let houses = null;
    let start = 0;

    while (houses === null || Object.keys(houses).length >= limit) {
        houses = {};

        let url = process.env.RIGHTMOVE_URL;

        if (start > 0) {
            url = url.replace("index=0", "index="+start);
        }

        start += limit;

        console.log(chalk.dim("Requesting: "+url));
        console.log(chalk.dim("Page: "+start / limit));

        let response = request("GET", url, { headers, retry: true });

        houses = parser.pageToHouses(response.getBody());

        callback(houses);
    }
};
