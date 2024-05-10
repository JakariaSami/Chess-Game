/* eslint-disable @typescript-eslint/no-explicit-any */
import { Color, PieceSymbol, Square } from "chess.js";
import { useState } from "react";
import { MOVE } from "../screens/Game";

export const ChessBoard = ({
  chess,
  board,
  socket,
  setBoard,
}: {
  chess: any;
  setBoard: any;
  board: ({
    square: Square;
    type: PieceSymbol;
    color: Color;
  } | null)[][];
  socket: WebSocket;
}) => {
  const [from, setFrom] = useState<null | Square>(null);

  return (
    <div className="text-white-200">
      {board.map((row, i) => {
        return (
          <div key={i} className="flex">
            {row.map((square, j) => {
              const squareRepresentation = (String.fromCharCode(97 + (j % 8)) +
                "" +
                (8 - i)) as Square;
              return (
                <div
                  onClick={() => {
                    if (!from) {
                      setFrom(squareRepresentation);
                    } else {
                      socket.send(
                        JSON.stringify({
                          type: MOVE,
                          payload: {
                            move: {
                              from,
                              to: squareRepresentation,
                            },
                          },
                        })
                      );
                      setFrom(null);
                      chess.move({
                        from,
                        to: squareRepresentation,
                      });
                      setBoard(chess.board());
                    }
                  }}
                  key={j}
                  className={`w-10 h-10 md:w-16 md:h-16 sm:w-12 sm:h-12 ${
                    (i + j) % 2 === 0 ? "bg-[#779556]" : "bg-[#ebecd0]"
                  }`}
                >
                  <div className="w-full h-full justify-center flex">
                    <div className="h-full justify-center flex flex-col">
                      {square ? (
                        <img
                          className="w-15"
                          src={`/${
                            square?.color === "b"
                              ? square?.type
                              : `${square?.type?.toUpperCase()} copy`
                          }.png`}
                        />
                      ) : null}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        );
      })}
    </div>
  );
};
