/// !!! Менеджер анимаций !!!
class AnimationManager {
    constructor() {
        this.animationsEnabled = true;
        this.switchElement = document.querySelector('.switch input[type="checkbox"]');
        this.init();
    }
    
    init() {
        // Устанавливаем начальное состояние
        this.updateAnimationsState();
        
        // Слушаем изменения переключателя
        this.switchElement.addEventListener('change', () => {
            this.toggleAnimations();
        });
    }
    
    toggleAnimations() {
        this.animationsEnabled = this.switchElement.checked;
        this.updateAnimationsState();
    }
    
    updateAnimationsState() {
        if (this.animationsEnabled) {
            document.documentElement.classList.remove('no-animations');
            document.documentElement.style.setProperty('--animations-enabled', '1');
        } else {
            document.documentElement.classList.add('no-animations');
            document.documentElement.style.setProperty('--animations-enabled', '0');
        }
    }
    
    // Метод для проверки, включены ли анимации (можно использовать в других классах)
    areAnimationsEnabled() {
        return this.animationsEnabled;
    }
}




// !!! Смена валюты !!!
function setupSwapButton(animationManager) {
    document.getElementById('swapButton').addEventListener('click', function() {
        const mainText = document.getElementById('mainText');
        const blurText = document.getElementById('blurText');
        const blurButton = document.getElementById('blurButton');
        const inputCurrency = document.getElementById('inputCurrency');
        const inputCurrencyBlur = document.getElementById('inputCurrencyBlur');
        const outputCurrency = document.getElementById('outputCurrency');
        const outputCurrencyBlur = document.getElementById('outputCurrencyBlur');
        const actionBtn = this;

    if (window.currencyConverter) {
        window.currencyConverter.toggleConversionDirection();
    }

    if (!animationManager.areAnimationsEnabled()) {
            // Без анимации - сразу меняем содержимое
            const tempContent = mainText.textContent;
            mainText.textContent = actionBtn.textContent;
            blurText.textContent = actionBtn.textContent;
            actionBtn.textContent = tempContent;
            blurButton.textContent = tempContent;

            const tempContentCurrency = inputCurrency.textContent;
            inputCurrency.textContent = outputCurrency.textContent;
            inputCurrencyBlur.textContent = outputCurrency.textContent;
            outputCurrency.textContent = tempContentCurrency;
            outputCurrencyBlur.textContent = tempContentCurrency;
            return;
        }
    
    // 1. Плавное исчезновение blurText и blurButton перед началом анимации
    blurText.style.transition = 'opacity 0.3s cubic-bezier(0.33, 0, 0.67, 1)';
    blurButton.style.transition = 'opacity 0.3s cubic-bezier(0.33, 0, 0.67, 1)';
    blurText.style.opacity = '0';
    blurButton.style.opacity = '0';
    
    // Даем время для полного исчезновения
    setTimeout(() => {
        // 2. Настраиваем сверхплавную анимацию для основных элементов
        const smoothTransition = 'all 1.3s cubic-bezier(0.16, 1, 0.3, 1)';
        mainText.style.transition = smoothTransition;
        actionBtn.style.transition = smoothTransition;

        inputCurrency.style.transition = smoothTransition;
        inputCurrencyBlur.style.transition = smoothTransition;
        outputCurrency.style.transition = smoothTransition;
        outputCurrencyBlur.style.transition = smoothTransition;
        
        // 3. Запускаем основную анимацию
        mainText.style.transform = 'translateY(12px) scale(0.98)';
        actionBtn.style.transform = 'translateY(-12px) scale(1.02)';
        mainText.style.opacity = '0.85';
        actionBtn.style.opacity = '0.85';

        inputCurrency.style.opacity = '0';
        inputCurrencyBlur.style.opacity = '0';
        outputCurrency.style.opacity = '0';
        outputCurrencyBlur.style.opacity = '0';

        
        // 4. После завершения основной анимации
        setTimeout(() => {
            // Меняем содержимое
            const tempContent = mainText.textContent;
            mainText.textContent = actionBtn.textContent;
            blurText.textContent = actionBtn.textContent;
            actionBtn.textContent = tempContent;
            blurButton.textContent = tempContent;

            const tempContentCurrency = inputCurrency.textContent;
            inputCurrency.textContent = outputCurrency.textContent;
            inputCurrencyBlur.textContent = outputCurrency.textContent;
            outputCurrency.textContent = tempContentCurrency;
            outputCurrencyBlur.textContent = tempContentCurrency;



            // Плавное возвращение
            mainText.style.transform = 'translateY(0) scale(1)';
            actionBtn.style.transform = 'translateY(0) scale(1)';
            mainText.style.opacity = '1';
            actionBtn.style.opacity = '1';

            inputCurrency.style.opacity = '1';
            inputCurrencyBlur.style.opacity = '1';
            outputCurrency.style.opacity = '1';
            outputCurrencyBlur.style.opacity = '1';
            
            // 5. После полного завершения плавно показываем blurText и blurButton
            setTimeout(() => {
                blurText.style.transition = 'opacity 0.9s cubic-bezier(0.34, 1.56, 0.64, 1)';
                blurButton.style.transition = 'opacity 0.9s cubic-bezier(0.34, 1.56, 0.64, 1)';
                blurText.style.opacity = '0.6';
                blurButton.style.opacity = '0.6';
                
                // Плавное полное появление
                setTimeout(() => {
                    blurText.style.opacity = '1';
                    blurButton.style.opacity = '1';
                }, 300);
                
            }, 100); // Задержка перед появлением
            
        }, 500); // Время основной анимации
        
    }, 100); // Задержка перед началом основной анимации
});
}




