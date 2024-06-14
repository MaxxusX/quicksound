"use strict";

if (localStorage.getItem("fs") === null) localStorage.setItem("fs", "1");
let fontsize = Number(localStorage.getItem("fs"));
document.querySelector(":root").dataset.fs = fontsize % 3;

if (JSON.parse(localStorage.getItem("packs") ?? "[]").length === 0) localStorage.setItem("packs", '["HOSTED/test_pack.json"]');
let packs = JSON.parse(localStorage.getItem("packs"));

// DON'T WORRY! Everything passed through this function is inserted into
// DOM through textContent, which doesn't parse this as HTML, therefore
// preventing XSS, so we don't need to worry about escaping characters.
const filterName = (name) => {
  let filtered = name ?? "";
  return filtered.toString().trim().substring(0, 36).trim();
};

const mel = (el, data) => {
  let element = document.createElement(el);
  for (const [k, v] of Object.entries(data ?? {})) {
    element[k] = v;
  };
  return element;
};

const getURL = (val) => {
  if (val === null || val === undefined) return {"valid": false, "url": ""};

  const str = val.toString();
  const url = URL.parse(str, window.location.href);

  if (url === null) return {"valid": false, "url": str};
  if (url.protocol !== "https:" && url.protocol !== "data:" && url.protocol !== "blob:") return {"valid": false, "url": str};

  return {"valid": true, "local": window.location.origin === url.origin, "url": url.href};
};

const error = (e) => {
  console.error(e);
  alert(e);
};

const addPackButtons = (pack, packurl) => {
  console.log("a");
  const packname = filterName(pack["packname"]);

  if (packname === "") {
    error("one of your packs is missing a packname!");
    return;
  };
  if ((packname["sounds"] ?? {}).length === 0) {
    error(packname + " does not have any sounds!");
    return;
  };
  
  console.log("b");

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
  
  console.log("c");

  for (const [k, v] of Object.entries(pack["sounds"])) {
    const soundname = filterName(k);
    if (soundname === "") {
      error(packname + " has a bad sound name!");
      return;
    };
    if (!isURI(v["sound"])) {
      error(packname + " has a bad sound url!");
      return;
    };

    let bc = mel("div");
    let button = mel("button", { type: "button" });
    
    if (isURI(v["bg"])) {
      button.style.background = `no-repeat padding-box center/cover url("${v["bg"]}"), #1b1e22`;
    };
    
    button.addEventListener("click", () => {
      new Audio(v["sound"]).play().catch(e => error(e));
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

document.querySelector("#cfs").addEventListener("click", () => {
  fontsize++;
  localStorage.setItem("fs", String(fontsize % 3));
  document.querySelector(":root").dataset.fs = fontsize % 3;
});

packs.forEach(packurl => addPack(packurl));
document.querySelector("#addpack").addEventListener("click", () => {
  let url = prompt("link to pack.json");
  if (url === null) return; // user clicked cancel
  if (!isURI(url)) {
    error("invalid url! link must be a direct path to the json file over https: data: or blob:");
    return;
  };
  packs.push(url);
  localStorage.setItem("packs", JSON.stringify(packs));
  location.reload();
});
