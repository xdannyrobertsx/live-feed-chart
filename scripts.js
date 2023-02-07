// variables


const newChart =  () => {
  liveFeedChart.destroy();
 
  liveFeedChart = new Chart(myChart, userOptions);
};

// data fetch and cleanup
const url =
  "https://thrillshare-cmsv2.services.thrillshare.com/api/v2/s/108979/live_feeds?page_size=100";

const fetchData = async (endpoint) => {
  const res = await fetch(endpoint);
  return await res.json();
};

const cleanData = (rawData) => {
  let lf_cleanData = {};
  rawData.forEach((post) => {
    if (lf_cleanData[post.author_name]) {
      lf_cleanData[post.author_name] += 1;
    } else {
      lf_cleanData[post.author_name] = 1;
    }
  });
console.log(lf_cleanData)
  return lf_cleanData;
  // Object.keys(lf_cleanData)
  // Object.values(lf_cleanData)
};

fetchData(url)
  .then((res) => cleanData(res.live_feeds))
  .then((lf_object) => {
    userOptions.data.labels = Object.keys(lf_object);
    userOptions.data.datasets[0].data = Object.values(lf_object);
    newChart()
  });

// user defined options

// chart writing

document.querySelector("#chartTypes").addEventListener("change", () => {
  userOptions.type = document.querySelector("#chartTypes").value.toLowerCase();
  
  newChart()
});

Chart.defaults.global.defaultFontFamily = "Lato";
Chart.defaults.global.defaultFontSize = 18;
Chart.defaults.global.defaultFontColor = "#777";

let myChart = document.getElementById("myChart").getContext("2d");



let chartType = "bar"


let userOptions = {
  type: chartType,
  data: {
    labels: ["No Data Available"],
    datasets: [
      {
        label: "Live Feed Posts",
        data: [0],
        //backgroundColor:'green',
        backgroundColor: [
          "rgba(255, 99, 132, 0.6)",
          "rgba(54, 162, 235, 0.6)",
          "rgba(255, 206, 86, 0.6)",
          "rgba(75, 192, 192, 0.6)",
          "rgba(153, 102, 255, 0.6)",
          "rgba(255, 159, 64, 0.6)",
          "rgba(255, 99, 132, 0.6)",
             "rgba(255, 99, 132, 0.6)",
          "rgba(54, 162, 235, 0.6)",
          "rgba(255, 206, 86, 0.6)",
          "rgba(75, 192, 192, 0.6)",
          "rgba(153, 102, 255, 0.6)",
          "rgba(255, 159, 64, 0.6)",
          "rgba(255, 99, 132, 0.6)",
        ],
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
      text: "Largest Cities In Massachusetts",
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
        left: 50,
        right: 0,
        bottom: 0,
        top: 0,
      },
    },
    tooltips: {
      enabled: true,
    },
  },
};


let liveFeedChart = new Chart(myChart, userOptions);