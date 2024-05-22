"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.handleUniqueError = void 0;
const handleUniqueError = (error) => {
    const regex = /The duplicate key value is \((.*?)\)/;
    let message = error.originalError.message.match(regex);
    message[1] = '[' + message[1] + ']' + ' already exists';
    return message;
};
exports.handleUniqueError = handleUniqueError;