// !!! Кнопка информации !!!
class InfoPopup {
    constructor(animationManager) {
        this.button = document.querySelector('.info-btn-main');
        this.popup = document.querySelector('.info-window');
        this.animationManager = animationManager;
        this.isHoveringPopup = false;
        this.hideTimeout = null;
        this.showTimeout = null;
        
        if (this.button && this.popup) {
            this.init();
        }
    }
    
    init() {
        // Наведение на кнопку
        this.button.addEventListener('mouseenter', () => {
            this.cancelAllTimeouts();
            this.showTimeout = setTimeout(() => {
                this.showPopup();
            }, 80);
        });
        
        // Уход с кнопки
        this.button.addEventListener('mouseleave', () => {
            this.cancelAllTimeouts();
            this.scheduleHide();
        });
        
        // Наведение на popup
        this.popup.addEventListener('mouseenter', () => {
            this.cancelAllTimeouts();
            this.isHoveringPopup = true;
        });
        
        // Уход с popup
        this.popup.addEventListener('mouseleave', () => {
            this.isHoveringPopup = false;
            this.scheduleHide();
        });
    }
    
    showPopup() {
        if (this.animationManager.areAnimationsEnabled()) {
            this.popup.style.opacity = '1';
            this.popup.style.visibility = 'visible';
            this.popup.style.pointerEvents = 'auto';
            this.popup.style.transition = 'all 0.9s cubic-bezier(0.34, 1.56, 0.64, 1)';
        } else {
            // Без анимации - сразу показываем
            this.popup.style.opacity = '1';
            this.popup.style.visibility = 'visible';
            this.popup.style.pointerEvents = 'auto';
            this.popup.style.transition = 'none';
        }
    }
    
    scheduleHide() {
        this.hideTimeout = setTimeout(() => {
            if (!this.isHoveringPopup) {
                this.hidePopup();
            }
        }, 450);
    }
    
    cancelAllTimeouts() {
        if (this.hideTimeout) {
            clearTimeout(this.hideTimeout);
            this.hideTimeout = null;
        }
        if (this.showTimeout) {
            clearTimeout(this.showTimeout);
            this.showTimeout = null;
        }
    }
    
    hidePopup() {
        if (this.animationManager.areAnimationsEnabled()) {
            this.popup.style.opacity = '0';
            this.popup.style.visibility = 'hidden';
            this.popup.style.pointerEvents = 'none';
            this.popup.style.transition = 'all 0.8s cubic-bezier(0.12, 0, 0.39, 0)';
        } else {
            // Без анимации - сразу скрываем
            this.popup.style.opacity = '0';
            this.popup.style.visibility = 'hidden';
            this.popup.style.pointerEvents = 'none';
            this.popup.style.transition = 'none';
        }
    }
}





// !!! Анимация перевода текста !!!
let currentLanguage = 'ru';

