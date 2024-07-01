export class CanvasRenderer {
  #running = false;
  #frame_time = 1000;
  #update_callback = null;

  constructor(canvas_tag, width, height) {
    this.canvas = new fabric.Canvas(canvas_tag, {
      width: width,
      height: height,
      renderOnAddRemove: true,
      hoverCursor: "pointer",
    });
    this.canvas_objs = [];
  }

  #animate() {
    if (this.update_callback) this.update_callback();
    this.canvas_objs.forEach((obj) => {
      if (obj.update) obj.update(obj);
    })
    this.canvas.renderAll();
    if (this.#running) setTimeout(() => { this.#animate() }, this.#frame_time);
  }

  obj_from_img(path, pos, options = {
      selectacle: false,
      name: "",
      update: null,
    }) {
    let canvas = this;
    fabric.Image.fromURL(path, function (img_planet) {
      console.log(options.name, pos);
      img_planet.set({
        selectable: options.selectable,
        left: pos.x,
        top: pos.y,
        name: options.name,
        update: options.update,
      });
      canvas.canvas_obj.push(img_planet);
      canvas.add(img_planet);
    });
  }

  canvas_pos(position) {
    return {
      x: position.x + this.canvas.width / 2,
      y: position.y + this.canvas.height / 2,
    };
  }
  rel_pos(position) {
    return {
      x: position.x - this.canvas.width / 2,
      y: position.y - this.canvas.height / 2,
    };
  }

  add(canvas_obj) {
    this.canvas_objs.push(canvas_obj);
    this.canvas.add(canvas_obj);
  }

  update(callback) {
    this.#update_callback = callback;
  }

  on(event, callback) {
    this.canvas.on(event, callback);
  }

  zoom(position, scale) {
    let pos = this.canvas_pos(position);
    this.canvas.zoomToPoint(
      new fabric.Point(pos.x, pos.y),
      this.canvas.getZoom() * scale
    );
  }

  frame_rate(rate) {
    this.#frame_time = 1000 / rate;
  }

  get_size() {
    return {
      width: this.canvas.width,
      height: this.canvas.height,
    };
  }

  resize(width, height) {
    this.canvas.setWidth(width);
    this.canvas.setHeight(height);
    this.canvas.renderAll();
  }

  scale(scale_w, scale_h) {
    this.canvas.setWidth((window.innerWidth / 100) * scale_w)
    this.canvas.setHeight((window.innerHeight / 100) * scale_h);
    this.canvas.renderAll();
  }

  start() {
    this.#running = true;
    this.#animate();
  }

  stop() {
    this.#running = false;
  }

  clean() {
    this.canvas_obj = [];
    this.canvas.clear();
  }
}
