// Copyright © 2023 Entreprise SkamKraft
'use strict';

import { SpaceTraders } from "./config.js";
import { Position } from "../commun/position.js";
import { Planet } from "./planet.js";

export class System {
    constructor(data) {
        this.name = data.symbol;
        this.sector = data.sectorSymbol;
        this.type = data.type;
        this.position = new Position(data.x, data.y);
        this.factions = data.factions;
        this.stopped = false;
        this.end = false;
    }

    when_end() {
        this.end = true;
    }

    get_planet(name, callback, error_handler) {
        const url = `${SpaceTraders.host}/systems/${this.name}/waypoints/${name}`;
        $.ajax({
            url: url,
            method: "GET",
            success: (reponse) => {
                let planet = new Planet(reponse.data);
                callback(planet);
            },
            error: (err) => {
                error_handler("Planet not found");
            }
        });
    }

    list_planets(limit, page, callback, planets = []) {
        const url = `${SpaceTraders.host}/systems/${this.name}/waypoints`
        $.ajax({
            url: url,
            method: "GET",
            data: {
                limit: limit,
                page: page
            },
            success: (reponse) => {
                reponse.data.forEach(planet => {
                    planets.push(new Planet(planet));
                });
                callback(planets, reponse.meta);
            }
        });
    }

    stop() {
        this.stopped = true;
    }

    list_all_planets(callback, end = false) {
        this.list_planets(20, 1, (planets, meta) => {
            let maxPage = meta.total / 20;
            this.#r_listing(2, maxPage, planets, callback, end);
        });
    }

    #r_listing(page, maxPage, planets, callback, end) {
        if (page < maxPage) {
            this.list_planets(20, page++, () => {
                setTimeout(() => {
                    if (!end) {
                        callback(planets);
                        planets = [];
                    }
                    if (!this.stopped) this.#r_listing(page++, maxPage, planets, callback, end);
                }, SpaceTraders.timing);
            }, planets);
        } else {
            callback(planets);
        }
    }
}

export class SystemBuilder {
    constructor(end = false) {
        this.stopped = false;
        this.end = end;
        this.page = 1;

    }

    static parse_system_name(name) {
        return name.split("-").slice(-1, 2).join("-");
    }

    static get(name, callback, error_handler) {
        const url = `${SpaceTraders.host}/systems/${name}/`;
        $.ajax({
            url: url,
            method: "GET",
            success: (reponse) => {
                let system = new System(reponse.data);
                callback(system);
            },
            error: (err) => {
                error_handler("System not found");
            }
        });
    }

    static list(limit, page, callback, systems = []) {
        const url = `${SpaceTraders.host}/systems/`
        $.ajax({
            url: url,
            method: "GET",
            data: {
                limit: limit,
                page: page
            },
            success: (reponse) => {
                reponse.data.forEach(system => {
                    systems.push(new System(system));
                });
                callback(systems, reponse.meta);
            }
        });
    }

    stop() {
        this.stopped = true;
    }

    list_all(callback) {
        SystemBuilder.list(20, this.page, (systems, meta) => {
            this.max_page = meta.total / 20;
            this.#r_listing(systems, callback);
        });
    }

    #r_listing(systems, callback) {
        if (page < maxPage) {
            SystemBuilder.list(20, this.page++, () => {
                setTimeout(() => {
                    if (!this.end) {
                        callback(systems);
                        systems = [];
                    }
                    if (!this.stopped) this.#r_listing(page++, maxPage, systems, callback);
                }, SpaceTraders.timing);
            }, systems);
        } else {
            callback(systems);
        }
    }
}