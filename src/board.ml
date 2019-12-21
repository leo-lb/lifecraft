open Global

let rec prune_top board =
  match board with
  | [] -> []
  | hd :: tl -> 
    if List.exists (fun e -> e == Alive) hd then
      board
    else
      prune_top tl

let prune_bottom board =
  List.rev (prune_top (List.rev board))

let rec prune_left board =
  let column = List.map List.hd board in
  if List.length board = 0 then
    []
  else if List.exists (fun e -> e == Alive) column then
    board
  else
    prune_left (List.map List.tl board)

let prune_right board =
  List.map List.rev (prune_left (List.map List.rev board))

let prune board =
  prune_left (prune_right (prune_bottom (prune_top board)))

let resize board =
  (*
  if board == [] then
    [[Dead]]
  else
    let board2 = List.map (fun row -> Dead :: (List.append row [Dead])) board in
    let length = List.length (List.hd board2) in
    let column = List.init length (fun _ -> Dead)  in
    column :: (List.append board2 [column])
  board
  *)
  board

let clamp board =
  (*
  resize (prune board)
  *)
  board

let next board =
  let is_alive coords =
    let (i,j) = coords in
    if i < 0 || i >= Array.length board
    || j < 0 || j >= Array.length board.(0)
    then
      0
    else
      let row = Array.get board i in
      let cell = Array.get row j in
      match cell with | Dead -> 0 | Alive -> 1
  in 
  let sum_neighbourg x y =
    let offsets = [(-1,-1); (-1, 0); (-1, 1); (0, -1); (*(0, 0);*) (0, 1); (1, -1); (1, 0); (1, 1)] in
    let coords  = List.map (fun coords -> (x + (fst coords), y + (snd coords))) offsets in
    let neighbourg = List.map is_alive coords in
    List.fold_left (+) 0 neighbourg
  in
  let next_one i j e =
    let n = sum_neighbourg i j in
    match (e, n) with
    | Alive, 2 -> Alive
    | Alive, 3 -> Alive
    | Dead, 3  -> Alive
    | _ -> Dead
  in
  matrix_mapij next_one board

let flip_if_equal i j i2 j2 e =
  if i == i2 && j == j2 then
    match e with | Alive -> Dead | Dead -> Alive
  else
    e

let flip board i j =
  matrix_mapij (flip_if_equal i j) board

let update state = function
  | Next               ->
    state.board |> next |> clamp
  | KeyPressed k       ->
    begin
      match k.key_code with
      | 13 (* Enter *) | 32 (* Space *) -> state.board |. next |. clamp
      | _ -> state.board
    end
  | Previous           ->
    (match state.previous with | [] -> Array.make_matrix 0 0 Dead | hd::_ -> hd)
  | Reset              ->
    Array.make_matrix state.size.x state.size.y Dead
  | Click(i,j)         ->
    state.board |. flip i j |. clamp
  | ClickThenNext(i,j) ->
    state.board |. flip i j |. next |. clamp
  | Select(_,_)        ->
    state.board
  | SetBoard(board)    ->
    clamp board
  | SetBoardFromSeed(str) ->
      let my_array: cell array array = [%raw {| JSON.parse(param[0]) |}] in
    clamp my_array
  | SetX(x) ->
    state.board
  | SetY(y) ->
    state.board
  | _            ->
    state.board
