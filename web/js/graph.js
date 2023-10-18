$(document).ready(() => {
  google.charts.load('current', {packages: ["line", "bar", "corechart"]});

  function drawChart(){
    const chartsToDraw = [
      {
        name: "How does the flat storey affect Price?",
        slug: "/storey_range",
        type: "column",
        id: 0,
        headers: ["Storey Range", "Price"]
      }, {
        name: "How does the flat size affect Price?",
        slug: "/floor_area",
        type: "histogram",
        id: 1,
        headers: ["Floor area (in square meters)", "Price"]
      }
    ]
    chartsToDraw.forEach((chart) => {
      const statsContainer = document.getElementsByClassName("stats-container")[0]
      statsContainer.innerHTML += `<div class=container-${chart.id}></div>`
      let data = new google.visualization.DataTable()
      if (chart.type === "column") {
        axios.get(`${API_URL}${chart.slug}`).then((res) => {
          
          data = google.visualization.arrayToDataTable([chart.headers, ...res.data]);
          const options = {
            chart: {
              title: chart.name,
              
            },
            chartArea: {
              width: "125%"
            },
            vAxis: {
              title: chart.headers[1]
            },
            hAxis: {
              slantedText: true,
              slantedTextAngle: 90
            }
          }
          let drawn_chart = new google.charts.Bar(document.getElementsByClassName(`container-${chart.id}`)[0]);
          drawn_chart.draw(data, google.charts.Bar.convertOptions(options));

        });
      } else if (chart.type === "histogram") {
        axios.get(`${API_URL}${chart.slug}`).then((res) => {
          // console.log(res.data)
          const binSize = Object.keys(res.data)[0]
          const binnedData = res.data[binSize]
          chart.headers.forEach((header) => {
            data.addColumn("number", header)
          })
          data.addRows([...binnedData])
          const options = {
            chart: {
              title: chart.name,
              
            },
            chartArea: {
              width: "125%"
            },
            vAxis: {
              title: chart.headers[1]
            }
          }
          let drawn_chart = new google.charts.Line(document.getElementsByClassName(`container-${chart.id}`)[0]);
          drawn_chart.draw(data, google.charts.Line.convertOptions(options));
          // const options = {
          //   title: chart.name,
  
          //   vAxis: {
          //     title: chart.headers[1]
          //   }
          // }
          // let drawn_chart = new google.visualization.Histogram(document.getElementsByClassName(`container-${chart.id}`)[0]);
          // drawn_chart.draw(data, options);
          
          // document.getElementsByClassName(`container-${chart.id}`)[0].getElementsByTagName("svg")[0].setAttribute("preserveAspectRatio","xMinYMin meet")

        });
      }
    })

  }

  google.charts.setOnLoadCallback(drawChart);
});