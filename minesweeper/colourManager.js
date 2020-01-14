function localStorageSupported() {
    let val = "testingStringThatWontBeUsedForValues";
    try {
        localStorage.setItem(val, val);
        localStorage.removeItem(val);
        return true;
    } catch (e) {
        return false;
    }
}

const locStoSupport = localStorageSupported();

function isDarkTheme() {
    if (locStoSupport) {
        return JSON.parse(localStorage.darktheme) === true;
    }
    return false;
}

function toggleDarkTheme() {
    if (locStoSupport) {
        localStorage.darktheme = JSON.parse(localStorage.darktheme) ? false : true;
    }
}

const lightThemeColours = {
    1: { r: 0, g: 204, b: 0 }, // green
    2: { r: 0, g: 204, b: 255 }, // light blue
    3: { r: 153, g: 102, b: 255 }, // purple
    4: { r: 0, g: 0, b: 255 }, // blue
    5: { r: 0, g: 0, b: 0 }, // black
    6: { r: 0, g: 153, b: 153 }, // teal?
    7: { r: 255, g: 102, b: 0 }, // orange
    8: { r: 255, g: 0, b: 0 }, // red
    covered: { r: 200, g: 200, b: 200 }, // light gray
    empty: { r: 255, g: 255, b: 255 }, // white
    flag: { r: 51, g: 51, b: 51 }, // dark gray
    highlight: { r: 0, g: 255, b: 0, a: 150 } // green with alpha
};

const darkThemeColours = {
    1: { r: 0, g: 204, b: 0 }, // green
    2: { r: 0, g: 204, b: 255 }, // light blue
    3: { r: 250, g: 166, b: 19 }, // light orange
    4: { r: 25, g: 11, b: 40 }, // dark purple
    5: { r: 166, g: 61, b: 64 }, // "smoky topaz"
    6: { r: 231, g: 249, b: 169 }, // yellow
    7: { r: 255, g: 102, b: 0 }, // dark orange
    8: { r: 0, g: 0, b: 255 }, // blue
    covered: { r: 80, g: 80, b: 80 }, // dark gray
    empty: { r: 130, g: 130, b: 130 }, // white
    flag: { r: 0, g: 0, b: 0 }, // dark gray
    highlight: { r: 0, g: 255, b: 0, a: 100 } // green with alpha
};
