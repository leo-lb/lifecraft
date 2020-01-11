// Generated by BUCKLESCRIPT, PLEASE EDIT WITH CARE

import * as Rle from "./rle.bs.js";
import * as View from "./view.bs.js";
import * as Block from "../node_modules/bs-platform/lib/es6/block.js";
import * as Board from "./board.bs.js";
import * as Global from "./global.bs.js";
import * as Tea_app from "../node_modules/bucklescript-tea/src-ocaml/tea_app.js";
import * as Tea_cmd from "../node_modules/bucklescript-tea/src-ocaml/tea_cmd.js";
import * as Keyboard from "./keyboard.bs.js";
import * as Tea_http from "../node_modules/bucklescript-tea/src-ocaml/tea_http.js";

function init(param) {
  return /* tuple */[
          {
            board: /* array */[/* array */[/* Dead */0]],
            previous: /* [] */0,
            seeds: /* :: */[
              {
                name: "Glisseur 1",
                str: "[[0,1,0],[1,0,0],[1,1,1]]"
              },
              /* :: */[
                {
                  name: "Mathusalem 1",
                  str: "[[0,0,1,0],[0,1,0,0],[1,1,1,0]]"
                },
                /* [] */0
              ]
            ],
            rule: /* B3S23 */0,
            auto_clamp: true
          },
          Tea_cmd.msg(/* Reset */5)
        ];
}

function update(state, $$event) {
  var match = Board.update(state, $$event);
  var cmd = match[1];
  var board = match[0];
  var previous;
  var exit = 0;
  if (typeof $$event === "number") {
    switch ($$event) {
      case /* Next */1 :
          exit = 1;
          break;
      case /* Previous */2 :
          var match$1 = state.previous;
          previous = match$1 ? match$1[1] : /* [] */0;
          break;
      default:
        previous = state.previous;
    }
  } else {
    switch ($$event.tag | 0) {
      case /* Click */0 :
      case /* SetBoard */3 :
          exit = 1;
          break;
      default:
        previous = state.previous;
    }
  }
  if (exit === 1) {
    previous = /* :: */[
      state.board,
      state.previous
    ];
  }
  var seeds;
  seeds = typeof $$event === "number" || $$event.tag !== /* AddSeed */5 ? state.seeds : /* :: */[
      {
        name: $$event[0],
        str: $$event[1]
      },
      state.seeds
    ];
  var rule;
  rule = typeof $$event === "number" || $$event.tag !== /* SetRule */8 ? state.rule : $$event[0];
  var auto_clamp = typeof $$event === "number" && $$event === 3 ? !state.auto_clamp : state.auto_clamp;
  var cmd2;
  cmd2 = typeof $$event === "number" || $$event.tag !== /* Fetch */10 ? cmd : Tea_http.send(Global.lifeData, Tea_http.getString($$event[0]));
  var board2;
  if (typeof $$event === "number" || $$event.tag !== /* LifeData */11) {
    board2 = board;
  } else {
    var match$2 = $$event[0];
    board2 = match$2.tag ? board : Rle.parse(match$2[0]);
  }
  return /* tuple */[
          {
            board: board2,
            previous: previous,
            seeds: seeds,
            rule: rule,
            auto_clamp: auto_clamp
          },
          cmd2
        ];
}

function subscriptions(param) {
  return Keyboard.downs(undefined, (function (k) {
                return /* KeyPressed */Block.__(9, [k]);
              }));
}

function partial_arg_shutdown(param) {
  return /* NoCmd */0;
}

var partial_arg = {
  init: init,
  update: update,
  view: View.view,
  subscriptions: subscriptions,
  shutdown: partial_arg_shutdown
};

function main(param, param$1) {
  return Tea_app.program(partial_arg, param, param$1);
}

export {
  init ,
  update ,
  subscriptions ,
  main ,
  
}
/* View Not a pure module */
