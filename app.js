const state = {
  versions: [],
  offsetsCache: new Map(),
  manifestCache: new Map(),
  fileCheckCache: new Map(),
  lang: localStorage.getItem("cdmu_lang") || "pt",
  currentMod: null,
  currentFileName: "",
  currentAnalysis: null,
  result: null,
  resultName: "mod_atualizado.json",
};

const els = {
  file: document.getElementById("modFile"),
  version: document.getElementById("versionSelect"),
  analyze: document.getElementById("analyzeBtn"),
  process: document.getElementById("processBtn"),
  download: document.getElementById("downloadBtn"),
  status: document.getElementById("status"),
  report: document.getElementById("report"),
  stats: document.getElementById("stats"),
  sTotal: document.getElementById("sTotal"),
  sApplied: document.getElementById("sApplied"),
  sUnchanged: document.getElementById("sUnchanged"),
  sErrors: document.getElementById("sErrors"),
  analysisBox: document.getElementById("analysisBox"),
  analysisContent: document.getElementById("analysisContent"),
  langButtons: document.querySelectorAll("[data-lang-button]"),
};

const i18n = {
  pt: {
    supportButton: "Me pague uma coxinha",
    heroTitle: "Atualizar mod JSON",
    heroLead: "Envie o JSON antigo do mod, escolha a versão do jogo e baixe o JSON atualizado com os offsets correspondentes.",
    processTitle: "Processar mod",
    modJsonLabel: "JSON do mod",
    targetVersionLabel: "Versão de destino",
    analyzeButton: "Analisar mod",
    updateButton: "Atualizar mod",
    downloadButton: "Baixar resultado",
    analysisTitle: "Arquivos e offsets detectados",
    statTotal: "Total",
    statApplied: "Aplicados",
    statUnchanged: "Sem mudança",
    statErrors: "Erros",
    reportTitle: "Relatório",
    emptyReport: "Nenhum mod processado ainda.",
    howToTitle: "Como usar",
    howTo1: "1. Escolha a versão de destino.",
    howTo2: "2. Faça upload do JSON antigo.",
    howTo3: "3. Clique em <strong>Analisar mod</strong>.",
    howTo4: "4. Se houver offsets disponíveis, clique em <strong>Atualizar mod</strong>.",
    howTo5: "5. Baixe o JSON atualizado e teste no jogo.",
    compatTitle: "Compatibilidade",
    compat1: "Detecta automaticamente o arquivo usado pelo mod.",
    compat2: "Confere se existem offsets para a versão escolhida.",
    compat3: "Atualiza somente alterações que tenham correspondência segura.",
    compat4: "Mantém o valor modificado original do mod.",
    supportTitle: "Apoiar o projeto",
    metaStatic: "Roda direto no navegador",
    metaNoLogin: "Sem login",
    metaJson: "Retorna JSON pronto",
    selectJson: "Selecione um JSON de mod.",
    selectVersion: "Selecione a versão de destino.",
    invalidJson: "JSON inválido.",
    patchesMissing: "Campo patches[] não encontrado.",
    loadingVersions: "Não consegui carregar offsets/versions.json",
    offsetsLoadFail: "Não consegui carregar offsets/{versionId}/offset_entries.json",
    readingOffsets: "Lendo JSON e conferindo offsets...",
    analyzing: "Analisando...",
    noMappedOffsets: "O mod foi lido, mas não achei offsets cadastrados para atualizar nessa versão.",
    partialOffsets: "Achei parte dos offsets. Você pode atualizar, mas confira os itens sem offset no relatório.",
    readyToUpdate: "Offsets encontrados. Pode atualizar o mod.",
    applyingOffsets: "Aplicando offsets...",
    updating: "Atualizando...",
    updatedWithPending: "Atualizado com itens pendentes. Veja o relatório.",
    updatedOk: "Atualizado com sucesso. Pode baixar.",
    unexpected: "Erro inesperado.",
    loadedFail: "Erro ao carregar versões.",
    offsetsNotLoaded: "Offsets não carregados",
  },
  en: {
    supportButton: "Buy me a coffee",
    heroTitle: "Update JSON mod",
    heroLead: "Upload an old mod JSON, choose the game version, and download an updated JSON with matching offsets.",
    processTitle: "Process mod",
    modJsonLabel: "Mod JSON",
    targetVersionLabel: "Target version",
    analyzeButton: "Analyze mod",
    updateButton: "Update mod",
    downloadButton: "Download result",
    analysisTitle: "Detected files and offsets",
    statTotal: "Total",
    statApplied: "Applied",
    statUnchanged: "Unchanged",
    statErrors: "Errors",
    reportTitle: "Report",
    emptyReport: "No mod processed yet.",
    howToTitle: "How to use",
    howTo1: "1. Choose the target version.",
    howTo2: "2. Upload the old JSON file.",
    howTo3: "3. Click <strong>Analyze mod</strong>.",
    howTo4: "4. If offsets are available, click <strong>Update mod</strong>.",
    howTo5: "5. Download the updated JSON and test it in game.",
    compatTitle: "Compatibility",
    compat1: "Automatically detects the game file used by the mod.",
    compat2: "Checks whether offsets exist for the selected version.",
    compat3: "Only updates changes with a safe match.",
    compat4: "Keeps the mod's patched value unchanged.",
    supportTitle: "Support the project",
    metaStatic: "Runs in the browser",
    metaNoLogin: "No login",
    metaJson: "Returns ready JSON",
    selectJson: "Select a mod JSON file.",
    selectVersion: "Select the target version.",
    invalidJson: "Invalid JSON.",
    patchesMissing: "patches[] field not found.",
    loadingVersions: "Could not load offsets/versions.json",
    offsetsLoadFail: "Could not load offsets/{versionId}/offset_entries.json",
    readingOffsets: "Reading JSON and checking offsets...",
    analyzing: "Analyzing...",
    noMappedOffsets: "The mod was read, but no mapped offsets were found for this version.",
    partialOffsets: "Some offsets were found. You can update, but check the missing items in the report.",
    readyToUpdate: "Offsets found. You can update the mod.",
    applyingOffsets: "Applying offsets...",
    updating: "Updating...",
    updatedWithPending: "Updated with pending items. Check the report.",
    updatedOk: "Updated successfully. You can download it.",
    unexpected: "Unexpected error.",
    loadedFail: "Error loading versions.",
    offsetsNotLoaded: "Offsets not loaded",
  },
};

