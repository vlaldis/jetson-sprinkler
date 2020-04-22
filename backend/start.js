const {spawn} = require('child_process');
const express = require('express')
const app = express()

const port = 6001

app.get('/', (req, res) => res.send('Hello World!'))

app.listen(port, () => console.log(`jetson-sprinkler backend listening at http://localhost:${port}`))