const express = require("express");
const axios = require("axios");

const app = express();
app.use(express.json());

let huds = {};

// HUD register
app.post("/update", (req, res) => {
    const { avatar, url } = req.body;

    if (!avatar || !url) return res.status(400).send("INVALID");

    huds[avatar] = url;

    console.log("UPDATED:", avatar, url);

    res.send("OK");
});

// GET HUD URL
app.get("/get/:avatar", (req, res) => {
    const avatar = req.params.avatar;

    res.send(huds[avatar] || "");
});

// SEND COMMAND
app.post("/send", async (req, res) => {
    const { receivers, command } = req.body;

    if (!Array.isArray(receivers) || receivers.length === 0)
        return res.status(400).send("NO RECEIVERS");

    if (!command)
        return res.status(400).send("NO COMMAND");

    let sent = 0;

    for (const avatar of receivers) {
        const hudURL = huds[avatar];

        if (!hudURL) continue;

        try {
            await axios.post(hudURL, command, {
                headers: { "Content-Type": "text/plain" }
            });

            sent++;
        } catch (e) {
            delete huds[avatar];
        }
    }

    res.send("SENT TO " + sent);
});

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
    console.log("Relay server running");
});
