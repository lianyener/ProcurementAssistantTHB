
function clickHideMessage(event) {
    $(this).parent().addClass('hide');
}

function pressProjectSearch(event) {
    filterProjects($(this).val());
}

function clickSave(event) {
    let saveName = (new Date()).toJSON().replace(/T|Z|:|-|\./g, '') + '_' + ($('#data-title').val() || '未命名專案');
    writeFile('project/' + saveName + '.pap', saveName);
}

function clickLoad(event) {
    let loadName = $('#proj-list').find('.ui-selected').first().text();
    readFile('project/' + loadName + '.pap');
}

function clickDelete(event) {
    let $selects = $('#proj-list').find('.ui-selected');
    $selects.each((index, select) => {
        let name = $(select).text();
        fs.rename('project/' + name + '.pap', 'recycle/' + name + '.pap', (err) => {});
        $(select).remove();
    });
}

function clickInport(event) {
    dialog.showOpenDialog((file) => {
        if (file === undefined) {
            return;
        }
        readFile(String(file));
    });
}

function clickExport(event) {
    dialog.showSaveDialog({defaultPath: './save.txt'}, (file) => {
        if (file === undefined) {
            return;
        }
        writeFile(String(file));
    });
}

function clickAutoComplete(event) {
    $(this).autocomplete('search', '');
}

function selectAutoComplete(event) {
    updateData(event.target.id);
}

function changeData(event) {
    updateData(event.target.id);
}

function clickCompanyAdd(event) {
    addCompany();
}

function clickCompanyRemove(event) {
    $(this).parent().removeCompany();
}

function inputCompanyName(event) {
    $(this).updateCompanyName();
}

function inputCompanyPrice(event) {
    $(this).updateCompanyPrice();
}

function clickMemberAdd(event) {
    addMember();
}

function clickMemberRemove(event) {
    $(this).parent().removeMember();
}

function inputMemberName(event) {
    $(this).parent().updateMemberName();
    updateMember();
}

function changeMemberJob(event) {
    $(this).updateMemberJob();
    updateMember();
}

function clickMemberOutside(event) {
    $(this).updateMemberOutside();
    updateMember();
}

function clickMemberAttend(event) {
    $(this).updateMemberAttend();
    updateMember();
}

function clickMemberVice(event) {
    $(this).updateMemberVice();
    updateMember();
}

function clickTeamAdd(event) {
    addTeam();
}

function clickTeamRemove(event) {
    $(this).parent().removeTeam();
}

function inputTeamName(event) {
    $(this).updateTeamName();
    updateTeam();
}

function clickTeamAttend(event) {
    $(this).updateTeamAttend();
    updateTeam();
}

function clickTeamKeeper(event) {
    updateTeamKeeper();
    updateTeam();
}

function changeFormBox(event) {
    $(this).attr('value', $(this).val());
    updateCalc();
}

function pressFormBox(event) {
    if (event.keyCode === 13) {
        let boxes = $('#main-form input:visible');
        let current = boxes.index(this);
        if (boxes[current + 1]) {
            boxes[current + 1].focus();
        } else {
            boxes[0].focus();
        }
    }
}

function dbclickFoldable(event) {
    $(this).toggleClass('fold');
}

function clickPrint(event) {
    printArea(event.target.id);
}