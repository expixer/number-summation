
let sum = 0;

chrome.runtime.onMessage.addListener(({ name, data }) => {
  if (name === 'add-number') {
    const regionSelect = document.getElementById('region-select');
    // Get the number in selected text
    let numberFormat = ''
    if (regionSelect.value === 'Auto') {
      numberFormat = getNumberFormat(data.value);
    }
    else {
      numberFormat = regionSelect.value;
    }

    let num = numberFormat === 'US' ? findUSNumbers(data.value)[0]  : findEuroNumbers(data.value)[0];
    //Check if the text is a number and sum them
      sum += num;
      // Limit the sum to 2 decimal places
      sum = Math.round(sum * 100) / 100
      document.body.querySelector('#sum').innerText = sum;
      // Show selected numbers on the screen
      document.body.querySelector('#selected-numbers').innerText += (data.value[0] === '-' ? '-' : '+') +num + '\n';
    }
});

const reset = () => {
  sum = 0;
  document.body.querySelector('#sum').innerText = sum;
  document.body.querySelector('#selected-numbers').innerText = '';
}

// Adding event listener to the reset button
document.addEventListener('DOMContentLoaded', () => {
  const resetButton = document.getElementById('reset-btn');
  resetButton.addEventListener('click', reset);
});

function getNumberFormat(numberString) {
  const hasComma = numberString.includes(",");
  const hasPeriod = numberString.includes(".");

  if (hasComma && hasPeriod) {
    const lastComma = numberString.lastIndexOf(",");
    const lastPeriod = numberString.lastIndexOf(".");
    return lastComma > lastPeriod ? "European" : "US";
  } else if (hasComma) {
    return "US";
  } else if (hasPeriod) {
    return "European";
  } else {
    return "Unknown";
  }
}

function findEuroNumbers(text) {
  const regex = /\b-?\d{1,3}(?:\.\d{3})*(?:,\d{1,2})?\b/g;
  const matches = text.match(regex);
  if (!matches) return [];

  return matches.map(match => {
    const normalized = match.replace(/\./g, '').replace(',', '.');
    return parseFloat(normalized);
  });
}

function findUSNumbers(text) {
  const regex = /\b-?\d{1,3}(?:,\d{3})*(?:\.\d{1,2})?\b/g;
  const matches = text.match(regex);
  if (!matches) return [];

  return matches.map(match => {
    const normalized = match.replace(/,/g, '');
    return parseFloat(normalized);
  });
}