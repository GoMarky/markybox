import { RouteName } from '@/app/code/vue/route-names';

export interface IBottomNavItem {
  id: string;
  icon: string;
  name: string;
  routes: string[];
}

const code: IBottomNavItem = {
  id: 'Code',
  icon: 'IconSettings',
  name: 'Code',
  routes: [RouteName.WorkspacePage, RouteName.NotePage],
};

const files: IBottomNavItem = {
  id: 'Files',
  icon: 'IconSettings',
  name: 'Files',
  routes: [RouteName.WorkspacePage, RouteName.NotePage],
};

const console: IBottomNavItem = {
  id: 'Console',
  icon: 'IconSettings',
  name: 'Console',
  routes: [RouteName.WorkspacePage, RouteName.NotePage],
};

const commands: IBottomNavItem = {
  id: 'Commands',
  icon: 'IconProfile',
  name: 'Commands',
  routes: [RouteName.WorkspacePage, RouteName.NotePage],
};

export const noteBottomItems: IBottomNavItem[] = [code, commands];
export const workspaceBottomItems: IBottomNavItem[] = [code, files, console, commands];
