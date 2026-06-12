const express = require(express);
const app = express();

app.use(express.json());

let huds = {};

 HUD update URL
app.post(update, (req, res) = {
    const avatar = req.body.avatar;
    const url = req.body.url;

    huds[avatar] = url;

    console.log(UPDATED, avatar, url);

    res.send(OK);
});

 Sender asks for URL
app.get(getavatar, (req, res) = {
    const avatar = req.params.avatar;

    if (huds[avatar]) {
        res.send(huds[avatar]);
    } else {
        res.send();
    }
});

app.listen(3000, () = {
    console.log(Relay server running);
});
