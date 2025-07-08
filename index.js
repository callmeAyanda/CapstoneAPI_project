import express from "express";
import ejs from "ejs";
import bodyParser from "body-parser";
import axios from "axios";
import { dirname, join } from "path";
import { fileURLToPath } from "url";
import { apiKey } from "./config.js";


const app = express();
const port = 3000;

const __dirname = dirname(fileURLToPath(import.meta.url));

app.set("views", join(__dirname, "views"));
app.use(express.static(join(__dirname, "public")));


// -26.280311792158034, 27.8557585784628

app.set("view engine", "ejs");
app.use(bodyParser.urlencoded({ extended: true }));


app.get("/", (req, res) => {
    res.render("index.ejs", { weather: null, error: null });
});

app.post("/weather", async (req, res) => {
    const { city_name } = req.body;

    try {
        const response = await axios.get(`https://api.openweathermap.org/data/2.5/weather?q=${city_name}&appid=${apiKey}`);
        const weatherData = response.data;

        const extractedData = {
            description: weatherData.weather[0].description,
            temp: (weatherData.main.temp - 273.15).toFixed(2), // Convert Kelvin to Celsius
            humidity: weatherData.main.humidity,
            windSpeed: weatherData.wind.speed,
            country: weatherData.sys.country,
            name: weatherData.name
        };
        
        res.render("index.ejs", { weather: extractedData, error: null });

    } catch (error) {
        console.error("Error fetching weather data:", error);
        res.render("index.ejs", { weather: null, error: "Could not retrieve weather data. Check your city name or try again later." });
    }
});

app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});
