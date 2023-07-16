// ==UserScript==
// @name         18comic漫画下载
// @namespace    http://github.com/eternalphane/Userscripts/
// @version      1.0.6
// @description  从18comic上下载cbz格式（整话阅读）或webp格式（分页阅读）的漫画
// @author       eternalphane
// @license      MIT
// @match        https://18comic.vip/photo/*
// @match        https://18comic.org/photo/*
// @match        https://jmcomic.me/photo/*
// @match        https://jmcomic1.me/photo/*
// @match        https://jm-comic1.art/photo/*
// @match        https://jm-comic2.art/photo/*
// @match        https://jm-comic3.art/photo/*
// @require      https://greasemonkey.github.io/gm4-polyfill/gm4-polyfill.js
// @require      https://unpkg.com/jszip@3.9.1/dist/jszip.min.js
// @resource     css https://raw.githubusercontent.com/eternalphane/UserScripts/master/18comic%20Downloader/overlay.css
// @resource     html https://raw.githubusercontent.com/eternalphane/UserScripts/master/18comic%20Downloader/overlay.html
// @grant        GM_getResourceText
// @grant        GM.getResourceText
// @grant        GM_addStyle
// @grant        GM.addStyle
// ==/UserScript==

(async () => {
    const ICON_DOWNLOAD = 'data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCA1ODAgNTIwIj48cGF0aCBkPSJNNTI4IDI4OXEyMCAwIDM0IDE0dDE0IDM0djEyOHEwIDIwLTE0IDM0dC0zNCAxNEg0OHEtMjAgMC0zNC0xNFQwIDQ2NVYzMzdxMC0yMCAxNC0zNHQzNC0xNGg5MmwtNDYtNDZxLTIyLTIzLTEwLTUyLjV0NDQtMjkuNWg2NFY0OXEwLTIwIDE0LTM0dDM0LTE0aDk2cTIwIDAgMzQgMTR0MTQgMzR2MTEyaDY0cTMyIDAgNDQuNSAyOS41VDQ4MiAyNDNsLTQ2IDQ2aDkyem0tNDAwLTgwbDE2MCAxNjAgMTYwLTE2MEgzMzZWNDloLTk2djE2MEgxMjh6bTQwMCAyNTZWMzM3SDM4OGwtNjYgNjZxLTE0IDE0LTM0IDE0dC0zNC0xNGwtNjYtNjZINDh2MTI4aDQ4MHptLTgxLTQ3cS03LTctNy0xN3Q3LTE3cTctNyAxNy03dDE3IDdxNyA3IDcgMTd0LTcgMTdxLTcgNy0xNyA3dC0xNy03eiIvPjwvc3ZnPg==';
    const btns = [...document.querySelectorAll('li:has(.fa-bookmark)')].map(liPrev => {
        const li = document.createElement('li');
        for (const attr of liPrev.attributes) {
            li.setAttribute(attr.name, attr.value);
        }
        const btn = document.createElement('a');
        btn.href = '#';
        btn.innerHTML = `
<i class="far" style="background:url(${ICON_DOWNLOAD}) center / contain no-repeat">&#xfeff;</i>
<span>下载</span>`;
        li.appendChild(btn);
        liPrev.after(li);
        return btn;
    });
    GM.addStyle(await GM.getResourceText('css'));
    const overlay = document.createElement('div');
    overlay.id = 'dl-overlay';
    overlay.innerHTML = await GM.getResourceText('html');
    overlay.hidden = true;
    document.body.appendChild(overlay);
    const circle = overlay.querySelectorAll('circle')[1];
    const number = overlay.querySelector('span');
    const msg = overlay.querySelector('h2');
    const updateProgress = (percent, text) => {
        circle.style.strokeDasharray = `${percent} 100`;
        number.innerText = Math.round(percent);
        text != undefined && (msg.innerText = text);
    };
    btns.forEach(btn => btn.addEventListener('click', async e => {
        e.preventDefault();
        if (!overlay.hidden) {
            return;
        }
        overlay.hidden = false;
        document.body.classList.add('noscroll');
        const selector = new URLSearchParams(location.search).get('read_mode') === 'read-by-page' ?
            '.owl-item .center img' :
            '.scramble-page img';
        const pages = [...document.querySelectorAll(selector)];
        const total = pages.length;
        let progress = 0;
        updateProgress(0, 'Downloading...');
        const zip = new JSZip;
        await Promise.all(pages.map(async page => {
            try {
                zip.file(...await download(page.dataset.original ?? page.dataset.src));
            } catch {}
            updateProgress(++progress * 100 / total);
        }));
        updateProgress(0, 'Compressing...');
        // TODO: Select output format? (cbz, cbt, pdf)
        save(
            `${document.querySelector('.panel-heading .pull-left').textContent.trim()}.cbz`,
            await zip.generateAsync({
                type: 'blob',
                compression: 'DEFLATE',
                compressionOptions: { level: 9 },
                mimeType: 'application/vnd.comicbook+zip'
            }, (meta) => updateProgress(meta.percent))
        );
        document.body.classList.remove('noscroll');
        overlay.hidden = true;
    }));
})();

/**
 * @param {string} url
 */
const download = async url => {
    const filename = new URL(url).pathname.split('/').at(-1);
    const [id, ext] = filename.split('.');
    const img = new Image;
    img.src = URL.createObjectURL(await (await fetch(url)).blob());
    await new Promise((resolve, reject) => (img.onload = resolve, img.onerror = reject));
    const w = img.naturalWidth;
    const h = img.naturalHeight;
    const canvas = new OffscreenCanvas(w, h);
    const ctx = canvas.getContext('2d');
    // `aid`, `scramble_id` and `get_num` are both global variables
    if (url.includes('.gif') || aid < scramble_id) {
        ctx.drawImage(img, 0, 0);
    } else {
        const num = get_num(btoa(aid), btoa(id));
        const rem = h % num;
        const sh = Math.floor(h / num);
        let sy = h - rem - sh, dy = rem;
        ctx.drawImage(img, 0, sy, w, rem + sh, 0, 0, w, rem + sh);
        for (let i = 1; i < num; ++i) {
            ctx.drawImage(img, 0, sy -= sh, w, sh, 0, dy += sh, w, sh);
        }
    }
    URL.revokeObjectURL(img.src);
    // TODO: Select image type? Change quality?
    return [filename, await canvas.convertToBlob({
        type: {
            jpg: 'image/jpeg',
            png: 'image/png',
            webp: 'image/webp'
        }[ext],
        quality: 1
    })];
};

const save = (filename, blob) => {
    const a = document.createElement('a');
    a.href = URL.createObjectURL(blob);
    a.download = filename;
    a.click();
    URL.revokeObjectURL(a.href);
};
