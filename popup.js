// Получаем элементы из DOM
const sizeInput = document.getElementById('size');
const colorInput = document.getElementById('color');
const colorPicker = document.getElementById('colorPicker');
const toggleBtn = document.getElementById('toggleBtn');
let showingElements = false;

// Восстановление сохраненных данных из Local Storage
function loadSavedSettings() {
    const savedSize = localStorage.getItem('borderSize');
    const savedColor = localStorage.getItem('borderColor');
    const savedState = localStorage.getItem('showingElements');

    if (savedSize) {
        sizeInput.value = savedSize;
    }

    if (savedColor) {
        colorInput.value = savedColor;
        colorPicker.value = savedColor;
    }

    if (savedState === "true") {
        showingElements = true;
        toggleBtn.classList.remove("showElements");
        toggleBtn.classList.add("hideElements");
        toggleBtn.textContent = "Hide borders";
        applyBorders();
    }
}

// Функция для добавления нового стиля
function addCustomStyle(size, color) {
    let styleElement = document.getElementById('custom-css-style');
    if (styleElement) {
        styleElement.remove();
    }

    styleElement = document.createElement('style');
    styleElement.id = 'custom-css-style';
    styleElement.type = 'text/css';
    const cssRule = `* { outline: ${size}px solid ${color} !important; }`;
    styleElement.appendChild(document.createTextNode(cssRule));
    document.head.appendChild(styleElement);
}

// Функция для удаления стиля
function removeCustomStyle() {
    const styleElement = document.getElementById('custom-css-style');
    if (styleElement) {
        styleElement.remove();
    }
}

// Функция для включения/обновления границ
function applyBorders() {
    if (showingElements) {
        const sizeValue = sizeInput.value || sizeInput.placeholder;
        const colorValue = colorInput.value || colorInput.placeholder;

        // Сохранение текущих значений в Local Storage
        localStorage.setItem('borderSize', sizeValue);
        localStorage.setItem('borderColor', colorValue);

        chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
            chrome.scripting.executeScript({
                target: { tabId: tabs[0].id },
                func: addCustomStyle,
                args: [sizeValue, colorValue]
            });
        });
    }
}

// Обработчик для переключения кнопки
function toggleBorders() {
    if (!showingElements) {
        // Включаем границы
        showingElements = true;
        localStorage.setItem('showingElements', "true"); // Сохраняем состояние
        toggleBtn.classList.remove("showElements");
        toggleBtn.classList.add("hideElements");
        toggleBtn.textContent = "Hide borders";
        applyBorders();
    } else {
        // Отключаем границы
        showingElements = false;
        localStorage.setItem('showingElements', "false"); // Сохраняем состояние
        toggleBtn.classList.remove("hideElements");
        toggleBtn.classList.add("showElements");
        toggleBtn.textContent = "Show borders";

        chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
            chrome.scripting.executeScript({
                target: { tabId: tabs[0].id },
                func: removeCustomStyle
            });
        });
    }
}

// Привязка событий к кнопке
toggleBtn.addEventListener('click', toggleBorders);

// Автоматическое обновление при изменении значений инпутов или выборе цвета
sizeInput.addEventListener('input', applyBorders);
colorInput.addEventListener('input', applyBorders);
colorPicker.addEventListener('input', () => {
    colorInput.value = colorPicker.value; // Синхронизируем с полем HEX
    applyBorders(); // Применяем новые настройки
    localStorage.setItem('borderColor', colorPicker.value); // Сохраняем цвет
});

// Функция для обновления значения инпута color по клику на квадрат
function updateColorInput(event) {
    const square = event.target;
    const color = square.style.backgroundColor;
    colorInput.value = color; // Обновляем значение инпута
    colorPicker.value = rgbToHex(color); // Обновляем значение в colorPicker
    applyBorders(); // Автоматически применяем изменения
    localStorage.setItem('borderColor', rgbToHex(color)); // Сохраняем цвет
}

// Конвертер RGB в HEX
function rgbToHex(rgb) {
    const result = /^rgb\((\d+),\s*(\d+),\s*(\d+)\)$/.exec(rgb);
    return result ? "#" + result.slice(1).map(x => {
        const hex = parseInt(x).toString(16);
        return hex.length === 1 ? "0" + hex : hex;
    }).join('') : rgb;
}

// Получаем все квадраты и добавляем к ним обработчики событий
const squares = document.querySelectorAll('.square');
squares.forEach(square => {
    square.addEventListener('click', updateColorInput);
});

// Загрузка сохраненных настроек при загрузке страницы
document.addEventListener('DOMContentLoaded', loadSavedSettings);
