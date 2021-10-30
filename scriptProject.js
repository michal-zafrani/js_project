
$(document).ready(function () {
    $('#contentCalculators, #contentTaskboard ,#contentGame').hide()

    $('#linkCaculator').click(function () {
        $('#contentCalculators, .boxTabSide').show()
        $('.home, #contentTaskboard ,#contentGame').hide();
    });

    
    $('#linkTaskBoard').click(function () {
        $('.home, #contentCalculators, #partTable, #contentGame').hide()
        $('#contentTaskboard, .taskMain, .boxTabSide').show();
        $('.taskMain ,#backTasks').removeClass('d-none')
        runOfArrayTasks();
    });

    $('#linkGame').click(function () {
        $('#contentGame').show();
        $('.home, #contentCalculators, #contentTaskboard, .boxTabSide').hide();
        $('#openModal').click();
    });

    $('#linkCaculator, #linkTaskBoard, #linkGame').click(function () {
        $('.activeLink').toggleClass('activeLink');
        $(this).toggleClass('activeLink');
    });

    $('#homeLink').click(function () {
        window.location.reload();
    })

    // script calculator ------------------------------------------------------------

    let calculators = [
        { number1: 0, number2: 0, res: 0, actionMath: '' },
    ];
    let posNowId = '';
    let i = 0;
    $('#btnNewCalcu').hide();

    $('.numMath').click(function () {
        posNowId = $(this).parent().parent().attr('id');
        i = posNowId.charAt(5); //return position of calculator in array calculator

        let num = parseInt($(this).text());
        if (!calculators[i].actionMath) {
            if (!calculators[i].number1) {
                calculators[i].number1 = num;
            } else {
                calculators[i].number1 = calculators[i].number1 * 10 + num;
            }
            $(`#${posNowId} .showResult`).text(calculators[i].number1);
            $(`#${posNowId} .showEx`).text(calculators[i].number1);
        } else {
            if (!calculators[i].number2) {
                calculators[i].number2 = num;
            } else {
                calculators[i].number2 = calculators[i].number2 * 10 + num;
            }
            $(`#${posNowId} .showResult`).text(calculators[i].number2)
            $(`#${posNowId} .showEx`).text(calculators[i].number1 + ' ' + calculators[i].actionMath + ' ' + calculators[i].number2);
        }
    })

    $('.actionMath').click(function () {
        posNowId = $(this).parent().parent().attr('id');
        i = posNowId.charAt(5);

        if (!calculators[i].number1) {
            calculators[i].number1 = calculators[i].res;
        }
        if (calculators[i].number1) {
            if (calculators[i].actionMath) {
                calculators[i].number1 = result();
                calculators[i].number2 = 0;
            }
            calculators[i].actionMath = $(this).text();
            $(`#${posNowId} .showEx`).text(calculators[i].number1 + ' ' + calculators[i].actionMath);
        }
    });

    $('.resHachuz').click(function () {
        posNowId = $(this).parent().parent().attr('id');
        i = posNowId.charAt(5);

        if (calculators[i].actionMath === '+' || calculators[i].actionMath === '-') {
            calculators[i].number2 = calculators[i].number1 * (calculators[i].number2 / 100);
        } else if (calculators[i].actionMath === '*' || calculators[i].actionMath === '/') {
            calculators[i].number2 = calculators[i].number2 / 100;
        }
        $(`#${posNowId} .showResult`).text(calculators[i].number2)
        $(`#${posNowId} .showEx`).text(calculators[i].number1 + ' ' + calculators[i].actionMath + ' ' + calculators[i].number2);
        $(`#${posNowId} .resAll`).click();
    });

    $('.resAll').click(function () {
        posNowId = $(this).parent().parent().attr('id');
        i = posNowId.charAt(5);

        result();
        $(`#${posNowId} .showResult`).text(calculators[i].res);
    });

    function result() {
        switch (calculators[i].actionMath) {
            case '+':
                calculators[i].res = calculators[i].number1 + calculators[i].number2;
                break;
            case '-':
                calculators[i].res = calculators[i].number1 - calculators[i].number2;
                break;
            case '*':
                calculators[i].res = calculators[i].number1 * calculators[i].number2;
                break;
            case '/':
                calculators[i].res = calculators[i].number1 / calculators[i].number2;
                break;
            default:
                break;
        }

        if (calculators[i].res % 1 !== 0) {
            calculators[i].res = calculators[i].res.toPrecision(3)
        }
        calculators[i].number1 = calculators[i].number2 = calculators[i].actionMath = 0;
        return calculators[i].res;
    }

    $('.cKey').click(function () {
        posNowId = $(this).parent().parent().attr('id');
        i = posNowId.charAt(5);

        calculators[i].number1 = calculators[i].number2 = calculators[i].actionMath = calculators[i].res = 0;
        $(`#${posNowId} .showResult`).text('0.00');
        $(`#${posNowId} .showEx`).text('00');
    });

    $('.changeColor').change(function () {
        $(this).parent().parent().removeClass('bgGrad');
        $(this).parent().parent().css('background-color', `${$(this).val()}`);
    });

    $('.addNew').click(function () {
        $(this).parent().parent().clone(true).prependTo('#contentCalculators');
        let position = ($('.div_parent_machsevon').length) - 1;
        $('.div_parent_machsevon:first').attr('id', `calcu${position}`);
        $('.div_parent_machsevon:first .showResult').text('0.00')
        $('.div_parent_machsevon:first .showEx').text('00')
        calculators.push({ number1: 0, number2: 0, res: 0, actionMath: '' })
    });

    $('.closeX').click(function () {
        if ($('.div_parent_machsevon').length === 1) {
            $('.div_parent_machsevon').hide();
            $('#btnNewCalcu').show();
        } else
            $(this).parent().parent().remove();
    });

    $('#btnNewCalcu').click(function () {
        $(this).next().show();
        $(this).hide();
        $('.cKey').click();
    });

    // לוח משימות ----------------------------------------------------------------------
    let arrTasks = [];
    let ArrMonth = ['#m01', '#m02', '#m03', '#m04', '#m05', '#m06', '#m07', '#m08', '#m09', '#m10', '#m11', '#m12'];
    let dateNow = new Date();

    $(`${ArrMonth[dateNow.getMonth()]}`).addClass('nowMonth');
    arrTasks = localStorage.getItem('arrTaskInLocal') ? JSON.parse(localStorage.getItem('arrTaskInLocal')) : [];

    $('#goCalendar').click(function () {
        $('.taskMain, .divEmpty, #contentTasks').hide();
        $('#partTable').show();
    });
    $('#backTasks').click(function () {
        $('.taskMain, .divEmpty, #contentTasks').show();
        $('#partTable').hide();
    });

    $('#alertBoard').hide();
    $('#btnAdd').click(function () {
        if (($('#taskTitle').val() !== '') && ($('#dateTask').val() !== '')) {
            let dateTask = new Date(`${$('#dateTask').val()} 23:59:59`);
            let d = new Date();
            if (d <= dateTask) {
                arrTasks.push({
                    title: $('#taskTitle').val(),
                    description: $('#taskDescription').val(),
                    timeTask: dateTask,
                    checkOn: false,
                });
                localStorage.setItem('arrTaskInLocal', JSON.stringify(arrTasks));
                $('#alertBoard').hide();
                runOfArrayTasks();
                $('#taskTitle,#taskDescription,#dateTask').val('');
            } else {
                $('#alertBoard').text('* תאריך המשימה עבר').show();
            }
        }else {
            $('#alertBoard').text('* אחד השדות ריקים').show();
        }
    });

    function runOfArrayTasks() {
        $('#contentTasks').empty();
        $('p').remove('.tableMonth p');
        arrTasks = arrTasks;
        for (let i = 0; i < arrTasks.length; i++) {
            let d = new Date();
            arrTasks[i].timeTask = new Date(`${arrTasks[i].timeTask}`)
            if (d > arrTasks[i].timeTask) {
                arrTasks.splice(i, 1);
                i--;
            } else {
                createTaskBoard(arrTasks[i], i);
            }
        }
        localStorage.setItem('arrTaskInLocal', JSON.stringify(arrTasks));
    }

    function createTaskBoard(element, i) {
        let timeTaskObjDate = new Date(element.timeTask)
        let taskInHtml = `<div id='task${i}' class="col-12 col-sm-7 col-lg-10 col-xl-8 taskSin mx-auto text-center p-1 shadow-lg my-5">
                            <div class="col-12 bg-white text-center p-1 row m-0">
                            <div id='${i}vCircleCheck' class="vCircle vCircleCheck p-3 shadow" title='בוצע'><i class="fa fa-check fa-lg"></i></div>
                            <div id='${i}vCircleEditor' class="vCircle vCircleEditor p-3 shadow" title='ערוך'><i class="fa fa-pencil fa-lg"></i></div>
                            <div id='${i}vCircleDelete' class="vCircle vCircleDelete p-3 shadow" title='מחק'><i class="fa fa-trash-o fa-lg"></i></div>
                            <div id='${i}vCircleCopy' class="vCircle vCircleCopy p-3 shadow" title='שכפול משימה'><i class="fa fa-plus fa-lg"></i></div>
                            <div class="col-12 pt-3 contentTask">
                                <h3 class="font-weight-light">${element.title} </h3>
                                <p class="font-weight-light lead">${element.description}</p>
                                <span class=" font-weight-bold lead mx-2">${timeTaskObjDate.toLocaleDateString()}</span>
                            </div>
                            </div>
                        </div>`;

        $('#contentTasks').prepend(taskInHtml);


        if (element.checkOn === true) {
            $(`#task${i}>div`).addClass('does');
            $(`${ArrMonth[timeTaskObjDate.getMonth()]} div`).prepend(`<p><i class="fa fa-check fa-sm"></i><del><b>${element.title}</b> בתאריך: ${timeTaskObjDate.toLocaleDateString()}</del></p>`)
        } else {
            $(`${ArrMonth[timeTaskObjDate.getMonth()]} div`).prepend(`<p><b>${element.title}</b> בתאריך: ${timeTaskObjDate.toLocaleDateString()}</p>`)
        }

        $(`#${i}vCircleDelete`).click(function () {
            let id0 = this.id;
            let k = id0.slice(0, (id0.length - 13));
            deleteIndex(k);
        });

        $(`#${i}vCircleEditor`).click(function () {
            let id0 = this.id;
            let k = id0.slice(0, (id0.length - 13));
            $('#taskTitle').val($(`#task${k} .contentTask h3`).text());
            $('#taskDescription').val($(`#task${k} .contentTask p`).text());
            let b = ($(`#task${k} .contentTask span`).text()).split('.');
            let montb = b[1].length === 2 ? b[1] : '0' + b[1];
            let dayb = b[0].length === 2 ? b[0] : '0' + b[0];
            $('#dateTask').val(`${b[2]}-${montb}-${dayb}`);
            $('#taskTitle, #taskDescription, #dateTask').css('color', '#b6004c')
            $('#btnAdd span').text('שמור שינויים');
            deleteIndex(k);
            $('#btnAdd').click(function () {
                $('#btnAdd span').text('הוסף משימה');
                $('#taskTitle, #taskDescription, #dateTask').css('color', '')
            });
        });

        $(`#${i}vCircleCheck`).click(function () {
            let id0 = this.id;
            let k = id0.slice(0, (id0.length - 12));
            if (arrTasks[k].checkOn) {
                arrTasks[k].checkOn = false;
            } else {
                arrTasks[k].checkOn = true;
            }
            localStorage.setItem('arrTaskInLocal', JSON.stringify(arrTasks));
            runOfArrayTasks();
        });

        $(`#${i}vCircleCopy`).click(function () {
            let id0 = this.id;
            let sliceId = id0.slice(0, (id0.length - 11));
            arrTasks.splice(sliceId, 0, arrTasks[sliceId]);
            localStorage.setItem('arrTaskInLocal', JSON.stringify(arrTasks));
            arrTasks = JSON.parse(localStorage.getItem('arrTaskInLocal'));
            runOfArrayTasks();
        });

        $("#filterTask").val('');
    }

    $('#deleteTasks').click(function () {
        arrTasks = [];
        localStorage.removeItem('arrTaskInLocal');
        runOfArrayTasks();
    });

    function deleteIndex(index) {
        arrTasks.splice(index, 1);
        localStorage.setItem('arrTaskInLocal', JSON.stringify(arrTasks));
        runOfArrayTasks();
    }

    $("#filterTask").on("keyup", function () {
        let value = $(this).val().toLowerCase();
        $("#contentTasks h3").filter(function () {
            $(this).parentsUntil('#contentTasks').toggle($(this).text().toLowerCase().indexOf(value) > -1)
        });
    });

});

