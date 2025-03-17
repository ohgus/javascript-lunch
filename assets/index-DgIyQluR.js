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
const Modal = () => {
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
const TabButton = (props) => {
  const { name, isActive } = props;
  const className = isActive ? "tab-button active-tab" : "tab-button";
  const tabButton = document.createElement("button");
  Object.assign(tabButton, {
    className,
    ariaLabel: name,
    textContent: name
  });
  return tabButton;
};
const NoRestaurant = () => {
  return (
    /*html*/
    `
    <div class="no-restaurant">
      <p class="no-restaurant-icon">🥘</p>
      <p>등록된 음식점이 없습니다.</p>
      <p>음식점을 등록해주세요.</p>
    </div>
  `
  );
};
const restaurantStorage = {
  getRestaurantList: () => {
    const restaurantList = window.localStorage.getItem("restaurantList");
    return restaurantList ? JSON.parse(restaurantList) : [];
  },
  setRestaurantList: (restaurantList) => {
    window.localStorage.setItem(
      "restaurantList",
      JSON.stringify(restaurantList)
    );
  }
};
const querySelector = (selector) => {
  return document.querySelector(selector);
};
const restaurantData = [
  {
    category: "한식",
    name: "피양콩할마니",
    dist: "10",
    description: "평양 출신의 할머니가 수십 년간 운영해온 비지 전문점 피양콩 할마니. 두부를 빼지 않은 되비지를 맛볼 수 있는 곳으로, ‘피양’은 평안도 사투리로 ‘평양’을 의미한다. 딸과 함께 운영하는 이곳에선 맷돌로 직접 간 콩만을 사용하며, 일체의 조미료를 넣지 않은 건강식을 선보인다. 콩비지와 피양 만두가 이곳의 대표 메뉴지만, 할머니가 옛날 방식을 고수하며 만들어내는 비지전골 또한 이 집의 역사를 느낄 수 있는 특별한 메뉴다. 반찬은 손님들이 먹고 싶은 만큼 덜어 먹을 수 있게 준비돼 있다.",
    link: "#",
    isFavorite: false
  },
  {
    category: "중식",
    name: "친친",
    dist: "5",
    description: "Since 2004 편리한 교통과 주차, 그리고 관록만큼 깊은 맛과 정성으로 정통 중식의 세계를 펼쳐갑니다",
    link: "#",
    isFavorite: true
  },
  {
    category: "양식",
    name: "이태리키친",
    dist: "20",
    description: "늘 변화를 추구하는 이태리키친입니다.",
    link: "#",
    isFavorite: false
  },
  {
    category: "아시안",
    name: "호아빈 삼성점",
    dist: "15",
    description: "푸짐한 양에 국물이 일품인 쌀국수",
    link: "#",
    isFavorite: false
  },
  {
    category: "기타",
    name: "도스타코스 선릉점",
    dist: "5",
    description: "멕시칸 캐주얼 그릴",
    link: "#",
    isFavorite: true
  }
];
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
  },
  delete: {
    name: "삭제하기",
    type: "button",
    class: "button--secondary",
    id: "delete-button"
  },
  close: {
    name: "닫기",
    type: "button",
    class: "button--primary",
    id: "close-button"
  }
};
const FormContent = ({ title }) => {
  return `
    <h2 class="modal-title text-title">${title}</h2>
    <form class="modal-form"></form>
  `;
};
const RESTAURANT_ADD_FORM_INPUT_TITLE = {
  CATEGORY: "카테고리",
  DISTANCE: "거리 (도보 이동 시간)",
  NAME: "이름",
  DESCRIPTION: "설명",
  LINK: "참고 링크"
};
const getOptionValue = (name, option) => {
  if (name === "distance") {
    return `${option}분 내`;
  }
  return option;
};
const OptionInput = (name, options) => {
  const formItem = document.createElement("div");
  formItem.classList.add("form-item");
  formItem.classList.add("form-item--required");
  formItem.innerHTML = `
    <label for=${name} class="text-caption">${RESTAURANT_ADD_FORM_INPUT_TITLE[name.toUpperCase()]}</label>
    <select name=${name} id=${name}>
      <option value="">선택해 주세요</option>
    ${options.map(
    (option) => `<option value="${option}">${getOptionValue(name, option)}</option>`
  ).join("")}
    </select>
  `;
  return formItem;
};
const TextArea = (name, helpText, colRow = { col: 30, row: 5 }) => {
  const formItem = document.createElement("div");
  formItem.classList.add("form-item");
  formItem.innerHTML = `
    <label for=${name} class="text-caption">${RESTAURANT_ADD_FORM_INPUT_TITLE[name.toUpperCase()]}</label>
    <textarea
      name=${name}
      id=${name}
      cols=${colRow.col}
      rows=${colRow.row}
    ></textarea>
    <span class="help-text text-caption"
      >${helpText}</span
    >
  `;
  return formItem;
};
const TextInput = (name, isRequired, helpText) => {
  const formItem = document.createElement("div");
  formItem.classList.add("form-item");
  if (isRequired) formItem.classList.add("form-item--required");
  formItem.innerHTML = `
    <label for=${name} class="text-caption">${RESTAURANT_ADD_FORM_INPUT_TITLE[name.toUpperCase()]}</label>
    <input type="text" name=${name} id=${name} />
  `;
  if (helpText) {
    const span = document.createElement("span");
    span.classList.add("help-text");
    span.classList.add("text-caption");
    span.innerText = helpText;
    formItem.appendChild(span);
  }
  return formItem;
};
const getStarIconSrc = (isFavorite) => {
  return isFavorite ? "/public/favorite-icon-filled.png" : "/public/favorite-icon-lined.png";
};
const StarIcon = (isFavorite) => {
  const iconSrc = getStarIconSrc(isFavorite);
  return (
    /*html*/
    `
    <button class="star-icon-container">
      <img src="${iconSrc}" alt="star" class="star-icon" />
    </button>
  `
  );
};
const IMG_SRC = {
  한식: "./category-korean.png",
  중식: "./category-chinese.png",
  일식: "./category-japanese.png",
  양식: "./category-western.png",
  아시안: "./category-asian.png",
  기타: "./category-etc.png"
};
const getImgSrc = (category) => {
  return IMG_SRC[category];
};
const CategoryIcon = (category) => {
  const imgSrc = getImgSrc(category);
  return (
    /*html*/
    `
    <div class="restaurant__category">
      <img src="${imgSrc}" alt=${category} class="category-icon" />
    </div>
  `
  );
};
const RestaurantName = (restaurantName) => {
  return (
    /*html*/
    `
    <h3 class="restaurant__name text-subtitle">${restaurantName}</h3>
  `
  );
};
const RestaurantDistance = (distance) => {
  return (
    /*html*/
    `
    <span class="restaurant__distance text-body">캠퍼스부터 ${distance}분 내</span>
  `
  );
};
const RestaurantDescription = (description, isDetail = false) => {
  const descriptionClass = isDetail ? "restaurant__description_detail" : "restaurant__description";
  return (
    /*html*/
    `
    <p class="text-body ${descriptionClass}">
      ${description}
    </p>
  `
  );
};
const RestaurantLink = (link) => {
  return (
    /*html*/
    `
    <a href="${link}" class="restaurant__link">${link}</a>
  `
  );
};
const RestaurantDetail = (restaurantProps) => {
  return (
    /*html*/
    `
    <div class="restaurant__info_header">
      ${CategoryIcon(restaurantProps.category)}
      ${StarIcon(restaurantProps.isFavorite)}
    </div>
    <div class="restaurant__info restaurant__info_detail">
      ${RestaurantName(restaurantProps.name)}
      ${RestaurantDistance(restaurantProps.dist)}      
      ${RestaurantDescription(restaurantProps.description, true)}
      ${RestaurantLink(restaurantProps.link)}
    </div>
  `
  );
};
const RESTAURANT_ADD_FORM_HELP_TEXT = {
  DESCRIPTION: "메뉴 등 추가 정보를 입력해 주세요.",
  LINK: "매장 정보를 확인할 수 있는 링크를 입력해 주세요."
};
const RESTAURANT_ADD_FORM_SELECT_OPTIONS = {
  CATEGORY: ["한식", "중식", "일식", "양식", "아시안", "기타"],
  DISTANCE: ["5", "10", "15", "20", "25", "30"]
};
const errorMessage = {
  EMPTY_SELECTOR: "필수 입력란입니다.",
  NAME_LENGTH: "이름은 최소 1자 이상 최대 20자까지 가능합니다.",
  DESC_LENGTH: "설명은 최대 300자까지 가능합니다.",
  LINK_FORM: "참고 링크 형식에 맞게 입력해주세요."
};
const RESTAURANT_ADD_FORM_INPUT_RULES = {
  MAX_NAME_LENGTH: 20,
  MIN_NAME_LENGTH: 1,
  MAX_DESC_LENGTH: 300,
  LINK_REGEX: /^(https?:\/\/)?www\.[a-zA-Z0-9-]+\.[a-zA-Z]{2,}$/
};
const validate = {
  emptySelector: (value) => {
    if (value === "") throw new Error(errorMessage.EMPTY_SELECTOR);
  },
  nameLength: (name) => {
    if (name.length > RESTAURANT_ADD_FORM_INPUT_RULES.MAX_NAME_LENGTH || name.length < RESTAURANT_ADD_FORM_INPUT_RULES.MIN_NAME_LENGTH)
      throw new Error(errorMessage.NAME_LENGTH);
  },
  descLength: (desc) => {
    if (desc.length > RESTAURANT_ADD_FORM_INPUT_RULES.MAX_DESC_LENGTH)
      throw new Error(errorMessage.DESC_LENGTH);
  },
  linkForm: (link) => {
    if (link.length !== 0 && !RESTAURANT_ADD_FORM_INPUT_RULES.LINK_REGEX.test(link))
      throw new Error(errorMessage.LINK_FORM);
  }
};
const Restaurant = (restaurantProps) => {
  return (
    /*html*/
    ` 
    ${CategoryIcon(restaurantProps.category)}
    <div class="restaurant__info">
      <div class="restaurant__info_header">
        <div>
          ${RestaurantName(restaurantProps.name)}
          ${RestaurantDistance(restaurantProps.dist)}
        </div>
        ${StarIcon(restaurantProps.isFavorite)}
      </div>
      ${RestaurantDescription(restaurantProps.description)}
    </div>
  `
  );
};
const restaurantHandler = {
  addRestaurantItem: (restaurantProps) => {
    const listItem = document.createElement("li");
    listItem.classList.add("restaurant");
    const restaurant = Restaurant(restaurantProps);
    listItem.innerHTML = restaurant;
    listItem.addEventListener(
      "click",
      () => modalHandler.addRestaurantDetail(restaurantProps)
    );
    restaurantHandler.addFavoriteEvent(listItem, restaurantProps.name);
    querySelector(".restaurant-list").appendChild(listItem);
  },
  uploadRestaurant: (restaurantList, e, isFavoriteTabActive = false) => {
    const newRestaurant = restaurantHandler.createRestaurantData(e);
    try {
      e.preventDefault();
      validate.emptySelector(newRestaurant.category);
      validate.nameLength(newRestaurant.name);
      validate.emptySelector(newRestaurant.dist);
      validate.descLength(newRestaurant.description);
      validate.linkForm(newRestaurant.link);
      restaurantList.push(newRestaurant);
      restaurantStorage.setRestaurantList(restaurantList);
      const categoryFilter = document.querySelector(
        "#category-filter"
      );
      const currentCategory = categoryFilter ? categoryFilter.value : "all";
      if (!isFavoriteTabActive && (currentCategory === "all" || newRestaurant.category === currentCategory)) {
        restaurantHandler.addRestaurantItem(newRestaurant);
      }
      modalHandler.closeModal();
    } catch (error) {
      restaurantHandler.checkRequired(
        "category",
        newRestaurant.category,
        error
      );
      restaurantHandler.checkRequired(
        "name",
        newRestaurant.name,
        error
      );
      restaurantHandler.checkRequired(
        "distance",
        newRestaurant.dist,
        error
      );
    }
  },
  checkRequired: (input, value, error) => {
    if (value === "") {
      const requiredInput = querySelector(`#${input}`);
      modalHandler.addErrorText(requiredInput, error);
    }
  },
  createRestaurantData: (e) => {
    const formData = new FormData(e.target);
    return {
      category: formData.get("category"),
      name: formData.get("name"),
      dist: formData.get("distance"),
      description: formData.get("description"),
      link: formData.get("link"),
      isFavorite: false
    };
  },
  removeRestaurant: (name) => {
    const restaurantList = restaurantStorage.getRestaurantList();
    restaurantStorage.setRestaurantList(
      restaurantList.filter(
        (restaurant) => restaurant.name !== name
      )
    );
    document.querySelectorAll(".restaurant").forEach((restaurantElement) => {
      const restaurantNameElement = restaurantElement.querySelector(".restaurant__name");
      if ((restaurantNameElement == null ? void 0 : restaurantNameElement.textContent) === name) {
        restaurantElement.remove();
      }
    });
  },
  findRestaurantByName: (name) => {
    const restaurantList = restaurantStorage.getRestaurantList();
    return restaurantList.find(
      (restaurant) => restaurant.name === name
    );
  },
  updateFavoriteState: (name) => {
    const restaurantList = restaurantStorage.getRestaurantList();
    const restaurant = restaurantList.find(
      (restaurant2) => restaurant2.name === name
    );
    if (!restaurant) return false;
    restaurant.isFavorite = !restaurant.isFavorite;
    restaurantStorage.setRestaurantList(restaurantList);
    return restaurant.isFavorite;
  },
  updateStarIconUI: (name, isFavorite) => {
    document.querySelectorAll(".restaurant").forEach((restaurantItem) => {
      const restaurantNameElement = restaurantItem.querySelector(".restaurant__name");
      if ((restaurantNameElement == null ? void 0 : restaurantNameElement.textContent) === name) {
        const starIcon = restaurantItem.querySelector(
          ".star-icon-container img"
        );
        starIcon.src = getStarIconSrc(isFavorite);
      }
    });
  },
  toggleFavorite: (name) => {
    const isFavorite = restaurantHandler.updateFavoriteState(name);
    restaurantHandler.updateStarIconUI(name, isFavorite);
  },
  applyFavoriteChange: (name, isFavorite) => {
    const restaurantList = restaurantStorage.getRestaurantList();
    const restaurant = restaurantList.find(
      (restaurant2) => restaurant2.name === name
    );
    if (restaurant) {
      restaurant.isFavorite = isFavorite;
      restaurantStorage.setRestaurantList(restaurantList);
      restaurantHandler.updateStarIconUI(name, isFavorite);
    }
  },
  addFavoriteEvent: (listItem, name) => {
    var _a;
    (_a = listItem.querySelector(".star-icon-container")) == null ? void 0 : _a.addEventListener("click", (e) => {
      e.stopPropagation();
      restaurantHandler.toggleFavorite(name);
    });
  }
};
const modalHandler = {
  tempFavoriteState: null,
  openModal: () => {
    const modal = querySelector(".modal");
    modal.classList.add("modal--open");
    document.body.classList.add("pause-scroll");
  },
  closeModal: () => {
    const modal = querySelector(".modal");
    const modalContainer = querySelector(".modal-container");
    modal.classList.toggle("modal--open");
    if (modalHandler.tempFavoriteState) {
      restaurantHandler.applyFavoriteChange(
        modalHandler.tempFavoriteState.name,
        modalHandler.tempFavoriteState.isFavorite
      );
      modalHandler.tempFavoriteState = null;
    }
    while (modalContainer.firstChild) {
      modalContainer.removeChild(modalContainer.firstChild);
    }
    document.body.classList.remove("pause-scroll");
  },
  addRestaurantDetail: (restaurantDetail) => {
    var _a;
    const modalContainer = querySelector(".modal-container");
    const restaurantDetailItem = document.createElement("li");
    restaurantDetailItem.classList.add("restaurant", "restaurant__detail");
    restaurantDetailItem.innerHTML = RestaurantDetail(restaurantDetail);
    restaurantDetailItem.appendChild(
      modalHandler.addButtons("delete", "close")
    );
    if (modalContainer.children.length === 0) {
      modalContainer.appendChild(restaurantDetailItem);
      modalHandler.openModal();
    }
    querySelector("#delete-button").addEventListener("click", () => {
      restaurantHandler.removeRestaurant(restaurantDetail.name);
      modalHandler.tempFavoriteState = null;
      modalHandler.closeModal();
    });
    querySelector("#close-button").addEventListener("click", () => {
      modalHandler.closeModal();
    });
    (_a = modalContainer.querySelector(".star-icon-container")) == null ? void 0 : _a.addEventListener("click", (e) => {
      e.stopPropagation();
      const isFavorite = modalHandler.tempFavoriteState ? !modalHandler.tempFavoriteState.isFavorite : !restaurantDetail.isFavorite;
      modalHandler.tempFavoriteState = {
        name: restaurantDetail.name,
        isFavorite
      };
      const starIcon = modalContainer.querySelector(
        ".star-icon-container img"
      );
      if (starIcon) {
        starIcon.src = getStarIconSrc(isFavorite);
      }
    });
  },
  addForm: () => {
    const modalContainer = querySelector(".modal-container");
    modalContainer.innerHTML = FormContent({ title: "새로운 음식점" });
    const modalForm = querySelector(".modal-form");
    modalForm.appendChild(
      OptionInput("category", RESTAURANT_ADD_FORM_SELECT_OPTIONS.CATEGORY)
    );
    modalForm.appendChild(TextInput("name", true));
    modalForm.appendChild(
      OptionInput("distance", RESTAURANT_ADD_FORM_SELECT_OPTIONS.DISTANCE)
    );
    modalForm.appendChild(
      TextArea("description", RESTAURANT_ADD_FORM_HELP_TEXT.DESCRIPTION)
    );
    modalForm.appendChild(
      TextInput("link", false, RESTAURANT_ADD_FORM_HELP_TEXT.LINK)
    );
    modalForm.appendChild(modalHandler.addButtons("cancel", "add"));
    modalHandler.addFormCheck();
    querySelector("#cancel-button").addEventListener(
      "click",
      modalHandler.closeModal
    );
  },
  addButtons: (type1, type2) => {
    const buttonContainer = document.createElement("div");
    buttonContainer.classList.add("button-container");
    buttonContainer.appendChild(Button(type1));
    buttonContainer.appendChild(Button(type2));
    return buttonContainer;
  },
  addFormCheck: () => {
    const nameInput = querySelector("#name");
    const descInput = querySelector("#description");
    const linkInput = querySelector("#link");
    const categorySelect = querySelector("#category");
    const distSelect = querySelector("#distance");
    modalHandler.checkInput(nameInput, validate.nameLength);
    modalHandler.checkInput(descInput, validate.descLength);
    modalHandler.checkInput(linkInput, validate.linkForm);
    modalHandler.checkInput(categorySelect, validate.emptySelector, "change");
    modalHandler.checkInput(distSelect, validate.emptySelector, "change");
  },
  checkInput: (input, validate2, type = "input") => {
    const addButton = querySelector("#add-button");
    input.addEventListener(type, (e) => {
      try {
        validate2(e.target.value);
        modalHandler.removeErrorText(input);
        addButton.classList.remove("disabled-button");
        addButton.disabled = false;
      } catch (error) {
        modalHandler.addErrorText(input, error);
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
      parentNode == null ? void 0 : parentNode.appendChild(errorText);
    }
  },
  removeErrorText: (input) => {
    var _a, _b;
    const errorText = (_a = input.parentNode) == null ? void 0 : _a.querySelector(".error-text");
    if (errorText) {
      input.classList.remove("form-item--error");
      (_b = input.parentNode) == null ? void 0 : _b.removeChild(errorText);
    }
  }
};
const filterAndSortHandler = {
  filterByCategory: (restaurantList, category) => {
    if (category === "전체") {
      return restaurantList;
    }
    return restaurantList.filter(
      (restaurant) => restaurant.category === category
    );
  },
  sortByOption: (restaurantList, sortOption) => {
    if (sortOption === "name") {
      return restaurantList.sort((a, b) => a.name.localeCompare(b.name));
    }
    return restaurantList.sort((a, b) => Number(a.dist) - Number(b.dist));
  }
};
addEventListener("load", () => {
  if (restaurantStorage.getRestaurantList().length === 0) {
    restaurantStorage.setRestaurantList(restaurantData);
  }
  let isFavoriteTabActive = false;
  const categoryFilter = querySelector("#category-filter");
  const sortingFilter = querySelector("#sorting-filter");
  const allTabButton = TabButton({ name: "모든 음식점", isActive: true });
  const favoriteTabButton = TabButton({
    name: "자주 가는 음식점",
    isActive: false
  });
  querySelector(".restaurant-tab-container").append(
    allTabButton,
    favoriteTabButton
  );
  const toggleTabs = (tab) => {
    document.querySelectorAll(".tab-button").forEach((button) => {
      button.classList.remove("active-tab");
    });
    isFavoriteTabActive = tab === favoriteTabButton;
    tab.classList.add("active-tab");
    querySelector(".restaurant-list").innerHTML = "";
    renderRestaurantList(
      getCurrentList(),
      categoryFilter.value,
      sortingFilter.value
    );
  };
  const getFavoriteRestaurantList = () => {
    return restaurantStorage.getRestaurantList().filter((restaurant) => restaurant.isFavorite);
  };
  const getCurrentList = () => {
    return isFavoriteTabActive ? getFavoriteRestaurantList() : restaurantStorage.getRestaurantList();
  };
  const renderRestaurantList = (restaurants, category, sortOption) => {
    const filteredList = filterAndSortHandler.filterByCategory(
      restaurants,
      category
    );
    const sortedList = filterAndSortHandler.sortByOption(
      filteredList,
      sortOption
    );
    if (sortedList.length === 0) {
      querySelector(".restaurant-list").innerHTML = NoRestaurant();
      return;
    }
    sortedList.forEach((restaurant) => {
      restaurantHandler.addRestaurantItem(restaurant);
    });
  };
  renderRestaurantList(
    restaurantStorage.getRestaurantList(),
    categoryFilter.value,
    sortingFilter.value
  );
  querySelector(".restaurant-filter-container").addEventListener(
    "change",
    (e) => {
      if (e.target instanceof HTMLSelectElement) {
        const categoryFilter2 = querySelector("#category-filter");
        const sortingFilter2 = querySelector("#sorting-filter");
        updateRestaurantList(
          getCurrentList(),
          categoryFilter2.value,
          sortingFilter2.value
        );
      }
    }
  );
  const updateRestaurantList = (restaurants, category, sortOption) => {
    const restaurantListElement = querySelector(
      ".restaurant-list"
    );
    restaurantListElement.innerHTML = "";
    renderRestaurantList(restaurants, category, sortOption);
  };
  const modal = Modal();
  querySelector("main").appendChild(modal);
  querySelector(".gnb__button").addEventListener("click", () => {
    modalHandler.openModal();
    modalHandler.addForm();
    querySelector(".modal-form").addEventListener("submit", (e) => {
      const currentCategory = categoryFilter.value;
      const currentSortOption = sortingFilter.value;
      restaurantHandler.uploadRestaurant(
        restaurantStorage.getRestaurantList(),
        e,
        isFavoriteTabActive
      );
      if (!isFavoriteTabActive) {
        updateRestaurantList(
          getCurrentList(),
          currentCategory,
          currentSortOption
        );
      }
    });
  });
  querySelector(".modal-backdrop").addEventListener(
    "click",
    modalHandler.closeModal
  );
  allTabButton.addEventListener("click", () => toggleTabs(allTabButton));
  favoriteTabButton.addEventListener(
    "click",
    () => toggleTabs(favoriteTabButton)
  );
});
