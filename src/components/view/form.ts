import { Component } from "../base/Component";
import { IEvents } from "../base/Events";
import { ensureElement } from "../../utils/utils";

export type TFormState = {
  valid: boolean;
  errors: string;
};

export class Form<T> extends Component<T & TFormState> {
  protected submitButton: HTMLButtonElement;
  protected errorsElement: HTMLElement;
  protected inputs: HTMLInputElement[];

  constructor(
    protected container: HTMLFormElement,
    protected events: IEvents,
    private changeEvent: string,
    private submitEvent: string
  ) {
    super(container);
    this.submitButton = ensureElement<HTMLButtonElement>(
      "button[type=submit]",
      container
    );
    this.errorsElement = ensureElement<HTMLElement>(".form__errors", container);
    this.inputs = Array.from(container.querySelectorAll(".form__input"));

    this.inputs.forEach((input) => {
      input.addEventListener("input", () => {
        this.events.emit(this.changeEvent, {
          field: input.name,
          value: input.value,
        });
      });
    });

    this.container.addEventListener("submit", (event) => {
      event.preventDefault();
      this.events.emit(this.submitEvent);
    });
  }

  set valid(value: boolean) {
    this.submitButton.disabled = !value;
  }

  set errors(value: string) {
    this.errorsElement.textContent = value;
  }
}