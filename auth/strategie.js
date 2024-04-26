// Copyright © 2023 Entreprise SkamKraft
'use strict';

export default class Strategie {
    constructor(strategie) {
        this.strategie = strategie;
        this.errors = [];
    }

    validate(name, input) {
        this.strategie.forEach(input_strat => {
            if(input_strat.name === name) input_strat.validations.forEach((validation) => {
                let args = validation.split("|");
                switch (args[0]) {
                    case "required": 
                        this.#test(Strategie.#required(input), `${name} is required.`);
                        break;
                    case "max_length":
                        this.#test(Strategie.#max_length(input, parseInt(args[1])), `${name} must have a max lenght of ${args[1]}.`);
                        break;
                    case "min_length":
                        this.#test(Strategie.#min_length(input, parseInt(args[1])), `${name} must have a min lenght of ${args[1]}`);
                        break;
                }
            });
        });
    }

    #test(test, error) {
        if(!test) this.errors.push(error); 
    }

    static #valide_email(input) {

    }

    static #min_length(input, length) {
        if(input.length < length) return false;
        return true;
    }

    static #max_length(input, length) {
        if(input.length > length) return false;
        return true;
    }

    static #required(input) {
        if (input === undefined || input === null || input === "") return false;
        return true;
    }
}