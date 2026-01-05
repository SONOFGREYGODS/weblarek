import { Component } from "../base/Component";
import { IEvents } from "../base/Events";
import { IProduct } from "../../types";
import { ensureElement } from "../../utils/utils";
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

  constructor(container: HTMLElement) {
    super(container);
    this.titleElement = container.querySelector(".card__title");
    this.priceElement = container.querySelector(".card__price");
    this.categoryElement = container.querySelector(".card__category");
    this.imageElement = container.querySelector(".card__image");
    this.descriptionElement = container.querySelector(".card__text");
  }

  set id(value: string) {
    this.container.dataset.id = value;
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

export class CatalogCard extends Card {
  constructor(container: HTMLElement, protected events: IEvents) {
    super(container);
    container.addEventListener("click", () => {
      this.events.emit("card:select", { id: this.container.dataset.id });
    });
  }
}

export class PreviewCard extends Card {
  protected buttonElement: HTMLButtonElement;

  constructor(container: HTMLElement, protected events: IEvents) {
    super(container);
    this.buttonElement = ensureElement<HTMLButtonElement>(
      ".card__button",
      container
    );
    this.buttonElement.addEventListener("click", () => {
      if (this.buttonElement.disabled) {
        return;
      }
      const inBasket = this.container.dataset.inBasket === "true";
      this.events.emit(inBasket ? "card:remove" : "card:buy", {
        id: this.container.dataset.id,
      });
    });
  }

  set price(value: number | null) {
    super.price = value;
    if (value === null) {
      this.buttonElement.disabled = true;
      this.buttonElement.textContent = "Недоступно";
    }
  }

  set buttonText(value: string) {
    if (!this.buttonElement.disabled) {
      this.buttonElement.textContent = value;
    }
  }

  set inBasket(value: boolean) {
    this.container.dataset.inBasket = String(value);
  }
}

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
      this.events.emit("basket:remove", { id: this.container.dataset.id });
    });
  }

  set index(value: number) {
    this.indexElement.textContent = String(value);
  }
}
