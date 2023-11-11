<script setup>
import regression from "regression";
import calculateCorrelation from "calculate-correlation";
import { forEach } from "lodash";
import Chart from "chart.js/auto";

const numRows = ref(0);
const colunas = ref(["", ""]);
const infoEmpty = ref(true);
const estimate = ref(["", "", "", ""]);
const linhas = ref([]);
const cftInclinacao = ref();
const cftRegressao = ref();
const cftLinear = ref();
const retaRegressao = ref();
const x = ref([]);
const y = ref([]);

function isEmpty() {
  let empty = false;
  linhas.value.forEach((e) => {
    if (e.x == "" || e.y == "") {
      empty = true;
    } else {
      empty = false;
    }
  });
  return empty;
}

function transformLines() {
  x.value = [];
  y.value = [];
  for (let i = 0; i < linhas.value.length; i++) {
    x.value.push(Number(linhas.value[i].x));
    y.value.push(Number(linhas.value[i].y));
  }
}

function slope() {
  if (isEmpty() == false) {
    transformLines();
    var pontos = x.value.map((x, i) => [x, y.value[i]]);
    var resultado = regression.linear(pontos);
    return resultado.equation[0].toFixed(4);
  }
}

function correl() {
  if (isEmpty() == false) {
    transformLines();
    try {
      const correlation = calculateCorrelation(x.value, y.value) ** 2;
      return correlation.toFixed(4);
    } catch {
      console.log("erro");
    }
  }
}

function intercept() {
  if (isEmpty() == false) {
    transformLines();
    let xMean = x.value.reduce((a, b) => a + b, 0) / x.value.length;
    let yMean = y.value.reduce((a, b) => a + b, 0) / y.value.length;
    let b = yMean - cftInclinacao.value * xMean;
    b = b.toFixed(4);
    return b;
  }
}

watchEffect(() => {
  cftInclinacao.value = slope();
  cftRegressao.value = correl();
  cftLinear.value = intercept();
  retaRegressao.value = `Y = ${cftInclinacao.value}X + ${cftLinear.value}`;
  if (!isEmpty() && estimate.value[0] != "") {
    estimate.value[2] = (
      Number(cftInclinacao.value) * Number(estimate.value[0]) +
      Number(cftLinear.value)
    ).toFixed(4);
  }
  if (!isEmpty) {
    const newData = linhas.value.map((e) => ({
      x: parseFloat(e.x),
      y: parseFloat(e.y),
    }));
    chart.data.datasets[0].data = newData;
    chart.update();
  }
});

watchEffect(() => {
  linhas.value = [];
  for (let i = 0; i < numRows.value; i++) {
    linhas.value.push({ x: "", y: "" });
    infoEmpty.value = false;
  }
});

let chart;
const canvasRef = ref(null);

// Função para calcular a linha de melhor ajuste
function calculateBestFitLine(data) {
  let xSum = 0,
    ySum = 0,
    xySum = 0,
    xsqSum = 0;
  data.forEach((point) => {
    xSum += point.x;
    ySum += point.y;
    xySum += point.x * point.y;
    xsqSum += point.x * point.x;
  });
  const n = data.length;
  const slope = (n * xySum - xSum * ySum) / (n * xsqSum - xSum * xSum);
  const intercept = (ySum - slope * xSum) / n;

  return data.map((point) => ({
    x: point.x,
    y: slope * point.x + intercept,
  }));
}

onMounted(() => {
  const canvas = canvasRef.value;

  const data = {
    datasets: [
      {
        label: "Pontos",
        data: [
          {
            x: -10,
            y: 0,
          },
          {
            x: 0,
            y: 10,
          },
          {
            x: 10,
            y: 5,
          },
        ],
        backgroundColor: "#203aec", // Define a cor dos pontos para azul claro.
      },
    ],
  };

  // Calcule a linha de melhor ajuste e adicione ao conjunto de dados
  const bestFitLine = calculateBestFitLine(data.datasets[0].data);
  data.datasets.push({
    type: "line",
    label: "Linha",
    data: bestFitLine,
    borderColor: "#4d61f0", // A linha será vermelha.
    borderWidth: 1,
    fill: false,
    showLine: true,
    pointRadius: 0, // Não mostre pontos individuais para a linha de melhor ajuste.
  });

  const config = {
    type: "scatter",
    data: data,
    options: {
      scales: {
        x: {
          type: "linear",
          position: "bottom",
        },
      },
    },
  };

  chart = new Chart(canvas, config);
});
</script>

