// Copyright © 2023 Entreprise SkamKraft
"use strict";

import { SpaceTraders } from "./config.js";
import { My } from "./agent.js";

export class Faction {
  constructor(data) {
    this.symbol = data.symbol;
    this.name = data.name;
    this.description = data.description;
    this.headquarters = data.headquarters;
    this.traits = data.traits;
  }

  static get(name, callback, error_handler) {
    const url = `${SpaceTraders.host}/factions/${name}`;
    $.ajax({
      url: url,
      method: "GET",
      headers: {
        Accept: "application/json",
        Authorization: `Bearer ${My.agent.token}`,
      },
      success: (response) => {
        callback(new Faction(response.data));
      },
      error: (err) => {
        error_handler(err);
      },
    });
  }

  static list(limit, page, callback) {
    const url = `${SpaceTraders.host}/factions`;
    $.ajax({
      url: url,
      method: "GET",
      headers: { Accept: "application/json" },
      data: { limit, page },
      success: (response) => {
        const factions = [];
        const meta = response.meta;
        response.data.forEach((faction) => {
          factions.push(new Faction(faction));
        });
        callback(factions, meta);
      },
    });
  }

  static list_all(callback, end = false) {
    this.list(20, 1, (factions, meta) => {
      let maxPage = meta.total / 20;
      this.#r_listing(2, maxPage, factions, callback, end);
    });
  }

  static #r_listing(page, maxPage, factions, callback, end) {
    if (page < maxPage) {
      this.list(
        20,
        page++,
        () => {
          setTimeout(() => {
            if (!end) {
              callback(factions);
              planets = [];
            }
            this.#r_listing(page++, maxPage, factions, callback, end);
          }, 1000);
        },
        factions
      );
    } else {
      callback(factions);
    }
  }
}