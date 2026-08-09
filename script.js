/**
 * Alien Motorsport - Calculadora de Mistura de Combustível
 * Calcula a proporção de gasolina + etanol para atingir uma mistura E40-E85
 */

const CHAVE_STORAGE = "alien-calc-ultima-mistura";

const PERCENTUAL_ETANOL_NA_GASOLINA = {
  Premium: 0.25,
  Comum: 0.32,
};

const PROPORCOES_MISTURA = {
  E40: 0.40,
  E50: 0.50,
  E63: 0.63,
  E70: 0.70,
  E75: 0.75,
  E80: 0.80,
  E85: 0.85,
};

/**
 * Calcula a mistura de combustível baseado nos parâmetros selecionados
 */
function calcularMistura() {
  const tipo = document.getElementById("tipo").value;
  const quantidadeTotal = parseFloat(document.getElementById("quantidade1").value) || 0;
  const tipoGasolina = document.getElementById("tipoGasolina").value;

  esconderErro();

  if (quantidadeTotal <= 0) {
    mostrarErro("Insira uma quantidade válida de litros.");
    document.getElementById("quantidade1").focus();
    return;
  }

  if (quantidadeTotal > 10000) {
    mostrarErro("Quantidade muito alta. Máximo de 10.000 litros.");
    return;
  }

  const percentualEtanolNaGasolina = PERCENTUAL_ETANOL_NA_GASOLINA[tipoGasolina];
  const percentualEtanolDesejado = PROPORCOES_MISTURA[tipo];

  // Gasolina necessária = (Total x (1 - %Etanol desejado)) / (1 - %Etanol na gasolina)
  // Etanol necessário = Total - Gasolina necessária
  let gasolinaNecessaria =
    (quantidadeTotal * (1 - percentualEtanolDesejado)) /
    (1 - percentualEtanolNaGasolina);
  let etanolNecessario = quantidadeTotal - gasolinaNecessaria;

  gasolinaNecessaria = Math.round(gasolinaNecessaria);
  etanolNecessario = Math.round(etanolNecessario);

  // Compensa o arredondamento para que a soma bata com o total informado
  const totalCalculado = gasolinaNecessaria + etanolNecessario;
  if (totalCalculado < quantidadeTotal) {
    if (gasolinaNecessaria >= etanolNecessario) {
      gasolinaNecessaria++;
    } else {
      etanolNecessario++;
    }
  } else if (totalCalculado > quantidadeTotal) {
    if (gasolinaNecessaria >= etanolNecessario) {
      gasolinaNecessaria--;
    } else {
      etanolNecessario--;
    }
  }

  exibirResultado(gasolinaNecessaria, etanolNecessario, quantidadeTotal, tipoGasolina, tipo);
  salvarUltimaMistura(tipo, quantidadeTotal, tipoGasolina);
}

function exibirResultado(gasolina, etanol, total, tipoGasolina, tipo) {
  const resultadoDiv = document.getElementById("resultado");

  document.getElementById("resultado-gasolina-label").innerText = "Gasolina " + tipoGasolina;
  document.getElementById("resultado-gasolina").innerText = gasolina + " L";
  document.getElementById("resultado-etanol").innerText = etanol + " L";
  document.getElementById("resultado-total").innerText = total + " L";
  document.getElementById("resultado-mistura-tag").innerText = tipo;

  const pctGasolina = total > 0 ? (gasolina / total) * 100 : 0;
  const pctEtanol = 100 - pctGasolina;
  const barraGasolina = document.getElementById("barra-gasolina");
  const barraEtanol = document.getElementById("barra-etanol");
  barraGasolina.style.width = pctGasolina + "%";
  barraEtanol.style.width = pctEtanol + "%";
  document.getElementById("barra-gasolina-pct").innerText = gasolina + " L";
  document.getElementById("barra-etanol-pct").innerText = etanol + " L";

  resultadoDiv.classList.remove("show");
  void resultadoDiv.offsetWidth;
  resultadoDiv.classList.add("show");
}

function mostrarErro(mensagem) {
  const erroDiv = document.getElementById("erro");
  erroDiv.innerText = mensagem;
  erroDiv.classList.add("show");
}

function esconderErro() {
  const erroDiv = document.getElementById("erro");
  erroDiv.classList.remove("show");
  erroDiv.innerText = "";
}

function salvarUltimaMistura(tipo, quantidade, tipoGasolina) {
  try {
    localStorage.setItem(
      CHAVE_STORAGE,
      JSON.stringify({ tipo, quantidade, tipoGasolina })
    );
  } catch (erro) {
    // Armazenamento indisponível (modo privado, etc.) - segue sem persistir
  }
}

function carregarUltimaMistura() {
  try {
    const dados = JSON.parse(localStorage.getItem(CHAVE_STORAGE));
    if (!dados) return;
    if (dados.tipo) document.getElementById("tipo").value = dados.tipo;
    if (dados.tipoGasolina) document.getElementById("tipoGasolina").value = dados.tipoGasolina;
    if (dados.quantidade) document.getElementById("quantidade1").value = dados.quantidade;
  } catch (erro) {
    // Ignora dados corrompidos
  }
}

document.addEventListener("DOMContentLoaded", function () {
  carregarUltimaMistura();

  document.getElementById("quantidade1").addEventListener("keypress", function (event) {
    if (event.key === "Enter") {
      calcularMistura();
    }
  });

  document.getElementById("tipo").addEventListener("change", function () {
    if (document.getElementById("quantidade1").value) {
      calcularMistura();
    }
  });

  document.getElementById("tipoGasolina").addEventListener("change", function () {
    if (document.getElementById("quantidade1").value) {
      calcularMistura();
    }
  });

  document.getElementById("quantidade1").focus();

  document.getElementById("ano-atual").innerText = new Date().getFullYear();
});
