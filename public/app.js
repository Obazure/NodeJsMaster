document.querySelectorAll('.price').forEach(node => {
    node.textContent = new Intl.NumberFormat('en-US', {
        currency: 'eur',
        style: 'currency'
    }).format(node.textContent)
})

const $card = document.querySelector('#card')
if ($card) {
    $card.addEventListener('click', event => {
        if (event.target.classList.contains('cart-course-remove')) {
            const id = event.target.dataset.id
            fetch(`/cart/${id}`, {
                method: 'delete'
            })
                .then(res => res.json())
                .then(card => {
                    console.log(card)
                })
        }
    })
}