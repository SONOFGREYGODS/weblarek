import { Component } from "../base/Component";
import { IProduct } from "../../types";
import { categoryMap } from "../../utils/constants";

export type TCardData = IProduct & {
  buttonText?: string;
  inBasket?: boolean;
  index?: number;
};

export class Card extends Component<TCardData> {
  protected titleElement: HTMLElement | null;
  protected priceElement: HTMLElement | null;
  protected categoryElement: HTMLElement | null;
  protected imageElement: HTMLImageElement | null;
  protected descriptionElement: HTMLElement | null;
  protected idValue: string | null = null;

  constructor(container: HTMLElement) {
    super(container);
    this.titleElement = container.querySelector(".card__title");
    this.priceElement = container.querySelector(".card__price");
    this.categoryElement = container.querySelector(".card__category");
    this.imageElement = container.querySelector(".card__image");
    this.descriptionElement = container.querySelector(".card__text");
  }

  set id(value: string) {
    this.idValue = value;
  }

  set title(value: string) {
    if (this.titleElement) {
      this.titleElement.textContent = value;
    }
  }

  set description(value: string) {
    if (this.descriptionElement) {
      this.descriptionElement.textContent = value;
    }
  }

  set image(value: string) {
    if (this.imageElement) {
      this.setImage(this.imageElement, value, this.titleElement?.textContent ?? "");
    }
  }

  set price(value: number | null) {
    if (this.priceElement) {
      this.priceElement.textContent = value === null ? "Бесценно" : `${value} синапсов`;
    }
  }

  set category(value: string) {
    if (!this.categoryElement) {
      return;
    }
    this.categoryElement.textContent = value;
    Object.values(categoryMap).forEach((className) =>
      this.categoryElement?.classList.remove(className)
    );
    const className = categoryMap[value as keyof typeof categoryMap];
    if (className) {
      this.categoryElement.classList.add(className);
    }
  }
}