function t(key, vars = {}) {
  let text = i18n[state.lang][key] || i18n.pt[key] || key;
  for (const [name, value] of Object.entries(vars)) {
    text = text.replaceAll(`{${name}}`, value);
  }
  return text;
}

function applyLanguage() {
  document.documentElement.lang = state.lang === "pt" ? "pt-BR" : "en";
  els.langButtons.forEach((button) => {
    const active = button.dataset.langButton === state.lang;
    button.classList.toggle("active", active);
    button.setAttribute("aria-pressed", active ? "true" : "false");
  });
  document.querySelectorAll("[data-i18n]").forEach((node) => {
    node.innerHTML = t(node.dataset.i18n);
  });
  const emptyReport = document.querySelector("[data-empty-report]");
  if (emptyReport && !state.currentMod && !state.result) {
    emptyReport.textContent = t("emptyReport");
  }
}

function setLanguage(lang) {
  state.lang = lang === "en" ? "en" : "pt";
  localStorage.setItem("cdmu_lang", state.lang);
  applyLanguage();
}

function setStatus(message, kind = "") {
  els.status.textContent = message;
  els.status.className = `status ${kind}`;
}

function escapeHtml(value) {
  return String(value)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;");
}

function isEntryChange(change) {
  return typeof change.entry === "string";
}

function normalizeFile(file) {
  return String(file || "").replaceAll("\\", "/").replace(/^\/+/, "");
}

function detectFormat(mod) {
  let direct = false;
  let entry = false;
  for (const patch of mod.patches || []) {
    for (const change of patch.changes || []) {
      if (isEntryChange(change)) entry = true;
      else direct = true;
    }
  }
  if (direct && entry) return "mixed";
  if (entry) return 2;
  return 1;
}

function validateMod(mod) {
  if (!mod || typeof mod !== "object") throw new Error(t("invalidJson"));
  if (!Array.isArray(mod.patches)) throw new Error(t("patchesMissing"));
  for (const [i, patch] of mod.patches.entries()) {
    if (!patch.game_file) throw new Error(`patches[${i}].game_file ausente.`);
    if (!Array.isArray(patch.changes)) throw new Error(`patches[${i}].changes deve ser array.`);
  }
}

function getModName(mod, fileName) {
  return mod.name || (mod.modinfo && mod.modinfo.title) || fileName.replace(/\.json$/i, "");
}

