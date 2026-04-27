import DrawerRoot from './DrawerRoot';
import DrawerOverlay from './DrawerOverlay';
import DrawerContent from './DrawerContent';

const Drawer = Object.assign(DrawerRoot, {
  Overlay: DrawerOverlay,
  Content: DrawerContent,
});

export default Drawer;
export { DrawerRoot, DrawerOverlay, DrawerContent };
