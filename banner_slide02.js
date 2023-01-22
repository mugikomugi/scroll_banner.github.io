//バナースライドカルーセル2個表示ver
$(function () {
  const slidePanel = $('#sliderPanel2');
  const thumb = $('#thumb2');
  const thumbLi = '#thumb2 li'; //index()の仮引数に入れるので$で囲まない
  const allNum = thumb.find('li').length;

  //スライド一つ分の横幅
  let itemSize = $('li', slidePanel).css('width');
  //数値化
  let slideSpace = parseInt(itemSize);

  const next = $('#next_w2'), prev = $('#prev_w2');
  //リアルサイズを取得
  $(window).on('resize', () => {
    itemSize = $('li', slidePanel).css('width');
    slideSpace = parseInt(itemSize);
  });

  //スライド中はclickさせない判定
  let flag = true;
  let tunbNum, copyItem;
  function nextSlide() {
    //index改めてセレクタを取得しないとダメみたい
    tunbNum = $('.act').index(thumbLi);
    //actが最後についていたら最初に付け替える
    if (tunbNum == allNum - 1) {
      $(thumbLi).eq(0).addClass('act').siblings('li').removeClass('act');
      copyItem = $(thumbLi).eq(0).clone();
    } else {
      $(thumbLi).eq(tunbNum + 1).addClass('act').siblings('li').removeClass('act');
      copyItem = $(thumbLi).eq(tunbNum + 1).clone();
    }

    slidePanel.append(copyItem);
    slidePanel.stop().animate({ 'margin-left': slideSpace * -1 }, 500,
      function () {
        $('li', this).eq(0).remove();
        $(this).css('margin-left', '0');
        $('.act', this).removeClass();
        flag = true;
      });
  }

  function prevSlid() {
    tunbNum = $('.act').index(thumbLi);
    //二つ表示なのでactの位置に注意
    //actが2番目なら最初につける
    if (tunbNum == 1) {
      $(thumbLi).eq(0).addClass('act').siblings('li').removeClass('act');
      //最後のサムネをクローン
      copyItem = $(thumbLi).last().clone();
    } else if (tunbNum == 0) {
      //actが最初なら最後につける
      $(thumbLi).eq(allNum - 1).addClass('act').siblings('li').removeClass('act');
      //最後のサムネから2番目をクローン
      copyItem = $(thumbLi).eq(allNum - 2).clone();
    } else {
      //actの一つ前
      $(thumbLi).eq(tunbNum - 1).addClass('act').siblings('li').removeClass('act');
      //actから2番目前をクローン
      copyItem = $(thumbLi).eq(tunbNum - 2).clone();
    }

    slidePanel.prepend(copyItem).css('margin-left', slideSpace * -1);
    slidePanel.stop().animate({ 'margin-left': 0 }, 500,
      function () {
        $('li', this).last().remove();
        $('.act', this).removeClass();
        flag = true;
      });
  }

  next.on('click', function () {
    if (flag == true) {
      flag = false;
      nextSlide();
    }
  });

  prev.on('click', function () {
    if (flag == true) {
      flag = false;
      prevSlid();
    }
  });


  //***touchイベント***
  let moveX, posiX;

  //仮引数で関数に入れて汎用化
  function swipe(touchEvent, start_check, move_check, end_check) {

    //指が触れたか検知
    touchEvent.on('touchstart', start_check);

    //指が動いたか検知
    touchEvent.on('touchmove', move_check);

    //指が離れたか検知
    touchEvent.on('touchend', end_check);

  }

  //タッチ開始時の処理
  function startSwipe(e) {
    //現在の座標取得/
    posiX = getX(e);
    //移動距離状態を初期化/
    moveX = '';
  }

  //スワイプ中の処理
  function moveSwipe(e) {
    if (posiX - getX(e) > 20) // 10px以上移動でスワイプと判断
    {
      // 右→左と判断
      moveX = 'left';
    } else if (posiX - getX(e) < -20)  // 10px以上移動でスワイプと判断
    {
      moveX = 'right';
    }
  }

  //指が離れた時の処理
  function endSwipe() {
    if (moveX == 'left') {
      nextSlide();
    }
    else if (moveX == 'right') {
      prevSlid();
    }
  }

  function getX(e) {
    //横方向の座標を取得
    return e.originalEvent.touches[0].pageX;
  }

  //touchイベント領域
  const swipeEvent = $('#sliderPanel2');

  //スワイプ実行
  swipe(swipeEvent, startSwipe, moveSwipe, endSwipe);

});