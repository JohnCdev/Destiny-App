const path = require("path");
const axios = require("axios");
require("dotenv").config();
const keys = require("../../keys");
const sqlite3 = require('sqlite3').verbose();
const manifestPath = path.resolve(__dirname, 'world_sql_content_1960d217da17bc78f49d6a119fadb29b.content')
console.log(manifestPath)
let db = new sqlite3.Database(manifestPath, sqlite3.OPEN_READONLY, (err) => {
    if (err) {
        return console.error(err.message);
    }
    console.log('Connected to the manifest SQlite database.');
});
db.serialize(() => {
    db.each("SELECT name FROM sqlite_master WHERE type='table'",
    //db.each("SELECT json FROM DestinyClassDefinition WHERE id = -639573535",
        (err, row) => {
            if (err) {
                console.error(err.message);
            }
            console.log(row)
        });
});

const d2Header = {
    "X-API-key": keys.destiny.d2key
}
const ppeID = keys.destiny.ppeID;
const ppeWarlock = keys.destiny.ppeWarlock;

module.exports = app => {
    app.get("/api/call", (req, res) => {
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
                const manifestPath = path.resolve(__dirname, 'world_sql_content_1960d217da17bc78f49d6a119fadb29b.content')
                console.log(manifestPath)
                let db = new sqlite3.Database(manifestPath, (err) => {
                    if (err) {
                        return console.error(err.message);
                    }
                    console.log('Connected to the manifest SQlite database.');
                });
                db.serialize(() => {
                    db.each("SELECT json_extract(DestinyRaceDefinition.json, '$') FROM DestinyRaceDefinition, json_tree(DestinyRaceDefinition.json, '$') WHERE json_tree.key = 'hash' AND json_tree.value = 2803282938",
                        (err, row) => {
                            if (err) {
                                console.error(err.message)
                            }
                            console.log(row)
                        });
                });

                return res.json({
                    status: called,
                    firstItem: response.data.Response.equipment.data.items[0].itemHash
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


