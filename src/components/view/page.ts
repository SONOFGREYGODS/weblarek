import { Component } from "../base/Component";
import { IEvents } from "../base/Events";
import { ensureElement } from "../../utils/utils";

export type TPageState = {
  gallery: HTMLElement[];
  counter: number;
};

export class Page extends Component<TPageState> {
  protected counterElement: HTMLElement;
  protected basketButton: HTMLButtonElement;
  protected galleryElement: HTMLElement;

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
    this.galleryElement = ensureElement<HTMLElement>(".gallery", container);

    this.basketButton.addEventListener("click", () => {
      this.events.emit("basket:open");
    });
  }

  set counter(value: number) {
    this.counterElement.textContent = String(value);
  }

  set gallery(value: HTMLElement[]) {
    this.galleryElement.replaceChildren(...value);
  }
}