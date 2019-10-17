const express = require("express");
const ehb = require("express-handlebars");

const app = express();

const PORT = process.argv.PORT || 8080;

app.use(express.static("public"));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
require("./routes/apiRoutes")(app);
require("./routes/htmlRoutes")(app);

app.engine("handlebars", ehb({ defaultLayout: "main" }));
app.set("view engine", "handlebars");

app.listen(PORT, function () {
    console.log("Server listening on: http://localhost:" + PORT);
}); 