// ============ 功能 ============ \\
//arg类型：
//1.函数
//2.字符串:  #xxx,.xxx,X
//3.对象
function vQuery(arg){
	//用来保存选中的元素
	this.elements=[];
	this.moveFlag = this.downFlag = false;
	console.log(arg)
	
	
	switch(typeof arg){
		case 'function':
				myAddEvent(window,'load',arg);  //使用window.onload当多个时间发生时，会产生覆盖
				break; 
		case 'string':
				switch(arg.charAt(0)){
					case '#':	//Id
						//#id
						var obj=document.getElementById(arg.substring(1));
						this.elements.push(obj);
						break;
					case '.':   //className
						//.class
						this.elements=getByClass(document,arg.substring(1));
						break;
					default:	//TagName	
						this.elements=document.getElementsByTagName(arg);
				}
				break;
		case 'object':
				this.elements.push(arg);
	}
};

vQuery.prototype = {
	
	// 1.显示内容
	show : function(){
		for (var i=0;i<this.elements.length;i++) {
			this.elements[i].style.display='block';			
		};
		return this;
	},
	
	// 2.隐藏内容
	hide : function(){
		for (var i=0;i<this.elements.length;i++) {
			this.elements[i].style.display='none';
		};
		return this;
	},
	
	// 3.改变属性
	css : function(attr,value){
		if(arguments.length==2){
			for (var i=0;i<this.elements.length;i++) {
				this.elements[i].style[attr]=value;
			}
			return this;
		}else{
			return getStyle(this.elements[0],attr);
		}
		
	},

	// 4.改变文本
	html : function(value){
		if(arguments.length == 1 || value == ""){		
			this.elements[0].innerHTML=value;
			return this;
		}else{
			return this.elements[0].innerHTML;
		}
		
	},
	
	// 5.eq选择器
	eq : function(n){
		return new vQuery(this.elements[n]);
	},
	
	// 6.是否有该class
	hasClass : function(cls){
		if (!this.elements[0] || !cls) return false;
		if (this.elements[0].classList) {
			return this.elements[0].classList.contains(cls);
		} else {
			return this.elements[0].className.match(new RegExp('(\\s|^)' + cls + '(\\s|$)'));
		}
	},
	
	// 7.添加class
	addClass : function(cls){
		if (this.elements[0].classList) {
	　　　　this.elements[0].classList.add(cls);
	　　} else {
	　　　　if (!hasClass(this.elements[0], cls)) this.elements[0].className += '' + cls;
	　　}
		return this;
	},
	
	// 8.移除class
	removeClass : function(cls){
		if (this.elements[0].classList) {
	　　　　this.elements[0].classList.remove(cls);
	　　} else {
	　　　　this.elements[0].className = this.elements[0].className.replace(new RegExp('(^|\\b)' + className.split(' ').join('|') + '(\\b|$)', 'gi'), ' ');
	　　}
		return this;
	},
	
	// 9.移除子节点
	empty : function(){
		//存在子节点时 循环继续
	    while(this.elements[0].hasChildNodes()){    
	        this.elements[0].removeChild(this.elements[0].firstChild);
	    }
	    return this;
	},
	
	// 10.获得value值
	val : function(value){
		if(arguments.length==1){ 
		  	this.elements[0].value = arguments[0];
		  	return this;
		 }else{
		 	return this.elements[0].value; 
		 }
	},
	
	// 11.向后面添加元素
	append : function(nodeValue){
		this.elements[0].appendChild(nodeValue);
		return this;
	},
	
	// 12.设置或获取属性
	attr : function(attr,value){
		 if(arguments.length==2){
		 	//设置属性              
		 	this.elements[0].setAttribute(attr,value);
            return this;
		 }else{
		 	//获取属性 
		 	var styles = this.elements[0].getAttribute(attr)		 	
		 	if(styles == null){
		 		styles = getStyle(this.elements[0],attr);
		 	}
		 	return styles;  
		 }
	},
	
	// 13.移除内联属性
	removeAttr : function(attr){
         return this.elements[0].removeAttribute(attr);
	},
	
	// 14.获取下标index
	index : function(){
		return getIndex(this.elements[0]);
	},
	
	// 15.为DOM element添加事件
	on : function(act,callback,data){
		var _this = this;
        if(window.addEventListener){//FF ...
                this.elements[0].addEventListener(act,function(e){
                        var e = e ? e : event;                                        
                        //e.stopPropagation();//清冒泡
                        callback.call(_this.elements[0],e,_this.elements[0],data)},false);
        }else if(window.attachEvent){//IE
                this.elements[0].attachEvent("on"+act,function(e){
                var e = e ? e : event;
                //window.event.cancelBubble = true;//清冒泡
                callback.call(_this.elements[0],e,_this.elements[0],data)});
        }
        return this;
	},
	
	// 16.遮罩及弹窗静止移动
	stopMove : function(){
		EventUtil.addHandler(this.elements[0], move, function(e) {
			e.preventDefault();
		});
	},
		
	// 17.按钮透明效果
	EventBtnOpactity : function(fun,ranges,booleans){
		this.makeTouchableButton();
		typeof ranges == "undefined" ? ranges = 0.6 : ranges = ranges;
		typeof booleans == "undefined" ? booleans = false : booleans = booleans;
		EventUtil.addHandler(this.elements[0], down, function (e) {
			
	        if (this.downFlag == false) {
	            return;
	        } else if (this.offKeyboard) {
	            this.offKeyboard();
	        }
	        e.stopPropagation();
	        if (typeof (this.i) == "undefined" && this.style.opacity == "0.5") {
	            return;
	        }
	        moveFlag = downFlag = true;
	        this.style.opacity = ranges;
	    })
	    EventUtil.addHandler(this.elements[0], move, function (e) {
	        if (this.downFlag == false) {
	            return;
	        }
	        if(booleans){
	        		e.preventDefault();
	        }
	        
	        if (!downFlag) return;
	        if (movexy(e) == this) {
	            moveFlag = true;
	            this.style.opacity = ranges;
	        } else {
	            moveFlag = false;
	            this.style.opacity = "1";
	        }
	        this.style.opacity = "1";
	    })
	    if (move != "touchmove") {
	        EventUtil.addHandler(this.elements[0], 'mouseout', function (e) {
	            e.preventDefault();
	            if (!downFlag) return;
	            downFlag = moveFlag = false;
	            this.style.opacity = "1";
	        })
	    }
	    EventUtil.addHandler(this.elements[0], up, function (e) {
	        if (this.downFlag == false) return;
	        if (typeof (this.i) != "undefined") {
	            this.style.opacity = "1";
	        }
			this.style.opacity = "1";
	        if (!downFlag) {
	            moveFlag = false;
	            return;
	        };	        
	        fun(this);
	        moveFlag = downFlag = false;
	    })
	},
	
	// 18.按钮按下缩小效果
	scaleBtn : function(fun,ranges,booleans){
	    this.makeTouchableButton();
	    typeof ranges == "undefined" ? ranges = 0.9 : ranges = ranges;
		typeof booleans == "undefined" ? booleans = false : booleans = booleans;	
		this.elements[0].addEventListener(down,function(){
			if(this.downFlag == false) {
		 		return;
		 	}
			moveFlag = downFlag = true;
			this.style.webkitTransform = "scale(" + ranges + "," + ranges + ")";
			this.style.transform = "scale(" + ranges + "," + ranges + ")";	
		});
		this.elements[0].addEventListener(move,function(e){
			if(this.downFlag == false) {
		 			return;
		 		}
			if(booleans){
	        		e.preventDefault();
	        }
	 		if(!downFlag) return;
	 		if(movexy(e) == this) {
	 			moveFlag = true;
	 			
	 		} else {
	 			moveFlag = false;
	
	 		}
		 	this.style.webkitTransform = "scale(1,1)";	
			this.style.transform = "scale(1,1)";
			
		});
		
		this.elements[0].addEventListener(up,function(){
			if(!downFlag) {
				moveFlag = false;
				return;
		 	};
		 	this.style.webkitTransform = "scale(1,1)";
			this.style.transform = "scale(1,1)";
			if(fun){fun(this)}
			moveFlag = downFlag = false;
		});
	},
	
	
	// 19.阻止滑动时的误触（根据手指的移动距离判断）
	makeTouchableButton : function(){
		if (!this.elements[0]) {
	        console.error("MIGlobals.makeTouchableButton 无效的元素！");
	        return false;
	    }
	    
	    this.elements[0].addEventListener("touchstart", function(evt){
	        this.setAttribute("data-moved", "n");
	        var p = evt.touches[0];
	        this.setAttribute("data-touch-start-clientx", p.clientX);
	        this.setAttribute("data-touch-start-clienty", p.clientY);
	        
	    });
	
	    this.elements[0].addEventListener("touchmove", function(evt){
	        if (this.getAttribute("data-moved") == "y") return false;
	
	        var p = evt.touches[0];
	        var startClientX = parseInt(this.getAttribute("data-touch-start-clientx"), 10);
	        var startClientY = parseInt(this.getAttribute("data-touch-start-clienty"), 10);
	        var deltax = p.clientX - startClientX;
	        var deltay = p.clientY - startClientY;
	        if (Math.abs(deltax) > 10 || Math.abs(deltay) > 10) {
	            this.setAttribute("data-moved", "y");
	        }
	    });
	
	    this.elements[0].addEventListener("touchend", function(evt) {
	        
	        if (this.getAttribute("data-moved") == "y") {
	            evt.stopImmediatePropagation();
	            return false;
	        }
	    });
	}
	
	
	
};


