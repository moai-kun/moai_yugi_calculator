let win_width; // 画面サイズ(横)
let win_height; // 画面サイズ(縦)
// let y = 0; // 画像のy座標

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

// Game開始の関数
function startGame() {
    win_width = window.innerWidth; // 画面サイズ(横)
    win_height = window.innerHeight; // 画面サイズ(縦)
    let header_height = 50;

    let parent = document.querySelector(".player1");
    parent.innerHTML = "";
    let sizeX = win_width/24;
    let sizeY = (win_height-header_height)/10;
    let startX = sizeX;
    let startY = header_height+sizeY;
    printmoai(parent, startX, startY, sizeX, sizeY);

    parent = document.querySelector(".player2");
    parent.innerHTML = "";
    startX = win_width/2+sizeX;
    printmoai(parent, startX, startY, sizeX, sizeY);
    document.addEventListener(EVENTNAME_TOUCHSTART, touchStartEvent);
}

function printmoai(parent, startX, startY, sizeX, sizeY) {
    for (let i = 0; i < 8; i++) {
        for (let j = 0; j < 10; j++) {
            let moai = document.createElement("img");
            moai.setAttribute("src", "./images/moai.png");
            moai.setAttribute("width", sizeX);
            moai.setAttribute("height", sizeY);
            moai.setAttribute("opacity", 1.0);
            moai.classList.add('image');
            moai.style.left = startX+j*sizeX+"px";
            moai.style.top = startY+i*sizeY+"px";
            // moai.addEventListener(EVENTNAME_TOUCHSTART, touchStartEvent);
            parent.appendChild(moai);
        }
    }
}

function touchStartEvent(e) {
    let tarClass = e.target.getAttribute("class");
    if (tarClass == "image") {
        // let tarOpacity = e.target.style.opacity;
        // console.log("aa")
        if (e.target.style.opacity == 1.0) {
            e.target.style.opacity = 0.2;
        }else{
            e.target.style.opacity = 1.0;
        }
        // e.target.remove()
    }
}


// [Event] 画面回転
// window.addEventListener("orientationchange", ()=>{
//     setResult();
// });

// window(HTML)の読み込みが完了してからstarGame()を実行
// window.onload = function(){
//     startGame();
// };
window.addEventListener('resize', startGame);
window.addEventListener("load", startGame);