type cell = Dead | Alive
type board = cell array array

type rule = B3S23 | B36S23 [@@bs.deriving {accessors}]

type geo  = Infinite | Bounded (*| Torus |...*)

type backend = Html | Svg | Canvas

type state = {
  board: board;
  rule: rule;
  geo: geo;
  backend: backend;
  previous: cell array array list;
  auto_clamp: bool;
}

type event =
  | Nothing
  | Reset
  | Flip of int * int
  | Next
  | Previous
  | SetBoard of cell array array
  | SetBoardFromSeed of string
  | AddSeed of string * string
  | Resize of int * int
  | SetX of int
  | SetY of int
  | SetRule of rule
  | SetBackend of backend
  | KeyPressed of Keyboard.key_event
  | ToggleAutoClamp
  | Clamp
  | Fetch of string
  | LifeData of (string, string Tea.Http.error) Tea.Result.t
[@@bs.deriving {accessors}]


let rule_list = [("B3S23", B3S23, 0); ("B36S23", B36S23, 1)]
let backend_list = [("Html", Html, 0); ("Svg", Svg, 1); ("Canvas", Canvas, 2)]
let seed_list = [("Test", "test.rle"); ("Elephant", "elephant.rle"); ("UFO","ufo.rle"); ("Bob", "bob.rle")]
