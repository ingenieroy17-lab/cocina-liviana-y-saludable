const fs = require('fs');
const path = require('path');
const CSS = fs.readFileSync(path.join(__dirname, 'ebook-styles.css'), 'utf8');

function tag(t) {
  const map = {A:['Antiinflamatoria','tag-anti'],D:['Detox','tag-detox'],V:['Vegana','tag-vegan'],G:['Vegetariana','tag-veget'],C:['Celíaca','tag-celiac']};
  return t.split('').map(c => map[c] ? `<span class="tag ${map[c][1]}">${map[c][0]}</span>` : '').join('');
}

function recipeHTML(r, i) {
  const imgTag = r.imgBase64 ? `<div class="recipe-image-container"><img src="${r.imgBase64}" class="recipe-img" alt="${r.n}"></div>` : '';
  return `<div class="recipe"><div class="recipe-header"><h3>${i}. ${r.n}</h3><div class="recipe-tags">${tag(r.t)}</div><div class="recipe-meta"><span>⏱️ ${r.m} min</span><span>🍽️ ${r.s} porciones</span><span>🔥 ${r.k} kcal</span></div></div><div class="recipe-body"><div class="ingredients"><h4>Ingredientes</h4><ul>${r.i.map(x=>`<li>${x}</li>`).join('')}</ul></div><div class="preparation"><h4>Preparación</h4><ol>${r.p.map(x=>`<li>${x}</li>`).join('')}</ol></div></div>${imgTag}<div class="nutrition"><div class="nut-item"><div class="nut-value">${r.k}</div><div class="nut-label">Calorías</div></div><div class="nut-item"><div class="nut-value">${r.nu.p}g</div><div class="nut-label">Proteínas</div></div><div class="nut-item"><div class="nut-value">${r.nu.c}g</div><div class="nut-label">Carbos</div></div><div class="nut-item"><div class="nut-value">${r.nu.g}g</div><div class="nut-label">Grasas</div></div><div class="nut-item"><div class="nut-value">${r.nu.f}g</div><div class="nut-label">Fibra</div></div></div>${r.tip?`<div class="recipe-tip"><strong>💡 Tip:</strong> ${r.tip}</div>`:''}</div>`;
}

function chapterHTML(title, num, desc) {
  return `<div class="chapter-header"><div class="chapter-num">Capítulo ${num}</div><h2>${title}</h2><p>${desc}</p></div>`;
}

function buildBook(config) {
  const {title, subtitle, chapters, intro, author, brand, coverImage} = config;
  let html = `<!DOCTYPE html><html lang="es"><head><meta charset="UTF-8"><title>${title}</title><style>${CSS}</style></head><body>`;
  // Cover
  if (coverImage) {
    html += `<div class="cover-page"><img src="${coverImage}" class="cover-img" alt="${title}"></div>`;
  } else {
    html += `<div class="cover"><h1>${title}</h1><div class="subtitle">${subtitle}</div><div class="author">${author||''}</div><div class="brand">${brand||'Cocina Liviana y Saludable'}</div></div>`;
  }
  // Intro
  if(intro) html += `<div class="intro">${intro}</div>`;
  // TOC
  html += `<div class="toc"><h2>Índice</h2><ul>`;
  let idx = 1;
  chapters.forEach((ch,ci) => {
    html += `<li class="chapter">${ch.title}</li>`;
    ch.recipes.forEach(r => { html += `<li><span>${idx}. ${r.n}</span></li>`; idx++; });
  });
  html += `</ul></div>`;
  // Chapters
  idx = 1;
  chapters.forEach((ch,ci) => {
    html += chapterHTML(ch.title, ci+1, ch.desc||'');
    ch.recipes.forEach(r => { html += recipeHTML(r, idx); idx++; });
  });
  html += `<div class="book-footer"><p>© 2026 Cocina Liviana y Saludable — Todos los derechos reservados</p><p>Este material es para uso personal. Los resultados pueden variar. Consulte a su médico o nutricionista.</p></div>`;
  html += `</body></html>`;
  return html;
}

