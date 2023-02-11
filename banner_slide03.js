//バナースライドカルーセル2個表示ver
$(function () {
  const slidePanel = $('#sliderPanel3');
  const thumb = $('#thumb3');
  const thumbLi = '#thumb3 li'; //index()の仮引数に入れるので$で囲まない
  const allNum = thumb.find('li').length;
  let timerID;

  //スライド一つ分の横幅
  let itemSize = $('li', slidePanel).css('width');
  //数値化
  let slideSpace = parseInt(itemSize);

  const next = $('#next_w3'), prev = $('#prev_w3');
  //リアルサイズを取得
  $(window).on('resize', () => {
    itemSize = $('li', slidePanel).css('width');
    slideSpace = parseInt(itemSize);
    console.log(slideSpace);
  });


  //スライド中はclickさせない判定
  let flag = true;
  let thumbNum, copyItem;
  function nextSlide() {
    //index改めてセレクタを取得しないとダメみたい
    thumbNum = $('.act3').index(thumbLi);
    //actが最後から2番目についていたら
    if (thumbNum == allNum - 3) {
      $(thumbLi).eq(-2).addClass('act3').siblings('li').removeClass('act3');
      copyItem = $(thumbLi).eq(0).clone();
    } else if (thumbNum == allNum - 2) {
      //actが最後についていたら
      $(thumbLi).eq(-1).addClass('act3').siblings('li').removeClass('act3');
      copyItem = $(thumbLi).eq(1).clone();
    } else if (thumbNum == allNum - 1) {
      $(thumbLi).eq(0).addClass('act3').siblings('li').removeClass('act3');
      copyItem = $(thumbLi).eq(2).clone();
    } else {
      $(thumbLi).eq(thumbNum + 1).addClass('act3').siblings('li').removeClass('act3');
      copyItem = $(thumbLi).eq(thumbNum + 3).clone();
    }

    slidePanel.append(copyItem);
    slidePanel.stop().animate({ 'margin-left': slideSpace * -1 }, 500, 'swing',
      function () {
        $('li', this).eq(0).remove();
        $(this).css('margin-left', '0');
        $('.act3', this).removeClass();
        flag = true;
      });
  }

  function prevSlid() {
    thumbNum = $('.act3').index(thumbLi);
    //三つ表示なのでactの位置に注意
    if (thumbNum == 0) {
      $(thumbLi).eq(-1).addClass('act3').siblings('li').removeClass('act3');
      copyItem = $(thumbLi).last().clone();
    } else {
      $(thumbLi).eq(thumbNum - 1).addClass('act3').siblings('li').removeClass('act3');
      copyItem = $(thumbLi).eq(thumbNum - 1).clone();
    }

    slidePanel.prepend(copyItem).css('margin-left', slideSpace * -1);
    slidePanel.stop().animate({ 'margin-left': 0 }, 500, 'swing',
      function () {
        $('li', this).last().remove();
        $('.act3', this).removeClass();
        flag = true;
      });
  }

  //自動スライド
  timerID = setInterval(function () {
    if (flag == true) {
      flag = false;
      nextSlide();
    }
  }, 3000);

  next.on('click', function () {
    clearInterval(timerID);
    if (flag == true) {
      flag = false;
      nextSlide();
    }
    timerID = setInterval(function () {
      nextSlide();
    }, 3000);
  });

  prev.on('click', function () {
    clearInterval(timerID);
    if (flag == true) {
      flag = false;
      prevSlid();
    }
  });

  //サムネイルclick
  $(thumbLi).on('click', function () {
    clearInterval(timerID);
    if (flag == true) {
      flag = false;
      //clickした番号
      thumbNum = $(thumbLi).index(this);
      $(thumbLi).eq(thumbNum).addClass('act3').siblings('li').removeClass('act3');
      //clickした前後の番号
      let num1, num3;
      if (thumbNum == 0) {
        num1 = allNum - 1;
        num3 = thumbNum + 1;
      } else if (thumbNum == allNum - 1) {
        num1 = allNum - 2;
        num3 = 0;
      } else {
        num1 = thumbNum - 1;
        num3 = thumbNum + 1;
      }
      //cloneだと要素がコピーできなかった
      copyItem = $(thumbLi).eq(num1).html();
      slidePanel.append('<li>' + copyItem + '</li>');
      //三つのスライドを入替え
      slidePanel.stop().animate({ 'margin-left': slideSpace * -1 }, 200, 'linear',
        function () {
          $('li', this).eq(0).remove();
          $(this).css('margin-left', '0');
          copyItem = $(thumbLi).eq(thumbNum).html();
          slidePanel.append('<li>' + copyItem + '</li>');
          slidePanel.stop().animate({ 'margin-left': slideSpace * -1 }, 200, 'linear',
            function () {
              $('li', this).eq(0).remove();
              $(this).css('margin-left', '0');
              copyItem = $(thumbLi).eq(num3).html();
              slidePanel.append('<li>' + copyItem + '</li>');
              slidePanel.stop().animate({ 'margin-left': slideSpace * -1 }, 200, 'linear',
                function () {
                  $('li', this).eq(0).remove();
                  $(this).css('margin-left', '0');
                  flag = true;
                });
            });
        });
    }
    timerID = setInterval(function () {
      nextSlide();
    }, 3000);
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
      clearInterval(timerID);
      if (flag == true) {
        flag = false;
        nextSlide();
      }
    }
    else if (moveX == 'right') {
      clearInterval(timerID);
      if (flag == true) {
        flag = false;
        prevSlid();
      }
    }
  }

  function getX(e) {
    //横方向の座標を取得
    return e.originalEvent.touches[0].pageX;
  }

  //touchイベント領域
  const swipeEvent = $('#sliderPanel3');

  //スワイプ実行
  swipe(swipeEvent, startSwipe, moveSwipe, endSwipe);

});
