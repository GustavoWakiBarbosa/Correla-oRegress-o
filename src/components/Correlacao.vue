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
const isMobile = ref(false);

let chart;
const canvasRef = ref(null);
const data = ref({
  datasets: [
    {
      label: "Pontos",
      data: [],
      backgroundColor: "#203aec", // Define a cor dos pontos para azul claro.
    },
  ],
});

const config = ref({
  type: "scatter",
  data: data.value,
  options: {
    scales: {
      x: {
        type: "linear",
        position: "bottom",
      },
    },
  },
});

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
  if (window.innerWidth < 768) {
    isMobile.value = true;
  }
  const canvas = canvasRef.value;

  // Calcule a linha de melhor ajuste e adicione ao conjunto de dados
  const bestFitLine = calculateBestFitLine(data.value.datasets[0].data);
  data.value.datasets.push({
    type: "line",
    label: "Linha",
    data: bestFitLine,
    borderColor: "#4d61f0",
    borderWidth: 1,
    fill: false,
    showLine: true,
    pointRadius: 0,
  });

  chart = new Chart(canvas, config.value);
});

function isEmpty() {
  let empty = false;
  linhas.value.forEach((e) => {
    if (e.x == "" || e.y == "") {
      empty = true;
    } else {
      empty = false;
    }
  });
  if (isEmpty == false) {
    changeGraphich();
  }
  return empty;
}

function changeGraphich() {
  data.value.datasets[0].data = linhas.value;
  const linhasNumber = linhas.value.map((linha) => ({
    x: Number(linha.x),
    y: Number(linha.y),
  }));
  data.value.datasets[1].data = calculateBestFitLine(linhasNumber);
  chart.update();
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
  if (isEmpty() == false && linhas.value.length > 0) {
    transformLines();
    var pontos = x.value.map((x, i) => [x, y.value[i]]);
    var resultado = regression.linear(pontos);
    return resultado.equation[0].toFixed(4);
  }
}

function correl() {
  if (isEmpty() == false && linhas.value.length > 0) {
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
  if (isEmpty() == false && linhas.value.length > 0) {
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
  if (isEmpty() == false && linhas.value.length > 0) {
    changeGraphich();
    retaRegressao.value = `Y = ${cftInclinacao.value}X + ${cftLinear.value}`;
  }
  if (!isEmpty() && estimate.value[0] != "") {
    estimate.value[2] = (
      Number(cftInclinacao.value) * Number(estimate.value[0]) +
      Number(cftLinear.value)
    ).toFixed(4);
  }
  if (!isEmpty() && estimate.value[1] != "") {
    estimate.value[3] = (
      (Number(estimate.value[1]) - Number(cftLinear.value)) /
      Number(cftInclinacao.value)
    ).toFixed(4);
  }
});

let mudancaInterna = false;

watchEffect(() => {
  if (numRows.value != 0) {
    const diff = numRows.value - linhas.value.length;
    let tempLinhas = [...linhas.value]; // Cria uma cópia de linhas.value
    if (diff > 0) {
      for (let i = 0; i < diff; i++) {
        tempLinhas.push({ x: "", y: "" });
      }
    } else if (diff < 0) {
      tempLinhas.splice(numRows.value);
    }
    linhas.value = tempLinhas; // Atualiza linhas.value com os novos valores
    infoEmpty.value = linhas.value.length === 0;
  }
});
</script>

<template>
  <div
    class="px-6 lg:px-20 py-20 bg-container flex-col lg:flex-row flex gap-10 items-center justify-center"
    :class="isMobile ? '' : 'h-screen'"
  >
    <div class="w-full lg:w-auto flex flex-col gap-4">
      <div class="bg-[#111827] p-8 rounded-2xl">
        <form>
          <div class="mb-6">
            <label
              for="email"
              class="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
              >Número de linhas:</label
            >
            <input
              type="number"
              id="rows"
              v-model="numRows"
              class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
              placeholder="Digite um número inteiro"
              required
            />
          </div>
          <div class="grid gap-6 md:grid-cols-2">
            <div>
              <label
                for="rows"
                class="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                >Nome coluna X:</label
              >
              <input
                type="text"
                id="rows"
                v-model="colunas[0]"
                class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                placeholder="X"
                required
              />
            </div>
            <div>
              <label
                for="rows"
                class="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                >Nome coluna Y:</label
              >
              <input
                type="text"
                id="rows"
                v-model="colunas[1]"
                class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                placeholder="Y"
                required
              />
            </div>
            <div>
              <label
                for="rows"
                class="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                >Estime {{ colunas[1] }} cujo {{ colunas[0] }} é:</label
              >
              <input
                type="text"
                id="rows"
                v-model="estimate[0]"
                class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                placeholder=""
                required
              />
              <p class="text-ett-primary-50 mt-2">{{ estimate[2] }}</p>
            </div>
            <div>
              <label
                for="rows"
                class="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                >Estime {{ colunas[0] }} cujo {{ colunas[1] }} é:</label
              >
              <input
                type="text"
                id="rows"
                v-model="estimate[1]"
                class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                placeholder=""
                required
              />
              <p class="text-ett-primary-50 mt-2">{{ estimate[3] }}</p>
            </div>
          </div>
        </form>
      </div>
      <div class="bg-[#111827] p-8 rounded-2xl mt-4">
        <p class="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
          Coeficiente de Inclinação: {{ cftInclinacao }}
        </p>
        <p class="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
          Coeficiente de Regressão: {{ cftRegressao }}
        </p>
        <p class="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
          Coeficiente Linear: {{ cftLinear }}
        </p>
        <p class="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
          Reta de Regressão ( Y = aX + b ): {{ retaRegressao }}
        </p>
      </div>
    </div>

    <div class="flex flex-col 2xl:flex-row gap-10">
      <div
        v-if="!infoEmpty"
        class="relative overflow-x-auto animate-fade-up animate-once animate-ease-in-out animate-normal animate-fill-forwards"
      >
        <table
          class="w-full text-sm text-left text-gray-500 dark:text-gray-400"
        >
          <thead
            class="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-[#374151] dark:text-gray-400"
          >
            <tr>
              <th
                v-for="(coluna, index) in colunas"
                :key="index"
                scope="col"
                class="text-center px-6 py-3 text-ett-primary-50"
              >
                {{ coluna }}
              </th>
            </tr>
          </thead>
          <tbody>
            <tr
              v-for="(linha, index) in linhas"
              :key="index"
              class="bg-white border-b dark:bg-[#111827] dark:border-[#374151]"
            >
              <th
                scope="row"
                class="px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white"
              >
                <input
                  type="text"
                  class="text-center dark:bg-[#111827] dark:border-[#374151]"
                  v-model="linhas[index].x"
                />
              </th>
              <th
                scope="row"
                class="px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white"
              >
                <input
                  type="text"
                  class="text-center dark:bg-[#111827] dark:border-[#374151]"
                  v-model="linhas[index].y"
                />
              </th>
            </tr>
          </tbody>
        </table>
      </div>
      <div class="p-4 md:w-[500px] max-h-[266px] bg-ett-primary-50 rounded-md">
        <canvas ref="canvasRef"></canvas>
      </div>
    </div>
  </div>
</template>

<style>
.bg-container {
  background-image: url("/src/assets/bgs/bghero.jpg");
  background-size: cover;
  background-position: center;
  background-repeat: no-repeat;
}
/* 
@media (max-width: 767px) {
  .bg-container {
    height: 100vh;
  }
} */
</style>
