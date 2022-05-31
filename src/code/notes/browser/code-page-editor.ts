import { ILogService } from '@/platform/log/common/log';
import { ISessionService } from '@/code/session/common/session';
import { INoteInfo, INoteService } from '@/code/notes/common/notes';
import { Ref } from 'vue';
import { RouteLocationNormalizedLoaded } from 'vue-router';
import * as markybox from '@/core';
import { isDev } from '@/base/platform';
import { DemoUserInteraction } from '../../../../test/demo/demo-user-interaction';
import { typeWordActions } from '../../../../test/demo/actions/type-word-actions';

export class CodePageEditor {
  private editor: markybox.MEditor;
  private renderer: markybox.MHTMLRenderer;

  constructor(
    private readonly logService: ILogService,
    private readonly sessionService: ISessionService,
    private readonly noteService: INoteService) {
  }

  private createFakeUsers(): void {
    new DemoUserInteraction(this.renderer, typeWordActions, 'user-2', 15);
  }

  public init(route: Ref<RouteLocationNormalizedLoaded>, note?: INoteInfo): void {
    const { name: userName } = this.sessionService.profile;
    let initialText = '';

    const name = userName.value || 'anonymous';

    this.noteService.store.currentNote.value = note;

    if (note) {
      initialText = note.data;
    }

    const root = document.querySelector<HTMLElement>('#root') as HTMLElement;
    const renderer = this.renderer = window.$renderer = new markybox.MHTMLRenderer({
      lang: note?.lang || 'plain',
      author: name,
      root
    });

    const editor = this.editor = window.$editor = new markybox.MEditor({
      renderer,
      fullscreen: true,
      logger: this.logService,
    });

    renderer.controller.editorAutoSave.onDidSave((text: string) => {
      const noteId = route.value.params.id as string;

      void this.noteService.updateNote(noteId, text);
    })

    editor.setText(initialText)
  }
}
