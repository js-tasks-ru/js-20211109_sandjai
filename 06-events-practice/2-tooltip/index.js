class Tooltip {

    static instance;

    element;
    
    

    constructor () {
        if (Tooltip.instance) {
            return Tooltip.instance;
        }

        Tooltip.instance = this;
    }

    _pointerover = event => {        

        const targetEl = event.target.closest('[data-tooltip]');    
        

        if (targetEl) {
            this.render(targetEl.dataset.tooltip);
            document.addEventListener('pointermove', this._pointermove);
        }

        
    }

    
    _pointerout = () => {
        
        this.remove();
        document.removeEventListener('pointermove', this._pointermove);
    }

    _pointermove = event => {
        this.moveTooltip(event);
    }

    moveTooltip(event) {
        const shift = 10,
            left = event.clientX + shift,
            top = event.clientY + shift;

        this.element.style.left = `${left}px`;
        this.element.style.top = `${top}px`;
    }


    initialize() {
        
         
        this.initEventListeners();

    }


    initEventListeners() {
        document.addEventListener('pointerover', this._pointerover);    
        document.addEventListener('pointerout', this._pointerout);
    }

    update(data) {
        this.data = data;
        this.subElements.body.innerHTML = this.getColumnBody(data);
      }

      render(html) {
        this.element = document.createElement('div')
        this.element.classList.add('tooltip');
        this.element.innerHTML = html;
        
        document.body.append(this.element);

      }
    
    
      remove() {
        if (this.element) {
          this.element.remove();
        }
      }
    
      destroy() {
        document.removeEventListener('pointerover', this._pointerover);    
        document.removeEventListener('pointerout', this._pointerout)
        this.remove();
        this.element = null;
      }
    

}
export default Tooltip;
