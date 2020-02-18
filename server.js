'use strict';

const express = require('express');
const app = express();

const dotenv = require('dotenv');
dotenv.config();
const cors = require('cors');
app.use(cors);

const PORT = process.env.PORT || 3003;

app.use(express.static('./public'));

app.listen(PORT, () => console.log(`listening on ${PORT}`));
