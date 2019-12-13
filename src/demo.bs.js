// Generated by BUCKLESCRIPT, PLEASE EDIT WITH CARE

import * as Draw from "./draw.bs.js";
import * as List from "../node_modules/bs-platform/lib/es6/list.js";
import * as $$Array from "../node_modules/bs-platform/lib/es6/array.js";
import * as Block from "../node_modules/bs-platform/lib/es6/block.js";
import * as Global from "./global.bs.js";
import * as Caml_array from "../node_modules/bs-platform/lib/es6/caml_array.js";
import * as Caml_int32 from "../node_modules/bs-platform/lib/es6/caml_int32.js";

var pointer = {
  contents: {
    x: 0,
    y: 0,
    i: 0,
    j: 0,
    inside: false,
    selecting: false
  }
};

var state_board = {
  contents: $$Array.make_matrix(Global.num_dot_x, Global.num_dot_y, /* Dead */0)
};

var state_previous = {
  contents: /* [] */0
};

function next(board) {
  var is_alive = function (coords) {
    var j = coords[1];
    var i = coords[0];
    if (i < 0 || i >= Global.num_dot_x || j < 0 || j >= Global.num_dot_y) {
      return 0;
    } else {
      var match = Caml_array.caml_array_get(Caml_array.caml_array_get(board, i), j);
      if (match) {
        return 1;
      } else {
        return 0;
      }
    }
  };
  var sum_neighbourg = function (x, y) {
    var coords = List.map((function (coords) {
            return /* tuple */[
                    x + coords[0] | 0,
                    y + coords[1] | 0
                  ];
          }), /* :: */[
          /* tuple */[
            -1,
            -1
          ],
          /* :: */[
            /* tuple */[
              -1,
              0
            ],
            /* :: */[
              /* tuple */[
                -1,
                1
              ],
              /* :: */[
                /* tuple */[
                  0,
                  -1
                ],
                /* :: */[
                  /* tuple */[
                    0,
                    1
                  ],
                  /* :: */[
                    /* tuple */[
                      1,
                      -1
                    ],
                    /* :: */[
                      /* tuple */[
                        1,
                        0
                      ],
                      /* :: */[
                        /* tuple */[
                          1,
                          1
                        ],
                        /* [] */0
                      ]
                    ]
                  ]
                ]
              ]
            ]
          ]
        ]);
    var neighbourg = List.map(is_alive, coords);
    return List.fold_left((function (prim, prim$1) {
                  return prim + prim$1 | 0;
                }), 0, neighbourg);
  };
  var next_one = function (i, j, e) {
    var n = sum_neighbourg(i, j);
    if (e) {
      if (n === 3 || n === 2) {
        return /* Alive */1;
      } else {
        return /* Dead */0;
      }
    } else if (n !== 3) {
      return /* Dead */0;
    } else {
      return /* Alive */1;
    }
  };
  return Global.matrix_mapij(next_one, board);
}

function update_pointer(pointer) {
  var x = pointer.x - Caml_int32.mod_(pointer.x, Global.dot_w) | 0;
  var y = pointer.y - Caml_int32.mod_(pointer.y, Global.dot_h) | 0;
  var i = pointer.x;
  var j = pointer.y;
  var dist2 = Math.pow(x - (i + 0.5) * Global.dot_w, 2) + Math.pow(y - (j + 0.5) * Global.dot_h, 2);
  var inside = dist2 < Math.pow(Global.r, 2);
  return {
          x: pointer.x,
          y: pointer.y,
          i: Caml_int32.div(pointer.x, Global.dot_w),
          j: Caml_int32.div(pointer.y, Global.dot_h),
          inside: inside,
          selecting: pointer.selecting
        };
}

function update($$event) {
  var board;
  if (typeof $$event === "number") {
    switch ($$event) {
      case /* Next */0 :
          board = next(state_board.contents);
          break;
      case /* Previous */1 :
          board = List.hd(state_previous.contents);
          break;
      case /* Reset */2 :
          board = $$Array.make_matrix(Global.num_dot_x, Global.num_dot_y, /* Dead */0);
          break;
      
    }
  } else if ($$event.tag) {
    board = state_board.contents;
  } else {
    var j = $$event[1];
    var i = $$event[0];
    board = Global.matrix_mapij((function (param, param$1, param$2) {
            var i$1 = i;
            var j$1 = j;
            var i2 = param;
            var j2 = param$1;
            var e = param$2;
            if (i$1 === i2 && j$1 === j2) {
              if (e) {
                return /* Dead */0;
              } else {
                return /* Alive */1;
              }
            } else {
              return e;
            }
          }), state_board.contents);
  }
  state_previous.contents = List.append(/* :: */[
        state_board.contents,
        /* [] */0
      ], state_previous.contents);
  state_board.contents = board;
  pointer.contents = update_pointer(pointer.contents);
  Draw.draw(state_board.contents);
  return Draw.draw_selection(pointer.contents.x, pointer.contents.y);
}

function mousedown(x, y) {
  var init = pointer.contents;
  pointer.contents = {
    x: init.x,
    y: init.y,
    i: init.i,
    j: init.j,
    inside: init.inside,
    selecting: true
  };
  return update(/* Click */Block.__(0, [
                Caml_int32.div(x, Global.dot_w),
                Caml_int32.div(y, Global.dot_h)
              ]));
}

function mouseup(param) {
  var init = pointer.contents;
  pointer.contents = {
    x: init.x,
    y: init.y,
    i: init.i,
    j: init.j,
    inside: init.inside,
    selecting: false
  };
  return /* () */0;
}

function mousemove(x, y) {
  var init = pointer.contents;
  pointer.contents = {
    x: x,
    y: y,
    i: init.i,
    j: init.j,
    inside: init.inside,
    selecting: init.selecting
  };
  return update(/* Select */Block.__(1, [
                Caml_int32.div(x, Global.dot_w),
                Caml_int32.div(y, Global.dot_h)
              ]));
}

function keydown(str) {
  switch (str) {
    case " " :
        return update(/* Next */0);
    case "Escape" :
        return update(/* Reset */2);
    default:
      console.log(str);
      return /* () */0;
  }
}

function reset(param) {
  return update(/* Reset */2);
}

function previous(param) {
  return update(/* Previous */1);
}

function next$1(param) {
  return update(/* Next */0);
}

bind_mousemove(mousemove);

bind_mousedown(mousedown);

bind_mouseup(mouseup);

bind_keydown(keydown);

bind_next(next$1);

bind_previous(previous);

bind_reset(reset);

export {
  
}
/* state Not a pure module */
