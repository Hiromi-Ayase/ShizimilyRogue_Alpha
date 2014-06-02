

window.onload = function () {
    enchant();
    var view = new Game(640, 480);
    view.preload("map.png", "unit.png", "windowmessage.png");
    view.fps = 30;

    var MessageWindow = enchant.Class.create(enchant.Group, {
        // コンストラクタ.
        initialize: function (x, y) {
            enchant.Group.call(this);                         // 継承元をコール.
            this.x = x;                                         // メッセージウィンドウを表示するX座標.
            this.y = y;                                         // メッセージウィンドウを表示するY座標.

            var bg = new Sprite(480, 64);                     // 幅と高さを設定.
            bg.image = view.assets["windowmessage.png"];    // メッセージウィンドウの背景画像を設定.
            bg.x = 0;                                           // X座標(グループ内相対).
            bg.y = 0;                                           // Y座標(グループ内相対).
//            bg.opacity = 0.7;
            this.addChild(bg);                                // グループに背景画像を追加.

            var line1 = new Label("テキスト１行目");           // メッセージ文字列を生成.
            line1.font = "20px PixelMplus10";                   // 文字サイズとWEBフォントの設定.
            line1.color = '#f8f8f8';                            // 文字色の設定.
            line1.x = 26;                                       // X座標(グループ内相対).
            line1.y = 10;                                       // Y座標(グループ内相対).
            line1.width = 400;                                  // 20文字分(20x20)の幅を確保.
            line1.textAlign = "left";                           // 左揃えに設定.
            this.addChild(line1);                             // グループにメッセージ文字列を追加.

            var line2 = new Label("テキスト２行目");           // メッセージ文字列を生成.
            line2.font = "20px PixelMplus10";                   // 文字サイズとWEBフォントの設定.
            line2.color = '#f8f8f8';                            // 文字色の設定.
            line2.x = 26;                                       // X座標(グループ内相対).
            line2.y = 34;                                       // Y座標(グループ内相対).
            line2.width = 400;                                  // 20文字分(20x20)の幅を確保.
            line2.textAlign = "left";                           // 左揃えに設定.
            this.addChild(line2);                             // グループにメッセージ文字列を追加.
        },
        setText: function (text1, text2) {
            this.childNodes[1].text = text1;                  // メッセージ文字列の更新.
            this.childNodes[2].text = text2;                  // メッセージ文字列の更新.
        }
    });

    view.onload = function () {

        var wholeScene = new Group();

        // ダンジョンのうち、静止画で対応するものはmapで描画
        for (var layer = 0; layer < MAX_LAYER; layer++) {
            var map = new Map(OBJECT_WIDTH, OBJECT_HEIGHT);
            var table = dungeon.floor.getTable(layer);
            map.image = view.assets["map.png"];
            map.loadData(table);
            wholeScene.addChild(map);
        }

        // ダンジョンの中でユニットはSpriteで描画
        var units = dungeon.units;
        for (var i = 0; i < dungeon.units.length; i++) {
            var unit = dungeon.units[i];
            var x = unit.cell.coord.x * OBJECT_WIDTH;
            var y = unit.cell.coord.y * OBJECT_HEIGHT;
            var sprite = new Sprite(OBJECT_WIDTH, OBJECT_HEIGHT);
            sprite.image = view.assets["unit.png"];
            sprite.frame = unit.view();
            sprite.x = x;
            sprite.y = y;

            wholeScene.addChild(sprite);
            unit.sprite = sprite;
        }

        // プレイヤー1ターンごとのアップデート
        var animating = false;
        var update = function () {
            animating = true;
            for (var i = 0; i < dungeon.units.length; i++) {
                var unit = dungeon.units[i];
                var x = unit.cell.coord.x * OBJECT_WIDTH;
                var y = unit.cell.coord.y * OBJECT_HEIGHT;

                unit.sprite.tl.moveTo(x, y, 10);
            }
            var coord = dungeon.player.cell.coord;
            wholeScene.tl.moveTo(640 / 2 - coord.x * 64, 480 / 2 - coord.y * 64, 10).then(function () {
                animating = false;
            });
        };

        var message = new MessageWindow(0, 0);
        message.setText("いぐー", "aaa");

        update();
        view.keybind('Z'.charCodeAt(0), "a");

        view.addEventListener(enchant.Event.UP_BUTTON_DOWN, function (e) {
            if (!animating && dungeon.player.handleEvent(0)) {
                update();
            }
        });
        view.addEventListener(enchant.Event.DOWN_BUTTON_DOWN, function (e) {
            if (!animating && dungeon.player.handleEvent(4)) {
                update();
            }
        });
        view.addEventListener(enchant.Event.RIGHT_BUTTON_DOWN, function (e) {
            if (!animating && dungeon.player.handleEvent(2)) {
                update();
            }
        });
        view.addEventListener(enchant.Event.LEFT_BUTTON_DOWN, function (e) {
            if (!animating && dungeon.player.handleEvent(6)) {
                update();
            }
        });

        view.addEventListener(enchant.Event.A_BUTTON_DOWN, function (e) {
            if (!animating && dungeon.player.handleEvent(100)) {
                update();
            }
        });

        view.rootScene.addChild(wholeScene);
        view.rootScene.addChild(message);

    };

    view.start();
};
