
var new_dom = (e)=> document.createElement(e);

const articles = {
  guide: [
    "readme", "入门",
    "1.let", "声明变量",
    "2.num", "使用数字",
    "3.str", "使用字符串",
    "4.collect", "集合类型",
    "5.for", "if和for",
    "6.func", "函数",
    "7.class", "类声明",
    "8.mod", "模块化",
    "9.async", "异步操作",
    "10.try", "异常处理",
    "11.match", "匹配",
    "n.extern", "番外:extern"
  ],
  native: [
    "readme", "序言",
    "1.start", "开始",
    "2.func", "函数",
    "3.class", "类",
    "4.class", "类与unsafe",
    "5.scope", "作用域",
    "6.planet", "使用Planet",
    "n.install", "附: Rust简单入门",
  ],
  prim: [
    "readme", "开始",
    "global", "全局函数",
    "func", "Func",
    "bool", "Bool",
    "int", "Int",
    "uint", "Uint",
    "float", "Float",
    "str", "Str",
    "list", "List",
    "buf", "Buf",
    "obj", "Obj",
  ],
  wasm: [
    "readme", "演武场"
  ]
};

let caches = {
  guide: {},
  native: {},
  prim: {},
  wasm: {}
};
let caches_para = {
  guide: {},
  native: {},
  prim: {},
  wasm: {}
};

const $main = document.querySelector("main");
const $nav = $main.querySelector("nav");
const $scrollbar = $main.querySelector("scroll");
const $about = document.querySelector("about");

const $header = document.querySelector("header");
const load = (n)=> $header.className = n;

const $404 = document.getElementById("p404");
$404.remove();

let last_book = "";
let last_arti = -2;

function render_nav(book) {
  if (book==last_book) return;
  last_book = book;
  
  var list = articles[book];
  $nav.textContent = "";
  for (let i=0; i<list.length; i+=2) {
    let $p = new_dom("p");
    $nav.append($p);
    $p.append(list[i+1]);

    $p.onclick = ()=> {
      if (i == last_arti) return;
      last_arti = i;
      let id = list[i];
      rout.push(`/${book}/${id}`);
      render_arti(book, id);
    }
  }
}

function art_to_para($art) {
  let $para = new_dom("para");
  for ($c of $art.children) {
    let $p = new_dom("a");
    switch ($c.tagName) {
      case "H1": 
      case "H2": 
      case "H3": 
      case "H4": 
        $p.className = $c.tagName;
        break;
      default: continue
    }
    $p.textContent = $c.id = $c.textContent;
    $c.id = $c.textContent.replace(/\s/g, "-");
    $p.href = "#"+$c.id;
    $para.append($p);
  }
  return $para;
}

function render_arti(book, id, hash) {
  load("load");
  if(caches[book][id]) {
    $main.children[1].remove();
    $main.children[1].remove();
    $main.children[1].remove();
    let $cac = caches[book][id];
    $cac.style.transform = "";
    $main.append($cac);
    $scrollbar.style.height = "0px";
    $main.append($scrollbar);
    $main.append(caches_para[book][id]);
    load("");
    if(hash) location.hash = hash;
    return;
  }
  fetch(`/articles/${book}/${id}.md`).then(v=>{
    if (!v.ok) {
      return Promise.reject()
    }
    return v.text()
  }).then(str=> {
    let $art = md_to_dom(str);
    caches[book][id] = $art;
    let $para = art_to_para($art);
    caches_para[book][id] = $para;
    $main.children[1].remove();
    $main.children[1].remove();
    $main.children[1].remove();
    $main.append($art);
    $scrollbar.style.height = "0px";
    $main.append($scrollbar);
    $main.append($para);
    load("");
    if(hash) location.hash = hash;
  }).catch(()=> rout.go404())
}

function md_to_dom(str) {
  let parsed = marked.parse(str);
  let $art = new_dom("article");
  $art.innerHTML = parsed;

  // 路由jmp
  $art.querySelectorAll("jmp").forEach($jmp=> {
    let to = $jmp.getAttribute("to");
    $jmp.onclick = ()=> {
      rout.push(to);
      rout.go(to)
    };
  });

  // 设置target=_blank
  for ($a of $art.querySelectorAll("a")) {
    let href = $a.getAttribute("href");
    if (href&&href.startsWith("#")) continue;
    $a.setAttribute("target", "_blank");
  };

  // 为codes添加play按钮
  $art.querySelectorAll("pre>code").forEach(($code)=> {
    Prism.highlightElement($code);
    if (!$code.classList.contains("language-ks")) return;
    let $play = new_dom("play");
    $play.onclick = ()=> play($code.textContent);
    $code.parentElement.append($play);
  });

  // 附加滚动
  let wheel_offset = 0;
  let wheel_timeid = 0;
  let trans_end = ()=> {
    let id = articles[last_book][last_arti];
    rout.push(`/${last_book}/${id}`);
    render_arti(last_book, id);
    $art.ontransitionend = null;
    $art.onwheel = wheel;
  };
  let wheel = (e)=> {
    if (!(
      (e.deltaY > 0 && $art.scrollTop + $art.clientHeight + 10 > $art.scrollHeight)
      || (e.deltaY < 0 && $art.scrollTop < 10)
    )) return;

    wheel_offset += e.deltaY;
    $art.style.transform = "translateY("+(-wheel_offset/10)+"px)";
    clearTimeout(wheel_timeid);
    wheel_timeid = setTimeout(() => {
      wheel_offset = 0;
      $art.style.transform = "translateY(0)";
    }, 500);

    if (wheel_offset>500) {
      wheel_offset = 0;
      if (articles[last_book][last_arti+2]) {
        last_arti += 2;
        clearTimeout(wheel_timeid);
        $art.onwheel = null;
        $art.style.transform = "translateY(-120%)";
        $scrollbar.style.height = "0px";
        $art.ontransitionend = trans_end;
      }
    }else if (wheel_offset< -500) {
      wheel_offset = 0;
      if (articles[last_book][last_arti-2]) {
        last_arti -= 2;
        clearTimeout(wheel_timeid);
        $art.onwheel = null;
        $art.style.transform = "translateY(120%)";
        $art.ontransitionend = trans_end;
      }
    }
  }

  $art.onwheel = wheel;
  $art.onscroll = ()=> $scrollbar.style.height = $art.scrollTop / ($art.scrollHeight - $art.clientHeight) * 100 + "%";
  return $art
}


