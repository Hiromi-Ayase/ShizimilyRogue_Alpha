

var Dungeon = function () {

    var Coord = function (index, x, y, layer) {
        this.index = index;
        this.x = x;
        this.y = y;
        this.layer = layer;
    };

    var Cell = function (coord) {
        this.coord = coord;
        this.object = null;
    };

    var Wall = function () {
        this.view = MAP_WALL;
        this.corner = true;
    };

    var Room = function () {
        this.view = MAP_ROOM;
    };

    var Path = function () {
        this.view = MAP_PATH;
    };


    var Floor = function (w, h) {
        this.width = w;
        this.height = h;
        this.map = [];

        // オブジェクトをset
        this.setObject = function (obj, coord) {
            var cell = this.map[coord.index];
            if (obj.celll == null) {
                cell.object = obj;
                obj.cell = cell;
                if (typeof obj.corner === "undefined")
                    obj.corner = false;
            }
            return false;
        };

        // あるレイヤのインデックスを取得
        this.getIndex = function (x, y, layer) {
            return layer * this.width * this.height + y * this.width + x;
        };

        // あるレイヤの最初のインデックスを取得
        this.getStartIndex = function (layer) {
            return this.getIndex(0, 0, layer);
        };

        // あるレイヤの最後のインデックスを取得
        this.getLastIndex = function (layer) {
            return this.getIndex(this.width - 1, this.height - 1, LAYER_FLOOR)
        };

        this.movable = function (obj) {
            var coord = obj.cell.coord;
            var result = [];
            for (var i = 0; i < ROT.DIRS[8].length; i++) {
                var dir = ROT.DIRS[8][i];
                var newCell = this.map[this.getIndex(coord.x + dir[0], coord.y + dir[1], coord.layer)];

                if (dir[0] == 0 || dir[1] == 0) {
                    if (newCell.object == null)
                        result.push(dir);
                } else {
                    var cornerCell1 = this.map[this.getIndex(coord.x + dir[0], coord.y, coord.layer)];
                    var cornerCell2 = this.map[this.getIndex(coord.x, coord.y + dir[1], coord.layer)];
                    if (newCell.object == null
                        && (cornerCell1.object == null || cornerCell1.object.corner == false)
                        && (cornerCell2.object == null || cornerCell2.object.corner == false)) {
                        result.push(dir);
                    }
                }
            }
            return result;
        };

        // すでに存在するオブジェクトを移動する。成功したらTrue
        this.moveObject = function (obj, dir) {
            var coord = obj.cell.coord;
            var newCell = this.map[this.getIndex(coord.x + dir[0], coord.y + dir[1], coord.layer)];
            if (newCell.object == null) {
                obj.cell.object = null;
                newCell.object = obj;
                obj.cell = newCell;
                return true;
            }
            return false;
        }

        // すでに存在するオブジェクトを削除する。成功したらTrue
        this.deleteObject = function (obj) {
            if (obj.cell != null) {
                cell.obejct.cell = null;
                cell.object = null;
                return true;
            }
            return false;
        }

        // あるレイヤのマップテーブルを取得
        this.getTable = function (layer) {
            var table = new Array(this.height);
            for (var y = 0; y < this.height; y++) {
                table[y] = new Array(this.width);
                for (var x = 0; x < this.width; x++) {
                    var m = this.map[this.getIndex(x, y, layer)];
                    table[y][x] = m.object != null && typeof m.object.view === "number" ? m.object.view : MAP_NULL;
                }
            }
            return table;
        }

        // あるレイヤのランダムな場所をしゅとく
        this.getRandomPoint = function (layer) {
            var currentFreeCells = [];
            for (var i = 0; i < this.map.length; i++) {
                var cell = this.map[i];
                if (cell.coord.layer == layer) {
                    if (cell.object == null) {
                        currentFreeCells.push(cell);
                    }
                }
            }
            var index = Math.floor(ROT.RNG.getUniform() * currentFreeCells.length);
            return currentFreeCells[index];
        };

        // Generate Map
        var t = this;
        var rotMap = new ROT.Map.DividedMaze(w, h);
        var mapCallback = function (x, y, value) {
            for (var layer = 0; layer < MAX_LAYER; layer++) {
                var index = layer * w * h + y * w + x;
                var coord = new Coord(index, x, y, layer);
                t.map[index] = new Cell(coord);
                if (layer == LAYER_FLOOR) {
                    t.setObject(new Path(), coord);
                } else if (layer < WALL_HEIGHT && value) {
                    t.setObject(new Wall(), coord);
                }
            }
        }
        rotMap.create(mapCallback);

        // 通路と部屋を分ける
        if (typeof rotMap.getRooms !== "undefined") {
            for (var i = this.getStartIndex(LAYER_FLOOR) ; i < this.getLastIndex(LAYER_FLOOR) ; i++) {
                var m = this.map[i];
                for (var j = 0; j < rotMap.getRooms().length; j++) {
                    var room = rotMap.getRooms()[j];
                    if (room.getLeft() <= m.coord.x && m.coord.x <= room.getRight() && room.getTop() <= m.coord.y && m.coord.y <= room.getBottom()) {
                        this.setObject(new Room(), m.coord);
                        break;
                    }
                }
            }
        }
    };

    this.scheduler = new ROT.Scheduler.Simple();
    this.engine = new ROT.Engine(this.scheduler);
    this.floor = new Floor(WIDTH, HEIGHT);
    this.player = new Player();
    this.units = [];
    
    // ランダムな場所にオブジェクトをセット
    this.addUnit = function (obj) {
        var cell = this.floor.getRandomPoint(LAYER_UNIT);
        this.floor.setObject(obj, cell.coord);
        this.scheduler.add(obj, true);
        this.units.push(obj);
    };

    this.addUnit(this.player);

};


var dungeon = new Dungeon();
dungeon.addUnit(new Ignore());
dungeon.engine.start();
