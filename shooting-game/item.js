// アイテム画像の読み込み
var itemImg = new Image();
itemImg.src = 'item_1.png';
var itemImg2 = new Image();
itemImg2.src = 'item_2.png';

// アイテムの配列
var items = [];
// アイテム入手の音
var getSound = new Audio('get.mp3');

// アイテムゲット数///////////////////////////////////
var itemCount = 0

function createItem(enemy){
		if (Math.random() < 0.5) {
			var itemType;
			if (Math.random() < 0.4){ itemType = 'item_2'} else { itemType = 'item_1'}
				// アイテムを生成
				items.push({
						x: enemy.x + enemy.size/2 - 15,
						y: enemy.y + enemy.size/2 - 15,
						size: 30,
						vy: Math.random() * 5 + 1,
						type: itemType
				});
		}
}

// アイテムの更新・描画
function drawItem(){
		for (var k = items.length - 1; k >= 0; k--) {
				var item = items[k];

				item.y += item.vy;
				
				if (item.type == 'item_2') {
					  context.drawImage(itemImg2, item.x, item.y, item.size, item.size);
				} else {
				    context.drawImage(itemImg, item.x, item.y, item.size, item.size);
				}
				
				// プレイヤーとの衝突判定
				// (もしアイテムに触れるまたは画面外なら削除)
				if (
						(item.x < x + playerSize &&
						item.x + item.size > x &&
						item.y < y + playerSize &&
						item.y + item.size > y) ||
						item.y > canvas.height
				    ) {
						items.splice(k, 1);
						addScore(200);
						if (!(item.y > canvas.height)){
						  getSound.play();
							
							if (item.type == 'item_2'){
								  bigBullet();
							} else { 
							      itemCount++;
										if (itemCount >= 5){////////////////////////////
											bossActive = true;
										}
								}
						}
				}
		}
}
