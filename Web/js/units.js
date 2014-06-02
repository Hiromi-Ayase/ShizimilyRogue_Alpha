var Ignore = function () {
    this.lastDir = null;
    this.act = function () {
        // ランダムに動く方向を決定
        var dir = dungeon.floor.movable(this);
        for (var i = 0; i < dir.length; i++) {
            if (dir[i] == this.lastDir) {
                dir.push(dir[i]);
                dir.push(dir[i]);
                dir.push(dir[i]);
                dir.push(dir[i]);
                dir.push(dir[i]);
                break;
            }
        }
        if (dir.length == 0) {
            return;
        }
        var index = Math.floor(ROT.RNG.getUniform() * dir.length);
        this.lastDir = dir[index];
        if (dungeon.floor.moveObject(this, dir[index]) == false) {
            return;
        }
    };
    this.view = function () { return 2; }
};



var Player = function () {
    this.view = function () { return 1; };

    this.act = function () {
        dungeon.engine.lock();
    };

    this.handleEvent = function (code) {
        if (code == 100) {
        } else {
            var dir = ROT.DIRS[8][code];

            if (dungeon.floor.moveObject(this, dir) == false) {
                return false;
            }
        }
        dungeon.engine.unlock();
        return true;
    };
}


