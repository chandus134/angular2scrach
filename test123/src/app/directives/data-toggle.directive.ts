import { Directive, ElementRef, Renderer, HostListener, HostBinding, Input } from '@angular/core';


@Directive({
  selector: '[datatoggle]'
})
export class DataToggleDirective {
  @Input('datatoggle') config: Object = {
    querySelector: 'dropdown-menu',
    closeOnMouseLeave: false,
    openOnMouseEnter: true
  };

  constructor(
    private el: ElementRef,
    private renderer: Renderer
  ) {
    console.log(this.el)
  }
  @HostListener('click') onClick() {
    this.toggle();
  }

  toggle() {
    let target = this.callMe()
    if (target && target.targetElement && !target.entered) {
      this.renderer.setElementStyle(target.targetElement, 'display', 'block');
      // this.isActive = true;
    }
  }
  @HostListener('mouseleave') onMouseLeave() {
    if (this.config['closeOnMouseLeave'])
      this.callMe()
  }
  @HostListener('mouseenter') onMouseEnter() {
    if (this.config['openOnMouseEnter'])
      this.toggle();
  }

  callMe() {

    if (!this.config) {
      this.config = {
        querySelector: '.dropdown-menu',
        closeOnMouseLeave: false,
        openOnMouseEnter: true
      };
    } else if (!this.config['querySelector']) {
      this.config['querySelector'] = '.dropdown-menu'
    } else if (this.config['closeOnMouseLeave'] == undefined || this.config['closeOnMouseLeave'] == null) {
      this.config['closeOnMouseLeave'] = false
    } else if (this.config['openOnMouseEnter'] == undefined || this.config['openOnMouseEnter'] == null) {
      this.config['openOnMouseEnter'] = false
    }

    console.log(this.el.nativeElement.querySelector('.dropdown-menu'))
    let targetElement = this.el.nativeElement.querySelector(this.config['querySelector']);
    let entered = false;
    console.log(targetElement.style.display)
    if (targetElement && targetElement.style.display === 'block') {
      this.renderer.setElementStyle(targetElement, 'display', 'none');
      entered = true;
    }
    return { targetElement, entered };
  }
}