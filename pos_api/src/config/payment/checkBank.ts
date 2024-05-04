import { getDeviceId } from "./ultil";
import { handleLogin, getHistories } from "./envBankPayment";
require('dotEnv').config();

export const checkBank = async (a:any) => {
  try {
    const deviceId = getDeviceId();
    const username = process.env.BANK_USERNAME;
    const password = process.env.BANK_PASSWORD;
    const accountId = process.env.BANK_ACCOUNT_ID;
    const login = await handleLogin(username, password, deviceId);
    if (login.access_token) {
        const waitting = setInterval(async () => {
            const histories = await getHistories(login.access_token, accountId, deviceId);
            if (histories.length != 0) {
                const filteredTransactions = histories.transactionInfos.filter((transaction:any) => transaction.creditDebitIndicator === 'CRDT'); //CRDT (+), DBIT(-)
                // const transactionsWithoutCategory = filteredTransactions.map(({...transaction }) => transaction);
                const transactionsWithoutCategory = filteredTransactions.find((transaction:any) => transaction.description === `123` && transaction.amount == `2100`);
                
                console.log(transactionsWithoutCategory);
                if (transactionsWithoutCategory) {
                    clearInterval(waitting);
                    return true
                }
            }
        }, 5000);
        setTimeout(() => {
            clearInterval(waitting);
        }, 5 * 60 * 1000); // stop interval after 5 minutes
    }
  } catch (error:any) {
    throw error
  }
}
