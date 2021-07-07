const Browser = require("../browser/browser")
const jsdom = require("jsdom")
const { JSDOM } = jsdom

class Kinopoisk{

    constructor(url) {
        this.url = url
    }

    static async getInfo(){
        const domHtml = await Browser.getHtml(this.url)
        const dom = new JSDOM(domHtml);

        if(dom.window.document.querySelector('.Text_typography_control-xxl')){
            console.log(dom.window.document.querySelector('body').textContent)
            return {
                'error': 'Yandex has turned on the anti-robot'
            }
        }

        const encyclopedia = this.parseEncyclopedia(dom.window.document.querySelectorAll('.styles_row__2ee6F'))
        const actors = this.parseName(dom.window.document.querySelector('.styles_actors__2zt1j')
            .querySelectorAll('.styles_root__-coRa '))

        return {
            'name': dom.window.document.querySelector('h1').textContent,
            'originalName': dom.window.document.querySelector('.styles_originalTitle__31aMS').textContent,
            'description': dom.window.document.querySelector('p.styles_paragraph__2Otvx').textContent,
            'actors': actors,
            'rate': {
                'kinopoisk': dom.window.document.querySelector('a.film-rating-value').textContent,
                'kinopoiskCount': dom.window.document.querySelector(' .styles_count__3hSWL').textContent,
                'imdb': (dom.window.document.querySelector('span.styles_valueSection__19woS').textContent).split(' ')[1],
                'imdbCount': dom.window.document.querySelector('.styles_count__3hSWL').textContent,
            },

            'encyclopedia': encyclopedia,

        }

    }
    static parseEncyclopedia(node){
        const encyclopedia = []
        node.forEach((el) => {
            encyclopedia.push({
                'name':  el.querySelector('.styles_title__a0_0F').textContent,
                'value': el.querySelector('.styles_value__2F1uj').textContent,
            })
        })
        return encyclopedia
    }

    static parseName(node){
        const name = []
        node.forEach((el) => {
            name.push({
                'name':  el.querySelector('a.styles_link__1dkjp').textContent,
                'link': el.querySelector('a.styles_link__1dkjp').getAttribute('href'),
            })
        })
        return name

    }
}


module.exports = Kinopoisk