// 通过字面量方式实现的函数each
var $each =  function(object, callback){
  var type = (function(){
          switch (object.constructor){
            case Object:
                return 'Object';
                break;
            case Array:
                return 'Array';
                break;
            case NodeList:
                return 'NodeList';
                break;
            default:
                return 'null';
                break;
        }
    })();
    // 为数组或类数组时, 返回: index, value
    if(type === 'Array' || type === 'NodeList'){
        // 由于存在类数组NodeList, 所以不能直接调用every方法
        [].every.call(object, function(v, i){
            return callback.call(v, i, v) === false ? false : true;
        });
    }
    // 为对象格式时,返回:key, value
    else if(type === 'Object'){
        for(var i in object){
            if(callback.call(object[i], i, object[i]) === false){
                break;
            }
        }
    }
};

// 简写调用构造函数
function $(arg){
	return new vQuery(arg);
};

// 事件的兼容
function myAddEvent(obj,evt,fn){  //事件绑定，将会让一个事件发生多个
	if(obj.attachEvent){ 
		obj.attachEvent('on'+evt,fn); //attachEvent方法只支持IE浏览器,执行顺序是，后绑定的先执行．
	}else{    
		//功能相同的指令是addEventListener,该指令支持FF等浏览器，并且是W3C标准
		obj.addEventListener(evt,fn,false); //执行顺序是，先绑定的先执行
	}
};

