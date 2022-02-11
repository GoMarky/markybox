import { IDisplayRenderer } from '@/core/renderer/html/MHTMLRenderer';
import { MGutter } from '@/core/renderer/html/MGutter';

export interface IAbstractRenderer {
  readonly gutter: MGutter;
  readonly display: IDisplayRenderer;

  render(): void;
}
