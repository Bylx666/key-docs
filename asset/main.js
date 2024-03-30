
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

const $article = document.querySelector("article");
const $nav = document.querySelector("nav").children[0];

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
        $article.innerHTML = caches[book][id];
        return;
      }
      load_start();
      fetch(`/articles/guide/${id}.md`).then(v=>v.text()).then(str=> {
        let parsed = marked.parse(str);
        caches[book][id] = parsed;
        $article.innerHTML = parsed;
        load_end();
      });
    }
  }
}
render_nav("guide");
$nav.children[0].click();
