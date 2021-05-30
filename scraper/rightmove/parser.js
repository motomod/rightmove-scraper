const cheerio = require("cheerio");
const transformer = require("./transformer.js");
const chalk = require("chalk");

module.exports = {
    pageToHouses: function (page) {
        let houses = {};

        cheerio.load(page)(".propertyCard").each((i, element) => {
            let houseData = cheerio.load(page)(element);
            let house = transformer.transform(houseData);

            if (house !== false && house.id != 0) {
                console.log(chalk.blue("Found: "+house.slug));
                houses[house.id] = house;
            }
        });

        return houses;
    }
};