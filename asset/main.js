
// todo 上一步按钮

var new_dom = (e)=> document.createElement(e);

const articles = {
  guide: [
    "1.start", "快速开始",
    "2.declare", "基本类型 1",
    "3.declare", "基本类型 2",
    "4.class", "类型声明",
  ]
};

let caches = {
  guide: {}
};

const $loading = document.getElementById("loading");
var load_start = ()=> $loading.className = "act";
var load_end = ()=> $loading.className = "";

const $main = document.querySelector("main");
const $nav = $main.querySelector("nav");

function render_nav(book) {
  var list = articles[book];
  $nav.textContent = "";
  for (let i=0; i<list.length; i+=2) {
    let $p = new_dom("p");
    $nav.append($p);
    let $ico = new_dom("ico");
    $ico.innerHTML = "&#xe847;";
    $p.append($ico);
    $p.append(list[i+1]);

    let id = list[i];
    $p.onclick = ()=> {
      if(caches[book][id]) {
        $main.children[1].remove();
        $main.append(caches[book][id]);
        return;
      }
      load_start();
      fetch(`/articles/guide/${id}.md`).then(v=>v.text()).then(str=> {
        let parsed = marked.parse(str);
        let $art = new_dom("article");
        $art.innerHTML = parsed;
        caches[book][id] = $art;

        $main.children[1].remove();
        $main.append($art);
        load_end();
      });
    }
  }
}
render_nav("guide");
$nav.children[0].click();
