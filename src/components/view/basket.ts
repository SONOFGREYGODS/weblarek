import { Component } from "../base/Component";
import { IEvents } from "../base/Events";
import { ensureElement, createElement } from "../../utils/utils";

export type TBasketView = {
  items: HTMLElement[];
  total: number;
  isEmpty: boolean;
};

export class Basket extends Component<TBasketView> {
  protected listElement: HTMLElement;
  protected totalElement: HTMLElement;
  protected buttonElement: HTMLButtonElement;

  constructor(container: HTMLElement, protected events: IEvents) {
    super(container);
    this.listElement = ensureElement<HTMLElement>(".basket__list", container);
    this.totalElement = ensureElement<HTMLElement>(".basket__price", container);
    this.buttonElement = ensureElement<HTMLButtonElement>(
      ".basket__button",
      container
    );
    this.buttonElement.addEventListener("click", () => {
      this.events.emit("basket:checkout");
    });
  }

  set items(value: HTMLElement[]) {
    if (value.length === 0) {
      const empty = createElement<HTMLParagraphElement>("p", {
        textContent: "Корзина пуста",
      });
      this.listElement.replaceChildren(empty);
      return;
    }
    this.listElement.replaceChildren(...value);
  }

  set total(value: number) {
    this.totalElement.textContent = `${value} синапсов`;
  }

  set isEmpty(value: boolean) {
    this.buttonElement.disabled = value;
  }
}