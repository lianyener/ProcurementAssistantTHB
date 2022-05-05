
// 常數
const SERIAL = [
    ['甲', '乙', '丙', '丁', '戊', '己', '庚', '辛'],
    ['一', '二', '三', '四', '五', '六', '七', '八'],
    ['1', '2', '3', '4', '5', '6', '7', '8'],
    ['壹', '貳', '叄', '肆', '伍', '陸', '柒', '捌'],
    ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H']];
const NUMBER = ['一', '二', '三', '四', '五', '六', '七', '八', '九', '十'];

// 程式
jQuery.prototype.delayHide = function (duration = 3000) {
    $this = this;
    setTimeout(function () {
        $this.addClass('hide');
    }, duration);
    return this;
}

function showMessage(msg) {
    $('#error').delayHide().removeClass('hide').find('.message').text(msg);
}

function filterProjects(keyword) {
    $('#proj-list')
        .find('li').addClass('hide').end()
        .find('li:contains(' + keyword + ')').removeClass('hide');
}

function readFile(path) {
    fs.readFile(path, 'utf-8', (err, data) => {
        if (err) {
            showMessage('無法讀取檔案。');
            console.log('無法讀取檔案：' + err.message);
            return;
        }

        try {
            load(JSON.parse(data));
        }
        catch (e) {
            showMessage('無法解析內容。');
            console.log('無法解析內容:' + e);
        }
    });
}
function writeFile(path, item = '') {
    fs.writeFile(path, save(), (err) => {
        console.log(item);
        if (err) {
            showMessage('無法建立檔案。');
            console.log('無法建立檔案：' + err.message);
            return;
        }
        else if (item) {
            $('#proj-list').prepend('<li class="ui-selectee">' + item + '</li>');
        }
    });
    return;
}

function save() {
    let compList = [];
    let membList = [];
    let teamList = [];
    let formList = [];
    let recoList = [];
    let drawList = [];

    $('#comp-list').find('.list-row').each(function () {
        let $this = $(this);

        compList.push({
            num: $this.data('num'),
            name: $this.data('name'),
            price: $this.data('price')
        });

        console.log(compList);
    });

    $('#memb-list').find('.list-row').each(function () {
        let $this = $(this);

        membList.push({
            lastName: $this.data('lname'),
            firstName: $this.data('fname'),
            job: $this.data('job'),
            outside: $this.data('outside'),
            absence: $this.data('absence'),
            vice: $this.data('vice')
        });
    });

    $('#team-list').find('.list-row').each(function () {
        let $this = $(this);

        teamList.push({
            name: $this.data('name'),
            absence: $this.data('absence'),
            keeper: $this.data('keeper')
        });
    });

    return JSON.stringify({
        title: $('#data-title').val(),
        method: $('#data-method').find('input:checked').val(),
        date: $('#data-date').val(),
        time: $('#data-time').val(),
        room: $('#data-room').val(),
        priceType: $('#data-price-type').find('input:checked').val(),
        briefing: $('#data-briefing').find('input:checked').val(),
        barrier: $('#data-barrier').val(),
        barrierType: $('#data-barrier-type').find('input:checked').val(),
        drawType: $('#data-draw-type').find('input:checked').val(),
        highest: $('#data-highest').val(),
        numType: $('#data-num-type').find('input:checked').val(),
        compList: compList,
        membList: membList,
        teamList: teamList,
        formList: formList,
        drawList: drawList,
        recoList: recoList
    });
}
function load(json) {
    let $list;
    let $spare;

    // 重置
    $('#main-form').empty();
    resetRecord();

    // 基本資料
    $('#data-title').val(json.title);
    $('input[name=price-type]').val([json.priceType]);
    $('input[name=briefing]').val([json.briefing]);
    $('#data-date').val(json.date);
    $('#data-time').val(json.time);
    $('#data-room').val(json.room);
    $('input[name=method]').val([json.method]);
    $('#data-barrier').val(json.barrier);
    $('input[name=barrier-type]').val([json.barrierType]);
    $('input[name=draw-type]').val([json.drawType]);
    $('#data-highest').val(json.highest);
    $('input[name=num-type]').val([json.numType]);
    updateInitData();

    // 廠商資料
    $list = $('#comp-list');
    $spare = $('#comp-spare');
    $list.children().appendTo($spare);
    $.each(json.compList, (index, value) => {
        let num = SERIAL[$('input[name=num-type]:checked').val()][index];
        $spare
            .find('> :first-child')
            .appendTo($list)
            .data('index', index)
            .data('num', num)
            .data('name', value.name || '')
            .find('> :first-child').text(num)
            .next('input').val(value.name)
            .next('input').val(value.price).updateCompanyPrice();
    });

    // 委員資料
    $list = $('#memb-list');
    $spare = $('#memb-spare');
    $list.children().appendTo($spare);
    $.each(json.membList, function (index, value) {
        $spare
            .find('> :first-child')
            .appendTo($list)
            .data('index', index)
            .data('job', value.job)
            .data('outside', value.outside)
            .data('absence', value.absence)
            .data('vice', value.vice)
            .find('> :first-child').val(value.lastName)
            .next().val(value.firstName)
            .next().next().val(value.job)
            .next().find('input').eq([value.outside]).prop('checked', true).end()
            .checkboxradio('refresh').end()
            .next().find('input').eq([value.absence]).prop('checked', true).end()
            .checkboxradio('refresh').end()
            .next().find('input').prop('disabled', index !== 1).prop('checked', +value.vice).end()
            .parent().updateMemberName();
    });

    // 工作小組資料
    $list = $('#team-list');
    $spare = $('#team-spare');
    $list.children().appendTo($spare);
    $.each(json.teamList, function (index, value) {
        $spare
            .find('> :first-child')
            .appendTo($list)
            .data('index', index)
            .data('name', value.name)
            .data('absence', value.absence)
            .data('keeper', value.keeper)
            .find('> :first-child').val(value.name)
            .next().find('input').eq([value.absence]).prop('checked', true).end()
            .checkboxradio('refresh').end()
            .next().find('input').prop('checked', +value.keeper);
    });

    updateMainForm();
    updateMember();
    updateTeam();
}
function reset() {
    // 重置
    $('#main-form').empty();
    resetRecord();

    // 基本資料
    $('#data-title').val('');
    $('input[name=price-type]').val(0);
    $('input[name=briefing]').val(0);
    $('#data-date').val('');
    $('#data-time').val('下午2時');
    $('#data-room').val('本局3樓第2會議室');
    $('input[name=method]').val(1);
    $('#data-barrier').val('75');
    $('input[name=barrier-type]').val(0);
    $('input[name=draw-type]').val(1);
    $('#data-highest').val('');
    $('input[name=num-type]').val(0);

    // 廠商資料
    $('#comp-list').children().appendTo($('#comp-spare'));

    // 委員資料
    $('#memb-list').children().appendTo($('#memb-spare'));

    // 工作小組資料
    $('#team-list').children().appendTo($('#team-spare'));

    updateMember();
    updateTeam();
}

// 資料
function updateInitData() {
    $('.title').text($('#data-title').val());
    $('.room').text($('#data-room').val());

    let date = $('#data-date').val();
    $('#reco-date').text(date + $('#data-time').val());
    $('#form-date').text(date.slice(0, -5));

    updateData($('#data-method').find('input:checked').attr('id'));
    updateData($('#data-briefing').find('input:checked').attr('id'));
}
function updateData(id) {
    switch (id) {
        case 'data-title':
            $('.title').text($('#data-title').val());
            break;
        case 'data-room':
            $('.room').text($('#data-room').val());
            break;
        case 'data-time':
            $('#reco-date').text($('#data-date').val() + $('#data-time').val());
            break;
        case 'data-date':
            let date = $('#data-date').val();
            $('#reco-date').text(date + $('#data-time').val());
            $('#form-date').text(date.slice(0, -5));
            break;
        case 'method-1':
            $('.term-method').text('評選');
            $('.term-group').text('委員會');
            $('.term-win').text('最有利標');
            break;
        case 'method-2':
            $('.term-method').text('評選');
            $('.term-group').text('委員會');
            $('.term-win').text('優勝廠商');
            break;
        case 'method-3':
            $('.term-method').text('評審');
            $('.term-group').text('小組');
            $('.term-win').text('符合需要廠商');
            break;
        case 'price-1':
        case 'price-2':
            updateDraw();
            break;
        case 'briefing-1':
            $('#reco-qa').text('（略）');
            break;
        case 'briefing-2':
            $('#reco-qa').text('（無）');
            break;
        case 'data-barrier':
            $('.barrier').text($('#data-barrier').val());
            updateCalc();
            break;
        case 'barrier-1':
            $('.valid-row').addClass('hide');
            updateCalc();
            break;
        case 'barrier-2':
            $('.valid-row').removeClass('hide');
            updateCalc();
            break;
        case 'draw-1':
        case 'draw-2':
        case 'draw-3':
            updateDraw();
            break;
        case 'data-highest':
            $('.highest-name').text($('#data-highest').val());
            break;
        case 'num-1':
        case 'num-2':
        case 'num-3':
        case 'num-4':
            let numList = SERIAL[$('#data-num-type').find('input:checked').val()];
            $('#comp-list').find('.list-row').each((index, li) => {
                $(li)
                    .data('num', numList[index])
                    .find('> :first-child')
                    .text(numList[index]);
            });
            $('#main-form').find('.comp-num').each((index, li) => {
                $(li).text(numList[index]);
            });
            break;
    }
}
function checkDuplicatePrice() { // 確認有無廠商標價相同
    let values = $("#comp-list").find(".price").map(function () { return $(this).val(); }).get();
    return values.length > (new Set(values)).size;
}
function updateDraw() {
    // 是否顯示最配分最高項
    if (+$('#data-draw-type').find('input:checked').val() === 1 &&
        $('#comp-list').find('li').length > 1 &&
        (+$('#data-price-type').find('input:checked').val() === 1 || checkDuplicatePrice())) {
        $('.highest-block').removeClass('hide');
        $('#main-form').find('.colspan').attr('colspan', 3);
    } else {
        $('.highest-block').addClass('hide');
        $('#main-form').find('.colspan').attr('colspan', 2);
    }

    // 更新計算結果
    updateCalc();
}
function fomatDate(dayName, inst) {
    // 民國年轉換
    $(this).val(
        (inst.selectedYear < 1911 ? inst.selectedYear : inst.selectedYear - 1911) + '年' +
        (inst.selectedMonth + 1) + '月' +
        inst.selectedDay + '日' +
        '（星期' + dayName + '）');

    updateData('data-date');
}

// 廠商
function addCompany() {
    let $list = $('#comp-list');
    let $spare = $('#comp-spare').children();
    let index = $list.children().length;
    let num = SERIAL[$('input[name=num-type]:checked').val()][index];

    if ($spare.length <= 1) {
        $('#comp-add-btn').addClass('hide');
    }

    $spare
        .eq(0)
        .appendTo($list)
        .removeData()
        .data('index', index)
        .data('num', num)
        .find('> :first-child')
        .text(num)
        .next('input').val('')
        .next('input').val('').updateCompanyPrice();

    updateMainForm();
}
function updateCompanyList() {  // 變動廠商順序
    let numList = SERIAL[$('input[name=num-type]:checked').val()];
    $('#comp-list').find('.list-row').each(function (index) {
        $(this)
            .data('index', index)
            .data('num', numList[index])
            .find('> :first-child')
            .text(numList[index]);
    });

    updateMainForm();
}
jQuery.prototype.removeCompany = function () {
    $('#comp-spare')
        .append(this)
        .next()
        .removeClass('hide');

    updateCompanyList();
};
jQuery.prototype.updateCompanyName = function () {
    this.parent().data('name', this.val() || '');
};
jQuery.prototype.updateCompanyPrice = function () {
    // 移除小數
    let price = Math.floor(this.val());
    this.val(price);

    // 拆億萬元
    let yi = Math.floor(price / 100000000);
    let wan = Math.floor(price % 100000000 / 10000);
    let yuan = price % 10000;

    // 加逗號
    function fomatPrice(price) {
        return String(price).replace(/\B(?=(\d{3})+(?!\d))/g, ',');
    };

    // 產出顯示文字
    let text = '新臺幣' +
        (yi ? fomatPrice(yi) + '億' : '') +
        (wan ? fomatPrice(wan) + '萬' : '') +
        (yuan ? fomatPrice(yuan) : (price ? '' : '0')) + '元';

    this.next().text(text);
    this.parent().data('price', price);
    this.parent().data('price-show', text);

    updateMainForm();
};

// 委員
function addMember() {
    let $list = $('#memb-list');
    let $spare = $('#memb-spare').children();
    let index = $list.children().length;

    if ($spare.length <= 1) {
        $('#memb-add-btn').addClass('hide');
    }

    $spare
        .eq(0)
        .appendTo($list)
        .removeData()
        .data('index', index)
        .data('outside', '0')
        .data('absence', '0')
        .data('vice', '0')
        .find('.pure-box').val('').end()
        .find('.radio-set > input').filter(':first-child')
        .prop('checked', true).end()
        .checkboxradio('refresh').end()
        .find('.vice')
        .prop('disabled', index !== 1).prop('checked', false).end()
        .updateMemberName();

    updateMainForm();
    updateMember();
}
function updateMemberList() { // 變動委員順序
    $('#memb-list').find('.list-row').each(function (index) {
        $(this)
            .data('index', index)
            .data('vice', '0')
            .find('.vice')
            .prop('disabled', index !== 1).prop('checked', false).end()
            .updateMemberName();
    });

    updateMember();
}
jQuery.prototype.removeMember = function () {
    $('#memb-spare')
        .append(this)
        .next()
        .removeClass('hide');

    updateMemberList();
    updateMainForm();
};
jQuery.prototype.updateMemberName = function () {
    let $cols = this.children();
    let title = this.data('index') ? (+this.data('vice') ? '副召集人' : '委員') : '召集人';
    let lname = $cols.eq(0).val();
    let fname = $cols.eq(1).val();
    let name = lname + title + fname;

    $cols.eq(2).text(name);
    this.data('name', name || '');
    this.data('lname', lname || '');
    this.data('fname', fname || '');
};
jQuery.prototype.updateMemberJob = function () {
    this.parent().data('job', this.val());
};
jQuery.prototype.updateMemberOutside = function () {
    this.closest('li').data('outside', this.val());
};
jQuery.prototype.updateMemberAttend = function () {
    this.closest('li').data('absence', this.val());
};
jQuery.prototype.updateMemberVice = function () {
    this.closest('li').data('vice', +this.prop('checked')).updateMemberName();
};

// 工作小組
function addTeam() {
    let $list = $('#team-list');
    let $spare = $('#team-spare').children();
    let index = $list.children().length;

    if ($spare.length <= 1) {
        $('#team-add-btn').addClass('hide');
    }

    $spare
        .eq(0)
        .appendTo($list)
        .removeData()
        .data('index', index)
        .data('absence', '0')
        .data('keeper', '0')
        .find('.pure-box').val('').end()
        .find('.radio-set > input').filter(':first-child')
        .prop('checked', true).end()
        .checkboxradio('refresh')

    updateTeam();
}
function updateTeamList() { // 變動委員順序
    $('#team-list').find('.list-row').each(function (index) {
        $(this).data('index', index);
    });

    updateTeam();
}
jQuery.prototype.removeTeam = function () {
    $('#team-spare')
        .append(this)
        .next()
        .removeClass('hide');

    updateTeamList();
};
jQuery.prototype.updateTeamName = function () {
    this.parent().data('name', this.val() || '');
};
jQuery.prototype.updateTeamAttend = function () {
    this.closest('li').data('absence', this.val());
};
function updateTeamKeeper() {
    $('#team-list').find('.list-row').each(function () {
        let $this = $(this);
        $this.data('keeper', +$this.find('.keeper').prop('checked'));
    });
};

function updateMainForm() {
    let highest = $('#data-highest').val();
    let $form = $('#main-form');
    let $row = {
        num: $('<tr><td class="fixed-col">廠商編號</td></tr>'),
        name: $('<tr><td>廠商名稱</td></tr>'),
        header: $('<tr class="foldable"><td><span class="term-method">評選</span>委員</td></tr>'),
        score: $('<tr class="score"><td></td></tr>'),
        price: $('<tr><td>廠商標價</td></tr>'),
        highest: $('<tr class="highest-block"><td class="crowd-col">配分最高之<span class="term-method">評選</span>項目' +
            '(<span class="highest-name">' + highest + '</span>)之得分合計</td></tr>'),
        avg: $('<tr class="avg-row"><td>平均總評分</td></tr>'),
        valid: $('<tr class="valid-row"><td class="crowd-col">出席委員過半數評為<span class="barrier">' +
            $('#data-barrier').val() + '</span>（含）以上</td></tr>'),
        sum: $('<tr><td>序位和(序位合計)</td></tr>'),
        rank: $('<tr><td>序位名次</td></tr>'),
        rerank: $('<tr class="hide"><td>綜合評分序位</td></tr>'),
        ballot: $('<tr class="hide"><td>抽籤順位</td></tr>')
    };
    let compList = [];

    // 增加廠商
    $('#comp-list').find('.list-row').each(function (index) {
        let $this = $(this);
        let compIdx = ' comp-' + index;
        let name = $this.data('name');

        // 增加廠商欄
        $row.num.append('<td class="comp-num colspan">' + $this.data('num') + '</td>');
        $row.name.append('<td class="comp-name' + compIdx + ' colspan">' + name + '</td>');
        $row.header.append('<td>得分合計</td><td>序位</td><td class="highest-name highest-block">' + highest + '</td>');
        $row.score.append(
            '<td><input type="number" class="sum' + compIdx + ' form-box pure-box" step="1" min="0" max="100"></td>' +
            '<td class="rank' + compIdx + '">-</td>' +
            '<td class="highest-block"><input type="number" class="highest' + compIdx + ' form-box pure-box"></td>');
        $row.price.append('<td class="price' + compIdx + ' colspan">' + $this.data('price-show') + '</td>');
        $row.highest.append('<td class="highest-sum' + compIdx + ' account-col colspan">-</td>');
        $row.avg.append('<td class="avg' + compIdx + ' account-col colspan">-</td>');
        $row.valid.append('<td class="valid' + compIdx + ' account-col colspan">-</td>');
        $row.sum.append('<td class="rank-sum' + compIdx + ' account-col colspan">-</td>');
        $row.rank.append('<td class="rank-rank' + compIdx + ' account-col colspan">-</td>');
        $row.rerank.append('<td class="rerank' + compIdx + ' draw-col colspan">99</td>');
        $row.ballot.append('<td class="ballot' + compIdx + ' draw-col colspan">99</td>');

        // 增加廠商敘述
        compList.push('「<span class="comp-name' + compIdx + '">' + name + '</span>」');

        // 增加廠商排序項
        // $('#rerank-comp-' + index).find('.comp-name').text(name);
        // $('#ballot-comp-' + index).find('.comp-name').text(name);
    });

    // 更新表格
    $form.empty().append($row.num).append($row.name).append($row.header);
    $('#memb-list').find('.list-row').each(function (index) {
        $form.append($row.score.clone().find('> :first-child').text(index + 1).end());
    });
    $form.append($row.price).append($row.highest).append($row.avg).append($row.valid)
        .append($row.sum).append($row.rank).append($row.rerank).append($row.ballot);

    // 更新紀錄
    $('#reco-comp').html('投標廠商' + compList.length +
        '家且其資格及<span class="term-method">評選</span>項目以外資料經審查合格，廠商名稱為' +
        compList.join('、') + '。');

    updateData($('#data-barrier-type').find('input:checked').attr('id'));
    updateDraw();
}

function updateMember() {
    let $form = $('#memb-form');
    let $member = $('#memb-list').find('.list-row');
    let $name = $form.find('.name-col');

    // 調整欄位
    while ($name.length < $member.length || $name.length < 8) {
        $form.find('tr').each(function () {
            $(this).find('> :last-child').clone().appendTo($(this));
        });
        $name = $form.find('.name-col');
    }
    while ($name.length > $member.length + 1 && $name.length > 8) {
        $form.find('tr').each(function () {
            $(this).find('> :last-child').remove();
        });
        $name = $form.find('.name-col');
    }

    let $job = $form.find('.job-col');
    let $sign = $form.find('.sign-col');
    let chairman = '';
    let attendList = [];
    let absenceList = [];
    let count = [0, 0];
    let index = 0;

    // 處理每位委員資料
    $member.each(function () {
        let $this = $(this);
        let name = $this.data('name');

        $name.eq(index).text(name);
        $job.eq(index).text($this.data('job') || '');

        // 外部 OR 內部
        count[+$this.data('outside')]++;

        // 請假 OR 出席
        if (+$this.data('absence')) {
            absenceList.push(name);
            $sign.eq(index).text('缺席');
        } else {
            attendList.push(name);
            $sign.eq(index).text('出席');
            chairman = chairman || name;
        }

        index++;
    });

    // 會議紀錄
    $('#reco-chairman').text(chairman);
    $('#reco-memb').text((count[1] ? '專家學者委員' + count[1] + '人、' : '') + '專家學者以外委員' + count[0] + '人，共計' + index + '人組成。');
    $('#reco-attend').text(attendList.join('、') || '無');
    $('#reco-absence').text(absenceList.join('、') || '無');
    $('#reco-sign').html(
        '<tr><td>委員姓名</td><td>簽名</td></tr><tr><td>' +
        attendList.join('</td><td></td></tr><tr><td>') + '</td><td></td>');

    // 空格畫線
    while (index < $name.length) {
        $name.eq(index).html('<img class="cross" src="images/cross.svg">');
        $job.eq(index).html('<img class="cross" src="images/cross.svg">');
        $sign.eq(index).html('<img class="cross" src="images/cross.svg">');
        index++;
    }
}

function updateTeam() {
    let $team = $('#team-list').find('.list-row');
    let keeper = '';
    let attendList = [];

    // 處理每位工作小組成員資料
    $team.each(function () {
        let $this = $(this);
        let name = $this.data('name');

        if (!+$this.data('absence')) {
            keeper = name;
        }

        if (!+$this.data('absence')) {
            attendList.push(name);
        }
    });

    $('#reco-keeper').text(keeper);
    $('#reco-team').html(
        (attendList.join('、') || '無') +
        '（協助<span class="term-method">評選</span><span class="term-group">委員會</span>' +
        '辦理與<span class="term-method">評選</span>有關之作業）');
}

function updateCalc() {

    // 變數
    let $form = $('#form');
    let barrier = +$('#data-barrier').val();
    let barrierType = +$('input[name=barrier-type]:checked').val();
    let drawType = +$('input[name=draw-type]:checked').val();
    let priceType = +$('input[name=price-type]:checked').val();
    let total = 0;
    let valid = 0;
    let count = 0;
    let rankSums = [];
    let rankSort = [];
    let result = [];
    let reRank = false;
    let ballot = false;

    // 函式
    let sortNumber = function (a, b) {
        return a - b;
    };
    let sortCompany = function (a, b) {
        var temp = a.rank - b.rank;
        if (temp) {
            a.sortBy[0] = b.sortBy[0] = true;
            return temp;
        }

        temp = priceType ? 0 : a.price - b.price;
        if (temp) {
            a.sortBy[1] = b.sortBy[1] = true;
            return temp;
        }

        temp = drawType === 1 ? -(a.highest - b.highest) : 0;
        if (temp) {
            a.sortBy[2] = b.sortBy[2] = true;
            return temp;
        }

        temp = drawType === 2 ? -(a.first - b.first) : 0;
        if (temp) {
            a.sortBy[3] = b.sortBy[3] = true;
            return temp;
        }

        reRank = !drawType;

        temp = drawType === 0 ? a.reRank - b.reRank : 0;
        if (temp) {
            a.sortBy[4] = b.sortBy[4] = true;
            return temp;
        }

        ballot = true;

        temp = a.ballot - b.ballot;
        if (temp) {
            a.sortBy[5] = b.sortBy[5] = true;
            return temp;
        }

        a.sortBy[6] = b.sortBy[6] = true;
        return 0;
    };

    // 初始化廠商資料
    $('#comp-list').find('.list-row').each(function (index) {
        let $this = $(this);

        rankSums.push(0);
        result.push({
            index: index,
            name: $this.data('name'),
            price: $this.data('price'),
            priceShow: $this.data('price-show'),
            sum: 0,
            validCount: 0,
            avg: 0,
            valid: false,
            win: true,
            highest: 0,
            rankSum: 0,
            rank: 9,
            first: 0,
            reRank: 9,
            ballot: 9,
            sortBy: [false, false, false, false, false, false, false]
        });
    });

    $form.find('.score').each(function () {
        let $this = $(this);
        let sums = [];
        let sort = [];
        let hasValue = 0;

        $this.find('.sum').each(function (index) {
            let sum = +$(this).val();

            sums.push(sum);
            result[index].sum += sum;
            hasValue += sum;
            if (sum >= barrier) result[index].validCount++;
        });

        $this.find('.highest').each(function (index) {
            let highest = +$(this).val();

            result[index].highest += highest;
            hasValue += highest;
        });

        // 無視空行
        if (!hasValue) {
            $this.find('.rank').text('-');
            return;
        }

        count++;

        // 排序
        sort = sums.slice(0).sort(sortNumber).reverse();
        $this.find('.rank').each(function (index) {
            let rank = sort.indexOf(sums[index]) + 1;

            $(this).text(rank);
            rankSums[index] += rank;
            result[index].rankSum += rank;
            if (rank === 1) {
                result[index].first++;
            }
        });
    });

    // 最高項目計算
    $form.find('.highest-sum').each(function (index) {
        $(this).text(result[index].highest || '-');
    });

    // 平均總分計算
    $form.find('.avg').each(function (index) {
        let avg = result[index].sum / count;

        result[index].avg = avg;
        $(this).text(avg ? avg.toFixed(2) : '-');

        total++;
        if ((barrierType && result[index].validCount > (count / 2.0)) ||
            (!barrierType && avg >= barrier)) {
            valid++;
            result[index].valid = true;
        }
    });

    // 合格計算
    $form.find('.valid').each(function (index) {
        $(this).text(result[index].valid ? '是' : '否');
    });

    // 序位和計算
    $form.find('.rank-sum').each(function (index) {
        $(this).text(rankSums[index] || '-');
    });

    // 序位和排序
    rankSort = rankSums.slice(0).sort(sortNumber);
    $form.find('.rank-rank').each(function (index) {
        let rank = rankSums[index] ? rankSort.indexOf(rankSums[index]) + 1 : '-';

        $(this).text(rank);
        result[index].rank = rank;
    });

    // 同序位數據
    $form.find('.rerank').each(function (index) {
        result[index].reRank = +$(this).text();
    });

    $form.find('.ballot').each(function (index) {
        result[index].ballot = +$(this).text();
    });

    // 產出結果及結論
    let resultText = [];
    let resolution = [];
    let resolutionOut = [];
    let prevRank = 0;

    result.sort(sortCompany);
    $.each(result, function (index, comp) {
        resultText.push(
            '，「<span class="comp-name comp-' + comp.index + '">' + comp.name +
            '</span>」序位名次' + (prevRank === comp.rank ? '同' : '') +
            '為第' + comp.rank + '（序位和' + comp.rankSum + '）');
        prevRank = comp.rank;

        if (comp.valid) {
            if (comp.win) {
                resolution.push(
                    '序位第' + comp.rank +
                    (comp.sortBy[1] ? '且標價' + comp.priceShow : '') +
                    (comp.sortBy[2] ? '且配分最高之<span class="term-method"></span>項目得分合計' + comp.item : '') +
                    (comp.sortBy[3] ? '且獲得' + comp.first + '位<span class="term-method"></span>委員評定序位第一' : '') +
                    (comp.sortBy[4] ? '且再行綜合評審序位第' + comp.reRank : '') +
                    (comp.sortBy[5] ? '且抽籤結果為第' + comp.ballot + '順位' : '') +
                    '之「<span class="comp-name comp-' + comp.index + '">' + comp.name +
                    '</span>」為第' + (index + 1) +
                    '<span class="term-win"></span>');
            } else {
                resolutionOut.push(
                    '序位第' + comp.rank +
                    '之「<span class="comp-name comp-' + comp.index + '">' + comp.name + '</span>」');
            }
        }
    });

    $('#reco-result').html(resultText.join(''));
    $('#reco-resolution').html(total +
        '家參與<span class="term-method"></span>廠商' + (total === valid ? '' : '中' + valid + '家') +
        (barrierType ? ((total > 1 && total === valid ? '均' : '') + '經出席委員過半數評為') :
            ('平均總評分' + (total > 1 && total === valid ? '均' : '') + '達')) +
        barrier + '分（含）以上，經出席委員過半數決議：' + resolution.join('，') +
        (resolutionOut.length ? resolutionOut.join('、') + '與上開' +
            resolution.length + '廠商相差較大，不列為<span class="term-win"></span>' : ''));

    // 更新評選關鍵字
    updateData($('#data-method').find('input:checked').attr('id'));
}

function resetRecord() {
    $('#recos')
        .find('.auto').removeClass('hide').end()
        .find('.free').empty().addClass('hide');
}

function printArea(id) {
    switch (id) {
        case 'form-print-btn':
            let size = $('input[name=form-size]:checked').val();
            let $area = $('#forms');
            let height = $area.outerHeight();
            let css = size === '0' ? (height < 1615 ? 'n' : height < 1785 ? 's' : 'xs') : size;
            $area.printThis({
                loadCSS: 'style/style.print.form.' + css + '.css',
                pageTitle: '評選(審)總表'
            });
            break;
        case 'reco-print-btn':
            $('#recos').printThis({
                loadCSS: 'style/style.print.record.css',
                pageTitle: '評選(審)會議紀錄'
            });
            break;
    }
}