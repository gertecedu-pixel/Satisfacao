# Pesquisa SENAI MS — GitHub Pages + Google Apps Script

Arquivos:
- `aula-inaugural.html`
- `satisfacao-uc.html`
- `conclusao-curso.html`
- `styles.css`
- `config.js`
- `Code.gs`

## 1. Google Sheets
Crie uma planilha vazia, copie o ID da URL e cole em `SPREADSHEET_ID` no `Code.gs`.
No Apps Script, execute manualmente `setupPlanilha()` uma vez. Serão criadas as abas:
- `Aula_Inaugural`
- `Satisfacao_UC`
- `Conclusao_Curso`

## 2. Apps Script
Implante como **Aplicativo da Web**:
- Executar como: você
- Quem tem acesso: qualquer pessoa que tenha o link (ou a política permitida pela organização)

Copie a URL terminada em `/exec`.

## 3. GitHub Pages
Cole a URL `/exec` em `config.js`, faça commit dos arquivos no repositório e habilite GitHub Pages.

## Observação sobre a escala de concordância
Os PDFs exibem claramente apenas "Discordo totalmente" e "Discordo" nas páginas renderizadas. Para tornar o protótipo funcional, foi usada uma escala sugerida de 5 pontos:
1. Discordo totalmente
2. Discordo
3. Nem concordo nem discordo
4. Concordo
5. Concordo totalmente

Confirme os rótulos reais antes de publicar se o formulário institucional usar outra escala.

## Ajustes feitos nos itens duplicados do PDF
O PDF da Aula Inaugural mostra `Autônomo` duas vezes e `Indicação de alguém` duas vezes. No HTML, as duplicatas foram removidas para evitar valores idênticos no banco.
