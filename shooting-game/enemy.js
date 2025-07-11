// 敵の画像読み込み
var enemyImg = new Image();
enemyImg.src = 'enemy.png';
// 画面に出現している敵の情報をまとめて保存する配列
var enemies = []; 
// 敵を出す間隔（ミリ秒）
var enemyCreateInterval = 2000; // 2秒ごとに敵を生成する
var lastEnemyCreateTime = 0;    // 前回敵を出した時間を記録する

// 敵の弾の画像読み込み
var enemyBulletImg = new Image();
enemyBulletImg.src = 'bullet_2.png';
// 敵の弾の配列(画面に出現している敵の弾の情報をまとめて保存)
var enemyBullets = []; 
// 敵の弾の移動スピード（ピクセル/フレーム）
var enemyBulletSpeed = 5;

var enemyAnimationId = null;

// 敵を生成する関数
function createEnemy() {
    enemies.push({
        // 敵のX座標（ランダムに決める） 
				x: Math.random() * (canvas.width - 50), 
        // 敵のY座標（画面の上の外側から登場するため、-50 にする）   
        y: -50, 
        // 横方向の移動速度（-2 〜 +2 の間でランダム）
        vx: (Math.random() - 0.5) * 4, 
        // 縦方向の移動速度（下方向に進むので +2）
        vy: 2, 
        // 敵の表示サイズ
        size: 50, 
        // 弾を撃つ間隔（ミリ秒）
        shootInterval: 1000, 
        // 前回弾を撃った時間を記録する
        lastShotTime: 0 
    });
}

// 描画
function drawEnemy() {
	  // 現在時刻（ミリ秒）を取得
		var now = Date.now(); 
    // 敵を生成するタイミング判定
    if (now - lastEnemyCreateTime > enemyCreateInterval) {
        // 最後に敵を生成してから enemyCreateInterval 経っていれば
        createEnemy(); 
        // 新しい敵を作る
        lastEnemyCreateTime = now; 
        // 最後に敵を作った時間を更新
    }

    // 敵の移動・描画
    for (var i = enemies.length - 1; i >= 0; i--) {
        var enemy = enemies[i];

        // 敵の位置を更新
        enemy.x += enemy.vx;
        enemy.y += enemy.vy;

        // 敵の描画
        context.drawImage(enemyImg, enemy.x, enemy.y, enemy.size, enemy.size);
				
				// もし画面の下にはみ出たら削除する
        if (enemy.y > canvas.height) {
            enemies.splice(i, 1);
        }

				// 敵の弾の情報を時間毎に生成
        if (now - enemy.lastShotTime > enemy.shootInterval) {
            // 前に撃ってから shootInterval 経っていれば
            enemyBullets.push({
                x: enemy.x + enemy.size / 2 - 5,
                // 弾の X 座標（敵の中心から撃つイメージ）

                y: enemy.y + enemy.size,
                // 弾の Y 座標（敵の下端から撃つイメージ）

                size: 10 
                // 弾のサイズ
            });
            enemy.lastShotTime = now;
            // 弾を撃った時間を更新
        }
    }
		
		// 敵弾の移動・描画
    for (var j = enemyBullets.length - 1; j >= 0; j--) {
        var b = enemyBullets[j];
        b.y += enemyBulletSpeed;
        // 弾を下方向に移動させる

        context.drawImage(enemyBulletImg, b.x, b.y, b.size, b.size);
        // 弾を描画する

        if (b.y > canvas.height) {
            // 画面の外に出た弾は削除する
            enemyBullets.splice(j, 1);
            continue; // for文の先頭に戻る
        }
				
				// 敵弾 vs プレイヤーの当たり判定
        if (
            b.x < x + playerSize &&
            b.x + b.size > x &&
            b.y < y + playerSize &&
            b.y + b.size > y
        ) {
            // 弾とプレイヤーが重なっていたらゲームオーバー
            stopGame();
            alert("敵の弾に当たってゲームオーバー！");
            return;
        }

    }
		
		// 敵とプレーヤーの衝突判定
		for (var k = enemies.length - 1; k >= 0; k--) {
        var enemy = enemies[k];
        if (
            enemy.x < x + playerSize &&
            enemy.x + enemy.size > x &&
            enemy.y < y + playerSize &&
            enemy.y + enemy.size > y
        ) {
            // 敵本体とプレイヤーが重なっていたらゲームオーバー
            alert("敵にぶつかってゲームオーバー！");
						stopGame(); //敵に衝突すると全て停止
            return; // forループを抜ける
        }
    }
		
		// 次フレームを予約
    enemyAnimationId = requestAnimationFrame(drawEnemy);
}

// 敵のスタート関数
function startEnemy() {
    if (!enemyAnimationId) {
        drawEnemy();
    }
}

// 敵のストップ関数
function stopEnemy() {
    if (enemyAnimationId) {
        cancelAnimationFrame(enemyAnimationId);
        enemyAnimationId = null;
    }
}
