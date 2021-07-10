let win_width; // 画面サイズ(横)
let win_height; // 画面サイズ(縦)
let rightspace;
let bottomspace;
let size;
let nowTargetId = null; // 現在選択してるもののid

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
    let header_height = 50;
    if (win_height-header_height < win_width) {
        size = (win_height-header_height)/11;
    }else{
        size = win_width/12;
    }
    let parent = document.querySelector(".hpmeter");
    parent.innerHTML = "";
    let startX = win_width/2 + (size*4);
    let startY = header_height+size*9;
    rightspace = (win_width - size*10)/2;
    bottomspace = win_height - header_height - size*10;
    printmoai(parent, startX, startY, size); // 右下から画像を敷き詰める

    document.addEventListener(EVENTNAME_TOUCHSTART, touchStartEvent);
    document.addEventListener(EVENTNAME_TOUCHMOVE, moveEvent);
}

function printmoai(parent, startX, startY, size) {
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
            moai.style.opacity = 1.0;
            parent.appendChild(moai);
            count ++;
        }
    }
}

function touchStartEvent(e) {
    let x = e.touches[0].pageX;
    let y = e.touches[0].pageY;
    changeImage(x, y);
}
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
            document.getElementById(idNum).style.opacity = document.getElementById(idNum).style.opacity<0.5 ? 1.0 : 0.2;   
        }
        nowTargetId = idNum;
    }else{
        nowTargetId = null;
    }
}

window.addEventListener('resize', startGame);
window.addEventListener("load", startGame);