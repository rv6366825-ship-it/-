/* корзина — рендер таблицы */

function renderCart() {
    var container = document.getElementById('cartItems');
    var footer    = document.getElementById('cartFooter');

    if (!window.cart || window.cart.length === 0) {
        container.innerHTML = '<div class="cart-empty"><p>Корзина пуста</p><a href="catalog.html" class="btn btn--accent">Перейти к услугам</a></div>';
        if (footer) footer.style.display = 'none';
        return;
    }

    var total = 0;
    var rows  = '';

    window.cart.forEach(function (item) {
        var sum  = item.price * item.quantity;
        total   += sum;
        rows    += '<tr>'
                 + '<td><strong>' + item.name + '</strong></td>'
                 + '<td>' + item.price.toLocaleString('ru') + ' ₽</td>'
                 + '<td><input type="number" min="1" class="cart-qty" value="' + item.quantity + '" data-id="' + item.id + '"></td>'
                 + '<td><strong>' + sum.toLocaleString('ru') + ' ₽</strong></td>'
                 + '<td><button class="cart-remove" data-id="' + item.id + '">Удалить</button></td>'
                 + '</tr>';
    });

    container.innerHTML = '<table class="cart-table">'
        + '<thead><tr><th>Услуга</th><th>Цена</th><th>Кол-во</th><th>Сумма</th><th></th></tr></thead>'
        + '<tbody>' + rows + '</tbody>'
        + '</table>';

    document.getElementById('cartTotal').textContent = 'Итого: ' + total.toLocaleString('ru') + ' ₽';
    if (footer) footer.style.display = 'flex';

    container.querySelectorAll('.cart-qty').forEach(function (inp) {
        inp.addEventListener('change', function () {
            window.updateCartItemQuantity(inp.dataset.id, parseInt(inp.value));
            renderCart();
        });
    });

    container.querySelectorAll('.cart-remove').forEach(function (btn) {
        btn.addEventListener('click', function () {
            window.removeFromCart(btn.dataset.id);
            renderCart();
        });
    });
}

renderCart();
