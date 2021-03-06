// Generated by BUCKLESCRIPT, PLEASE EDIT WITH CARE

import * as Rle from "./rle.bs.js";
import * as View from "./view.bs.js";
import * as Block from "../node_modules/bs-platform/lib/es6/block.js";
import * as Board from "./board.bs.js";
import * as Global from "./global.bs.js";
import * as Matrix from "./matrix.bs.js";
import * as Tea_app from "../node_modules/bucklescript-tea/src-ocaml/tea_app.js";
import * as Tea_cmd from "../node_modules/bucklescript-tea/src-ocaml/tea_cmd.js";
import * as Keyboard from "./keyboard.bs.js";
import * as Tea_http from "../node_modules/bucklescript-tea/src-ocaml/tea_http.js";

function init(param) {
  return /* tuple */[
          {
            board: /* array */[/* array */[/* Dead */0]],
            rule: /* B3S23 */0,
            geo: /* Infinite */0,
            backend: /* Html */0,
            previous: /* [] */0,
            auto_clamp: true
          },
          Tea_cmd.msg(/* Reset */1)
        ];
}

function subscriptions(param) {
  return Keyboard.downs(undefined, (function (k) {
                return /* KeyPressed */Block.__(9, [k]);
              }));
}

function update(state, $$event) {
  var state$1;
  var exit = 0;
  if (typeof $$event === "number") {
    switch ($$event) {
      case /* Previous */3 :
          var match = state.previous;
          var match$1 = match ? /* tuple */[
              match[0],
              match[1]
            ] : /* tuple */[
              Matrix.make(0, 0, /* Dead */0),
              /* [] */0
            ];
          state$1 = {
            board: match$1[0],
            rule: state.rule,
            geo: state.geo,
            backend: state.backend,
            previous: match$1[1],
            auto_clamp: state.auto_clamp
          };
          break;
      case /* ToggleAutoClamp */4 :
          state$1 = {
            board: state.board,
            rule: state.rule,
            geo: state.geo,
            backend: state.backend,
            previous: state.previous,
            auto_clamp: !state.auto_clamp
          };
          break;
      case /* Reset */1 :
      case /* Next */2 :
      case /* Clamp */5 :
          exit = 1;
          break;
      default:
        state$1 = state;
    }
  } else {
    switch ($$event.tag | 0) {
      case /* Flip */0 :
      case /* Resize */4 :
          exit = 1;
          break;
      case /* SetRule */7 :
          state$1 = {
            board: state.board,
            rule: $$event[0],
            geo: state.geo,
            backend: state.backend,
            previous: state.previous,
            auto_clamp: state.auto_clamp
          };
          break;
      case /* SetBackend */8 :
          state$1 = {
            board: state.board,
            rule: state.rule,
            geo: state.geo,
            backend: $$event[0],
            previous: state.previous,
            auto_clamp: state.auto_clamp
          };
          break;
      case /* LifeData */11 :
          var match$2 = $$event[0];
          state$1 = match$2.tag ? ({
                board: Matrix.make(0, 0, /* Dead */0),
                rule: state.rule,
                geo: state.geo,
                backend: state.backend,
                previous: state.previous,
                auto_clamp: state.auto_clamp
              }) : ({
                board: Rle.parse(match$2[0]),
                rule: state.rule,
                geo: state.geo,
                backend: state.backend,
                previous: state.previous,
                auto_clamp: state.auto_clamp
              });
          break;
      default:
        state$1 = state;
    }
  }
  if (exit === 1) {
    state$1 = {
      board: Board.update(state, $$event),
      rule: state.rule,
      geo: state.geo,
      backend: state.backend,
      previous: /* :: */[
        state.board,
        state.previous
      ],
      auto_clamp: state.auto_clamp
    };
  }
  var cmd;
  var exit$1 = 0;
  if (typeof $$event === "number") {
    if ($$event === /* Next */2) {
      exit$1 = 1;
    } else {
      cmd = /* NoCmd */0;
    }
  } else {
    switch ($$event.tag | 0) {
      case /* Flip */0 :
          exit$1 = 1;
          break;
      case /* KeyPressed */9 :
          var match$3 = $$event[0].key_code;
          cmd = match$3 !== 13 && match$3 !== 32 ? /* NoCmd */0 : Tea_cmd.msg(/* Next */2);
          break;
      case /* Fetch */10 :
          cmd = Tea_http.send(Global.lifeData, Tea_http.getString($$event[0]));
          break;
      case /* LifeData */11 :
          if ($$event[0].tag) {
            cmd = /* NoCmd */0;
          } else {
            exit$1 = 1;
          }
          break;
      default:
        cmd = /* NoCmd */0;
    }
  }
  if (exit$1 === 1) {
    cmd = state$1.geo === /* Infinite */0 ? Tea_cmd.msg(/* Clamp */5) : /* NoCmd */0;
  }
  return /* tuple */[
          state$1,
          cmd
        ];
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
  subscriptions ,
  update ,
  main ,
  
}
/* View Not a pure module */
