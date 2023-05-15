import React, { useEffect, useState } from "react";
import './TextContent.css';
import Linkify from 'react-linkify';
import { getLoadingText } from "./util";


function TextContent({ currentTab, videoSummary }) {
  const [loadingText, setLoadingText] = useState('');
  const [scrolled, setScrolled] = useState(false);
  const divRef = useRef(null);
  let logoUrl = chrome?.runtime ? chrome.runtime.getURL('logo.png') : 'logo.png';

  useEffect(() => {
    let text = getLoadingText();
    setLoadingText(text);
  }, []);

  const handleScroll = () => {
    const { scrollTop } = divRef.current;
    if (scrollTop > 0) {
      // User has scrolled down
      setScrolled(true);
    } else {
      setScrolled(false);
    }
  };

  return (
    <div className="textContentContainer">
      <div className={classNames("topGradient", { gradientVisible: scrolled })}></div>

      <div 
      className="textContentInner"
      ref={divRef}
      style={{ maxHeight: '200px', overflowY: 'scroll' }}
      onScroll={handleScroll}
      >
        {currentTab === 'Summary' && videoSummary.length === 0 &&
          <div className="logoWrapper">
            <img src={logoUrl} alt="Logo" className="logo-spin" />
            <h3 className="loadingText">{loadingText}</h3>
          </div>
        }

        {currentTab === 'Summary' && videoSummary.length > 0 &&
          <Linkify>
            {videoSummary}
          </Linkify>
        }
      </div>

      <div className="bottomGradient"></div>
    </div>
  )
}

export default TextContent;