// 获取class
function getByClass(oparent,oclass){  //指定标签名下的className
	var aEle=oparent.getElementsByTagName('*');
	var result=[];
	var i=0;
	for (i=0;i<aEle.length;i++) {
		if (aEle[i].className==oclass) {
			result.push(aEle[i]);
		}	
	}
	return result;
}; 

// 获取样式
function getStyle(obj,attr){
	if(obj.currentStyle){  //行内样式
		return obj.currentStyle[attr];
	}else{					//嵌入样式，外联样式
		return getComputedStyle(obj,false)[attr];
	}
};

// 获取下标
function getIndex(obj) {
	var aBrother = obj.parentNode.children;
	for(var i = 0; i < aBrother.length; i++) {
		if(aBrother[i] == obj) {
			return i;
		}
	}
}

// ============ 方法 ============ \\

// 按钮兼容写法
var EventUtil = {
    addHandler: function (oTarget, sEventType, fnHandler) {
        if (oTarget.addEventListener) {
            oTarget.addEventListener(sEventType, fnHandler, false);
        } else if (oTarget.attachEvent) {
            oTarget.attachEvent("on" + sEventType, fnHandler);
        } else {
            oTarget["on" + sEventType] = fnHandler;
        }
    }, removeHandler: function (oTarget, sEventType, fnHandler) {
        if (oTarget.removeEventListener) {
            oTarget.removeEventListener(sEventType, fnHandler, false);
        } else if (oTarget.detachEvent) {
            oTarget.detachEvent("on" + sEventType, fnHandler);
        } else {
            oTarget["on" + sEventType] = null;
        }
    }
};

function movexy(e) {
    var moveX = (move == "touchmove" ? e.targetTouches[0].pageX : e.pageX) - document.body.scrollLeft,
        moveY = (move == "touchmove" ? e.targetTouches[0].pageY : e.pageY) - document.body.scrollTop;
    var target = document.elementFromPoint(moveX, moveY);
    return target;
}

