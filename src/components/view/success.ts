import { Component } from "../base/Component";
import { IEvents } from "../base/Events";
import { ensureElement } from "../../utils/utils";

export type TSuccessData = {
  total: number;
};

export class Success extends Component<TSuccessData> {
  protected totalElement: HTMLElement;
  protected closeButton: HTMLButtonElement;

  constructor(container: HTMLElement, protected events: IEvents) {
    super(container);
    this.totalElement = ensureElement<HTMLElement>(
      ".order-success__description",
      container
    );
    this.closeButton = ensureElement<HTMLButtonElement>(
      ".order-success__close",
      container
    );

    this.closeButton.addEventListener("click", () => {
      this.events.emit("success:close");
    });
  }

  set total(value: number) {
    this.totalElement.textContent = `Списано ${value} синапсов`;
  }
}