// game ------------------------------------------------------------------------------
let level = 3;
let levelInWords = 'קל';
let arryRnd = [];
let correct = 0;
let gamesSuccses = 0;
let gamesFail = 0;
let ip = 0;
let scores = 0;
let upScores = 100;
let gameOver = false;
let objBestDefult = [{ title: 'bestMuchScores', bestNum: 0, nameWinner: '' }, { title: 'bestMuchGamelevel3', bestNum: 0, nameWinner: '' }, { title: 'bestMuchGamelevel4', bestNum: 0, nameWinner: '' }, { title: 'bestMuchGamelevel5', bestNum: 0, nameWinner: '' },]
let best = JSON.parse(localStorage.getItem('best')) ? JSON.parse(localStorage.getItem('best')) : objBestDefult;
let arrPlayers = JSON.parse(localStorage.getItem('players')) ? JSON.parse(localStorage.getItem('players')) : [];
let nowPlayer = { name: '', indexonarr: null };

$(document).ready(function () {

    $('#modalOpenDiv2 , #modalOpenDiv3').hide();

    $('#modalOpenBtn1').click(function () {
        $('#modalOpenDiv2, #modalOpenDiv').toggle()

        $('#selectUser option:not(:first-child)').remove();
        arrPlayers.forEach(element => {
            $('#selectUser').append(`<option value="${element.name}">${element.name}</option>`)
        });
    });
    
    $('#modalOpenBtn2').click(function () {
        arrPlayers.forEach(element => {
            if (element.name === $('#userGame').val()) {
                $('#userGame').attr('placeholder', 'שם שחקן קיים הכנס שחקן אחר');
                $('#userGame').val('');
                $('#userGame').on('keyup',function(){
                    $('#userGame').attr('placeholder', 'הכנס שם שחקן');
                })
            }
        });
        if ($('#userGame').val() !== '' || $('#selectUser').val() !== 'בחר שחקן') {
            if ($('#selectUser').val() !== 'בחר שחקן') {
                nowPlayer.name = $('#selectUser').val();
            } else if ($('#userGame').val() !== '') {
                arrPlayers.push({ name: $('#userGame').val(), score: 0 });
                localStorage.setItem('players', JSON.stringify(arrPlayers));
                nowPlayer.name = $('#userGame').val();
                $('#userGame').val('');
            }
            arrPlayers.forEach((element, index) => {
                if (element.name === nowPlayer.name) {
                    nowPlayer.name = element.name;
                    scores = element.score;
                    nowPlayer.indexonarr = index;
                }
            });
            if (scores > 10000) {
                document.getElementById('level5').removeAttribute('disabled');
                $('#level5').removeClass('disabled');
            } else {
                document.getElementById('level5').setAttribute('disabled', 'disabled');
                $('#level5').addClass('disabled');
            }

            $('#modalOpenDiv3').show();
            $('#modalOpenDiv2').hide();
            $('#player ,#titleme span').text(nowPlayer.name);
        }
    });
    
    $('#btnBeginGame, #btnNewGame , #btnNewGame2').off("click");
    $('#btnBeginGame').click(startGame);

    $('#btnNewGame , #btnNewGame2').click(function () {
        $('#modalOpenDiv2 , #modalOpenDiv3').hide()
        $('#modalOpenDiv').show();
        $('#tableGame').empty();
        $('#myProgress').remove();
        level = 3;
        gamesSuccses = 0;
        gamesFail = 0;
        ip = 0;
        correct = 0;
        scores = 0;
        gameOver = false;
        best = JSON.parse(localStorage.getItem('best')) ? JSON.parse(localStorage.getItem('best')) : objBestDefult;
        arrPlayers = JSON.parse(localStorage.getItem('players')) ? JSON.parse(localStorage.getItem('players')) : [];
        nowPlayer = { name: '', indexonarr: null };
        $('#openModal').click();
        $('#numGames, #numWinV, #numWinX, #scores2 ,#scoremd').text('0');
    });

    function startGame() {
        createTable();
        putNamesAndBg();
        moveProgress();
    }

    function createTable() {
        $('#tableGame').empty();
        let divToHtml = '';
        for (let i = 0; i < level; i++) {
            divToHtml += '<div class="row mb-1">';
            for (let j = 0; j < level; j++) {
                divToHtml += '<div class="col m-1 border gmBit text-center"></div>';
            }
            divToHtml += '</div>';
        }
        $('#tableGame').append(divToHtml);
        $('#scores2 ,#scoremd').text(arrPlayers[nowPlayer.indexonarr].score);
    }

    function putNamesAndBg() {
        if (!gameOver) {
            arryRnd = doArrRandom(level);
            $('.gmBit').removeClass('bgBtnYes');
            $('.gmBit').html('');
            $('.gmBit').each(function (index, element) {
                if (arryRnd.indexOf(index) === -1) {
                    $(element).attr('name', 'no');
                } else {
                    $(element).attr('name', 'yes');
                    $(element).addClass('bgBtnYes');
                }
            });
            setTimeout(playGame, 1000);
        }
    }
    function playGame() {
        $('.gmBit').off("click");
        $('.gmBit').removeClass('bgBtnYes');
        $('.gmBit').click(function () {
            $(this).addClass('bgBtnYes');
            $(this).prop("onclick", null).off("click");
            if ($(this).attr('name') === 'yes') {
                correct++;
                if (correct === (level + level - 1)) {
                    correct = 0;
                    gamesSuccses++;
                    if((scores < 10000) && (scores + upScores) >= 10000){
                        $('#mumcheAl').animate({opacity:'100%'},'slow');
                        setTimeout(() => {
                            $('#mumcheAl').css('opacity','0%');
                        }, 2000);
                    }
                    scores += upScores;
                    $('.gmBit').prop("onclick", null).off("click");
                    $('.gmBit').html('<i class="fa fa-check fa-2x text-white scales"></i>');
                    $('#numWinV, #countV').text(gamesSuccses);
                    $('#scores2 ,#scoremd ,#scores').text(scores);
                    setTimeout(() => {
                        putNamesAndBg();
                    }, 500);
                    $('#countGames, #numGames').text(gamesFail + gamesSuccses);
                }
                return;
            } else {
                correct = 0;
                gamesFail++;
                $('.gmBit').prop("onclick", null).off("click");
                $('.gmBit').html('<i class="fa fa-times fa-2x text-white scales"></i>');
                $('#numWinX, #countX').text(gamesFail);
                setTimeout(() => {
                    putNamesAndBg();
                }, 800);
                $('#countGames, #numGames').text(gamesFail + gamesSuccses);
                return;
            }
        })
    }
});

