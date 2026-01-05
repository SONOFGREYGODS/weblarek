import { Component } from "../base/Component";

export class Catalog extends Component<{ items: HTMLElement[] }> {
  set items(value: HTMLElement[]) {
    this.container.replaceChildren(...value);
  }
}
