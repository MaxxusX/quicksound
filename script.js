"use strict";

/*
remember to escape < and > from title and descripton!
also remember if an image is not provided, to set the background to color #1b1e22 

format i think:

{
  packname: "example pack",
  sounds: {
    amogus: {
      bg: "https://example.com/amogus.png",
      sound: "https://example.com/sus.wav"
    },
    bomb: {
      sound: "https://example.com/bomb.mp3"
    }
  }
}

must be a json file, host it on github or something.
packname and sound names are limited to 36 characters.
other characters are ignored.
bg must be png, jpg, or webp, not required, recommended size is 100x100.
sound must be mp3, or wav.
url protocols must be https: or data:

*/

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
  let url;

  try {
    url = new URL(str);
  } catch {
    return false;
  };

  return url.protocol === "https:" || url.protocol === "data:";
};

const addPack = (data) => {
  const pack = JSON.parse(data);
  const packname = filterName(pack["packname"]);

  if (packname === "") {
    alert("one of your packs is missing a packname!");
    return;
  };
  if ((packname["sounds"] ?? {}).length === 0) {
    alert(packname + " does not have any sounds!");
    return;
  };

  const div = mel("div");
  div.appendChild(mel("hr"));
  div.appendChild(mel("h2", { textContent: packname }));
  let sc = mel("div", { className: "sound-container" });

  for (const [k, v] of Object.entries(pack["sounds"])) {
    const soundname = filterName(k);
    if (soundname === "") {
      alert(packname + " has a bad sound name!");
      return;
    };
    if (!v["sound"] || v["sound"].length <= 0 || !isURI(v["sound"])) {
      alert(packname + " has a bad sound url!");
      return;;
    };

    let bc = mel("div");
    let button = mel("button", { type: "button" });
    // add bg and click detection to button
    if (v["bg"] && v["bg"].length > 0 && isURI(v["bg"])) {
      button.style.background = `no-repeat center/cover url("${v["bg"]}"), #1b1e22`;
    };
    button.addEventListener("click", () => {
      // play sound
    });
    button.appendChild(mel("p", { textContent: soundname }));
    bc.appendChild(button);
    sc.appendChild(bc);
  };

  div.appendChild(sc);
  document.body.appendChild(div);
};

addPack(JSON.stringify({
  packname: "test pack",
  sounds: {
    amogus: {
      bg: "https://raw.githubusercontent.com/MaxxusX/stuff/main/maxkind-1080p.png",
      sound: "https://raw.githubusercontent.com/3kh0/soundboard/main/sounds/amongus.mp3",
    },
  },
}));
