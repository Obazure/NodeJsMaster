const config = require('../../config/config')

module.exports = function (to, token) {
    const url = `${config.BASE_URL}/auth/password/${token}`
    return {
        to: to,
        from: config.EMAIL_FROM,
        subject: 'Reset password',
        text: `To set new password please open link ${url}`,
        html: `To set new password please click <a href="${url}">link</a>.`
    }
}