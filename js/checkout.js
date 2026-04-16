/* оформление заказа — показ состава корзины + отправка */

(function () {
    var summaryItems      = document.getElementById('summaryItems');
    var summaryTotal      = document.getElementById('summaryTotal');
    var summaryTotalValue = document.getElementById('summaryTotalValue');

    if (window.cart && window.cart.length > 0) {
        var total = 0;

        summaryItems.innerHTML = window.cart.map(function (item) {
            var sum  = item.price * item.quantity;
            total   += sum;
            return '<div class="order-summary__item">'
                 + '<span>' + item.name + ' × ' + item.quantity + '</span>'
                 + '<span>' + sum.toLocaleString('ru') + ' ₽</span>'
                 + '</div>';
        }).join('');

        summaryTotalValue.textContent = total.toLocaleString('ru') + ' ₽';
        summaryTotal.style.display    = 'flex';
    }
}());

document.getElementById('checkoutForm').addEventListener('submit', function (e) {
    e.preventDefault();

    var name  = document.getElementById('name').value.trim();
    var phone = document.getElementById('phone').value.trim();
    var email = document.getElementById('email').value.trim();

    if (!name)               { alert('Введите имя');             return; }
    if (!phone)              { alert('Введите телефон');          return; }
    if (!email.includes('@')){ alert('Введите корректный email'); return; }

    window.cart = [];
    window.updateCartUI();
    localStorage.setItem('cart', JSON.stringify([]));

    e.target.style.display = 'none';
    document.getElementById('orderSuccess').style.display = 'block';
});
