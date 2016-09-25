/**
 * Urlifies a list of parameters to have '/' between them. Ignores nulls or empty.
 *
 * urlify('a', null, 'c', '')  --> 'a/c'
 * @param arguments... A vararg amount of parameters to add '/' between.
 * @return a string with '/' between each element.
 */
export function urlify() {
  if(!arguments || !arguments.length) {
    return null;
  }

  let s = '';
  for(let i = 0; i < arguments.length; i++) {
    const arg = arguments[i];
    if(!arg) {
      continue;
    }

    const isFirstCharSlash = arg.charAt(0) === '/';
    s = s + (s && !isFirstCharSlash ? '/' : '') + arg;
  }
  return s;
}

export function join(joinWith, ...args) {
  if(!args || !args.length) {
    return null;
  }

  let s = '';
  for(let i = 0; i < args.length; i++) {
    const arg = args[i];
    if(!arg) {
      continue;
    }

    const isFirstCharJoiner = arg.charAt(0) === joinWith;
    s = s + (s && !isFirstCharJoiner ? joinWith : '') + arg;
  }
  return s;
}