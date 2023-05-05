import React, { useState,useRef,useEffect } from "react";
import '../../css/DropdownView.scss';
import apiRes from '../../utils/apiRes';
import axios from 'axios';


const Dropdown = ({ options, title,onChange  }) => {
    const [selectedOption, setSelectedOption] = useState(title);
  
    const handleClick = (option) => {
      setSelectedOption(option);
    //   apiRes.get(`/events/type/${option}`)
    //   .then(response => {
    //   console.log(response);
    //   // handle the response data here
    //    })
    //    .catch(error => {
    //    console.error(error);
    //   // handle the error here
    // });
      onChange(option);
    };
  
    return (
      <div className="dropdown">
        <button className="dropdown__btn">{selectedOption}</button>
        <ul className="dropdown__content">
          {options.map((option, index) => (
            <li key={index} onClick={() => handleClick(option)} >
              {option}
            </li>
          ))}
        </ul>
      </div>
    );
  };

  const DropdownAuto = ({ title,onChange  }) => {
    const [options, setOptions] = useState([]);
    const [selectedOption, setSelectedOption] = useState(title);

    useEffect(() => {
      const fetchData = async () => {
        // const data = await getDropdownOptions();
        const data = ["art_gallery", "aquarium", "museum", "park","tourist_attraction","zoo","shopping_mall"];
        setOptions(data);
      };
      fetchData();
    }, []);
  
    const handleClick = (option) => {

      setSelectedOption(option);
      onChange(option);
    //   apiRes.get(`/places/type/${option}`)
    //   .then(response => {
    //   console.log(response);
    //   // handle the response data here
    //    })
    //    .catch(error => {
    //    console.error(error);
    //   // handle the error here
    // });
    };
  
    return (
      <div className="dropdown">
        <button className="dropdown__btn">{selectedOption}</button>
        <ul className="dropdown__content">
          {options.map((option, index) => (
            <li key={index} onClick={() => handleClick(option)}>
              {option}
            </li>
          ))}
        </ul>
      </div>
    );
};

export {Dropdown,DropdownAuto};