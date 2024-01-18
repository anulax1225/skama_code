// Copyright © 2023 Entreprise SkamKraft
'use strict';

export class Timer {
    constructor(time, step, unit = "s") {
        this.passed_time = 0;
        this.time = time;
        this.step = step;
        this.continue = true;
        switch (unit) {
            case "ms": 
                this.unit = 1;
                break;  
            case "s": 
                this.unit = 1000;
                break;
            case "m": 
                this.unit = 60000;
                break;
            case "h": 
                this.unit = 3600000;
                break;
            default:
                this.unit = 1;
                break;
        }
    }
    on(action, callback) {
        switch(action) {
            case "end":
                this.end_callback = callback;
                break;
            case "step":
                this.step_callback = callback;
                break;
        }
    }
    start() {
        this.continue = true;
        this.#time_step();
    }

    stop() {
        this.continue = false;
        this.passed_time = 0;
    }

    #time_step() {
        if (this.passed_time < this.time && this.continue) {
            if (this.step_callback) this.step_callback(this.passed_time);
            this.passed_time += this.step;
            setTimeout(() => { 
                this.#time_step() 
            }, this.step*this.unit);           
        } else {
            if (this.end_callback) this.end_callback(this.time);
        }
    }
}