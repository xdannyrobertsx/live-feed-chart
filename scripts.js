// variables
const LIVE_FEED_DATA = new Object();
const currentMonth = new Date().getMonth() + 1;
const currentYear = new Date().getFullYear();

const url = "./data.json";
// const url = "https://thrillshare-cmsv2.services.thrillshare.com/api/v2/s/108979/live_feeds?page_size=200"

const fetchData = async (endpoint) => {
  const res = await fetch(endpoint);
  return await res.json();
};

const cleanData = (rawData) => {
  LIVE_FEED_DATA.rawData = rawData;
  const unsortedArray = filterData(rawData, LIVE_FEED_DATA.chartType);
  const sortedArray = Object.entries(unsortedArray).sort((a, b) => b[1] - a[1]);
  const sortedObject = Object.fromEntries(sortedArray);
  return sortedObject;
};

const filterData = (postArr, range) => {
  const lf_cleanData = new Object();
  postArr.forEach((post) => {
    let postMonth = parseInt(post.time.split("-")[1]);
    let postYear = parseInt(post.time.split("-")[0]);

    if (range == "year") {
      if (currentYear == postYear) {
        if (lf_cleanData[post.author_name]) {
          lf_cleanData[post.author_name] += 1;
        } else {
          lf_cleanData[post.author_name] = 1;
        }
      }
    } else if (range == "month") {
      if (currentMonth == postMonth) {
        if (lf_cleanData[post.author_name]) {
          lf_cleanData[post.author_name] += 1;
        } else {
          lf_cleanData[post.author_name] = 1;
        }
      }
    }
  });
  return lf_cleanData;
};

const newChart = () => {
  // destroying old chart
  liveFeedChart.destroy();

  // updating user object
  let newChartData = cleanData(LIVE_FEED_DATA.rawData);
  LIVE_FEED_DATA.names = Object.keys(newChartData);
  LIVE_FEED_DATA.postData = Object.values(newChartData);
  userOptions.data.labels = LIVE_FEED_DATA.names;
  userOptions.data.datasets[0].data = LIVE_FEED_DATA.postData;

  //chart creation
  liveFeedChart = new Chart(myChart, userOptions);

  // styling
  // liveFeedChart.canvas.parentNode.style.width = "1200px";
};

fetchData(url)
  .then((res) => cleanData(res.live_feeds))
  .then((lf_object) => {
    LIVE_FEED_DATA.names = Object.keys(lf_object);
    LIVE_FEED_DATA.postData = Object.values(lf_object);
    newChart();
  });

// user defined options

// chart writing

const chartSelect = document.querySelector("#chartTypes");
LIVE_FEED_DATA.chartType = chartSelect.value;

chartSelect.addEventListener("change", () => {
  LIVE_FEED_DATA.chartType = chartSelect.value;
  newChart();
  console.log(LIVE_FEED_DATA.chartType);
});

// Chart.defaults.global.defaultFontFamily = "Lato";
Chart.defaults.global.defaultFontSize = 14;
Chart.defaults.global.defaultFontColor = "#777";

let myChart = document.getElementById("myChart").getContext("2d");

let chartType = "horizontalBar";

let userOptions = {
  type: chartType,
  data: {
    labels: LIVE_FEED_DATA.names,
    datasets: [
      {
        label: "Live Feed Posts",
        data: LIVE_FEED_DATA.postData,
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
      yAxes: [
        {
          ticks: {
            beginAtZero: true,
          },
        },
      ],
    },
    plugins: {
      datalabels: {
        anchor: "end",
        align: "top",
        formatter: Math.round,
        font: {
          weight: "bold",
        },
      },
    },
  },
};

let liveFeedChart = new Chart(myChart, userOptions);
