const express = require("express");
const app = express();

app.use(express.json());

// STORE HUDS (temporary memory)
const huds = {};

app.post("/update", (req, res) => {
    const avatar = req.body.avatar;
    const url = req.body.url;

    if (!avatar || !url) {
        return res.status(400).send("INVALID");
    }

    huds[avatar] = url;

    console.log("UPDATED:", avatar, url);

    res.send("OK");
});

app.get("/get/:avatar", (req, res) => {
    const avatar = req.params.avatar;

    if (huds[avatar]) {
        res.send(huds[avatar]);
    } else {
        res.send("");
    }
});

app.post("/send", (req, res) => {

    console.log("SEND BODY:");
    console.log(req.body);

    res.send("OK");
});

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
    console.log("Relay server running");
});
