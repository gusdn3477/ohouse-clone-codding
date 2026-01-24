import { useState, useEffect } from 'react';

export function useResponsiveColumns() {
    const [columns, setColumns] = useState(4);

    useEffect(() => {
        const updateColumns = () => {
            if (window.innerWidth < 640) setColumns(2);
            else if (window.innerWidth < 1024) setColumns(3);
            else setColumns(4);
        };

        updateColumns();
        window.addEventListener('resize', updateColumns);
        return () => window.removeEventListener('resize', updateColumns);
    }, []);

    return columns;
}
