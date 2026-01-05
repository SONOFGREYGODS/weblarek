import { Component } from "../base/Component";

export default class Catalog extends Component<{ items: HTMLElement[] }> {
  constructor(container: HTMLElement) {
    super(container);
  }

  set items(value: HTMLElement[]) {
    this.container.replaceChildren(...value);
  }
}