let at_about = false;
let rout = {
  push(s) {
    history.pushState(0,"",s);
  },
  go(s) {
    var s = s.split("#");
    let hash = s[1];
    let l = s[0].split("/").filter((s)=>s!="");
    let book = l[0]?l[0]:"guide";
    
    if (book == "about") {
      return rout.go_about();
    }
    if(!articles[book]) {
      return rout.go404();
    }
    
    let id = l[1]?l[1]:"readme";
    let this_arti = articles[book].indexOf(id);
    if (this_arti===-1) return rout.go404();
    if (last_arti===this_arti&&book===last_book) {
      if(hash) location.hash = hash;
      return;
    }
    last_arti = this_arti;

    if (at_about) {
      $main.style.transform = "";
      $about.style.transform = "translateX(-200%)";
      at_about = false;
    }
    
    render_nav(book);
    render_arti(book, id, hash);
  },
  go_about() {
    if(at_about) {return}
    last_book = "about";
    rout.push("/about");
    at_about = true;
    $main.style.transform = "translateX(100%)";
    $main.ontransitionend = ()=> {
      $main.ontransitionend = null;
      $about.style.transform = "";
    };
  },
  go404() {
    if (at_about) {
      $main.style.transform = "";
      $about.style.transform = "translateX(-200%)";
      at_about = false;
    }
    load("load");
    last_arti = -2;
    $main.children[1].remove();
    $main.children[1].remove();
    $main.children[1].remove();
    $main.append($404);
    $main.append(new_dom("para"));
    $main.append($scrollbar);
  }
};
window.onpopstate = ()=> {
  rout.go(location.pathname+location.hash);
};

rout.go(location.pathname+location.hash);

{
  let $buts = document.querySelector("buts");
  $buts.children[0].onclick = ()=>{
    rout.push("/guide");
    rout.go("/guide");
  };
  $buts.children[1].onclick = ()=>{
    rout.push("/prim");
    rout.go("/prim");
  }
  $buts.children[2].onclick = ()=>{
    rout.push("/native");
    rout.go("/native");
  };
  $buts.children[3].onclick = ()=>rout.go_about();

  let $menu = $header.querySelector("mobile-menu");
  function menu_show() {
    $menu.onclick = menu_hid;
    $header.style.cssText = "height:100%;background-color:#0115;";
    $main.className = "blur";
    $nav.style.cssText = "display:block;animation:fade-in 0.5s;";
    $buts.style.cssText = "display:block;animation:fade-in 0.5s;";
  }
  function menu_hid() {
    $menu.onclick = menu_show;
    $header.style.cssText = "height:60px;opacity:1;";
    $main.className = "";
    $nav.style.cssText = "display:none;animation:none;";
    $buts.style.cssText = "display:none;animation:none;";
  }
  $menu.onclick = menu_show;


  let $clickeff = document.querySelector("click-effect");
  document.addEventListener("click", (e)=> {
    let d = new_dom("div");
    d.style.cssText = `top:${e.clientY-5}px;left:${e.clientX-5}px;`;
    d.onanimationend = ()=> d.remove();
    $clickeff.append(d);
  });
}
document.getElementById("header-back").onclick = ()=> history.back();


$about.onmousemove = (e)=> {
  let y = e.clientX / document.documentElement.clientWidth * 2 - 1;
  let x = -e.clientY / document.documentElement.clientHeight * 2 + 0.3;
  $about.querySelector("svg").style.transform = "rotateX("+x+"deg) rotateY("+ y +"deg)";
};

let play_window = null;
let play_loaded = false;
function play(s) {
  if(!play_loaded) {
    play_window = window.open("https://play.subkey.top/");
    play_loaded = s;
    window.onmessage = (e)=> {
      if(e.data==="load") {
        play_window.postMessage(play_loaded, "*");
        play_loaded = true;
      }
      if(e.data==="close") {
        play_loaded = false;
        play_window = null;
      }
    }
  }else {
    play_window.postMessage(s, "*")
  }
  play_window.focus();
}
