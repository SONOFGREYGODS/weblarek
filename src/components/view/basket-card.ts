import { IEvents } from "../base/Events";
import { ensureElement } from "../../utils/utils";
import { Card } from "./card";

export class BasketCard extends Card {
  protected indexElement: HTMLElement;
  protected deleteButton: HTMLButtonElement;

  constructor(container: HTMLElement, protected events: IEvents) {
    super(container);
    this.indexElement = ensureElement<HTMLElement>(
      ".basket__item-index",
      container
    );
    this.deleteButton = ensureElement<HTMLButtonElement>(
      ".basket__item-delete",
      container
    );
    this.deleteButton.addEventListener("click", () => {
      if (!this.idValue) {
        return;
      }
      this.events.emit("basket:remove", { id: this.idValue });
    });
  }

  set index(value: number) {
    this.indexElement.textContent = String(value);
  }
}