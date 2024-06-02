"use strict";

/*
remember to escape < and > from title and descripton!
also remember if an image is not provided, to set the background to color #1b1e22 

format i think:

{
  "packname": "example pack",
  "sounds": {
    "amogus": {
      "bg": "https://example.com/amogus.png",
      "sound": "https://example.com/sus.wav"
    },
    "bomb": {
      "sound": "https://example.com/bomb.mp3"
    }
  }
}

must be a json file, host it on github or something.
packname and sound names are limited to 36 characters.
other characters are ignored.
bg must be png, jpg, or webp, not required, recommended size is 100x100.
sound must be mp3, or wav.
url protocols must be https: data: or blob:

*/

if (localStorage.getItem("fs") === null) localStorage.setItem("fs", "1");
let fontsize = Number(localStorage.getItem("fs"));
switch (fontsize % 3) {
  case 0:
    document.querySelector(":root").style["font-size"] = "12px";
    break;
  case 1:
    document.querySelector(":root").style["font-size"] = null;
    break;
  case 2:
    document.querySelector(":root").style["font-size"] = "20px";
    break;
};
if (JSON.parse(localStorage.getItem("packs") ?? "[]").length === 0) localStorage.setItem("packs", '["https://raw.githubusercontent.com/MaxxusX/quicksound/main/defaultPacks/example.json"]');
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

const isURI = (str) => {
  if (!str) return false;

  let url;

  try {
    url = new URL(str);
  } catch {
    return false;
  };

  return url.protocol === "https:" || url.protocol === "data:" || url.protocol === "blob:";
};

const addPackButtons = (pack, packurl) => {
  console.log("a");
  const packname = filterName(pack["packname"]);

  if (packname === "") {
    alert("one of your packs is missing a packname!");
    return;
  };
  if ((packname["sounds"] ?? {}).length === 0) {
    alert(packname + " does not have any sounds!");
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
      alert(packname + " has a bad sound name!");
      return;
    };
    if (!isURI(v["sound"])) {
      alert(packname + " has a bad sound url!");
      return;
    };

    let bc = mel("div");
    let button = mel("button", { type: "button" });
    // add bg and click detection to button
    if (isURI(v["bg"])) {
      button.style.background = `no-repeat padding-box center/cover url("${v["bg"]}"), #1b1e22`;
    };
    button.addEventListener("click", () => {
      alert("play sound from " + v["sound"]);
    });
    button.appendChild(mel("p", { textContent: soundname }));
    bc.appendChild(button);
    sc.appendChild(bc);
  };
  
  console.log("d");

  div.appendChild(sc);
  document.body.appendChild(div);
  
  console.log("e");
};

const addPack = (packurl) => {
  fetch(packurl, {
    headers: [
      ["Accept", "application/json;q=1.0, text/plain;q=0.9"],
    ],
    credentials: "omit",
    referrer: "",
    referrerPolicy: "no-referrer",
  }).then(res => {
    console.log(res);
    if (!res.ok) {
      alert(`a pack (${packurl}) has an HTTP error! Status: ${res.status}`);
      return null;
    };

    return res.json();
  }).then(pack => {
    console.log(pack);
    if (pack !== null) addPackButtons(pack, packurl);
  }, e => alert("unknown error, check console for more details.\n" + e));
};

document.querySelector("#cfs").addEventListener("click", () => {
  fontsize++;
  localStorage.setItem("fs", String(fontsize % 3));
  switch (fontsize % 3) {
    case 0:
      document.querySelector(":root").style["font-size"] = "12px";
      break;
    case 1:
      document.querySelector(":root").style["font-size"] = null;
      break;
    case 2:
      document.querySelector(":root").style["font-size"] = "20px";
      break;
  };
});

packs.forEach(packurl => addPack(packurl));
document.querySelector("#addpack").addEventListener("click", () => {
  let url = prompt("link to pack.json");
  if (!isURI(url)) {
    alert("invalid url! link must be a direct path to the json file over https: or data:");
    return;
  };
  packs.push(url);
  localStorage.setItem("packs", JSON.stringify(packs));
  location.reload();
});
