// Copyright © 2023 Entreprise SkamKraft
'use strict';

export class Position {
    constructor(x, y) {
        this.x = x;
        this.y = y;
    }

    get_canvas_pos(w, h) {
        return new Position(x - w/2, y - h/2)
    }

    move(position) {
        this.x += position.x;
        this.y += position.y;
    }
}