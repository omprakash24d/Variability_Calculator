let dataEntryStarted = false;

function beginDataEntry() {
    const numDataPointsInput = document.getElementById("numDataPoints");
    const numDataPoints = parseInt(numDataPointsInput.value);

    if (isNaN(numDataPoints) || numDataPoints <= 0) {
        alert("Please enter a valid number Of Observations.");
        return;
    }

    const dataEntrySection = document.getElementById("dataEntry");
    const dataInputs = document.getElementById("dataInputs");

    // Clear any existing data inputs
    dataInputs.innerHTML = "";

    // Create input fields for data values
    for (let i = 0; i < numDataPoints; i++) {
        const inputField = document.createElement("input");
        inputField.type = "number";
        inputField.placeholder = `Observation ${i + 1}`;
        dataInputs.appendChild(inputField);
    }

    // Display the data entry section
    dataEntrySection.style.display = "block";

    // Hide the "Start Data Entry" button
    document.getElementById("startDataEntry").style.display = "none";

    // Display the "Calculate" button
    document.getElementById("calculateButton").style.display = "block";

    dataEntryStarted = true;
}

function calculateVariability() {
    if (!dataEntryStarted) {
        alert("Please start data entry first by clicking 'Start Data Entry'.");
        return;
    }

    const dataInputs = document.querySelectorAll("#dataInputs input");
    const n = dataInputs.length;
    const data = [];

    for (const input of dataInputs) {
        const value = parseFloat(input.value);

        if (!isNaN(value)) {
            data.push(value);
        }
    }

    if (data.length !== n) {
        alert("Please enter valid numeric data for all data points.");
        return;
    }

    const sum = data.reduce((acc, value) => acc + value, 0);
    const mean = sum / n;

    // Mode Calculation
    function calculateMode(data) {
        // Count the occurrences of each data point
        const count = {};
        data.forEach((value) => {
            if (count[value] === undefined) {
                count[value] = 1;
            } else {
                count[value]++;
            }
        });
    
        // Find the mode(s)
        let modes = [];
        let maxCount = 0;
    
        for (const value in count) {
            if (count[value] > maxCount) {
                modes = [parseFloat(value)];
                maxCount = count[value];
            } else if (count[value] === maxCount) {
                modes.push(parseFloat(value));
            }
        }
    
        return modes;
    }
    //Median Calculator
    function calculateMedian(data) {
        const sortedData = data.slice().sort((a, b) => a - b);
        const n = sortedData.length;
    
        if (n % 2 === 0) {
            // If the dataset has an even number of values, the median is the average of the two middle values.
            const middle1 = sortedData[n / 2 - 1];
            const middle2 = sortedData[n / 2];
            return (middle1 + middle2) / 2;
        } else {
            // If the dataset has an odd number of values, the median is the middle value.
            return sortedData[Math.floor(n / 2)];
        }
    }
    

    // Calculate standard deviation
    const sumSquaredDeviations = data.reduce((acc, value) => acc + Math.pow(value - mean, 2), 0);
    const variance = sumSquaredDeviations / (n - 1);
    const stdDeviation = Math.sqrt(variance);

    // Calculate standard error
    const stdError = stdDeviation / Math.sqrt(n);

    // Calculate coefficient of variation
    const coefficientOfVariation = (stdDeviation / mean) * 100; // in percentage

    // Display the results
    document.getElementById("yourResult").style.display = "block";
    const resultElement = document.getElementById("results");
    resultElement.innerHTML = `
        <p>Mean: ${mean}</p>
        <p>Variance: ${variance}</p>
        <p>Standard Deviation: ${stdDeviation}</p>
        <p>Standard Error: ${stdError}</p>
        <p>Coefficient of Variation: ${coefficientOfVariation.toFixed(2)}%</p>
    `;

    createBarChart(mean, variance, stdDeviation, stdError, coefficientOfVariation);
    createLineChart(data);
    createPieChart(data);
}

function createBarChart(mean, variance, stdDeviation, stdError, coefficientOfVariation) {
    const ctx = document.getElementById('resultsChart').getContext('2d');
    new Chart(ctx, {
        type: 'bar',
        data: {
            labels: ['Mean', 'Variance', 'Std Deviation', 'Std Error', 'Coefficient of Variation'],
            datasets: [{
                label: 'Measures of Variability',
                data: [mean, variance, stdDeviation, stdError, coefficientOfVariation],
                backgroundColor: [
                    'rgba(255, 99, 132, 0.2)',
                    'rgba(54, 162, 235, 0.2)',
                    'rgba(255, 206, 86, 0.2)',
                    'rgba(75, 192, 192, 0.2)',
                    'rgba(153, 102, 255, 0.2)'
                ],
                borderColor: [
                    'rgba(255, 99, 132, 1)',
                    'rgba(54, 162, 235, 1)',
                    'rgba(255, 206, 86, 1)',
                    'rgba(75, 192, 192, 1)',
                    'rgba(153, 102, 255, 1)'
                ],
                borderWidth: 1
            }]
        },
        options: {
            scales: {
                y: {
                    beginAtZero: true
                }
            }
        }
    });
}

function createLineChart(data) {
    const ctx = document.getElementById('lineChart').getContext('2d');
    new Chart(ctx, {
        type: 'line',
        data: {
            labels: data.map((_, i) => i + 1),
            datasets: [{
                label: 'Data Points',
                data: data,
                borderColor: 'rgba(75, 192, 192, 1)',
                borderWidth: 1
            }]
        },
        options: {
            scales: {
                y: {
                    beginAtZero: true
                }
            }
        }
    });
}

function createPieChart(data) {
    const ctx = document.getElementById('pieChart').getContext('2d');
    new Chart(ctx, {
        type: 'pie',
        data: {
            labels: data.map((_, i) => 'Data Point ' + (i + 1)),
            datasets: [{
                label: 'Data Distribution',
                data: data,
                backgroundColor: [
                    'rgba(255, 99, 132, 0.2)',
                    'rgba(54, 162, 235, 0.2)',
                    'rgba(255, 206, 86, 0.2)',
                    'rgba(75, 192, 192, 0.2)',
                    'rgba(153, 102, 255, 0.2)'
                ]
            }]
        }
    });
}
