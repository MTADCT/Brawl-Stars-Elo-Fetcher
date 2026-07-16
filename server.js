const express = require("express");
const axios = require("axios");

console.log("SERVER VERSION 2 WITH CORS TEST");

const app = express();

app.use((req, res, next) => {
    res.setHeader("Test-Header", "HELLO_WORLD");
    next();
});

app.use((req, res, next) => {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Methods", "GET, OPTIONS");
    res.header("Access-Control-Allow-Headers", "Content-Type");
    next();
});

app.get("/elo/:tag", async (req, res) => {
    try {
        const tag = req.params.tag;

        const response = await axios.get(
            `https://brawlace.com/players/%23${tag}`
        );

        const html = response.data;

        const currentMatch = html.match(
            /CURRENT[\s\S]*?\((\d+)\)/
        );

        const highestMatch = html.match(
            /HIGHEST[\s\S]*?\((\d+)\)/
        );

        res.setHeader("Access-Control-Allow-Origin", "*");

        res.json({
            current: currentMatch?.[1] || null,
            highest: highestMatch?.[1] || null
        });

    } catch (err) {
        res.setHeader("Access-Control-Allow-Origin", "*");

        res.status(500).json({
            error: err.message
        });
    }
});

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
