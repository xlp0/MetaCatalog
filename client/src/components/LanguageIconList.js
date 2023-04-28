import React, { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux'

const LanguageIconList = ({ languages }) => {

    // const dispatch = useDispatch()
    // const { user } = useSelector((state) => state.auth)

    //   console.log(loaded_languages)
    languages = [
        {
            "code": "en",
            "name": "English"
        },
        {
            "code": "id",
            "name": "Indonesian"
        }
    ]
    // console.log(languages)
    const [selectedLanguage, setSelectedLanguage] = useState(null);

    const handleLanguageClick = (language) => {
      setSelectedLanguage(language);
      console.log("selected language:" + language);
    };
  
    const handleLanguageMouseEnter = (event) => {
      event.target.style.filter = 'brightness(70%)'; // dim the icon when hovered over
    };
  
    const handleLanguageMouseLeave = (event) => {
      event.target.style.filter = ''; // reset the icon's filter when the mouse leaves
    };

    const iconSize = "18px";

    return (
    <div style={{ padding: '0 30px' }}>
      <ul style={{ display: 'flex', justifyContent: 'flex-end', alignItems: 'center', listStyleType: 'none' }}>
        {languages.map((language, index) => (
          <React.Fragment key={index}><li  style={{ marginRight: '5px', marginLeft: '5px' }}>
                <img
                    src={`img/${language.code}.png`}
                    alt={language.name}
                    style={{
                        width: `${iconSize}`,
                        // height: {iconSize},
                        cursor: 'pointer',
                        filter: selectedLanguage === language ? 'brightness(150%)' : '', // brighten the icon when selected
                    }}
                    onClick={() => handleLanguageClick(language)}
                    onMouseEnter={handleLanguageMouseEnter}
                    onMouseLeave={handleLanguageMouseLeave} />
            </li>{index < languages.length - 1 && <span>|</span>}</React.Fragment>
        ))}
      </ul>
    </div>
    );
  };

export default LanguageIconList