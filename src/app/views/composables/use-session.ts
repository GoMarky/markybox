import { ISessionService } from '@/app/code/session/common/session';

const sessionService = window.workbench.getService(ISessionService);

export default function useSession() {
  const { isAuth, name } = sessionService.profile;

  return {
    isAuth,
    userName: name,
  }
}
