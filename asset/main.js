
// 在线尝试
// 文章链接跳转

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
    "n.extern", "番外:extern"
  ],
  native: [
    "readme", "序言",
    "1.start", "开始",
    "2.func", "函数",
    "3.class", "类",
    "4.class", "类与unsafe",
    "5.scope", "作用域",
    "n.install", "附: Rust简单入门",
  ],
  prim: [
    "readme", "开始"
  ]
};

let caches = {
  guide: {},
  native: {},
  prim: {}
};

const $main = document.querySelector("main");
const $nav = $main.querySelector("nav");
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

function render_arti(book, id) {
  load("load");
  if(caches[book][id]) {
    $main.children[1].remove();
    let $cac = caches[book][id];
    $cac.style.transform = "";
    $main.append($cac);
    load("");
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
    $main.children[1].remove();
    $main.append($art);
    load("");
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
  return $art
}


let at_about = false;
let rout = {
  push(s) {
    history.pushState(0,"",s);
  },
  go(s) {
    let l = s.split("/").filter((s)=>s!="");
    let book = l[0]?l[0]:"guide";

    if (book == "about") {
      return rout.go_about();
    }
    if (at_about) {
      $main.style.transform = "";
      $about.style.transform = "translateX(-200%)";
      at_about = false;
    }
    
    if(!articles[book]) {
      return rout.go404();
    }
    render_nav(book);

    let id = l[1]?l[1]:"readme";
    last_arti = articles[book].indexOf(id);
    if (last_arti===-1) return rout.go404();

    render_arti(book, id);
  },
  go_about() {
    if(at_about) {return}
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
    $main.append($404);
  }
};
window.onpopstate = ()=> {
  rout.go(location.pathname)
};

rout.go(location.pathname)

{
  let $buts = document.querySelector("buts").children;
  $buts[0].onclick = ()=>{
    rout.push("/guide");
    rout.go("/guide");
  };
  $buts[1].onclick = ()=>{
    rout.push("/prim");
    rout.go("/prim");
  }
  $buts[2].onclick = ()=>{
    rout.push("/native");
    rout.go("/native");
  };
  $buts[3].onclick = ()=>rout.go_about();
}
document.getElementById("header-back").onclick = ()=> history.back();


$about.onmousemove = (e)=> {
  let y = e.clientX / document.documentElement.clientWidth * 2 - 1;
  let x = -e.clientY / document.documentElement.clientHeight * 2 + 0.3;
  $about.querySelector("svg").style.transform = "rotateX("+x+"deg) rotateY("+ y +"deg)";
};
