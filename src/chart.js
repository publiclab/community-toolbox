
// view-source:http://www.chartjs.org/samples/latest/charts/bar/vertical.html

var color = Chart.helpers.color;
  var barChartData = {
    labels: ["January", "February", "March", "April", "May", "June", "July"],
    datasets: [{
      label: 'Dataset 1',
      backgroundColor: color(window.chartColors.red).alpha(0.5).rgbString(),
      borderColor: window.chartColors.red,
      borderWidth: 1,
      data: [
      ]
    }]
}

var ctx = document.getElementById("canvas").getContext("2d");
window.myBar = new Chart(ctx, {
  type: 'bar',
  data: barChartData,
  options: {
    responsive: true,
    legend: {
      position: 'top',
    },
    title: {
      display: true,
      text: 'Chart.js Bar Chart'
    }
  }
});