function getGameVersionLabel(version, fallbackId) {
  return (version?.name || fallbackId || "").replace(/^Crimson Desert\s*/i, "").trim();
}

function cleanTitle(title) {
  return String(title || "Mod")
    .replace(/\s+\d+\.\d+(?:\.\d+)?(?:\s+HOTFIX)?\s+UPDATED$/i, "")
    .replace(/\s+\d+\.\d+(?:\.\d+)?(?:[-_\s]*hotfix)?$/i, "")
    .replace(/\s+UPDATED$/i, "")
    .trim();
}

function cleanDescription(description) {
  return String(description || "Mod JSON")
    .replace(/\s*Updated for Crimson Desert\s+\d+\.\d+(?:\.\d+)?(?:\s*\([^)]+\))?\.?/ig, "")
    .replace(/\s*Offsets remapped and updated for Crimson Desert\s+\d+\.\d+(?:\.\d+)?\.?/ig, "")
    .replace(/\s*Format 2 \(entry-anchored\)\.?\s*/ig, " ")
    .replace(/\s{2,}/g, " ")
    .trim();
}

function updateMetadata(mod, version, versionId) {
  const gameVersion = getGameVersionLabel(version, versionId);
  const suffix = `${gameVersion} UPDATED`;

  if (mod.modinfo && typeof mod.modinfo === "object") {
    mod.modinfo.title = `${cleanTitle(mod.modinfo.title)} ${suffix}`.trim();
    mod.modinfo.version = gameVersion.toLowerCase().replace(/\s+/g, "-");
    mod.modinfo.description = `${cleanDescription(mod.modinfo.description)} Updated for Crimson Desert ${gameVersion}.`;
  } else {
    mod.name = `${cleanTitle(mod.name)} ${suffix}`.trim();
    mod.version = gameVersion.toLowerCase().replace(/\s+/g, "-");
    mod.description = `${cleanDescription(mod.description)} Updated for Crimson Desert ${gameVersion}.`;
  }

  return mod;
}

function buildIndexes(offsets) {
  const directIdx = new Map();
  const entryIdx = new Map();
  const files = new Map();

  for (const row of offsets || []) {
    const gameFile = normalizeFile(row.game_file);
    const fileData = files.get(gameFile) || { total: 0, labels: new Set(), entries: new Set() };
    fileData.total++;
    fileData.labels.add(row.field_name);
    if (row.entry_name) fileData.entries.add(row.entry_name);
    files.set(gameFile, fileData);

    const key = row.entry_name
      ? `${gameFile}::${row.entry_name}::${row.field_name}`
      : `${gameFile}::${row.field_name}`;
    const target = row.entry_name ? entryIdx : directIdx;
    if (!target.has(key)) target.set(key, []);
    target.get(key).push(row);
  }

  return { directIdx, entryIdx, files };
}

function findOffsetRow(indexes, gameFile, change) {
  if (isEntryChange(change)) {
    return (indexes.entryIdx.get(`${gameFile}::${change.entry}::${change.label}`) || [])[0] || null;
  }
  return (indexes.directIdx.get(`${gameFile}::${change.label}`) || [])[0] || null;
}

function takeOffsetRow(indexes, cursors, gameFile, change) {
  const key = isEntryChange(change)
    ? `${gameFile}::${change.entry}::${change.label}`
    : `${gameFile}::${change.label}`;
  const source = isEntryChange(change) ? indexes.entryIdx : indexes.directIdx;
  const rows = source.get(key) || [];
  const cursor = cursors.get(key) || 0;
  const row = rows[cursor] || rows[0] || null;
  if (rows.length > 1) cursors.set(key, cursor + 1);
  return row;
}

async function loadVersions() {
  if (window.CDMU_LOCAL_DATA && Array.isArray(window.CDMU_LOCAL_DATA.versions)) {
    state.versions = window.CDMU_LOCAL_DATA.versions;
    els.version.innerHTML = "";
    for (const version of state.versions) {
      if (version.status === "disabled") continue;
      const option = document.createElement("option");
      option.value = version.id;
      option.textContent = version.name;
      els.version.appendChild(option);
    }
    return;
  }

  const res = await fetch("offsets/versions.json", { cache: "no-store" });
  if (!res.ok) throw new Error(t("loadingVersions"));
  state.versions = await res.json();
  els.version.innerHTML = "";

  for (const version of state.versions) {
    if (version.status === "disabled") continue;
    const option = document.createElement("option");
    option.value = version.id;
    option.textContent = version.name;
    els.version.appendChild(option);
  }

}

