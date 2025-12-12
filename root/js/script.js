const table = document.getElementById('scheduleTable');

// Загрузка данных при старте
window.onload = function() {
    const savedData = localStorage.getItem('stretchSchedule');
    if (savedData) {
        table.innerHTML = savedData;
        attachEvents(); // Переподключаем слушатели событий к загруженным ячейкам
    } else {
        attachEvents();
    }
};

// Функция сохранения
function saveData() {
    localStorage.setItem('stretchSchedule', table.innerHTML);
    
    // Визуальное подтверждение
    const btn = document.getElementById('saveBtn');
    const originalText = btn.innerText;
    btn.innerText = "Готово!";
    setTimeout(() => btn.innerText = originalText, 1000);
}

// Подключение событий к ячейкам (чтобы сохранялось при потере фокуса)
function attachEvents() {
    const cells = document.querySelectorAll('[contenteditable="true"]');
    cells.forEach(cell => {
        // Удаляем старые слушатели перед добавлением новых, чтобы не дублировать
        cell.removeEventListener('blur', saveData); 
        cell.addEventListener('blur', saveData);
    });
}

// Добавить строку
function addRow() {
    const tbody = table.querySelector('tbody');
    // Если tbody нет (таблица пустая), создаем его
    const targetBody = tbody || table.appendChild(document.createElement('tbody'));
    
    // Получаем количество столбцов (по заголовку)
    const colsCount = table.querySelector('thead tr').cells.length;
    
    const newRow = document.createElement('tr');
    
    for (let i = 0; i < colsCount; i++) {
        const newCell = document.createElement('td');
        newCell.contentEditable = "true";
        newCell.addEventListener('blur', saveData);
        newRow.appendChild(newCell);
    }
    targetBody.appendChild(newRow);
    saveData();
}

// Добавить столбец
function addCol() {
    const rows = table.rows;
    for (let i = 0; i < rows.length; i++) {
        const cell = i === 0 ? document.createElement('th') : document.createElement('td');
        cell.contentEditable = "true";
        if(i === 0) cell.innerText = "Нов.";
        cell.addEventListener('blur', saveData);
        rows[i].appendChild(cell);
    }
    saveData();
}

// Удалить последнюю строку
function removeRow() {
    const rowCount = table.rows.length;
    // Оставляем хотя бы 2 строки (заголовок + 1 строка), чтобы таблица не исчезла совсем
    if (rowCount > 2) { 
        table.deleteRow(rowCount - 1);
        saveData();
    } else {
        alert("Нельзя удалить последнюю строку! Лучше просто очистите текст.");
    }
}

// Удалить последний столбец
function removeCol() {
    const rows = table.rows;
    // Проверка, чтобы не удалить единственный столбец
    if (rows[0].cells.length > 1) {
        for (let i = 0; i < rows.length; i++) {
            rows[i].deleteCell(-1);
        }
        saveData();
    } else {
        alert("Нельзя удалить последний столбец!");
    }
}

// Полный сброс таблицы
function resetTable() {
    if(confirm("Вы уверены, что хотите стереть всё и вернуть стандартную таблицу?")) {
        localStorage.removeItem('stretchSchedule');
        location.reload();
    }
}
