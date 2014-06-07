

var game = function () {
    var dungeon = new Dungeon();
    dungeon.addUnit(new Ignore());
    dungeon.engine.start();

    var view = new View() {}
};

