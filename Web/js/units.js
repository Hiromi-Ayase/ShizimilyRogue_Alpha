var EnemyStatus = function () {
    this.lv = 1;
};

var Ignore = function () {
    this.lastDir = null;
    this.cell = null;
    this.dir = ROT.DIRS[8][0];

    this.act = function () {
        var playerCoord = dungeon.player.cell.coord;
        var thisCoord = this.cell.coord;
        var t = this;
        var pathFinder = new ROT.Path.Dijkstra(playerCoord.x, playerCoord.y, function (x, y, dir) {
            var coord = dungeon.floor.getCell(x, y, thisCoord.layer).coord;
            var ret = dungeon.floor.isMovable(t, coord, dir);
            return ret;
        });

        var dir = null;
        pathFinder.compute(thisCoord.x, thisCoord.y, function (x, y) {
            if (dir == null && (x != thisCoord.x || y != thisCoord.y))
                dir = [x - thisCoord.x, y - thisCoord.y];
        });
       
        this.dir = dir;
        if (dungeon.floor.moveObject(this, dir) == false) {
            return;
        }
    };
    this.view = function () { return 2; }
};



var Player = function () {
    this.view = function () { return 1; };
    this.dir = ROT.DIRS[8][0];
    this.act = function () {
        dungeon.engine.lock();
    };

    this.handleEvent = function (code) {
        if (code == 100) {
        } else {
            var dir = ROT.DIRS[8][code];
            this.dir = dir;
            if (dungeon.floor.moveObject(this, dir) == false) {
                return false;
            }
        }
        dungeon.engine.unlock();
        return true;
    };
}


