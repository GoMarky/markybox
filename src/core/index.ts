import { MEditor } from '@/core/app/editor';
import { HTMLRenderer } from '@/core/renderer/html/HTMLRenderer';
import { EditorLang, EditorTheme } from '@/core/renderer/html/editor/EditorBodyContainer';

function getSupportedSyntaxes(): EditorLang[] {
  return [
    'plain',
    'python',
    'cpp',
    'json',
    'js',
    'golang'
  ];
}

export {
  EditorLang,
  EditorTheme,
  MEditor,
  HTMLRenderer,
  getSupportedSyntaxes,
}
