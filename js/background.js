function randomFrom(lowerValue, upperValue) {
	return Math.floor(Math.random() * (upperValue - lowerValue + 1) + lowerValue);
} //生成区域随机数
function format(val) {
	var args = Array.prototype.slice.call(arguments, 1);
	return val.replace(/{(\d+)}/g, function (match, number) {
		return typeof args[number] !== "undefined" ? args[number] : match;
	});
}//js没有sprintf，也没有format，就自己做了一个
hsvToRgb([120, 50, 100]); //输出：[127, 255, 127]

//参数arr的3个值分别对应[h, s, v]
function hsvToRgb(arr) {
    var h = arr[0], s = arr[1], v = arr[2];
    s = s / 100;
    v = v / 100;
    var r = 0, g = 0, b = 0;
    var i = parseInt((h / 60) % 6);
    var f = h / 60 - i;
    var p = v * (1 - s);
    var q = v * (1 - f * s);
    var t = v * (1 - (1 - f) * s);
    switch (i) {
        case 0:
            r = v; g = t; b = p;
            break;
        case 1:
            r = q; g = v; b = p;
            break;
        case 2:
            r = p; g = v; b = t;
            break;
        case 3:
            r = p; g = q; b = v;
            break;
        case 4:
            r = t; g = p; b = v;
            break;
        case 5:
            r = v; g = p; b = q;
            break;
        default:
            break;
    }
    r = parseInt(r * 255.0)
    g = parseInt(g * 255.0)
    b = parseInt(b * 255.0)
    return [r, g, b];
}
function star(x, y) {
	this.posizition = { x: x, y: y }; //星星位置
	this.pathLength = undefined; //轨道长度
	this.temp = undefined; //用于计算新位置的自增的数字
	this.distenceToCenter = 0;
	this.radiu = 1.5; //星星半径
	this.color = { r: 255, g: 255, b: 255 };	//星星颜色	在这定义没用的
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
		ctx.fillStyle=format(
			"rgb({0},{1},{2})",
			this.color.r.toString(),
			this.color.g.toString(),
			this.color.b.toString()
		);
		ctx.closePath();
		ctx.fill();//这就是填充啦
		ctx.arc(
			this.posizition.x,
			this.posizition.y,
			this.radiu-0.6,
			0,
			Math.PI * 2,
			false
		);//星星外面还有一圈
		ctx.lineWidth=3;
		ctx.strokeStyle=ctx.fillStyle=format(
			"rgba({0},{1},{2},0.1)",
			this.color.r.toString(),
			this.color.g.toString(),
			this.color.b.toString()
		);
		ctx.closePath();
		ctx.stroke();
	};
}
function f(x) {
	return 270*1.3**(((x-49)**2)/848*(-1));
}

// canvas 直接搞常量
const background_painter = document.getElementById("background_painter");

//获取dom，更改一些东西
background_painter.width = document.body.scrollWidth;
background_painter.height = document.body.scrollHeight;//初始化，使canvas铺满全屏
center_point = {
	x: randomFrom(0, document.body.scrollWidth),
	y: randomFrom(0, document.body.scrollHeight),//确定中心点
};
ctx = background_painter.getContext("2d");
star_array = []; //用于存储星星实体的数组

//开始随机生成星星QWQ,从这开始就是初始化部分
var StatNumber = 1600; //这里就是星星的数量啦qwq，小末哥哥有需要的话可以改哦
for (var t = 0; t < StatNumber; t++) {
	var temp = new star(
		randomFrom(0, background_painter.width),
		randomFrom(0, background_painter.height)
		//随机产生星星的位置
	);
	temp.temp = randomFrom(-1000, 1000);//为了保证星星的位置不一样
	var a = hsvToRgb([f(randomFrom(14,86)), randomFrom(70, 100) , randomFrom(50, 100) ])

	temp.color.r = a[0];
	temp.color.g = a[1];
	temp.color.b = a[2];


	temp.distenceToCenter = Math.sqrt(
		(temp.posizition.x - center_point.x) ** 2 +
		(temp.posizition.y - center_point.y) ** 2
	);//使用直角坐标系两点距离公式计算星星距离中心点的距离
	star_array.push(temp);//将新的星星插♂入数组
}
function update_frame() {
	//为了拖尾就不要清除画布了
	//ctx.clearRect(0,0,background_painter.width,background_painter.height);
	//绘制星星本体
	for (index in star_array) {
		star_array[index].drawSelf(ctx, center_point);
	}
	//降低上一帧的透明度值，叠加起来就是星轨的特效了
	let image_data = ctx.getImageData(0, 0, background_painter.width, background_painter.height);
	//遍历像素
	let long = image_data.data.length;//提前取出长度
	for (var i = 0; i < long; i += 4) {
		//i:r,i+1:g.i+2:b,i+3:alpha
		if (image_data.data[i + 3] >=0) {
			if (image_data.data[i + 3]>100) image_data.data[i + 3] -= 1.5;		//这个地方就是alpha值减少的速度，更改这个地方就可以更改星轨长度了
			if (image_data.data[i + 3]<5) image_data.data[i + 3] = 0;
			if (image_data.data[i + 3]<=100) image_data.data[i + 3] -= 2;
		 };			//alpha自减，并防止减到负数
	}
	//把图像放回去
	ctx.putImageData(image_data, 0, 0)

	//setTimeout(	window.requestAnimationFrame,10,update_frame);

	window.requestAnimationFrame(update_frame);//请求下一帧
}

window.requestAnimationFrame(update_frame);//开始帧循环
window.onresize = function () {
	//自动调节canvas大小的函数
	background_painter.width = document.body.scrollWidth;
	background_painter.height = document.body.scrollHeight;
};
