var board = [];
var nowPlayer;
var opponent;
var bestChild;
//var legalPlace = [];

initial();
update_board();


function initial() {
    for (var r = 0; r < 8; r++) {
        board[r] = [];
        for (var c = 0; c < 8; c++) {
            board[r][c] = -1;
        }
    }
    board[3][3] = 1;
    board[3][4] = 0;
    board[4][3] = 0;
    board[4][4] = 1;
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
var temp;
function nextPlayer() {
    opponent = Math.abs(nowPlayer - 1);
    var map = $.extend(true, {}, board);
    var legalPlace = legalMove(map);
    if (nowPlayer == 0) {
        hint(legalPlace);
    } else
        search(legalPlace, map);
}

function legalMove(map) {
    var legalPlace = [];
    for (var r = 0; r < 8; r++) {
        for (var c = 0; c < 8; c++) {
            if (map[r][c] == -1) {
                var thisPlaceAvailable = false;
                var vertical = getVerticalLine(c, map);
                thisPlaceLegal = check(vertical, r, opponent, false);
                if (thisPlaceLegal == true) {
                    console.log("vertical", r, c);
                    legalPlace.push([r, c]);
                    continue;
                }
                var horizontal = getHorizontalLine(r, map);
                thisPlaceLegal = check(horizontal, c, opponent, false);
                if (thisPlaceLegal == true) {
                    console.log("horizontal", r, c);
                    legalPlace.push([r, c]);
                    continue;
                }
                var leftSlash = getLeftSlash(r, c, map);
                thisPlaceLegal = check(leftSlash, (r <= c) ? r : c, opponent, false);
                if (thisPlaceLegal == true) {
                    console.log("left", r, c);
                    legalPlace.push([r, c]);
                    continue;
                }
                var rightSlash = getRightSlash(r, c, map);
                thisPlaceLegal = check(rightSlash, (r + c <= 7) ? r : 7 - c, opponent, false);
                if (thisPlaceLegal == true) {
                    console.log("right", r, c);
                    legalPlace.push([r, c]);
                }
            }
        }
    }
    return legalPlace;
}

function getVerticalLine(c, map) { // 取得第c排所有棋子
    var arr = [];
    for (var r = 0; r < 8; ++r) {
        arr.push({ val: map[r][c], r: r, c: c });
    }
    return arr;
}

function getHorizontalLine(r, map) { // 取得第r列所有棋子
    var arr = [];
    for (var c = 0; c < 8; ++c) {
        arr.push({ val: map[r][c], r: r, c: c });
    }
    return arr;
}

function getLeftSlash(r, c, map) { // 取得第(r, c)位置的左斜線所有棋子
    var arr = [];
    if (r >= c) {
        r = r - c; c = 0;
    } else {
        c = c - r; r = 0;
    }
    while (r <= 7 && c <= 7) {
        arr.push({ val: map[r][c], r: r, c: c });
        r++; c++;
    }
    return arr;
}

function getRightSlash(r, c, map) { // 取得第(r, c)位置的右斜線所有棋子
    var arr = [];
    if (r + c <= 7) {
        c = r + c; r = 0;
    } else {
        r = r + c - 7; c = 7;
    }
    while (r <= 7 && c >= 0) {
        arr.push({ val: map[r][c], r: r, c: c });
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
                                board[array[index].r][array[index].c] = nowPlayer;
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
                                board[array[index].r][array[index].c] = nowPlayer;
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

function hint(legalPlace) {
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
            if (board[r][c] == 1) {
                dot.style.background = "white";
            } else if (board[r][c] == 0) {
                dot.style.background = "black";
            } else if (board[r][c] == -1) {
                dot.style.background = "";
            }
        }
    }
    printBoard(board);
}

function flip(r, c) {
    var vertical = getVerticalLine(c, board);
    check(vertical, r, opponent, true);
    var horizontal = getHorizontalLine(r, board);
    check(horizontal, c, opponent, true);
    var leftSlash = getLeftSlash(r, c, board);
    check(leftSlash, (r <= c) ? r : c, opponent, true);
    var rightSlash = getRightSlash(r, c, board);
    check(rightSlash, (r + c <= 7) ? r : 7 - c, opponent, true);
}

function put(r, c) {
    board[r][c] = nowPlayer;
    flip(r, c);
    update_board();
    //legalPlace = [];
    nowPlayer = Math.abs(nowPlayer - 1);
    nextPlayer();
}

function search(temp, map) {
    console.log("Computer searching start...");
    //put(temp[0][0], temp[0][1]);
    var legalPlace = legalMove(map);
    var score = minimax(map, 3, -10000, 10000, true);
    console.log(score);
    console.log(bestChild);
    put(bestChild[0], bestChild[1]);
}

function minimax(map, depth, alpha, beta, maximizingPlayer){
    if(depth == 0){
        return evaluation_function(map);
    }

    if(maximizingPlayer){
        var maxEval = -10000;
        var next = legalMove(map);
        for(var i = 0; i < next.length; i++){
            var temp_map = $.extend(true, {}, map);
            temp_map[next[i][0]][next[i][1]] = 1;
            /*console.log("temp::");
            printBoard(temp_map);
            console.log(next[i][0], next[i][1]);*/
            var eval = minimax(temp_map, depth-1, alpha, beta, false);
            console.log("evalmax:", eval, i);
            if(maxEval < eval){
                maxEval = eval;
                bestChild = [next[i][0], next[i][1]];
            }
            alpha = Math.max(alpha, eval);
            if(beta <= alpha)
                break;
        }
        return maxEval;
    }else{
        var minEval = 10000;
        var next = legalMove(map);
        for(var i = 0; i < next.length; i++){
            var temp_map = $.extend(true, {}, map);
            temp_map[next[i][0]][next[i][1]] = -1;
            /*console.log("temp::");
            printBoard(temp_map);
            console.log(next[i][0], next[i][1]);*/
            var eval = minimax(temp_map, depth-1, alpha, beta, true);
            console.log("evalmin:", eval, i);
            if(minEval > eval){
                minEval = eval;
                bestChild = [next[i][0], next[i][1]];
            }
            beta = Math.min(beta, eval);
            if(beta <= alpha)
                break;
        }
        return minEval;
    }
}

function evaluation_function(map){
    return Math.random()*100 + 1;
}

function printBoard(board) {
    for (var r = 0; r < 8; r++) {
        console.log(board[r][0], board[r][1], board[r][2], board[r][3], board[r][4], board[r][5], board[r][6], board[r][7]);
    }
}