export interface IRendererDisplay {
  setFullScreen(): void;
}

export interface IRendererGutter {}

export interface IRendererBody {}

export interface IAbstractRenderer {
  readonly display: IRendererDisplay;
  readonly gutter: IRendererGutter;
  readonly body: IRendererBody;
}
