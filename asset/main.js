
// 在线尝试

var new_dom = (e)=> document.createElement(e);

const articles = {
  guide: [
    "readme", "快速开始",
    "1.declare", "基本类型 1",
    "2.declare", "基本类型 2",
    "3.nature", "Key语言哲学",
    "4.class", "类定义",
    "5.module", "模块化",
    "6.ops", "运算符",
    "7.if_for", "if和for",
    "8.async", "异步操作",
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
    "list", "List",
    "buf", "Buf",
    "str", "Str",
    "float", "Float",
    "int", "Int",
    "float", "Float",
    "obj", "Obj",
    "func", "Func"
  ]
};

let caches = {
  guide: {},
  native: {},
  prim: {}
};
let caches_para = {
  guide: {},
  native: {},
  prim: {}
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

  // highlight
  for ($code of $art.querySelectorAll("code")) {
    Prism.highlightElement($code)
  }

  // 路由jmp
  for ($jmp of $art.querySelectorAll("jmp")) {
    let to = $jmp.getAttribute("to");
    $jmp.onclick = ()=> {
      rout.push(to);
      rout.go(to)
    };
  };
  // 设置target=_blank
  for ($a of $art.querySelectorAll("a")) {
    let href = $a.getAttribute("href");
    if (href&&href.startsWith("#")) continue;
    $a.setAttribute("target", "_blank");
  };

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
    if (last_arti===this_arti&&book===last_book) return;
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
}
document.getElementById("header-back").onclick = ()=> history.back();


$about.onmousemove = (e)=> {
  let y = e.clientX / document.documentElement.clientWidth * 2 - 1;
  let x = -e.clientY / document.documentElement.clientHeight * 2 + 0.3;
  $about.querySelector("svg").style.transform = "rotateX("+x+"deg) rotateY("+ y +"deg)";
};
