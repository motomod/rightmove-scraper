require("dotenv").config();
const fs = require("fs");
const chalk = require("chalk");
const request = require("sync-request");
const diff = require("fast-array-diff");
require("console-stamp")(console, "HH:MM:ss.l");

process.on("uncaughtException", function (exception) {
  fs.appendFileSync("exception.log", JSON.stringify(exception)+"\n");
  console.log(exception);
});

const storage = "./storage/";

if (!fs.existsSync(storage)){
    fs.mkdirSync(storage);
}

const scraper = require("./scraper/rightmove/index.js");
        
let houseFilesSeen = [];

const processHouses = (houses) => {
        for (const propertyId in houses) {
            let house = houses[propertyId];
            let filename = storage+propertyId+".json";
            let message = "";

            if (fs.existsSync(filename)) {
                console.log(chalk.blue("Seen house before: "+house.slug));
                const oldHouse = JSON.parse(fs.readFileSync(filename, "utf8"));

                if (oldHouse.kill === true) {
                    continue;
                }

                if (JSON.stringify(oldHouse) !== JSON.stringify(house)) {
                    if (oldHouse.price !== house.price) {
                        console.log(chalk.greenBright("House price changed: "+house.slug));
                        message = "House price changed "+oldHouse.price+" -> "+house.price;
                    }

                    if (oldHouse.status !== house.status) {
                        if (house.status === "Sold STC") {
                            console.log(chalk.red("House sold: "+house.slug));
                            message = "House sold";
                        } else if (house.status === "For sale") {
                            console.log(chalk.greenBright("House house has returned: "+house.slug));
                            message = "House has returned";
                        }
                    }
                }
            } else {
                console.log(chalk.yellow("Not seen this house before: "+house.slug));

                if (house.status === "Sold STC") {
                    console.log(chalk.redBright("House returned but sold (?): "+house.slug));
                    message = "";
                } else {
                    console.log(chalk.greenBright("New house: "+house.slug));
                    message = "New house";
                }
            }

            if (message !== "") {
                sendMessage(message, house);
            }

            house.missingCount = 0;
            fs.writeFileSync(filename, JSON.stringify(house));
            houseFilesSeen.push(propertyId+".json");
        }
    };

const processMissingHouses = (houseFilesSeen) => {
    let houseFilesStored = [];
    fs.readdirSync(storage).forEach(file => {
        houseFilesStored.push(file);
    });

    let changes = diff.diff(houseFilesStored.sort(), houseFilesSeen.sort());

    for (let missingPropertyJsonLocation of changes.removed) {
        let house = JSON.parse(fs.readFileSync(storage+missingPropertyJsonLocation, "utf8"));

        if (house.missingCount >= 100) {
            console.log(chalk.yellow("House "+house.slug+" removed"));
            fs.unlinkSync(storage+missingPropertyJsonLocation);

            if (house.status === "For sale") {
                sendMessage("House removed", house);
            }
        } else {
            house.missingCount = house.missingCount + 1;

            console.log(chalk.yellow("House "+house.slug+" not seen "+house.missingCount+" time(s)"));

            fs.writeFileSync(storage+missingPropertyJsonLocation, JSON.stringify(house));
        }
    }
};

const sendMessage = (message, house) => {
    if (!process.env.PUSHOVER_USER) {
        return;
    }

    let msg = {
        user: process.env.PUSHOVER_USER,
        token: process.env.PUSHOVER_TOKEN,
        message: house.url,
        title: message+" - "+house.slug+" - "+house.price,
    };

    request("POST", "https://api.pushover.net/1/messages.json", {
        json: msg,
        headers: {"Content-Type": "application/json"}
    }); 
};

while (true) { //eslint-disable-line no-constant-condition
    scraper(processHouses);
    processMissingHouses(houseFilesSeen);
    houseFilesSeen = [];
}

