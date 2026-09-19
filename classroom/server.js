const express = require("express");

const app = express();

const cookieParser = require("cookie-parser");
const flash = require("connect-flash");

app.use(cookieParser("secretcode"));

//send signed cookie

app.get("/getsignedcookie", (req, res) => {

    res.cookie("greet", "namaste", { signed: true });

    res.cookie("madeIn", "India", { signed: true });

    res.send("signed cookies send");

});

//verify signed cookie

app.get("/verify", (req, res) => {

    console.log(req.signedCookies);

    res.send("verified");

});

app.listen(3000, () => {

    console.log("server is listening on port 3000");

});