import { IRequestRegister } from '@/platform/request/common/requestService';
import { SessionLoginRequest } from '@/code/request/session-login/session-login-request';
import { SessionInfoRequest } from '@/code/request/session-info/session-info-request';
import { SessionLogoutRequest } from '@/code/request/session-logout/session-logout-request';

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

export default requests;