async function loadOffsets(versionId) {
  if (state.offsetsCache.has(versionId)) return state.offsetsCache.get(versionId);
  if (window.CDMU_LOCAL_DATA && window.CDMU_LOCAL_DATA.offsets && window.CDMU_LOCAL_DATA.offsets[versionId]) {
    const rows = window.CDMU_LOCAL_DATA.offsets[versionId];
    state.offsetsCache.set(versionId, rows);
    return rows;
  }

  const res = await fetch(`offsets/${versionId}/offset_entries.json`, { cache: "no-store" });
  if (!res.ok) throw new Error(t("offsetsLoadFail", { versionId }));
  const rows = await res.json();
  state.offsetsCache.set(versionId, rows);
  return rows;
}

async function loadManifest(versionId) {
  if (state.manifestCache.has(versionId)) return state.manifestCache.get(versionId);
  const res = await fetch(`offsets/${versionId}/file_manifest.json`, { cache: "no-store" });
  if (!res.ok) {
    state.manifestCache.set(versionId, null);
    return null;
  }
  const manifest = await res.json();
  const files = new Set((manifest.files || []).map((file) => normalizeFile(file.path || file)));
  state.manifestCache.set(versionId, files);
  return files;
}

async function checkGameFileExists(versionId, gameFile) {
  const normalized = normalizeFile(gameFile);
  const cacheKey = `${versionId}::${normalized}`;
  if (state.fileCheckCache.has(cacheKey)) return state.fileCheckCache.get(cacheKey);

  if (window.CDMU_LOCAL_DATA && window.CDMU_LOCAL_DATA.fileManifest && window.CDMU_LOCAL_DATA.fileManifest[versionId]) {
    const exists = window.CDMU_LOCAL_DATA.fileManifest[versionId].includes(normalized);
    state.fileCheckCache.set(cacheKey, exists);
    return exists;
  }

  const manifest = await loadManifest(versionId);
  if (manifest) {
    const exists = manifest.has(normalized);
    state.fileCheckCache.set(cacheKey, exists);
    return exists;
  }

  try {
    const res = await fetch(`offsets/${versionId}/${normalized}`, { method: "HEAD", cache: "no-store" });
    const exists = res.ok;
    state.fileCheckCache.set(cacheKey, exists);
    return exists;
  } catch {
    state.fileCheckCache.set(cacheKey, false);
    return false;
  }
}

function collectModFiles(mod) {
  const files = new Map();
  for (const patch of mod.patches || []) {
    const gameFile = normalizeFile(patch.game_file);
    const data = files.get(gameFile) || { changes: 0 };
    data.changes += (patch.changes || []).length;
    files.set(gameFile, data);
  }
  return files;
}

async function analyzeCurrentMod() {
  const file = els.file.files && els.file.files[0];
  if (!file) throw new Error(t("selectJson"));

  const versionId = els.version.value;
  if (!versionId) throw new Error(t("selectVersion"));

  const text = await file.text();
  const mod = JSON.parse(text);
  validateMod(mod);

  const offsets = await loadOffsets(versionId);
  const indexes = buildIndexes(offsets);
  const files = collectModFiles(mod);
  const fileReports = [];
  const items = [];
  let total = 0;
  let matched = 0;
  let missing = 0;

  for (const [gameFile, fileData] of files.entries()) {
    const existsOnServer = await checkGameFileExists(versionId, gameFile);
    const offsetFileData = indexes.files.get(gameFile);
    let fileMatched = 0;
    let fileMissing = 0;

    for (const patch of mod.patches || []) {
      const patchFile = normalizeFile(patch.game_file);
      if (patchFile !== gameFile) continue;

      for (const change of patch.changes || []) {
        total++;
        const row = findOffsetRow(indexes, patchFile, change);
        if (row) {
          matched++;
          fileMatched++;
        } else {
          missing++;
          fileMissing++;
        }
        items.push({
          file: patchFile,
          entry: change.entry || "",
          label: change.label,
          status: row ? "offset encontrado" : "sem offset",
        });
      }
    }

    fileReports.push({
      file: gameFile,
      changes: fileData.changes,
      matched: fileMatched,
      missing: fileMissing,
      existsOnServer,
      knownOffsets: offsetFileData ? offsetFileData.total : 0,
    });
  }

  return {
    mod,
    fileName: file.name,
    versionId,
    format: detectFormat(mod),
    total,
    matched,
    missing,
    files: fileReports.sort((a, b) => a.file.localeCompare(b.file)),
    items,
  };
}

