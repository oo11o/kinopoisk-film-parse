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

        return {
            'name': dom.window.document.querySelector('h1').textContent,
            'originalName': dom.window.document.querySelector('.styles_originalTitle__31aMS').textContent,
            'description': dom.window.document.querySelector('p.styles_paragraph__2Otvx').textContent,
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
}


module.exports = Kinopoisk
