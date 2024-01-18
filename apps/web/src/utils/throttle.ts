export default function throttle(fn: Function, delay = 100) {
  let timer: NodeJS.Timeout | null = null;
  let latestArgs: any[];
  return function (this: any, ...args: any[]) {
    if (timer) {
      latestArgs = args;
      return;
    }

    timer = setTimeout(() => {
      fn.apply(this, latestArgs);
      timer = null;
    }, delay);
  };
}
