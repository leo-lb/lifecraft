// Generated by BUCKLESCRIPT, PLEASE EDIT WITH CARE

import * as Draw from "./draw.bs.js";
import * as List from "../node_modules/bs-platform/lib/es6/list.js";
import * as $$Array from "../node_modules/bs-platform/lib/es6/array.js";
import * as Block from "../node_modules/bs-platform/lib/es6/block.js";
import * as Global from "./global.bs.js";
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

var state_size = {
  contents: {
    x: 3,
    y: 3
  }
};

var state_board = {
  contents: Global.lmatrix_create(3, 3, /* Dead */0)
};

var state_previous = {
  contents: /* [] */0
};

var state = {
  size: state_size,
  board: state_board,
  previous: state_previous
};

function prune_top(_board) {
  while(true) {
    var board = _board;
    if (board) {
      if (List.exists((function (e) {
                return e === /* Alive */1;
              }), board[0])) {
        return board;
      } else {
        _board = board[1];
        continue ;
      }
    } else {
      return /* [] */0;
    }
  };
}

function prune_left(_board) {
  while(true) {
    var board = _board;
    var column = List.map(List.hd, board);
    if (List.length(board) === 0) {
      return /* [] */0;
    } else if (List.exists((function (e) {
              return e === /* Alive */1;
            }), column)) {
      return board;
    } else {
      _board = List.map(List.tl, board);
      continue ;
    }
  };
}

function prune_right(board) {
  return List.map(List.rev, prune_left(List.map(List.rev, board)));
}

function prune(board) {
  var board$1 = prune_top(board);
  return prune_left(prune_right(List.rev(prune_top(List.rev(board$1)))));
}

function resize(board) {
  if (board === /* [] */0) {
    return /* :: */[
            /* :: */[
              /* Dead */0,
              /* [] */0
            ],
            /* [] */0
          ];
  } else {
    var board2 = List.map((function (row) {
            return /* :: */[
                    /* Dead */0,
                    List.append(row, /* :: */[
                          /* Dead */0,
                          /* [] */0
                        ])
                  ];
          }), board);
    var length = List.length(List.hd(board2));
    var column = List.init(length, (function (param) {
            return /* Dead */0;
          }));
    return /* :: */[
            column,
            List.append(board2, /* :: */[
                  column,
                  /* [] */0
                ])
          ];
  }
}

function next(board) {
  var is_alive = function (coords) {
    var j = coords[1];
    var i = coords[0];
    if (i < 0 || i >= state_size.contents.x || j < 0 || j >= state_size.contents.y) {
      return 0;
    } else {
      var row = List.nth(board, i);
      var cell = List.nth(row, j);
      if (cell) {
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
  return Global.lmatrix_mapij(next_one, board);
}

function flip(i, j, i2, j2, e) {
  if (i === i2 && j === j2) {
    if (e) {
      return /* Dead */0;
    } else {
      return /* Alive */1;
    }
  } else {
    return e;
  }
}

function update($$event) {
  var board;
  if (typeof $$event === "number") {
    switch ($$event) {
      case /* Nothing */0 :
          board = state_board.contents;
          break;
      case /* Next */1 :
          board = next(state_board.contents);
          break;
      case /* Previous */2 :
          board = List.hd(state_previous.contents);
          break;
      case /* Reset */3 :
          board = Global.lmatrix_create(3, 3, /* Dead */0);
          break;
      
    }
  } else {
    switch ($$event.tag | 0) {
      case /* Click */0 :
          var j = $$event[1];
          var i = $$event[0];
          board = Global.lmatrix_mapij((function (param, param$1, param$2) {
                  return flip(i, j, param, param$1, param$2);
                }), state_board.contents);
          break;
      case /* ClickThenNext */1 :
          var j$1 = $$event[1];
          var i$1 = $$event[0];
          board = next(Global.lmatrix_mapij((function (param, param$1, param$2) {
                      return flip(i$1, j$1, param, param$1, param$2);
                    }), state_board.contents));
          break;
      case /* Select */2 :
          board = state_board.contents;
          break;
      
    }
  }
  var previous;
  var exit = 0;
  if (typeof $$event === "number") {
    switch ($$event) {
      case /* Next */1 :
          previous = /* :: */[
            state_board.contents,
            state_previous.contents
          ];
          break;
      case /* Previous */2 :
          previous = List.tl(state_previous.contents);
          break;
      default:
        previous = state_previous.contents;
    }
  } else {
    switch ($$event.tag | 0) {
      case /* Click */0 :
      case /* ClickThenNext */1 :
          exit = 1;
          break;
      default:
        previous = state_previous.contents;
    }
  }
  if (exit === 1) {
    previous = /* :: */[
      state_board.contents,
      state_previous.contents
    ];
  }
  state_previous.contents = previous;
  var tmp;
  tmp = typeof $$event === "number" ? (
      $$event === /* Next */1 ? resize(prune(board)) : board
    ) : (
      $$event.tag ? board : resize(prune(board))
    );
  state_board.contents = tmp;
  state_size.contents = {
    x: List.length(state_board.contents),
    y: List.length(state_board.contents) === 0 ? 0 : List.length(List.hd(state_board.contents))
  };
  pointer.contents = pointer.contents;
  Draw.draw(state);
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
                Caml_int32.div(x, Caml_int32.div(canvas.width, state_size.contents.x)),
                Caml_int32.div(y, Caml_int32.div(canvas.height, state_size.contents.y))
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
  if (state_size.contents.x !== 0 && state_size.contents.y !== 0) {
    return update(/* Select */Block.__(2, [
                  Caml_int32.div(x, Caml_int32.div(canvas.width, state_size.contents.x)),
                  Caml_int32.div(y, Caml_int32.div(canvas.height, state_size.contents.y))
                ]));
  } else {
    return /* () */0;
  }
}

function keydown(str) {
  var tmp;
  switch (str) {
    case "ArrowLeft" :
        tmp = /* Previous */2;
        break;
    case " " :
    case "ArrowRight" :
        tmp = /* Next */1;
        break;
    case "Escape" :
        tmp = /* Reset */3;
        break;
    default:
      console.log(str);
      tmp = /* Nothing */0;
  }
  return update(tmp);
}

function reset(param) {
  return update(/* Reset */3);
}

function previous(param) {
  return update(/* Previous */2);
}

function next$1(param) {
  return update(/* Next */1);
}

function save(param) {
  console.log($$Array.of_list(List.map($$Array.of_list, state_board.contents)));
  return /* () */0;
}

bind_mousemove(mousemove);

bind_mousedown(mousedown);

bind_mouseup(mouseup);

bind_keydown(keydown);

bind_button(".next", next$1);

bind_button(".previous", previous);

bind_button(".reset", reset);

bind_button(".save", save);

update(/* Click */Block.__(0, [
        1,
        1
      ]));

update(/* Click */Block.__(0, [
        1,
        2
      ]));

update(/* Click */Block.__(0, [
        1,
        3
      ]));

update(/* Click */Block.__(0, [
        1,
        2
      ]));

export {
  
}
/* state Not a pure module */
