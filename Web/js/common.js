// マップID
var MAP_NULL = -1;
var MAP_WALL = 3;
var MAP_PATH = 4;
var MAP_ROOM = 5;

// 4:Effect レイヤ  
// 3:Flying レイヤ Flying Player
// 2:Unit レイヤ  Player Mob
// 1:Ground レイヤ  ITEM ENTRANCE
// 0:Floor レイヤ   PATH ROOM ITEM ENTERANCE 
var MAX_LAYER = 4
var LAYER_FLOOR = 0;
var LAYER_GROUND = 1;
var LAYER_UNIT = 2;
var LAYER_EFFECT = 3;

// WALLの高さ
var WALL_HEIGHT = 3;

// ダンジョンの論理サイズ
var WIDTH =25;
var HEIGHT = 25;

// ブロックの物理サイズ（ピクセル)
var OBJECT_WIDTH = 64;
var OBJECT_HEIGHT = 64;

//ROT.RNG.setSeed(2);