function renderAnalysis(analysis) {
  const canUpdate = analysis.total > 0 && analysis.matched > 0;
  const fileRows = analysis.files.map((item) => {
    const fileStatus = item.existsOnServer ? "arquivo existe" : "arquivo não confirmado";
    const offsetStatus = item.missing === 0 ? "offsets encontrados" : `${item.missing} sem offset`;
    const tagClass = item.existsOnServer && item.missing === 0 ? "ok" : item.matched > 0 ? "warn" : "bad";
    return `
      <div class="file-row">
        <div class="file-path">
          <strong>${escapeHtml(item.file)}</strong><br>
          <span class="small">${item.changes} alterações no mod · ${item.knownOffsets} offsets cadastrados · ${escapeHtml(fileStatus)}</span>
        </div>
        <span class="tag ${tagClass}">${escapeHtml(offsetStatus)}</span>
      </div>
    `;
  }).join("");

  els.analysisContent.innerHTML = `
    <div class="small">
      Formato detectado: <strong>${escapeHtml(analysis.format)}</strong> ·
      Offsets encontrados: <strong>${analysis.matched}</strong> de <strong>${analysis.total}</strong>
    </div>
    ${fileRows}
  `;
  els.analysisBox.hidden = false;
  els.process.disabled = !canUpdate;

  const modName = getModName(analysis.mod, analysis.fileName);
  const lines = [
    `Mod: ${modName}`,
    `Formato: ${analysis.format}`,
    `Offsets encontrados: ${analysis.matched}/${analysis.total}`,
    `Sem offset: ${analysis.missing}`,
    "",
    "Arquivos carregados pelo mod:",
    ...analysis.files.map((file) => {
      const server = file.existsOnServer ? "arquivo existe na pasta offsets" : "arquivo não confirmado na pasta offsets";
      return `- ${file.file} | ${file.matched}/${file.changes} offsets encontrados | ${server}`;
    }),
    "",
    "Primeiros itens:",
    ...analysis.items.slice(0, 80).map((item) => {
      const entry = item.entry ? ` | ${item.entry}` : "";
      return `[${item.status}] ${item.file}${entry} | ${item.label}`;
    }),
  ];
  els.report.textContent = lines.join("\n");
}

async function analyzeMod() {
  try {
    state.result = null;
    state.currentMod = null;
    state.currentAnalysis = null;
    els.download.disabled = true;
    els.process.disabled = true;
    els.stats.hidden = true;
    els.analysisBox.hidden = true;
    els.report.textContent = t("analyzing");

    setStatus(t("readingOffsets"));
    const analysis = await analyzeCurrentMod();
    state.currentMod = analysis.mod;
    state.currentFileName = analysis.fileName;
    state.currentAnalysis = analysis;
    renderAnalysis(analysis);

    if (analysis.matched === 0) {
      setStatus(t("noMappedOffsets"), "bad");
    } else if (analysis.missing > 0) {
      setStatus(t("partialOffsets"), "warn");
    } else {
      setStatus(t("readyToUpdate"), "ok");
    }
  } catch (error) {
    const message = error instanceof Error ? error.message : t("unexpected");
    setStatus(message, "bad");
    els.report.textContent = message;
  }
}

