// 仿pinterest瀑布流效果
// 有待改进的地方：拉宽浏览器resetting()算法

(function(parent, child) {	

	/*************************************
	变量定义：
	originalWidth：浏览器初始宽度
	box：每个相框
	imgData：图片json
	*************************************/

	var originalWidth = window.innerWidth || document.documentElement.clientWidth || document.body.clientWidth;
	var box = getChildElement(child);
	var imgData = {
					'data': [
						{'src': 'img1.jpg'}, {'src': 'img2.jpg'}, {'src': 'img3.jpg'}, {'src': 'img4.jpg'}, {'src': 'img5.jpg'}, {'src': 'img6.jpg'}, {'src': 'img7.jpg'}, {'src': 'img8.jpg'}, {'src': 'img9.jpg'}, {'src': 'img10.jpg'}, {'src': 'img11.jpg'}, {'src': 'img12.jpg'}
					]
				};



	/*************************************
	事件定义：
	onload：加载imageLayout()，做出瀑布流效果
	onscroll：加载loading()，调用json数据加载图片，之后调用imageLayout重新布局
	onresize：通过currentWidth获得新的浏览器宽度数值，如果此时新的宽度大于先前宽度，则先调用resetting()删除所有图片的inline－style；然后更新浏览器宽度数值，最后统一调用imageLayout()进行瀑布流效果布局
	*************************************/

	window.onload = function() {
		imageLayout();
	};
	window.onscroll = function() {
		loading();
		imageLayout();
	};
	window.onresize = function() {
		var currentWidth = window.innerWidth || document.documentElement.clientWidth || document.body.clientWidth;
		if (currentWidth>originalWidth) {
			resetting();
		}
		originalWidth = currentWidth;
		imageLayout();
	};



	/*************************************
	函数定义：
	getChildElement(contentClassName)：
	imageLayout()：
	loading()：
	resetting()：
	*************************************/

	function getChildElement(contentClassName) {
		var contentArr = [];
		var allContent = document.getElementById(parent).getElementsByTagName('*');
		for (var i=0, j=allContent.length; i<j; i++) {
			if (allContent[i].className === contentClassName) {
				contentArr.push(allContent[i]);
			}
		}
		return contentArr;
	}
	function imageLayout() {
		var unitWidth = box[0].offsetWidth;
		var numPerLine = Math.floor(originalWidth/unitWidth);
		document.getElementById(parent).style.cssText = 'width: ' + unitWidth*numPerLine + 'px; margin: 0 auto;';
		var boxHeightArr = [];
		var minHeight;
		var minIndex;
		for (var i=0, j=box.length; i<j; i++) {
			if (i<numPerLine) {
				boxHeightArr[i] = box[i].offsetHeight;
			} else {
				minHeight = Math.min.apply(null, boxHeightArr);
				minIndex = getMinIndex(boxHeightArr, minHeight);
				box[i].style.cssText = 'position: absolute; top: ' + minHeight + 'px; left: ' + box[minIndex].offsetLeft + 'px;';
				boxHeightArr[minIndex] += box[i].offsetHeight;
			}
		}
		function getMinIndex(boxHeightArr, minHeight) {
			for(var i in boxHeightArr) {
				if (boxHeightArr[i] === minHeight) {
					return i;
				}
			}
		}
	}
	function loading() {
		var lastVerticalPosition = box[box.length-1].offsetTop;
		var totalHeight = (window.innerHeight || document.documentElement.clientHeight || document.body.clientHeight) + (document.documentElement.scrollTop || document.body.scrollTop);
		if (totalHeight > lastVerticalPosition) {
			for (var i=0, j=imgData.data.length; i<j; i++) {
				var createdBox = document.createElement('div');
				createdBox.className = child;
				createdBox.innerHTML = '<div class="box_img"><img src="images/' + imgData.data[i].src + '" alt="image' + (i+1) + '"></div>';
				document.getElementById(parent).appendChild(createdBox);
			}
			box = getChildElement(child);
		}
	}
	function resetting() {
		for (var i in box) {
			box[i].removeAttribute('style');
		}
	}

})('container', 'box');


