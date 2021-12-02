export default class SortableTable {

  element;
  subElements = {};
  orderNow;

  constructor(headersConfig, {
    data = [],
    sorted = {},
    isSortLocally = true
  } = {}) {
    this.data = data;
    this.sorted = sorted;
    this.isSortLocally = isSortLocally;
    this.headerConfig = headersConfig;

    this.render();

    this.sort(sorted.id, sorted.order);

    this.initEvents();
  }

  getTable() {
    return `
      <div data-element="productsContainer" class="products-list__container">
        <div class="sortable-table">
          ${this.getTableHeader()}
          ${this.getTableBody()}
        </div>
      </div>   
    `
  }

  getTableHeader() {
    return `<div data-element="header" class="sortable-table__header sortable-table__row">
      ${this.headerConfig.map(item => this.getHeaderRow(item)).join('')}
    </div>`;
  }

  getHeaderRow(item) {
    return `
      <div class="sortable-table__cell" data-id="${item.id}" data-sortable="${item.sortable}" data-order="${this.sorted.order}">
        <span>${item.title}</span> 
        ${this.sorted.id === item.id ? this.arrowTemplate : ''}
      </div>
    `;
  }

  getTableBody() {
    return `
  <div data-element="body" class="sortable-table__body">
    ${this.getTableRows(this.data)};
  </div>`

  }

  getTableRows(data) {
    return data.map(item => {
      return `
  <a href="/products/3d-ochki-epson-elpgs03" class="sortable-table__row">
    ${this.getTableRow(item)}
  </a>
`})
      .join('');
  }

  getTableRow(item) {
    const cells = this.headerConfig.map(({ id, template }) => {
      return {
        id,
        template
      }
    })

    return cells.map(({ id, template }) => {
      return template
        ? template(item[id])
        : ` <div class="sortable-table__cell">${item[id]}</div>`
    }).join('');
  }

  render() {
    const el = document.createElement('div');
    el.innerHTML = this.getTable();
    const element = el.firstElementChild;
    this.element = element;

    this.subElements = this.getSubElements(element);

  }

  getSubElements(element) {
    const result = {};
    const elements = element.querySelectorAll('[data-element]');

    for (const subElement of elements) {
      const name = subElement.dataset.element;

      result[name] = subElement;
    }

    return result;

  }

  get arrowTemplate() {
    return `
            <span data-element="arrow" class="sortable-table__sort-arrow">
                <span class="sort-arrow"></span>
            </span>
        `;
  }

  sort(field, order) {
    this.orderNow = order;

    const sortedData = this.sortData(field, order);
    const arrowEl = this.element.querySelector('.sortable-table__sort-arrow');
    this.currentColumn = this.element.querySelector(`.sortable-table__cell[data-id="${field}"]`);

    this.currentColumn.dataset.order = order;


    this.subElements.body.innerHTML = this.getTableRows(sortedData);
  }

  sortData(field, order) {
    const arr = [...this.data];
    const column = this.headerConfig.find(item => item.id === field);
    const { sortType } = column;
    const directions = {
      asc: 1,
      desc: -1
    };
    const direction = directions[order];

    return arr.sort((a, b) => {
      switch (sortType) {
        case 'number':
          return direction * (a[field] - b[field]);
        case 'string':
          return direction * a[field].localeCompare(b[field], ['ru', 'en']);
        default:
          return direction * (a[field] - b[field]);
      }
    });
  }

  _onClick(event) {

    const el = event.target.closest('.sortable-table__cell');

    if (el) {
      if (!el.closest('.sortable-table__header')) {
        return;
      }
    }

    const { id, order, sortable } = el.dataset;


    if (sortable !== "false") {
      this.orderNow = this.orderNow === "asc" ? "desc" : "asc";
    }

    const sortedData = this.sortData(id, this.orderNow);
    const arrowEl = el.querySelector('.sortable-table__sort-arrow');
    el.dataset.order = this.orderNow;
    if (!arrowEl) {
      el.append(this.subElements.arrow);
    }
    
    this.subElements.body.innerHTML = this.getTableRows(sortedData);
  }

  initEvents() {
    document.addEventListener("pointerdown", this._onClick.bind(this));
  }

  update(data) {
    this.data = data;
    this.subElements.body.innerHTML = this.getColumnBody(data);
  }


  remove() {
    if (this.element) {
      this.element.remove();
    }
  }

  destroy() {
    document.removeEventListener('pointerdown', this._onClick);
    this.remove();
    this.element = null;
  }


}





