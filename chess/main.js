"use strict";

const BLACK = 0;
const WHITE = 1;
const BOARD_WIDTH = 8;
const BOARD_HEIGHT = 8;
const GLYPH_SCALE = 0.9;
const BLACK_PIECE = "#db7872";
const WHITE_PIECE = "#f8eddb";
const LIGHT_TILE = "#cdc998";
const DARK_TILE = "#d2ae79";
const SELECTED_TILE = "salmon";
const MOVE_TILE = "#a1ae6a";

class Chess {
    pieces = [];
    side = WHITE;
    selected = null;

    constructor(boardElementId) {
        this.board = document.getElementById(boardElementId);
        this.context = this.board.getContext("2d");
        this.tileWidth = this.board.width / BOARD_WIDTH;
        this.tileHeight = this.board.height / BOARD_HEIGHT;

        this.board.addEventListener("click", this.click.bind(this), false);

        this.reset();
        requestAnimationFrame(this.draw.bind(this));
    }

    turn() {
        this.selected = null;
        this.updateMoves();
        this.side = this.side === BLACK ? WHITE : BLACK;
    }

    reset() {
        this.pieces = [
            new Rook(0, 0, BLACK),
            new Knight(1, 0, BLACK),
            new Bishop(2, 0, BLACK),
            new Queen(3, 0, BLACK),
            new King(4, 0, BLACK),
            new Bishop(5, 0, BLACK),
            new Knight(6, 0, BLACK),
            new Rook(7, 0, BLACK),
            new Pawn(0, 1, BLACK),
            new Pawn(1, 1, BLACK),
            new Pawn(2, 1, BLACK),
            new Pawn(3, 1, BLACK),
            new Pawn(4, 1, BLACK),
            new Pawn(5, 1, BLACK),
            new Pawn(6, 1, BLACK),
            new Pawn(7, 1, BLACK),
            new Pawn(0, 6, WHITE),
            new Pawn(1, 6, WHITE),
            new Pawn(2, 6, WHITE),
            new Pawn(3, 6, WHITE),
            new Pawn(4, 6, WHITE),
            new Pawn(5, 6, WHITE),
            new Pawn(6, 6, WHITE),
            new Pawn(7, 6, WHITE),
            new Rook(0, 7, WHITE),
            new Knight(1, 7, WHITE),
            new Bishop(2, 7, WHITE),
            new Queen(3, 7, WHITE),
            new King(4, 7, WHITE),
            new Bishop(5, 7, WHITE),
            new Knight(6, 7, WHITE),
            new Rook(7, 7, WHITE),
        ];
        this.updateMoves();
    }

    updateMoves() {
        this.pieces.forEach((piece) => piece.updateMoves(this));
    }

    getPieceAt(x, y) {
        for (const piece of this.pieces) {
            if (piece.x === x && piece.y === y) {
                return piece;
            }
        }
        return null;
    }

    click(e) {
        const x = Math.floor(e.offsetX / this.tileWidth);
        const y = Math.floor(e.offsetY / this.tileHeight);
        const piece = this.getPieceAt(x, y);
        if (piece === this.selected) {
            this.selected = null;
            return;
        }
        if (piece && piece.color === this.side && piece.moves.length) {
            this.selected = piece;
            return;
        }
        if (this.selected) {
            const move = this.selected.getMove(x, y);
            if (move !== null) {
                if (move.target) {
                    this.pieces = this.pieces.filter(
                        (piece) => piece !== move.target
                    );
                }
                this.selected.move(x, y);
                this.turn();
            }
        }
    }

    draw(ts) {
        requestAnimationFrame(this.draw.bind(this));
        this.drawBoard();
        this.drawSelected();
        this.drawPieces();
    }

    drawBoard() {
        this.context.save();
        for (let y = 0; y < BOARD_HEIGHT; y++) {
            for (let x = 0; x < BOARD_WIDTH; x++) {
                if (y % 2 === 0) {
                    this.context.fillStyle =
                        x % 2 === 0 ? DARK_TILE : LIGHT_TILE;
                } else {
                    this.context.fillStyle =
                        x % 2 === 0 ? LIGHT_TILE : DARK_TILE;
                }
                this.context.fillRect(
                    x * this.tileWidth,
                    y * this.tileHeight,
                    this.tileWidth,
                    this.tileHeight
                );
            }
        }
        this.context.restore();
    }