function selectLevel(levels) {
    level = levels;
    switch (level) {
        case 3:
            levelInWords = 'קל'
            upScores = 100;
            break;
        case 4:
            levelInWords = 'מתקדם';
            upScores = 300;
            break;
        case 5:
            levelInWords = 'מומחה';
            upScores = 500;
            break;
        default:
            break;
    }
    $('#typeLev').text(levelInWords);
}

function doArrRandom(len) {
    let arrRand2 = []; //יוצר מערך מספרים רנדומלי
    while (arrRand2.length < (len + len - 1)) {
        let rnd = Math.floor((Math.random()) * (len * len));
        if (arrRand2.indexOf(rnd) === -1) {
            arrRand2.push(rnd);
        }
    }
    return arrRand2;
}

function moveProgress() {
    let f = `<div id="myProgress" class="progress mt-2 col-12 p-0">
    <div id="myBar" class="progress-bar" style="width:1%;"></div>
  </div>`
    $('#tableGame').append(f)
    if (ip == 0) {
        ip = 1;
        let width = 1;
        let id = setInterval(frame, 600);
        function frame() {
            if (width >= 100) {
                clearInterval(id);
                ip = 0;
                gameOver = true;
                timeOver();
            } else {
                width += 1;
                $('#myBar').css('width', `${width}%`)
            }
        }
        $('#btnNewGame').click(function () {
            $(this).off("click");
            clearInterval(id);
        })
    }
}

