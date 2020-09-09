restvo-site
==========

Repo for the restvo.com site.

## Local Build

1. Run `npm install`
2. Run `npm start` (after the first run, this is the only step needed)


## Third Party Libraries

3rd part libraries should be concatenated into the site bundle by adding them via package.json and specifying what files to include in the `assets/3rd-party-libs.json` file. 


## Deploy

Changes to master are automatically deployed to  [dev.restvo.com/](https://dev.restvo.com/). Periodically, the Restvo team will inspect staging and promote it to [restvo.com](https://restvo.com).
