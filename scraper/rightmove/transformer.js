module.exports = {
    transform: function (houseElement) {
        let id = houseElement.find(".propertyCard-anchor").attr("id").replace("prop", "");

        if (id === 0) {
            return false;
        }

        const house = {
            "id": id,
            "slug": houseElement.find(".propertyCard-address").text().trim(),
            "price": houseElement.find(".propertyCard-priceValue").text().trim().substring(1),
            "url": "https://rightmove.co.uk"+houseElement.find(".propertyCard-priceLink").attr("href"),
            "status": houseElement.find(".propertyCard-tag .propertyCard-tagTitle").first().text() || "For sale"
        };

        return house;
    }
};
