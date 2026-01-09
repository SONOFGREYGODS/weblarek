import { Component } from "../base/Component";
import { IEvents } from "../base/Events";
import { ensureElement } from "../../utils/utils";

export type THeaderState = {
  counter: number;
};

export class Header extends Component<THeaderState> {
  protected counterElement: HTMLElement;
  protected basketButton: HTMLButtonElement;

  constructor(container: HTMLElement, protected events: IEvents) {
    super(container);
    this.counterElement = ensureElement<HTMLElement>(
      ".header__basket-counter",
      container
    );
    this.basketButton = ensureElement<HTMLButtonElement>(
      ".header__basket",
      container
    );

    this.basketButton.addEventListener("click", () => {
      this.events.emit("basket:open");
    });
  }

  set counter(value: number) {
    this.counterElement.textContent = String(value);
  }
}