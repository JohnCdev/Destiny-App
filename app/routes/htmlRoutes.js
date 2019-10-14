const path = require("path");

module.exports = app => {

    app.get("/", (req, res) => {
        res.render("index", ({
            called: false,
            thing1: "thingy1",
            thing2: "thingy2"
        }));
    });
};
