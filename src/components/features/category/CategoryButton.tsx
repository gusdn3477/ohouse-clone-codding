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
      className={`whitespace-nowrap rounded-full px-4 py-2 text-sm font-medium transition-all ${
        isActive
          ? 'bg-primary text-white'
          : 'border border-border bg-white text-text-secondary hover:border-primary hover:text-primary'
      }`}
      onClick={onClick}
    >
      {children}
    </button>
  );
});

CategoryButton.displayName = 'CategoryButton';

export default CategoryButton;
