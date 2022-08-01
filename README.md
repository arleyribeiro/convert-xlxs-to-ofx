
## Formato do excel esperado - extensão: xlsx

Informações das transações

Data movimentação | Descrição | Valor | Saldo | Data de início | Data final | 
| --- | --- | --- | --- | --- | --- |
06/05/2022 | TED BCO 77 AGE 0001 CTA | R$6.404,67 | R$6.405,75 | 01/05/2022 | 31/05/2022 |
06/05/2022 | TED BCO 77 AGE 0001 CTA - RETIRADA EM C/C | -R$6.400,00 | R$5,75 | | |

## Informações do banco

Criar no arquivo uma planilha com nome o *bank* o script irá usar essas infomações para gerar o OFX.
Número do banco | Nome | Agencia | Conta |
| --- | --- | --- | --- |
102 | XP Investimentos Corretora de Câmbio Títulos e Valores Mobiliários S.A | 0001 | 0000000 |

## Pasta bank_statement

Possui uma planilha *(ofx-example.xlsx)* com exemplo das informações necessárias

## Arquivo gerado

O arquivo gerado será salvo na pasta *data*

## Como executar o projeto

Execute o arquivo index.js na pasta *src* e responda as perguntas apresentadas no terminal

```
node src/index.js
```