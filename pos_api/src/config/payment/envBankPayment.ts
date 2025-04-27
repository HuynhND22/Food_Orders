import axios from "axios";
import axiosRetry from "axios-retry";
import moment from 'moment-timezone';
import dayjs from 'dayjs';

axiosRetry(axios,
  {
    retries: 3,
  }
)

export async function handleLogin(username:any, password:any, deviceId:any, transactionId:string = '') {
  const data = {
    username,
    password,
    // step_2FA: "VERIFY",
    deviceId,
    transactionId: transactionId
  };

  // const config = {
  //   headers: {
  //     APP_VERSION: "2024.02.24",
  //     Accept: "application/json, text/plain, */*",
  //     "Accept-Language": "vi",
  //     Authorization: "Bearer",
  //     Connection: "keep-alive",
  //     "Content-Type": "application/json",
  //     DEVICE_ID: deviceId,
  //     DEVICE_NAME: "Chrome",
  //     Origin: "https://ebank.tpb.vn",
  //     PLATFORM_NAME: "WEB",
  //     PLATFORM_VERSION: "122",
  //     Referer: "https://ebank.tpb.vn/retail/vX/",
  //     SOURCE_APP: "HYDRO",
  //     "Sec-Fetch-Dest": "empty",
  //     "Sec-Fetch-Mode": "cors",
  //     "Sec-Fetch-Site": "same-origin",
  //     "User-Agent":
  //       "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/122.0.0.0 Safari/537.36",
  //     "sec-ch-ua":
  //       '"Chromium";v="122", "Not(A:Brand";v="24", "Google Chrome";v="122"',
  //     "sec-ch-ua-mobile": "?0",
  //     "sec-ch-ua-platform": '"macOS"',
  //   },
  // };

  const config = {
    headers: {
      APP_VERSION: dayjs().format('YYYY.MM.DD'), // cập nhật cho đúng như header thật
      Accept: "application/json, text/plain, */*",
      "Accept-Encoding": "gzip, deflate, br, zstd",
      "Accept-Language": "vi-VN,vi;q=0.8",
      Authorization: "Bearer", // chỗ này thường phải có token, nếu không có thì có thể bị lỗi 401 hoặc 409
      Connection: "keep-alive",
      "Content-Type": "application/json",
      DEVICE_ID: deviceId,
      DEVICE_NAME: "Safari",
      Origin: "https://ebank.tpb.vn",
      PLATFORM_NAME: "WEB",
      PLATFORM_VERSION: "16", // đã cập nhật theo header thật
      Referer: "https://ebank.tpb.vn/retail/vX/",
      SOURCE_APP: "HYDRO",
      "Sec-Fetch-Dest": "empty",
      "Sec-Fetch-Mode": "cors",
      "Sec-Fetch-Site": "same-origin",
      "Sec-GPC": "1",
      USER_NAME: "HYD", // thêm USER_NAME như header gốc
      "User-Agent":
        "Mozilla/5.0 (iPhone; CPU iPhone OS 16_6 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/16.6 Mobile/15E148 Safari/604.1",
    },
    withCredentials: true, // để đảm bảo gửi kèm cookie nếu cần
  };

  try {
    console.log('env data: ', data)
    const response = await axios.post(
      "https://ebank.tpb.vn/gateway/api/auth/login/v3",
      data,
      config
    );
    return response.data;
  } catch (error:any) {
    // console.log('env: ', error.response)
    if (error.response) {
      // console.error(
      //   `Error ${error.response.status}:`,
      //   error.response.data
      // );
      return error.response.data;
    } else {
      console.error("Unknown error:", error.message);
      throw error;
    }
  }
}

export async function getHistories(token:any, accountId:any, deviceId:any) {
  const fromDate = moment().tz('Asia/Ho_Chi_Minh').format('YYYYMMDD hh:mm:ss');
  const toDate = moment().tz('Asia/Ho_Chi_Minh').format('YYYYMMDD hh:mm:ss');

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
      "User-Agent":
        "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
      "sec-ch-ua":
        '"Chromium";v="122", "Not(A:Brand";v="24", "Google Chrome";v="122"',
      "sec-ch-ua-mobile": "?0",
      "sec-ch-ua-platform": '"macOS"',
    },
  };

  try {
    const response = await axios.post(
      "https://ebank.tpb.vn/gateway/api/smart-search-presentation-service/v2/account-transactions/find",
      data,
      config
    );
    return response.data;
  } catch (error) {
    console.log('error: ' + error);
    throw error;
  }
}

export async function verify(transactionId:string, rsaToken:string, deviceId:string) {

  const data = {
    rsaToken: rsaToken,
    transactionId: transactionId
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
      "User-Agent":
        "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/122.0.0.0 Safari/537.36",
      "sec-ch-ua":
        '"Chromium";v="122", "Not(A:Brand";v="24", "Google Chrome";v="122"',
      "sec-ch-ua-mobile": "?0",
      "sec-ch-ua-platform": '"macOS"',
    },
  };

  try {
    const response = await axios.get(
      "https://ebank.tpb.vn/gateway/api/auth/transaction/check",
      config
    );
    return response.data;
  } catch (error) {
    console.log('error: ' + error);
    throw error;
  }
}

export async function getBankList(token:any, deviceId:any) {

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
      "User-Agent":
        "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
      "sec-ch-ua":
        '"Chromium";v="122", "Not(A:Brand";v="24", "Google Chrome";v="122"',
      "sec-ch-ua-mobile": "?0",
      "sec-ch-ua-platform": '"macOS"',
    },
  };

  try {
    const response = await axios.get(
      "https://ebank.tpb.vn/gateway/api/common-presentation-service/v1/bank-accounts?function=home",
      config
    );
    return response.data;
  } catch (error) {
    console.log('error: ' + error);
    throw error;
  }
}

