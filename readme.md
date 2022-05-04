## Setup

Download and install node [https://nodejs.org/en/download/](https://nodejs.org/en/download/).

Download and install yarn [https://classic.yarnpkg.com/en/docs/install/#windows-stable](https://classic.yarnpkg.com/en/docs/install/#windows-stable).

Download the correct chromedriver for your Chrome browser and put it in the project root folder [https://chromedriver.chromium.org/downloads](https://chromedriver.chromium.org/downloads).

Run `yarn install` in projects root folder to install dependencies.

## Scripts

All scripts depend on other files which was moved around manually. Be sure the necessary files exists and are located in the correct place before running. 

### `yarn start`

Starts the collection tool. Default configuration will open 16 Chrome windows. May need to make changes in src/app.ts to configure the windows locations.
Other important files for configurations are src/chrome-options.ts and src/constants.ts.

### `yarn combine`

Creates a new file with all top-list ranks for pages within set rank buckets.

### `yarn filter`

If running the tool for several sessions, this script can be used to filter out visited websites before starting the next session.
