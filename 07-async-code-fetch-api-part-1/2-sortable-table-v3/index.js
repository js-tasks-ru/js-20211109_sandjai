import fetchJson from './utils/fetch-json.js';

const BACKEND_URL = 'https://course-js.javascript.ru';



export default class SortableTable {

  element;
  subElements = {};
  data = [];
  loading = false;
  step = 20;
  strt = 1;
  end = this.start + this.step;

  orderNow;

  constructor(headersConfig = [], {
    url = '',
    sorted = {
      id: headersConfig.find(item => item.sortable).id,
      order: 'asc'
    },
    isSortLocally = false,
    step = 20,
    start = 1,
    end = start + step
  } = {}) {

    this.headersConfig = headersConfig;
    this.url = new URL(url, BACKEND_URL);
    this.sorted = sorted;
    this.isSortLocally = isSortLocally;
    this.step = step;
    this.start = start;
    this.end = end;

    this.render();
    this.update();
    this.initEvents();
  }



  _onWindowScroll = async () => {
    const { bottom } = this.element.getBoundingClientRect();

    const { id, order } = this.sorted;

    if (bottom < document.documentElement.clientHeight && !this.loading && !this.isSortLocally) {
      this.start = this.end;
      this.end = this.start + this.end;

      this.loading = true;

      const data = await this.loadData(id, order, start, end);
      this.update(data);
      this.loading = false;
    }
  }

  sortOnClient(id, order) {


    const sortedData = this.sortData(id, order);

    this.subElements.body.innerHTML = this.getTableRows(sortedData);

    this.orderNow = order;

    const sortedData = this.sortData(id, order);
    const arrowEl = this.element.querySelector('.sortable-table__sort-arrow');
    this.currentColumn = this.element.querySelector(`.sortable-table__cell[data-id="${id}"]`);

    this.currentColumn.dataset.order = order;


    this.subElements.body.innerHTML = this.getTableRows(sortedData);
  }

  async sortOnServer(id, order) {
    const start = 1;
    const end = start + this.step;
    const data = await this.loadData(id, order, start, end);

    this.renderRows(data);
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
      ${this.headersConfig.map(item => this.getHeaderRow(item)).join('')}
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
    const cells = this.headersConfig.map(({ id, template }) => {
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

    const isOrderExist = this.sorted.id === id ? this.sorted.order : '';

    return isOrderExist
      ? `<span data-element="arrow" class="sortable-table__sort-arrow">
          <span class="sort-arrow"></span>
        </span>`
      : '';
  }

  sort(field, order) {
    this.isSortLocally ? this.sortOnClient(field, order) : this.sortOnServer(field, order);
  }

  sortData(field, order) {
    const arr = [...this.data];
    const column = this.headersConfig.find(item => item.id === field);
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


  onSortClick = event => {
    const column = event.target.closest('[data-sortable="true"]');
    const toggleOrder = order => {
      const orders = {
        asc: 'desc',
        desc: 'asc'
      };

      return orders[order];
    };

    if (column) {
      const { id, order } = column.dataset;
      const newOrder = toggleOrder(order);

      this.sorted = {
        id,
        order: newOrder
      };

      column.dataset.order = newOrder;
      column.append(this.subElements.arrow);

      if (this.isSortLocally) {
        this.sortOnClient(id, newOrder);
      } else {
        this.sortOnServer(id, newOrder);
      }
    }
  };

  _onSortClick = event => {

    const el = event.target.closest('[data-sortable="true"]');


    const { id, sortable } = el.dataset;


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
    document.addEventListener("pointerdown", this._onSortClick);
    document.addEventListener("scroll", this._onWindowScroll);
  }


  async update() {
    const dataUrl = new URL(this.url, BACKEND_URL);
    const data = await fetchJson(dataUrl);

    this.data = data;
    this.subElements.body.innerHTML = this.getTableBody(this.data);
  }


  remove() {
    if (this.element) {
      this.element.remove();
    }
  }

  destroy() {
    document.removeEventListener('pointerdown', this._onSortClick);
    this.remove();
    this.element = null;
  }


}





