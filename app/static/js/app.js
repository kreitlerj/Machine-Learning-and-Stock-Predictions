// Define function to calculate the mean error between the actual close and the prediction
function errorCalc(close, pred) {
    var diff = [];
    var sum = 0;
    var error;
    
    // Create array holding the difference between each close and pred value
    for (var i = 0; i < close.length; i++) {
        diff.push(close[i] - pred[i]);
    };
    
    // Calculate the sum of the differences
    for (var i = 0; i < diff.length; i++) {
        sum = sum + diff[i];
    };
    
    // Calculate the mean error
    error = sum / diff.length;
    
    return error;
};

// Define the function to build the predictions plot    
function buildPredictionChart(data, stock) {
    var prices = Object.values(data);
    var dates = Object.keys(data);
    
    // Reformat the dates
    dates.forEach(function(part, index) {
        dates[index] = new Date(parseInt(part)).toISOString().split('T')[0];
    });
    
    // Create and fill the data arrays needed to build the plot
    var actual = [];
    var sixty_day = [];
    var thirty_day = [];
    var ten_day = [];
    
    prices.forEach(function(element) {
        actual.push(element.close);
        sixty_day.push(element.sixty);
        thirty_day.push(element.thirty);
        ten_day.push(element.ten);
    });
    dates.pop();
    actual.pop();
    
    var predictions = {"sixty": sixty_day.pop(), "thirty": thirty_day.pop(), "ten": ten_day.pop()}

    // Build the traces for the plot
    var trace1 = {
        x: dates,
        y: actual,
        type: "scatter",
        name: "Actual"
    };

    var trace2 = {
        x: dates,
        y: sixty_day,
        type: "scatter",
        name: "Pred 60d"
    };

    var trace3 = {
        x: dates,
        y: thirty_day,
        type: "scatter",
        name: "Pred 30d"
    };

    var trace4 = {
        x: dates,
        y: ten_day,
        type: "scatter",
        name: "Pred 10d"
    };
    
    // Combine the traces into an array
    var d = [trace1, trace2, trace3, trace4];
    
    // Define the layout of the plot
    var layout = {
        title: "Close Price Predictions",
        paper_bgcolor:"#222",
        plot_bgcolor: "#222",
        font: {
            color: "white"
        },
        xaxis: {
            rangeslider: {
                visible: true
            }
        }
    };
    
    // Plot the data
    Plotly.newPlot("pred-plot", d, layout);
    
    // Calculate the mean errors of the predictions
    var errors = {
        "sixty": errorCalc(actual, sixty_day),
        "thirty": errorCalc(actual, thirty_day),
        "ten": errorCalc(actual, ten_day)
    };
    
    // Build the prediction cards on the html page
    buildPredCards(predictions, errors);
    
};

// Define the function to update the dashboard when a new stock is searched
function inputChanged(ticker) {
    updateDashboard(ticker);
};

// Define the function to build the candlestick plot    
function buildStockChart(data) {
    var prices = Object.values(data);
    var dates = Object.keys(data);
    
    // Reformat the dates
    dates.forEach(function(part, index) {
        dates[index] = new Date(parseInt(part)).toISOString().split('T')[0];
    });
    
    // Create and fill the data arrays needed to build the plot
    var open = [];
    var close = [];
    var high = [];
    var low = [];

    prices.forEach(function(element) {
        open.push(element.open);
        close.push(element.close);
        high.push(element.high);
        low.push(element.low);
    });
    
    dates.pop();
    open.pop();
    close.pop();
    high.pop();
    low.pop();
    // Build the trace for the plot
    var trace = {
        x: dates,
        close: close,
        high: high,
        low: low,
        open: open,
      
        // cutomise colors
        increasing: {line: {color: 'green'}},
        decreasing: {line: {color: 'red'}},
      
        type: 'candlestick'
    };
    
    // Put the trace into an array
    var d = [trace];
    
    // Create a layout for the plot
    var layout = {
        title: "Candlestick Chart",
        paper_bgcolor:"#222",
        plot_bgcolor: "#222",
        font: {
            color: "white"
        },
    };
    
    // Plot the candlestick chart
    Plotly.newPlot("candlestick-plot", d, layout);
};

// Define the function to populate the predictions cards on the page    
function buildPredCards(predictions, errors) {
    // define url to grab the current prediction
    //var url = "/predictions/" + stock;
    var error = errors;
    var predictions = predictions;
    
    document.getElementById("sixty_pred").innerHTML = "Prediction: " + predictions.sixty;
    document.getElementById("sixty_error").innerHTML = "Mean Error: " + error.sixty;
    document.getElementById("thirty_pred").innerHTML = "Prediction: " + predictions.thirty;
    document.getElementById("thirty_error").innerHTML = "Mean Error: " + error.thirty;
    document.getElementById("ten_pred").innerHTML = "Prediction: " + predictions.ten;
    document.getElementById("ten_error").innerHTML = "Mean Error: " + error.ten;
};

// Define the function to populate the current data card on the page    
function buildCurrentCard(data) {
    var open = data["1. open"];
    var high = data["2. high"];
    var low = data["3. low"];
    var current = data["4. close"];
    var volume = data["5. volume"];
    
    document.getElementById("open").innerHTML = "Open: " + open;
    document.getElementById("high").innerHTML = "High: " + high;
    document.getElementById("low").innerHTML = "Low: " + low;
    document.getElementById("volume").innerHTML = "Volume: " + volume;
    document.getElementById("current").innerHTML = "Current Price: " + current;
};



// Define the funtion to update the page    
function updateDashboard(stock) {
    // Create URL to grab data from the flask app
    var url1 = "/data/" + stock;
    
    // Retrive the data from flask to build the prediction chart and the candlestick chart input them into functions
    d3.json(url1, function(error, response) {
        console.log(response);
        buildPredictionChart(response);
        buildStockChart(response);
    });

    var url2 = "/current/" + stock;
    d3.json(url2, function(error, response) {
        console.log(response);
        buildCurrentCard(response);
    });

};

// Define the function that initializes the page
function init() {
    updateDashboard("AAPL")
};

// Fill the page with initial data
init();