// js md5加密(主要用来加密公司域名)
var Easing={Linear:function(t,b,c,d){return c*t/d+b},Quad:{easeIn:function(t,b,c,d){return c*(t/=d)*t+b},easeOut:function(t,b,c,d){return -c*(t/=d)*(t-2)+b},easeInOut:function(t,b,c,d){if((t/=d/2)<1){return c/2*t*t+b}return -c/2*((--t)*(t-2)-1)+b}},Cubic:{easeIn:function(t,b,c,d){return c*(t/=d)*t*t+b},easeOut:function(t,b,c,d){return c*((t=t/d-1)*t*t+1)+b},easeInOut:function(t,b,c,d){if((t/=d/2)<1){return c/2*t*t*t+b}return c/2*((t-=2)*t*t+2)+b}},Quart:{easeIn:function(t,b,c,d){return c*(t/=d)*t*t*t+b},easeOut:function(t,b,c,d){return -c*((t=t/d-1)*t*t*t-1)+b},easeInOut:function(t,b,c,d){if((t/=d/2)<1){return c/2*t*t*t*t+b}return -c/2*((t-=2)*t*t*t-2)+b}},Quint:{easeIn:function(t,b,c,d){return c*(t/=d)*t*t*t*t+b},easeOut:function(t,b,c,d){return c*((t=t/d-1)*t*t*t*t+1)+b},easeInOut:function(t,b,c,d){if((t/=d/2)<1){return c/2*t*t*t*t*t+b}return c/2*((t-=2)*t*t*t*t+2)+b}},Sine:{easeIn:function(t,b,c,d){return -c*Math.cos(t/d*(Math.PI/2))+c+b},easeOut:function(t,b,c,d){return c*Math.sin(t/d*(Math.PI/2))+b},easeInOut:function(t,b,c,d){return -c/2*(Math.cos(Math.PI*t/d)-1)+b}},Expo:{easeIn:function(t,b,c,d){return(t==0)?b:c*Math.pow(2,10*(t/d-1))+b},easeOut:function(t,b,c,d){return(t==d)?b+c:c*(-Math.pow(2,-10*t/d)+1)+b},easeInOut:function(t,b,c,d){if(t==0){return b}if(t==d){return b+c}if((t/=d/2)<1){return c/2*Math.pow(2,10*(t-1))+b}return c/2*(-Math.pow(2,-10*--t)+2)+b}},Circ:{easeIn:function(t,b,c,d){return -c*(Math.sqrt(1-(t/=d)*t)-1)+b},easeOut:function(t,b,c,d){return c*Math.sqrt(1-(t=t/d-1)*t)+b},easeInOut:function(t,b,c,d){if((t/=d/2)<1){return -c/2*(Math.sqrt(1-t*t)-1)+b}return c/2*(Math.sqrt(1-(t-=2)*t)+1)+b}},Elastic:{easeIn:function(t,b,c,d,a,p){if(t==0){return b}if((t/=d)==1){return b+c}if(!p){p=d*0.3}if(!a||a<Math.abs(c)){a=c;var s=p/4}else{var s=p/(2*Math.PI)*Math.asin(c/a)}return -(a*Math.pow(2,10*(t-=1))*Math.sin((t*d-s)*(2*Math.PI)/p))+b},easeOut:function(t,b,c,d,a,p){if(t==0){return b}if((t/=d)==1){return b+c}if(!p){p=d*0.3}if(!a||a<Math.abs(c)){a=c;var s=p/4}else{var s=p/(2*Math.PI)*Math.asin(c/a)}return(a*Math.pow(2,-10*t)*Math.sin((t*d-s)*(2*Math.PI)/p)+c+b)},easeInOut:function(t,b,c,d,a,p){if(t==0){return b}if((t/=d/2)==2){return b+c}if(!p){p=d*(0.3*1.5)}if(!a||a<Math.abs(c)){a=c;var s=p/4}else{var s=p/(2*Math.PI)*Math.asin(c/a)}if(t<1){return -0.5*(a*Math.pow(2,10*(t-=1))*Math.sin((t*d-s)*(2*Math.PI)/p))+b}return a*Math.pow(2,-10*(t-=1))*Math.sin((t*d-s)*(2*Math.PI)/p)*0.5+c+b}},Back:{easeIn:function(t,b,c,d,s){if(s==undefined){s=1.70158}return c*(t/=d)*t*((s+1)*t-s)+b},easeOut:function(t,b,c,d,s){if(s==undefined){s=1.70158}return c*((t=t/d-1)*t*((s+1)*t+s)+1)+b},easeInOut:function(t,b,c,d,s){if(s==undefined){s=1.70158}if((t/=d/2)<1){return c/2*(t*t*(((s*=(1.525))+1)*t-s))+b}return c/2*((t-=2)*t*(((s*=(1.525))+1)*t+s)+2)+b}},Bounce:{easeIn:function(t,b,c,d){return c-Easing.Bounce.easeOut(d-t,0,c,d)+b},easeOut:function(t,b,c,d){if((t/=d)<(1/2.75)){return c*(7.5625*t*t)+b}else{if(t<(2/2.75)){return c*(7.5625*(t-=(1.5/2.75))*t+0.75)+b}else{if(t<(2.5/2.75)){return c*(7.5625*(t-=(2.25/2.75))*t+0.9375)+b}else{return c*(7.5625*(t-=(2.625/2.75))*t+0.984375)+b}}}},easeInOut:function(t,b,c,d){if(t<d/2){return Easing.Bounce.easeIn(t*2,0,c,d)*0.5+b}else{return Easing.Bounce.easeOut(t*2-d,0,c,d)*0.5+c*0.5+b}}}};var hexcase=0;var b64pad="";var chrsz=8;function hex_md5(s){return binl2hex(core_md5(str2binl(s),s.length*chrsz))}function b64_md5(s){return binl2b64(core_md5(str2binl(s),s.length*chrsz))}function str_md5(s){return binl2str(core_md5(str2binl(s),s.length*chrsz))}function hex_hmac_md5(key,data){return binl2hex(core_hmac_md5(key,data))}function b64_hmac_md5(key,data){return binl2b64(core_hmac_md5(key,data))}function str_hmac_md5(key,data){return binl2str(core_hmac_md5(key,data))}function md5_vm_test(){return hex_md5("abc")=="900150983cd24fb0d6963f7d28e17f72"}function core_md5(x,len){x[len>>5]|=128<<((len)%32);x[(((len+64)>>>9)<<4)+14]=len;var a=1732584193;var b=-271733879;var c=-1732584194;var d=271733878;for(var i=0;i<x.length;i+=16){var olda=a;var oldb=b;var oldc=c;var oldd=d;a=md5_ff(a,b,c,d,x[i+0],7,-680876936);d=md5_ff(d,a,b,c,x[i+1],12,-389564586);c=md5_ff(c,d,a,b,x[i+2],17,606105819);b=md5_ff(b,c,d,a,x[i+3],22,-1044525330);a=md5_ff(a,b,c,d,x[i+4],7,-176418897);d=md5_ff(d,a,b,c,x[i+5],12,1200080426);c=md5_ff(c,d,a,b,x[i+6],17,-1473231341);b=md5_ff(b,c,d,a,x[i+7],22,-45705983);a=md5_ff(a,b,c,d,x[i+8],7,1770035416);d=md5_ff(d,a,b,c,x[i+9],12,-1958414417);c=md5_ff(c,d,a,b,x[i+10],17,-42063);b=md5_ff(b,c,d,a,x[i+11],22,-1990404162);a=md5_ff(a,b,c,d,x[i+12],7,1804603682);d=md5_ff(d,a,b,c,x[i+13],12,-40341101);c=md5_ff(c,d,a,b,x[i+14],17,-1502002290);b=md5_ff(b,c,d,a,x[i+15],22,1236535329);a=md5_gg(a,b,c,d,x[i+1],5,-165796510);d=md5_gg(d,a,b,c,x[i+6],9,-1069501632);c=md5_gg(c,d,a,b,x[i+11],14,643717713);b=md5_gg(b,c,d,a,x[i+0],20,-373897302);a=md5_gg(a,b,c,d,x[i+5],5,-701558691);d=md5_gg(d,a,b,c,x[i+10],9,38016083);c=md5_gg(c,d,a,b,x[i+15],14,-660478335);b=md5_gg(b,c,d,a,x[i+4],20,-405537848);a=md5_gg(a,b,c,d,x[i+9],5,568446438);
d=md5_gg(d,a,b,c,x[i+14],9,-1019803690);c=md5_gg(c,d,a,b,x[i+3],14,-187363961);b=md5_gg(b,c,d,a,x[i+8],20,1163531501);a=md5_gg(a,b,c,d,x[i+13],5,-1444681467);d=md5_gg(d,a,b,c,x[i+2],9,-51403784);c=md5_gg(c,d,a,b,x[i+7],14,1735328473);b=md5_gg(b,c,d,a,x[i+12],20,-1926607734);a=md5_hh(a,b,c,d,x[i+5],4,-378558);d=md5_hh(d,a,b,c,x[i+8],11,-2022574463);c=md5_hh(c,d,a,b,x[i+11],16,1839030562);b=md5_hh(b,c,d,a,x[i+14],23,-35309556);a=md5_hh(a,b,c,d,x[i+1],4,-1530992060);d=md5_hh(d,a,b,c,x[i+4],11,1272893353);c=md5_hh(c,d,a,b,x[i+7],16,-155497632);b=md5_hh(b,c,d,a,x[i+10],23,-1094730640);a=md5_hh(a,b,c,d,x[i+13],4,681279174);d=md5_hh(d,a,b,c,x[i+0],11,-358537222);c=md5_hh(c,d,a,b,x[i+3],16,-722521979);b=md5_hh(b,c,d,a,x[i+6],23,76029189);a=md5_hh(a,b,c,d,x[i+9],4,-640364487);d=md5_hh(d,a,b,c,x[i+12],11,-421815835);c=md5_hh(c,d,a,b,x[i+15],16,530742520);b=md5_hh(b,c,d,a,x[i+2],23,-995338651);a=md5_ii(a,b,c,d,x[i+0],6,-198630844);d=md5_ii(d,a,b,c,x[i+7],10,1126891415);c=md5_ii(c,d,a,b,x[i+14],15,-1416354905);b=md5_ii(b,c,d,a,x[i+5],21,-57434055);a=md5_ii(a,b,c,d,x[i+12],6,1700485571);d=md5_ii(d,a,b,c,x[i+3],10,-1894986606);c=md5_ii(c,d,a,b,x[i+10],15,-1051523);b=md5_ii(b,c,d,a,x[i+1],21,-2054922799);a=md5_ii(a,b,c,d,x[i+8],6,1873313359);d=md5_ii(d,a,b,c,x[i+15],10,-30611744);c=md5_ii(c,d,a,b,x[i+6],15,-1560198380);b=md5_ii(b,c,d,a,x[i+13],21,1309151649);a=md5_ii(a,b,c,d,x[i+4],6,-145523070);d=md5_ii(d,a,b,c,x[i+11],10,-1120210379);c=md5_ii(c,d,a,b,x[i+2],15,718787259);b=md5_ii(b,c,d,a,x[i+9],21,-343485551);a=safe_add(a,olda);b=safe_add(b,oldb);c=safe_add(c,oldc);d=safe_add(d,oldd)}return Array(a,b,c,d)}function md5_cmn(q,a,b,x,s,t){return safe_add(bit_rol(safe_add(safe_add(a,q),safe_add(x,t)),s),b)}function md5_ff(a,b,c,d,x,s,t){return md5_cmn((b&c)|((~b)&d),a,b,x,s,t)}function md5_gg(a,b,c,d,x,s,t){return md5_cmn((b&d)|(c&(~d)),a,b,x,s,t)}function md5_hh(a,b,c,d,x,s,t){return md5_cmn(b^c^d,a,b,x,s,t)}function md5_ii(a,b,c,d,x,s,t){return md5_cmn(c^(b|(~d)),a,b,x,s,t)}function core_hmac_md5(key,data){var bkey=str2binl(key);if(bkey.length>16){bkey=core_md5(bkey,key.length*chrsz)}var ipad=Array(16),opad=Array(16);for(var i=0;i<16;i++){ipad[i]=bkey[i]^909522486;opad[i]=bkey[i]^1549556828}var hash=core_md5(ipad.concat(str2binl(data)),512+data.length*chrsz);return core_md5(opad.concat(hash),512+128)}function safe_add(x,y){var lsw=(x&65535)+(y&65535);var msw=(x>>16)+(y>>16)+(lsw>>16);return(msw<<16)|(lsw&65535)}function bit_rol(num,cnt){return(num<<cnt)|(num>>>(32-cnt))}function str2binl(str){var bin=Array();var mask=(1<<chrsz)-1;for(var i=0;i<str.length*chrsz;i+=chrsz){bin[i>>5]|=(str.charCodeAt(i/chrsz)&mask)<<(i%32)}return bin}function binl2str(bin){var str="";var mask=(1<<chrsz)-1;for(var i=0;i<bin.length*32;i+=chrsz){str+=String.fromCharCode((bin[i>>5]>>>(i%32))&mask)}return str}function binl2hex(binarray){var hex_tab=hexcase?"0123456789ABCDEF":"0123456789abcdef";var str="";for(var i=0;i<binarray.length*4;i++){str+=hex_tab.charAt((binarray[i>>2]>>((i%4)*8+4))&15)+hex_tab.charAt((binarray[i>>2]>>((i%4)*8))&15)}return str}function binl2b64(binarray){var tab="ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/";var str="";for(var i=0;i<binarray.length*4;i+=3){var triplet=(((binarray[i>>2]>>8*(i%4))&255)<<16)|(((binarray[i+1>>2]>>8*((i+1)%4))&255)<<8)|((binarray[i+2>>2]>>8*((i+2)%4))&255);for(var j=0;j<4;j++){if(i*8+j*6>binarray.length*32){str+=b64pad}else{str+=tab.charAt((triplet>>6*(3-j))&63)}}}return str};

