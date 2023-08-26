import express, { response } from "express";
import bodyParser from "body-parser";
import fileUpload from "express-fileupload";
import fetch from "node-fetch";

const app = express();
const port = 3000;
const API_URL = "https://api.trace.moe/search";

app.use(express.static('public'));

app.use(fileUpload());

app.use(bodyParser.urlencoded({ extended: true }));

app.get("/", (req,res) => {
    res.render("index.ejs");
})

app.post("/submit", async (req,res) =>{
    try{
        if (!req.files || !req.files.userImage) {
            throw new Error("No file uploaded.");
        }
        const uploadedFile = req.files.userImage;
        const response = await fetch(API_URL, {
        method: "POST",
        body: uploadedFile.data,
        headers: { "Content-type": uploadedFile.mimetype },
      }).then((e) => e.json());
      const animeName = response.result[0].filename;
      const episode = response.result[0].episode;
      const animeImage = response.result[0].image;
      const animeVideo = response.result[0].video;
      res.render("submit.ejs", {animeName, episode, animeImage, animeVideo});

    } catch (error){
        console.error("Failed to make request:", error.message);
        res.render("index.ejs", {
          error: error.message,
        });
    }
    
})

app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
  });
