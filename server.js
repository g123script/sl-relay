const express = require("express");
const axios = require("axios");

const app = express();

app.use(express.json());

let huds = {};

// ====================================
// HUD UPDATE
// ====================================

app.post("/update", (req, res) => {
const avatar = req.body.avatar;
const url = req.body.url;

```
huds[avatar] = url;

console.log("UPDATED:", avatar, url);

res.send("OK");
```

});

// ====================================
// GET HUD URL
// ====================================

app.get("/get/:avatar", (req, res) => {
const avatar = req.params.avatar;

```
if (huds[avatar]) {
    res.send(huds[avatar]);
} else {
    res.send("");
}
```

});

// ====================================
// DIRECT SEND
// ====================================

app.post("/send", async (req, res) => {
const avatar = req.body.avatar;
const command = req.body.command;

```
const hudURL = huds[avatar];

if (!hudURL) {
    return res.status(404).send("HUD NOT FOUND");
}

try {
    const result = await axios.post(
        hudURL,
        command,
        {
            headers: {
                "Content-Type": "text/plain"
            },
            timeout: 5000
        }
    );

    console.log(
        "SENT:",
        avatar,
        command
    );

    res.send("OK");
}
catch (err)
{
    console.log(
        "SEND FAILED:",
        avatar,
        err.message
    );

    delete huds[avatar];

    res.status(500).send(
        "SEND FAILED"
    );
}
```

});

const PORT =
process.env.PORT || 3000;

app.listen(PORT, () => {
console.log(
"Relay server running"
);
});
