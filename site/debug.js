// for when i don't have easy access to dev console
if (document.querySelector("html").dataset.debug !== undefined) {
  document.addEventListener("DOMContentLoaded", () => document.querySelector(".spread").textContent = "debug";
  let debugpre = document.createElement("pre");
  debugpre.appendChild(Object.assign(document.createElement("code"), {"id": "debuglog", "textContent": "debug log"}));
  document.body.appendChild(debugpre);
  const addtolog = (...t) => document.querySelector("#debuglog").innerHTML += "<hr>" + t.join(" ").replaceAll("<", "&lt;").replaceAll(">", "&gt;");

  const oldconsoledebug = (...t) => console.debug(t);
  console.debug = (...t) => {
    oldconsoledebug(t);
    addtolog("debug: " + t.join(" "));
  };

  const oldconsoleerror = (...t) => console.error(t);
  console.error = (...t) => {
    oldconsoleerror(t);
    addtolog("error: " + t.join(" "));
  };

  const oldconsolewarn = (...t) => console.warn(t);
  console.warn = (...t) => {
    oldconsolewarn(t);
    addtolog("warn: " + t.join(" "));
  };
  
  const oldconsolelog = (...t) => console.log(t);
  console.log = (...t) => {
    oldconsolelog(t);
    addtolog("log: " + t.join(" "));
  };
  
  const oldconsoleinfo = (...t) => console.info(t);
  console.info = (...t) => {
    oldconsoleinfo(t);
    addtolog("info: " + t.join(" "));
  };
  
  const oldconsoletrace = (...t) => console.trace(t);
  console.trace = (...t) => {
    oldconsoletrace(t);
    addtolog("trace: " + t.join(" "));
  };

  window.addEventListener("error", e => {
    const a = `Error: ${e.message}\n\n${e.error}\n\n${e.filename}:${e.lineno}:${e.colno}\n\n\n${e}`;
    oldconsoleerror(e);
    addtolog("error: " + e);
  });
};