function buildPlanner(weeks, coverImage) {
  let html = `<!DOCTYPE html><html lang="es"><head><meta charset="UTF-8"><title>Planificador Semanal</title><style>${CSS}</style></head><body>`;
  if (coverImage) {
    html += `<div class="cover-page"><img src="${coverImage}" class="cover-img" alt="Planificador Semanal"></div>`;
  } else {
    html += `<div class="cover"><h1>Planificador Semanal de Comidas</h1><div class="subtitle">Organizá tus almuerzos y cenas de toda la semana</div><div class="brand">Cocina Liviana y Saludable</div></div>`;
  }
  html += `<div class="intro"><h2>Cómo usar este planificador</h2><p>Este planificador te propone 4 semanas completas de almuerzos y cenas saludables. Cada semana incluye su lista de compras para que vayas al super una sola vez.</p><p><strong>Importante:</strong> Este planificador es flexible. Podés adaptarlo a tus gustos, cambiar los días o incluso hacer una combinación de 2 recetas por comida si una te parece poco para tus necesidades energéticas.</p><p><strong>Tips de batch cooking:</strong></p><ul><li>Cociná granos (quinoa, arroz integral) en cantidad los domingos</li><li>Lavá y cortá todas las verduras apenas llegues del super</li><li>Prepará aderezos y salsas para toda la semana</li><li>Congelá porciones individuales de sopas y guisos</li></ul></div>`;
  const days = ['Lunes','Martes','Miércoles','Jueves','Viernes','Sábado','Domingo'];
  weeks.forEach((w,wi) => {
    html += `<div class="week-plan"><h3>Semana ${wi+1}</h3><table class="plan-table"><tr><th>Día</th><th>Almuerzo</th><th>Cena</th></tr>`;
    days.forEach((d,di) => { html += `<tr><td><strong>${d}</strong></td><td>${w.meals[di][0]}</td><td>${w.meals[di][1]}</td></tr>`; });
    html += `</table><h4 style="margin:16px 0 8px;color:#2D4A3E;">🛒 Lista de Compras</h4><ul class="shopping-list">${w.shopping.map(s=>`<li>${s}</li>`).join('')}</ul></div>`;
  });
  html += `<div class="book-footer"><p>© 2026 Cocina Liviana y Saludable</p></div></body></html>`;
  return html;
}

function buildSimpleBook(config) {
  const {title, subtitle, sections, intro, coverImage} = config;
  let html = `<!DOCTYPE html><html lang="es"><head><meta charset="UTF-8"><title>${title}</title><style>${CSS}</style></head><body>`;
  if (coverImage) {
    html += `<div class="cover-page"><img src="${coverImage}" class="cover-img" alt="${title}"></div>`;
  } else {
    html += `<div class="cover"><h1>${title}</h1><div class="subtitle">${subtitle}</div><div class="brand">Cocina Liviana y Saludable</div></div>`;
  }
  if(intro) html += `<div class="intro">${intro}</div>`;
  html += `<div class="toc"><h2>Índice</h2><ul>`;
  let idx = 1;
  sections.forEach(s => {
    html += `<li class="chapter">${s.title}</li>`;
    s.recipes.forEach(r => { html += `<li><span>${idx}. ${r.n}</span></li>`; idx++; });
  });
  html += `</ul></div>`;
  idx = 1;
  sections.forEach((s,si) => {
    html += chapterHTML(s.title, si+1, s.desc||'');
    s.recipes.forEach(r => { html += recipeHTML(r, idx); idx++; });
  });
  html += `<div class="book-footer"><p>© 2026 Cocina Liviana y Saludable</p></div></body></html>`;
  return html;
}

module.exports = { buildBook, buildPlanner, buildSimpleBook };
