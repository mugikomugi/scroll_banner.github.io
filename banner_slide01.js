//バナースライド
$(function () {
  //スライド全ての個数
  const itemNum = $('#sliderPanel').find('li').length;
  //スライドコンテンツ一つの幅
  let itemSize = parseInt($('#sliderPanel li').css('width'));
  //スクロールバーのあるエリア
  const scrollArea = $('.panelFram');

  //スライドコンテンツの表示数、レスポンシブ
  let showNum;
  if (window.matchMedia('(max-width: 767px)').matches) {
    //スマホは1つ
    showNum = 1;
  } else if (window.matchMedia('(min-width: 768px)').matches) {
    //PCは2つ
    showNum = 2;
  }
  //スライドコンテンツ一つの幅x全体の個数から表示数を引いた値がスライド幅限界値にする
  let allSize = itemSize * (itemNum - showNum);

  //ナビarrowを格納
  const next = $('#next_w'), prev = $('#prev_w');

  //スクロール最大値になったらnextを隠す、-100pxは誤差のある場合の処置、0だったらprevを隠す
  const arrow = (scrollNum) => {
    if (scrollNum >= allSize - 100) {
      next.hide();
    } else if (scrollNum == 0) {
      prev.hide();
    } else {
      next.show();
      prev.show();
    }
  }

  //初期値のスクロール幅を取得
  let scrollBar = scrollArea.scrollLeft();
  arrow(scrollBar);

  //バーでスクロールした場合のnav表示、非表示
  scrollArea.on('scroll', () => {
    scrollBar = scrollArea.scrollLeft();
    arrow(scrollBar);
  })

  let positionLeft;
  //現在のスクロール値を取得して追加で値を足す
  next.on('click', () => {
    positionLeft = scrollArea.scrollLeft();
    positionLeft += itemSize;
    scrollArea.scrollLeft(positionLeft);
    arrow(positionLeft);
  });

  prev.on('click', () => {
    positionLeft = scrollArea.scrollLeft();
    positionLeft -= itemSize;
    scrollArea.scrollLeft(positionLeft);
    arrow(positionLeft);
  });
});