function toggleLanguage() {
    const newLanguage = currentLanguage === 'ru' ? 'en' : 'ru';
    const button = document.querySelector('.switch-language');
    
    // Анимация кнопки
    button.style.transform = 'scale(0.95)';
    button.style.opacity = '0.8';
    
    // Получаем все элементы для перевода
    const elementsToTranslate = document.querySelectorAll(
        '.window-title, .window-ton-main, .window-rub, .window-ton-description li'
    );
    
    // Фаза 1: Исчезновение
    elementsToTranslate.forEach(element => {
        element.classList.add('fade-out');
    });
    
    // Фаза 2: Смена текста и появление
    setTimeout(() => {
        elementsToTranslate.forEach(element => {
            const text = element.getAttribute(`data-${newLanguage}`);
            if (text) {
                element.textContent = text;
            }
            element.classList.remove('fade-out');
            element.classList.add('fade-in');
        });
        
        // Обновляем язык и кнопку
        currentLanguage = newLanguage;
        button.textContent = newLanguage === 'ru' ? 'ENG' : 'RU';
        
        // Возвращаем кнопку в нормальное состояние
        setTimeout(() => {
            button.style.transform = 'scale(1)';
            button.style.opacity = '1';
            elementsToTranslate.forEach(element => {
                element.classList.remove('fade-in');
            });
        }, 600);
        
    }, 600); // Ждем завершения анимации исчезновения
}


// !!! ВАЛИДАЦИЯ !!!

class InputValidator {
    constructor(inputElement, converter) {
        this.input = inputElement;
        this.converter = converter; // Добавляем ссылку на конвертер
        this.init();
    }

    init() {
        this.addNumericValidation();
    }

    addNumericValidation() {
        this.input.addEventListener('input', (e) => {
            let value = this.input.value;
            
            // Разрешаем только цифры и соответствующий десятичный разделитель
            const decimalSeparator = this.converter.isTonToRub ? /\./ : /\,/;
            const allowedPattern = this.converter.isTonToRub ? /[^0-9.]/g : /[^0-9,]/g;
            
            value = value.replace(allowedPattern, '');
            
            // Проверяем количество десятичных разделителей
            const separatorCount = (value.match(decimalSeparator) || []).length;
            if (separatorCount > 1) {
                const parts = value.split(decimalSeparator);
                value = parts[0] + (parts[0] ? decimalSeparator.source === '\.' ? '.' : ',' : '') + parts.slice(1).join('');
            }
            
            if (value === (this.converter.isTonToRub ? '.' : ',')) {
                value = '0' + value;
            }
            
            if (value.startsWith(this.converter.isTonToRub ? '.' : ',')) {
                value = '0' + value;
            }
            
            this.input.value = value;
        });
        
        this.input.addEventListener('keydown', (e) => {
            const allowedKeys = [
                'Backspace', 'Delete', 'Tab', 'ArrowLeft', 'ArrowRight', 
                'ArrowUp', 'ArrowDown', 'Home', 'End'
            ];
            
            if (e.ctrlKey || e.metaKey) {
                if (
                    e.key === 'c' || e.key === 'C' ||
                    e.key === 'v' || e.key === 'V' ||
                    e.key === 'x' || e.key === 'X' ||
                    e.key === 'a' || e.key === 'A' ||
                    e.key === 'z' || e.key === 'Z' ||
                    e.key === 'F5' ||
                    (e.shiftKey && e.key === 'F5')
                ) {
                    return true;
                }
            }
            
            if (e.key.startsWith('F') && e.key.length > 1) {
                const fNumber = parseInt(e.key.substring(1));
                if (fNumber >= 1 && fNumber <= 12) {
                    return true;
                }
            }
            
            if (e.key === 'Escape') {
                return true;
            }
            
            const currentValue = this.input.value;
            const cursorPosition = this.input.selectionStart;
            
            // Блокируем несоответствующий десятичный разделитель
            if ((e.key === '.' && !this.converter.isTonToRub) || 
                (e.key === ',' && this.converter.isTonToRub)) {
                e.preventDefault();
                return false;
            }
            
            // Разрешаем соответствующий десятичный разделитель
            if ((e.key === '.' && this.converter.isTonToRub) || 
                (e.key === ',' && !this.converter.isTonToRub)) {
                if (currentValue.includes(this.converter.isTonToRub ? '.' : ',') || cursorPosition === 0) {
                    e.preventDefault();
                    return false;
                }
                return true;
            }
            
            if ((e.key >= '0' && e.key <= '9') || allowedKeys.includes(e.key)) {
                return true;
            }
            
            e.preventDefault();
            return false;
        });
        
        this.input.addEventListener('paste', (e) => {
            const pastedData = e.clipboardData.getData('text');
            
            // Определяем разрешенные символы в зависимости от направления
            const allowedPattern = this.converter.isTonToRub ? /^[\d.]+$/ : /^[\d,]+$/;
            
            if (!allowedPattern.test(pastedData)) {
                e.preventDefault();
                return;
            }
            
            // Конвертируем разделители при необходимости
            let processedData = pastedData;
            if (!this.converter.isTonToRub) {
                processedData = processedData.replace(/\./g, ',');
            } else {
                processedData = processedData.replace(/,/g, '.');
            }
            
            const separator = this.converter.isTonToRub ? '.' : ',';
            const dotCount = (processedData.match(new RegExp('\\' + separator, 'g')) || []).length;
            const currentDots = (this.input.value.match(new RegExp('\\' + separator, 'g')) || []).length;
            
            if (currentDots + dotCount > 1) {
                e.preventDefault();
            }
            
            // Вставляем обработанные данные
            e.preventDefault();
            document.execCommand('insertText', false, processedData);
        });
        
        this.input.addEventListener('blur', () => {
            let value = this.input.value;
            const separator = this.converter.isTonToRub ? '.' : ',';
            
            if (value.endsWith(separator)) {
                value = value.slice(0, -1);
            }
            
            if (value.length > 1 && value.startsWith('0') && !value.startsWith('0' + separator)) {
                value = value.replace(/^0+/, '');
            }
            
            this.input.value = value;
        });
    }
}

