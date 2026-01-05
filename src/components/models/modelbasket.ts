import { IProduct } from "../../types/index";
import { IEvents } from "../base/Events";

export class ModelBasket {
  protected basket: IProduct[];

  constructor(protected events: IEvents) {
    this.basket = [];
  }

  getBasket(): IProduct[] {
    return this.basket;
  }

  addToBasket(item: IProduct): void {
    if (item) {
      this.basket.push(item);
    }
    this.events.emit("basket:changed");
  }

  removeFromBasket(item: IProduct): void {
    if (item) {
      this.basket = this.basket.filter((basket) => basket.id !== item.id);
    }
    this.events.emit("basket:changed");
  }

  clearBasket(): void {
    this.basket = [];
    this.events.emit("basket:changed");
  }

  priceBasket(): number {
    return this.basket.reduce((sum, basket) => sum + (basket.price ?? 0), 0);
  }

  countBasket(): number {
    return this.basket.length;
  }

  isInBasket(item: IProduct): boolean {
    return item ? this.basket.includes(item) : false;
  }
}
