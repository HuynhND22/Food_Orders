"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getHistories = exports.handleLogin = void 0;
const axios_1 = __importDefault(require("axios"));
const axios_retry_1 = __importDefault(require("axios-retry"));
const moment_timezone_1 = __importDefault(require("moment-timezone"));
(0, axios_retry_1.default)(axios_1.default, {
    retries: 3,
});
function handleLogin(username, password, deviceId) {
    return __awaiter(this, void 0, void 0, function* () {
        const data = {
            username,
            password,
            step_2FA: "VERIFY",
            deviceId,
        };
        const config = {
            headers: {
                APP_VERSION: "2024.02.24",
                Accept: "application/json, text/plain, */*",
                "Accept-Language": "vi",
                Authorization: "Bearer",
                Connection: "keep-alive",
                "Content-Type": "application/json",
                DEVICE_ID: deviceId,
                DEVICE_NAME: "Chrome",
                Origin: "https://ebank.tpb.vn",
                PLATFORM_NAME: "WEB",
                PLATFORM_VERSION: "122",
                Referer: "https://ebank.tpb.vn/retail/vX/",
                SOURCE_APP: "HYDRO",
                "Sec-Fetch-Dest": "empty",
                "Sec-Fetch-Mode": "cors",
                "Sec-Fetch-Site": "same-origin",
                "User-Agent": "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/122.0.0.0 Safari/537.36",
                "sec-ch-ua": '"Chromium";v="122", "Not(A:Brand";v="24", "Google Chrome";v="122"',
                "sec-ch-ua-mobile": "?0",
                "sec-ch-ua-platform": '"macOS"',
            },
        };
        try {
            const response = yield axios_1.default.post("https://ebank.tpb.vn/gateway/api/auth/login", data, config);
            return response.data;
        }
        catch (error) {
            throw error;
        }
    });
}
exports.handleLogin = handleLogin;
function getHistories(token, accountId, deviceId) {
    return __awaiter(this, void 0, void 0, function* () {
        const fromDate = (0, moment_timezone_1.default)().tz('Asia/Ho_Chi_Minh').format('YYYYMMDD hh:mm:ss');
        const toDate = (0, moment_timezone_1.default)().tz('Asia/Ho_Chi_Minh').format('YYYYMMDD hh:mm:ss');
        const data = {
            pageNumber: 1,
            pageSize: 400,
            accountNo: accountId,
            currency: "VND",
            maxAcentrysrno: "",
            fromDate: fromDate,
            toDate: toDate,
            keyword: "",
        };
        const config = {
            headers: {
                APP_VERSION: "2024.02.24",
                Accept: "application/json, text/plain, */*",
                "Accept-Language": "vi,en-US;q=0.9,en;q=0.8",
                Authorization: `Bearer ${token}`,
                Connection: "keep-alive",
                "Content-Type": "application/json",
                DEVICE_ID: deviceId,
                DEVICE_NAME: "Chrome",
                Origin: "https://ebank.tpb.vn",
                PLATFORM_NAME: "WEB",
                PLATFORM_VERSION: "122",
                SOURCE_APP: "HYDRO",
                "Sec-Fetch-Dest": "empty",
                "Sec-Fetch-Mode": "cors",
                "Sec-Fetch-Site": "same-origin",
                "User-Agent": "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
                "sec-ch-ua": '"Chromium";v="122", "Not(A:Brand";v="24", "Google Chrome";v="122"',
                "sec-ch-ua-mobile": "?0",
                "sec-ch-ua-platform": '"macOS"',
            },
        };
        try {
            const response = yield axios_1.default.post("https://ebank.tpb.vn/gateway/api/smart-search-presentation-service/v2/account-transactions/find", data, config);
            return response.data;
        }
        catch (error) {
            console.log('error: ' + error);
            throw error;
        }
    });
}
exports.getHistories = getHistories;
