
# common.js，微型仿jq部分功能
### $("")可获取目标的 id 、.class、 TagName     
### 循环遍历（[对象或数组或类数组]，执行的函数）：       $each(arr,fn);
### 功能：
### 1.显示内容        					show();
### 2.隐藏内容        					hide();
### 3.改变属性        					css();
### 4.改变文本        					html();
### 5.eq选择器    	  					eq();
### 6.是否有该class   					hasClass();
### 7.添加class      					addClass();
### 8.移除class     					removeClass();
### 9.移除所有子节点 						empty();
### 10.获得输入框的值						val();
### 11.向后面添加元素					append();
### 12.设置或获取属性					attr();
### 13.移除内联属性					removeAttr();
### 14.获取下标index					index();
### 15.为DOM element添加事件            on(act,callback,data);
 `act为事件名称 - callback为事件触发后的回调 - data为规定传递到函数的额外数据 `
### 16.遮罩及弹窗静止移动					stopMove();
### 17.按钮透明效果						EventBtnOpactity(fun,ranges,booleans);
  `fun为当事件发生时运行的函数 - ranges为透明度调节系数0-1默认为0.6 - booleans为按钮是否可滑动默认滑动为flase (ranges与booleans参数可不填走默认)`
### 18.按钮按下缩小效果					scaleBtn(fun,ranges,booleans);			
 `参数效果同上16`
### 19.阻止滑动时的误触发生事件			makeTouchableButton();

## 动画
### 1.金光闪闪动画封装对象 awardPopup

















