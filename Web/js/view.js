var getMap = function (table) {
    var blockTable = [
         0, 17, 4, 4, 16, 36, 4, 4, // 0 - 7
         7, 26, 9, 9, 7, 26, 9, 9, // 8 - 15
         18, 32, 21, 21, 39, 40, 21, 21, // 16 - 23
         7, 26, 9, 9, 7, 26, 9, 9, // 24 - 31
         5, 22, 1, 1, 23, 45, 1, 1, // 32 - 39
         11, 30, 15, 15, 11, 30, 15, 15,// 40 - 47
         5, 22, 1, 1, 23, 45, 1, 1, // 48 - 55
         11, 30, 15, 15, 11, 30, 15, 15,// 56 - 63
         19, 38, 20, 20, 33, 41, 20, 20, // 64 - 71
         24, 46, 28, 28, 24, 46, 28, 28, // 72 - 79
         37, 43, 44, 44, 42, 34, 44, 44, // 80 - 87
         24, 46, 28, 28, 24, 46, 28, 28, // 88 - 95
         5, 22, 1, 1, 23, 45, 1, 1, // 96 - 103
         11, 30, 15, 15, 11, 30, 15, 15, // 104 - 111
         5, 22, 1, 1, 23, 45, 1, 1, // 112 - 119
         11, 30, 15, 15, 11, 30, 15, 15, // 120 - 127
         6, 6, 29, 29, 27, 27, 8, 8,// 128 - 135
         2, 2, 12, 12, 2, 2, 12, 12,// 136 - 143
         25, 25, 29, 29, 47, 47, 29, 29,// 144 - 151
         2, 2, 12, 12, 2, 2, 12, 12, // 152 - 159
         10, 10, 14, 14, 31, 31, 14, 14,// 160 - 167
         13, 13, 3, 3, 13, 13, 3, 3, // 168 - 175
         10, 10, 14, 14, 31, 31, 14, 14,// 176 - 183
         25, 25, 29, 29, 47, 47, 29, 29,// 184 - 191
         6, 6, 29, 29, 27, 27, 8, 8,//192 - 199
         2, 2, 12, 12, 2, 2, 12, 12,//200 - 207
         25, 25, 29, 29, 47, 47, 29, 29,//208 - 215
         2, 2, 12, 12, 2, 2, 12, 12,// 216 - 223
         10, 10, 14, 14, 31, 31, 14, 14,// 224 - 231
         13, 13, 3, 3, 13, 13, 3, 3, // 232 - 239
         10, 10, 14, 14, 31, 31, 14, 14,// 240 - 247
         13, 13, 3, 3, 13, 13, 3, 3, // 248 - 255
    ];
    var map = [];

    var w = table[0].length;
    var h = table.length;

    for (var y = 0; y < h; y++) {
        var line = table[y];
        map.push(new Array(w));
        for (var x = 0; x < w; x++) {
            var id = line[x];
            if (id == MAP_WALL) {
                var blockId = 0;
                blockId |= (x == 0 || y == 0 || table[y - 1][x - 1] != MAP_WALL) ? 1 : 0;
                blockId |= (y == 0 || table[y - 1][x] != MAP_WALL) ? 2 : 0;
                blockId |= (x == w - 1 || y == 0 || table[y - 1][x + 1] != MAP_WALL) ? 4 : 0;
                blockId |= (x == w - 1 || table[y][x + 1] != MAP_WALL) ? 8 : 0;
                blockId |= (x == w - 1 || y == h - 1 || table[y + 1][x + 1] != MAP_WALL) ? 16 : 0;
                blockId |= (y == h - 1 || table[y + 1][x] != MAP_WALL) ? 32 : 0;
                blockId |= (x == 0 || y == h - 1 || table[y + 1][x - 1] != MAP_WALL) ? 64 : 0;
                blockId |= (x == 0 || table[y][x - 1] != MAP_WALL) ? 128 : 0;

                var mapId = blockTable[blockId];
                map[y][x] = mapId;
            } else {
                map[y][x] = 35;
            }
        }
    }

    return map;
};
// いぐのあほー
var wallImg = "wall_01.png";
window.onload = function () {
    enchant();
    var view = new Game(640, 480);
    view.preload("map.png", "unit.png", "windowmessage.png", wallImg);
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
        for (var layer = 1; layer < 2; layer++) {
            var map = new Map(OBJECT_WIDTH, OBJECT_HEIGHT);
            var rawTable = dungeon.floor.getTable(layer);
            var table = getMap(rawTable);
            map.image = view.assets[wallImg];
            map.loadData(table);
            wholeScene.addChild(map);
        }

        // ダンジョンの中でユニットはSpriteで描画
        var units = dungeon.units;
        for (var i = 0; i < dungeon.units.length; i++) {
            var unitGroup = new enchant.Group();

            var unit = dungeon.units[i];
            var x = unit.cell.coord.x * OBJECT_WIDTH;
            var y = unit.cell.coord.y * OBJECT_HEIGHT;
            var unitSprite = new Sprite(OBJECT_WIDTH, OBJECT_HEIGHT);
            unitSprite.image = view.assets["unit.png"];
            unitSprite.frame = unit.view();
            unitGroup.addChild(unitSprite);
            
            var unitInfo = new enchant.Label();
            unitInfo.text = "[" + unit.dir[0] + ", " + unit.dir[1] + "]";
            unitGroup.addChild(unitInfo);

            unitGroup.x = x;
            unitGroup.y = y;

            wholeScene.addChild(unitGroup);
            unit.sprite = unitGroup;
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
                unit.sprite.lastChild.text = "[" + unit.dir[0] + ", " + unit.dir[1] + "]";
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