function timeOver() {
    $('#numWinV, #countV').text(gamesSuccses);
    $('#scores2 ,#scoremd ,#scores').text(scores);
    $('#countGames, #numGames').text(gamesFail + gamesSuccses);
    $('#numWinX, #countX').text(gamesFail);

    $('#textBest').html('');
    $('#tableGame').html('<i class="fa fa-hourglass-end text-white timeOver mx-auto"></i>'
        + '<p class="text-white display-4 text-center">..time over</p>');
    $('#myProgress').hide();
    $('#scoresp').text(scores - arrPlayers[nowPlayer.indexonarr].score);
    arrPlayers[nowPlayer.indexonarr].score = scores;
    localStorage.setItem('players', JSON.stringify(arrPlayers));
    if ((gamesSuccses > best[level - 2].bestNum) || (scores > best[0].bestNum)) {
        if (gamesSuccses > best[level - 2].bestNum) {
            best[level - 2].bestNum = gamesSuccses;
            best[level - 2].nameWinner = nowPlayer.name;
            $('#textBest').append(`<span> כמות הלוחות הגדולה ביותר במשחק אחד בשלב- ${levelInWords} : ${gamesSuccses} </span><br>`);
        }
        if (scores > best[0].bestNum) {
            best[0].bestNum = scores;
            best[0].nameWinner = nowPlayer.name;
            $('#textBest').append(`<span> כמות הנקודות הגדולה ביותר: ${scores} </span>`);
        }
        $('#titleBestname').text(nowPlayer.name);
        localStorage.setItem('best', JSON.stringify(best));
        setTimeout(() => {
            $('#openModalBest').click()
        }, 1500);
        setTimeout(() => {
            $('#closemdbest').click();
            $('#closemdbest').off('click');
            $('#openModalEnd').click()
        }, 5000);
    } else {
        setTimeout(() => {
            $('#openModalEnd').click()
        }, 1500);
    }
    $('#bestScore').text(`(${best[0].nameWinner} - ${best[0].bestNum})`);
    $('#bestCountV').text(`(${best[level - 2].nameWinner} - ${levelInWords} - ${best[level - 2].bestNum} )`)
}