import { createDecorator } from '@/platform/instantiation/common/instantiation';
import { Disposable } from '@/platform/lifecycle/common/lifecycle';
import { computed, ComputedRef, ref, Ref } from 'vue';
import { INoteInfo, Note } from '@/code/notes/common/notes';
import { IEvent } from '@/base/event';
import { indexOutOfRange } from '@/base/array';
import { CriticalError } from '@/base/errors';
import { ISessionRegisterUserRequestAttributes } from '@/code/request/session-register-user/session-register-user-request';

export class UserProfile extends Disposable {
  public readonly sessionId: Ref<string> = ref('');

  public readonly name: Ref<string> = ref('');
  public readonly email: Ref<string> = ref('');
  public readonly notes: Ref<INoteInfo[]> = ref([]);

  public readonly isAuth: ComputedRef<boolean> = computed(() => {
    const { sessionId } = this;

    return Boolean(sessionId.value);
  })

  public dispose(): void {
    this.name.value = '';
    this.email.value = '';
    this.sessionId.value = '';
    this.notes.value = [];
  }

  public removeNote(id: Note.NoteId): void {
    const noteIndex = this.notes.value.findIndex((note) => note.id === id);

    if (indexOutOfRange(noteIndex)) {
      throw new CriticalError(`Incorrect note index - ${id}`);
    }

    this.notes.value.splice(noteIndex, 1);
  }
}

export interface ISessionService {
  readonly onDidUserLogin: IEvent<void>;
  readonly profile: UserProfile;

  login(email: Session.UserEmail, password: Session.UserPassword): Promise<void>;

  logout(): Promise<void>;

  registerUser(options: ISessionRegisterUserRequestAttributes): Promise<void>;
  restoreSession(): Promise<void>;
}

export const ISessionService = createDecorator<ISessionService>('sessionService');

export namespace Session {
  export type UserName = string;
  export type UserEmail = string;
  export type UserPassword = string;
  export type SessionId = string;
}
