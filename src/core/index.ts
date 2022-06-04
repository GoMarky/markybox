import { MEditor } from '@/core/app/editor';
import { MHTMLRenderer } from '@/core/renderer/html/MHTMLRenderer';
import { EditorLang, EditorTheme } from '@/core/renderer/html/editor/MHTMLEditorBody';

function getSupportedSyntaxes(): EditorLang[] {
  return [
    'plain',
    'python',
    'cpp',
    'json',
    'js'
  ];
}

export {
  EditorLang,
  EditorTheme,
  MEditor,
  MHTMLRenderer,
  getSupportedSyntaxes,
}
