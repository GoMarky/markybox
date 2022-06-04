import { Disposable } from '@/platform/lifecycle/common/lifecycle';
import { IEditorService } from '@/code/editor/common/editor-service';
import * as markybox from '@/core';
import { ILogService } from '@/platform/log/common/log';
import { ISessionService } from '@/code/session/common/session';
import { INoteService } from '@/code/notes/common/notes';
import { ISocketService, SocketCommandType } from '@/code/socket/common/socket-service';
import { Note } from '@/code/notes/common/notes';

type EditorActionPayload = { position: string, user_name: string };
type EditorEnterRoomPayload = { user_name: string };
type EditorLeaveRoomPayload = { user_name: string };

export class EditorService extends Disposable implements IEditorService {
  private readonly _renderer: markybox.MHTMLRenderer;
  public get renderer(): markybox.MHTMLRenderer {
    return this._renderer;
  }

  private readonly _editor: markybox.MEditor;
  public get editor(): markybox.MEditor {
    return this._editor;
  }

  constructor(
    @ILogService private readonly logService: ILogService,
    @ISessionService private readonly sessionService: ISessionService,
    @INoteService private readonly noteService: INoteService,
    @ISocketService private readonly socketService: ISocketService
  ) {
    super();

    const renderer = this._renderer = new markybox.MHTMLRenderer();
    this._editor = new markybox.MEditor({ renderer });
  }

  public async create(noteId: Note.NoteId): Promise<void> {
    const { name: userName, isAuth } = this.sessionService.profile;

    const note = await this.noteService.getNoteById(noteId);
    const initialText = note?.data || '';
    const name = isAuth.value ? userName.value : 'anonymous';

    this.noteService.store.currentNote.value = note || null;

    this._renderer.mount('#root');
    this._editor.setText(initialText)

    this.socketService.onMessage((event) => {
      switch (event.type) {
        case SocketCommandType.LeaveRoom:
          return this.onLeaveRoom(event.data);
        case SocketCommandType.EnterRoom:
          return this.onEnterRoom(event.data);
        case SocketCommandType.EditorAction:
          return this.onEditorAction(event.data);
      }
    })

    this._renderer.navigator.onDidUpdatePosition((position) => {
      const { row, column } = position;

      this.socketService.send({
        type: SocketCommandType.EditorAction,
        position: `${row},${column}`,
        user_name: name,
        note_nanoid: note?.id
      })
    })
    this._renderer.controller.editorAutoSave.onDidSave((text: string) => this.noteService.updateNote(noteId, text))
  }

  private onLeaveRoom(data: EditorLeaveRoomPayload): void {
    const { user_name } = data;

    this._renderer.navigatorManager.remove(user_name);
  }

  private onEnterRoom(data: EditorEnterRoomPayload): void {
    const { user_name } = data;

    this._renderer.navigatorManager.add(user_name);
  }

  private onEditorAction(data: EditorActionPayload): void {
    const { name: currentUserName } = this.sessionService.profile;
    const { position, user_name: userNameFromSocket } = data;

    const [row, column] = position.split(',').map((coordinate) => Number(coordinate));

    if (currentUserName.value === userNameFromSocket) {
      return;
    }

    this._renderer.navigatorManager.commandCenter.changePosition(userNameFromSocket, { row, column });
  }
}
