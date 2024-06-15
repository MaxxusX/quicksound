"use strict";

if (localStorage.getItem("fs") === null) localStorage.setItem("fs", "1");
let fontsize = Number(localStorage.getItem("fs"));
document.querySelector(":root").dataset.fs = fontsize % 3;
document.querySelector("#cfs").addEventListener("click", () => {
  fontsize++;
  localStorage.setItem("fs", String(fontsize % 3));
  document.querySelector(":root").dataset.fs = fontsize % 3;
});

// using a try..catch here because JSON.parse throws errors if its not valid JSON
try {
  if (!Array.isArray(JSON.parse(localStorage.getItem("packs")))) {
    throw new Error();
  };
} catch {
  localStorage.setItem("packs", "[]");
};
let packs = JSON.parse(localStorage.getItem("packs"));

// DON'T WORRY! Everything passed through this function is inserted into
// DOM through textContent, which doesn't parse this as HTML, therefore
// preventing XSS, so we don't need to worry about escaping characters.
const filterName = (name) => (name ?? "").toString().trim().substring(0, 36).trim();

const mel = (el, data) => {
  let element = document.createElement(el);
  for (const [k, v] of Object.entries(data ?? {})) {
    element[k] = v;
  };
  return element;
};

const getURL = (val) => {
  if (val === null || val === undefined) return {"valid": false, "local": false, "url": ""};

  const str = val.toString();
  const url = URL.parse(str, URL.parse("./packs/", window.location.href));

  if (url === null) return {"valid": false, "local": false, "url": str};
  if (url.protocol !== "https:" && url.protocol !== "data:" && url.protocol !== "blob:") return {"valid": false, "local": false, "url": str};

  return {"valid": true, "local": (window.location.origin === url.origin), "url": url.href};
};

const error = (e) => {
  console.error(e);
  alert(e);
};

const addPackButtons = (pack, packurl) => {
  const packname = filterName(pack["packname"]);

  if (packname === "") {
    error("one of your packs is missing a packname!");
    return;
  };
  if ((packname["sounds"] ?? {}).length === 0) {
    error(packname + " does not have any sounds!");
    return;
  };

  const div = mel("div");
  div.appendChild(mel("hr"));
  const packtitle = mel("h2", { textContent: packname, className: "packtitle" });
  packtitle.addEventListener("click", () => {
    if (window.confirm("Are you sure you want to remove this soundpack?")) {
      const idx = packs.indexOf(packurl);
      if (idx !== -1) localStorage.setItem("packs", JSON.stringify(packs.toSpliced(idx, 1)));
      location.reload();
    };
  });
  div.appendChild(packtitle);
  let sc = mel("div", { className: "sound-container" });

  for (const [k, v] of Object.entries(pack["sounds"])) {
    const soundname = filterName(k);
    if (soundname === "") {
      error(packname + " has a bad sound name!");
      return;
    };
    let soundurl = getURL(v["sound"]);
    if (!soundurl.valid) {
      error(packname + " has a bad sound url!");
      return;
    };

    let bc = mel("div");
    let button = mel("button", { type: "button" });

    let bgurl = getURL(v["bg"]);
    if (bgurl.valid) {
      button.style.background = `no-repeat padding-box center/cover url("${bgurl.url}"), #1b1e22`;
    };
    
    button.addEventListener("click", () => {
      new Audio(soundurl.url).play().catch(e => error(e));
    });
    
    button.appendChild(mel("p", { textContent: soundname }));
    
    bc.appendChild(button);
    sc.appendChild(bc);
  };

  div.appendChild(sc);
  document.body.appendChild(div);
  
  console.log("e");
};

const addPack = (packurl) => {
  fetch(packurl, {
    headers: [
      ["Accept", "application/json;q=1.0, text/plain;q=0.5"],
    ],
    credentials: "omit",
    referrer: "",
    referrerPolicy: "no-referrer",
  }).then(res => {
    console.log(res);
    if (!res.ok) {
      error(`a pack (${packurl}) has an HTTP error! Status: ${res.status}`);
      return null;
    };

    return res.json();
  }).then(pack => {
    console.log(pack);
    if (pack !== null) addPackButtons(pack, packurl);
  }, e => error("unknown error, check console for more details.\n\n" + e));
};

packs.forEach(packurl => addPack(packurl));

document.querySelector("#addpack").addEventListener("click", () => {
  // example pack: "./test_pack/pack.json"
  let url = prompt("link to pack.json");
  if (url === null) return; // user clicked cancel

  url = getURL(url);

  if (!url.valid) {
    error("invalid url! link must be a direct path to the json file over https: data: or blob:");
    return;
  };
  if (!url.local) {
    if (!confirm("⚠️ USE AT YOUR OWN RISK ⚠️\n\nas this soundpack is externally hosted, i cannot confirm its saftey.\nfurthermore, you will be subject to the privacy policy, terms of service, and any other rules/regulations set forth by the author of this soundpack.\n\nif you do not wish to proceed, please click \"cancel\".")) return;
  };

  packs.push(url.url);
  localStorage.setItem("packs", JSON.stringify(packs));
  location.reload();
});
