export interface IRendererDisplay {
  setFullScreen(): void;
}

export interface IRendererGutter {
  readonly el: HTMLElement;
}

export interface IRendererBody {
  readonly el: HTMLElement;
}

export interface IAbstractRenderer {
  readonly display: IRendererDisplay;
  readonly gutter: IRendererGutter;
  readonly body: IRendererBody;
}
