import { ILogService } from '@/platform/log/common/log';
import { ISessionService } from '@/code/session/common/session';
import { INoteInfo, INoteService } from '@/code/notes/common/notes';
import { Ref } from 'vue';
import { RouteLocationNormalizedLoaded } from 'vue-router';
import * as markybox from '@/core';
import { isDev } from '@/base/platform';
import { DemoUserInteraction } from '../../../../test/demo/demo-user-interaction';
import { changePositionActions } from '../../../../test/demo/actions/change-position-actions';
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
    new DemoUserInteraction(this.renderer, changePositionActions, 'user-1', 0);
    new DemoUserInteraction(this.renderer, typeWordActions,'user-2', 3);
  }

  public init(route: Ref<RouteLocationNormalizedLoaded>, note?: INoteInfo): void {
    const { name: userName } = this.sessionService.profile;
    let initialText = '';

    if (note) {
      initialText = note.data;
    }

    const root = document.querySelector<HTMLElement>('#root') as HTMLElement;
    const renderer = this.renderer = window.$renderer = new markybox.MHTMLRenderer(root, userName.value);

    const editor = this.editor = window.$editor = new markybox.MEditor({
      renderer,
      fullscreen: true,
      logger: this.logService,
    });

    renderer.editorAutoSave.onDidSave((text: string) => {
      const noteId = route.value.params.id as string;

      this.noteService.updateNote(noteId, text);
    })

    editor.setText(initialText)

    if (isDev) {
      this.createFakeUsers();
    }
  }
}
