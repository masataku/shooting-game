var score = 0;

// スコア加算関数
function addScore(points) {
    score += points;
}

// スコア描画関数
function drawScore(context) {
    context.fillStyle = "white";
    context.font = "24px Arial";
    context.fillText("スコア: " + score, 10, 30);
		
		// item_1 の画像を左上に表示
    context.drawImage(itemImg, 10, 40, 30, 30);
		context.fillText("×" + itemCount, 50, 65);
}
