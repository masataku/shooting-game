var canvas = document.getElementById("myCanvas");
var context = canvas.getContext('2d');

// ロケット画像の読み込み
var playerImg = new Image();
playerImg.src = 'player.png';
playerSize = 50; //実機のサイズ

// 背景画像の読み込み
var bgImg1 = new Image();
bgImg1.src = 'background_1.png';
var bgImg2 = new Image();
bgImg2.src = 'background_2.png';
var bgImg3 = new Image();
bgImg3.src = 'background_3.png';

// 背景スクロール用変数
var bgY = 0; //背景y座標
var bgSpeed = 1; //スクロールの速さ

// 弾画像の読み込み
var bulletImg = new Image();
bulletImg.src = 'bullet_1.png';

// 弾の管理
var bullets = []; //弾の情報を保存する配列
var bulletSpeed = 30; //弾の速さ
var bulletSize = 16; //弾のサイズ

// 連射制限
var lastShotTime = 0; //最後に弾を打った時間
var shootInterval = 300; //弾を打てる間隔 ミリ秒（0.3秒に1発）

// 弾が当たる音
var hitSound = new Audio('hit.mp3');
// 弾の音
var shootSound = new Audio('shoot.mp3');
// クリア音
var clearSound = new Audio('clear.mp3');
// BGM
var bgm = new Audio('bgm.mp3');
bgm.loop = true;       // ループ再生
bgm.volume = 0.5;      // 音量（0.0〜1.0）

// ロケット初期位置・速度
var x = 400;
var y = 700;
var vx = 0; // 横速さ
var vy = 0; // 縦速さ
var a = 0.3; // 加速の強さ
var f = 0.95; // 摩擦係数

var animationId = null;

// キー状態
var keys = {
    up: false,
    down: false,
    left: false,
    right: false
};

var hit;

// キー入力
window.addEventListener('keydown', function(e) {
    if (e.key == 'ArrowUp') keys.up = true;
    if (e.key == 'ArrowDown') keys.down = true;
    if (e.key == 'ArrowLeft') keys.left = true;
    if (e.key == 'ArrowRight') keys.right = true;
		
		// スペースキーで弾発射（連射制限あり）
    if (e.key == ' ') {
        var now = Date.now(); // 現在時刻を取得。
				// 前回の発射時刻から現在時刻までの間隔が、弾を打てる間隔より大きれば弾発射の処理を行う。
        if (now - lastShotTime > shootInterval) {
            bullets.push({
                x: x + playerSize / 2 - bulletSize / 2,
                y: y
            });
						shootSound.currentTime = 0;// currentTime関数で指定の時間まで巻き戻す。
            shootSound.play();  // play関数で音源を再生する
            lastShotTime = now; //前回の発射時刻を更新。
        }
    }
});

window.addEventListener('keyup', function(e) {
    if (e.key == 'ArrowUp') keys.up = false;
    if (e.key == 'ArrowDown') keys.down = false;
    if (e.key == 'ArrowLeft') keys.left = false;
    if (e.key == 'ArrowRight') keys.right = false;
});

function bigBullet() {
    bulletSize = 100; // 弾を大きくする
    setTimeout(function(){
        bulletSize = 16; // 一定時間後に元に戻す
    }, 10000); // 10秒間だけ大きくする
}

// 描画
function drawAnimation() {
	  // クリア
    context.clearRect(0, 0, canvas.width, canvas.height);
		
		// 背景スクロール更新
    bgY += bgSpeed; //背景のy座標を毎回更新してスクロールさせる
    if (bgY >= canvas.height * 2){ bgY = 0; }
		
		// 背景描画
		context.drawImage(bgImg1, 0, bgY, canvas.width, canvas.height);
    context.drawImage(bgImg2, 0, bgY - canvas.height, canvas.width, canvas.height);
		context.drawImage(bgImg3, 0, bgY - canvas.height * 2, canvas.width, canvas.height);
		
		// 加速処理
    if (keys.up) vy -= a;
    if (keys.down) vy += a;
    if (keys.left) vx -= a;
    if (keys.right) vx += a;
		
		// 摩擦
    vx = vx * f;
    vy = vy * f;
		
		// 位置更新
    x += vx;
    y += vy;
		
		// 画面端で跳ね返る
    if (x < 0) { x = 0; vx = -vx * f; }
    if (x > canvas.width - 50) { x = canvas.width - 50; vx = -vx * f; }
    if (y < 0) { y = 0; vy = -vy * f; }
    if (y > canvas.height - 50) { y = canvas.height - 50; vy = -vy * f; }
		
		// 弾の更新・描画
		hit = false;
    for (var i = bullets.length - 1; i >= 0; i--) {
        bullets[i].y -= bulletSpeed; //弾のy座標を弾の速さ分ずつ更新する。
				// 弾を描画する
        context.drawImage(bulletImg, bullets[i].x, bullets[i].y, bulletSize, bulletSize);

        // 画面外に出たら削除
        if (bullets[i].y < 0) { //画面上端を超えると、
						//配列名.splice(i番目から, 1つデータを削除);
            bullets.splice(i, 1);//弾を(弾の座標情報を)削除する。
						continue; // for文の先頭に戻る(画面外に出たら当たり判定は必要ないから)
        }
				// 敵と弾との当たり判定
				for (var j = enemies.length - 1; j >= 0; j--) {
						var enemy = enemies[j];
						if (
								bullets[i].x < enemy.x + enemy.size &&
								bullets[i].x + bulletSize > enemy.x &&
								bullets[i].y < enemy.y + enemy.size &&
								bullets[i].y + bulletSize > enemy.y
						) {
								createItem(enemy);
								enemies.splice(j, 1);
								bullets.splice(i, 1);
								hitSound.play();
								addScore(100);
								hit = true;
								break;
						}
				}
				
				if (hit){continue;}
				
				// ボスへの攻撃当たり判定//////////////////////////////////////
				if (bossActive) {
						if (
								bullets[i].x < bossX + bossSize &&
								bullets[i].x + bulletSize > bossX &&
								bullets[i].y < bossY + bossSize &&
								bullets[i].y + bulletSize > bossY
						) {
								bullets.splice(i, 1); // 弾を消す
								bossHP--; // ボスの体力を1減らす
								hitSound.play();

								if (bossHP <= 0) {
										bossActive = false; // ボス非表示
										hitSound.pause();
										clearSound.play();
										stopGame();         // アニメーション停止
										alert("ゲームクリア！\nスコア：" + score); // ゲームクリア表示
								}

								break; // 1発しか当たらないので break
						}
				}

    }
		
		// ボスの描画
		if (bossActive) { drawBoss(); }////////////////////////////////////////
		
		// スコアの描画
		drawScore(context);////////////////////
		
		// アイテムの更新・描画
		drawItem();

		// 画像の描画⇒　drawImage(取込んだ画像, x座標, y座標, 横サイズ, 縦サイズ)
    context.drawImage(playerImg, x, y, playerSize, playerSize);
		
		// 描画予約
    animationId = requestAnimationFrame(drawAnimation);
}


// スタート関数
function startAnimation() {
    if (!animationId) {
			  bgm.play();
        drawAnimation();
				startEnemy();
				startMeteor();
    }
}

// ストップ関数
function stopAnimation() {
    if (animationId) {
				bgm.pause();
        cancelAnimationFrame(animationId);
        animationId = null;
				stopEnemy();
				stopMeteor();
    }
}

function stopGame() {
    stopAnimation(); // player.js の停止
    stopEnemy();     // enemy.js の停止
		stopMeteor();
		bossActive = false;
		location.reload();
}
