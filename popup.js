// Получаем элементы из DOM
const sizeInput = document.getElementById('size');
const colorInput = document.getElementById('color');
const toggleBtn = document.getElementById('toggleBtn');
let showingElements = false;

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
        toggleBtn.classList.remove("showElements");
        toggleBtn.classList.add("hideElements");
        toggleBtn.textContent = "Hide borders";
        applyBorders();
    } else {
        // Отключаем границы
        showingElements = false;
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

// Функция для обновления значения инпута color по клику на квадрат
function updateColorInput(event) {
    const square = event.target;
    const color = square.style.backgroundColor;
    colorInput.value = color; // Обновляем значение инпута
    applyBorders(); // Автоматически применяем изменения
}

// Получаем все квадраты и добавляем к ним обработчики событий
const squares = document.querySelectorAll('.square');
squares.forEach(square => {
    square.addEventListener('click', updateColorInput);
});