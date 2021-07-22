const Kinopoisk = require('./parse/kinopoisk')

async function start(url){
    Kinopoisk.url = url
   // const res = await Kinopoisk.getInfo()
    const similar = await  Kinopoisk.getSimilar()
    console.log(similar)

}

start('https://www.kinopoisk.ru/film/775273/')