    drawSelected() {
        if (!this.selected) return;
        this.context.save();
        this.context.globalAlpha = 0.7;
        this.context.fillStyle = SELECTED_TILE;
        // this.selected.y % 2 == 0 && this.selected.x % 2 == 0
        //     ? SELECTED_DARK_TILE
        //     : SELECTED_LIGHT_TILE;
        this.context.fillRect(
            this.selected.x * this.tileWidth,
            this.selected.y * this.tileHeight,
            this.tileWidth,
            this.tileHeight
        );
        this.context.globalAlpha = 0.5;
        this.context.fillStyle = MOVE_TILE;
        this.selected.moves.forEach((move) => {
            this.context.fillRect(
                move.x * this.tileWidth,
                move.y * this.tileHeight,
                this.tileWidth,
                this.tileHeight
            );
        });

        this.context.restore();
    }

    drawPieces() {
        this.context.save();
        this.context.font = `${this.tileWidth * GLYPH_SCALE}px serif`;
        this.pieces.forEach((piece) => {
            this.context.save();
            this.context.fillStyle =
                piece.color === BLACK ? BLACK_PIECE : WHITE_PIECE;
            this.context.translate(0, this.tileHeight);
            this.context.fillText(
                piece.glyph,
                piece.x * this.tileWidth,
                piece.y * this.tileHeight
            );
            this.context.restore();
        });
        this.context.restore();
    }
}

class Piece {
    constructor(x, y, color) {
        this.x = x;
        this.y = y;
        this.color = color;
        this.moves = [];
    }

    move(x, y) {
        this.x = x;
        this.y = y;
    }

    updateMoves(board) {}

    getMove(x, y) {
        for (const move of this.moves) {
            if (move.x === x && move.y === y) {
                return move;
            }
        }
        return null;
    }

    addMove(x, y, target) {
        if (
            x >= 0 &&
            x < BOARD_WIDTH &&
            y >= 0 &&
            y < BOARD_HEIGHT &&
            (!target || target.color !== this.color)
        ) {
            const move = new Move(x, y, target);
            this.moves.push(move);
            return move;
        }
    }
}

class Pawn extends Piece {
    firstMove = true;

    get glyph() {
        return "♟";
    }

    move(x, y) {
        super.move(x, y);
        this.firstMove = false;
    }

    updateMoves(board) {
        // TODO: Configure "en passant" moves
        this.moves = [];
        const x = this.x;
        const y = this.y;
        if (this.color === WHITE) {
            let target = board.getPieceAt(x - 1, y - 1);
            if (target) {
                this.addMove(x - 1, y - 1, target);
            }
            if ((target = board.getPieceAt(x + 1, y - 1))) {
                this.addMove(x + 1, y - 1, target);
            }
            if (board.getPieceAt(x, y - 1)) {
                return;
            }
            this.addMove(x, y - 1);
            if (this.firstMove && !board.getPieceAt(x, y - 2)) {
                this.addMove(x, y - 2);
            }
        } else {
            let target = board.getPieceAt(x - 1, y + 1);
            if (target) {
                this.addMove(x - 1, y + 1, target);
            }
            if ((target = board.getPieceAt(x + 1, y + 1))) {
                this.addMove(x + 1, y + 1, target);
            }
            if (board.getPieceAt(x, y + 1)) {
                return;
            }
            this.addMove(x, y + 1);
            if (this.firstMove && !board.getPieceAt(x, y + 2)) {
                this.addMove(x, y + 2);
            }
        }
    }
}

class Rook extends Piece {
    get glyph() {
        return "♜";
    }

    updateMoves(board) {
        this.moves = [];
        for (let y = this.y - 1; y >= 0; y--) {
            const target = board.getPieceAt(this.x, y);
            this.addMove(this.x, y, target);
            if (target) break;
        }
        for (let y = this.y + 1; y < BOARD_HEIGHT; y++) {
            const target = board.getPieceAt(this.x, y);
            this.addMove(this.x, y, target);
            if (target) break;
        }
        for (let x = this.x + 1; x < BOARD_WIDTH; x++) {
            const target = board.getPieceAt(x, this.y);
            this.addMove(x, this.y, target);
            if (target) break;
        }
        for (let x = this.x - 1; x >= 0; x--) {
            const target = board.getPieceAt(x, this.y);
            this.addMove(x, this.y, target);
            if (target) break;
        }
    }
}

class Knight extends Piece {
    get glyph() {
        return "♞";
    }

