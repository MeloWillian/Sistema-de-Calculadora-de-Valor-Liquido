// Definição das taxas (Objeto para melhor organização)
const taxas = {
    'M': { // Mastercard
        'C': [3.15, 5.49, 6.19, 6.99, 7.69, 8.49, 8.99, 9.99, 10.99, 11.49, 12.35, 12.39],
        'D': 1.35
    },
    'H': { // Hipercard
        'C': [4.34, 6.88, 7.58, 8.38, 9.08, 9.88, 10.38, 11.38, 12.38, 12.88, 13.74, 13.78],
        'D': 2.54
    }
};

// Variável para acumular o montante total
let montanteTotal = 0;

// Selecionar elementos do DOM (Nomes mais descritivos)
const formElement = document.getElementById('transaction-form');
const typeSelectElement = document.getElementById('type');
const amountInputElement = document.getElementById('amount');
const installmentsInputElement = document.getElementById('installments');
const installmentsGroupElement = document.getElementById('installments-group');
const brandSelectElement = document.getElementById('brand');
const currentNetDisplayElement = document.getElementById('current-net');
const totalAmountDisplayElement = document.getElementById('total-amount');
const historyBodyElement = document.getElementById('history-body');
const resetButtonElement = document.getElementById('reset-button');
const downloadExcelButtonElement = document.getElementById('download-excel');

// Função para formatar valor como moeda brasileira
function formatCurrency(value) {
    return value.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
}

// Função para mostrar/esconder o campo de parcelas
function toggleInstallmentsField() {
    const transactionType = typeSelectElement.value;
    if (transactionType === 'D') {
        installmentsGroupElement.classList.add('hidden');
        installmentsInputElement.required = false;
    } else {
        installmentsGroupElement.classList.remove('hidden');
        installmentsInputElement.required = true;
    }
}

// Adiciona listener para mudar visibilidade das parcelas ao trocar o tipo
typeSelectElement.addEventListener('change', toggleInstallmentsField);

// Chama a função uma vez no início para definir o estado inicial correto
toggleInstallmentsField();

// Adiciona listener para o envio do formulário (Adicionar Transação)
formElement.addEventListener('submit', function(event) {
    event.preventDefault();

    // Obter valores dos inputs (com tratamento de erros)
    const tipo = typeSelectElement.value;
    const bandeira = brandSelectElement.value;

    let valor = parseFloat(amountInputElement.value);
    if (isNaN(valor) || valor <= 0) {
        alert("Por favor, insira um valor válido para o montante (maior que zero).");
        amountInputElement.value = '';
        amountInputElement.focus();
        return;
    }

    let parcela = parseInt(installmentsInputElement.value, 10);
    if (tipo === 'C' && (isNaN(parcela) || parcela < 1 || parcela > 12)) {
        alert("Por favor, insira um número válido de parcelas (entre 1 e 12).");
        installmentsInputElement.value = '';
        installmentsInputElement.focus();
        return;
    }

    let taxaPercentual = 0;
    let valorLiquido = 0;

    // Lógica de Cálculo da Taxa (Usando o objeto taxas)
    if (taxas[bandeira] && taxas[bandeira][tipo]) {
        if (tipo === 'C') {
            const taxasCredito = taxas[bandeira][tipo];
            if (parcela >= 1 && parcela <= taxasCredito.length) {
                taxaPercentual = taxasCredito[parcela - 1];
            } else {
                alert(`Número de parcelas inválido para ${bandeira} (${parcela}). Use entre 1 e ${taxasCredito.length}.`);
                return;
            }
        } else {
            taxaPercentual = taxas[bandeira][tipo];
        }
    } else {
        alert("Bandeira ou tipo de transação inválido.");
        return;
    }

    // Cálculo do Valor Líquido
    const valorTaxa = valor * (taxaPercentual / 100);
    valorLiquido = valor - valorTaxa;

    // Atualizar Montante Total
    montanteTotal += valorLiquido;

    // Exibir Resultados
    currentNetDisplayElement.textContent = formatCurrency(valorLiquido);
    totalAmountDisplayElement.textContent = formatCurrency(montanteTotal);

    // Adicionar ao Histórico
    const newRow = historyBodyElement.insertRow();

    const cellType = newRow.insertCell();
    const cellAmount = newRow.insertCell();
    const cellInstallments = newRow.insertCell();
    const cellBrand = newRow.insertCell();
    const cellRate = newRow.insertCell();
    const cellNet = newRow.insertCell();

    cellType.textContent = (tipo === 'C') ? 'Crédito' : 'Débito';
    cellAmount.textContent = formatCurrency(valor);
    cellInstallments.textContent = (tipo === 'C') ? parcela : 'N/A';
    cellBrand.textContent = (bandeira === 'M') ? 'Mastercard' : 'Hipercard';
    cellRate.textContent = taxaPercentual.toFixed(2) + '%';
    cellNet.textContent = formatCurrency(valorLiquido);

    amountInputElement.value = '';
    amountInputElement.focus();
});

// Adiciona listener para o botão Zerar
resetButtonElement.addEventListener('click', function() {
    montanteTotal = 0;
    totalAmountDisplayElement.textContent = formatCurrency(montanteTotal);
    currentNetDisplayElement.textContent = formatCurrency(0);
    historyBodyElement.innerHTML = '';
    alert("Montante total e histórico foram zerados.");
});

// Função para exportar a tabela e o montante total para Excel
downloadExcelButtonElement.addEventListener('click', function() {
    // Obter a tabela de histórico
    const table = document.getElementById('transaction-history');

    // Criar uma planilha a partir da tabela de histórico
    const ws = XLSX.utils.table_to_sheet(table);

    // Adicionar o montante total como uma nova linha na planilha (DENTRO da tabela)
    const totalRow = [
        "", "", "", "", "Montante Total:", formatCurrency(montanteTotal) // Linha com o montante total
    ];

    // Obter o número de linhas existentes na planilha
    const range = XLSX.utils.decode_range(ws['!ref']);
    const numRows = range.e.r + 1; // Número da próxima linha disponível

    // Adicionar a linha do total na planilha
    XLSX.utils.sheet_add_aoa(ws, [totalRow], { origin: "A" + (numRows + 1) });

    // Atualizar o intervalo da planilha (importantíssimo!)
    ws['!ref'] = XLSX.utils.encode_range({ s: range.s, e: { r: numRows, c: range.e.c } });

    // Criar um novo workbook e adicionar a planilha
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Histórico de Transações");

    // Gerar o arquivo Excel e permitir o download
    XLSX.writeFile(wb, "transacoes_calculadora.xlsx");
});