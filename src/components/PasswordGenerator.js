import React, { useState, useEffect } from "react";
import "./PasswordGeneratorStyle.css";

const PasswordGenerator = (props) => {
  const [includeLetters, setIncludeLetters] = useState(true);
  const [includeNumbers, setIncludeNumbers] = useState(true);
  const [includeSpecialChar, setIncludeSpecialChar] = useState(true);
  const [includeCapitalLetters, setIncludeCapitalLetters] = useState(true);
  const [excludeDuplicateChar, setExcludeDuplicateChar] = useState(false);
  const [excludeSimilarChar, setExcludeSimilarChar] = useState(false);
  const [passwordLength, setPasswordLength] = useState(15);
  const [passwordEntropy, setPasswordEntropy] = useState(0);
  const [passwordStrengthLabel, setPasswordStrengthLabel] = useState("weak");
  const [password, setPassword] = useState("");

  const RandomPasswordGenerator = () => {
    const randomFunc = {
      includeLetters: function getRandomLower() {
        return String.fromCharCode(Math.floor(Math.random() * 26) + 97);
      },
      includeCapitalLetters: function getRandomUpper() {
        return String.fromCharCode(Math.floor(Math.random() * 26) + 65);
      },
      includeNumbers: function getRandomNumber() {
        return String.fromCharCode(Math.floor(Math.random() * 10) + 48);
      },
      includeSpecialChar: function getRandomSymbol() {
        const symbols = "!@#$%^&*()+";
        return symbols[Math.floor(Math.random() * symbols.length)];
      },
    };

    let generatedPassword = "";

    const typesCount =
      includeLetters +
      includeCapitalLetters +
      includeNumbers +
      includeSpecialChar;

    const typesArr = [
      { includeLetters },
      { includeCapitalLetters },
      { includeNumbers },
      { includeSpecialChar },
    ].filter((item) => Object.values(item)[0]);

    if (typesCount === 0) {
      return "";
    }

    let allowedTypesArray = [];
    typesArr.forEach((type) => {
      allowedTypesArray.push(Object.keys(type)[0]);
    });

    generatedPassword = "";
    while (passwordLength > generatedPassword.length) {
      const funcName =
        allowedTypesArray[Math.floor(Math.random() * allowedTypesArray.length)];
      let charToAdd = randomFunc[funcName]();
      if (excludeDuplicateChar) {
        if (generatedPassword.includes(charToAdd)) charToAdd = "";
      }
      generatedPassword += charToAdd;
    }

    return generatedPassword.slice(0, passwordLength);
    // .split("")
    // .sort(() => Math.random() - 0.5)
    // .join("");
  };

  const calcEntropy = (passwordLength) => {
    const charsetLength = 77;
    var entropy = Math.round(
      (passwordLength * Math.log(charsetLength)) / Math.LN2
    );
    setPasswordEntropy(entropy);
  };

  const passwordStrength = (passwordEntropy) => {
    if (passwordEntropy <= 60) setPasswordStrengthLabel("Very Weak");
    else if (60 < passwordEntropy && passwordEntropy <= 80)
      setPasswordStrengthLabel("Weak");
    else if (80 < passwordEntropy && passwordEntropy <= 100)
      setPasswordStrengthLabel("Good");
    else if (passwordEntropy > 100) setPasswordStrengthLabel("Strong");
    else setPasswordStrengthLabel("Use a Strong Password");
  };

  useEffect(() => {
    calcEntropy(password.length);
    // console.log(document.getElementById("uppercase").checked);
    // console.log(document.getElementById("lowercase").checked);
    // console.log(document.getElementById("numbers").checked);
    // console.log(document.getElementById("symbols").checked);
    // console.log(
    //   includeCapitalLetters,
    //   includeLetters,
    //   includeNumbers,
    //   includeSpecialChar
    // );
  }, [password]);

  useEffect(() => {
    passwordStrength(passwordEntropy);
  }, [passwordEntropy]);

  //handle toggles
  const onChangeIncludeCapitalLetters = (e) => {
    setIncludeCapitalLetters(document.getElementById("uppercase").checked);
    disableOnlyCheckbox();
  };
  const onChangeIncludeLetters = (e) => {
    setIncludeLetters(document.getElementById("lowercase").checked);
    disableOnlyCheckbox();
  };
  const onChangeIncludeNumbers = (e) => {
    setIncludeNumbers(document.getElementById("numbers").checked);
    disableOnlyCheckbox();
  };
  const onChangeIncludeSpecialChar = (e) => {
    setIncludeSpecialChar(document.getElementById("symbols").checked);
    disableOnlyCheckbox();
  };

  // function that handles the checkboxes state, so at least one needs
  //to be selected.The last checkbox will be disabled.
  const disableOnlyCheckbox = () => {
    const uppercase = document.getElementById("uppercase");
    const lowercase = document.getElementById("lowercase");
    const number = document.getElementById("numbers");
    const symbol = document.getElementById("symbols");
    // console.log([uppercase, lowercase, number, symbol]);
    const totalChecked = [uppercase, lowercase, number, symbol].filter(
      (el) => el.checked
    );
    totalChecked.forEach((el) => {
      if (totalChecked.length === 1) {
        el.disabled = true;
      } else {
        el.disabled = false;
      }
    });
  };

  const generatePassword = async (e) => {
    const generatedPassword = RandomPasswordGenerator();
    console.log(generatedPassword);
    setPassword(generatedPassword);
    // const resultEl = document.getElementById("result");
    document.getElementById("result").innerText = generatedPassword;
    navigator.clipboard.writeText(generatedPassword);
    const copyInfo = document.querySelector(".info.right");
    copyInfo.style.transform = "translateY(0%)";
    copyInfo.style.opacity = "0.75";
  };

  return (
    <div className="container">
      <h2 className="title">Password Generator</h2>
      <div className="result">
        <div className="info right">click to copy</div>
        <div className="info left">copied</div>
        <div className="viewbox" id="result">
          CLICK GENERATE
        </div>
        {/* <button id="copy-btn" style="--x: 0; --y: 0">
          <i className="far fa-copy"></i>
        </button> */}
      </div>
      <div className="settings">
        <div className="setting">
          <label>Password Length</label>
          <input
            type="number"
            id="length"
            min="8"
            value={passwordLength}
            onChange={(e) => {setPasswordLength(e.target.value)}}
            max="25"
          />
        </div>
        <div className="setting">
          <label>Use Capital letters</label>
          <input
            type="checkbox"
            id="uppercase"
            value={includeCapitalLetters}
            checked={includeCapitalLetters}
            onChange={onChangeIncludeCapitalLetters}
          />
        </div>
        <div className="setting">
          <label>Use letters</label>
          <input
            type="checkbox"
            id="lowercase"
            value={includeLetters}
            checked={includeLetters}
            onChange={onChangeIncludeLetters}
          />
        </div>
        <div className="setting">
          <label>Use numbers</label>
          <input
            type="checkbox"
            id="numbers"
            value={includeNumbers}
            onChange={onChangeIncludeNumbers}
            checked={includeNumbers}
          />
        </div>
        <div className="setting">
          <label>Use Special Characters</label>
          <input
            type="checkbox"
            id="symbols"
            onChange={onChangeIncludeSpecialChar}
            value={includeSpecialChar}
            checked={includeSpecialChar}
          />
        </div>
      </div>
      <input
        type="button"
        className="btn btn-dark btn-lg"
        value="Generate"
        onClick={generatePassword}
      />
    </div>
  );
};

export default PasswordGenerator;
