const PORT = 8000
const express = require('express')
const axios = require('axios')
const cheerio = require('cheerio')
const {response} = require("express");
const articles = []
const newspapers = [

    {
        name:'thetimes',
        address: 'https://www.thetimes.co.uk/topic/bitcoin',
        base: ''
    },
    {
        name:'telegraph',
        address: 'https://www.telegraph.co.uk/cryptocurrency/',
        base: 'https://www.telegraph.co.uk'

    },
    {
        name:'theguardian',
        address: 'https://www.theguardian.com/technology/cryptocurrencies',
        base: ''

    },

]
newspapers.forEach(newspaper => {
    axios.get(newspaper.address).then(response => {
        const html = response.data
        const $ = cheerio.load(html)
        $('a:contains("crypto")', html).each(function () {
            const title = $(this).text()
            const url = $(this).attr('href')
            articles.push({
                title,
                url:  newspaper.base+url,
                source: newspaper.name
            })
        })
    })
})
const app = express();
app.get('/',(req,res)=>{
    res.json('Wecome to my Crypto News API')
})
app.get('/news',(req,res)=> {
res.json(articles)
})
app.get('/news/:newspaperId', async(req,res)=> {
    const newspaperId = req.params.newspaperId
    const newsPaperAddress = newspapers.filter(newspaper => newspaper.name == newspaperId)[0].address
    const newsPaperBase = newspapers.filter(newspaper => newspaper.name == newspaperId)[0].base

axios.get(newsPaperAddress)
    .then(response => {
    const html = response.data
    const $ = cheerio.load(html)
    const specificArticles = []
    $('a:contains("crypto")', html).each(function () {
        const title = $(this).text()
        const url = $(this).attr('href')
        specificArticles.push({
            title,
            url:  newsPaperBase+url,
            source: newspaperId
        })
    })
        res.json(specificArticles)
    }).catch(err => console.log(err))
})
app.listen(PORT, ()=> console.log(`server running on PORT ${PORT}`))