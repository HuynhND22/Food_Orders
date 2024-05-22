"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.convertToSimpleString = void 0;
const convertToSimpleString = (str) => {
    return str.replace(/\s/g, '').normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase();
};
exports.convertToSimpleString = convertToSimpleString;
