/* Card/kit helper: fetch .jsx component files, strip import/export, transpile with Babel, expose on window.MK */
window.MK = window.MK || {};
window.loadJsx = async function(paths){
  for (const p of paths){
    const src = await (await fetch(p)).text();
    const clean = src.replace(/\r/g,'').replace(/^[ \t]*import\b[^\n]*/gm,'').replace(/\bexport\s+(?=function|const|class)/g,'');
    const out = Babel.transform(clean,{presets:[['react',{runtime:'classic'}]]}).code;
    const names=[...clean.matchAll(/^(?:function|const)\s+([A-Za-z_$][\w$]*)/gm)].map(m=>m[1]);
    const inherit=Object.keys(MK).filter(k=>!names.includes(k)); const fn=new Function('React','MK', (inherit.length?'const {'+inherit.join(',')+'}=MK;\n':'')+out+'\n'+names.map(n=>'MK.'+n+'='+n+';').join(''));
    fn(window.React, window.MK);
  }
  return window.MK;
};