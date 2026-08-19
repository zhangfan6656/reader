const { contextBridge, ipcRenderer } = require('electron');
contextBridge.exposeInMainWorld('electronAPI', {
  setOpacity: v => ipcRenderer.invoke('set-opacity', v),
  setIgnore: v => ipcRenderer.invoke('set-ignore', v),
  setTop: v => ipcRenderer.invoke('set-top', v),
  hide: () => ipcRenderer.invoke('hide'),
  quit: () => ipcRenderer.invoke('quit')
});
let ign = false, top = true;
window.addEventListener('DOMContentLoaded', () => {
  const css = '#eBar{position:fixed;top:0;left:0;right:0;z-index:9999;display:flex;align-items:center;gap:8px;padding:5px 8px;background:rgba(11,13,18,.92);font-size:12px;color:#e6e9ef;font-family:sans-serif}#eBar .drag{-webkit-app-region:drag;cursor:move;color:#9aa4b2;padding:2px 8px}#eBar button{background:#232833;color:#e6e9ef;border:none;border-radius:6px;padding:4px 8px;cursor:pointer}.app{height:calc(100vh - 34px)!important;margin-top:34px!important}body.stealth{background:transparent!important}body.stealth .side{display:none!important}body.stealth .card,body.stealth .reader,body.stealth .assist{background:transparent!important;border-color:transparent!important}body.stealth .reader{text-shadow:0 1px 3px rgba(0,0,0,.9);color:#f2f5fa}';
  const st = document.createElement('style'); st.textContent = css; document.head.appendChild(st);
  const bar = document.createElement('div'); bar.id = 'eBar';
  bar.innerHTML = '<span class="drag">拖动</span><button id="e_s">隐身</button><input id="e_o" type="range" min="25" max="100" value="100"><button id="e_t">置顶</button><button id="e_i">穿透</button><span style="flex:1"></span><button id="e_h">-</button><button id="e_q">X</button>';
  document.body.appendChild(bar);
  e_s.onclick = () => document.body.classList.toggle('stealth');
  e_o.oninput = e => electronAPI.setOpacity(e.target.value / 100);
  e_t.onclick = () => { top = !top; electronAPI.setTop(top); e_t.textContent = top ? '置顶:开' : '置顶:关'; };
  e_i.onclick = () => { ign = !ign; electronAPI.setIgnore(ign); };
  e_h.onclick = () => electronAPI.hide();
  e_q.onclick = () => electronAPI.quit();
  ipcRenderer.on('ignore-changed', (ev, v) => { ign = v; });
});