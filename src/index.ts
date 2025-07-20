import { PORT } from "./utils/parameters";

require('dotenv').config();

const express = require("express");
const cors = require("cors");

const app = express();
const authRoutes = require("./routes/auth");
const openaiRoutes = require("./routes/openai");
const interestRoutes = require("./routes/interests");
const eventRoutes = require("./routes/events");

app.use(cors())
app.use(express.json())

app.use("/auth-api", authRoutes)
app.use("/openai", openaiRoutes);
app.use("/interests-api", interestRoutes);
app.use("/events-api", eventRoutes);


const port : number = PORT;

app.get('/', (request: any, response: any) => {
    response.send("testing!")
})


app.listen(port, () => {
    console.log(`server runing in port ${port}`);
});