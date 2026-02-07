/**
 * Alien Motorsport - Calculadora de Combustível 2026
 * Script para cálculo de mistura de combustível E40-E85
 * Versão com arredondamento para números inteiros
 */

/**
 * Calcula a mistura de combustível baseado nos parâmetros selecionados
 */
function calcularMistura() {
  // Obter valores dos inputs
  const tipo = document.getElementById("tipo").value;
  const quantidadeTotal = parseFloat(document.getElementById("quantidade1").value) || 0;
  const tipoGasolina = document.getElementById("tipoGasolina").value;

  // Validar entrada
  if (quantidadeTotal <= 0) {
    alert("⚠️ Por favor, insira uma quantidade válida de litros");
    document.getElementById("quantidade1").focus();
    return;
  }

  if (quantidadeTotal > 10000) {
    alert("⚠️ Quantidade muito alta. Máximo: 10.000 litros");
    return;
  }

  // Percentual de etanol na gasolina (Premium 25%, Comum 30%)
  const percentualEtanolNaGasolina = tipoGasolina === "Premium" ? 0.25 : 0.30;

  // Proporções de etanol para cada tipo de mistura
  const proporcoes = {
    E40: 0.40,
    E50: 0.50,
    E63: 0.63,
    E70: 0.70,
    E75: 0.75,
    E80: 0.80,
    E85: 0.85,
  };

  const percentualEtanolDesejado = proporcoes[tipo];

  // Fórmula de cálculo:
  // Gasolina necessária = (Total × (1 - %Etanol desejado)) / (1 - %Etanol na gasolina)
  // Etanol necessário = Total - Gasolina necessária
  
  let gasolinaNecessaria =
    (quantidadeTotal * (1 - percentualEtanolDesejado)) /
    (1 - percentualEtanolNaGasolina);
  let etanolNecessario = quantidadeTotal - gasolinaNecessaria;

  // Arredondar para o número inteiro mais próximo
  gasolinaNecessaria = Math.round(gasolinaNecessaria);
  etanolNecessario = Math.round(etanolNecessario);

  // Ajustar se a soma não for igual à quantidade total (compensar arredondamento)
  let totalCalculado = gasolinaNecessaria + etanolNecessario;
  
  if (totalCalculado < quantidadeTotal) {
    // Se faltou, adiciona ao que for maior
    if (gasolinaNecessaria >= etanolNecessario) {
      gasolinaNecessaria++;
    } else {
      etanolNecessario++;
    }
  } else if (totalCalculado > quantidadeTotal) {
    // Se sobrou, remove do que for maior
    if (gasolinaNecessaria >= etanolNecessario) {
      gasolinaNecessaria--;
    } else {
      etanolNecessario--;
    }
  }

  // Atualizar a exibição do resultado
  exibirResultado(gasolinaNecessaria, etanolNecessario, quantidadeTotal, tipoGasolina);
}

/**
 * Exibe o resultado do cálculo na interface com animação
 * @param {number} gasolina - Quantidade de gasolina em litros
 * @param {number} etanol - Quantidade de etanol em litros
 * @param {number} total - Quantidade total em litros
 * @param {string} tipoGasolina - Tipo de gasolina (Premium ou Comum)
 */
function exibirResultado(gasolina, etanol, total, tipoGasolina) {
  const resultadoDiv = document.getElementById("resultado");
  
  // Atualizar label com tipo de gasolina
  const gasolinaLabel = document.getElementById("resultado-gasolina-label");
  gasolinaLabel.innerText = "Gasolina " + tipoGasolina + ":";
  
  // Atualizar valores com números inteiros
  document.getElementById("resultado-gasolina").innerText = 
    Math.round(gasolina) + "L";
  document.getElementById("resultado-etanol").innerText = 
    Math.round(etanol) + "L";
  document.getElementById("resultado-total").innerText = 
    Math.round(total) + "L";
  
  // Mostrar resultado com animação
  resultadoDiv.classList.remove("show");
  
  // Forçar reflow para reiniciar animação
  void resultadoDiv.offsetWidth;
  
  resultadoDiv.classList.add("show");
}

/**
 * Inicializar event listeners
 */
document.addEventListener("DOMContentLoaded", function() {
  // Permitir calcular ao pressionar Enter no input de quantidade
  document.getElementById("quantidade1").addEventListener("keypress", function(event) {
    if (event.key === "Enter") {
      calcularMistura();
    }
  });

  // Permitir calcular ao mudar o tipo de mistura
  document.getElementById("tipo").addEventListener("change", function() {
    if (document.getElementById("quantidade1").value) {
      calcularMistura();
    }
  });

  // Permitir calcular ao mudar o tipo de gasolina
  document.getElementById("tipoGasolina").addEventListener("change", function() {
    if (document.getElementById("quantidade1").value) {
      calcularMistura();
    }
  });

  // Focar no input de quantidade ao carregar
  document.getElementById("quantidade1").focus();
});
