// ============================================================
// CONFIGURAÇÃO DO GOOGLE APPS SCRIPT
// ============================================================

const APPS_SCRIPT_URL =
  'https://script.google.com/macros/s/AKfycbwT3VSnPGH-H1wA4OPP2SilNemhDTQ9oyb6bF7He3DGRcMCS460_UbaLz7I3mFlPdI/exec';


// ============================================================
// UNIDADES SENAI MS
// ============================================================

const UNIDADES = [
  'SENAI Campo Grande',
  'SENAI Campo Grande/Construção',
  'SENAI Ribas do Rio Pardo',
  'SENAI Sidrolândia',
  'SENAI Rio Verde de Mato Grosso',
  'SENAI Sonora',
  'SENAI Dourados',
  'SENAI Maracaju',
  'SENAI Naviraí',
  'SENAI Nova Andradina',
  'SENAI Corumbá',
  'SENAI Três Lagoas',
  'SENAI Aparecida do Taboado',
  'Outro'
];


// ============================================================
// PREENCHE SELECT COM AS UNIDADES
// ============================================================

function preencherUnidades(selectId) {

  const el = document.getElementById(selectId);

  if (!el) {
    console.warn(`Select não encontrado: ${selectId}`);
    return;
  }

  UNIDADES.forEach(unidade => {

    const option = document.createElement('option');

    option.value = unidade;
    option.textContent = unidade;

    el.appendChild(option);

  });

}


// ============================================================
// EXIBE CAMPO "OUTRO" QUANDO NECESSÁRIO
// ============================================================

function bindOutro(selectId, inputId) {

  const select = document.getElementById(selectId);
  const input = document.getElementById(inputId);

  if (!select || !input) {
    console.warn(
      `Não foi possível configurar o campo Outro: ${selectId} / ${inputId}`
    );
    return;
  }

  const sincronizar = () => {

    const selecionouOutro = select.value === 'Outro';

    input.style.display = selecionouOutro ? 'block' : 'none';

    input.required = selecionouOutro;

    if (!selecionouOutro) {
      input.value = '';
    }

  };

  select.addEventListener('change', sincronizar);

  sincronizar();

}


// ============================================================
// CAMPOS CONDICIONAIS
// ============================================================

function toggleConditional(sourceName, testFn, targetId) {

  const target = document.getElementById(targetId);

  if (!target) {
    console.warn(`Campo condicional não encontrado: ${targetId}`);
    return;
  }

  const sincronizar = () => {

    const checked = document.querySelector(
      `[name="${sourceName}"]:checked`
    );

    const mostrar =
      checked && testFn(checked.value);

    target.style.display =
      mostrar ? 'block' : 'none';

  };

  document
    .querySelectorAll(`[name="${sourceName}"]`)
    .forEach(elemento => {

      elemento.addEventListener(
        'change',
        sincronizar
      );

    });

  sincronizar();

}


// ============================================================
// ENVIO DOS FORMULÁRIOS
// ============================================================

async function enviarFormulario(form, tipo, statusId) {

  const status = document.getElementById(statusId);

  const btn = form.querySelector(
    'button[type="submit"]'
  );


  // ----------------------------------------------------------
  // Limpa mensagens anteriores
  // ----------------------------------------------------------

  status.textContent = '';

  status.className = 'status';


  // ----------------------------------------------------------
  // Validação HTML
  // ----------------------------------------------------------

  if (!form.reportValidity()) {
    return;
  }


  // ----------------------------------------------------------
  // Verifica configuração da URL
  // ----------------------------------------------------------

  if (
    !APPS_SCRIPT_URL ||
    APPS_SCRIPT_URL.includes('COLE_AQUI')
  ) {

    status.textContent =
      'Configure a URL do Apps Script em config.js.';

    status.className = 'status err';

    return;

  }


  // ----------------------------------------------------------
  // Captura os dados do formulário
  // ----------------------------------------------------------

  const data = Object.fromEntries(
    new FormData(form).entries()
  );


  // Identifica qual das três pesquisas está sendo enviada
  data.tipoPesquisa = tipo;


  // Guarda de qual página veio a resposta
  data.urlOrigem = window.location.href;


  // ----------------------------------------------------------
  // Bloqueia botão para evitar duplo clique
  // ----------------------------------------------------------

  btn.disabled = true;

  btn.textContent = 'Enviando...';


  try {

    // --------------------------------------------------------
    // ENVIO PARA GOOGLE APPS SCRIPT
    // --------------------------------------------------------

    const response = await fetch(
      APPS_SCRIPT_URL,
      {

        method: 'POST',

        headers: {
          'Content-Type':
            'text/plain;charset=utf-8'
        },

        body: JSON.stringify(data)

      }
    );


    // --------------------------------------------------------
    // LÊ RESPOSTA DO APPS SCRIPT
    // --------------------------------------------------------

    const out = await response.json();


    console.log(
      'Resposta do Apps Script:',
      out
    );


    // --------------------------------------------------------
    // VERIFICA SE O APPS SCRIPT CONFIRMOU O SALVAMENTO
    //
    // Apps Script retorna:
    //
    // {
    //   success: true,
    //   message: "Resposta salva com sucesso."
    // }
    // --------------------------------------------------------

    if (!out.success) {

      throw new Error(
        out.message ||
        'Falha ao salvar a resposta.'
      );

    }


    // --------------------------------------------------------
    // SUCESSO
    // --------------------------------------------------------

    status.textContent =
      out.message ||
      'Resposta registrada com sucesso. Obrigado!';

    status.className =
      'status ok';


    // Limpa o formulário
    form.reset();


  } catch (erro) {

    // --------------------------------------------------------
    // ERRO
    // --------------------------------------------------------

    console.error(
      'Erro ao enviar pesquisa:',
      erro
    );


    status.textContent =
      'Não foi possível registrar a resposta: ' +
      erro.message;

    status.className =
      'status err';


  } finally {

    // --------------------------------------------------------
    // LIBERA BOTÃO NOVAMENTE
    // --------------------------------------------------------

    btn.disabled = false;

    btn.textContent =
      'Enviar pesquisa';

  }

}
