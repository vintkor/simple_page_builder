/**
 * Custom `color picker` extension
 */
var ColorPickerExtension = MediumEditor.Extension.extend({
    name: "colorPicker",

    init: function () {
        this.button = this.document.createElement('button');
        this.button.classList.add('medium-editor-action');
        this.button.classList.add('editor-color-picker');
        this.button.title = 'Text color'
        this.button.innerHTML = '<i class="fa fa-paint-brush"></i>';

        this.on(this.button, 'click', this.handleClick.bind(this));
    },

    getButton: function () {
        return this.button;
    },

    handleClick: function (e) {
        e.preventDefault();
        e.stopPropagation();

        this.selectionState = this.base.exportSelection();

        // If no text selected, stop here.
        if (this.selectionState && (this.selectionState.end - this.selectionState.start === 0)) {
            return;
        }

        // colors for picker
        var pickerColors = [
            "#1abc9c",
            "#2ecc71",
            "#3498db",
            "#9b59b6",
            "#34495e",
            "#16a085",
            "#27ae60",
            "#2980b9",
            "#8e44ad",
            "#2c3e50",
            "#f1c40f",
            "#e67e22",
            "#e74c3c",
            "#bdc3c7",
            "#95a5a6",
            "#f39c12"
        ];

        var picker = vanillaColorPicker(this.document.querySelector(".medium-editor-toolbar-active .editor-color-picker").parentNode);
        picker.set("customColors", pickerColors);
        picker.set("positionOnTop");
        picker.openPicker();
        picker.on("colorChosen", function (color) {
            this.base.importSelection(this.selectionState);
            this.document.execCommand("styleWithCSS", false, true);
            this.document.execCommand("foreColor", false, color);
        }.bind(this));
    }
});

var editorStore = [];

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
                    'justifyFull',
                    'colorPicker'
                ]
            },
            extensions: {
                'colorPicker': new ColorPickerExtension()
            }
        });
    editorStore.push(editor);
}

setMediumEditor();

$(document).ready(function () {

    function getCookie(name) {
        var cookieValue = null;
        if (document.cookie && document.cookie != '') {
            var cookies = document.cookie.split(';');
            for (var i = 0; i < cookies.length; i++) {
                var cookie = jQuery.trim(cookies[i]);
                // Does this cookie string begin with the name we want?
                if (cookie.substring(0, name.length + 1) == (name + '=')) {
                    cookieValue = decodeURIComponent(cookie.substring(name.length + 1));
                    break;
                }
            }
        }
        return cookieValue;
    }

    function csrfSafeMethod(method) {
        return (/^(GET|HEAD|OPTIONS|TRACE)$/.test(method));
    }

    function sameOrigin(url) {
        var host = document.location.host; // host + port
        var protocol = document.location.protocol;
        var sr_origin = '//' + host;
        var origin = protocol + sr_origin;
        return (url == origin || url.slice(0, origin.length + 1) == origin + '/') ||
            (url == sr_origin || url.slice(0, sr_origin.length + 1) == sr_origin + '/') ||
            !(/^(\/\/|http:|https:).*/.test(url));
    }

    var csrftoken = getCookie('csrftoken');
    $.ajaxSetup({
        beforeSend: function (xhr, settings) {
            if (!csrfSafeMethod(settings.type) && sameOrigin(settings.url)) {
                xhr.setRequestHeader("X-CSRFToken", csrftoken);
            }
        }
    });
});


function deleteItem(el) {

    swal({
        title: 'Точно удалить?',
        text: "Блок будет удалён безвозвратно!",
        type: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#3085d6',
        cancelButtonColor: '#d22',
        confirmButtonText: 'Да, удалить!'
    }).then((result) => {
        if (result.value) {
            $(el).parent('.sorlTemplate').addClass('animated zoomOut');
            setTimeout(function () {
                $(el).parent('.sorlTemplate').remove();
            }, 1000);
        }
    })
}

(function () {

    // Клонирование элементов на странице
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

    // Сортировка элементов на странице
    Sortable.create(sortSections, {
        animation: 200,
        group: "shared",
        sort: true,
        scroll: true,
        handle: ".drag-handle"
    });

    // Раскрытие меню с пресетами
    $('.sort_templates__toggle').click(function (e) {
        $(this)
            .toggleClass('sort_templates__toggle--active')
            .parents('.sort_templates__wrapper')
            .toggleClass('sort_templates__wrapper--active');

        var icon = $(this).find('i');

        if (icon.hasClass('fa-chevron-left')) {
            icon.removeClass('fa-chevron-left').addClass('fa-chevron-right')
        } else {
            icon.removeClass('fa-chevron-right').addClass('fa-chevron-left')
        }
        $('.sortSections').toggleClass('sortSections--full')
    });

    // Редактировиние ссылок (кнопок)
    $('body').on('click', '.editableLink', function (e) {
        e.preventDefault();

        var editableLink = {}
        var self = $(this);

        swal({
            title: 'Введите текст ссылки',
            input: 'text',
            inputPlaceholder: 'текст ссылки',
            showCancelButton: true,
            inputValidator: (value) => {
                return !value && 'Необходимо ввести текст ссылки!'
            }
        }).then(function (params) {
            if (params.dismiss == 'cancel') {
                throw new Error('cancel');
            }
            if (params.value) {
                editableLink.text = params.value;
                return swal({
                    input: 'url',
                    inputPlaceholder: 'Введите URL',
                    inputPlaceholder: 'http://gofriends.pro'
                })
            }
            }).then(function (params) {
                editableLink.link = params.value;

                return swal({
                    title: 'Открывать в новом окне?',
                    input: 'checkbox',
                    inputOptions: {
                        '_blank': 'Открывать в новом окне'
                    }
                })
            }).then(function (params) {
                if (params.value) {
                    editableLink.target = params.value;
                } else {
                    editableLink.target = false;
                }

                $(self).text(editableLink.text);
                $(self).attr('href', editableLink.link);
                if (editableLink.target) {
                    $(self).attr('target', '_blank');
                }
                
            }).catch(function (error) {
                if (error.message == 'cancel') {
                    return
                }
            });

    });

    var imageTag;
    var modal = $('#myModal');

    $('body').on('click', '.editableImage', function (e) {
       e.preventDefault();
        modal.modal('show');
        imageTag = $(this);
    });

    $('#saveImage').click(function (e) {
        e.preventDefault();

        var form = $('#imageUploaderForm');

        $.ajax({
            type: 'json',
            method: 'post',
            url: form.attr('action'),
            success: function (data) {
                modal.modal('hide');
                $(imageTag).attr('src', data.link);
                imageTag = '';
            },
            error: function (error) {
                console.log(error)
            }
        });

    });


    $('#savePage').click(function (e) {
        e.preventDefault();

        var form = $('#savePageForm'),
            textarea = form.find('textarea');
        var userData = $('body').find('#sortSections');

        for (var i=0; i < editorStore.length; i++) {
            editorStore[i].destroy();
        }
        editorStore = [];

        textarea.val($(userData).html());

        $.ajax({
            method: 'post',
            dataType: 'json',
            data: form.serialize(),
            url: window.location.href,
            success: function (data) {
                if (data.status) {
                    swal({
                        title: 'Успех!',
                        type: 'success',
                        text: 'Страница успешно сохранена!'
                    });
                    setMediumEditor();
                } else {
                    swal({
                        title: 'Ошибка!',
                        type: 'error',
                        text: 'Что-то пошло не так...'
                    })
                }
                textarea.val('');
            },
            error: function(e) {
                console.log(e)
            }
        });

    });

})();