$(function () {
    // 訊息
    $('#error-hide-btn')
        .button({
            icons: { primary: 'ui-icon-closethick' },
            text: false
        })
        .on('click', clickHideMessage);

    // 分頁
    $('#tabs').tabs();

    // 程式
    $('#prog').accordion({
        collapsible: true, 
        heightStyle: 'content' 
    });

    // 專案
    var $projlist = $('#proj-list');
    fs.readdir('project', (err, dir) => {
        for(let file of dir) {
            if (file.endsWith('.pap')) {
                $projlist.prepend('<li class="ui-selectee">' + file.replace('.pap', '') + '</li>');
            }
        }
    });
    $projlist.selectable({ cancel: '.ui-selected' }).on('dblclick', clickLoad);

    $('#proj-filter').on('keyup', 'input', pressProjectSearch);
    $('#proj-new-btn').button({icon: 'ui-icon-document'}).on('click', reset);
    $('#proj-load-btn').button({icon: 'ui-icon-folder-open'}).on('click', clickLoad);
    $('#proj-save-btn').button({icon: 'ui-icon-disk'}).on('click', clickSave);
    $('#proj-del-btn').button({icon: 'ui-icon-trash'}).on('click', clickDelete);
    $('#proj-export-btn').button({icon: 'ui-icon-arrowreturnthick-1-n'}).on('click', clickExport);
    $('#proj-inport-btn').button({icon: 'ui-icon-arrowreturnthick-1-s'}).on('click', clickInport);
    
    // 資料
    $('#data')
        .accordion({
            collapsible: true, 
            heightStyle: 'content' 
        })
        .on('click', '.dropdown', clickAutoComplete)
        .on('change', 'input', changeData);

    $('#data-date')
        .datepicker({
            dateFormat: 'D',
            dayNamesShort: ['日', '一', '二', '三', '四', '五', '六'],
            showOtherMonths: true,
            selectOtherMonths: true,
            onSelect: fomatDate
        });

    $('#data-time')
        .autocomplete({
            source: ['上午9時30分', '上午10時', '下午2時', '下午2時30分'],
            delay: 0,
            minLength: 0,
            close: selectAutoComplete
        });
        
    $('#data-room')
        .autocomplete({
            source: ['本局3樓第1會議室', '本局3樓第2會議室'],
            delay: 0,
            minLength: 0,
            close: selectAutoComplete
        });

    // 廠商
    for (let i = 1; i < 8; i++) {
        $('#comp-spare > .list-row:first-child')
            .clone()
            .appendTo($('#comp-spare'))
    }
    $('#comp-list')
        .sortable({
            cancel: 'input',
            placeholder: 'list-row ui-state-highlight',
            update: updateCompanyList
        })
        .on('input', '.name', inputCompanyName)
        .on('input', '.price', inputCompanyPrice)
        .on('click', '.list-del-btn', clickCompanyRemove);
    $('#comp-data')
        .find('.list-del-btn')
        .button({
            icons: { primary: 'ui-icon-closethick' },
            text: false
        });
    $('#comp-add-btn')
        .button({
            icons: { primary: 'ui-icon-plus' },
            text: false
        })
        .on('click', clickCompanyAdd);

    // 委員
    for (let i = 1; i < 12; i++) {
        $('#memb-spare > .list-row:first-child')
            .clone()
            .appendTo($('#memb-spare'))
            .find('.radio-set')
            .find('label')
            .each(function () {
                $(this).prop('for', $(this).prop('for').replace('0', i));
            })
            .end()
            .find('input')
            .each(function (n) {
                $(this).prop({
                    'id': $(this).prop('id').replace('0', i),
                    'name': $(this).prop('name').replace('0', i),
                    'checked': n % 2 === 0
                });
            })
    }
    $('#memb-list')
        .sortable({
            cancel: 'input, .ui-button-text',
            placeholder: 'list-row ui-state-highlight',
            update: updateMemberList
        })
        .on('input', '.name', inputMemberName)
        .on('click', '.vice', inputMemberName)
        .on('change', '.job', changeMemberJob)
        .on('autocompletechange', '.job', changeMemberJob)
        .on('click', '.outside', clickMemberOutside)
        .on('click', '.attend', clickMemberAttend)
        .on('click', '.vice', clickMemberVice)
        .on('click', '.list-del-btn', clickMemberRemove);
    $('#memb-data')
        .find('.radio-set')
        .find('input')
        .checkboxradio({ icon: false })
        .end()
        .controlgroup()
        .end()
        .find('.job')
        .autocomplete({
            source: ['公', '教', '退休'],
            delay: 0,
            minLength: 0
        })
        .end()
        .find('.list-del-btn')
        .button({
            icons: { primary: 'ui-icon-closethick' },
            text: false
        });
    $('#memb-add-btn')
        .button({
            icons: { primary: 'ui-icon-plus' },
            text: false
        })
        .on('click', clickMemberAdd);

    // 工作小組
    for (let i = 1; i < 8; i++) {
        $('#team-spare > .list-row:first-child')
            .clone()
            .appendTo($('#team-spare'))
            .find('.radio-set')
            .find('label')
            .each(function () {
                $(this).prop('for', $(this).prop('for').replace('0', i));
            })
            .end()
            .find('input')
            .each(function (n) {
                $(this).prop({
                    'id': $(this).prop('id').replace('0', i),
                    'name': $(this).prop('name').replace('0', i),
                    'checked': n % 2 === 0
                });
            })
    }
    $('#team-list')
        .sortable({
            cancel: 'input, .ui-button-text',
            placeholder: 'list-row ui-state-highlight',
            update: updateTeamList
        })
        .on('input', '.name', inputTeamName)
        .on('click', '.attend', clickTeamAttend)
        .on('click', '.keeper', clickTeamKeeper)
        .on('click', '.list-del-btn', clickTeamRemove);
    $('#team-data')
        .find('.radio-set')
        .find('input')
        .checkboxradio({ icon: false })
        .end()
        .controlgroup()
        .end()
        .find('.list-del-btn')
        .button({
            icons: { primary: 'ui-icon-closethick' },
            text: false
        });
    $('#team-add-btn')
        .button({
            icons: { primary: 'ui-icon-plus' },
            text: false
        })
        .on('click', clickTeamAdd);

    // 總表
    $('#main-form')
        .on('change', 'input', changeFormBox)
        .on('keypress', 'input', pressFormBox)
        .on('dblclick', '.foldable', dbclickFoldable);

    // 功能按鈕
    $('#form-print-btn').button().on('click', clickPrint);
    $('#form-clear-btn').button().on('click', updateMainForm);
    $('#reco-print-btn').button().on('click', clickPrint);
    $('#reco-reset-btn').button().on('click', resetRecord);


});