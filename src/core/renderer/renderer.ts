import { IDisplayRenderer } from '@/core/renderer/html/MHTMLRenderer';
import { MEditorGutter } from '@/core/renderer/html/MEditorGutter';
import { MEditorBody } from '@/core/renderer/html/MEditorBody';
import { MEditor } from '@/core';

export interface IAbstractRenderer {
  editor: MEditor;
  readonly gutter: MEditorGutter;
  readonly body: MEditorBody;
  readonly display: IDisplayRenderer;
  init(): void;

  render(): void;
}
