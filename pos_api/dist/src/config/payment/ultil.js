"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getDeviceId = void 0;
function makeDeviceId(t) {
    let e = "", n = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789", o = n.length;
    for (let i = 0; i < t; i++)
        e += n.charAt(Math.floor(Math.random() * o));
    return e;
}
function getDeviceId() {
    return makeDeviceId(45);
}
exports.getDeviceId = getDeviceId;
