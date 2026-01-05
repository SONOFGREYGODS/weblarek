import { IEvents } from "../base/Events";
import { ensureElement } from "../../utils/utils";
import { Form } from "./form";

export type TContactsFormData = {
  email: string;
  phone: string;
};

export class ContactsForm extends Form<TContactsFormData> {
  protected emailInput: HTMLInputElement;
  protected phoneInput: HTMLInputElement;

  constructor(container: HTMLFormElement, events: IEvents) {
    super(container, events, "contacts:change", "contacts:submit");
    this.emailInput = ensureElement<HTMLInputElement>(
      "input[name=email]",
      container
    );
    this.phoneInput = ensureElement<HTMLInputElement>(
      "input[name=phone]",
      container
    );
  }

  set email(value: string) {
    this.emailInput.value = value;
  }

  set phone(value: string) {
    this.phoneInput.value = value;
  }
}