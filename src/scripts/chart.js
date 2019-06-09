// view-source:http://www.chartjs.org/samples/latest/charts/bar/vertical.html
function generateChart(args) {

  args = args || {};
  args.data = args.data || [];
  args.label = args.label || "";
  args.title = args.title || "";

  var colors = {
    "blue":   "rgb(54, 162, 235)",
    "red":    "rgb(255, 99, 132)",
    "green":  "rgb(75, 192, 192)",
    "grey":   "rgb(201, 203, 207)",
    "orange": "rgb(255, 159, 64)",
    "purple": "rgb(153, 102, 255)",
    "yellow": "rgb(255, 205, 86)"
  }
  var colorNames = Object.keys(colors);

  var barChartData = {
    // labels: ["January", "February", "March", "April", "May", "June", "July"],
    datasets: [{
      label: args.label,
      backgroundColor: colors['red'],
      borderColor: colors['red'],
      borderWidth: 1,
      data: args.data
    }]
  }

  var ctx = document.getElementById("canvas").getContext("2d");
  var chart = new Chart(ctx, {
    type: 'bar',
    data: barChartData,
    options: {
      responsive: true,
      legend: {
        position: 'top',
      },
      title: {
        display: true,
        text: args.title
      }
    }
  });

  return chart;

}

module.exports = generateChart;
