// Generated by BUCKLESCRIPT, PLEASE EDIT WITH CARE

import * as List from "../node_modules/bs-platform/lib/es6/list.js";
import * as Matrix from "./Matrix.bs.js";
import * as Caml_array from "../node_modules/bs-platform/lib/es6/caml_array.js";

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

function prune_bottom(board) {
  return List.rev(prune_top(List.rev(board)));
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
  return board;
}

function clamp(board) {
  return board;
}

function next(board) {
  var is_alive = function (coords) {
    var j = coords[1];
    var i = coords[0];
    if (i < 0 || i >= board.length || j < 0 || j >= Caml_array.caml_array_get(board, 0).length) {
      return 0;
    } else {
      var row = Caml_array.caml_array_get(board, i);
      var cell = Caml_array.caml_array_get(row, j);
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
  return Matrix.mapij(next_one, board);
}

function flip_if_equal(i, j, i2, j2, e) {
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

function flip(board, i, j) {
  return Matrix.mapij((function (param, param$1, param$2) {
                return flip_if_equal(i, j, param, param$1, param$2);
              }), board);
}

function update(state, param) {
  if (typeof param === "number") {
    switch (param) {
      case /* Nothing */0 :
          return state.board;
      case /* Next */1 :
          return next(state.board);
      case /* Previous */2 :
          var match = state.previous;
          if (match) {
            return match[0];
          } else {
            return Matrix.make(0, 0, /* Dead */0);
          }
      case /* Reset */3 :
          return Matrix.make(state.size.x, state.size.y, /* Dead */0);
      
    }
  } else {
    switch (param.tag | 0) {
      case /* Click */0 :
          return flip(state.board, param[0], param[1]);
      case /* ClickThenNext */1 :
          return next(flip(state.board, param[0], param[1]));
      case /* SetBoard */3 :
          return param[0];
      case /* SetBoardFromSeed */4 :
          return ( JSON.parse(param[0]) );
      case /* AddSeed */5 :
          return state.board;
      case /* KeyPressed */8 :
          var match$1 = param[0].key_code;
          if (match$1 !== 13 && match$1 !== 32) {
            return state.board;
          } else {
            return next(state.board);
          }
      default:
        return state.board;
    }
  }
}

export {
  prune_top ,
  prune_bottom ,
  prune_left ,
  prune_right ,
  prune ,
  resize ,
  clamp ,
  next ,
  flip_if_equal ,
  flip ,
  update ,
  
}
/* No side effect */