//此处省略ajax请求代码...

// 签名加密算法
function joins(arg, mkey, c) {
    var str = "AS";
    if (!arg || arg.constructor != Object) {
        if (!arg) {
            str += ""
        } else {
            if (typeof arg == "string" || typeof arg == "boolean") {
                str += "X" + mkey + arg
            } else {
                var keys = [];
                if (c == 1) {
                    for (var key in arg[0]) {
                        keys.push(key)
                    }
                } else {
                    for (var i = 0; i < arg.length; i++) {
                        keys.push(i)
                    }
                }
                keys.sort();
                for (var i = 0; i < keys.length; i++) {
                    str += (keys[i] + "=" + joins((c == 1 ? arg[0][keys[i]] : String(arg[keys[i]])), mkey))
                }
            }
        }
    }
    return str
};

// 移动系统检测 安卓为1 ios为2
function IsIosAndroid(){
	if((/android/gi).test(navigator.appVersion)){
		return 1;
	}else if((navigator.userAgent.indexOf('iPhone') != -1) || (navigator.userAgent.indexOf('iPod') != -1) || (navigator.userAgent.indexOf('iPad') != -1)){
		return 2;
	}
}


 
// 系统提示
function SystemPrompt(txt){
	var BoxHint 	=	document.getElementById("boxHint");
	BoxHint.className = "";
	BoxHint.innerHTML = txt;
	BoxHint.style.display = "block";
	var www = BoxHint.offsetWidth;
	BoxHint.style.marginLeft = (BoxHint.offsetHeight > 100 ? -300 : -www/2)+"px";
	BoxHint.style.marginTop = -BoxHint.offsetHeight/2+"px";
	setTimeout(function(){
		var www = BoxHint.offsetWidth;
		BoxHint.style.marginLeft = (BoxHint.offsetHeight > 100 ? -300 : -www/2)+"px";
		BoxHint.className = "boxHintIn";
		clearInterval(BoxHint.Timer);
		BoxHint.Timer = setTimeout(function(){
			BoxHint.className = "boxHintOut";
			BoxHint.Timer = setTimeout(function(){
				BoxHint.style.display = "none";
			},250);
		},2000);
	});
}

