// 隕石画像の読み込み
var meteorImg = new Image();
meteorImg.src = 'meteor.png';

// 隕石の配列
var meteors = [];

// 隕石生成間隔
var meteorCreateInterval = 2000;
var lastMeteorCreateTime = 0;

// 隕石のアニメーションID
var meteorAnimationId = null;

// 隕石の生成
function createMeteor() {
    meteors.push({
        x: Math.random() * (canvas.width - 50),
        y: -50,
        size: 50,
        vy: 3 + Math.random() * 3
    });
}

// 隕石の更新・描画
function drawMeteor() {
    var now = Date.now();

    // 一定間隔で隕石生成
    if (now - lastMeteorCreateTime > meteorCreateInterval) {
        createMeteor();
        lastMeteorCreateTime = now;
    }

    for (var m = meteors.length - 1; m >= 0; m--) {
        var meteor = meteors[m];
        meteor.y += meteor.vy;

        context.drawImage(meteorImg, meteor.x, meteor.y, meteor.size, meteor.size);

        // プレイヤーとの当たり判定
        if (
            meteor.x < x + playerSize &&
            meteor.x + meteor.size > x &&
            meteor.y < y + playerSize &&
            meteor.y + meteor.size > y
        ) {
            stopGame();
            alert("隕石にぶつかってゲームオーバー！");
            return;
        }

        if (meteor.y > canvas.height) {
            meteors.splice(m, 1);
            continue;
        }
    }

    meteorAnimationId = requestAnimationFrame(drawMeteor);
}

// スタート関数
function startMeteor() {
    if (!meteorAnimationId) {
        drawMeteor();
    }
}

// ストップ関数
function stopMeteor() {
    if (meteorAnimationId) {
        cancelAnimationFrame(meteorAnimationId);
        meteorAnimationId = null;
    }
}