<template>
  <div class="px-20 py-20 bg-container flex gap-10 items-center justify-center">
    <div class="flex flex-col gap-4">
      <div class="flex flex-col">
        <div class="flex gap-2">
          <label for="rows" class="text-edx-primary-50"
            >Número de linhas:</label
          >
          <input
            type="number"
            id="rows"
            v-model="numRows"
            class="max-w-[8.5rem]"
          />
        </div>
        <div class="flex flex-col gap-4 mt-4">
          <div class="flex gap-2">
            <label for="rows" class="text-edx-primary-50">Nome coluna X:</label>
            <input
              type="text"
              id="rows"
              v-model="colunas[0]"
              class="max-w-[8.5rem]"
            />
          </div>
          <div class="flex gap-2">
            <label for="rows" class="text-edx-primary-50">Nome coluna Y:</label>
            <input
              type="text"
              id="rows"
              v-model="colunas[1]"
              class="max-w-[8.5rem]"
            />
          </div>
          <div class="flex flex-col">
            <div class="flex gap-2 mt-4">
              <label for="rows" class="text-edx-primary-50"
                >Estime {{ colunas[0] }} cujo {{ colunas[1] }} é:</label
              >
              <input
                type="text"
                id="rows"
                v-model="estimate[0]"
                class="max-w-[8.5rem]"
              />
            </div>
            <p class="text-edx-primary-50">{{ estimate[2] }}</p>
          </div>
          <div class="flex flex-col">
            <div class="flex gap-2">
              <label for="rows" class="text-edx-primary-50"
                >Estime {{ colunas[1] }} cujo {{ colunas[0] }} é:</label
              >
              <input
                type="text"
                id="rows"
                v-model="estimate[1]"
                class="max-w-[8.5rem]"
              />
            </div>
            <p class="text-edx-primary-50">{{ estimate[3] }}</p>
          </div>
        </div>

        <p class="text-edx-primary-50 mt-8">
          Coeficiente de Inclinação: {{ cftInclinacao }}
        </p>
        <p class="text-edx-primary-50 mt-4">
          Coeficiente de Regressão: {{ cftRegressao }}
        </p>
        <p class="text-edx-primary-50 mt-4">
          Coeficiente Linear: {{ cftLinear }}
        </p>
        <p class="text-edx-primary-50 mt-4">
          Reta de Regressão ( Y = aX + b ): {{ retaRegressao }}
        </p>
      </div>
    </div>
    <div v-if="!infoEmpty" class="relative overflow-x-auto">
      <table class="w-full text-sm text-left text-gray-500 dark:text-gray-400">
        <thead
          class="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400"
        >
          <tr>
            <th
              v-for="(coluna, index) in colunas"
              :key="index"
              scope="col"
              class="text-center px-6 py-3 text-edx-primary-50"
            >
              {{ coluna }}
            </th>
          </tr>
        </thead>
        <tbody>
          <tr
            v-for="(linha, index) in linhas"
            :key="index"
            class="bg-white border-b dark:bg-gray-800 dark:border-gray-700"
          >
            <th
              scope="row"
              class="px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white"
            >
              <input
                type="text"
                class="text-center dark:bg-gray-800 dark:border-gray-700"
                v-model="linhas[index].x"
              />
            </th>
            <th
              scope="row"
              class="px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white"
            >
              <input
                type="text"
                class="text-center dark:bg-gray-800 dark:border-gray-700"
                v-model="linhas[index].y"
              />
            </th>
          </tr>
        </tbody>
      </table>
      <div></div>
    </div>
    <div class="p-4 w-[500px] bg-edx-primary-50 rounded-md">
      <canvas ref="canvasRef"></canvas>
    </div>
  </div>
</template>

<style>
.bg-container {
  background-image: url("/src/assets/bgs/bghero.jpg");
  background-size: cover;
  background-position: center;
  background-repeat: no-repeat;
  width: 100%;
  height: 100vh;
}
</style>