// !!! КОНВЕРТЕР !!!

class CurrencyConverter {
    constructor(inputElement, resultElement) {
        this.input = inputElement;
        this.resultValue = resultElement;
        this.tonPrice = 250; // Курс по умолчанию
        this.isTonToRub = true
        
        this.init();
        this.fetchTonPrice();
    }

    async fetchTonPrice() {
        try {
            const response = await fetch('https://api.bybit.com/v5/market/tickers?category=spot&symbol=TONUSDT');
            const data = await response.json();
            
            if (data.retCode === 0 && data.result.list.length > 0) {
                const tonUsdtPrice = parseFloat(data.result.list[0].lastPrice);
                
                const usdtRubResponse = await fetch('https://api.exchangerate-api.com/v4/latest/USD');
                const usdtRubData = await usdtRubResponse.json();
                const usdRubRate = usdtRubData.rates.RUB;
                
                this.tonPrice = tonUsdtPrice * usdRubRate;
                console.log('Курс TON/RUB обновлен:', this.tonPrice);
                
                if (this.input.value) {
                    this.convertAndDisplay();
                }
            }
        } catch (error) {
            console.warn('Не удалось получить курс с Bybit, используем значение по умолчанию:', this.tonPrice);
            this.tryAlternativeApi();
        }
    }
    
    async tryAlternativeApi() {
        try {
            const response = await fetch('https://api.coingecko.com/api/v3/simple/price?ids=the-open-network&vs_currencies=rub');
            const data = await response.json();
            this.tonPrice = data['the-open-network'].rub;
            console.log('Курс TON/RUB с CoinGecko:', this.tonPrice);
            
            if (this.input.value) {
                this.convertAndDisplay();
            }
        } catch (error) {
            console.warn('Все API недоступны, используем фиксированный курс');
        }
    }

    init() {
        this.input.addEventListener('input', () => {
            this.convertAndDisplay();
        });
        
        setInterval(() => {
            this.fetchTonPrice();
        }, 30000);
        
        this.initResultField();
    }

    initResultField() {
        this.resultValue.setAttribute('readonly', 'true');
        
        this.resultValue.onkeydown = null;
        this.resultValue.onkeypress = null;
        
        this.resultValue.addEventListener('keydown', (e) => {
            if ((e.ctrlKey || e.metaKey) && 
                (e.key === 'c' || e.key === 'C' || e.key === 'a' || e.key === 'A')) {
                return true;
            }
            
            if (e.key.length === 1 && !e.ctrlKey && !e.metaKey) {
                e.preventDefault();
                return false;
            }
            
            return true;
        });
        
        this.resultValue.addEventListener('focus', () => {
            setTimeout(() => {
                this.scrollToEnd();
            }, 10);
        });
        
        this.resultValue.addEventListener('contextmenu', (e) => {
            return true;
        });
    }
    
