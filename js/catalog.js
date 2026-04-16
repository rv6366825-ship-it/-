/* каталог услуг — фильтрация и рендер */

document.addEventListener('DOMContentLoaded', function () {

    var services = [
        { id: 's1', name: 'Семейная фотосессия', category: 'family',   price: 2500, img: 'https://images.pexels.com/photos/1648377/pexels-photo-1648377.jpeg?auto=compress&cs=tinysrgb&w=600' },
        { id: 's2', name: 'Портретная съемка',   category: 'portrait', price: 2000, img: 'https://images.pexels.com/photos/3014856/pexels-photo-3014856.jpeg?auto=compress&cs=tinysrgb&w=600' },
        { id: 's3', name: 'Предметная съемка',   category: 'object',   price: 1500, img: 'https://images.pexels.com/photos/842876/pexels-photo-842876.jpeg?auto=compress&cs=tinysrgb&w=600'   },
        { id: 's4', name: 'Свадебная съемка',    category: 'wedding',  price: 4500, img: 'https://images.pexels.com/photos/1024993/pexels-photo-1024993.jpeg?auto=compress&cs=tinysrgb&w=600' },
        { id: 's5', name: 'Семейная прогулка',   category: 'family',   price: 3000, img: 'https://images.pexels.com/photos/1586973/pexels-photo-1586973.jpeg?auto=compress&cs=tinysrgb&w=600' },
        { id: 's6', name: 'Бизнес-портрет',      category: 'portrait', price: 2200, img: 'https://images.pexels.com/photos/733872/pexels-photo-733872.jpeg?auto=compress&cs=tinysrgb&w=600'   },
        { id: 's7', name: 'Съемка товаров',      category: 'object',   price: 1800, img: 'https://images.pexels.com/photos/265722/pexels-photo-265722.jpeg?auto=compress&cs=tinysrgb&w=600'   },
        { id: 's8', name: 'Love Story',           category: 'wedding',  price: 4000, img: 'https://images.pexels.com/photos/3755755/pexels-photo-3755755.jpeg?auto=compress&cs=tinysrgb&w=600' }
    ];

    var grid         = document.getElementById('catalogGrid');
    var btns         = document.querySelectorAll('#catalogFilter .filter-btn');
    var activeFilter = 'all';

    function render() {
        var list = activeFilter === 'all' ? services : services.filter(function (s) { return s.category === activeFilter; });

        grid.innerHTML = list.map(function (s) {
            return '<div class="catalog-card">'
                 + '<img src="' + s.img + '" alt="' + s.name + '" class="catalog-card__img" loading="lazy">'
                 + '<h3 class="catalog-card__title">' + s.name + '</h3>'
                 + '<div class="catalog-card__price">от ' + s.price.toLocaleString('ru') + ' ₽</div>'
                 + '<button class="btn btn--accent add-to-cart"'
                 +   ' data-id="' + s.id + '" data-name="' + s.name + '" data-price="' + s.price + '">'
                 +   'Записаться'
                 + '</button>'
                 + '</div>';
        }).join('');

        grid.querySelectorAll('.add-to-cart').forEach(function (btn) {
            btn.addEventListener('click', function () {
                window.addToCart({ id: btn.dataset.id, name: btn.dataset.name, price: parseInt(btn.dataset.price) });
            });
        });
    }

    btns.forEach(function (btn) {
        btn.addEventListener('click', function () {
            btns.forEach(function (b) { b.classList.remove('active'); });
            btn.classList.add('active');
            activeFilter = btn.dataset.filter;
            render();
        });
    });

    render();
});
