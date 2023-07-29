import { KeyboardArrowUp } from "@mui/icons-material";
import { Collapse } from "@mui/material";

export const Dropdown = ({ icon, label, isOpen, children, onClick }) => {
  return (
    <div className="dropdown">
      <span className="dropdown_head">
        <span>
          {icon}
          {label}
        </span>
        <KeyboardArrowUp onClick={onClick} />
      </span>

      <Collapse in={isOpen} timeout="auto" unmountOnExit>
        <div className="dropdown_body">
          <div className="dropdown_highlight" />
          <div className="dropdown_list">{children}</div>
        </div>
      </Collapse>
    </div>
  );
};
