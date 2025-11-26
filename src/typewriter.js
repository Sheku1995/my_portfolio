export default class TypeWriter {
  constructor(element, text, speed = 100, delay = 0) {
    this.element = element;
    this.text = text;
    this.speed = speed;
    this.delay = delay;
    this.index = 0;
    this.timeout = null;
  }

  start() {
    this.element.innerHTML = '';
    setTimeout(() => this.step(), this.delay);
  }

  step() {
    if (this.index < this.text.length) {
      this.element.innerHTML += this.text.charAt(this.index);
      this.index++;
      this.timeout = setTimeout(() => this.step(), this.speed);
    }
  }

  stop() {
    if (this.timeout) clearTimeout(this.timeout);
  }
}
