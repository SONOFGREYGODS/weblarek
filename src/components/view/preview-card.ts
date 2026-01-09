import { IEvents } from "../base/Events";
import { ensureElement } from "../../utils/utils";
import { Card } from "./card";

export class PreviewCard extends Card {
  protected buttonElement: HTMLButtonElement;
  protected inBasketValue = false;

  constructor(container: HTMLElement, protected events: IEvents) {
    super(container);
    this.buttonElement = ensureElement<HTMLButtonElement>(
      ".card__button",
      container
    );
    this.buttonElement.addEventListener("click", () => {
      if (!this.idValue) {
        return;
      }
      this.events.emit("card:toggle", {
        id: this.idValue,
        inBasket: this.inBasketValue,
      });
    });
  }

  set price(value: number | null) {
    super.price = value;
    if (value === null) {
      this.buttonElement.disabled = true;
      this.buttonElement.textContent = "Недоступно";
    }
  }

  set buttonText(value: string) {
    if (!this.buttonElement.disabled) {
      this.buttonElement.textContent = value;
    }
  }

  set inBasket(value: boolean) {
    this.inBasketValue = value;
  }
}