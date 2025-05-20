import { Icon } from "@iconify/react";
import * as LucideIcons from "lucide-react";

/**
 * Get an icon component from its name
 * @param iconName The name of the icon to get
 * @returns The icon component or undefined if not found
 */
export const getIconComponent = (iconName: string) => {
  // First check if it's a Lucide icon
  if (iconName in LucideIcons) {
    return LucideIcons[
      iconName as keyof typeof LucideIcons
    ] as LucideIcons.LucideIcon;
  }

  // Otherwise, return a function component that renders an Iconify icon
  return (props: React.ComponentProps<typeof Icon>) => (
    <Icon {...props} icon={iconName} />
  );
};
