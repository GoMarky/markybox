export interface IDOMElement {
  readonly el: HTMLElement;
}

export interface IRendererDisplay {
  setFullScreen(): void;
}

export interface IRendererGutter extends IDOMElement {
}

export interface IRendererBody extends IDOMElement {
  removeLastLetterFromCurrentRow(): void;
}

export interface IAbstractRenderer {
  readonly display: IRendererDisplay;
  readonly gutter: IRendererGutter;
  readonly body: IRendererBody;
}
