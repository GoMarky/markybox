import { ILogService } from '@/platform/log/common/log';
import { ISessionService } from '@/code/session/common/session';
import { INoteInfo, INoteService } from '@/code/notes/common/notes';
import { Ref } from 'vue';
import { RouteLocationNormalizedLoaded } from 'vue-router';
import * as markybox from '@/core';
import { DemoUserInteraction } from '../../../../test/demo/demo-user-interaction';
import { typeWordActions } from '../../../../test/demo/actions/type-word-actions';
import { ISocketService, SocketCommandType } from '@/code/socket/common/socket-service';

export class CodePageEditor {
  private editor: markybox.MEditor;
  private renderer: markybox.MHTMLRenderer;

  constructor(
    private readonly logService: ILogService,
    private readonly sessionService: ISessionService,
    private readonly noteService: INoteService,
    private readonly socketService: ISocketService
  ) {
  }

  private createFakeUsers(): void {
    new DemoUserInteraction(this.renderer, typeWordActions, 'user-2', 15);
  }

  public init(route: Ref<RouteLocationNormalizedLoaded>, note?: INoteInfo): void {
    const { name: userName } = this.sessionService.profile;
    let initialText = '';

    const name = userName.value || 'anonymous';

    this.noteService.store.currentNote.value = note || null;

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

    this.socketService.onMessage((event) => {
      switch (event.type) {
        case SocketCommandType.LeaveRoom:
          break;
        case SocketCommandType.EnterRoom: {
          const { text, user_name } = event.data;

          this.renderer.navigatorManager.add(user_name);

          break;
        }
        case SocketCommandType.EditorAction: {
          type EditorActionPayload = { position: string, user_name: string };
          const { position, user_name } = event.data as EditorActionPayload;

          const [row, column] = position.split(',').map((coordinate) => Number(coordinate));

          if (name === user_name) {
            return;
          }

          this.renderer.navigatorManager.commandCenter.changePosition(user_name, { row, column });

          return;
        }
      }
    })

    renderer.navigator.onDidUpdatePosition((position) => {
      const { row, column } = position;

      this.socketService.send({
        type: SocketCommandType.EditorAction,
        position: `${row},${column}`,
        user_name: name,
        note_nanoid: note?.id
      })
    })

    renderer.controller.editorAutoSave.onDidSave((text: string) => {
      const noteId = route.value.params.id as string;

      void this.noteService.updateNote(noteId, text);
    })

    editor.setText(initialText)
  }
}
