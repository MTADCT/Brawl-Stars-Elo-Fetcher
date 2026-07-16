const express = require("express");
const axios = require("axios");

const app = express();

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

        res.json({
            current: currentMatch?.[1] || null,
            highest: highestMatch?.[1] || null
        });

    } catch (err) {
        res.status(500).json({
            error: err.message
        });
    }
});

app.listen(3000, () => {
    console.log("Server running");
});