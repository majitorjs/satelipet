// Satelipet · script.js
// 1) Dibuja los códigos QR decorativos de la página.
// 2) Pone el año actual en el pie.
//
// IMPORTANTE: estos QR son solo ilustración. Los QR reales de cada placa
// deben apuntar al perfil único de cada mascota (por ejemplo tudominio.co/p/ABC123)
// y se generan con una librería o servicio de códigos QR.

(function () {
  var N = 21; // tamaño de un QR versión 1

  function buildQrPath() {
    var grid = [];
    var y, x;
    for (y = 0; y < N; y++) {
      grid.push(new Array(N).fill(false));
    }

    // Relleno pseudoaleatorio, siempre igual (semilla fija)
    var seed = 20261013;
    function rnd() {
      seed = (seed * 1664525 + 1013904223) % 4294967296;
      return seed / 4294967296;
    }
    for (y = 0; y < N; y++) {
      for (x = 0; x < N; x++) {
        grid[y][x] = rnd() > 0.52;
      }
    }

    // Tres cuadros de posición en las esquinas
    function finder(ox, oy) {
      for (var dy = -1; dy <= 7; dy++) {
        for (var dx = -1; dx <= 7; dx++) {
          var px = ox + dx;
          var py = oy + dy;
          if (px < 0 || py < 0 || px >= N || py >= N) continue;
          var edge = dx === -1 || dy === -1 || dx === 7 || dy === 7;
          var ring = dx === 0 || dy === 0 || dx === 6 || dy === 6;
          var core = dx >= 2 && dx <= 4 && dy >= 2 && dy <= 4;
          grid[py][px] = edge ? false : (ring || core);
        }
      }
    }
    finder(0, 0);
    finder(N - 7, 0);
    finder(0, N - 7);

    // Líneas de sincronización
    for (var i = 8; i < N - 8; i++) {
      grid[6][i] = i % 2 === 0;
      grid[i][6] = i % 2 === 0;
    }

    // Convierte la cuadrícula en un solo trazo SVG
    var d = '';
    for (y = 0; y < N; y++) {
      for (x = 0; x < N; x++) {
        if (grid[y][x]) d += 'M' + x + ' ' + y + 'h1v1h-1z';
      }
    }
    return d;
  }

  var path = buildQrPath();
  document.querySelectorAll('svg.qr path').forEach(function (el) {
    el.setAttribute('d', path);
  });

  var year = document.getElementById('year');
  if (year) year.textContent = new Date().getFullYear();
})();
