import "./styles.css";
import { Chart } from "frappe-charts";

const jsonQuery = {
  query: [
    {
      code: "Vuosi",
      selection: {
        filter: "item",
        values: [
          "2000",
          "2001",
          "2002",
          "2003",
          "2004",
          "2005",
          "2006",
          "2007",
          "2008",
          "2009",
          "2010",
          "2011",
          "2012",
          "2013",
          "2014",
          "2015",
          "2016",
          "2017",
          "2018",
          "2019",
          "2020",
          "2021"
        ]
      }
    },
    {
      code: "Alue",
      selection: {
        filter: "item",
        values: ["SSS"]
      }
    },
    {
      code: "Tiedot",
      selection: {
        filter: "item",
        values: ["vm01"]
      }
    }
  ],
  response: {
    format: "json-stat2"
  }
};

const getData = async (hakuQuery) => {
  console.log("ok tähän asti");
  const url =
    "https://statfin.stat.fi/PxWeb/api/v1/en/StatFin/synt/statfin_synt_pxt_12dy.px";
  const res = await fetch(url, {
    method: "POST",
    headers: { "content-type": "application/json" },
    body: JSON.stringify(hakuQuery)
  });
  console.log(res);
  if (!res.ok) {
    console.log("Res ei ok!");
    return;
  }
  const data = await res.json();
  masterData = data;
  return data;
};

/*
const buildChart = async (data, hakuQuery, ehto) => {
  let loopLenght = 22;

  data = await getData(hakuQuery);
  console.log(data);

  const alueet = Object.values(data.variables[1].valueTexts);
  const labels = Object.values(data.dimension.Vuosi.category.label);
  const values = data.value;

  alueet.forEach((alue, index) => {
    let vakiluku = [];
    for (let i = 0; i < loopLenght; i++) {
      vakiluku.push(values[i * 1 + index]);
    }

    alueet[index] = {
      name: alue,
      values: vakiluku
    };
  });

  const chartData = {
    labels: labels,
    datasets: alueet
  };

  const chart = new Chart("#chart", {
    title: "Population in Finland",
    data: chartData,
    type: "line",
    height: 450,
    colors: ["#eb5146"]
  });
};

*/

const masterKunta = JSON.parse(sessionStorage.getItem("masterKunta"));
jsonQuery.query[1].selection.values = masterKunta;
console.log(masterKunta);

let masterData = {};
//buildChart(jsonQuery);
