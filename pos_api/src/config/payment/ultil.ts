function makeDeviceId(t:any) {
    let e = "",
      n = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789",
      o = n.length;
    for (let i = 0; i < t; i++) e += n.charAt(Math.floor(Math.random() * o));
    return e;
  }
  
export function getDeviceId() {
    return makeDeviceId(43);
  }