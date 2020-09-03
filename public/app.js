const toCurrency = price => {
    return new Intl.NumberFormat('en-US', {
        currency: 'eur',
        style: 'currency'
    }).format(price)
}

const toDate = date => {
    return new Intl.DateTimeFormat('en-US', {
        day: '2-digit',
        month: 'long',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit'
    }).format(new Date(date))
}

const toShortOrderNumber = text => {
    return text.substr(-10)
}

document.querySelectorAll('.price').forEach(node => {
    node.textContent = toCurrency(node.textContent)
})
document.querySelectorAll('.date').forEach(node => {
    node.textContent = toDate(node.textContent)
})
document.querySelectorAll('.order-number').forEach(node => {
    node.textContent = toShortOrderNumber(node.textContent).toString().toUpperCase()
})

const $cart = document.querySelector('#cart')
if ($cart) {
    $cart.addEventListener('click', event => {
        if (event.target.classList.contains('cart-course-remove')) {
            const id = event.target.dataset.id
            const csrf = event.target.dataset.csrf

            fetch(`/cart/${id}`, {
                method: 'delete',
                headers: {
                    'X-XSRF-TOKEN': csrf
                }
            })
                .then(res => res.json())
                .then(cart => {
                    if (cart.courses.length) {
                        const html = cart.courses.map(c => {
                            return `
                                <tr>
                                    <td>${c.title}</td>
                                    <td>${c.count}</td>
                                    <td>
                                        <button class="btn btn-small cart-course-remove" data-id="${c.id}">Remove</button>
                                    </td>
                                </tr>
                            `
                        }).join('')
                        $cart.querySelector('tbody').innerHTML = html
                        $cart.querySelector('.price').textContent = toCurrency(cart.price)
                    } else {
                        $cart.innerHTML = '<p>Cart is empty</p>'
                    }
                })
        }
    })
}

M.Tabs.init(document.querySelectorAll('.tabs'))