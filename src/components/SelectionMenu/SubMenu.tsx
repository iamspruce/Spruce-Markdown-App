import React, { useState } from "react";
import { ChevronDown } from "react-feather";

interface SubMenuProps {
  title: string;
  items: string[];
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
            <li key={item} onClick={() => onItemClick(item)}>
              <button>{item}</button>
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
