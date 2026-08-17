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
// PREENCHE O SELECT DAS UNIDADES
// ============================================================

function preencherUnidades(selectId) {

  const select = document.getElementById(selectId);

  if (!select) {
    console.warn(
      'Select de unidades não encontrado:',
      selectId
    );
    return;
  }


  UNIDADES.forEach(unidade => {

    const option =
      document.createElement('option');

    option.value = unidade;

    option.textContent = unidade;

    select.appendChild(option);

  });

}


// ============================================================
// CAMPO "OUTRO"
// ============================================================

function bindOutro(selectId, inputId) {

  const select =
    document.getElementById(selectId);

  const input =
    document.getElementById(inputId);


  if (!select || !input) {

    console.warn(
      'Não foi possível configurar o campo Outro:',
      selectId,
      inputId
    );

    return;

  }


  const sincronizar = () => {

    const selecionouOutro =
      select.value === 'Outro';


    input.style.display =
      selecionouOutro
        ? 'block'
        : 'none';


    input.required =
      selecionouOutro;


    if (!selecionouOutro) {

      input.value = '';

    }

  };


  select.addEventListener(
    'change',
    sincronizar
  );


  sincronizar();

}


// ============================================================
// CAMPOS CONDICIONAIS
// ============================================================

function toggleConditional(
  sourceName,
  testFn,
  targetId
) {

  const target =
    document.getElementById(targetId);


  if (!target) {

    console.warn(
      'Campo condicional não encontrado:',
      targetId
    );

    return;

  }


  const sincronizar = () => {

    const checked =
      document.querySelector(
        `[name="${sourceName}"]:checked`
      );


    const mostrar =
      checked &&
      testFn(checked.value);


    target.style.display =
      mostrar
        ? 'block'
        : 'none';

  };


  document
    .querySelectorAll(
      `[name="${sourceName}"]`
    )
    .forEach(elemento => {

      elemento.addEventListener(
        'change',
        sincronizar
      );

    });


  sincronizar();

}


// ============================================================
// FUNÇÃO PRINCIPAL DE ENVIO
// ============================================================

async function enviarFormulario(
  form,
  tipo,
  statusId
) {

  // ==========================================================
  // ELEMENTOS DA TELA
  // ==========================================================

  const status =
    document.getElementById(statusId);


  const btn =
    form.querySelector(
      'button[type="submit"]'
    );


  if (!status || !btn) {

    console.error(
      'Elemento de status ou botão não encontrado.'
    );

    return;

  }


  // ==========================================================
  // EVITA DUPLO ENVIO
  // ==========================================================

  if (btn.disabled) {
    return;
  }


  // ==========================================================
  // LIMPA MENSAGEM ANTERIOR
  // ==========================================================

  status.textContent = '';

  status.className = 'status';


  // ==========================================================
  // VALIDAÇÃO DOS CAMPOS HTML
  // ==========================================================

  if (!form.reportValidity()) {

    return;

  }


  // ==========================================================
  // VALIDA URL DO APPS SCRIPT
  // ==========================================================

  if (
    !APPS_SCRIPT_URL ||
    APPS_SCRIPT_URL.includes(
      'COLE_AQUI'
    )
  ) {

    status.textContent =
      'URL do Apps Script não configurada.';

    status.className =
      'status err';

    return;

  }


  // ==========================================================
  // MONTA OS DADOS DO FORMULÁRIO
  // ==========================================================

  const data =
    Object.fromEntries(
      new FormData(form).entries()
    );


  // Identifica a pesquisa
  data.tipoPesquisa = tipo;


  // Guarda a página de origem
  data.urlOrigem =
    window.location.href;


  // ==========================================================
  // BLOQUEIA O BOTÃO
  // ==========================================================

  btn.disabled = true;

  btn.textContent =
    'Enviando...';


  status.textContent =
    'Enviando sua resposta...';

  status.className =
    'status';


  try {

    // ========================================================
    // ENVIA PARA O GOOGLE APPS SCRIPT
    //
    // no-cors:
    // evita o erro de CORS provocado pelo redirecionamento
    // do Google Apps Script / Googleusercontent
    // ========================================================

    await fetch(
      APPS_SCRIPT_URL,
      {

        method: 'POST',

        mode: 'no-cors',

        headers: {

          'Content-Type':
            'text/plain;charset=utf-8'

        },

        body:
          JSON.stringify(data)

      }
    );


    // ========================================================
    // SUCESSO
    //
    // Com no-cors não conseguimos ler o JSON retornado.
    // Portanto, se o fetch terminou sem lançar erro,
    // consideramos o envio realizado.
    // ========================================================

    status.textContent =
      'Resposta enviada com sucesso. Obrigado!';

    status.className =
      'status ok';


    // ========================================================
    // LIMPA O FORMULÁRIO
    // ========================================================

    form.reset();


    // ========================================================
    // REAPLICA CAMPOS "OUTRO", SE EXISTIREM
    // ========================================================

    document
      .querySelectorAll('select')
      .forEach(select => {

        select.dispatchEvent(
          new Event('change')
        );

      });


  } catch (erro) {

    // ========================================================
    // ERRO REAL DE ENVIO
    // ========================================================

    console.error(
      'Erro ao enviar pesquisa:',
      erro
    );


    status.textContent =
      'Não foi possível enviar a resposta. Tente novamente.';

    status.className =
      'status err';

  }

  finally {

    // ========================================================
    // LIBERA BOTÃO
    // ========================================================

    btn.disabled = false;

    btn.textContent =
      'Enviar pesquisa';

  }

}
