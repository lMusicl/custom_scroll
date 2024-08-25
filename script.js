$(document).ready(function($) {
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

    function startDrag(startX) {
        var startLeft = $sliderHandle.position().left;

        // Отключаем плавный скролл при перетаскивании ползунка
        $sliderContent.css('transition', 'none');
        $sliderHandle.css('transition', 'none');

        function moveDrag(e) {
            var currentX = e.type === 'mousemove' ? e.pageX : e.originalEvent.touches[0].pageX;
            var newLeft = startLeft + (currentX - startX);
            newLeft = Math.max(0, Math.min(sliderMax, newLeft));

            // Перемещение ползунка
            $sliderHandle.css({ left: newLeft + 'px' });

            // Сдвиг содержимого
            var contentShift = -newLeft / sliderMax * (contentWidth - containerWidth);
            $sliderContent.css({ left: contentShift + 'px' });

            // Обновление процента прокрутки
            updateScrollPercentage(newLeft);
        }

        function endDrag() {
            $(document).off('.slider');
            // Включаем плавный скролл после окончания перетаскивания
            $sliderContent.css('transition', '');
            $sliderHandle.css('transition', '');
        }

        $(document).on('mousemove.slider touchmove.slider', moveDrag);
        $(document).on('mouseup.slider touchend.slider', endDrag);
    }

    // Обработка перетаскивания ползунка мышью
    $sliderHandle.on('mousedown', function(e) {
        startDrag(e.pageX);
        e.preventDefault();
    });

    // Обработка перетаскивания ползунка пальцем
    $sliderHandle.on('touchstart', function(e) {
        startDrag(e.originalEvent.touches[0].pageX);
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

    // Обработка касания и перетягивания контента на мобильных устройствах
    $sliderContent.on('touchstart', function(e) {
        var startX = e.originalEvent.touches[0].pageX;
        var startLeft = $sliderContent.position().left;

        function moveContent(e) {
            var currentX = e.originalEvent.touches[0].pageX;
            var newLeft = startLeft + (currentX - startX);

            // Ограничение движения влево и вправо
            newLeft = Math.max(containerWidth - contentWidth, Math.min(0, newLeft));

            // Сдвиг содержимого
            $sliderContent.css({ left: newLeft + 'px' });

            // Обновление положения ползунка
            var handlePosition = -newLeft / (contentWidth - containerWidth) * sliderMax;
            $sliderHandle.css({ left: handlePosition + 'px' });

            // Обновление процента прокрутки
            updateScrollPercentage(handlePosition);
        }

        function endContentDrag() {
            $(document).off('touchmove.sliderContent touchend.sliderContent');
        }

        $(document).on('touchmove.sliderContent', moveContent);
        $(document).on('touchend.sliderContent', endContentDrag);

        e.preventDefault();
    });

    const maxLength = 150;
    const maxFullLength = 1500;

    $('.review').each(function() {
        const $review = $(this);
        const $reviewText = $review.find('.review-bottom_text');
        const fullText = $reviewText.text().trim();
        let truncatedText = fullText;

        if (fullText.length > maxFullLength) {
            truncatedText = fullText.substring(0, maxFullLength);
        }

        if (truncatedText.length > maxLength) {
            const displayedText = truncatedText.substring(0, maxLength) + '...';
            $reviewText.text(displayedText);

            function toggleReviewText() {
                const $scrollBlock = $review.closest('.scroll-block'); // Родительский контейнер с прокруткой
                const initialScrollBlockHeight = $scrollBlock.height(); // Изначальная высота scroll-block
                const initialTextHeight = $reviewText.height(); // Изначальная высота текста

                if ($reviewText.hasClass('expanded')) {
                    // Если текст уже раскрыт, сворачиваем его обратно
                    $reviewText.removeClass('expanded').text(displayedText);
                    $(this).text('mehr');

                    // Вычисляем новую высоту scroll-block
                    const newTextHeight = $reviewText.height(); // Новая высота текста (после сворачивания)
                    const heightDifference = initialTextHeight - newTextHeight; // Разница высоты

                    const newScrollBlockHeight = initialScrollBlockHeight - heightDifference;
                    $scrollBlock.css('height', newScrollBlockHeight + 'px');
                } else {
                    // Раскрываем текст
                    $reviewText.addClass('expanded').text(truncatedText);
                    $(this).text('weniger');

                    // Вычисляем новую высоту scroll-block
                    const newTextHeight = $reviewText[0].scrollHeight; // Новая высота текста (после раскрытия)
                    const heightDifference = newTextHeight - initialTextHeight; // Разница высоты

                    const newScrollBlockHeight = initialScrollBlockHeight + heightDifference;
                    $scrollBlock.css('height', newScrollBlockHeight + 'px');
                }
            }

            // Поддержка как для клика, так и для тач-событий
            $(this).find('.review-bottom_btn').on('click touchstart', function(e) {
                toggleReviewText.call(this);
                e.preventDefault(); // Предотвращаем стандартное поведение, чтобы избежать конфликтов
            });
        } else {
            $(this).find('.review-bottom_btn').hide();
        }
    });
});
