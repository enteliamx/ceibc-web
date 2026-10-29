(function(){
  // GA4: poner el ID de medición aquí (Etapa 4)
  var GA_ID = '';
  if (GA_ID) {
    var s = document.createElement('script');
    s.async = true;
    s.src = 'https://www.googletagmanager.com/gtag/js?id=' + GA_ID;
    document.head.appendChild(s);
    window.dataLayer = window.dataLayer || [];
    window.gtag = function(){ window.dataLayer.push(arguments); };
    window.gtag('js', new Date());
    window.gtag('config', GA_ID);
  }

  // Click en WhatsApp como evento
  document.addEventListener('click', function(e){
    var a = e.target.closest && e.target.closest('a[href*="wa.me"]');
    if (a && window.gtag) {
      window.gtag('event', 'whatsapp_click', { link_url: a.href, page_path: location.pathname });
    }
  });

  // Menú móvil
  var btn = document.querySelector('.menu-btn');
  var nav = document.getElementById('nav');
  if (btn && nav) {
    btn.addEventListener('click', function(){
      var open = nav.classList.toggle('open');
      btn.setAttribute('aria-expanded', open ? 'true' : 'false');
    });
  }

  // Diagnóstico ExIES
  var form = document.getElementById('diag');
  if (!form) return;
  form.addEventListener('submit', function(e){
    e.preventDefault();
    var qs = form.querySelectorAll('.q');
    var ok = 0, answered = 0;
    var areas = { 'Matemáticas': [0,0], 'Lengua Escrita': [0,0], 'Lectura': [0,0] };
    qs.forEach(function(q){
      var pick = q.querySelector('input:checked');
      var right = q.getAttribute('data-ok');
      var area = q.getAttribute('data-area');
      var fb = q.querySelector('.fb');
      areas[area][1]++;
      q.classList.remove('ok','bad');
      if (pick) answered++;
      if (pick && pick.value === right) {
        ok++; areas[area][0]++;
        q.classList.add('ok');
        fb.textContent = 'Correcta. ' + q.getAttribute('data-why');
      } else {
        q.classList.add('bad');
        fb.textContent = (pick ? 'No es esa. ' : 'Sin respuesta. ') + q.getAttribute('data-why');
      }
      fb.hidden = false;
    });
    var total = qs.length;
    var res = document.getElementById('result');
    var weak = Object.keys(areas).filter(function(k){ return areas[k][0] < areas[k][1]; });
    var msg;
    if (ok === total) msg = 'Tienes buena base. El curso te sirve para ganar velocidad y subir puntaje con simulacros completos.';
    else if (ok >= total - 2) msg = 'Vas bien, pero hay huecos que en el examen real cuestan puntos.';
    else msg = 'Hay temas que conviene reforzar desde la base antes de practicar a ritmo de examen. Para eso está el curso.';
    document.getElementById('score').textContent = ok + ' de ' + total;
    document.getElementById('msg').textContent = msg + (weak.length ? ' Áreas a reforzar: ' + weak.join(', ') + '.' : '');
    var wa = document.getElementById('wa-result');
    var txt = 'Hola, hice el diagnóstico ExIES en ceibc.mx y saqué ' + ok + ' de ' + total + '. Quiero informes del curso.';
    wa.href = wa.getAttribute('data-base') + encodeURIComponent(txt);
    res.hidden = false;
    res.scrollIntoView({ behavior: 'smooth', block: 'start' });
    if (window.gtag) window.gtag('event', 'diagnostico_completado', { score: ok, answered: answered });
  });
})();
