"use strict";

class CheckerBoard {
    #BACKGROUND = "tabuleiro.jpg";
    #TILE_WIDTH;
    #TILE_HEIGHT;
    #TILE_COLOR_NORMAL = "#331a00";
    #TILE_COLOR_VALID_MOVE = "#003300";
    #TILE_COLOR_TARGET = "#990000";
    #game_ended = false;

    constructor(canvas_element) {
        this.canvas = canvas_element;
        this.context = this.canvas.getContext("2d");
        this.#TILE_WIDTH = this.canvas.width / 8;
        this.#TILE_HEIGHT = this.canvas.height / 8;
        this.background_image = new Image();
        this.background_image.src = this.#BACKGROUND;
        this.piece_images = {
            white: new Image(),
            black: new Image(),
            white_queen: new Image(),
            black_queen: new Image(),
        };
        this.piece_images.white.src = "peça_branca.png";
        this.piece_images.black.src = "peça_preta.png";
        this.piece_images.white_queen.src = "rainha_branca.png";
        this.piece_images.black_queen.src = "rainha_preta.png";

        this.running = false;
        this.pieces = [];
        this.selected_piece = null;
        this.valid_moves = null;

        document.body.addEventListener("click", this.click.bind(this), false);
        document.body.addEventListener(
            "mousemove",
            this.mouse_move.bind(this),
            false
        );
    }

    run() {
        this.running = true;
        requestAnimationFrame(this.draw.bind(this));
        this.start();
    }

    start() {
        this.#game_ended = false;
        this.turn = "white";
        this.pieces = [];
        this.pieces.push(new Piece(0, 0, "black"));
        this.pieces.push(new Piece(2, 0, "black"));
        this.pieces.push(new Piece(4, 0, "black"));
        this.pieces.push(new Piece(6, 0, "black"));
        this.pieces.push(new Piece(1, 1, "black"));
        this.pieces.push(new Piece(3, 1, "black"));
        this.pieces.push(new Piece(5, 1, "black"));
        this.pieces.push(new Piece(7, 1, "black"));
        this.pieces.push(new Piece(0, 2, "black"));
        this.pieces.push(new Piece(2, 2, "black"));
        this.pieces.push(new Piece(4, 2, "black"));
        this.pieces.push(new Piece(6, 2, "black"));
        this.pieces.push(new Piece(1, 5, "white"));
        this.pieces.push(new Piece(3, 5, "white"));
        this.pieces.push(new Piece(5, 5, "white"));
        this.pieces.push(new Piece(7, 5, "white"));
        this.pieces.push(new Piece(0, 6, "white"));
        this.pieces.push(new Piece(2, 6, "white"));
        this.pieces.push(new Piece(4, 6, "white"));
        this.pieces.push(new Piece(6, 6, "white"));
        this.pieces.push(new Piece(1, 7, "white"));
        this.pieces.push(new Piece(3, 7, "white"));
        this.pieces.push(new Piece(5, 7, "white"));
        this.pieces.push(new Piece(7, 7, "white"));
    }

    win(side) {
        this.#game_ended = true;
        this.turn = side;
    }

    draw(ts) {
        if (!this.running) return;
        requestAnimationFrame(this.draw.bind(this));
        try {
            this.context.drawImage(this.background_image, 0, 0);
            this.draw_tiles(ts);
            this.draw_pieces(ts);
            if (this.#game_ended) {
                this.draw_end_screen();
            }
        } catch (ex) {
            console.error(ex);
            this.running = false;
        }
    }

    draw_tiles(ts) {
        this.context.save();
        this.context.globalAlpha = 0.5;
        for (let x = 0; x < 8; x++) {
            for (let y = 0; y < 8; y++) {
                if (
                    (y % 2 === 0 && x % 2 === 0) ||
                    (y % 2 !== 0 && x % 2 !== 0)
                ) {
                    this.context.fillStyle = this.get_tile_color(x, y);
                    this.context.fillRect(
                        x * this.#TILE_WIDTH,
                        y * this.#TILE_HEIGHT,
                        this.#TILE_WIDTH,
                        this.#TILE_HEIGHT
                    );
                }
            }
        }
        this.context.restore();
    }

    draw_pieces(ts) {
        this.pieces.forEach((piece) => {
            if (piece === this.selected_piece) {
                this.draw_piece(piece, 0.4);
            } else {
                this.draw_piece(piece);
            }
        });
        this.draw_piece(
            this.selected_piece,
            1.0,
            this.mousex - this.#TILE_WIDTH / 2,
            this.mousey - this.#TILE_HEIGHT / 2
        );
    }

