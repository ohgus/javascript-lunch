var __typeError = (msg) => {
  throw TypeError(msg);
};
var __accessCheck = (obj, member, msg) => member.has(obj) || __typeError("Cannot " + msg);
var __privateGet = (obj, member, getter) => (__accessCheck(obj, member, "read from private field"), getter ? getter.call(obj) : member.get(obj));
var __privateAdd = (obj, member, value) => member.has(obj) ? __typeError("Cannot add the same private member more than once") : member instanceof WeakSet ? member.add(obj) : member.set(obj, value);
var __privateSet = (obj, member, value, setter) => (__accessCheck(obj, member, "write to private field"), setter ? setter.call(obj, value) : member.set(obj, value), value);
var _list;
(function polyfill() {
  const relList = document.createElement("link").relList;
  if (relList && relList.supports && relList.supports("modulepreload")) {
    return;
  }
  for (const link of document.querySelectorAll('link[rel="modulepreload"]')) {
    processPreload(link);
  }
  new MutationObserver((mutations) => {
    for (const mutation of mutations) {
      if (mutation.type !== "childList") {
        continue;
      }
      for (const node of mutation.addedNodes) {
        if (node.tagName === "LINK" && node.rel === "modulepreload")
          processPreload(node);
      }
    }
  }).observe(document, { childList: true, subtree: true });
  function getFetchOpts(link) {
    const fetchOpts = {};
    if (link.integrity) fetchOpts.integrity = link.integrity;
    if (link.referrerPolicy) fetchOpts.referrerPolicy = link.referrerPolicy;
    if (link.crossOrigin === "use-credentials")
      fetchOpts.credentials = "include";
    else if (link.crossOrigin === "anonymous") fetchOpts.credentials = "omit";
    else fetchOpts.credentials = "same-origin";
    return fetchOpts;
  }
  function processPreload(link) {
    if (link.ep)
      return;
    link.ep = true;
    const fetchOpts = getFetchOpts(link);
    fetch(link.href, fetchOpts);
  }
})();
const querySelector = (selector) => {
  return document.querySelector(selector);
};
class StoreList {
  constructor(data) {
    __privateAdd(this, _list);
    __privateSet(this, _list, data);
  }
  get list() {
    return __privateGet(this, _list);
  }
  updateList(store) {
    __privateGet(this, _list).push(store);
  }
}
_list = new WeakMap();
const storeData = [
  {
    category: "한식",
    name: "피양콩할마니",
    dist: "10",
    description: "평양 출신의 할머니가 수십 년간 운영해온 비지 전문점 피양콩 할마니. 두부를 빼지 않은 되비지를 맛볼 수 있는 곳으로, ‘피양’은 평안도 사투리로 ‘평양’을 의미한다. 딸과 함께 운영하는 이곳에선 맷돌로 직접 간 콩만을 사용하며, 일체의 조미료를 넣지 않은 건강식을 선보인다. 콩비지와 피양 만두가 이곳의 대표 메뉴지만, 할머니가 옛날 방식을 고수하며 만들어내는 비지전골 또한 이 집의 역사를 느낄 수 있는 특별한 메뉴다. 반찬은 손님들이 먹고 싶은 만큼 덜어 먹을 수 있게 준비돼 있다.",
    link: "#"
  },
  {
    category: "중식",
    name: "친친",
    dist: "5",
    description: "Since 2004 편리한 교통과 주차, 그리고 관록만큼 깊은 맛과 정성으로 정통 중식의 세계를 펼쳐갑니다",
    link: "#"
  },
  {
    category: "양식",
    name: "이태리키친",
    dist: "20",
    description: "늘 변화를 추구하는 이태리키친입니다.",
    link: "#"
  },
  {
    category: "아시안",
    name: "호아빈 삼성점",
    dist: "15",
    description: "푸짐한 양에 국물이 일품인 쌀국수",
    link: "#"
  },
  {
    category: "기타",
    name: "도스타코스 선릉점",
    dist: "5",
    description: "멕시칸 캐주얼 그릴",
    link: "#"
  }
];
const createModal = () => {
  const modal = document.createElement("div");
  const modalBackdrop = document.createElement("div");
  const modalContainer = document.createElement("div");
  modal.classList.add("modal");
  modalBackdrop.classList.add("modal-backdrop");
  modalContainer.classList.add("modal-container");
  modal.appendChild(modalBackdrop);
  modal.appendChild(modalContainer);
  return modal;
};
const Button = (category) => {
  const button = document.createElement("button");
  button.setAttribute("type", buttonCategory[category].type);
  button.setAttribute("id", buttonCategory[category].id);
  button.classList.add(buttonCategory[category].class);
  button.classList.add("text-caption");
  button.classList.add("button");
  button.textContent = buttonCategory[category].name;
  return button;
};
const buttonCategory = {
  cancel: {
    name: "취소하기",
    type: "button",
    class: "button--secondary",
    id: "cancel-button"
  },
  add: {
    name: "추가하기",
    type: "submit",
    class: "button--primary",
    id: "add-button"
  }
};
const IMG_SRC = {
  한식: "./category-korean.png",
  중식: "./category-chinese.png",
  일식: "./category-japanese.png",
  양식: "./category-western.png",
  아시안: "./category-asian.png",
  기타: "./category-etc.png"
};
const Store = (storeProps) => {
  const imgSrc = getImgSrc(storeProps.category);
  return `
    <div class="restaurant__category">
      <img src="${imgSrc}" alt=${storeProps.category} class="category-icon" />
    </div>
    <div class="restaurant__info">
      <h3 class="restaurant__name text-subtitle">${storeProps.name}</h3>
      <span class="restaurant__distance text-body">캠퍼스부터 ${storeProps.dist}분 내</span>
      <p class="restaurant__description text-body">
        ${storeProps.description}
      </p>
    </div>`;
};
const getImgSrc = (category) => {
  return IMG_SRC[category];
};
const form = {
  MAX_NAME_LENGTH: 20,
  MIN_NAME_LENGTH: 1,
  MAX_DESC_LENGTH: 300,
  LINK_REGEX: /^(https?:\/\/)?www\.[a-zA-Z0-9-]+\.[a-zA-Z]{2,}$/
};
const errorMessage = {
  EMPTY_SELECTOR: "필수 입력란입니다.",
  NAME_LENGTH: "이름은 최소 1자 이상 최대 20자까지 가능합니다.",
  DESC_LENGTH: "설명은 최대 300자까지 가능합니다.",
  LINK_FORM: "참고 링크 형식에 맞게 입력해주세요."
};
const validate = {
  emptySelector: (value) => {
    if (value === "") throw new Error(errorMessage.EMPTY_SELECTOR);
  },
  nameLength: (name) => {
    if (name.length > form.MAX_NAME_LENGTH || name.length < form.MIN_NAME_LENGTH)
      throw new Error(errorMessage.NAME_LENGTH);
  },
  descLength: (desc) => {
    if (desc.length > form.MAX_DESC_LENGTH)
      throw new Error(errorMessage.DESC_LENGTH);
  },
  linkForm: (link) => {
    if (link.length !== 0 && !form.LINK_REGEX.test(link))
      throw new Error(errorMessage.LINK_FORM);
  }
};
const createFormContent = ({ title: title2 }) => {
  return `
    <h2 class="modal-title text-title">${title2}</h2>
    <form class="modal-form"></form>
  `;
};
const title = {
  category: "카테고리",
  distance: "거리 (도보 이동 시간)",
  name: "이름",
  description: "설명",
  link: "참고 링크"
};
const getOptionValue = (name, option) => {
  if (name === "distance") {
    return `${option}분 내`;
  }
  return option;
};
const optionInput = (name, options2) => {
  const formItem = document.createElement("div");
  formItem.classList.add("form-item");
  formItem.classList.add("form-item--required");
  formItem.innerHTML = `
  <label for="category text-caption">${title[name]}</label>
                <select name=${name} id=${name}>
                  <option value="">선택해 주세요</option>
                ${options2.map(
    (option) => `<option value="${option}">${getOptionValue(
      name,
      option
    )}</option>`
  ).join("")}
                </select>
  `;
  return formItem;
};
const options = {
  category: ["한식", "중식", "일식", "양식", "아시안", "기타"],
  distance: ["5", "10", "15", "20", "25", "30"]
};
const textInput = (name, isRequired, helpText2) => {
  const formItem = document.createElement("div");
  formItem.classList.add("form-item");
  if (isRequired) formItem.classList.add("form-item--required");
  formItem.innerHTML = `
                <label for="${name} text-caption">${title[name]}</label>
                <input type="text" name="${name}" id="${name}" />
  `;
  if (helpText2) {
    const span = document.createElement("span");
    span.classList.add("help-text");
    span.classList.add("text-caption");
    span.innerText = helpText2;
    formItem.appendChild(span);
  }
  return formItem;
};
const textArea = (name, helpText2, colRow = { col: 30, row: 5 }) => {
  const formItem = document.createElement("div");
  formItem.classList.add("form-item");
  formItem.innerHTML = `
  <label for="${name} text-caption">${title[name]}</label>
                <textarea
                  name="${name}"
                  id="${name}"
                  cols="${colRow.col}"
                  rows="${colRow.row}"
                ></textarea>
                <span class="help-text text-caption"
                  >${helpText2}</span
                >
  `;
  return formItem;
};
const helpText = {
  description: "메뉴 등 추가 정보를 입력해 주세요.",
  link: "매장 정보를 확인할 수 있는 링크를 입력해 주세요."
};
const modalUtils = {
  closeModal: () => {
    const modal = querySelector(".modal");
    modal.classList.remove("modal--open");
  },
  addForm: () => {
    const modalContainer = querySelector(".modal-container");
    modalContainer.innerHTML = createFormContent({ title: "새로운 음식점" });
    const modalForm = querySelector(".modal-form");
    modalForm.appendChild(optionInput("category", options.category));
    modalForm.appendChild(textInput("name", true));
    modalForm.appendChild(optionInput("distance", options.distance));
    modalForm.appendChild(textArea("description", helpText.description));
    modalForm.appendChild(textInput("link", false, helpText.link));
    modalForm.appendChild(modalUtils.addButtons());
    modalUtils.addFormCheck();
    querySelector("#cancel-button").addEventListener(
      "click",
      modalUtils.closeModal
    );
  },
  addButtons: () => {
    const buttonContainer = document.createElement("div");
    buttonContainer.classList.add("button-container");
    buttonContainer.appendChild(Button("cancel"));
    buttonContainer.appendChild(Button("add"));
    return buttonContainer;
  },
  addFormCheck: () => {
    const nameInput = querySelector("#name");
    const descInput = querySelector("#description");
    const linkInput = querySelector("#link");
    const categorySelect = querySelector("#category");
    const distSelect = querySelector("#distance");
    modalUtils.checkInput(nameInput, validate.nameLength);
    modalUtils.checkInput(descInput, validate.descLength);
    modalUtils.checkInput(linkInput, validate.linkForm);
    modalUtils.checkInput(categorySelect, validate.emptySelector, "change");
    modalUtils.checkInput(distSelect, validate.emptySelector, "change");
  },
  checkInput: (input, validate2, type = "input") => {
    const addButton = querySelector("#add-button");
    input.addEventListener(type, (e) => {
      try {
        validate2(e.target.value);
        modalUtils.removeErrorText(input);
        addButton.classList.remove("disabled-button");
        addButton.disabled = false;
      } catch (e2) {
        modalUtils.addErrorText(input, e2);
        addButton.classList.add("disabled-button");
        addButton.disabled = true;
      }
    });
  },
  addErrorText: (input, e) => {
    if (!input.classList.contains("form-item--error")) {
      input.classList.add("form-item--error");
      const parentNode = input.parentNode;
      const errorText = document.createElement("span");
      errorText.classList.add("error-text");
      errorText.innerText = e.message;
      parentNode.appendChild(errorText);
    }
  },
  removeErrorText: (input) => {
    if (input.parentNode.querySelector(".error-text")) {
      input.classList.remove("form-item--error");
      input.parentNode.removeChild(
        input.parentNode.querySelector(".error-text")
      );
    }
  }
};
const storeUtils = {
  addStore: (storeProps) => {
    const list = document.createElement("li");
    list.classList.add("restaurant");
    const store = Store(storeProps);
    list.innerHTML = store;
    querySelector(".restaurant-list").appendChild(list);
  },
  updateStore: (storeList, e) => {
    const newStore = storeUtils.createStore(e);
    try {
      e.preventDefault();
      validate.emptySelector(newStore.category);
      validate.nameLength(newStore.name);
      validate.emptySelector(newStore.dist);
      validate.descLength(newStore.description);
      validate.linkForm(newStore.link);
      storeList.updateList(newStore);
      storeUtils.addStore(newStore);
      modalUtils.closeModal();
    } catch (error) {
      storeUtils.checkRequired("category", newStore.category, error);
      storeUtils.checkRequired("name", newStore.name, error);
      storeUtils.checkRequired("distance", newStore.dist, error);
    }
  },
  checkRequired: (input, value, error) => {
    if (value === "") {
      const input2 = querySelector(`#${input2}`);
      modalUtils.addErrorText(input2, error);
    }
  },
  createStore: (e) => {
    return {
      category: e.target[0].value,
      name: e.target[1].value,
      dist: e.target[2].value,
      description: e.target[3].value,
      link: e.target[4].value
    };
  }
};
addEventListener("load", () => {
  const storeList = new StoreList(storeData);
  storeList.list.forEach((store) => {
    storeUtils.addStore(store);
  });
  const modal = createModal();
  querySelector("main").appendChild(modal);
  querySelector(".gnb__button").addEventListener("click", () => {
    querySelector(".modal").classList.add("modal--open");
    modalUtils.addForm();
    querySelector(".modal-form").addEventListener(
      "submit",
      (e) => storeUtils.updateStore(storeList, e)
    );
  });
  querySelector(".modal-backdrop").addEventListener(
    "click",
    modalUtils.closeModal
  );
});
