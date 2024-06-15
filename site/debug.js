// for when i don't have easy access to dev console
if (document.querySelector("html").dataset.debug !== undefined) {
  const oldconsoledebug = (...t) => console.debug(t);
  console.debug = (...t) => {
    oldconsoledebug(t);
    alert("debug\n\n" + t.join(" "));
  };
  
  const oldconsoleerror = (...t) => console.error(t);
  console.error = (...t) => {
    oldconsoleerror(t);
    alert("error\n\n" + t.join(" "));
  };
  
  const oldconsolewarn = (...t) => console.warn(t);
  console.warn = (...t) => {
    oldconsolewarn(t);
    alert("warn\n\n" + t.join(" "));
  };
  
  const oldconsolelog = (...t) => console.log(t);
  console.log = (...t) => {
    oldconsolelog(t);
    alert("log\n\n" + t.join(" "));
  };
  
  const oldconsoleinfo = (...t) => console.info(t);
  console.info = (...t) => {
    oldconsoleinfo(t);
    alert("info\n\n" + t.join(" "));
  };
  
  const oldconsoletrace = (...t) => console.trace(t);
  console.trace = (...t) => {
    oldconsoletrace(t);
    alert("trace\n\n" + t.join(" "));
  };
};
