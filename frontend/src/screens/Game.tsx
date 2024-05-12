/* eslint-disable @typescript-eslint/no-unused-vars */
import { useEffect, useState } from "react";
import { Button } from "../components/Button";
import { ChessBoard } from "../components/ChessBoard";
import { useSocket } from "../hooks/useSocket";
import { Chess } from "chess.js";

export const INIT_GAME = "init_game";
export const MOVE = "move";
export const GAME_OVER = "game_over";

export const Game = () => {
  const socket = useSocket();
  const [chess] = useState(new Chess());
  const [board, setBoard] = useState(chess.board());
  const [started, setStarted] = useState(false);
  const [color, setColor] = useState<string | null>(null);

  useEffect(() => {
    if (!socket) {
      return;
    }
    socket.onmessage = (event) => {
      const message = JSON.parse(event.data);
      switch (message.type) {
        case INIT_GAME:
          setBoard(chess.board());
          setStarted(true);
          setColor(message.payload.color);
          alert(`Game started, you are ${message.payload.color}`);
          break;
        case MOVE:
          // eslint-disable-next-line no-case-declarations
          const move = message.payload;
          chess.move(move);
          setBoard(chess.board());
          console.log("Move made");
          break;
        case GAME_OVER:
          alert("Game over!");
          break;
      }
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [socket]);
  if (!socket) return <div className="text-white flex justify-center text-3xl bg-green-600 p-3">Connecting...</div>;
  return (
    <div className="justify-center flex">
      <div className="pt-8 max-w-screen-lg w-full">
        <div className="grid grid-cols-6 gap-4 w-full flex-col">
          <div className="md:col-span-4 col-span-6 w-full flex justify-center">
            <ChessBoard
              chess={chess}
              setBoard={setBoard}
              socket={socket}
              board={board}
            />
          </div>
          <div className="md:col-span-2 col-span-6 bg-gray-700 rounded-md w-full flex justify-center p-8">
            <div>
              {!started && (
                <Button
                  className="mb-4"
                  onClick={() => {
                    socket.send(
                      JSON.stringify({
                        type: INIT_GAME,
                      })
                    );
                  }}
                >
                  Play
                </Button>
              )}
              <div className="text-white text-lg">
                <ul className="list-disc flex flex-col space-y-4">
                  {color && (
                    <h3 className="text-2xl p-2 bg-green-600 rounded-md text-center">
                      You are {color}
                    </h3>
                  )}
                  <li>
                    Click the 'Play' button and wait for an opponent to join
                    you, or join an existing waiting player.
                  </li>
                  <li>Do not click the button more than once.</li>
                  <li>
                    Select a chess piece, then click where you'd like to move it
                    on the board.
                  </li>
                  <li>Do not touch your opponent's chess pieces.</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
