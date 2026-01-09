import { IEvents } from "../base/Events";
import { Card } from "./card";

export class CatalogCard extends Card {
  constructor(container: HTMLElement, protected events: IEvents) {
    super(container);
    container.addEventListener("click", () => {
      if (!this.idValue) {
        return;
      }
      this.events.emit("card:select", { id: this.idValue });
    });
  }
}