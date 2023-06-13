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
        values: ["vaesto"]
      }
    }
  ],
  response: {
    format: "json-stat2"
  }
};

const getData = async (hakuQuery) => {
  const url =
    "https://statfin.stat.fi/PxWeb/api/v1/en/StatFin/synt/statfin_synt_pxt_12dy.px";
  const res = await fetch(url, {
    method: "POST",
    headers: { "content-type": "application/json" },
    body: JSON.stringify(hakuQuery)
  });
  if (!res.ok) {
    return;
  }
  const data = await res.json();
  masterData = data;
  return data;
};

const getAreaData = async () => {
  const url =
    "https://statfin.stat.fi/PxWeb/api/v1/en/StatFin/synt/statfin_synt_pxt_12dy.px";
  const res = await fetch(url, {
    method: "GET"
  });
  const areaData = await res.json();

  return areaData;
};

const buildChart = async (data, hakuQuery, ehto) => {
  let loopLenght = 22;

  if (ehto === 0) {
    data = await getData(hakuQuery);
  } else {
    loopLenght = 23;
  }

  const alueet = Object.values(data.dimension.Alue.category.label);
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

const submitButton = document.getElementById("submit-data");

submitButton.addEventListener("click", async function (submitted) {
  submitted.preventDefault();
  const kunta = document.getElementById("input-area").value;

  const uusiQuery = jsonQuery;

  const areaData = await getAreaData();
  const areaCodes = Object.values(areaData.variables[1].values);
  const areaNames = Object.values(areaData.variables[1].valueTexts);

  for (let i = 0; i <= areaNames.length; i++) {
    if (
      kunta.localeCompare(areaNames[i], "fi", { sensitivity: "base" }) === 0
    ) {
      let apuLista = [];
      apuLista.push(areaCodes[i]);
      masterKunta = apuLista;
      sessionStorage.setItem("masterKunta", JSON.stringify(masterKunta));
    }
  }
  masterQuery = uusiQuery;
  buildChart(masterData, uusiQuery, 0);
});

const addDataButton = document.getElementById("add-data");

addDataButton.addEventListener("click", async function (clicked) {
  clicked.preventDefault();

  const luvutNyt = Object.values(masterData.value);

  let deltaValues = [];
  for (let i = 0; i <= luvutNyt.length - 2; i++) {
    const uusiLuku = luvutNyt[i + 1] - luvutNyt[i];
    deltaValues.push(uusiLuku);
  }

  let sumDelta = 0;

  for (let i = 0; i < deltaValues.length; i++) {
    //let apuLuku = 0;
    let apuLuku = deltaValues[i];

    sumDelta = sumDelta + apuLuku;
  }

  let trueDelta = sumDelta / deltaValues.length;

  const addDelta = trueDelta + luvutNyt[luvutNyt.length - 1];

  masterData.value.push(addDelta);
  masterData.dimension.Vuosi.category.label["2022"] = "2022";

  buildChart(masterData, masterQuery, 1);
});

let masterData = {};
let masterQuery = jsonQuery;
let masterKunta = ["SSS"];
sessionStorage.setItem("masterKunta", JSON.stringify(masterKunta));
buildChart(masterData, masterQuery, 0);
