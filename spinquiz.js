/* 鼠标围绕旋转的小程序
 * 作者：谢鑫斌
 * 日期：2017-03-08
 */
var Spin = {};
this.Spin = this.Spin || {};

Spin.Tester = function (cumulateShow,speedShow,sectionShow) {	
	//鼠标当前坐标
	var _pos = null;
	//记录鼠标经过的扇区
	//扇区值：右上，右下，左下，左上
	var _arrSection = new Array(4);
	//鼠标经过的坐标
	var _mousePosArr = [];
	//圈数
	var _cumulate = null;
	//速度
	var _speed = null;
	//界面显示
	var _cumulateShow = null;
	var _speedShow = null;
	var _sectionShow = null;
	
	//是否跟踪鼠标移动
	var _isTracking = true;
	var trackTimer = null;
	
	if (cumulateShow != null) {
		_cumulateShow = cumulateShow;
	}
	if (speedShow != null) {
		_speedShow = speedShow;
	}
	if (sectionShow != null) {
		_sectionShow = sectionShow;
	}	
	
	clearState();
	
	//定时采样
	function trackingState() {
		//恢复采样
		_isTracking = true;
		
	};
	trackTimer = setInterval(trackingState, 20);
	
	//获取鼠标位置,x|y
	function mousePos(e) {
		if (e.pageX || e.pageY) {
			return { x: e.pageX, y: e.pageY };
		}
		return {
			x: e.clientX + document.body.scrollLeft - document.body.clientLeft,
			y: e.clientY + document.body.scrollTop - document.body.clientTop
		};
	};

	$(document).mousemove(function (e) {
		if (_isTracking) {
			var prePos = null;
			if (_mousePosArr != null && _mousePosArr.length > 0) {
				prePos = _mousePosArr[_mousePosArr.length-1];				
			}

			//记录最新的位置
			_pos = mousePos(e);
			_mousePosArr[_mousePosArr.length] = _pos;

			var section = null;
			//计算位置所在扇区
			if (prePos != null) {
				if (prePos.x < _pos.x && prePos.y < _pos.y) {
					//顺时针转动在右上扇区
					section = 1;
					_arrSection[0] = 1;
				} else if (prePos.x > _pos.x && prePos.y < _pos.y) {
					//顺时针转动在右下扇区
					section = 2;
					_arrSection[1] = 1;
				} else if (prePos.x > _pos.x && prePos.y > _pos.y) {
					//顺时针转动在左下扇区
					section = 3;
					_arrSection[2] = 1;
				} else if (prePos.x < _pos.x && prePos.y > _pos.y) {
					//顺时针转动在左上扇区
					section = 4;
					_arrSection[3] = 1;
				}
			}
			if (section != null) {
				var pre,next=null;
				switch (section) {
					case 1: pre=4;next=2;break;
					case 2: pre=1;next=3;break;
					case 3: pre=2;next=4;break;
					case 4: pre=3;next=1;break;
					default:
						clearState();
				}
				_sectionShow.innerHTML = section;
				var sections = 0;				
				for (var i=0;i<_arrSection.length;i++) {
					if (_arrSection[i] == 1) {
						sections += 1;
					}
				}
				
				if (sections == 4) {
					//计算是否为结束扇区的闭合点
					_cumulate += 1;
					clearState();
					_cumulateShow.innerHTML = _cumulate;
				}
				var clockwise = (_arrSection[pre-1] == 0 || _arrSection[pre-1] == 1) && (_arrSection[next-1] == 0) && (sections < 4);
				if (!clockwise) {
					clearState();
				}
			}
			
			//计算speed
			if (prePos != null && _pos != null) {
				var distance = calcDistance(prePos, _pos);
				if (distance > 0) {
					_speed = distance/20;
					_speedShow.innerHTML = _speed.toFixed(2);
				}
			}
			_isTracking = false;
		}
	});
	
	//恢复初始状态
	function clearState() {
		//表示不是顺时针，恢复初始状态
		_pos = null;
		_speed = 0;
		_mousePosArr = []
		for (var i = 0; i<_arrSection.length; i++) {			
			_arrSection[i] = 0;
		}
	}	
	//计算两个点的距离
	function calcDistance (p1, p2) {
		var diffX = p2.x - p1.x;        
		var diffY = p2.y - p1.y;
		return Math.pow((diffX *diffX + diffY * diffY), 0.5);
	}
}