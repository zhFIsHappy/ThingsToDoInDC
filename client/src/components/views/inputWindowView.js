import React, { useState } from 'react';
import PropTypes from 'prop-types';
import '../../css/inputWindowView.scss';
import axios from 'axios';
import store from '../../store/store.js';
const {user} =store

const InputWindow = ({ title, url, onClose, className }) => {
  const [inputValue, setInputValue] = useState('');
  const [inputPassword, setInputPassword] = useState('');

  const handleSubmit = () => {
    onClose();
    axios.post(url, {
      currentPassword: inputPassword,
      newValue: inputValue
    }, {
      headers: {
        'Authorization': `Bearer ${user.sessionId}`
      }
    }).then(response => {
      alert(response.data.message)
      console.log(response.data);
    }).catch(error => {
      console.log(error.response.data);
      alert(error.response.data.message)
    });
  };

  return (
    <div className={`inputWindowView ${className}`}>
      <div className="inputWindowTitle">
        {title}
        <button className="inputWindowCloseButton" onClick={onClose}>
          Close
        </button>
      </div>
      <div className="inputWindowBody">
        <input
          type="text"
          value={inputPassword}
          onChange={(e) => setInputPassword(e.target.value)}
          placeholder="Please Verify Your Password"
        />
        <input
          type="text"
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          placeholder={`Please Input New Value Here`}
        />
        <button onClick={handleSubmit}>Submit</button>
      </div>
    </div>
  );
};

InputWindow.propTypes = {
  title: PropTypes.string.isRequired,
  url: PropTypes.string.isRequired,
  onClose: PropTypes.func.isRequired,
  className: PropTypes.string,
};

export default InputWindow;