var board = [];
var nowPlayer;
var opponent;
var legalPlace = [];

initial();
update_board();


function initial() {
    for (var r = 0; r < 8; r++) {
        board[r] = [];
        for (var c = 0; c < 8; c++) {
            board[r][c] = { val: -1 };
        }
    }
    board[3][3].val = 1;
    board[3][4].val = 0;
    board[4][3].val = 0;
    board[4][4].val = 1;
}

function firstPlayer(player) {
    if (player == 0) {
        nowPlayer = 0;
        nextPlayer();
    } else if (player == 1) {
        nowPlayer = 1;
        nextPlayer();
    }
    document.getElementsByClassName("btn")[0].disabled = true;
    document.getElementsByClassName("btn")[1].disabled = true;
}

function nextPlayer() {
    opponent = Math.abs(nowPlayer - 1);
    legalMove();
    console.log(legalPlace);
    if (nowPlayer == 0) {
        hint();
    } else
        search();
}

function legalMove() {
    for (var r = 0; r < 8; r++) {
        for (var c = 0; c < 8; c++) {
            if (board[r][c].val == -1) {
                var thisPlaceAvailable = false;
                var vertical = getVerticalLine(c);
                thisPlaceLegal = check(vertical, r, opponent, false);
                if (thisPlaceLegal == true) {
                    console.log("vertical", r, c);
                    legalPlace.push([r, c]);
                    continue;
                }
                var horizontal = getHorizontalLine(r);
                thisPlaceLegal = check(horizontal, c, opponent, false);
                if (thisPlaceLegal == true) {
                    console.log("horizontal", r, c);
                    legalPlace.push([r, c]);
                    continue;
                }
                var leftSlash = getLeftSlash(r, c);
                thisPlaceLegal = check(leftSlash, (r <= c) ? r : c, opponent, false);
                if (thisPlaceLegal == true) {
                    console.log("left", r, c);
                    legalPlace.push([r, c]);
                    continue;
                }
                var rightSlash = getRightSlash(r, c);
                thisPlaceLegal = check(rightSlash, (r + c <= 7) ? r : 7 - c, opponent, false);
                if (thisPlaceLegal == true) {
                    console.log("right", r, c);
                    legalPlace.push([r, c]);
                }
            }
        }
    }
}

function getVerticalLine(c) { // 取得第c排所有棋子
    var arr = [];
    for (var r = 0; r < 8; ++r) {
        arr.push({ val: board[r][c].val, r: r, c: c });
    }
    return arr;
}

function getHorizontalLine(r) { // 取得第r列所有棋子
    var arr = [];
    for (var c = 0; c < 8; ++c) {
        arr.push({ val: board[r][c].val, r: r, c: c });
    }
    return arr;
}

function getLeftSlash(r, c) { // 取得第(r, c)位置的左斜線所有棋子
    var arr = [];
    if (r >= c) {
        r = r - c; c = 0;
    } else {
        c = c - r; r = 0;
    }
    while (r <= 7 && c <= 7) {
        arr.push({ val: board[r][c].val, r: r, c: c });
        r++; c++;
    }
    return arr;
}

function getRightSlash(r, c) { // 取得第(r, c)位置的右斜線所有棋子
    var arr = [];
    if (r + c <= 7) {
        c = r + c; r = 0;
    } else {
        r = r + c - 7; c = 7;
    }
    while (r <= 7 && c >= 0) {
        arr.push({ val: board[r][c].val, r: r, c: c });
        r++; c--;
    }
    return arr;
}

function check(array, index, opponent, flip) { // 看輸入的陣列的指定位置往上往下可不可以翻子
    var up_result = check_up(array, index, opponent, flip);
    var down_result = check_down(array, index, opponent, flip);
    return up_result || down_result;
}

function check_up(array, index, opponent, flip) {
    var temp_index = index;
    if (--index >= 0) {
        if (array[index].val != opponent)
            return false;
        else {
            while (array[index].val == opponent) {
                if (--index >= 0) {
                    if (array[index].val == nowPlayer) {
                        if (flip == true) {
                            while (index <= temp_index) {
                                board[array[index].r][array[index].c].val = nowPlayer;
                                index++;
                            }
                        }
                        return true;
                    }
                } else
                    return false;
            }
            return false;
        }
    }
    return false;
}

function check_down(array, index, opponent, flip) {
    var temp_index = index;
    if (++index <= array.length - 1) {
        if (array[index].val != opponent)
            return false;
        else {
            while (array[index].val == opponent) {
                if (++index <= array.length - 1) {
                    if (array[index].val == nowPlayer) {
                        if (flip == true) {
                            while (index >= temp_index) {
                                board[array[index].r][array[index].c].val = nowPlayer;
                                index--;
                            }
                        }
                        return true;
                    }
                } else
                    return false;
            }
            return false;
        }
    }
    return false;
}

function hint() {
    for (var i = 0; i < legalPlace.length; ++i) {
        document.querySelector(".r" + legalPlace[i][0] + " .c" + legalPlace[i][1]).disabled = false;
        document.querySelector(".r" + legalPlace[i][0] + " .c" + legalPlace[i][1] + " .dot").style.background = "white";
        document.querySelector(".r" + legalPlace[i][0] + " .c" + legalPlace[i][1] + " .dot").style.opacity = "0.2";
    }
}

function update_board() {
    for (var r = 0; r < 8; r++) {
        for (var c = 0; c < 8; c++) {
            document.querySelector(".r" + r + " .c" + c).disabled = true;
            var dot = document.querySelector(".r" + r + " .c" + c + " .dot");
            dot.style.opacity = "1";
            if (board[r][c].val == 1) {
                dot.style.background = "white";
            } else if (board[r][c].val == 0) {
                dot.style.background = "black";
            } else if (board[r][c].val == -1) {
                dot.style.background = "";
            }
        }
    }
    printBoard();
}

function flip(r, c) {
    var vertical = getVerticalLine(c);
    check(vertical, r, opponent, true);
    var horizontal = getHorizontalLine(r);
    check(horizontal, c, opponent, true);
    var leftSlash = getLeftSlash(r, c);
    check(leftSlash, (r <= c) ? r : c, opponent, true);
    var rightSlash = getRightSlash(r, c);
    check(rightSlash, (r + c <= 7) ? r : 7 - c, opponent, true);
}

function put(r, c) {
    board[r][c].val = nowPlayer;
    flip(r, c);
    update_board();
    legalPlace = [];
    nowPlayer = Math.abs(nowPlayer - 1);
    nextPlayer();
}

function search() {
    console.log("Computer searching start...");
    put(legalPlace[0][0], legalPlace[0][1]);
}

function printBoard() {
    for (var r = 0; r < 8; r++) {
        console.log(board[r][0].val, board[r][1].val, board[r][2].val, board[r][3].val, board[r][4].val, board[r][5].val, board[r][6].val, board[r][7].val);
    }
}