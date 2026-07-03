import React from 'react';
import * as Lucide from 'lucide-react';

interface CategoryIconProps {
  name: string;
  className?: string;
  size?: number;
}

export const CategoryIcon: React.FC<CategoryIconProps> = ({ name, className = '', size = 18 }) => {
  // Safe lookup dictionary from all Lucide exports
  const IconComponent = (Lucide as any)[name];

  if (!IconComponent) {
    // Fallback icon if not found
    return <Lucide.HelpCircle className={className} size={size} />;
  }

  return <IconComponent className={className} size={size} />;
};

export default CategoryIcon;
