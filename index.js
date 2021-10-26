const PORT = 8000
const express = require('express')
const axios = require('axios')
const cheerio = require('cheerio')
const articles = []
const app = express();
app.get('/',(req,res)=>{
    res.json('Wecome to my Crypto News API')
})
app.get('/news',(req,res)=>{
axios.get('https://www.theguardian.com/technology/cryptocurrencies').then((response)=>{
    const html = response.data
    const $ = cheerio.load(html)
    $('a:contains("crypto")', html).each(function(){
        const title = $(this).text()
        const url = $(this).attr('href')
        articles.push({
            title,
            url
        })
    })
    res.json(articles)
}).catch((err) => console.log(err))})
app.listen(PORT, ()=> console.log(`server running on PORT ${PORT}`))