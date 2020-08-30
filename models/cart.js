const uuid = require('uuid')
const path = require('path')
const fs = require('fs')

class Cart {
    constructor(title, price, img) {
        this.title = title
        this.price = price
        this.img = img
        this.id = uuid.v4()
    }

    toJSON() {
        return {
            title: this.title,
            price: this.price,
            img: this.img,
            id: this.id
        }
    }

}

module.exports = Cart