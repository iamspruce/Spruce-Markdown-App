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
  onItemClick: (
    e: React.MouseEvent<HTMLLIElement, MouseEvent>,
    item: string
  ) => void;
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
    window.innerHeight - pos.bottom < 268 ? -(218 + 15) : 50 + 15;

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
            <li key={item.name} onClick={(e) => onItemClick(e, item.name)}>
              <button
                disabled={item.isPro && licenseKey == ""}
                title={
                  item.isPro && licenseKey == ""
                    ? "Upgrade to Pro to use this feature"
                    : "Pro User"
                }
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
