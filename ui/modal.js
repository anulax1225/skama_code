// Copyright © 2023 Entreprise SkamKraft
'use strict';

export class Modal {
    constructor(name, template_engine, tag = "#block-content") {
        this.name = name;
        this.template_engine = template_engine;
        this.tag = tag;
        this.modal_class = "";
    }

    load(template) {
        this.template_engine.get_template((reponse) => {
            $(this.tag).prepend(`
                <dialog id="${this.name}" class="${this.modal_class} modal-disable">
                    ${reponse}
                </dialog>
            `);
            if(this.after_load_callback) this.after_load_callback();
        }, template);
    }

    after_load(callback)
    {
        this.after_load_callback = callback;
    }

    on_close(callback) {
        document.querySelector(`#${this.name}`).addEventListener("close", callback);
    }

    add_class(modal_class) {
        let modal;
        if(modal = $(`#${this.name}`)) modal.addClass(modal_class);
        this.modal_class = `${this.modal_class} ${modal_class}`;
    }

    show() {
        document.querySelector(`#${this.name}`).showModal(); 
    }

    close() {
        document.querySelector(`#${this.name}`).close();
    }
}