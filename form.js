// Máscaras e validação extra para o formulário de cadastro
(function(){
  const cpf = document.getElementById('cpf');
  const telefone = document.getElementById('telefone');
  const cep = document.getElementById('cep');
  const form = document.getElementById('cadastroForm');
  const nascimento = document.getElementById('nascimento');

  // limita data máxima (hoje - opcional)
  if(nascimento){
    const hoje = new Date().toISOString().split('T')[0];
    nascimento.setAttribute('max', hoje);
  }

  // máscara CPF: 000.000.000-00
  if(cpf){
    cpf.addEventListener('input', function(e){
      let v = e.target.value.replace(/\D/g,'').slice(0,11);
      v = v.replace(/(\d{3})(\d)/,'$1.$2');
      v = v.replace(/(\d{3})(\d)/,'$1.$2');
      v = v.replace(/(\d{3})(\d{1,2})$/,'$1-$2');
      e.target.value = v;
    });
    cpf.addEventListener('blur', function(){
      if(this.value && !validateCPF(this.value)) {
        this.setCustomValidity('CPF inválido');
      } else {
        this.setCustomValidity('');
      }
    });
  }

  // máscara telefone: (00) 00000-0000 ou (00) 0000-0000
  if(telefone){
    telefone.addEventListener('input', function(e){
      let v = e.target.value.replace(/\D/g,'').slice(0,11);
      if(v.length > 10) {
        v = v.replace(/^(\d{2})(\d{5})(\d{4}).*/,'($1) $2-$3');
      } else {
        v = v.replace(/^(\d{2})(\d{4})(\d{0,4}).*/,'($1) $2-$3');
      }
      e.target.value = v;
    });
  }

  // máscara CEP: 00000-000
  if(cep){
    cep.addEventListener('input', function(e){
      let v = e.target.value.replace(/\D/g,'').slice(0,8);
      v = v.replace(/(\d{5})(\d{1,3})$/,'$1-$2');
      e.target.value = v;
    });
  }

  // validação CPF (módulo 11)
  function validateCPF(input){
    if(!input) return false;
    const num = input.replace(/\D/g,'');
    if(num.length !== 11) return false;
    // rejeita sequências iguais (00000000000, 11111111111, ...)
    if(/^(\d)\1{10}$/.test(num)) return false;

    // primeiro dígito verificador
    let sum = 0;
    for(let i=0;i<9;i++){
      sum += parseInt(num.charAt(i),10) * (10 - i);
    }
    let r = sum % 11;
    let d1 = (r < 2) ? 0 : 11 - r;
    if(d1 !== parseInt(num.charAt(9),10)) return false;

    // segundo dígito verificador
    sum = 0;
    for(let i=0;i<10;i++){
      sum += parseInt(num.charAt(i),10) * (11 - i);
    }
    r = sum % 11;
    let d2 = (r < 2) ? 0 : 11 - r;
    if(d2 !== parseInt(num.charAt(10),10)) return false;

    return true;
  }

  // intercepta submit para validação adicional
  if(form){
    form.addEventListener('submit', function(e){
      // garante que validação nativa aconteça
      if(!form.checkValidity()){
        // permite que o navegador mostre os erros nativos
        return;
      }
      // valida CPF via algoritmo
      if(cpf && !validateCPF(cpf.value)){
        cpf.setCustomValidity('CPF inválido');
        cpf.reportValidity();
        e.preventDefault();
        return;
      } else if(cpf){
        cpf.setCustomValidity('');
      }

      // Se tudo ok: aqui você poderia enviar via fetch ou permitir o envio normal
      // Exemplo: preventDefault + enviar por fetch para endpoint
      // e.preventDefault();
      // enviarDados();
    });
  }

})();
