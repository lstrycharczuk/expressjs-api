const express = require('express')
require("dotenv").config();


const generateNameRouter = express.Router()

// const names = ["Ala", "Ola", "Kasia", "Basia", "Kaja", "Maja"];
const names = process.env.NAMES.split(", ");

const getRandomName = () => {
    const randomIndex = Math.floor(Math.random() * names.length)
    return names[randomIndex]
};

generateNameRouter.get('/random-name', (req, resp) => {
    resp.json({ message: getRandomName() })
})

module.exports = generateNameRouter