// Copyright © 2023 Entreprise SkamKraft
"use strict";
import { SpaceTraders } from "./config.js";

export class Agent {
  constructor(agent, token = "") {
    this.token = token;
    this.name = agent.symbol;
    this.credits = agent.credits;
    this.faction = agent.startingFaction;
    this.hq = agent.headquarters;
    this.ships_cpt = agent.shipCount;
  }

  get_agent_system() {
    let metaSystem = this.hq.split("-");
    return metaSystem[0] + "-" + metaSystem[1];
  }
}

export class AgentBuilder {
  constructor(end = false) {
    this.stopped = false;
    this.end = end;
  }

  static create(symbol, faction, callback, error_handler) {
    const url = `${SpaceTraders.host}/register`;
    $.ajax({
      url: url,
      method: "POST",
      headers: { "Content-Type": "application/json" },
      processData: false,
      data: `{\n  "faction": "${faction}",\n  "symbol": "${symbol}"}`,
      success: (reponse) => {
        let agent = new Agent(reponse.data.agent, reponse.data.token);
        callback(agent);
      },
      error: (err) => {
        error_handler(["Name already took."]);
      },
    });
  }

  static get(token, callback, error_handler) {
    const url = `${SpaceTraders.host}/my/agent`;
    $.ajax({
      url: url,
      method: "GET",
      headers: {
        Accept: "application/json",
        Authorization: `Bearer ${token}`,
      },
      success: (reponse) => {
        let agent = new Agent(reponse.data, token);
        callback(agent);
      },
      error: (err) => {
        error_handler(["Token invalide."]);
      },
    });
  }

  static get_public(symbol, callback) {
    const url = `${SpaceTraders.host}/agents/${symbol}`;
    $.ajax({
      url: url,
      method: "GET",
      headers: {
        Accept: "application/json",
      },
      success: (reponse) => {
        let agent = new Agent(reponse.data);
        callback(agent);
      },
    });
  }

  static list(limit, page, callback, agents = []) {
    const url = `${SpaceTraders.host}/agents`;
    const data = { limit, page };
    $.ajax({
      url: url,
      method: "GET",
      headers: {
        Accept: "application/json",
      },
      data: data,
      success: (reponse) => {
        reponse.data.forEach((agent) => {
          agents.push(new Agent(agent));
        });
        callback(agents, reponse.meta);
      },
    });
  }

  stop()
  {
    this.stopped = true;
  }
  
  list_all(callback) {
    this.stopped = false;
    AgentBuilder.list(20, 1, (agents, meta) => {
      let maxPage = meta.total / 20;
      this.#r_listing(2, maxPage, agents, callback);
    });
  }

  #r_listing(page, maxPage, agents, callback) {
    if (page < maxPage) {
      AgentBuilder.list(
        20,
        page++,
        () => {
          setTimeout(() => {
            if (!this.end) {
              callback(agents);
            }
            if (!this.stopped)
              this.#r_listing(page++, maxPage, agents, callback, this.end);
          }, 1000);
        },
        agents
      );
    } else {
      callback(agents);
    }
  }
}
