const Browser = require("../browser/browser")
const jsdom = require("jsdom")
const {JSDOM} = jsdom

class Kinopoisk {

    constructor(url) {
        this.url = url,
            this.dom = ''
    }

    static async getSimilar() {
        const domHtml = await Browser.getHtml(this.url + '/like')
        const dom = new JSDOM(domHtml);

        const result = []

        const similar = dom.window.document.querySelectorAll('.news')
        similar.forEach((el) => {
            result.push({
                'name': el.querySelector('a').textContent,
                'url': el.querySelector('a').getAttribute('href')
            })
        })
        return result
    }

    static async getInfo() {
        const domHtml = await Browser.getHtml(this.url)
        const dom = new JSDOM(domHtml);
        this.dom = dom

        if (dom.window.document.querySelector('.Text_typography_control-xxl')) {
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
            'originalName': this.checkContent('.styles_originalTitle__31aMS'),
            'description': dom.window.document.querySelector('p.styles_paragraph__2Otvx').textContent,
            'actors': actors,
            'poster': dom.window.document.querySelector('.film-poster').getAttribute('src'),
            'rate': {
                'kinopoisk': this.checkContent('a.film-rating-value'),
                'kinopoiskCount': this.checkContent(' .styles_count__3hSWL'),
                'imdb': this.checkContent('span.styles_valueSection__19woS').split(' ')[1],
                'imdbCount': this.checkContent('.styles_count__gelnz')
            },

            'encyclopedia': encyclopedia,

        }

    }

    static parseEncyclopedia(node) {
        const encyclopedia = []
        node.forEach((el) => {
            encyclopedia.push({
                'name': el.querySelector('.styles_title__a0_0F').textContent,
                'value': el.querySelector('.styles_value__2F1uj').textContent,
            })
        })
        return encyclopedia
    }

    static parseName(node) {
        const name = []
        node.forEach((el) => {
            name.push({
                'name': el.querySelector('a.styles_link__1dkjp').textContent,
                'link': el.querySelector('a.styles_link__1dkjp').getAttribute('href'),
            })
        })
        return name

    }

    static checkContent(selector) {
        let result = ''

        try {
            result = this.dom.window.document.querySelector(selector).textContent
        } catch {
            result = ''
        }

        return result
    }

}


module.exports = Kinopoisk
