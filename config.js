// Substitua pela URL /exec da implantação do Google Apps Script.
const APPS_SCRIPT_URL = 'COLE_AQUI_A_URL_DO_WEB_APP';

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

function preencherUnidades(selectId){
  const el=document.getElementById(selectId);
  UNIDADES.forEach(u=>{const o=document.createElement('option');o.value=u;o.textContent=u;el.appendChild(o)});
}

function bindOutro(selectId, inputId){
  const s=document.getElementById(selectId), i=document.getElementById(inputId);
  const sync=()=>{i.style.display=s.value==='Outro'?'block':'none';i.required=s.value==='Outro';if(s.value!=='Outro')i.value=''};
  s.addEventListener('change',sync);sync();
}

function toggleConditional(sourceName, testFn, targetId){
  const target=document.getElementById(targetId);
  const sync=()=>{const checked=document.querySelector(`[name="${sourceName}"]:checked`);target.style.display=checked&&testFn(checked.value)?'block':'none'};
  document.querySelectorAll(`[name="${sourceName}"]`).forEach(el=>el.addEventListener('change',sync));sync();
}

async function enviarFormulario(form, tipo, statusId){
  const status=document.getElementById(statusId);const btn=form.querySelector('button[type="submit"]');
  status.textContent='';status.className='status';
  if(!form.reportValidity()) return;
  if(APPS_SCRIPT_URL.includes('COLE_AQUI')){status.textContent='Configure a URL do Apps Script em config.js.';status.className='status err';return}
  const data=Object.fromEntries(new FormData(form).entries());data.tipoPesquisa=tipo;data.urlOrigem=location.href;
  btn.disabled=true;btn.textContent='Enviando...';
  try{
    const r=await fetch(APPS_SCRIPT_URL,{method:'POST',headers:{'Content-Type':'text/plain;charset=utf-8'},body:JSON.stringify(data)});
    const out=await r.json();
    if(!out.ok) throw new Error(out.error||'Falha ao salvar');
    status.textContent='Resposta registrada com sucesso. Obrigado!';status.className='status ok';form.reset();
  }catch(e){status.textContent='Não foi possível registrar a resposta: '+e.message;status.className='status err'}
  finally{btn.disabled=false;btn.textContent='Enviar pesquisa'}
}
