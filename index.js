const Kinopoisk = require('./parse/kinopoisk')

async function start(url){
    Kinopoisk.url = url
     const res = await Kinopoisk.getInfo()
     console.log(res)
}

start('https://www.kinopoisk.ru/film/775273/')