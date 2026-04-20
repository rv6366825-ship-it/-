/* галерея — фильтрация и рендер */

var photos = [
    { src: 'https://images.pexels.com/photos/1648377/pexels-photo-1648377.jpeg?auto=compress&cs=tinysrgb&w=600', cat: 'family',   label: 'Семейная'   },
    { src: 'https://images.pexels.com/photos/1586973/pexels-photo-1586973.jpeg?auto=compress&cs=tinysrgb&w=600', cat: 'family',   label: 'Семейная'   },
    { src: 'https://images.pexels.com/photos/3014856/pexels-photo-3014856.jpeg?auto=compress&cs=tinysrgb&w=600', cat: 'portrait', label: 'Портретная' },
    { src: 'https://images.pexels.com/photos/733872/pexels-photo-733872.jpeg?auto=compress&cs=tinysrgb&w=600',   cat: 'portrait', label: 'Портретная' },
    { src: 'https://images.pexels.com/photos/1024993/pexels-photo-1024993.jpeg?auto=compress&cs=tinysrgb&w=600', cat: 'wedding',  label: 'Свадебная'  },
    { src: 'https://images.pexels.com/photos/3755755/pexels-photo-3755755.jpeg?auto=compress&cs=tinysrgb&w=600', cat: 'wedding',  label: 'Свадебная'  },
    { src: 'https://images.pexels.com/photos/842876/pexels-photo-842876.jpeg?auto=compress&cs=tinysrgb&w=600',   cat: 'object',   label: 'Предметная' },
    { src: 'https://images.pexels.com/photos/265722/pexels-photo-265722.jpeg?auto=compress&cs=tinysrgb&w=600',   cat: 'object',   label: 'Предметная' },
];

var grid      = document.getElementById('galleryGrid');
var btns      = document.querySelectorAll('#galleryFilter .filter-btn');
var activeFilter = 'all';

function render() {
    var list = activeFilter === 'all' ? photos : photos.filter(function (p) { return p.cat === activeFilter; });
    grid.innerHTML = list.map(function (p) {
        return '<div class="gallery-item">'
             + '<img src="' + p.src + '" alt="' + p.label + '" loading="lazy">'
             + '<span class="gallery-item__cat">' + p.label + '</span>'
             + '</div>';
    }).join('');
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
