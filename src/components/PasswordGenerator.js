import React, { useState, useEffect } from "react";
import "./PasswordGeneratorStyle.css";

const PasswordGenerator = (props) => {
  console.clear();
  const [includeLetters, setIncludeLetters] = useState(true);
  const [includeNumbers, setIncludeNumbers] = useState(true);
  const [includeSpecialChar, setIncludeSpecialChar] = useState(true);
  const [includeCapitalLetters, setIncludeCapitalLetters] = useState(true);
  const [excludeDuplicateChar, setExcludeDuplicateChar] = useState(false);
  const [passwordLength, setPasswordLength] = useState(15);
  const [passwordEntropy, setPasswordEntropy] = useState(0);
  const [passwordStrengthLabel, setPasswordStrengthLabel] = useState("weak");
  const [password, setPassword] = useState("");
  const [passwordHistory, setPasswordHistory] = useState({});

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

    const allowedTypesArray = [];
    const allowedPattern = [];
    typesArr.forEach((type) => {
      allowedTypesArray.push(Object.keys(type)[0]);
      allowedPattern[Object.keys(type)[0]] = false;
    });

    while (!Object.values(allowedPattern).every(Boolean)) {
      generatedPassword = "";
      while (passwordLength > generatedPassword.length) {
        const funcName =
          allowedTypesArray[
            Math.floor(Math.random() * allowedTypesArray.length)
          ];
        let charToAdd = randomFunc[funcName]();
        if (excludeDuplicateChar) {
          if (generatedPassword.includes(charToAdd)) charToAdd = "";
        }
        generatedPassword += charToAdd;
        if (charToAdd !== "" && !allowedPattern[funcName]) {
          allowedPattern[funcName] = true;
        }
      }
    }
    return generatedPassword.slice(0, passwordLength);
  };

  const calcEntropy = (passwordLength) => {
    const charsetLength = 77;
    const entropy = Math.round(
      (passwordLength * Math.log(charsetLength)) / Math.LN2
    );
    setPasswordEntropy(entropy);
  };

  const passwordStrength = (passwordEntropy) => {
    if (passwordEntropy <= 60) setPasswordStrengthLabel("Very Weak");
    else if (passwordEntropy > 60 && passwordEntropy <= 80) {
      setPasswordStrengthLabel("Weak");
    } else if (passwordEntropy > 80 && passwordEntropy <= 100) {
      setPasswordStrengthLabel("Good");
    } else if (passwordEntropy > 100) setPasswordStrengthLabel("Strong");
    else setPasswordStrengthLabel("Use a Strong Password");
  };

  useEffect(() => {
    calcEntropy(passwordLength);
  }, [passwordLength]);

  useEffect(() => {
    passwordStrength(passwordEntropy);
  }, [passwordEntropy]);

  // handle toggles
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
  const onChangeExcludeDuplicateChar = (e) => {
    setExcludeDuplicateChar(document.getElementById("duplicateChar").checked);
    disableOnlyCheckbox();
  };

  const onChangePasswordLength = (e) => {
    setPasswordLength(e.target.value);
    document.getElementById("password-length-span").innerHTML =
      "Password Length: " + e.target.value;

    // dual tone on sliding bar
    const slider = document.getElementById("range");
    const sliderProps = {
      fill: "#3FA4F4",
      background: "rgba(255, 255, 255, 0.214)",
    };

    const percentage =
      (100 * (e.target.value - slider.min)) / (slider.max - slider.min);
    const bg = `linear-gradient(90deg, ${sliderProps.fill} ${percentage}%, ${
      sliderProps.background
    } ${percentage + 0.1}%)`;
    slider.style.background = bg;
  };

  // function that handles the checkboxes state, so at least one needs
  // to be selected.The last checkbox will be disabled.
  const disableOnlyCheckbox = () => {
    const uppercase = document.getElementById("uppercase");
    const lowercase = document.getElementById("lowercase");
    const number = document.getElementById("numbers");
    const symbol = document.getElementById("symbols");
    const totalChecked = [uppercase, lowercase, number, symbol].filter(
      (el) => el.checked
    );

    totalChecked.forEach((el) => {
      if (totalChecked.length === 1) {
        if (el.id === "numbers" || el.id === "symbols") {
          setExcludeDuplicateChar(false);
          document.getElementById("duplicateChar").disabled = true;
        }
        el.disabled = true;
      } else {
        el.disabled = false;
        document.getElementById("duplicateChar").disabled = false;
      }
    });
  };

  const copyToClipboard = (item) => {
    if (!item) {
      navigator.clipboard.writeText(password);

      const copyInfo = document.querySelector(".info.right");
      copyInfo.style.transform = "translateY(200%)";
      copyInfo.style.opacity = "0";

      const copiedInfo = document.querySelector(".info.left");
      copiedInfo.style.transform = "translateY(0%)";
      copiedInfo.style.opacity = "0.75";
    } else {
      navigator.clipboard.writeText(item);
    }
  };

  const showOrHide = (item) => {
    const passwordHistoryCopy = passwordHistory;
    passwordHistoryCopy[item] =
      passwordHistory[item] === "show" ? "hide" : "show";
    setPasswordHistory({ ...passwordHistoryCopy });
  };

  const deleteItem = (item) => {
    const passwordHistoryCopy = passwordHistory;
    delete passwordHistoryCopy[item];
    setPasswordHistory({ ...passwordHistoryCopy });
    if (Object.keys(passwordHistory).length < 1) {
      focusOnPasswordHistory();
    }
  };

  const generatePassword = async (e) => {
    const generatedPassword = RandomPasswordGenerator();
    // console.log(generatedPassword);
    setPassword(generatedPassword);
    document.getElementById("result").innerText = generatedPassword;

    setPasswordHistory({
      ...passwordHistory,
      [generatedPassword]: "hide",
    });

    // Tooltips for copy action and copied
    const copyInfo = document.querySelector(".info.right");
    copyInfo.style.transform = "translateY(0%)";
    copyInfo.style.opacity = "0.75";

    const copiedInfo = document.querySelector(".info.left");
    copiedInfo.style.transform = "translateY(200%)";
    copiedInfo.style.opacity = "0";

    //delete all password history button
    if (document.getElementById("display-table").style.display === "block") {
      document.getElementById("emoji-dustbin").style.display = "inline-block";
    }
    document.getElementById("tooltip").classList.remove("tooltip");
  };

  const focusOnPasswordHistory = () => {
    if (Object.keys(passwordHistory).length < 1) {
      focusOnPasswordGen();
    }
    if (Object.keys(passwordHistory).length > 0) {
      document.getElementById("emoji-dustbin").style.display = "inline-block";
      document.getElementById("tooltip").classList.remove("tooltip");
      document.getElementById("display-table").style.display = "block";
      document.getElementById("password-history-h2").style.writingMode =
        "horizontal-tb";
      document.getElementById("password-history-h2").style.padding = "0px";
      document.getElementById("password-history-h2").style.backgroundColor =
        "transparent";

      document.getElementById("password-gen-h2").style.writingMode =
        "vertical-lr";
      document.getElementById("password-gen-h2").style.padding =
        "20px 10px 100px 10px";
      document.getElementById("password-gen-h2").style.backgroundColor =
        "#2f4ac4";
      document.getElementById("passwordSettings").style.display = "none";
    }
  };

  const focusOnPasswordGen = () => {
    document.getElementById("password-gen-h2").style.writingMode =
      "horizontal-tb";
    document.getElementById("password-gen-h2").style.padding = "0px";
    document.getElementById("password-gen-h2").style.backgroundColor =
      "transparent";
    document.getElementById("passwordSettings").style.display = "block";

    document.getElementById("emoji-dustbin").style.display = "none";
    if (Object.keys(passwordHistory).length < 1) {
      document.getElementById("tooltip").classList.add("tooltip");
    }
    document.getElementById("display-table").style.display = "none";
    document.getElementById("password-history-h2").style.writingMode =
      "vertical-lr";
    document.getElementById("password-history-h2").style.padding =
      "20px 10px 100px 10px";
    document.getElementById("password-history-h2").style.backgroundColor =
      "#2f4ac4";
  };

  return (
    <div className="container">
      <div className="password">
        <h2 id="password-gen-h2" className="title" onClick={focusOnPasswordGen}>
          Password Generator
        </h2>
        <div id="passwordSettings">
          <div className="gen-password">
            <div className="result">
              <div className="info right" onClick={() => copyToClipboard()}>
                click to copy
              </div>
              <div className="info left">copied</div>
              <div className="viewbox" id="result">
                CLICK GENERATE
              </div>
            </div>
            <div>
              <input
                type="button"
                className="btn generate"
                value="Generate"
                onClick={generatePassword}
              />
            </div>
          </div>
          <div className="password-info">
            <span id="password-length-span" className="field-title">
              Password Length: 15
            </span>
            <span id="password-entropy-span" className="field-title entropy">
              Entropy: {passwordEntropy}
            </span>
            <span
              id="password-strengthLabel-span"
              className="field-title strength-label"
            >
              Strength: {passwordStrengthLabel}
            </span>
            <div className="password-length-slider">
              <b>8</b>
              <input
                id="range"
                className="range"
                type="range"
                value={passwordLength}
                onChange={onChangePasswordLength}
                min="8"
                max="25"
              />
              <b>25</b>
            </div>
          </div>
          <div className="settings">
            <span className="field-title">Settings</span>
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
            <div className="setting">
              <label>Exclude Duplicate Characters</label>
              <input
                type="checkbox"
                id="duplicateChar"
                onChange={onChangeExcludeDuplicateChar}
                value={excludeDuplicateChar}
                checked={excludeDuplicateChar}
              />
            </div>
          </div>
        </div>
      </div>
      <div className="password-history">
        <span id="tooltip" data-tooltip="Password History is Empty">
          <h2
            id="password-history-h2"
            className="title"
            onClick={focusOnPasswordHistory}
          >
            Password History
          </h2>
        </span>
        <span className="tooltip" data-tooltip="Delete All History">
          <b
            id="emoji-dustbin"
            className="emoji-dustbin"
            onClick={() => {
              setPasswordHistory({});
              focusOnPasswordGen();
            }}
          />
        </span>
        <div id="display-table">
          <table>
            <tbody>
              {Object.entries(passwordHistory).map(([key, value]) => (
                <tr key={key}>
                  <td className="td-password">
                    {value === "show" ? key : "*********"}
                  </td>
                  <span className="tooltip" data-tooltip="Show/Hide">
                    <td className={value} onClick={() => showOrHide(key)} />
                  </span>
                  <span className="tooltip" data-tooltip="Click to Copy">
                    <td
                      className="emoji-clipboard"
                      onClick={() => copyToClipboard(key)}
                    />
                  </span>
                  <span className="tooltip" data-tooltip="Delete">
                    <td
                      className="emoji-dustbin"
                      onClick={() => deleteItem(key)}
                    />
                  </span>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default PasswordGenerator;
