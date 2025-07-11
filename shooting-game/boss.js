// ボス画像の読み込み
var bossImg = new Image();
bossImg.src = 'boss.png';

// ボスの座標やサイズ
var bossX = 200;
var bossY = 100;
var bossSize = 150;

var bossVX = 3;
var bossVY = 0;

var bossHP = 20;

// ボスの弾
var bossBullets = [];
var bossBulletSpeed = 5;
var bossBulletSize = 50;

// ボスのアクティブ
var bossActive = false;

// ボスの弾の画像読み込み
var bossBulletImg = new Image();
bossBulletImg.src = 'bullet_3.png';

// ボス描画処理
function drawBoss() {
	　　if (!bossActive){return}
	
	  // ボスの移動
    bossX += bossVX;
	
    // ランダムで弾情報を生成	
		if (Math.random() < 0.01) {
				bossBullets.push({
						x: bossX + bossSize/2 - bossBulletSize/2,
						y: bossY + bossSize
				});
		}
		
		for (var i = bossBullets.length - 1; i >= 0; i--) {
				bossBullets[i].y += bossBulletSpeed;

				context.drawImage(bossBulletImg, bossBullets[i].x, bossBullets[i].y, bossBulletSize, bossBulletSize);

				if (bossBullets[i].y > canvas.height) {
						bossBullets.splice(i, 1);
						continue; 
				}
				
				if (
						bossBullets[i].x < x + playerSize &&
						bossBullets[i].x + bossBulletSize > x &&
						bossBullets[i].y < y + playerSize &&
						bossBullets[i].y + bossBulletSize > y
				) {
						stopGame();
						alert("ボスの弾に当たってゲームオーバー！");
						break;
				}
		}
		
		// 画面端で跳ね返る処理
    if (bossX < 0) {
        bossX = 0;
        bossVX = -bossVX;
    }
    if (bossX > canvas.width - bossSize) {
        bossX = canvas.width - bossSize;
        bossVX = -bossVX;
    }
		
		// たまに下に降りる
    if (Math.random() < 0.01) {
        bossVY = (Math.random() < 0.5) ? 2 : -2;
    }

    bossY += bossVY;

    // 縦の範囲を制限
    if (bossY < 50) {
        bossY = 50;
        bossVY = 0;
    }
    if (bossY > 300) {
        bossY = 300;
        bossVY = -2;
    }
		
    // ボスを描画する
    context.drawImage(bossImg, bossX, bossY, bossSize, bossSize);
		
    // プレーヤーとの衝突判定
		if (
        bossX < x + playerSize &&
        bossX + bossSize > x &&
        bossY < y + playerSize &&
        bossY + bossSize > y
    ) {
        stopGame();
        alert("ボスにぶつかってゲームオーバー！");
        return;
    }
}