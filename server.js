const express = require("express");
const axios = require("axios");

const app = express();

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

        const currentRankMatch = html.match(
            /<small>CURRENT<\/small><br><img[^>]*src='([^']+ranked-league-rank-\d+\.png[^']*)'[^>]*\/>\s*([^<(]+)\s*\((\d+)\)/
        );

        const highestRankMatch = html.match(
            /<small>HIGHEST<\/small><br><img[^>]*src='([^']+ranked-league-rank-\d+\.png[^']*)'[^>]*\/>\s*([^<(]+)\s*\((\d+)\)/
        );

        res.setHeader("Access-Control-Allow-Origin", "*");

        res.json({
            current: currentMatch?.[1] || null,
            highest: highestMatch?.[1] || null,

            currentRank: currentRankMatch?.[2]?.trim() || null,
            highestRank: highestRankMatch?.[2]?.trim() || null,

            currentBadgeUrl: currentRankMatch?.[1] || null,
            highestBadgeUrl: highestRankMatch?.[1] || null
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
