# Calculadora de Valor Líquido

## Descrição

Este projeto é uma calculadora de valor líquido desenvolvida para simplificar o processo de cálculo do montante total de transações, especialmente útil para pequenos negócios familiares que antes realizavam esse cálculo manualmente. A aplicação permite inserir transações de crédito e débito, selecionar a bandeira do cartão e o número de parcelas (quando aplicável), e calcula o valor líquido após a aplicação das taxas. Além disso, gera um arquivo Excel com o histórico de todas as transações e o montante total calculado.

## Funcionalidades

*   **Cálculo de Valor Líquido:** Calcula automaticamente o valor líquido de cada transação com base no tipo (crédito/débito), bandeira do cartão e número de parcelas.
*   **Suporte a Múltiplas Bandeiras:** Suporta as bandeiras Mastercard e Hipercard, com taxas configuráveis.
*   **Histórico de Transações:** Mantém um histórico de todas as transações inseridas, exibindo os detalhes (tipo, valor bruto, parcelas, bandeira, taxa e valor líquido) em uma tabela.
*   **Montante Total:** Calcula e exibe o montante total acumulado das transações.
*   **Exportação para Excel:** Permite exportar o histórico de transações e o montante total para um arquivo Excel (.xlsx) para facilitar o controle e a organização dos dados.
*   **Interface Simples e Intuitiva:** Design focado na usabilidade, tornando o processo de cálculo rápido e fácil.
*   **Zerar Montante:** Botão para zerar o montante total e limpar o histórico de transações.

## Tecnologias Utilizadas

*   **HTML:** Estrutura da página web.
*   **CSS:** Estilos visuais e layout.
*   **JavaScript:** Lógica da aplicação, cálculos e manipulação do DOM.
*   **XLSX (js-xlsx):** Biblioteca JavaScript para gerar arquivos Excel.

## Como Usar

1.  Clone este repositório:

    ```bash
    git clone <URL do seu repositório>
    ```

2.  Abra o arquivo `index.html` no seu navegador.

3.  Preencha o formulário com os dados da transação:
    *   Selecione o tipo de transação (Crédito ou Débito).
    *   Insira o valor bruto da transação.
    *   Se a transação for de crédito, selecione o número de parcelas.
    *   Selecione a bandeira do cartão.

4.  Clique no botão "Adicionar Transação". O valor líquido será calculado e adicionado ao histórico.

5.  O montante total será atualizado automaticamente.

6.  Para exportar os dados para Excel, clique no botão "Gerar Excel".

7.  Para zerar o montante total e limpar o histórico, clique no botão "Zerar Montante Total".

## Configuração

As taxas de juros para cada bandeira e número de parcelas são definidas diretamente no código JavaScript. Para alterar as taxas, edite o arquivo `script.js` e modifique as variáveis `taxasCreditoMaster`, `taxaDebitoMaster`, `taxasCreditoHiper` e `taxaDebitoHiper`.

## Contribuição

Contribuições são bem-vindas! Se você tiver alguma sugestão, correção de bug ou melhoria, sinta-se à vontade para abrir uma issue ou enviar um pull request.

## Licença

Este projeto está sob a licença [MIT](LICENSE).