    scrollToEnd() {
        setTimeout(() => {
            this.resultValue.scrollLeft = this.resultValue.scrollWidth;
        }, 10);
    }

    
    convertAndDisplay() {
    // Извлекаем число из форматированного ввода
    const inputNumber = this.extractNumber(this.input.value);
    
    if (inputNumber === null || inputNumber === 0) {
        this.resultValue.value = '';
        return;
    }
    
    let result;
    
    if (this.isTonToRub) {
        // TON → RUB
        result = inputNumber * this.tonPrice;
        this.resultValue.value = this.formatRubResult(result);
    } else {
        // RUB → TON
        result = inputNumber / this.tonPrice;
        this.resultValue.value = this.formatTonResult(result);
    }
    
    this.scrollToEnd();
}
    
    formatRubResult(value) {
        this.resultValue.classList.remove('ton-format');
        return value.toLocaleString('ru-RU', {
            minimumFractionDigits: 2,
            maximumFractionDigits: 2,
            useGrouping: true
        }) + ' ₽';
    }
    
    formatTonResult(value) {
        this.resultValue.classList.add('ton-format');
    
    // Для очень маленьких значений используем научную нотацию
        if (value < 0.0001) {
        return value.toExponential(6) + ' TON';
        }
    
    // Форматируем с точкой как десятичным разделителем
        const formatted = value.toLocaleString('en-US', { // Меняем на en-US для точек
        minimumFractionDigits: 4,
        maximumFractionDigits: 4,
        useGrouping: false
        });
    
        return formatted + ' TON';
    }
    
    toggleConversionDirection() {
    this.isTonToRub = !this.isTonToRub;
    
    
    // Сохраняем текущие значения
    const currentInput = this.input.value;
    const currentResult = this.resultValue.value;
    
    // Только если оба поля заполнены
    if (currentInput && currentResult) {
        const inputNumber = this.extractNumber(currentInput);
        const resultNumber = this.extractNumber(currentResult);
        
        if (inputNumber !== null && resultNumber !== null) {
            if (this.isTonToRub) {
                this.input.value = this.formatForInput(resultNumber, false);
                this.resultValue.value = this.formatRubResult(inputNumber);
            } else {
                this.input.value = this.formatForInput(resultNumber, true);
                this.resultValue.value = this.formatTonResult(inputNumber);
            }
        }
    } else {
        // Если поля пустые, просто очищаем результат
        this.resultValue.value = '';
    }
    
    // Всегда обновляем отображение
    this.convertAndDisplay();
}

extractNumber(formattedString) {
    try {
        // Удаляем все не-цифровые символы кроме точек и запятых
        let cleaned = formattedString.replace(/[^\d.,]/g, '');
        
        // Заменяем запятые на точки для парсинга
        cleaned = cleaned.replace(/,/g, '.');
        
        const number = parseFloat(cleaned);
        return isNaN(number) ? null : number;
    } catch (e) {
        return null;
    }
}


    normalizeNumberFormat(value) {
        let cleaned = value.replace(/[^\d.,]/g, '');
        return cleaned.replace(/,/g, '.');
    }
    
    formatForInput(value, useComma) {
    if (value === null || isNaN(value)) return '';
    
    // Преобразуем число в строку
    let stringValue = value.toString();
    
    if (useComma) {
        // Для RUB: заменяем точки на запятые
        return stringValue.replace('.', ',');
    } else {
        // Для TON: оставляем точки
        return stringValue;
    }
}

    formatForOutput(value, isRub) {
    const number = parseFloat(value);
    if (isNaN(number)) return '';
    
    if (isRub) {
        // Для RUB: форматируем с запятыми для тысяч и точкой для дробей
        return number.toLocaleString('ru-RU', {
            minimumFractionDigits: 2,
            maximumFractionDigits: 2,
            useGrouping: true
        }) + ' ₽';
    } else {
        // Для TON: форматируем с точками для дробей
        return number.toLocaleString('ru-RU', {
            minimumFractionDigits: 4,
            maximumFractionDigits: 4,
            useGrouping: false // Не использовать разделители тысяч для TON
        }) + ' TON';
    }
}


}




// !!! АНИМАЦИЯ ПОДЪЕМА ТЕКСТА !!!