function updateMod(modInput, offsets) {
  const indexes = buildIndexes(offsets);
  const cursors = new Map();
  const updated = JSON.parse(JSON.stringify(modInput));
  const items = [];
  const files = new Set();
  let total = 0;
  let applied = 0;
  let errors = 0;
  let unchanged = 0;

  for (const patch of updated.patches || []) {
    patch.game_file = normalizeFile(patch.game_file);
    files.add(patch.game_file);

    for (const change of patch.changes || []) {
      total++;
      const row = takeOffsetRow(indexes, cursors, patch.game_file, change);
      if (!row) {
        errors++;
        items.push({ file: patch.game_file, label: change.label, entry: change.entry, status: "erro", reason: "Offset não encontrado." });
        continue;
      }

      if (isEntryChange(change)) {
        const oldOffset = change.rel_offset;
        const oldOriginal = change.original;
        change.rel_offset = row.rel_offset ?? row.offset;
        change.original = row.original_value ?? change.original;
        const same = oldOffset === change.rel_offset && oldOriginal === change.original;
        if (same) unchanged++;
        applied++;
        items.push({ file: patch.game_file, label: change.label, entry: change.entry, status: same ? "sem mudança" : "aplicado", oldOffset, newOffset: change.rel_offset });
      } else {
        const oldOffset = change.offset;
        const oldOriginal = change.original;
        change.offset = Number(row.offset);
        change.original = row.original_value ?? change.original;
        const same = oldOffset === change.offset && oldOriginal === change.original;
        if (same) unchanged++;
        applied++;
        items.push({ file: patch.game_file, label: change.label, status: same ? "sem mudança" : "aplicado", oldOffset, newOffset: change.offset });
      }
    }
  }

  return {
    updated,
    report: {
      format: detectFormat(modInput),
      total,
      applied,
      errors,
      unchanged,
      game_files: [...files].sort(),
      items,
    },
  };
}

async function processMod() {
  try {
    if (!state.currentMod || !state.currentAnalysis) {
      await analyzeMod();
      if (!state.currentMod) return;
    }

    state.result = null;
    els.download.disabled = true;
    els.stats.hidden = true;
    els.report.textContent = t("updating");

    const versionId = els.version.value;
    setStatus(t("applyingOffsets"));
    const offsets = await loadOffsets(versionId);
    const version = state.versions.find((v) => v.id === versionId);
    const result = updateMod(state.currentMod, offsets);
    updateMetadata(result.updated, version, versionId);
    const modName = getModName(state.currentMod, state.currentFileName);
    const safe = modName.replace(/[^a-z0-9_-]+/gi, "_");
    state.resultName = `${safe}__${(version?.name || versionId).replace(/[^a-z0-9_-]+/gi, "_")}.json`;
    state.result = result.updated;

    els.sTotal.textContent = result.report.total;
    els.sApplied.textContent = result.report.applied;
    els.sUnchanged.textContent = result.report.unchanged;
    els.sErrors.textContent = result.report.errors;
    els.stats.hidden = false;
    els.download.disabled = false;

    const lines = [
      `Mod: ${modName}`,
      `Versão: ${version?.name || versionId}`,
      `Formato: ${result.report.format}`,
      `Total: ${result.report.total}`,
      `Aplicados: ${result.report.applied}`,
      `Sem mudança: ${result.report.unchanged}`,
      `Erros: ${result.report.errors}`,
      "",
      "Arquivos:",
      ...result.report.game_files.map((f) => `- ${f}`),
      "",
      "Primeiros itens:",
      ...result.report.items.slice(0, 80).map((item) => {
        const extra = item.entry ? ` | ${item.entry}` : "";
        const offset = item.newOffset !== undefined ? ` | ${item.oldOffset} -> ${item.newOffset}` : "";
        return `[${item.status}] ${item.file}${extra}${offset} | ${item.label}`;
      }),
    ];
    els.report.textContent = lines.join("\n");
    setStatus(result.report.errors ? t("updatedWithPending") : t("updatedOk"), result.report.errors ? "warn" : "ok");
  } catch (error) {
    const message = error instanceof Error ? error.message : t("unexpected");
    setStatus(message, "bad");
    els.report.textContent = message;
  }
}

function downloadResult() {
  if (!state.result) return;
  const blob = new Blob([JSON.stringify(state.result, null, 2)], { type: "application/json" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = state.resultName;
  document.body.appendChild(a);
  a.click();
  a.remove();
  URL.revokeObjectURL(url);
}

function resetForNewInput() {
  state.currentMod = null;
  state.currentAnalysis = null;
  state.result = null;
  els.process.disabled = true;
  els.download.disabled = true;
  els.stats.hidden = true;
  els.analysisBox.hidden = true;
  els.report.textContent = t("emptyReport");
}

els.langButtons.forEach((button) => {
  button.addEventListener("click", () => setLanguage(button.dataset.langButton));
});
els.analyze.addEventListener("click", analyzeMod);
els.process.addEventListener("click", processMod);
els.download.addEventListener("click", downloadResult);
els.file.addEventListener("change", resetForNewInput);
els.version.addEventListener("change", resetForNewInput);

loadVersions().catch((error) => {
  setStatus(error.message || t("loadedFail"), "bad");
});

applyLanguage();
