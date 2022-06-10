
export function idPatternIsOk(id: string) {
  const idRegex = new RegExp(/^[a-z]+[a-z0-9\-_]{4,19}$/);

  if (idRegex.test(id)) {
    return true;
  } else {
    return false;
  }
}

export function pwPatternIsOk(pw: string) {
  const pwRegex = new RegExp(
    /^(?=.*[a-zA-z])(?=.*[0-9])(?=.*[$`~!@$!%*#^?&\\(\\)\-_=+]).{8,16}$/);

  if (pwRegex.test(pw)) {
    return true;
  } else {
    return false;
  }
}

export function userNamePatternIsOk(name: string) {
  const nameRegex = new RegExp(/^[a-zA-Zㄱ-힣][a-zA-Zㄱ-힣]*$/);

  if (nameRegex.test(name)) {
    return true;
  } else {
    return false;
  }
}

export function birthDatePatternIsOk(birthDate: string) {
  const birthDateRegex =
    new RegExp(/^(19[0-9][0-9]|20\d{2})(0[0-9]|1[0-2])(0[1-9]|[1-2][0-9]|3[0-1])$/);

  if (birthDateRegex.test(birthDate)) {
    return true;
  } else {
    return false;
  }
}

export function emailIsOk(s: string) {
  const emailRegex = new RegExp(
    /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/)

  if (emailRegex.test(s)) {
    return true;
  } else {
    return false;
  }
}
