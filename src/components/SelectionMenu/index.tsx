import React from "react";
import SubMenu from "./SubMenu";
import { Bold, Italic, Underline, Link } from "react-feather";

interface MenuProps {
  show: boolean;
  pos: { top: number; bottom: number; left: number; right: number };
  onMenuItemClick: (
    e: React.MouseEvent<HTMLLIElement, MouseEvent>,
    item: string
  ) => void;
}

const SelectionMenu: React.FC<MenuProps> = ({ show, pos, onMenuItemClick }) => {
  if (!show) {
    return null;
  }
  let menuHeight = 50;
  let adjustedPos;

  if (pos.top < menuHeight + 15) {
    adjustedPos = pos.bottom + 15;
  } else if (pos.bottom > menuHeight + 15) {
    adjustedPos = pos.top - 15;
  } else if (pos.bottom + menuHeight + 15 > window.innerHeight) {
    adjustedPos = pos.top - 15;
  }

  const centerX = (pos.left + pos.right) / 2;
  const adjustedBottom = centerX - 300 / 2;
  return (
    <div
      className="menu cm-selection-menu"
      style={{
        top: `${adjustedPos}px`,
        left: `${adjustedBottom}px`,
      }}
    >
      <ul>
        <SubMenu
          title="✨ Ask AI"
          items={[
            { name: "Improve Writing", isPro: false },
            { name: "Fix Spelling and Grammar", isPro: false },
            { name: "Summarize", isPro: false },
            { name: "Expand", isPro: false },
            { name: "Continue Writing", isPro: true },
          ]}
          pos={pos}
          onItemClick={onMenuItemClick}
          subMenus={[
            {
              title: "Change Tone",
              items: [
                { name: "Simple", isPro: false },
                { name: "Professional", isPro: false },
                { name: "Formal", isPro: true },
                { name: "Creative", isPro: true },
                { name: "Fluency", isPro: true },
                { name: "Friendly", isPro: true },
                { name: "Emotional", isPro: true },
                { name: "Bold", isPro: false },
                { name: "Funny", isPro: false },
              ],
              pos: pos,
              onItemClick: onMenuItemClick,
            },
          ]}
        />
        <li onClick={(e) => onMenuItemClick(e, "bold")}>
          <button>
            <Bold size={16} />
          </button>
        </li>
        <li onClick={(e) => onMenuItemClick(e, "italic")}>
          <button>
            <Italic size={16} />
          </button>
        </li>
        <li onClick={(e) => onMenuItemClick(e, "underline")}>
          <button>
            <Underline size={16} />
          </button>
        </li>
        <li onClick={(e) => onMenuItemClick(e, "link")}>
          <button>
            <Link size={16} />
          </button>
        </li>
      </ul>
    </div>
  );
};

export default SelectionMenu;
