'use strict';

// Skin palettes (same shape as game.js's COLORS: index 0 = null, 1-7 = piece colors).
// Retro/pixel reuse game.js's original COLORS values so they never drift apart.
const RETRO_PALETTE = COLORS.slice();
const PASTEL_PALETTE = [null, '#a9dde3', '#f2e3a8', '#cfaed8', '#aed6ae', '#e3a9a9', '#b8d6ec', '#eec89b'];

const skinSelect = document.getElementById('skin-select');

const SKINS = {
  retro: {
    palette: RETRO_PALETTE,
    boardBg: '',
    grid: 'default',
    drawBlock(context, x, y, colorIndex, size, alpha) {
      const color = this.palette[colorIndex];
      context.globalAlpha = alpha;
      context.fillStyle = color;
      context.fillRect(x * size + 1, y * size + 1, size - 2, size - 2);
      context.fillStyle = blockHighlightColor;
      context.fillRect(x * size + 1, y * size + 1, size - 2, 4);
      context.globalAlpha = 1;
    },
  },

  neon: {
    palette: RETRO_PALETTE,
    boardBg: '#05050a',
    grid: 'none',
    drawBlock(context, x, y, colorIndex, size, alpha) {
      const color = this.palette[colorIndex];
      context.globalAlpha = alpha;
      context.shadowBlur = 14;
      context.shadowColor = color;
      context.fillStyle = color;
      context.fillRect(x * size + 2, y * size + 2, size - 4, size - 4);
      context.shadowBlur = 0;
      context.shadowColor = 'transparent';
      context.globalAlpha = 1;
    },
  },

  pastel: {
    palette: PASTEL_PALETTE,
    boardBg: '',
    grid: 'default',
    drawBlock(context, x, y, colorIndex, size, alpha) {
      const color = this.palette[colorIndex];
      context.globalAlpha = alpha;
      context.fillStyle = color;
      const radius = Math.max(2, size * 0.2);
      context.beginPath();
      if (context.roundRect) {
        context.roundRect(x * size + 2, y * size + 2, size - 4, size - 4, radius);
      } else {
        context.rect(x * size + 2, y * size + 2, size - 4, size - 4);
      }
      context.fill();
      context.globalAlpha = 1;
    },
  },

  pixel: {
    palette: RETRO_PALETTE,
    boardBg: '',
    grid: 'default',
    drawBlock(context, x, y, colorIndex, size, alpha) {
      const color = this.palette[colorIndex];
      context.globalAlpha = alpha;
      context.fillStyle = color;
      context.fillRect(x * size + 1, y * size + 1, size - 2, size - 2);
      // checkerboard dither texture
      const cell = Math.max(2, Math.floor(size / 6));
      context.fillStyle = 'rgba(0, 0, 0, 0.2)';
      for (let ty = 0; ty < size - 2; ty += cell) {
        for (let tx = 0; tx < size - 2; tx += cell) {
          if (((tx / cell) + (ty / cell)) % 2 === 0) {
            context.fillRect(x * size + 1 + tx, y * size + 1 + ty, cell, cell);
          }
        }
      }
      context.globalAlpha = 1;
    },
  },
};

let activeSkin = SKINS.retro;

function applySkin(name) {
  activeSkin = SKINS[name] || SKINS.retro;
  COLORS = activeSkin.palette;
  canvas.style.background = activeSkin.boardBg;
  if (skinSelect) skinSelect.value = SKINS[name] ? name : 'retro';
}

window.drawSkinBlock = function (context, x, y, colorIndex, size, alpha) {
  activeSkin.drawBlock(context, x, y, colorIndex, size, alpha ?? 1);
};

window.skinGridMode = function () {
  return activeSkin.grid;
};

if (skinSelect) {
  skinSelect.addEventListener('change', () => {
    localStorage.setItem('skin', skinSelect.value);
    applySkin(skinSelect.value);
    draw();
    drawNext();
  });
}

applySkin(localStorage.getItem('skin') || 'retro');
draw();
drawNext();
