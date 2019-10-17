const path = require("path");
const axios = require("axios");
require("dotenv").config();
const keys = require("../keys");
const sqlite3 = require('sqlite3').verbose();
const manifestPath = path.resolve(__dirname, '../data/db/manifest.content')
const db = new sqlite3.Database(manifestPath, (err) => {
    if (err) {
        return console.error(err.message);
    }
    console.log('Connected to the manifest SQlite database.');
});

const d2Header = {
    "X-API-key": keys.destiny.d2key
}
const ppeID = keys.destiny.ppeID;
const ppeWarlock = keys.destiny.ppeWarlock;

module.exports = app => {
    app.get("/api/character", (req, res) => {
        let called = false;
        //account info
        // axios.get("https://www.bungie.net/Platform/Destiny2/3/Profile/" + ppeID + "/?components=100", {headers: d2Header})
        //     .then(res => {
        //         called = true
        //         console.log(res.data)
        //     })
        //     .catch(err => {
        //         if (err.response) {
        //             console.log(err.response.data);
        //             console.log(err.response.status);
        //             console.log(err.response.headers);
        //         } else if (err.request) {
        //             console.log(err.request);
        //         } else {
        //             console.log("Error", err.message);
        //         }
        //         console.log(err.config);
        //     });

        //character info
        axios.get("https://www.bungie.net/Platform/Destiny2/3/Profile/" + ppeID + "/Character/" + ppeWarlock + "/?components=200", { headers: d2Header })
            .then(response => {
                called = true
                // console.log(response.data.Response)
                return res.json({
                    status: called,
                    totalPlayTime: response.data.Response.character.data.minutesPlayedTotal
                });
            })
            .catch(err => {
                if (err.response) {
                    console.log(err.response.data);
                    console.log(err.response.status);
                    console.log(err.response.headers);
                } else if (err.request) {
                    console.log(err.request);
                } else {
                    console.log("Error", err.message);
                }
                console.log(err.config);
            });
    });

    app.get("/api/items", (req, res) => {
        let called = false;
        //character info
        axios.get("https://www.bungie.net/Platform/Destiny2/3/Profile/" + ppeID + "/Character/" + ppeWarlock + "/?components=205", { headers: d2Header })
            .then(response => {

                called = true
                // console.log(response)
                const firstItemHash = response.data.Response.equipment.data.items[0].itemHash;

                db.serialize(() => {
                    db.each("SELECT json_extract(DestinyInventoryItemDefinition.json, '$') FROM DestinyInventoryItemDefinition, json_tree(DestinyInventoryItemDefinition.json, '$') WHERE json_tree.key = 'hash' AND json_tree.value = " + firstItemHash,
                        (err, row) => {
                            if (err) {
                                console.error(err.message)
                            }
                            const rowParsed = JSON.parse(row['json_extract(DestinyInventoryItemDefinition.json, \'$\')'])
                            const itemName = rowParsed.displayProperties.name
                            return res.json({
                                status: called,
                                firstItem: itemName
                            });
                        });
                });
            })
            .catch(err => {
                if (err.response) {
                    console.log(err.response.data);
                    console.log(err.response.status);
                    console.log(err.response.headers);
                } else if (err.request) {
                    console.log(err.request);
                } else {
                    console.log("Error", err.message);
                }
                console.log(err.config);
            });
    });
}


