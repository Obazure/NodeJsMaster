document.querySelectorAll('.price').forEach(node => {
    node.textContent = new Intl.NumberFormat('en-US', {
        currency: 'eur',
        style: 'currency'
    }).format(node.textContent)
})