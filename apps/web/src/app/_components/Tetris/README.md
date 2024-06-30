<Tetris 
  resolution={} 
  theme={} 
  onEnd={} 
  onPause={} 
/>


Tetris
  - state
    - game state = Start | Play | Pause | End
    - score = f(eliminatedHeap, currentHeap, time)
    - activePiece{ type, rotation, position, color }
    - board [][](1 | 2 | 3 | 4 | 5) coloured pixels
    - tick
    - speed
  - setNextPiece
    - update activePiece - orientation and type
  - rotatePiece
    - shift piece if it's out of view
  - movePiece
  - checkHeapCollision
    - addToHeap
  - checkGameEnd
    - changeGameState
  - checkHeapCollapse
    - removeRowsFromHeap
  - nextTick
    movePiece(down)

  <Canvas>
    <Piece />
    <Board />
  </Canvas>

Canvas
  - drawPixel
  - drawShape
  - clear

ActivePiece
  - draw

Board
  - draw