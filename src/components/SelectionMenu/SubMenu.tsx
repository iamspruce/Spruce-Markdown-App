import { useAPIContext } from "@/context/APIProvider";
import { useLicense } from "@/context/LicenseProvider";
import React, { useState } from "react";
import { ChevronDown } from "react-feather";

interface items {
  name: string;
  isPro: boolean;
}
interface SubMenuProps {
  title: string;
  items: items[];
  pos: { top: number; bottom: number; left: number; right: number };
  subMenus?: SubMenuProps[];
  onItemClick: (item: string) => void;
}

const SubMenu: React.FC<SubMenuProps> = ({
  title,
  items,
  pos,
  subMenus,
  onItemClick,
}) => {
  const { ApiKey } = useAPIContext();
  const { licenseKey } = useLicense();

  const [isOpen, setIsOpen] = useState(false);
  let adjustedPos =
    window.innerHeight - pos.bottom < 268 ? -(218 + 10) : 50 + 10;

  const toggleSubMenu = () => {
    setIsOpen(!isOpen);
  };

  return (
    <div>
      <button onClick={toggleSubMenu}>
        {title}
        <ChevronDown size={16} />
      </button>
      {isOpen && (
        <ul
          style={{
            top: `${adjustedPos}px`,
          }}
          className="cm-sub-menu"
        >
          {items.map((item) => (
            <li key={item.name} onClick={() => onItemClick(item.name)}>
              <button
                disabled={item.isPro && licenseKey == null}
                title={item.isPro ? "Upgrade to pro" : "Continue writing"}
              >
                {item.name}
              </button>
              <div className="loader"></div>
            </li>
          ))}
          {subMenus &&
            subMenus.map((subMenu) => (
              <SubMenu
                key={subMenu.title}
                {...subMenu}
                onItemClick={onItemClick}
              />
            ))}
        </ul>
      )}
    </div>
  );
};

export default SubMenu;