//客户端交互此处省略


// 获取地址键值对的值
function GetUrlParam(){
    var url = window.location.search;
    var theRequest = new Object();
    if (url.indexOf("?") != -1) {
        var str = url.substr(1);
        strs = str.split("&");
        for (var i = 0; i < strs.length; i++) {
            theRequest[strs[i].split("=")[0]] = (strs[i].split("=")[1]);
        }
    }
    return theRequest;
}
var UrlParam 	=	GetUrlParam();
var CManager 	=	new ClientManager();


// 返回按钮
$("#footer_back").EventBtnOpactity(function(){
	var o 	=	GetUrlParam();
	if(!o.ActivityEntry){
		CManager.back();
		
		return;
	}
	var url 	=	window.location.origin+window.location.pathname+'?',
		step 	=	0,
		flag 	=	true;
	for(var i in o){
		var and 	=	step == 0 ? '' : '&';
		if(i != 'actId' && i != "ActivityEntry"){
			url += 	and+i+"="+o[i];
		}else if(flag){
			url += and+'ActivityEntry=2';
			flag 	=	false;
		}
		step++;
	}
	window.location.href 	=	url;
})

// 接口请求时的loading动画
function LoadingFun(){
	this.ele = $("#loading");
	this.eleMask = $("#loading_mask");
	
	this.init = function(){
		this.ele.stopMove();
		this.eleMask.stopMove();
		return this;
	},
	this.show = function(){
		this.ele.show();
		this.eleMask.show();
		return this;
	},
	this.hide = function(){
		this.ele.hide();
		this.eleMask.hide();
		return this;
	}
	
}
var loading = new LoadingFun();

