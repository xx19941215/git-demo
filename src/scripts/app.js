/**
 * Created by 肖潇 on 2016/8/14.
 */

window.onload = function () {
  document.body.ontouchmove = function (e) {
    e.preventDefault();
  }

  var ul_left = $(".jd_category_left_box>ul");
  var ul_height = ul_left.offsetHeight;
  var ul_parent_heigt = $(".jd_category_left_box").offsetHeight;
  const MAX_BOUNCE = 150;
  var category = $(".jd_category_right_box");
  var category_height = $(".jd_category_right_box").offsetHeight;
  var category_parent_height = $(".jd_category_right").offsetHeight;


  ul_left.addEventListener("touchstart", touchS, false);
  ul_left.addEventListener("touchmove", touchM, false);
  ul_left.addEventListener("touchend", touchE, false);


  var startPoint = {}, endPoint = {}, moveY = 0, moveOne = 0, hasMoved = 0, startTime = 0, endTime = 0, clickShouldMove = 0, clickHasMoved = 0;

  function touchS(e) {
    startPoint = getPoint(e);
    startTime = Date.now();
  }

  function touchM(e) {
    endPoint = getPoint(e);
    //安卓bug，只触发一次touchmove
    e.preventDefault();
    //move一次的距离
    moveOne = endPoint.y - startPoint.y;
    //保证moveOne永远都是正数，以防晕了
    moveOne = Math.abs(moveOne);
    //向上滑
    if (endPoint.y < startPoint.y) {
      moveY = -moveOne;
    } else {
      //向下滑
      moveY = moveOne;
    }
    console.log(moveOne);
    //每划一次加上之前已经划了的距离
    moveY += hasMoved;

    //当向上滑的距离超过了子元素高度-父元素高度+MAX_BOUNCE
    if (moveY < -(ul_height - ul_parent_heigt + MAX_BOUNCE)) {
      moveY = -(ul_height - ul_parent_heigt + MAX_BOUNCE);

    }
    //要是向下滑的距离超过了最大限制高度，向下滑Transform为正
    if (moveY > MAX_BOUNCE) {
      moveY = MAX_BOUNCE;

    }
    removeTransition(ul_left);
    setTransform(ul_left, moveY);
  }

  function touchE(e) {
    endTime = Date.now();
    if (moveY == 0 && endTime - startTime < 200) {
      //认为是单击
      clickHandler(e);
      return;
    }
    //结束的时候记录下现在划了多远
    hasMoved = moveY;
    //向上滑到了临界值
    if (hasMoved >= -(ul_height - ul_parent_heigt + MAX_BOUNCE) && hasMoved <= -(ul_height - ul_parent_heigt)) {
      setTransition(ul_left);
      setTransform(ul_left, -(ul_height - ul_parent_heigt));
      //重置hasMoved
      hasMoved = -(ul_height - ul_parent_heigt);
    }
    //向下滑到了临界值
    if (hasMoved <= MAX_BOUNCE && hasMoved > 0) {
      setTransition(ul_left);
      setTransform(ul_left, 0);
      //重置hasMoved
      hasMoved = 0;
    }
    //重置moveY
    moveY = 0;

  }

  function clickHandler(e) {
    //点击里面滑动的Y都是负数
    getDis(e);

    //当向上滑的距离超过了子元素高度-父元素高度+MAX_BOUNCE
    if (clickShouldMove >= (ul_height - ul_parent_heigt)) {
      clickHasMoved = -(ul_height - ul_parent_heigt);

    } else {
      //要是向下滑的距离超过了最大限制高度，向下滑Transform为正
      //if(clickShouldMove>=0){
      //  clickM = 0;
      //
      //}
      clickHasMoved = -clickShouldMove;
    }
    setTransition(ul_left);
    setTransform(ul_left, clickHasMoved);
    //同步数据
    hasMoved = clickHasMoved;
  }

//根据事件对象获得应该移动的距离并改变样式
  function getDis(e) {
    var ele = e.changedTouches[0].target;

    //点击now下面的
    if (ele.offsetTop > ul_left.getElementsByClassName("now")[0].offsetTop) {
      ele.parentNode.className = "now";
      ul_left.getElementsByClassName("now")[0].className = "";
    } else {
      //点击now上面的
      ul_left.getElementsByClassName("now")[0].className = "";
      ele.parentNode.className = "now";
    }
    //记录当前点击使ul滑动了多少
    clickShouldMove = ele.offsetTop - 45;
  }

  ul_left.addEventListener('transitionend', transitionEnd(ul_left), false);
  ul_left.addEventListener('webkitTransitionEnd', transitionEnd(ul_left), false);
  ul_left.addEventListener('mozTransitionEnd', transitionEnd(ul_left), false);

//category事件绑定
  category.addEventListener("touchstart", touchSC, false);
  category.addEventListener("touchmove", touchMC, false);
  category.addEventListener("touchend", touchEC, false);

  var startPointC = {}, endPointC = {}, moveYC = 0, moveOneC = 0, hasMovedC = 0;

  function touchSC(e) {
    startPointC = getPoint(e);
  }

  function touchMC(e) {
    endPointC = getPoint(e);
    //安卓bug，只触发一次touchmove
    e.preventDefault();
    //move一次的距离
    moveOneC = endPointC.y - startPointC.y;
    //保证moveOne永远都是正数，以防晕了
    moveOneC = Math.abs(moveOneC);
    //向上滑
    if (endPointC.y < startPointC.y) {
      moveYC = -moveOneC;
    } else {
      //向下滑
      moveYC = moveOneC;
    }
    console.log(moveOneC);
    //每划一次加上之前已经划了的距离
    moveYC += hasMovedC;


    if (moveYC < -(category_height - category_parent_height + MAX_BOUNCE)) {
      moveYC = -(category_height - category_parent_height + MAX_BOUNCE);
    }
    //要是向下滑的距离超过了最大限制高度，向下滑Transform为正
    if (moveYC > MAX_BOUNCE) {
      moveYC = MAX_BOUNCE;
    }
    removeTransition(category);
    setTransform(category, moveYC);
  }

  function touchEC(e) {
    //结束的时候记录下现在划了多远
    hasMovedC = moveYC;
    //向上滑到了临界值
    if (hasMovedC >= -(category_height - category_parent_height + MAX_BOUNCE) && hasMovedC <= -(category_height - category_parent_height)) {
      setTransition(category);
      setTransform(category, -(category_height - category_parent_height));
      //重置hasMoved
      hasMovedC = -(category_height - category_parent_height);
    }
    //向下滑到了临界值
    if (hasMovedC <= MAX_BOUNCE && hasMovedC > 0) {
      setTransition(category);
      setTransform(category, 0);
      //重置hasMoved
      hasMovedC = 0;
    }
    //重置moveY
    moveYC = 0;
  }

  category.addEventListener('transitionend', transitionEnd(category), false);
  category.addEventListener('webkitTransitionEnd', transitionEnd(category), false);
  category.addEventListener('mozTransitionEnd', transitionEnd(category), false);


  function transitionEnd(self) {
    removeTransition(self);
  }

  function getPoint(e) {
    var x = e.touches[0].pageX;
    var y = e.touches[0].pageY;
    return {x: x, y: y};
  }

//设置变换
  function setTransform(ele, s) {
    ele.style.transform = "translateY(" + s + "px)";
  }

//设置过度
  function setTransition(ele) {
    ele.style.transition = "all .3s linear";
    ele.style.webkitTransition = "all .3s linear";

  }

//取消过度
  function removeTransition(ele) {
    ele.style.transition = "none";
    ele.style.webkitTransition = "none";
  }

  function $(sel) {
    return document.querySelector(sel);
  }
}
