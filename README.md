# Rightmove scraper/bot

In 2021 I was searching for a property. The market was very competitive and we missed out on properties by hours, the Rightmove notifications weren't fast enough.

Given a rightmove URL (containing all of your search params) this bot will loop through all of the properties and send out notifications whenever:

- A new property is listed
- A previously sold property is available again
- A property is sold
- A property's price changes

## Requirements

- NodeJS v12 >
- Yarn

## Configuration

Ensure that the following fields are set in the `.env` file:

- `RIGHTMOVE_URL` - Simply copy and paste the URL from Rightmove after you've specified your search options. The URL must contain the 'index' parameter and it must be set to 0.
- `PUSHOVER_USER` - Pushover username.
- `PUSHOVER_TOKEN` - Pushover token.

## Running

`yarn install && yarn start`