import { PORT } from "./utils/parameters";

require('dotenv').config();

const express = require("express");
const cors = require("cors");

const app = express();
const openaiRoutes = require("./routes/openai");
const interestRoutes = require("./routes/interest");

app.use(cors())
app.use(express.json())

app.use('/openai', openaiRoutes);
app.use('/interest', interestRoutes);

const port : number = PORT;

app.get('/', (request: any, response: any) => {
    response.send("testing!")
})


app.listen(port, () => {
    console.log(`server runing in port ${port}`);
});