class InputAnimator {
    constructor(wrapper, input, currency, currencyBlur, outputCurrency, outputCurrencyBlur, animationManager) {
        this.wrapper = wrapper;
        this.input = input;
        this.currency = currency;
        this.currencyBlur = currencyBlur;
        this.outputCurrency = outputCurrency;
        this.outputCurrencyBlur = outputCurrencyBlur;
        this.animationManager = animationManager;
        
        this.isAnimating = false;
        this.hasValue = false;
        this.isFocused = false;
        this.isHovered = false;
        
        this.finalGradient = 'linear-gradient(126.47deg, rgba(40, 63, 88, 1), rgba(0, 19, 38, 1) 100%)';
        this.finalGradientBlur = 'linear-gradient(126.47deg, rgba(40, 63, 88, 0.8), rgba(0, 19, 38, 0.8) 100%)';
        this.originalGradient = 'linear-gradient(126.47deg, rgba(112.05, 181.14, 255, 1), rgba(0, 36, 72, 1) 100%)';
        
        this.init();
    }

    init() {
        // Добавляем проверку на анимации при инициализации
        if (!this.animationManager.areAnimationsEnabled()) {
            this.disableAnimations();
            return;
        }

        this.wrapper.addEventListener('mouseenter', () => {
            if (!this.animationManager.areAnimationsEnabled()) return;
            this.isHovered = true;
            this.handleHover();
        });
        
        this.wrapper.addEventListener('mouseleave', () => {
            if (!this.animationManager.areAnimationsEnabled()) return;
            this.isHovered = false;
            this.handleLeave();
        });
        
        this.input.addEventListener('focus', () => {
            this.isFocused = true;
            if (!this.animationManager.areAnimationsEnabled()) {
                this.applyLiftedState();
                return;
            }
            this.liftText();
        });
        
        this.input.addEventListener('blur', () => {
            this.isFocused = false;
            if (!this.animationManager.areAnimationsEnabled()) {
                if (!this.hasValue && !this.isHovered) {
                    this.applyReturnedState();
                }
                return;
            }
            if (!this.hasValue && !this.isHovered) {
                this.returnText();
            }
        });
        
        this.input.addEventListener('input', () => {
            this.hasValue = this.input.value.trim() !== '';
            if (!this.animationManager.areAnimationsEnabled()) {
                if (this.hasValue) {
                    this.applyLiftedState();
                } else if (!this.isFocused && !this.isHovered) {
                    this.applyReturnedState();
                }
                return;
            }
            if (this.hasValue) {
                this.liftText();
            } else if (!this.isFocused && !this.isHovered) {
                this.returnText();
            }
        });
        
        this.hasValue = this.input.value.trim() !== '';
        if (!this.animationManager.areAnimationsEnabled()) {
            if (this.hasValue || this.isFocused) {
                this.applyLiftedState();
            }
        } else {
            if (this.hasValue || this.isFocused) {
                this.liftText();
            }
        }
    }

    // Новый метод для полного отключения анимаций
    disableAnimations() {
        // Убираем все обработчики событий, которые могут запускать анимации
        this.wrapper.removeEventListener('mouseenter', this.handleHover);
        this.wrapper.removeEventListener('mouseleave', this.handleLeave);
        
        // Устанавливаем начальное состояние
        this.hasValue = this.input.value.trim() !== '';
        if (this.hasValue || this.isFocused) {
            this.applyLiftedState();
        } else {
            this.applyReturnedState();
        }
        
        // Добавляем упрощенные обработчики только для функциональности
        this.input.addEventListener('focus', () => {
            this.isFocused = true;
            this.applyLiftedState();
        });
        
        this.input.addEventListener('blur', () => {
            this.isFocused = false;
            if (!this.hasValue && !this.isHovered) {
                this.applyReturnedState();
            }
        });
        
        this.input.addEventListener('input', () => {
            this.hasValue = this.input.value.trim() !== '';
            if (this.hasValue) {
                this.applyLiftedState();
            } else if (!this.isFocused && !this.isHovered) {
                this.applyReturnedState();
            }
        });
    }

    shouldLift() {
        return this.isHovered || this.isFocused || this.hasValue;
    }
    
    handleHover() {
        if (!this.animationManager.areAnimationsEnabled()) return;
        if (this.isAnimating || this.shouldLift()) return;
        this.liftText();
    }
    
    handleLeave() {
        if (!this.animationManager.areAnimationsEnabled()) return;
        if (this.isAnimating || this.isFocused || this.hasValue) return;
        this.returnText();
    }
    
