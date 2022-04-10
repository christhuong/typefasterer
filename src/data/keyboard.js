export const EN_KEYBOARD_KEYS = {
  NUMBER_ROW: {
    UNSHIFTED: [
      "`",
      "1",
      "2",
      "3",
      "4",
      "5",
      "6",
      "7",
      "8",
      "9",
      "0",
      "-",
      "=",
      "BACK"
    ],
    SHIFTED: [
      "~",
      "!",
      "@",
      "#",
      "$",
      "%",
      "^",
      "&",
      "*",
      "(",
      ")",
      "_",
      "+",
      "BACK"
    ]
  },
  TOP_ROW: {
    UNSHIFTED: [
      "TAB",
      "q",
      "w",
      "e",
      "r",
      "t",
      "y",
      "u",
      "i",
      "o",
      "p",
      "[",
      "]",
      "\\"
    ],
    SHIFTED: [
      "TAB",
      "Q",
      "W",
      "E",
      "R",
      "T",
      "Y",
      "U",
      "I",
      "O",
      "P",
      "{",
      "}",
      "|"
    ]
  },
  HOME_ROW: {
    UNSHIFTED: [
      "CAPS",
      "a",
      "s",
      "d",
      "f",
      "g",
      "h",
      "j",
      "k",
      "l",
      ";",
      "'",
      "ENTER"
    ],
    SHIFTED: [
      "CAPS",
      "A",
      "S",
      "D",
      "F",
      "G",
      "H",
      "J",
      "K",
      "L",
      ":",
      `"`,
      "ENTER"
    ]
  },
  BOTTOM_ROW: {
    UNSHIFTED: [
      "SHIFT",
      "z",
      "x",
      "c",
      "v",
      "b",
      "n",
      "m",
      ",",
      ".",
      "/",
      "SHIFT"
    ],
    SHIFTED: [
      "SHIFT",
      "Z",
      "X",
      "C",
      "V",
      "B",
      "N",
      "M",
      "<",
      ">",
      "?",
      "SHIFT"
    ]
  },
  SPACE_ROW: {
    UNSHIFTED: ["CTRL", "FN", "ALT", " ", "ALT", "FN", "CTRL"],
    SHIFTED: ["CTRL", "FN", "ALT", " ", "ALT", "FN", "CTRL"]
  }
};

export const EN_ALL_KEYBOARD_KEYS = []
  .concat(
    EN_KEYBOARD_KEYS.TOP_ROW.UNSHIFTED,
    EN_KEYBOARD_KEYS.HOME_ROW.UNSHIFTED,
    EN_KEYBOARD_KEYS.BOTTOM_ROW.UNSHIFTED,
    EN_KEYBOARD_KEYS.SPACE_ROW.UNSHIFTED,
    EN_KEYBOARD_KEYS.TOP_ROW.SHIFTED,
    EN_KEYBOARD_KEYS.HOME_ROW.SHIFTED,
    EN_KEYBOARD_KEYS.BOTTOM_ROW.SHIFTED,
    EN_KEYBOARD_KEYS.SPACE_ROW.SHIFTED
  )
  .filter((value, index, self) => self.indexOf(value) === index);

export const EN_SHIFTED_KEYS = []
  .concat(
    EN_KEYBOARD_KEYS.TOP_ROW.SHIFTED,
    EN_KEYBOARD_KEYS.HOME_ROW.SHIFTED,
    EN_KEYBOARD_KEYS.BOTTOM_ROW.SHIFTED
  )
  .filter((value, index, self) => self.indexOf(value) === index);
