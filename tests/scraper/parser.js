const mocha = require("mocha");
const describe = mocha.describe;
const it = mocha.it;

const assert = require("assert");
const parser = require("../../scraper/rightmove/parser.js");
const fs = require("fs");

describe("Rightmove scraper - parser", function() {
  it("Can convert webpage into house objects", function() {
    let page = fs.readFileSync(__dirname+"/responses/good.html", "utf8");

    let houses = parser.pageToHouses(page);

    assert.strictEqual(Object.keys(houses).length, 5);
  });
});
