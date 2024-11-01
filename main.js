const apiKey = "2634e46168b066109b3598ac";
const apiUrlLatest = (currency) =>
  `https://v6.exchangerate-api.com/v6/${apiKey}/latest/${currency}`;

const currencyFromSelect = document.getElementById("currencyFrom");
const currencyToSelect = document.getElementById("currencyTo");
const amountInput = document.getElementById("amount");
const convertButton = document.getElementById("convertButton");
const resultInput = document.getElementById("result");

async function fetchCurrencyList() {
  const response = await fetch(apiUrlLatest("USD"));
  const data = await response.json();

  return Object.keys(data.conversion_rates).map((code) => ({
    code,
    name: code,
  }));
}

async function fetchRates(baseCurrency) {
  const response = await fetch(apiUrlLatest(baseCurrency));
  const data = await response.json();

  return data.conversion_rates;
}

async function populateCurrencySelects() {
  const currencyList = await fetchCurrencyList();

  currencyList.forEach(({ code }) => {
    const optionFrom = document.createElement("option");
    optionFrom.value = code;
    optionFrom.textContent = code;
    currencyFromSelect.appendChild(optionFrom);

    const optionTo = document.createElement("option");
    optionTo.value = code;
    optionTo.textContent = code;
    currencyToSelect.appendChild(optionTo);
  });
}

async function convertCurrency(amount, fromCode, toCode) {
  const rates = await fetchRates(fromCode);

  const fromRate = rates[fromCode];
  const toRate = rates[toCode];

  if (fromRate === undefined || toRate === undefined) {
    throw new Error("Не удалось получить курсы для одной из валют");
  }

  return (amount / fromRate) * toRate;
}

convertButton.addEventListener("click", async () => {
  const amount = parseFloat(amountInput.value);
  const fromCode = currencyFromSelect.value;
  const toCode = currencyToSelect.value;

  resultInput.value = "";
  resultInput.classList.remove("error");

  if (!amount || isNaN(amount)) {
    resultInput.value = "Введите корректную сумму";
    resultInput.classList.add("error");
    return;
  }

  try {
    const result = await convertCurrency(amount, fromCode, toCode);
    resultInput.value = `${result.toFixed(2)} ${toCode}`;
  } catch (error) {
    console.error(error);
    resultInput.value = "Ошибка конвертации";
    resultInput.classList.add("error");
  }
});

populateCurrencySelects();
