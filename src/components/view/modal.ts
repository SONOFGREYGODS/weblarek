import { Component } from "../base/Component";
import { IEvents } from "../base/Events";
import { ensureElement } from "../../utils/utils";

export type TModalData = {
  content: HTMLElement;
};

export class Modal extends Component<TModalData> {
  protected contentElement: HTMLElement;
  protected closeButton: HTMLButtonElement;

  constructor(container: HTMLElement, protected events: IEvents) {
    super(container);
    this.contentElement = ensureElement<HTMLElement>(
      ".modal__content",
      container
    );
    this.closeButton = ensureElement<HTMLButtonElement>(
      ".modal__close",
      container
    );

    this.closeButton.addEventListener("click", () => this.close());
    this.container.addEventListener("click", (event) => {
      if (event.target === this.container) {
        this.close();
      }
    });
  }

  set content(value: HTMLElement) {
    this.contentElement.replaceChildren(value);
  }

  open() {
    this.container.classList.add("modal_active");
  }

  close() {
    this.container.classList.remove("modal_active");
    this.contentElement.replaceChildren();
    this.events.emit("modal:close");
  }
}