    liftText() {
        if (!this.animationManager.areAnimationsEnabled()) {
            this.applyLiftedState();
            return;
        }
        
        if (this.isAnimating) {
            clearTimeout(this.returnTimeout);
            this.isAnimating = false;
        }
        
        this.isAnimating = true;
        
        this.currencyBlur.style.transition = 'all 0.2s cubic-bezier(0.25, 0.46, 0.45, 0.94)';
        Object.assign(this.currencyBlur.style, {
            transform: 'translate(-70%, -120%)',
            top: '-13%',
            left: '15%',
            fontSize: 'var(--final-font-size)',
            background: this.finalGradientBlur,
            webkitBackgroundClip: 'text',
            backgroundClip: 'text',
            webkitTextFillColor: 'transparent',
            opacity: '1',
            filter: 'blur(2px)'
        });
        
        this.currency.style.transition = 'all 0.2s cubic-bezier(0.25, 0.46, 0.45, 0.94)';
        Object.assign(this.currency.style, {
            transform: 'translate(-70%, -120%)',
            top: '-13%',
            left: '15%',
            fontSize: 'var(--final-font-size)',
            background: this.finalGradient,
            webkitBackgroundClip: 'text',
            backgroundClip: 'text',
            webkitTextFillColor: 'transparent'
        });

        this.outputCurrencyBlur.style.transition = 'all 0.2s cubic-bezier(0.25, 0.46, 0.45, 0.94)';
        Object.assign(this.outputCurrencyBlur.style, {
            transform: 'translate(-70%, -120%)',
            top: '-14%',
            left: '15%',
            fontSize: 'var(--final-font-size)',
            background: this.finalGradientBlur,
            webkitBackgroundClip: 'text',
            backgroundClip: 'text',
            webkitTextFillColor: 'transparent',
            opacity: '1',
            filter: 'blur(2px)'
        });
        
        this.outputCurrency.style.transition = 'all 0.2s cubic-bezier(0.25, 0.46, 0.45, 0.94)';
        Object.assign(this.outputCurrency.style, {
            transform: 'translate(-70%, -120%)',
            top: '-14%',
            left: '15%',
            fontSize: 'var(--final-font-size)',
            background: this.finalGradient,
            webkitBackgroundClip: 'text',
            backgroundClip: 'text',
            webkitTextFillColor: 'transparent'
        });
        
        setTimeout(() => {
            this.isAnimating = false;
        }, 200);
    }
    
    returnText() {
        if (!this.animationManager.areAnimationsEnabled()) {
            this.applyReturnedState();
            return;
        }
        
        if (this.isAnimating) {
            clearTimeout(this.returnTimeout);
            this.isAnimating = false;
        }
        
        this.isAnimating = true;
        
        this.currencyBlur.style.transition = 'all 0.6s cubic-bezier(0.16, 1, 0.3, 1)';
        Object.assign(this.currencyBlur.style, {
            transform: 'translate(-50%, -50%)',
            top: '15%',
            left: '22%',
            fontSize: 'var(--original-font-size)',
            background: this.originalGradient,
            webkitBackgroundClip: 'text',
            backgroundClip: 'text',
            webkitTextFillColor: 'transparent',
            opacity: '1',
            filter: 'blur(2px)'
        }); 
        
        this.currency.style.transition = 'all 0.6s cubic-bezier(0.16, 1, 0.3, 1)';
        Object.assign(this.currency.style, {
            transform: 'translate(-50%, -50%)',
            top: '15%',
            left: '22%',
            fontSize: 'var(--original-font-size)',
            background: this.originalGradient,
            webkitBackgroundClip: 'text',
            backgroundClip: 'text',
            webkitTextFillColor: 'transparent'
        });

        this.outputCurrencyBlur.style.transition = 'all 0.6s cubic-bezier(0.16, 1, 0.3, 1)';
        Object.assign(this.outputCurrencyBlur.style, {
            transform: 'translate(-50%, -50%)',
            top: '13%',
            left: '22%',
            fontSize: 'var(--original-font-size)',
            background: this.originalGradient,
            webkitBackgroundClip: 'text',
            backgroundClip: 'text',
            webkitTextFillColor: 'transparent',
            opacity: '1',
            filter: 'blur(2px)'
        });
        
        this.outputCurrency.style.transition = 'all 0.6s cubic-bezier(0.16, 1, 0.3, 1)';
        Object.assign(this.outputCurrency.style, {
            transform: 'translate(-50%, -50%)',
            top: '13%',
            left: '22%',
            fontSize: 'var(--original-font-size)',
            background: this.originalGradient,
            webkitBackgroundClip: 'text',
            backgroundClip: 'text',
            webkitTextFillColor: 'transparent'
        });
        
        this.returnTimeout = setTimeout(() => {
            this.isAnimating = false;
        }, 600);
    }
    
