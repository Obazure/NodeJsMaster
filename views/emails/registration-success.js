const config = require('../../config/config')

module.exports = function (to) {
    return {
        to: to,
        from: config.EMAIL_FROM,
        subject: 'User is registered',
        text: 'Text: do curses now.',
        html: '<strong>HTML:</strong> do curses now.'
    }
}