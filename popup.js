// Получаем элементы из DOM
const sizeInput = document.getElementById('size');
const colorInput = document.getElementById('color');
//const elementsBtn = document.getElementById('elements_Btn');
//const hideElementsBtn = document.getElementById('hideElements_Btn');
const toggleBtn = document.getElementById('toggleBtn');
var showingElements = false
// Переменная для хранения ссылки на элемент <style>
let customStyleElement = null;

// Функция для добавления нового стиля
function addCustomStyle(size, color) {
    // Проверяем, есть ли уже созданный стиль, и удаляем его
    let styleElement = document.getElementById('custom-css-style');
    if (styleElement) {
        styleElement.remove();
    }

    // Создаем новый элемент <style>
    styleElement = document.createElement('style');
    styleElement.id = 'custom-css-style';
    styleElement.type = 'text/css';

    // Формируем CSS-правило
    const cssRule = `* { outline: ${size}px solid ${color} !important; }`;

    // Добавляем CSS-правило в элемент <style>
    styleElement.appendChild(document.createTextNode(cssRule));

    // Добавляем элемент <style> в <head> документа
    document.head.appendChild(styleElement);
}

// Функция для удаления стиля
function removeCustomStyle() {
    const styleElement = document.getElementById('custom-css-style');
    if (styleElement) {
        styleElement.remove();
    }
}

/*// Добавляем обработчик события на кнопку "Show elements"
elementsBtn.addEventListener('click', () => {
    const sizeValue = sizeInput.value || sizeInput.placeholder;
    const colorValue = colorInput.value || colorInput.placeholder;

    // Инъекция стиля на текущую вкладку
    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
        chrome.scripting.executeScript({
            target: { tabId: tabs[0].id },
            func: addCustomStyle,
            args: [sizeValue, colorValue]
        });
    });
});
*/
// Добавляем обработчик события на кнопку "Show elements"
toggleBtn.addEventListener('click', () => {
    if (showingElements === false) {
        showingElements = true;
        toggleBtn.classList.remove("showElements");
        toggleBtn.classList.add("hideElements");
        toggleBtn.textContent = "Hide borders";
        const sizeValue = sizeInput.value || sizeInput.placeholder;
        const colorValue = colorInput.value || colorInput.placeholder;

        // Инъекция стиля на текущую вкладку
        chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
            chrome.scripting.executeScript({
                target: { tabId: tabs[0].id },
                func: addCustomStyle,
                args: [sizeValue, colorValue]
        });
    });
    }
    else {
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
    console.log(showingElements);
});

// Функция для обновления значения инпута color
function updateColorInput(event) {
    const square = event.target;
    const color = square.style.backgroundColor;
    colorInput.value = color; // Обновляем значение инпута
}

// Получаем все квадраты и добавляем к ним обработчики событий
const squares = document.querySelectorAll('.square');
squares.forEach(square => {
    square.addEventListener('click', updateColorInput);
});