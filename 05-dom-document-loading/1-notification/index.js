export default class NotificationMessage {

    static isShown = false;  

    constructor(
        message = '', {
        duration = 0,
        type = ''
      } = {}) {

        this.message = message;
        this.duration = duration;
        this.type = type;
        
        this.render();
    }    
    
    get template () {
        return `<div class="notification ${this.type}" style="--value:${this.duration/1000}s">
                    <div class="timer"></div>
                    <div class="inner-wrapper">
                    <div class="notification-header">${this.type}</div>
                    <div class="notification-body">
                        ${this.message}
                    </div>
                    </div>
                </div>`
    }

    render() {
        const el = document.createElement('div');
        el.innerHTML = this.template;
        //this.element = element;
        this.element = el.firstChild;
    }

    show(wrapper = document.createElement('div')) {        
            if (!NotificationMessage.isShown) {
                
                wrapper.append(this.element);
                document.body.append(wrapper);
                NotificationMessage.isShown = true;
                setTimeout(() => {this.destroy()}, `${this.duration}`);
            }
        }

    remove() {
        if (this.element) {
        this.element.remove();
        }
    }

    destroy() {       
        this.remove();
        this.element = null;
        NotificationMessage.isShown = false;     
    }

}
