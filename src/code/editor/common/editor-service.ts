import { createDecorator } from '@/platform/instantiation/common/instantiation';
import * as markybox from '@/core';

export interface IEditorService {
  readonly editor: markybox.MEditor;
  readonly renderer: markybox.MHTMLRenderer;
}

export const IEditorService = createDecorator<IEditorService>('editorService');
