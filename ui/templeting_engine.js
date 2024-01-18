// Copyright © 2023 Entreprise SkamKraft
'use strict';
export class TemplateEngine {
  constructor(path) {
    this.templatePath = path;
  }
  
  render(template) {
    this.get_template((reponse) => {
      $('body').html(reponse);
      this.get_template((reponse) => {
        $("#block-content").html(reponse);
        if (this.after_render_callback)  this.#flush_events().after_render_callback(this);
      }, template)
    });
  }

  frag_load(tag, template) {
    this.get_template((reponse) => {
      $(tag).html(reponse);
    }, template);
  }

  get_template(callback, template = "") {
    let url = template === "" ? `${this.templatePath}/template.html`: `${this.templatePath}/${template}`;
    $.ajax(url,{
      method: "GET",
      success: callback,
      error: (err) => {
        console.log(err);
      }
    });
  }

  add_event(tag, action, callback) {
    $("body").on(action, tag, callback);
  }

  #flush_events() {
    $("body").unbind();
    return this;
  }

  after_render(callback) {
    this.after_render_callback  = callback;
  }
}
