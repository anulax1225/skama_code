// Copyright © 2023 Entreprise SkamKraft
'use strict';
import { AgentBuilder } from '../api/agent.js'
import Strategie from './strategie.js';

let strategies = {
    register: [
        {
            name: "name",
            validations: [
                "required",
                "max_length|14"
            ]
        },
        {
            name: "faction",
            validations: [
                "required"
            ]
        }
    ],
    login: [
        {
            name: "token",
            validations: [
                "required"
            ]
        }
    ]
}

export class Auth {
    constructor(store = false) {
        this.store = store;
        this.validated = () => {};
        this.error_handler = () => {};
        this.strategies = strategies;
    }

    done(validated) {
        this.validated = validated;
        return this;
    }
    
    fail(error_handler) {
        this.error_handler = error_handler;
        return this;
    }

    login(token) {
        let validateur = new Strategie(this.strategies.login);
        validateur.validate("token", token);
        if (validateur.errors.length > 0) this.error_handler(validateur.errors);
        else {
            if (this.store) localStorage.setItem("token", token);
            AgentBuilder.get(token, this.validated, this.error_handler);
        }
    }

    relog() {
        if(this.#is_login()) {
            AgentBuilder.get(localStorage.getItem("token"), this.validated, this.error_handler); 
            return true;
        }
        return false;
    }

    register(new_agent) {
        let validateur = new Strategie(this.strategies.register);
        validateur.validate("name", new_agent.name);
        validateur.validate("faction", new_agent.faction);
        if (validateur.errors.length > 0) this.error_handler(validateur.errors);
        else {            
            AgentBuilder.create(new_agent.name, new_agent.faction, (agent) => {
                if (this.store) localStorage.setItem("token", agent.token);
                this.validated(agent);
            }, this.error_handler);
        }
    }

    unload_token() {
        if(this.#is_login()) localStorage.removeItem("token");
    }

    #is_login() {
        if (localStorage.getItem("token")) return true
        return false
    }
}