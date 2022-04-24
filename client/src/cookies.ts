interface ColorCookie {
  expires: Date;
  backgroundColorIndex: number;
  colorIndex: number;
}

function updateCookie(key: string, value: string) {
  document.cookie = `${key}=${value}`;
}

const cookieProxyHandler: ProxyHandler<ColorCookie> = {
  get(target: ColorCookie, prop: string) {
    switch (prop) {
      case 'expires':
        return target.expires;
      case 'backgroundColorIndex':
        return target.backgroundColorIndex;
      case 'colorIndex':
        return target.colorIndex;
      default:
        return undefined;
    }
  },
  set(target: ColorCookie, prop: string, value: number | Date) {
    if (prop === 'expires' && value instanceof Date) {
      target.expires = value;
      updateCookie(prop, value.toUTCString());
      return true;
    }

    // No need to check for NaN as assignment won't allow anything not a date or number
    value = value as number;

    if (prop === 'backgroundColorIndex') {
      target.backgroundColorIndex = value;
      updateCookie(prop, `${value}`);
      return true;
    }

    if (prop === 'colorIndex') {
      target.colorIndex = value;
      updateCookie(prop, `${value}`);
      return true;
    }

    return false;
  },
};

function parseCookie(cookie: string) {
  const cookiePairs = cookie.split(';').map((pair) => pair.trim());
  const cookieObj: ColorCookie = {
    expires: new Date(),
    backgroundColorIndex: 0,
    colorIndex: 0,
  };

  cookiePairs.forEach((pair) => {
    const [key, value] = pair
      .split('=')
      .map((splitString) => splitString.trim());

    switch (key) {
      case 'expires':
        cookieObj.expires = new Date(value);
        break;
      case 'backgroundColorIndex':
        cookieObj.backgroundColorIndex = Number(value);
        break;
      case 'colorIndex':
        cookieObj.colorIndex = Number(value);
        break;
      default:
        console.error(`unhandled key in cookie parse: ${key}`);
    }
  });

  return new Proxy(cookieObj, cookieProxyHandler);
}

export default function getCookies() {
  const { cookie } = document;

  if (cookie === '') {
    const today = new Date();
    const nextWeek = new Date(
      today.getFullYear(),
      today.getMonth(),
      today.getDate() + 7
    );

    const newCookie = new Proxy(
      {
        expires: nextWeek,
        backgroundColorIndex: 0,
        colorIndex: 0,
      },
      cookieProxyHandler
    );

    updateCookie('expires', newCookie.expires.toUTCString());
    updateCookie('backgroundColorIndex', `${newCookie.backgroundColorIndex}`);
    updateCookie('colorIndex', `${newCookie.colorIndex}`);

    return newCookie;
  }

  return parseCookie(cookie);
}
