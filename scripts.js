// variables

const newChart = () => {
  liveFeedChart.destroy();

  liveFeedChart = new Chart(myChart, userOptions);
  
  liveFeedChart.canvas.parentNode.style.width = '1200px';
};

// data fetch and cleanup
const url =
  "https://thrillshare-cmsv2.services.thrillshare.com/api/v2/s/108979/live_feeds?page_size=200";

const fetchData = async (endpoint) => {
  const res = await fetch(endpoint);
  return await res.json();
};

const cleanData = (rawData) => {
  console.log(rawData)
  let lf_cleanData = {};
  const currentYear = new Date().getFullYear()
  rawData.forEach((post) => {
    let postYear = parseInt(post.time.split("-")[0])
    if (currentYear == postYear) {
       if (lf_cleanData[post.author_name]) {
        lf_cleanData[post.author_name] += 1;
      } else {
        lf_cleanData[post.author_name] = 1;
      }
    }

  });
  let sortedArray = Object.entries(lf_cleanData).sort((a, b) => b[1] - a[1]);
  let lf_cleanData_sorted = Object.fromEntries(sortedArray);
  console.log(lf_cleanData_sorted);
  return lf_cleanData_sorted;
};

fetchData(url)
  .then((res) => cleanData(res.live_feeds))
  .then((lf_object) => {
    userOptions.data.labels = Object.keys(lf_object);
    userOptions.data.datasets[0].data = Object.values(lf_object);
    newChart();
  });

// user defined options

// chart writing

document.querySelector("#chartTypes").addEventListener("change", () => {
  userOptions.type = document.querySelector("#chartTypes").value;
  newChart();
});

// Chart.defaults.global.defaultFontFamily = "Lato";
Chart.defaults.global.defaultFontSize = 14;
Chart.defaults.global.defaultFontColor = "#777";

let myChart = document.getElementById("myChart").getContext("2d");

let chartType = "horizontalBar";

let userOptions = {
  type: chartType,
  data: {
    labels: ["No Data Available"],
    datasets: [
      {
        label: "Live Feed Posts",
        data: [0],
        backgroundColor: "#078287",
        borderWidth: 1,
        borderColor: "#777",
        hoverBorderWidth: 3,
        hoverBorderColor: "#000",
      },
    ],
  },
  options: {
    title: {
      display: true,
      text: "Live Feed Posts",
      fontSize: 25,
    },
    legend: {
      display: false,
      position: "right",
      labels: {
        fontColor: "#000",
      },
    },
    layout: {
      padding: {
        left: 0,
        right: 0,
        bottom: 0,
        top: 0,
      },
      
    },
    tooltips: {
      enabled: true,
    },
    responsive: true,
    maintainAspectRatio: true,
    scales: {
      yAxes: [{
        ticks: {
          beginAtZero: true,
        }
      }]
    },
    plugins: {
      datalabels: {
        anchor: 'end',
        align: 'top',
        formatter: Math.round,
        font: {
          weight: 'bold'
        }
      }
    }
  },
  
};

let liveFeedChart = new Chart(myChart, userOptions);
