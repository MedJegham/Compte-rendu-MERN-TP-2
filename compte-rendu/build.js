// Génère compte-rendu.html puis compte-rendu.pdf (via Microsoft Edge)
// Lancer depuis le dossier Tp2 :  node compte-rendu/build.js
const fs = require('fs');
const path = require('path');
const { execFileSync } = require('child_process');

const ROOT = path.join(__dirname, '..');
const CAPTURES = path.join(ROOT, 'captures');

// ---- À COMPLÉTER ----------------------------------------------------------
const ETUDIANT = { nom: 'Mohamed Jegham', classe: '5ème DS G3' };
const LIEN_GIT = 'https://github.com/MedJegham/Compte-rendu-MERN-TP-2';
// ---------------------------------------------------------------------------

const esc = s => String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
const lire = f => fs.readFileSync(path.join(ROOT, f), 'utf8');
const code = (s, titre) => (titre ? `<p class="fichier">${titre}</p>` : '') + `<pre><code>${esc(s.trim())}</code></pre>`;
const todo = v => (v === '?' || v.startsWith('[')) ? `<span class="todo">${esc(v)}</span>` : esc(v);

const manquantes = [];
function capture(fichier, legende) {
  const p = path.join(CAPTURES, fichier);
  if (!fs.existsSync(p)) {
    manquantes.push(fichier);
    return `<div class="missing">Capture manquante : captures/${fichier}<br>${legende}</div>`;
  }
  const data = fs.readFileSync(p).toString('base64');
  return `<figure><img src="data:image/png;base64,${data}"><figcaption>${legende}</figcaption></figure>`;
}

// extrait d'une fonction d'un fichier : de "const <nom>" jusqu'au "};" qui la ferme
function fonction(fichier, nom) {
  const src = lire(fichier);
  const i = src.indexOf(`const ${nom}`);
  if (i < 0) return `// fonction introuvable : ${nom}`;
  return src.slice(i, src.indexOf('\n};', i) + 3);
}

const articles = [
  { titre: 'PUT /api/articles/:id – modification',
    caps: [['Capture1.PNG', 'Succès : PUT /api/articles/2 avec <code>{ "title": "Express et Architecture SoC Maîtrisés" }</code> → 200 OK. Seul le titre change, l\'auteur reste « Aya ».'],
           ['Capture2.PNG', 'Échec : PUT /api/articles/99 → 404 Not Found. <code>findIndex</code> renvoie -1 : aucun article n\'a l\'id 99.']] },
  { titre: 'DELETE /api/articles/:id – suppression',
    caps: [['Capture3.PNG', 'Succès : DELETE /api/articles/2 → 200 OK. <code>filter</code> garde les articles dont l\'id est différent de 2 : le total passe de 3 à 2.']] },
];

const users = [
  ['Capture4.PNG', 'GET /api/users → 200 OK : liste complète des 2 utilisateurs (<code>total: 2</code>).'],
  ['Capture5.PNG', 'POST /api/users avec <code>{ "name": "Mohamed", "email": "mohamed@gmail.com" }</code> → 201 Created : utilisateur créé avec l\'id 3 et le rôle « user » par défaut.'],
  ['Capture6.PNG', 'POST /api/users avec <code>{ "name": "Test", "email": "testgmail.com" }</code> → 400 Bad Request : <code>estEmailValide</code> refuse l\'email sans <code>@</code>.'],
];


const html = `<!doctype html><html lang="fr"><head><meta charset="utf-8">
<title>Compte-rendu MERN – Séance 2</title>
<style>
  @page { size: A4; margin: 16mm 15mm; }
  body { font: 11pt/1.45 "Segoe UI", Arial, sans-serif; color: #1a1a1a; max-width: 800px; margin: auto; }
  h1 { font-size: 20pt; margin: 0; } h2 { font-size: 14pt; border-bottom: 2px solid #1f3a8a; padding-bottom: 3px; margin-top: 26px; color: #1f3a8a; }
  h3 { font-size: 12pt; margin: 18px 0 6px; }
  h2, h3, .fichier { break-after: avoid; }
  .garde { text-align: center; padding: 60px 0 40px; border-bottom: 1px solid #ccc; }
  .garde p { margin: 4px 0; color: #444; }
  table { border-collapse: collapse; width: 100%; font-size: 9.5pt; margin: 8px 0; }
  th, td { border: 1px solid #bbb; padding: 4px 6px; vertical-align: top; text-align: left; } th { background: #eef1f8; }
  pre { background: #f5f6f8; border: 1px solid #ddd; padding: 8px 10px; font: 9pt/1.4 Consolas, monospace; white-space: pre-wrap; }
  code { font-family: Consolas, monospace; font-size: 9.5pt; }
  .fichier { font: bold 10pt Consolas, monospace; margin: 14px 0 2px; color: #1f3a8a; }
  figure { margin: 10px 0; break-inside: avoid; } img { max-width: 100%; max-height: 95mm; border: 1px solid #ccc; display: block; }
  figcaption { font-size: 9.5pt; color: #444; margin-top: 3px; }
  .missing { border: 2px dashed #d33; color: #d33; padding: 14px; margin: 8px 0; font-size: 10pt; break-inside: avoid; }
  .todo { background: #fff3a0; padding: 0 3px; }
  .bloc { break-inside: avoid-page; }
</style></head><body>

<div class="garde">
  <h1>Compte-rendu – MERN Séance 2</h1>
  <p><b>Structuration de l'API : architecture modulaire SoC</b></p>
  <p>${todo(ETUDIANT.nom)} – ${todo(ETUDIANT.classe)}</p>
  <p>École Polytechnique de Sousse – Dr. Abdelweheb GUEDDES – 2026–2027</p>
</div>

<h2>1. Tests Postman – domaine articles</h2>
${articles.map(r => `<h3>${r.titre}</h3>${r.caps.map(c => capture(c[0], c[1])).join('')}`).join('\n')}

<h2>2. Tests Postman – Exercice 1 (users)</h2>
${users.map(c => capture(c[0], c[1])).join('\n')}

<h2>3. Code complet</h2>
<p>Dépôt Git : <a href="${LIEN_GIT}">${LIEN_GIT}</a></p>
</body></html>`;

const htmlPath = path.join(__dirname, 'compte-rendu.html');
const pdfPath = path.join(__dirname, 'compte-rendu.pdf');
fs.writeFileSync(htmlPath, html);

const edge = ['C:/Program Files (x86)/Microsoft/Edge/Application/msedge.exe',
              'C:/Program Files/Microsoft/Edge/Application/msedge.exe'].find(fs.existsSync);
if (edge) {
  execFileSync(edge, ['--headless', '--disable-gpu', '--no-pdf-header-footer',
    `--print-to-pdf=${pdfPath}`, 'file:///' + htmlPath.replace(/\\/g, '/')], { stdio: 'ignore' });
  console.log('PDF généré :', pdfPath);
} else {
  console.log('Edge introuvable : ouvrez compte-rendu.html et faites Ctrl+P > Enregistrer en PDF');
}
if (manquantes.length) console.log('\nCaptures manquantes (' + manquantes.length + ') :\n  ' + manquantes.join('\n  '));