    draw_piece(piece, alpha = 1.0, x, y) {
        if (!piece) return;
        x = x ?? piece.x * this.#TILE_WIDTH;
        y = y ?? piece.y * this.#TILE_HEIGHT;
        this.context.save();
        this.context.globalAlpha = alpha;
        if (piece.isQueen) {
            this.context.drawImage(
                this.piece_images[`${piece.side}_queen`],
                x,
                y,
                this.#TILE_WIDTH,
                this.#TILE_HEIGHT
            );
        } else {
            this.context.drawImage(
                this.piece_images[piece.side],
                x,
                y,
                this.#TILE_WIDTH,
                this.#TILE_HEIGHT
            );
        }
        this.context.restore();
    }

    draw_end_screen() {
        this.context.save();
        this.context.font = "bold 50px Georgia";
        this.context.shadowColor = "#4d2600";
        this.context.shadowOffsetX = 1;
        this.context.shadowOffsetY = 1;
        this.context.shadowBlur = 10;
        const win_phrase = `"${
            this.turn === "black" ? "PRETO" : "BRANCO"
        }" venceu!`;
        const click_phrase = "Clique em qualquer lugar para continuar.";
        let measure = this.context.measureText(win_phrase);
        this.context.fillText(win_phrase, (600 - measure.width) / 2, 280);
        this.context.font = "bold 20px Verdana";
        measure = this.context.measureText(click_phrase);
        this.context.fillText(click_phrase, (600 - measure.width) / 2, 340);
        this.context.restore();
    }

