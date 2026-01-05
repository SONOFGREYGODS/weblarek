import { IEvents } from "../base/Events";
import { ensureElement, ensureAllElements } from "../../utils/utils";
import { Form } from "./form";
import { TPayment } from "../../types";

export type TOrderFormData = {
  payment: TPayment;
  address: string;
};

export class OrderForm extends Form<TOrderFormData> {
  protected addressInput: HTMLInputElement;
  protected paymentButtons: HTMLButtonElement[];

  constructor(container: HTMLFormElement, events: IEvents) {
    super(container, events, "order:change", "order:submit");
    this.addressInput = ensureElement<HTMLInputElement>(
      "input[name=address]",
      container
    );
    this.paymentButtons = ensureAllElements<HTMLButtonElement>(
      ".order__buttons .button",
      container
    );
    this.paymentButtons.forEach((button) => {
      button.addEventListener("click", () => {
        this.events.emit("order:change", {
          field: "payment",
          value: button.name,
        });
      });
    });
  }

  set address(value: string) {
    this.addressInput.value = value;
  }

  set payment(value: TPayment) {
    this.paymentButtons.forEach((button) => {
      button.classList.toggle("button_alt-active", button.name === value);
    });
  }
}