    updateMoves(board) {
        this.moves = [];
        const x = this.x;
        const y = this.y;
        this.addMove(x + 1, y - 2, board.getPieceAt(x + 1, y - 2));
        this.addMove(x + 2, y - 1, board.getPieceAt(x + 2, y - 1));
        this.addMove(x + 2, y + 1, board.getPieceAt(x + 2, y + 1));
        this.addMove(x + 1, y + 2, board.getPieceAt(x + 1, y + 2));
        this.addMove(x - 1, y + 2, board.getPieceAt(x - 1, y + 2));
        this.addMove(x - 2, y + 1, board.getPieceAt(x - 2, y + 1));
        this.addMove(x - 2, y - 1, board.getPieceAt(x - 2, y - 1));
        this.addMove(x - 1, y - 2, board.getPieceAt(x - 1, y - 2));
    }
}

class Bishop extends Piece {
    get glyph() {
        return "♝";
    }

    updateMoves(board) {
        this.moves = [];
        for (
            let y = this.y - 1, x = this.x + 1;
            y >= 0 && x < BOARD_WIDTH;
            x++, y--
        ) {
            const target = board.getPieceAt(x, y);
            this.addMove(x, y, target);
            if (target) break;
        }
        for (
            let y = this.y + 1, x = this.x + 1;
            y < BOARD_HEIGHT && x < BOARD_WIDTH;
            x++, y++
        ) {
            const target = board.getPieceAt(x, y);
            this.addMove(x, y, target);
            if (target) break;
        }
        for (
            let y = this.y + 1, x = this.x - 1;
            y < BOARD_HEIGHT && x >= 0;
            x--, y++
        ) {
            const target = board.getPieceAt(x, y);
            this.addMove(x, y, target);
            if (target) break;
        }
        for (let y = this.y - 1, x = this.x - 1; y >= 0 && x >= 0; x--, y--) {
            const target = board.getPieceAt(x, y);
            this.addMove(x, y, target);
            if (target) break;
        }
    }
}

class Queen extends Piece {
    get glyph() {
        return "♛";
    }

    updateMoves(board) {
        this.moves = [];
        for (let y = this.y - 1; y >= 0; y--) {
            const target = board.getPieceAt(this.x, y);
            this.addMove(this.x, y, target);
            if (target) break;
        }
        for (let y = this.y + 1; y < BOARD_HEIGHT; y++) {
            const target = board.getPieceAt(this.x, y);
            this.addMove(this.x, y, target);
            if (target) break;
        }
        for (let x = this.x + 1; x < BOARD_WIDTH; x++) {
            const target = board.getPieceAt(x, this.y);
            this.addMove(x, this.y, target);
            if (target) break;
        }
        for (let x = this.x - 1; x >= 0; x--) {
            const target = board.getPieceAt(x, this.y);
            this.addMove(x, this.y, target);
            if (target) break;
        }
        for (
            let y = this.y - 1, x = this.x + 1;
            y >= 0 && x < BOARD_WIDTH;
            x++, y--
        ) {
            const target = board.getPieceAt(x, y);
            this.addMove(x, y, target);
            if (target) break;
        }
        for (
            let y = this.y + 1, x = this.x + 1;
            y < BOARD_HEIGHT && x < BOARD_WIDTH;
            x++, y++
        ) {
            const target = board.getPieceAt(x, y);
            this.addMove(x, y, target);
            if (target) break;
        }
        for (
            let y = this.y + 1, x = this.x - 1;
            y < BOARD_HEIGHT && x >= 0;
            x--, y++
        ) {
            const target = board.getPieceAt(x, y);
            this.addMove(x, y, target);
            if (target) break;
        }
        for (let y = this.y - 1, x = this.x - 1; y >= 0 && x >= 0; x--, y--) {
            const target = board.getPieceAt(x, y);
            this.addMove(x, y, target);
            if (target) break;
        }
    }
}

class King extends Piece {
    get glyph() {
        return "♚";
    }

    updateMoves(board) {
        for (let y = this.y - 1; y <= this.y + 1; y++) {
            for (let x = this.x - 1; x <= this.x + 1; x++) {
                if (x === this.x && y === this.y) continue;
                this.addMove(x, y, board.getPieceAt(x, y));
            }
        }
    }
}

class Move {
    constructor(x, y, target = null) {
        this.x = x;
        this.y = y;
        this.target = target;
    }
}

const chess = new Chess("board");