    click(e) {
        if (this.#game_ended) {
            this.start();
        }
        const x = Math.floor(e.offsetX / this.#TILE_WIDTH);
        const y = Math.floor(e.offsetY / this.#TILE_HEIGHT);
        const piece = this.get_piece_at(x, y);
        if (this.selected_piece === null) {
            if (piece === null || piece.side !== this.turn) return;
            this.selected_piece = piece;
            this.valid_moves = this.get_valid_moves(this.selected_piece);
            return;
        }
        if (piece === this.selected_piece) {
            this.selected_piece = null;
            this.valid_moves = null;
            return;
        }
        const move = this.get_move(x, y);
        if (move !== null) {
            this.selected_piece.x = x;
            this.selected_piece.y = y;
            if (
                (this.selected_piece.side === "white" &&
                    this.selected_piece.y === 0) ||
                (this.selected_piece.side === "black" &&
                    this.selected_piece.y === 7)
            ) {
                this.selected_piece.isQueen = true;
            }
            this.selected_piece = null;
            this.valid_moves = null;
            if (move.target !== null) {
                this.pieces = this.pieces.filter(
                    (piece) => piece !== move.target
                );
                if (
                    !this.pieces.filter((piece) => piece.side === "black")
                        .length
                ) {
                    this.win("white");
                } else if (
                    !this.pieces.filter((piece) => piece.side === "white")
                        .length
                ) {
                    this.win("black");
                }
            } else {
                this.turn = this.turn === "white" ? "black" : "white";
            }
        }
    }

    mouse_move(e) {
        this.mousex = e.offsetX;
        this.mousey = e.offsetY;
    }

    get_move(x, y) {
        for (let i = 0; i < this.valid_moves.length; i++) {
            const move = this.valid_moves[i];
            if (move.x === x && move.y === y) {
                return move;
            }
        }
        return null;
    }

    get_piece_at(x, y) {
        for (let i = 0; i < this.pieces.length; i++) {
            if (x === this.pieces[i].x && y === this.pieces[i].y) {
                return this.pieces[i];
            }
        }
        return null;
    }

    get_valid_moves(piece) {
        const valid_moves = [];
        const x = piece.x;
        const y = piece.y;
        let dest;
        let target;
        if (x > 0 && y > 0) {
            if (piece.isQueen) {
                let hasTarget = null;
                for (
                    let px = x - 1, py = y - 1;
                    px >= 0 && py >= 0;
                    px--, py--
                ) {
                    target = this.get_piece_at(px, py);
                    if (target === null) {
                        valid_moves.push(new Move(px, py, hasTarget));
                    } else {
                        if (hasTarget || target.side === piece.side) {
                            break;
                        }
                        hasTarget = target;
                    }
                }
            } else {
                dest = this.get_piece_at(x - 1, y - 1);
                if (dest === null) {
                    if (piece.side === "white") {
                        valid_moves.push(new Move(x - 1, y - 1));
                    }
                } else if (
                    dest.side !== piece.side &&
                    x - 2 >= 0 &&
                    y - 2 >= 0
                ) {
                    target = dest;
                    dest = this.get_piece_at(x - 2, y - 2);
                    if (dest === null) {
                        valid_moves.push(new Move(x - 2, y - 2, target));
                    }
                }
            }
        }
        if (x < 7 && y > 0) {
            if (piece.isQueen) {
                let hasTarget = null;
                for (
                    let px = x + 1, py = y - 1;
                    px <= 7 && py >= 0;
                    px++, py--
                ) {
                    target = this.get_piece_at(px, py);
                    if (target === null) {
                        valid_moves.push(new Move(px, py, hasTarget));
                    } else {
                        if (hasTarget || target.side === piece.side) {
                            break;
                        }
                        hasTarget = target;
                    }
                }
            } else {
                dest = this.get_piece_at(x + 1, y - 1);
                if (dest === null) {
                    if (piece.side === "white") {
                        valid_moves.push(new Move(x + 1, y - 1));
                    }
                } else if (
                    dest.side !== piece.side &&
                    x + 2 <= 7 &&
                    y - 2 >= 0
                ) {
                    target = dest;
                    dest = this.get_piece_at(x + 2, y - 2);
                    if (dest === null) {
                        valid_moves.push(new Move(x + 2, y - 2, target));
                    }
                }
            }
        }
        if (x < 7 && y < 7) {
            if (piece.isQueen) {
                let hasTarget = null;
                for (
                    let px = x + 1, py = y + 1;
                    px <= 7 && py <= 7;
                    px++, py++
                ) {
                    target = this.get_piece_at(px, py);
                    if (target === null) {
                        valid_moves.push(new Move(px, py, hasTarget));
                    } else {
                        if (hasTarget || target.side === piece.side) {
                            break;
                        }
                        hasTarget = target;
                    }
                }
            } else {
                dest = this.get_piece_at(x + 1, y + 1);
                if (dest === null) {
                    if (piece.side === "black") {
                        valid_moves.push(new Move(x + 1, y + 1));
                    }
                } else if (
                    dest.side !== piece.side &&
                    x + 2 <= 7 &&
                    y + 2 <= 7
                ) {
                    target = dest;
                    dest = this.get_piece_at(x + 2, y + 2);
                    if (dest === null) {
                        valid_moves.push(new Move(x + 2, y + 2, target));
                    }
                }
            }
        }
        if (x > 0 && y < 7) {
            if (piece.isQueen) {
                let hasTarget = null;
                for (
                    let px = x - 1, py = y + 1;
                    px >= 0 && py <= 7;
                    px--, py++
                ) {
                    target = this.get_piece_at(px, py);
                    if (target === null) {
                        valid_moves.push(new Move(px, py, hasTarget));
                    } else {
                        if (hasTarget || target.side === piece.side) {
                            break;
                        }
                        hasTarget = target;
                    }
                }
            } else {
                dest = this.get_piece_at(x - 1, y + 1);
                if (dest === null) {
                    if (piece.side === "black") {
                        valid_moves.push(new Move(x - 1, y + 1));
                    }
                } else if (
                    dest.side !== piece.side &&
                    x - 2 >= 0 &&
                    y + 2 <= 7
                ) {
                    target = dest;
                    dest = this.get_piece_at(x - 2, y + 2);
                    if (dest === null) {
                        valid_moves.push(new Move(x - 2, y + 2, target));
                    }
                }
            }
        }
        return valid_moves;
    }

    get_tile_color(x, y) {
        if (this.valid_moves === null) {
            return this.#TILE_COLOR_NORMAL;
        }
        for (let i = 0; i < this.valid_moves.length; i++) {
            const move = this.valid_moves[i];
            if (
                move.target !== null &&
                move.target.x === x &&
                move.target.y === y
            ) {
                return this.#TILE_COLOR_TARGET;
            }
            if (move.x === x && move.y === y) {
                return this.#TILE_COLOR_VALID_MOVE;
            }
        }
        return this.#TILE_COLOR_NORMAL;
    }
}

class Piece {
    constructor(x, y, side) {
        this.x = x;
        this.y = y;
        this.side = side;
        this.isQueen = false;
    }
}

class Move {
    constructor(x, y, target = null) {
        this.x = x;
        this.y = y;
        this.target = target;
    }
}

const canvas = document.getElementById("tabuleiro");
const tabuleiro = new CheckerBoard(canvas);
tabuleiro.run();
