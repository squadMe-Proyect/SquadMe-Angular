import { Directive, ElementRef, HostListener, Renderer2 } from '@angular/core';

/**
 * Directiva para resaltar un elemento cuando el cursor del mouse entra y eliminar el resaltado cuando sale.
 */
@Directive({
  selector: '[appHighlight]' // Selector de la directiva
})
export class HighlightDirective {

  constructor(
    private renderer: Renderer2,
    private el: ElementRef
  ) {
    this.unsetHighlight(); // Al inicializar la directiva, eliminamos cualquier resaltado existente
  }

  /**
   * Escucha el evento 'mouseenter' en el elemento anfitrión.
   * Cuando el cursor del mouse entra en el elemento, establece el resaltado.
   */
  @HostListener('mouseenter')
  onMouseEnter() {
    this.setHighlight();
  }

  /**
   * Escucha el evento 'mouseleave' en el elemento anfitrión.
   * Cuando el cursor del mouse sale del elemento, elimina el resaltado.
   */
  @HostListener('mouseleave')
  onMouseLeave() {
    this.unsetHighlight();
  }

  /**
   * Método privado para establecer el resaltado añadiendo una clase CSS al elemento.
   */
  private setHighlight() {
    this.renderer.addClass(this.el.nativeElement, 'highlight');
  }

  /**
   * Método privado para eliminar el resaltado eliminando la clase CSS del elemento.
   */
  private unsetHighlight() {
    this.renderer.removeClass(this.el.nativeElement, 'highlight');
  }
}