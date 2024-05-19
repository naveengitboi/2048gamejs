export default class Tile {
  #tileElement;
  #x;
  #y;
  #value;
  constructor(gridElement, value = Math.random() > 0.5 ? 2 : 4) {
    this.#tileElement = document.createElement("div");
    this.#tileElement.classList.add("tile");
    gridElement.append(this.#tileElement);
    this.value = value;
  }

  get value() {
    return this.#value;
  }

  set value(val) {
    this.#value = val;
    this.#tileElement.textContent = val;

    const power = Math.log2(val);
    const bgColor = 100 - power*5 ;
    this.#tileElement.style.setProperty(
      "--tile_bg",
      `${bgColor}%`
    );
    this.#tileElement.style.setProperty(
      "--tile_color",
      `${100 - bgColor}%`
    );
  }

  set x(val) {
    this.#x = val;
    this.#tileElement.style.setProperty("--x", val);
  }

  set y(val) {
    this.#y = val;
    this.#tileElement.style.setProperty("--y", val);
  }

  remove() {
    this.#tileElement.remove();
  }

  waitForTransition(animation = false) {
    return new Promise((resolve) => {
      this.#tileElement.addEventListener(animation ? "animationend" : "transitionend", resolve, {
        once: true,
      });
    });
  }
}
