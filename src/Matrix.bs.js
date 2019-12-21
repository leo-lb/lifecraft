// Generated by BUCKLESCRIPT, PLEASE EDIT WITH CARE

import * as $$Array from "../node_modules/bs-platform/lib/es6/array.js";
import * as Curry from "../node_modules/bs-platform/lib/es6/curry.js";
import * as Caml_array from "../node_modules/bs-platform/lib/es6/caml_array.js";

function make(i, j, e) {
  return Caml_array.caml_make_vect(i, Caml_array.caml_make_vect(j, e));
}

function mapij(f, a) {
  return $$Array.mapi((function (i, row) {
                return $$Array.mapi((function (j, e) {
                              return Curry._3(f, i, j, e);
                            }), row);
              }), a);
}

function iterij(f, a) {
  return $$Array.iteri((function (i, row) {
                return $$Array.iteri((function (j, e) {
                              return Curry._3(f, i, j, e);
                            }), row);
              }), a);
}

export {
  make ,
  mapij ,
  iterij ,
  
}
/* No side effect */