// 点击关闭loading动画
$("#loading_close").EventBtnOpactity(function(){
	loading.init().hide();
})

// 多个按钮透明效果
var moveFlag = downFlag = false;

function $EventBtnOpactity(target, fun) {
	$makeTouchableButton(target);
    EventUtil.addHandler(target, down, function (e) {
        if (this.downFlag == false) {
            return;
        } else if (this.offKeyboard) {
            this.offKeyboard();
        }
        e.stopPropagation();
        if (typeof (this.i) == "undefined" && this.style.opacity == "0.5") {
            return;
        }
        moveFlag = downFlag = true;
        this.style.opacity = "0.5";
    })
    EventUtil.addHandler(target, move, function (e) {
        if (this.downFlag == false) {
            return;
        }
        if (!downFlag) return;
        if (movexy(e) == this) {
            moveFlag = true;
            this.style.opacity = "0.5";
        } else {
            moveFlag = false;
            this.style.opacity = "1";
        }
        this.style.opacity = "1";
    })
    if (move != "touchmove") {
        EventUtil.addHandler(target, 'mouseout', function (e) {
            e.preventDefault();
            if (!downFlag) return;
            downFlag = moveFlag = false;
            this.style.opacity = "1";
        })
    }
    EventUtil.addHandler(target, up, function (e) {
        if (this.downFlag == false) return;
        if (typeof (this.i) != "undefined") {
            this.style.opacity = "1";
        }
		this.style.opacity = "1";
        if (!downFlag) {
            moveFlag = false;
            return;
        };
        
        fun(this);
        
        moveFlag = downFlag = false;
    })
}