    // Методы для мгновенного применения состояний без анимации
    applyLiftedState() {
        // Убираем transition для мгновенного применения
        this.currency.style.transition = 'none';
        this.currencyBlur.style.transition = 'none';
        this.outputCurrency.style.transition = 'none';
        this.outputCurrencyBlur.style.transition = 'none';
        
        const styles = {
            transform: 'translate(-70%, -120%)',
            top: '-13%',
            left: '15%',
            fontSize: 'var(--final-font-size)',
            background: this.finalGradient,
            webkitBackgroundClip: 'text',
            backgroundClip: 'text',
            webkitTextFillColor: 'transparent'
        };
        
        Object.assign(this.currency.style, styles);
        Object.assign(this.currencyBlur.style, {...styles, background: this.finalGradientBlur, filter: 'blur(2px)'});
        
        const outputStyles = {
            transform: 'translate(-70%, -120%)',
            top: '-14%',
            left: '15%',
            fontSize: 'var(--final-font-size)',
            background: this.finalGradient,
            webkitBackgroundClip: 'text',
            backgroundClip: 'text',
            webkitTextFillColor: 'transparent'
        };
        
        Object.assign(this.outputCurrency.style, outputStyles);
        Object.assign(this.outputCurrencyBlur.style, {...outputStyles, background: this.finalGradientBlur, filter: 'blur(2px)'});
    }
    
    applyReturnedState() {
        // Убираем transition для мгновенного применения
        this.currency.style.transition = 'none';
        this.currencyBlur.style.transition = 'none';
        this.outputCurrency.style.transition = 'none';
        this.outputCurrencyBlur.style.transition = 'none';
        
        const styles = {
            transform: 'translate(-50%, -50%)',
            top: '15%',
            left: '22%',
            fontSize: 'var(--original-font-size)',
            background: this.originalGradient,
            webkitBackgroundClip: 'text',
            backgroundClip: 'text',
            webkitTextFillColor: 'transparent'
        };
        
        Object.assign(this.currency.style, styles);
        Object.assign(this.currencyBlur.style, {...styles, filter: 'blur(2px)'});
        
        const outputStyles = {
            transform: 'translate(-50%, -50%)',
            top: '13%',
            left: '22%',
            fontSize: 'var(--original-font-size)',
            background: this.originalGradient,
            webkitBackgroundClip: 'text',
            backgroundClip: 'text',
            webkitTextFillColor: 'transparent'
        };
        
        Object.assign(this.outputCurrency.style, outputStyles);
        Object.assign(this.outputCurrencyBlur.style, {...outputStyles, filter: 'blur(2px)'});
    }
}


class App {
    constructor() {
        this.wrapper = document.querySelector('.input-wrapper');
        this.input = document.querySelector('.input-value');
        this.currency = document.querySelector('.input-currency');
        this.currencyBlur = document.querySelector('.input-currency-blur');
        this.outputCurrency = document.querySelector('.output-currency');
        this.outputCurrencyBlur = document.querySelector('.output-currency-blur');
        this.resultValue = document.querySelector('.result-value');
        
        this.init();
    }
    
    init() {
        // Инициализируем все компоненты
        this.animationManager = new AnimationManager();
        
        this.converter = new CurrencyConverter(this.input, this.resultValue);
        this.validator = new InputValidator(this.input, this.converter);
        this.animator = new InputAnimator(
            this.wrapper, 
            this.input, 
            this.currency, 
            this.currencyBlur,
            this.outputCurrency,
            this.outputCurrencyBlur,
            this.animationManager
        );

        setupSwapButton(this.animationManager);
        
        // Сохраняем конвертер в глобальной области для доступа из swapButton
        window.currencyConverter = this.converter;
    }
}

// Инициализация при загрузке
document.addEventListener('DOMContentLoaded', () => {
    const app = new App();
    const infoPopup = new InfoPopup(app.animationManager);
    const button = document.querySelector('.switch-language');
    button.addEventListener('click', toggleLanguage);
});
