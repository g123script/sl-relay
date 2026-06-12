const express = require("express");
const axios = require("axios");

const app = express();

app.use(express.json());

let huds = {};

// ====================================
// HUD UPDATE
// ====================================

app.post("/update", (req, res) => {

```
const avatar = req.body.avatar;
const url = req.body.url;

if (!avatar || !url)
{
    return res
        .status(400)
        .send("INVALID");
}

huds[avatar] = url;

console.log(
    "UPDATED:",
    avatar,
    url
);

res.send("OK");
```

});

// ====================================
// GET HUD URL
// ====================================

app.get("/get/:avatar", (req, res) => {

```
const avatar =
    req.params.avatar;

if (huds[avatar])
{
    res.send(
        huds[avatar]
    );
}
else
{
    res.send("");
}
```

});

// ====================================
// SEND COMMAND TO MULTIPLE HUDS
// ====================================

app.post("/send", async (req, res) => {

```
const receivers =
    req.body.receivers;

const command =
    req.body.command;

if (
    !receivers ||
    !Array.isArray(receivers) ||
    receivers.length === 0
)
{
    return res
        .status(400)
        .send("NO RECEIVERS");
}

if (!command)
{
    return res
        .status(400)
        .send("NO COMMAND");
}

let sent = 0;

for (const avatar of receivers)
{
    const hudURL =
        huds[avatar];

    if (!hudURL)
    {
        console.log(
            "HUD NOT FOUND:",
            avatar
        );

        continue;
    }

    try
    {
        await axios.post(
            hudURL,
            command,
            {
                headers:
                {
                    "Content-Type":
                    "text/plain"
                },
                timeout: 5000
            }
        );

        sent++;

        console.log(
            "SENT:",
            avatar,
            command
        );
    }
    catch (err)
    {
        console.log(
            "SEND FAILED:",
            avatar,
            err.message
        );

        delete huds[avatar];
    }
}

res.send(
    "SENT TO "
    + sent
    + " RECEIVERS"
);
```

});

// ====================================

const PORT =
process.env.PORT || 3000;

app.listen(PORT, () => {

```
console.log(
    "Relay server running"
);
```

});
