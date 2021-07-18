function randomFrom(lowerValue, upperValue) {
	return Math.floor(Math.random() * (upperValue - lowerValue + 1) + lowerValue);
} //生成区域随机数
function format(val) {
	var args = Array.prototype.slice.call(arguments, 1);
	return val.replace(/{(\d+)}/g, function (match, number) {
		return typeof args[number] !== "undefined" ? args[number] : match;
	});
}//js没有sprintf，也没有format，就自己做了一个

function star(x, y) {
	this.posizition = { x: x, y: y }; //星星位置
	this.pathLength = undefined; //轨道长度
	this.temp = undefined; //用于计算新位置的自增的数字
	this.distenceToCenter = 0;
	this.radiu = 0.7114514; //星星半径
	this.color = { r: 256, g: 256, b: 256 };	//星星颜色	
	this.drawSelf = function a(ctx, center) {
		//移动
		//this.temp+=this.distenceToCenter*0.00007

		//先更新位置而不是先绘制是为了防止第一帧的闪屏
		this.temp += 0.001;//自增~qwq
		this.posizition.x = center.x + Math.cos(this.temp) * this.distenceToCenter;//通过公式计算圆周运动的下一个位置
		this.posizition.y = center.y + Math.sin(this.temp) * this.distenceToCenter;
		//绘画本体
		ctx.beginPath();//配合closepath，如果不这样做的话，上一个星星就会和下一个粘在一起
		ctx.arc(
			this.posizition.x,
			this.posizition.y,
			this.radiu,
			0,
			Math.PI * 2,
			false
		);//这就是绘制星星本体的函数了
		ctx.fillStyle = format(
			"rgba({0},{1},{2}",
			this.color.r.toString(),
			this.color.g.toString(),
			this.color.b.toString()
		);//设置填充函数
		ctx.closePath();
		ctx.fill();//这就是填充啦
	};
}
//获取dom，更改一些东西
canvas_dom = document.getElementById("background_drewer");//这里是获取canvas的dom啦
canvas_dom.width = document.body.clientWidth;
canvas_dom.height = document.body.clientHeight;//初始化，使canvas铺满全屏
center_point = {
	x: randomFrom(0, document.body.clientWidth),
	y: randomFrom(0, document.body.clientHeight),//确定中心点
};
ctx = canvas_dom.getContext("2d");
star_array = []; //用于存储星星实体的数组

//开始随机生成星星QWQ,从这开始就是初始化部分
var StatNumber = 2000; //这里就是星星的数量啦qwq，小末哥哥有需要的话可以改哦
for (var t = 0; t < StatNumber; t++) {
	var temp = new star(
		randomFrom(0, canvas_dom.width),
		randomFrom(0, canvas_dom.height)
		//随机产生星星的位置
	);
	temp.temp = randomFrom(-1000, 1000);//为了保证星星的位置不一样
	temp.distenceToCenter = Math.sqrt(
		(temp.posizition.x - center_point.x) ** 2 +
		(temp.posizition.y - center_point.y) ** 2
	);//使用直角坐标系两点距离公式计算星星距离中心点的距离
	star_array.push(temp);//将新的星星插♂入数组
}
function update_frame() {
	//为了拖尾就不要清除画布了
	//ctx.clearRect(0,0,canvas_dom.width,canvas_dom.height);

	//绘制星星本体
	for (index in star_array) {
		star_array[index].drawSelf(ctx, center_point);
	}
	//降低上一帧的透明度值，叠加起来就是星轨的特效了
	let image_data = ctx.getImageData(0, 0, canvas_dom.width, canvas_dom.height);
	//遍历像素
	let long = image_data.data.length;//提前取出长度
	for (var i = 0; i < long; i += 4) {
		//i:r,i+1:g.i+2:b,i+3:alpha
		if (image_data.data[i + 3] >=0) { 
			image_data.data[i + 3]-=1.3;		//这个地方就是alpha值减少的速度，更改这个地方就可以更改星轨长度了
		 };			//alpha自减，并防止减到负数
	}
	//把图像放回去
	ctx.putImageData(image_data, 0, 0)
	//setTimeout(	window.requestAnimationFrame,10,update_frame);
	window.requestAnimationFrame(update_frame);//请求下一帧
}
window.requestAnimationFrame(update_frame);//开始帧循环
window.onresize = function a() {
	//自动调节canvas大小的函数
	canvas_dom = document.getElementById("background_drewer");
	canvas_dom.width = document.body.clientWidth;
	canvas_dom.height = document.body.clientHeight;
};
