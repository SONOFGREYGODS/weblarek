import "./scss/styles.scss";
import { ModelCatalog } from "./components/models/modelcatalog";
import { ModelBasket } from "./components/models/modelbasket";
import { ModelBuyer } from "./components/models/modelbuyer";
import { ShopAPI } from "./components/extend/ShopAPI";
import { API_URL, CDN_URL } from "./utils/constants";
import { Api } from "./components/base/Api";
import { EventEmitter } from "./components/base/Events";
import { cloneTemplate, ensureElement } from "./utils/utils";
import { Catalog } from "./components/view/catalog";
import { Basket } from "./components/view/basket";
import {
  BasketCard,
  CatalogCard,
  PreviewCard,
} from "./components/view/cards";
import { Modal } from "./components/view/modal";
import { OrderForm } from "./components/view/order-form";
import { ContactsForm } from "./components/view/contacts-form";
import { Page } from "./components/view/page";
import { Success } from "./components/view/success";
import { IProduct, IOrder } from "./types";

const events = new EventEmitter();

const catalogModel = new ModelCatalog(events);
const basketModel = new ModelBasket(events);
const buyerModel = new ModelBuyer(events);
const baseApi = new Api(API_URL);
const api = new ShopAPI(baseApi, CDN_URL);

const page = new Page(document.body, events);
const modal = new Modal(ensureElement<HTMLElement>("#modal-container"), events);
const catalogView = new Catalog(ensureElement<HTMLElement>(".gallery"));
const basketView = new Basket(cloneTemplate("#basket"), events);
const orderForm = new OrderForm(cloneTemplate("#order"), events);
const contactsForm = new ContactsForm(cloneTemplate("#contacts"), events);
const successView = new Success(cloneTemplate("#success"), events);

const renderCatalog = (items: IProduct[]) => {
  const cards = items.map((item) => {
    const card = new CatalogCard(cloneTemplate("#card-catalog"), events);
    return card.render(item);
  });
  catalogView.render({ items: cards });
};

const renderBasket = () => {
  const items = basketModel.getBasket();
  const cards = items.map((item, index) => {
    const card = new BasketCard(cloneTemplate("#card-basket"), events);
    return card.render({ ...item, index: index + 1 });
  });
  basketView.render({
    items: cards,
    total: basketModel.priceBasket(),
    isEmpty: items.length === 0,
  });
  page.render({ counter: basketModel.countBasket() });
};

const updateOrderForm = () => {
  const buyer = buyerModel.getBuyer();
  const errors = buyerModel.validateBuyer();
  const orderErrors = [errors.payment, errors.address]
    .filter(Boolean)
    .join(" ");
  orderForm.render({
    payment: buyer.payment,
    address: buyer.address,
    valid: !errors.payment && !errors.address,
    errors: orderErrors,
  });
};

const updateContactsForm = () => {
  const buyer = buyerModel.getBuyer();
  const errors = buyerModel.validateBuyer();
  const contactErrors = [errors.email, errors.phone].filter(Boolean).join(" ");
  contactsForm.render({
    email: buyer.email,
    phone: buyer.phone,
    valid: !errors.email && !errors.phone,
    errors: contactErrors,
  });
};

const openPreview = () => {
  const item = catalogModel.getCurrent();
  const inBasket = basketModel.isInBasket(item);
  const card = new PreviewCard(cloneTemplate("#card-preview"), events);
  modal.render({
    content: card.render({
      ...item,
      inBasket,
      buttonText: inBasket ? "Удалить из корзины" : "В корзину",
    }),
  });
  modal.open();
};

const openBasket = () => {
  renderBasket();
  modal.render({ content: basketView.render() });
  modal.open();
};

const openOrder = () => {
  updateOrderForm();
  modal.render({ content: orderForm.render() });
  modal.open();
};

const openContacts = () => {
  updateContactsForm();
  modal.render({ content: contactsForm.render() });
  modal.open();
};

const openSuccess = (total: number) => {
  modal.render({ content: successView.render({ total }) });
  modal.open();
};

const placeOrder = () => {
  const order: IOrder = {
    ...buyerModel.getBuyer(),
    id: basketModel.getBasket().map((item) => item.id),
    total: basketModel.priceBasket(),
  };
  api
    .postOrder(order)
    .then((result) => {
      basketModel.clearBasket();
      buyerModel.clearBuyer();
      openSuccess(result.total);
    })
    .catch((error) => console.error(error));
};

events.on("catalog:changed", () => {
  renderCatalog(catalogModel.getItems());
});

events.on("product:selected", () => {
  openPreview();
});

events.on("basket:changed", () => {
  renderBasket();
});

events.on("buyer:changed", () => {
  updateOrderForm();
  updateContactsForm();
});

events.on<{ id: string }>("card:select", ({ id }) => {
  const item = catalogModel.getProduct(id);
  catalogModel.setCurrent(item);
});

events.on<{ id: string }>("card:buy", ({ id }) => {
  const item = catalogModel.getProduct(id);
  if (!basketModel.isInBasket(item)) {
    basketModel.addToBasket(item);
  }
  modal.close();
});

events.on<{ id: string }>("card:remove", ({ id }) => {
  const item = catalogModel.getProduct(id);
  basketModel.removeFromBasket(item);
  modal.close();
});

events.on("basket:open", () => {
  openBasket();
});

events.on<{ id: string }>("basket:remove", ({ id }) => {
  const item = catalogModel.getProduct(id);
  basketModel.removeFromBasket(item);
});

events.on("basket:checkout", () => {
  openOrder();
});

events.on<{ field: string; value: string }>("order:change", ({ field, value }) => {
  if (field === "payment") {
    buyerModel.setPayment(value as IOrder["payment"]);
  }
  if (field === "address") {
    buyerModel.setAddress(value);
  }
});

events.on("order:submit", () => {
  openContacts();
});

events.on<{ field: string; value: string }>(
  "contacts:change",
  ({ field, value }) => {
    if (field === "email") {
      buyerModel.setEmail(value);
    }
    if (field === "phone") {
      buyerModel.setPhone(value);
    }
  }
);

events.on("contacts:submit", () => {
  placeOrder();
});

events.on("success:close", () => {
  modal.close();
});

events.on("modal:close", () => {
  // placeholder for additional modal cleanup
});

api
  .getCatalog()
  .then((items) => {
    catalogModel.loadItems(items);
  })
  .catch((error) => console.error(error));
