let win_width; // 画面サイズ(横)
let win_height; // 画面サイズ(縦)
let startX; // 画像10*8マスの一番右下画像のleft座標
let startY; // 画像10*8マスの一番右下画像のtop座標
let rightspace; // 画像10*8マスの右の部分のスペースの幅
let bottomspace; // 画像10*8マスの下の部分のスペースの高さ
let size; // 画像一つのサイズ
let header_height; // header部分(「life表示」と「=」の)高さ
let nowTargetId = null; // 現在選択してるもののid

let nowPlayerNum = 0; // 今のプレイヤーの番号(player1 = 0, player2 = 1)
let playerInfo = [
    { parent: document.querySelector(".header-left"), life: 8000 }, // player1
    { parent: document.querySelector(".header-right"), life: 8000 }  // player2
]

let supportTouch = 'ontouchend' in document; // タッチイベントが利用可能かの判別

// イベント名
let EVENTNAME_TOUCHSTART = supportTouch ? 'touchstart' : 'mousedown';
let EVENTNAME_TOUCHMOVE = supportTouch ? 'touchmove' : 'mousemove';
let EVENTNAME_TOUCHEND = supportTouch ? 'touchend' : 'mouseup';

// スクロールを禁止する関数
(function() {
    function noScroll(event) {
      event.preventDefault();
    }
    document.addEventListener('touchmove', noScroll, { passive: false }); // スクロール禁止(SP)
    document.addEventListener('mousewheel', noScroll, { passive: false }); // スクロール禁止(PC)
})();

// ダブルタップによる拡大を禁止
let doubleTapTime = 0;
document.documentElement.addEventListener('touchend', function (e) {
  let now = new Date().getTime();
  if ((now - doubleTapTime) < 350){
    e.preventDefault();
  }
  doubleTapTime = now;
}, false);


// Game開始の関数
function startGame() {
    win_width = window.innerWidth; // 画面サイズ(横)
    win_height = window.innerHeight; // 画面サイズ(縦)
    header_height = 50;
    if (win_height-header_height < win_width) {
        size = (win_height-header_height)/10;
    }else{
        size = win_width/12;
    }
    startX = win_width/2 + (size*4);
    startY = header_height+size*8;
    rightspace = (win_width - size*10)/2;
    bottomspace = win_height - header_height - size*9;
    turnPlayer(nowPlayerNum);

    document.addEventListener(EVENTNAME_TOUCHSTART, touchStartEvent);
    document.addEventListener(EVENTNAME_TOUCHMOVE, moveEvent);
    document.addEventListener(EVENTNAME_TOUCHEND, touchEndEvent);

    let player1 = document.querySelector(".header-left");
    let player2 = document.querySelector(".header-right");
    player1.addEventListener(EVENTNAME_TOUCHSTART, {num: 0, handleEvent: turnPlayer});
    player2.addEventListener(EVENTNAME_TOUCHSTART, {num: 1, handleEvent: turnPlayer});
}

function turnPlayer(playerNum) {
    // console.log(this);
    let parentbg = document.querySelector(".parent");
    let player1bg = document.querySelector(".header-left");
    let player2bg = document.querySelector(".header-right");
    let player1font = playerInfo[0].parent.firstElementChild;
    let player2font = playerInfo[1].parent.firstElementChild;
    if (this.num == 0 || playerNum == 0) {
        nowPlayerNum = 0;
        printmoai(); // 右下から画像を敷き詰める
        parentbg.style.backgroundColor = '#e8748b'
        player1bg.style.backgroundColor = '#e8748b'
        player2bg.style.backgroundColor = '#d1e1e8'
        player1font.style.color = '#000000'
        player2font.style.color = '#555555'
    }else{
        nowPlayerNum = 1;
        printmoai(); // 右下から画像を敷き詰める
        parentbg.style.backgroundColor = '#74c5e8'
        player1bg.style.backgroundColor = '#e8d1d5'
        player2bg.style.backgroundColor = '#74c5e8'
        player1font.style.color = '#555555'
        player2font.style.color = '#000000'
        nowPlayerNum = 1;
    }
}

function printmoai() {
    let parent = document.querySelector(".hpmeter");
    parent.innerHTML = "";
    let life = playerInfo[nowPlayerNum].life;
    let count = 1;
    for (let i = 0; i < 8; i++) {
        for (let j = 0; j < 10; j++) {
            let moai = document.createElement("img");
            moai.setAttribute("src", "./images/moai.png");
            moai.setAttribute("class", 'image');
            moai.setAttribute("id", count);
            moai.style.width = size+"px";
            moai.style.height = size+"px";
            moai.style.left = startX-j*size+"px";
            moai.style.top = startY-i*size+"px";
            if (life >= count*100) {
                moai.style.opacity = 1.0;
            }else{
                moai.style.opacity = 0.2;
            }
            parent.appendChild(moai);
            count ++;
        }
    }
}

// 画面タッチ時
function touchStartEvent(e) {
    let x = e.touches[0].pageX;
    let y = e.touches[0].pageY;
    changeImage(x, y);
}
// 画面タッチをやめた時
function touchEndEvent(e) {
    nowTargetId = null;
}
// 画面スワイプ時
function moveEvent(e) {
    let x = e.touches[0].pageX;
    let y = e.touches[0].pageY;
    changeImage(x, y);
}

function changeImage(x, y) {
    let OnesPrace = Math.floor(( (win_width - x) - rightspace )/size) + 1;
    let TensPrace = Math.floor(( (win_height- y) - bottomspace )/size);
    if ((OnesPrace > 0 && OnesPrace <= 10) && (TensPrace >= 0 && TensPrace < 8)) {
        // console.log(OnesPrace+TensPrace*10);
        let idNum = OnesPrace+TensPrace*10;
        if (idNum != nowTargetId) {
            let changedOpacity = document.getElementById(idNum).style.opacity<0.5 ? 1.0 : 0.2; // 変化後の色
            if (changedOpacity > 0.5) {
                for (let i = idNum; i >= 1; i--) {
                    document.getElementById(i).style.opacity = changedOpacity;
                }
                playerInfo[nowPlayerNum].parent.firstElementChild.innerHTML = playerInfo[nowPlayerNum].life = idNum*100;
            }else{
                for (let i = idNum; i <= 80; i++) {
                    document.getElementById(i).style.opacity = changedOpacity;
                }
                playerInfo[nowPlayerNum].parent.firstElementChild.innerHTML = playerInfo[nowPlayerNum].life = (idNum-1)*100;
            }
        }
        nowTargetId = idNum;
    }else{
        nowTargetId = null;
    }
}

window.addEventListener('resize', startGame);
window.addEventListener("load", startGame);
document.addEventListener("dblclick", function(e){ e.preventDefault();}, { passive: false });