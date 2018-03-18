function deleteItem(el) {
    if (confirm('Точно удалить?')) {
        $(el).parent('.sorlTemplate').addClass('animated zoomOutUp');
        setTimeout(function () {
            $(el).parent('.sorlTemplate').remove();
        }, 1000);
    }
}

function setMediumEditor() {
    var elements = document.querySelectorAll('.editable'),
        editor = new MediumEditor('#sortSections .editable', {
            buttonLabels: 'fontawesome',
            toolbar: {
                buttons: [
                    'bold',
                    'italic',
                    'underline',
                    'justifyLeft',
                    'justifyCenter',
                    'justifyRight',
                    'justifyFull'
                    // 'unorderedlist',
                    // 'orderedlist',
                    // 'image',
                    // 'html'
                    // 'removeFormat'
                    // 'table'
                ]
            }
        });
}

(function () {

    Sortable.create(sortTemplates, {
        group: {
            name: "shared",
            pull: "clone",
            put: false,
            revertClone: false
        },
        sort: false,
        handle: ".drag-handle",
        onEnd: function (evt) {
            var blockClass = $(evt.clone).data('block');
            evt.item.innerHTML = $('#' + blockClass).clone().html();
            setMediumEditor();
        }
    });

    Sortable.create(sortSections, {
        animation: 200,
        group: "shared",
        sort: true,
        scroll: true,
        handle: ".drag-handle"
    });

    $('.sort_templates__toggle').click(function (e) {
        $(this)
            .toggleClass('sort_templates__toggle--active')
            .parents('.sort_templates__wrapper')
            .toggleClass('sort_templates__wrapper--active');
        $('.sortSections').toggleClass('sortSections--full')
    });

})();