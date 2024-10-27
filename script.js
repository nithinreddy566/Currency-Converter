const amountInput = document.getElementById("amount");
const fromCurrencySelect = document.getElementById("fromCurrency");
const toCurrencySelect = document.getElementById("toCurrency");
const convertBtn = document.getElementById("convertBtn");
const resultDisplay = document.getElementById("result");

const apiUrl = 'https://api.exchangerate-api.com/v4/latest/USD';

// Fetch currency data if not already in session storage
async function fetchCurrencyData() {
    try {
        let data = sessionStorage.getItem("currencyData");
        if (data) {
            data = JSON.parse(data);
            populateCurrencyOptions(data.rates);
        } else {
            const response = await fetch(apiUrl);
            data = await response.json();
            sessionStorage.setItem("currencyData", JSON.stringify(data));
            populateCurrencyOptions(data.rates);
        }
    } catch (error) {
        console.error("Error fetching currency data:", error);
        resultDisplay.textContent = "Failed to fetch currency data.";
    }
}

// Populate currency dropdowns
function populateCurrencyOptions(rates) {
    fromCurrencySelect.innerHTML = "";
    toCurrencySelect.innerHTML = "";
    Object.keys(rates).forEach(currency => {
        const option = document.createElement('option');
        option.value = currency;
        option.textContent = currency;
        fromCurrencySelect.appendChild(option);
        toCurrencySelect.appendChild(option.cloneNode(true));
    });
}

// Convert currency
async function convertCurrency() {
    const amount = amountInput.value;
    const fromCurrency = fromCurrencySelect.value;
    const toCurrency = toCurrencySelect.value;

    if (amount && fromCurrency && toCurrency) {
        try {
            let data = JSON.parse(sessionStorage.getItem("currencyData"));
            if (!data) {
                const response = await fetch(apiUrl);
                data = await response.json();
                sessionStorage.setItem("currencyData", JSON.stringify(data));
            }
            const rate = data.rates[toCurrency] / data.rates[fromCurrency];
            const convertedAmount = (amount * rate).toFixed(2);
            resultDisplay.textContent = `${amount} ${fromCurrency} = ${convertedAmount} ${toCurrency}`;
        } catch (error) {
            console.error("Error during conversion:", error);
            resultDisplay.textContent = "Conversion failed.";
        }
    } else {
        resultDisplay.textContent = "Please fill in all fields.";
    }
}

convertBtn.addEventListener('click', convertCurrency);
fetchCurrencyData();
