// Copyright © 2023 Entreprise SkamKraft
'use strict';
import contracts from "../../controllers/contracts.js";
import { My } from "../api/agent.js";
import { SpaceTraders } from "./config.js";


export class Contract {
    constructor(data) {
        this.id = data.id;
        this.faction = data.factionSymbol;
        this.type = data.type;
        this.accepted = data.accepted;
        this.expiration = data.expiration;
        this.deadline = data.deadlineToAccept;
        this.terms = data.terms;
        this.paymentAccepted = data.terms.payment.onAccepted;
        this.paymentFulfill = data.terms.payment.onFulfilled;
        this.tradeSymbol = data.terms.deliver[0].tradeSymbol;
        this.destination = data.terms.deliver[0].destinationSymbol;


    }

    static get(id, callback, error_handler) {
        const url = `${SpaceTraders.host}/my/contracts/${id}`;
        $.ajax({
            url: url,
            method: "GET",
            headers: {
                Accept: "application/json",
                Authorization: `Bearer ${My.agent.token}`,
            },
            success: (reponse) => {
                callback(new Contract(reponse.data));
            },
            error: (err) => {
                error_handler("Contract not found");
            }
        });
    }

    static list(limit, page, callback) {
        const url = `${SpaceTraders.host}/my/contracts`
        $.ajax({
            url: url,
            method: "GET",
            data: {
                limit: limit,
                page: page,
            },
            headers: {
                Accept: "application/json",
                Authorization: `Bearer ${My.agent.token}`,
            },
            success: (reponse) => {
                let contracts = [];
                reponse.data.forEach(contract => {
                    contracts.push(new Contract(contract));
                });
                callback(contracts);
            },
            error: (err) => {
                error_handler("Contract not found");
            }
        });
    }

    accept(callback) {
        console.log("Access");
        const url = `${SpaceTraders.host}/my/contracts/${this.id}/accept`
        $.ajax({
            url: url,
            method: "POST",
            headers: {
                'Content-Type': 'application/json',
                Accept: "application/json",
                Authorization: `Bearer ${My.agent.token}`,
            },
            success: (reponse) => {
                callback(reponse);
            },
            error: (err) => {
                //error_handler("Contract not found");
            }
        });


    }

    static deliver(contractId, token) {

        const url = `${SpaceTraders.host}/my/contracts/${contractId}/deliver`
        $.ajax({
            url: url,
            method: "POST",
            headers: {
                'Content-Type': 'application/json',
                Accept: "application/json",
                Authorization: `Bearer ${My.agent.token}`,
            },
            success: (reponse) => {
                callback(reponse);
            },
            error: (err) => {
                error_handler("Contract not found");
            }
        });


    }

    static fulfill(contractId, token) {

        const url = `${SpaceTraders.host}/my/contracts/${contractId}/fulfill`
        $.ajax({
            url: url,
            method: "POST",
            headers: {
                'Content-Type': 'application/json',
                Accept: "application/json",
                Authorization: `Bearer ${My.agent.token}`,
            },
            success: (reponse) => {
                callback(reponse);
            },
            error: (err) => {
                error_handler("Contract not found");
            }
        });


    }

}