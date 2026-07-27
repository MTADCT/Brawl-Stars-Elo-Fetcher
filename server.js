require("dotenv").config();

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
            `https://api.brawlstars.com/v1/players/%23${tag}`,
            {
                headers: {
                    Authorization: `Bearer ${process.env.BRAWL_API_TOKEN}`
                }
            }
        );

        const player = response.data;

        res.setHeader("Access-Control-Allow-Origin", "*");

        res.json({
            current: player.rankedElo ?? null,
            highest: player.highestAllTimeRankedElo ?? null,

            currentRank: player.rankedRankName ?? null,
            highestRank: player.highestAllTimeRankedRankName ?? null,

            currentBadge: player.rankedRank ?? null,
            highestBadge: player.highestAllTimeRankedRank ?? null
        });

    } catch (err) {
        res.setHeader("Access-Control-Allow-Origin", "*");
        console.error(err.response?.status);
        console.error(err.response?.headers);
        console.error(err.response?.data);

        res.status(500).json({
            error: err.message
        });
    }
});

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
