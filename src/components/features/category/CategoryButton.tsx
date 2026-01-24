import { memo } from 'react';

interface CategoryButtonProps {
    isActive: boolean;
    onClick: () => void;
    children: React.ReactNode;
}

const CategoryButton = memo(function CategoryButton({
    isActive,
    onClick,
    children,
}: CategoryButtonProps) {
    return (
        <button
            className={`px-4 py-2 rounded-full text-sm font-medium transition-all whitespace-nowrap ${isActive
                    ? 'bg-primary text-white'
                    : 'bg-white text-text-secondary border border-border hover:border-primary hover:text-primary'
                }`}
            onClick={onClick}
        >
            {children}
        </button>
    );
});

CategoryButton.displayName = 'CategoryButton';

export default CategoryButton;
