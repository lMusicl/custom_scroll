$(document).ready(function() {
    var $sliderBar = $('.slider-bar');
    var $sliderHandle = $('.slider-handle');
    var $sliderContent = $('.slider-content');
    var $scrollPercentage = $('.scroll-percentage');
    var containerWidth = $('.container').width();
    var contentWidth = $sliderContent.width();
    var sliderMax = $sliderBar.width() - $sliderHandle.width();

    function updateScrollPercentage(handlePosition) {
        var percentage = Math.round((handlePosition / sliderMax) * 100);
        $scrollPercentage.text('[ ' + percentage + '% ]');
    }

    // Обработка перетаскивания ползунка
    $sliderHandle.on('mousedown', function(e) {
        var startX = e.pageX;
        var startLeft = $sliderHandle.position().left;

        // Отключаем плавный скролл при перетаскивании ползунка
        $sliderContent.css('transition', 'none');
        $sliderHandle.css('transition', 'none');

        $(document).on('mousemove.slider', function(e) {
            var newLeft = startLeft + (e.pageX - startX);
            newLeft = Math.max(0, Math.min(sliderMax, newLeft));

            // Перемещение ползунка
            $sliderHandle.css({ left: newLeft + 'px' });

            // Сдвиг содержимого
            var contentShift = -newLeft / sliderMax * (contentWidth - containerWidth);
            $sliderContent.css({ left: contentShift + 'px' });

            // Обновление процента прокрутки
            updateScrollPercentage(newLeft);
        });

        $(document).on('mouseup.slider', function() {
            $(document).off('.slider');
            // Отключаем transition после окончания перетаскивания
            $sliderContent.css('transition', '');
            $sliderHandle.css('transition', '');
        });

        e.preventDefault();
    });

    // Обработка прокрутки колесика мыши
    $sliderBar.on('mousewheel DOMMouseScroll', function(e) {
        e.preventDefault();
        var delta = e.originalEvent.wheelDelta || -e.originalEvent.detail;
        var handlePosition = $sliderHandle.position().left;

        // Включаем плавный скролл при прокрутке колесиком
        $sliderContent.css('transition', 'left 0.3s ease');
        $sliderHandle.css('transition', 'left 0.3s ease');

        // Изменение позиции ползунка в зависимости от прокрутки
        if (delta > 0) {
            handlePosition -= 400; // скорость прокрутки вверх
        } else {
            handlePosition += 400; // скорость прокрутки вниз
        }

        handlePosition = Math.max(0, Math.min(sliderMax, handlePosition));

        // Перемещение ползунка
        $sliderHandle.css({ left: handlePosition + 'px' });

        // Сдвиг содержимого
        var contentShift = -handlePosition / sliderMax * (contentWidth - containerWidth);
        $sliderContent.css({ left: contentShift + 'px' });

        // Обновление процента прокрутки
        updateScrollPercentage(handlePosition);
    });
});
