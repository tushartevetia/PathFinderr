import React, { useContext, useEffect, useRef, useState } from "react";
import LayersIcon from "@mui/icons-material/Layers";
import { Dropdown } from "../utils/dropdown";
import BoltIcon from "@mui/icons-material/Bolt";
import { Slider, Stack, hexToRgb } from "@mui/material";
import { GlobalContext } from "../utils/GlobalContext";

const Sidenav = () => {
  const [isOpen, setIsOpen] = useState(true);
  const [speedToggled, setSpeedToggled] = useState(true);
  const {
    isAnimating,
    speed,
    setSpeed,
    isProcessingNode,
    startNode,
    finishNode,
    boardDimensions,
    colors,
    mode,
    setMode,
    showSidebar,
    setShowSidebar,
  } = useContext(GlobalContext);
  const [speedValue, setSpeedValue] = useState(null);
  const windowWidth = useRef([window.innerWidth]);

  useEffect(() => {
    if (windowWidth.current < 500) {
      setShowSidebar(false);
    }
  }, []);

  const updateSpeed = () => {
    setSpeed(Math.abs(speedValue));
  };

  const handleSliderChange = (event, newValue) => {
    setSpeedValue(newValue);
  };

  const updateNodePosition = (target) => {
    if (isAnimating || isProcessingNode) {
      return;
    }
    if (windowWidth.current < 500) {
      setShowSidebar(false);
    }
    // remove blinking if clicked on start node without changing position
    if (mode.start) {
      const startDomEl = document.getElementById(
        `node-${startNode.row}-${startNode.col}`
      );
      startDomEl.classList.remove("node_blink");
    }
    // remove blinking if clicked on finish node without changing position
    if (mode.finish) {
      const finishDomEl = document.getElementById(
        `node-${finishNode.row}-${finishNode.col}`
      );
      finishDomEl.classList.remove("node_blink");
    }

    setMode({
      start: false,
      finish: false,
      wall: false,
      [target]: !mode[target],
    });
  };
  return (
    <>
      {showSidebar && (
        <>
          {" "}
          <div className="sidebar_head">
            <img src="https://i.pinimg.com/474x/68/59/67/685967712e0f01fc2ad090fb5745b657.jpg" />
            <h3>PathFinder</h3>
          </div>
          <div className="sidebar_body">
            <Dropdown
              label="Nodes"
              icon={<LayersIcon />}
              isOpen={isOpen}
              onClick={() => setIsOpen(!isOpen)}
            >
              <div className="dropdown_items">
                <p
                  style={{
                    background: mode.start && colors.start,
                    color: mode.start && "#fff",
                  }}
                  onClick={() => updateNodePosition("start")}
                >
                  Start Node
                </p>
                <p
                  style={{
                    background: mode.finish && colors.finish,
                    color: mode.finish && "#fff",
                  }}
                  onClick={() => updateNodePosition("finish")}
                >
                  Finish Node
                </p>
              </div>
            </Dropdown>
            <Dropdown
              label="Speed"
              icon={<BoltIcon />}
              isOpen={speedToggled}
              onClick={() => setSpeedToggled(!speedToggled)}
            >
              <Stack
                spacing={2}
                direction="row"
                sx={{ m: ".5rem .5rem" }}
                alignItems="center"
              >
                <Slider
                  disabled={isAnimating}
                  min={-12}
                  max={-2}
                  onBlur={updateSpeed}
                  aria-label="Volume"
                  value={speedValue}
                  onChange={handleSliderChange}
                />
              </Stack>
            </Dropdown>
          </div>
        </>
      )}
    </>
  );
};

export default Sidenav;
