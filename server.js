require('dotenv').config();

const express = require('express');
const app = express();

app.set("view engine", "ejs");
app.set("views", "views");

const port = process.env.PORT || 3000;

app.get('/', (req, res) => {
    res.render("index")
})

app.listen(port, () => {
    console.log(`Example app listening on port ${port}!`);
});
