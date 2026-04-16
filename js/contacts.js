/* контакты — форма обратной связи */

document.getElementById('callbackForm').addEventListener('submit', function (e) {
    e.preventDefault();

    var name  = document.getElementById('cbName').value.trim();
    var phone = document.getElementById('cbPhone').value.trim();

    if (!name || !phone) {
        alert('Заполните имя и телефон');
        return;
    }

    e.target.querySelectorAll('input, textarea, button[type=submit]').forEach(function (el) {
        el.disabled = true;
    });

    document.getElementById('cbSuccess').style.display = 'block';
});
