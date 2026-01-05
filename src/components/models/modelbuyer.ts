import { IBuyer, TPayment, TValidationErrors } from "../../types/index";
import { IEvents } from "../base/Events";

export class ModelBuyer {
  protected buyer: IBuyer;

  constructor(protected events: IEvents) {
    this.buyer = {
      address: "",
      email: "",
      payment: "",
      phone: "",
    };
  }

  setPayment(payment: TPayment): void {
    this.buyer.payment = payment;
    this.events.emit("buyer:changed");
  }

  setEmail(email: string): void {
    this.buyer.email = email;
    this.events.emit("buyer:changed");
  }

  setPhone(phone: string): void {
    this.buyer.phone = phone;
    this.events.emit("buyer:changed");
  }

  setAddress(address: string): void {
    this.buyer.address = address;
    this.events.emit("buyer:changed");
  }

  getBuyer(): IBuyer {
    return this.buyer;
  }

  clearBuyer(): void {
    this.buyer = {
      address: "",
      email: "",
      payment: "",
      phone: "",
    };
    this.events.emit("buyer:changed");
  }

  validateBuyer(): TValidationErrors {
    const errors: TValidationErrors = {};
    if (!this.buyer.payment) {
      errors.payment = "Не выбран способ оплаты";
    }
    if (!this.buyer.address) {
      errors.address = "Не указан адрес доставки";
    }
    if (!this.buyer.email) {
      errors.email = "Не указан email";
    }
    if (!this.buyer.phone) {
      errors.phone = "Не указан телефон";
    }
    return errors;
  }
}