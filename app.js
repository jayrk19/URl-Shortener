const express = require("express");
var exphbs = require("express-handlebars");
const mongoose = require("mongoose");
const app = express();
const ShortUrl = require('./models/shorturl')
const port = process.env.PORT || 3000;

mongoose.connect(
  "mongodb+srv://jrk:Ramkamesh01@cluster0.ngoio.mongodb.net/urlshortener?retryWrites=true&w=majority",
  {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  }
);



// express-handlebars
app.engine(
  "handlebars",
  exphbs({
    defaulLayout: "main",
    runtimeOptions: {
      allowProtoPropertiesByDefault: true,

      allowProtoMethodsByDefault: true,
    },
    layoutsDir: "views/layouts",
  })
);
app.set("view engine", "handlebars");

// Bodyparser
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.get("/", async (req, res) => {
  const shortUrls = await ShortUrl.find()
  res.render("home", { shortUrls: shortUrls });
});

app.post("/shortUrls", async (req, res) => {
  await ShortUrl.create({ full: req.body.fullUrl });

  res.redirect("/");
});

app.get("/:shortUrl", async (req, res) => {
  const shortUrl = await ShortUrl.findOne({ short: req.params.shortUrl });
  if (shortUrl == null) return res.sendStatus(404);

  shortUrl.clicks++;
  shortUrl.save();

  res.redirect(shortUrl.full);
});



app.listen(port, () => {
  console.log(`Server runnin' on http://localhost:${port}`);
});