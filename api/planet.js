// Copyright © 2023 Entreprise SkamKraft
'use strict';

import { SpaceTraders } from "./config.js";
import { Position } from "../commun/position.js";

class Market {
    constructor(market) {
        this.symbol = market.symbol;
        this.exports = market.exports;
        this.imports = market.imports;
        this.exchange = market.exchange;
        this.transctions = market.transctions;
        this.trade_goods = market.tradeGoods;
    }

    has_export(market_export) {

    }

    list_exports(callback) {

    }

    has_import(market_import) {

    }

    list_import(callback) {
        
    }
}

export class Planet {
    constructor(waypoint) {
        this.name = waypoint.symbol;
        this.type = waypoint.type;
        this.system = waypoint.systemSymbol;
        this.position = new Position(waypoint.x, waypoint.y);
        this.moons = waypoint.orbitals;
        this.orbits = waypoint.orbits;
        this.faction = waypoint.faction;
        this.traits = waypoint.traits;
        this.dangers = waypoint.modifiers;
        this.discovery = waypoint.char;
        this.is_under_construction = waypoint.isUnderConstruction;
    }

    get_market(callback, error_handler) {
        const url = `${SpaceTraders.host}/systems/${this.system}/waypoints/${this.name}/market`;
        $.ajax({
            url: url,
            method: "GET",
            success: (reponse) => {
                let market = new Market(reponse.data);
                callback(market);
            },
            error: (err) => {
                error_handler("Market not found");
            }
        });  
    }

    is_type(type) {
        return this.type === type ? true : false;
    }

    is_discovered() {
        return this.discovery.length > 0 ? true : false;
    }    
}