// 多个按钮缩小按钮
function $scaleBtn(id,fn){
	$makeTouchableButton(id);
	var moveFlag = downFlag = false;
	id.addEventListener(down,function(e){
		if(this.downFlag == false) {
	 		return;
	 	}
		moveFlag = downFlag = true;
		this.style.transform = "scale(0.95,0.95)";
		this.style.webkitTransform = "scale(0.95,0.95)";
		this.style.opacity = "0.8";
		e.stopPropagation();
	});
	id.addEventListener(move,function(e){
		if(this.downFlag == false) {
	 			return;
	 		}
	 		if(!downFlag) return;
	 		if(movexy(e) == this) {
	 			moveFlag = true;
	 			
	 		} else {
	 			moveFlag = false;
	
	 		}
	 	this.style.opacity = "1";
		this.style.transform = "scale(1,1)";
		this.style.webkitTransform = "scale(1,1)";
		this.style.opacity = "1";
		e.stopPropagation();
	});
	
	id.addEventListener(up,function(e){
		var e = e || window.event;
		if(!downFlag) {
			moveFlag = false;
			return;
	 	};
	 	
		this.style.transform = "scale(1,1)";
		this.style.webkitTransform = "scale(1,1)";
		this.style.opacity = "1";
		if(fn){fn(this)}
		moveFlag = downFlag = false;
		e.stopPropagation();
		e.cancelBubble = true;
	});

}


// 阻止滑动时的误触（根据手指的移动距离判断）
function $makeTouchableButton(ele) {
    if (!ele) {
        console.error("无效的元素！");
        return false;
    }
    
    
    ele.addEventListener("touchstart", function(evt){
        this.setAttribute("data-moved", "n");
        var p = evt.touches[0];
        this.setAttribute("data-touch-start-clientx", p.clientX);
        this.setAttribute("data-touch-start-clienty", p.clientY);
        
    });

    ele.addEventListener("touchmove", function(evt){
        if (this.getAttribute("data-moved") == "y") return false;

        var p = evt.touches[0];
        var startClientX = parseInt(this.getAttribute("data-touch-start-clientx"), 10);
        var startClientY = parseInt(this.getAttribute("data-touch-start-clienty"), 10);
        var deltax = p.clientX - startClientX;
        var deltay = p.clientY - startClientY;
        if (Math.abs(deltax) > 10 || Math.abs(deltay) > 10) {
            this.setAttribute("data-moved", "y");
        }
    });

    ele.addEventListener("touchend", function(evt) {
        
        if (this.getAttribute("data-moved") == "y") {
            evt.stopImmediatePropagation();
            return false;
        }
    });

}

// ============ 动画 ============ \\

// 金光闪闪动画封装对象
var awardPopup = {
	ele : null,
	mask : null,
	farther : document.getElementById("container"),
	
	init: function(){
		// 从dom中添加所有动画元素并展示
		this.ele = document.createElement("div");
		this.ele.className = "awardPopup";
		this.ele.innerHTML = '<h3></h3><div class="awardLight01 rotate"></div><div class="awardLight02"></div><div class="awardPopupPic" id="awardPopPic"></div><div class="awardPopupName" id="awardPopName" ></div><div class="awardPopupBtn" id="awardPopBtn" >确 定</div>';
		
		this.mask = document.createElement("div");
		this.mask.className = "mask awardPopupMask";
				
		this.farther.appendChild(this.ele);
		this.farther.appendChild(this.mask);
		
		return this;			
	},
	show: function(callBack){
		// 展示动画
		if(callBack){callBack( $("#awardPopPic"), $("#awardPopName"), $("#awardPopBtn") ) };		
	},
	hide: function(){
		// 从dom中移除所有动画创建的元素
		this.farther.removeChild(this.ele);
		this.farther.removeChild(this.mask);
		this.mask = this.ele = null;
	}
	
}



