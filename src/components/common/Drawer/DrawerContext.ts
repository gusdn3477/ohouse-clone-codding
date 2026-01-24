import { createContext, useContext } from 'react';

interface DrawerContextType {
    isOpen: boolean;
    onClose: () => void;
}

export const DrawerContext = createContext<DrawerContextType | null>(null);

export function useDrawer() {
    const context = useContext(DrawerContext);
    if (!context) {
        throw new Error('useDrawer must be used within a Drawer');
    }
    return context;
}
