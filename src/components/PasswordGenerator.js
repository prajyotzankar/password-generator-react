import React, { useState, useEffect } from "react";
import "./PasswordGeneratorStyle.css";

const PasswordGenerator = (props) => {
  const [includeLetters, setIncludeLetters] = useState(true);
  const [includeNumbers, setIncludeNumbers] = useState(true);
  const [includeSpecialChar, setIncludeSpecialChar] = useState(false);
  const [includeCapitalLetters, setIncludeCapitalLetters] = useState(false);
  const [excludeDuplicateChar, setExcludeDuplicateChar] = useState(false);
  const [excludeSimilarChar, setExcludeSimilarChar] = useState(false);
  const [passwordLength, setPasswordLength] = useState(8);
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
    console.log(generatedPassword);
    return generatedPassword
      .slice(0, passwordLength)
      .split("")
      .sort(() => Math.random() - 0.5)
      .join("");
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
  }, [password]);

  useEffect(() => {
    passwordStrength(passwordEntropy);
  }, [passwordEntropy]);

  const generatePassword = async (e) => {
    const generatedPassword = RandomPasswordGenerator();
    console.log(generatedPassword);
    setPassword(generatedPassword);
    const resultEl = document.getElementById("result");
    resultEl.innerText = generatedPassword;
    navigator.clipboard.writeText(generatedPassword);

    document.getElementById("custom-tooltip").style.display = "inline";
    setTimeout(function () {
      document.getElementById("custom-tooltip").style.display = "none";
    }, 5000);
  };

  return (
    <div class="container">
      <h2>Password Generator</h2>
      <div class="result-container">
        <span id="result">Click Generate</span>
        {/* <input type="text" name="password" id="passwords" value={password} /> */}
        <button class="btn" id="clipboard"></button>
      </div>
      <div class="settings">
        <div class="setting">
          <label>Password Length</label>
          <input type="number" id="length" min="8" max="20" value="25" />
        </div>
        <div class="setting">
          <label>Include uppercase letters</label>
          <input type="checkbox" id="uppercase" checked />
        </div>
        <div class="setting">
          <label>Include lowercase letters</label>
          <input type="checkbox" id="lowercase" checked />
        </div>
        <div class="setting">
          <label>Include numbers</label>
          <input type="checkbox" id="numbers" checked />
        </div>
        <div class="setting">
          <label>Include symbols</label>
          <input type="checkbox" id="symbols" checked />
        </div>
      </div>
      <input
        type="button"
        className="btn btn-dark btn-lg"
        value="Generate"
        onClick={(e) => generatePassword(e)}
      />
    </div>
  );
};

export default PasswordGenerator;
