import { IRequestRegister } from '@/platform/request/common/requestService';
import { SessionLoginRequest } from '@/code/request/session-login/session-login-request';
import { SessionInfoRequest } from '@/code/request/session-info/session-info-request';
import { SessionLogoutRequest } from '@/code/request/session-logout/session-logout-request';
import { NoteCreateRequest } from '@/code/request/note-create/note-create-request';
import { NoteUpdateRequest } from '@/code/request/note-update/note-update-request';
import { NoteDeleteRequest } from '@/code/request/note-delete/note-delete-request';

const requests: IRequestRegister[] = [];

requests.push({
  id: SessionLoginRequest.staticId,
  ctor: SessionLoginRequest
});

requests.push({
  id: SessionInfoRequest.staticId,
  ctor: SessionInfoRequest
});

requests.push({
  id: SessionLogoutRequest.staticId,
  ctor: SessionLogoutRequest
});

requests.push({
  id: NoteCreateRequest.staticId,
  ctor: NoteCreateRequest
});

requests.push({
  id: NoteUpdateRequest.staticId,
  ctor: NoteUpdateRequest
});

requests.push({
  id: NoteDeleteRequest.staticId,
  ctor: NoteDeleteRequest
});

export default requests;
