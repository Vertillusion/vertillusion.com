function randomFrom(lowerValue, upperValue) {
	return Math.floor(Math.random() * (upperValue - lowerValue + 1) + lowerValue);
} //生成区域随机数
function format(val) {
	var args = Array.prototype.slice.call(arguments, 1);
	return val.replace(/{(\d+)}/g, function (match, number) {
		return typeof args[number] !== "undefined" ? args[number] : match;
	});
}

function star(x, y) {
	this.posizition = { x: x, y: y }; //星星位置
	this.pathLength = undefined; //轨道长度
	this.temp = undefined; //用于计算新位置的自增的数字
	this.distenceToCenter = 0;
	this.radiu = 1; //半径
	this.color = { r: 255, g: 255, b: 255, a: 1 };
	this.drawSelf = function a(ctx, center) {
		//移动
		//this.temp+=this.distenceToCenter*0.00007
		this.temp += 0.001;
		this.posizition.x = center.x + Math.cos(this.temp) * this.distenceToCenter;
		this.posizition.y = center.y + Math.sin(this.temp) * this.distenceToCenter;
		//绘画本体
		ctx.beginPath();
		ctx.arc(
			this.posizition.x,
			this.posizition.y,
			this.radiu,
			0,
			Math.PI * 2,
			false
		);
		ctx.fillStyle = format(
			"rgba({0},{1},{2},{3}",
			this.color.r.toString(),
			this.color.g.toString(),
			this.color.b.toString(),
			this.color.a.toString()
		);
		ctx.closePath();
		ctx.fill();
	};
}
//获取dom，更改一些东西
canvas_dom = document.getElementById("background_drewer");
canvas_dom.width = document.body.clientWidth;
canvas_dom.height = document.body.clientHeight;
center_point = {
	x: randomFrom(0, document.body.clientWidth),
	y: randomFrom(0, document.body.clientHeight),
};
ctx = canvas_dom.getContext("2d");
ctx.clearRect(0,0,canvas_dom.width,canvas_dom.height)
star_array = []; //用于存储星星实体的数组

//开始随机生成星星QWQ
var StatNumber = 200; //这里就是星星的数量啦qwq，小末哥哥有需要的话可以改哦
for (var t = 0; t < StatNumber; t++) {
	var temp = new star(
		randomFrom(0, canvas_dom.width),
		randomFrom(0, canvas_dom.height)
	);
	temp.temp = randomFrom(-1000, 1000);
	temp.distenceToCenter = Math.sqrt(
		(temp.posizition.x - center_point.x) *
		(temp.posizition.x - center_point.x) +
		(temp.posizition.y - center_point.y) *
		(temp.posizition.y - center_point.y)
	);
	temp.pathLength = temp.distenceToCenter * 2;
	star_array.push(temp);
}
function update_frame() {
	//为了拖尾就不要清除画布了
	//ctx.clearRect(0,0,canvas_dom.width,canvas_dom.height);

	
	for (index in star_array) {
		star_array[index].drawSelf(ctx, center_point);
	}
	ctx.globalCompositeOperation='destination-in';		//这个参数可以让下面的那个黑色透明蒙版只画在星星上面
	ctx.fillStyle="rgba(0,0,0,0.996)";			//这个数值调了好久，麻烦不要乱动
	ctx.fillRect(0,0,canvas_dom.width,canvas_dom.height)
	ctx.globalCompositeOperation='source-over';
	
	let image_data=ctx.getImageData(0,0,canvas_dom.width,canvas_dom.height);
	//遍历像素
	for(var i=0;i<image_data.data.length;i+=4){
		//i:r,i+1:g.i+2:b,i+3:alpha
			if(image_data.data[i+3]<128){			//这个128是个临界值，就刚刚可以把那些过长的星轨的像素选中
				image_data.data[i]-=2;			//rgb都自减，相当于降低灰度
				image_data.data[i+1]-=2;
				image_data.data[i+2]-=2;
				if(image_data.data[i+3]!=0){image_data.data[i+3]--};			//alpha自减，直到
			}
			//console.log("fuck")

			//console.log(image_data[i+2])
		}
	//把图像放回去
	ctx.putImageData(image_data,0,0)
	//console.log(image_data);
	


	//setTimeout(	window.requestAnimationFrame,10,update_frame);
	window.requestAnimationFrame(update_frame);
}

window.requestAnimationFrame(update_frame);
window.onresize = function a() {
	canvas_dom = document.getElementById("background_drewer");
	canvas_dom.width = document.body.clientWidth;
	canvas_dom.height = document.body.clientHeight;
};
