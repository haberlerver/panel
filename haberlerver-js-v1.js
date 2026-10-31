/* Haberlerver.com - JS paket v3 (yalnizca orijinal temadan alinan klasik JS bloklari) */
(function (window) {
  'use strict';
  var parts = Object.create(null);

  /* Orijinal Blogger tema konumu: satir 30543 | hvjs-001 */
  parts["hvjs-001"] = function () {

//
(function () {
  'use strict';
  function norm(text) {
    return String(text || '').replace(/\s+/g, ' ').trim().toLocaleLowerCase('tr-TR');
  }
  function initMemberLoginButton() {
    var menu = document.getElementById('xoxx0i-Menulist');
    var headerRight = document.querySelector('#xoxx0i-mgrid .header-right');
    var searchWrap = headerRight && headerRight.querySelector('.search-wrap');
    if (!menu || !headerRight) return;
    var candidates = Array.prototype.slice.call(menu.querySelectorAll('li > a'));
    var login = candidates.find(function (link) { return norm(link.textContent) === 'üye girişi'; });
    var oldButton = headerRight.querySelector('.hv-member-login-button');
    if (!login) {
      if (oldButton) oldButton.remove();
      return;
    }
    var href = login.getAttribute('href') || '#';
    var item = login.closest('li');
    if (item) item.remove();
    var button = oldButton || document.createElement('a');
    button.className = 'hv-member-login-button';
    button.href = href;
    button.setAttribute('aria-label', 'Üye Girişi');
    button.setAttribute('title', 'Üye Girişi');
    button.innerHTML = '<svg viewBox="0 0 24 24" aria-hidden="true" focusable="false"><circle cx="12" cy="8" r="3.2"></circle><path d="M5.8 19c.7-3 2.8-4.6 6.2-4.6s5.5 1.6 6.2 4.6"></path><circle cx="12" cy="12" r="9"></circle></svg><span>ÜYE GİRİŞİ</span>';
    if (!oldButton) {
      if (searchWrap && searchWrap.parentNode === headerRight) searchWrap.insertAdjacentElement('afterend', button);
      else headerRight.appendChild(button);
    }
  }
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', initMemberLoginButton, { once: true });
  else initMemberLoginButton();
})();
//
  };

  /* Orijinal Blogger tema konumu: satir 31373 | hvjs-002 */
  parts["hvjs-002"] = function () {

//
(function(window,document){
'use strict';
if(window.HVHomeSectionsV84)return;
window.HVHomeSectionsV84=true;
var root=document.getElementById('hv-home-sections');
var configRoot=document.querySelector('#HVHomeCategoryConfig .hv-home-category-config');
if(!root||!configRoot)return;
var jsonCache=Object.create(null);
function entryUrl(entry){var links=entry&&entry.link||[];var alt=links.find(function(link){return link.rel==='alternate';});return alt&&alt.href||'';}
function decodeLabelUrl(href){
  try{
    var url=new URL(href,window.location.href);
    if(url.origin!==window.location.origin)return '';
    var match=url.pathname.match(/\/search\/label\/(.+)$/i);
    return match?decodeURIComponent(match[1].replace(/\+/g,' ')):'';
  }catch(error){return '';}
}
function localHref(href){
  try{var url=new URL(href,window.location.href);return url.origin===window.location.origin?(url.pathname+url.search+url.hash):'';}catch(error){return '';}
}
function readConfigurations(){
  var output=[],countryGroup=null;
  Array.prototype.forEach.call(configRoot.querySelectorAll('a[href]'),function(link){
    var name=String(link.textContent||'').trim();
    var href=localHref(link.getAttribute('href')||link.href);
    var label=decodeLabelUrl(link.getAttribute('href')||link.href);
    if(!name||!label||!href)return;
    var countryMatch=name.match(/^Ülkeler\s*\/\s*(.+)$/i);
    if(countryMatch){
      if(!countryGroup){countryGroup={title:'Ülkeler',labels:[],href:'/search/label/_D%C3%BCnya',mode:'countries'};output.push(countryGroup);}
      if(countryGroup.labels.indexOf(label)===-1)countryGroup.labels.push(label);
      return;
    }
    output.push({title:name,labels:[label],href:href,mode:'label'});
  });
  return output;
}
function fetchLabel(label){
  var key=String(label||'');
  if(jsonCache[key])return jsonCache[key];
  var path='/feeds/posts/summary'+(key?('/-/'+encodeURIComponent(key)):'');
  jsonCache[key]=fetch(path+'?alt=json&max-results=12&orderby=updated&_hv_refresh='+Date.now(),{credentials:'same-origin',cache:'no-store'})
    .then(function(response){if(!response.ok)throw new Error('Feed '+response.status);return response.json();})
    .then(function(data){return data&&data.feed&&data.feed.entry||[];})
    .catch(function(){return [];});
  return jsonCache[key];
}
function resizeImage(url,width){
  var source=String(url||'');
  if(!source)return '';
  if(!/blogger\.googleusercontent\.com\/img\/|bp\.blogspot\.com/i.test(source))return source;
  var segment=/\/(?:s\d+(?:-[a-z0-9]+)*|w\d+(?:-[a-z0-9]+)*)(?=\/)/i;
  if(!segment.test(source))return source;
  var w=width||480,h=Math.round(w*9/16);
  /* V7: Görsel netliğini korumak için zorunlu rw-v70 kalite parametresi eklenmez. */
  return source.replace(segment,'/w'+w+'-c-h'+h);
}
function imageFor(entry){
  var media=entry&&entry['media$thumbnail']&&entry['media$thumbnail'].url;
  if(media)return media;
  var html=String(entry&&entry.summary&&entry.summary.$t||'');
  var match=html.match(/<img\b[^>]*\bsrc=["']([^"']+)["']/i);
  return match?match[1].replace(/&amp;/g,'&'):'';
}
function dateFor(entry){var value=entry&&entry.updated&&entry.updated.$t||entry&&entry.published&&entry.published.$t||'';var time=Date.parse(value);return Number.isFinite(time)?time:0;}
function countryEntries(config){
  return Promise.all(config.labels.map(function(label){return fetchLabel(label);})).then(function(groups){
    var all=[],seen=Object.create(null);
    groups.forEach(function(entries){(entries||[]).forEach(function(entry){var url=entryUrl(entry);if(!url||seen[url])return;seen[url]=true;all.push(entry);});});
    all.sort(function(a,b){return dateFor(b)-dateFor(a);});
    return all.slice(0,12);
  });
}
function categoryEntries(config){
  if(config.mode==='countries')return countryEntries(config);
  return fetchLabel(config.labels[0]||'').then(function(entries){return (entries||[]).filter(function(entry){return !!entryUrl(entry);}).slice(0,12);});
}
function addSkeleton(cards){
  for(var i=0;i<12;i++){
    var card=document.createElement('div');card.className='hv-home-grid-card hv-home-grid-skeleton';card.setAttribute('aria-hidden','true');
    var thumb=document.createElement('div');thumb.className='hv-home-grid-thumb';card.appendChild(thumb);
    var title=document.createElement('div');title.className='hv-home-grid-card-title';
    var line1=document.createElement('span');line1.className='hv-skeleton-line';title.appendChild(line1);
    var line2=document.createElement('span');line2.className='hv-skeleton-line';title.appendChild(line2);
    card.appendChild(title);cards.appendChild(card);
  }
}
function createSection(config){
  var section=document.createElement('section');section.className='hv-home-grid-section';section.setAttribute('aria-label',config.title+' haberleri');section._hvHomeConfig=config;
  var heading=document.createElement('div');heading.className='hv-home-grid-heading';
  var h2=document.createElement('h2');h2.textContent=config.title;heading.appendChild(h2);
  var view=document.createElement('a');view.className='hv-home-grid-viewall';view.href=config.href;view.textContent=config.mode==='countries'?'Dünya haberleri':'Tümünü gör';view.setAttribute('aria-label',config.title+' haberlerinin tümünü gör');view.setAttribute('title',config.title+' haberlerinin tümünü gör');heading.appendChild(view);
  section.appendChild(heading);
  var cards=document.createElement('div');cards.className='hv-home-grid-cards';cards.setAttribute('aria-busy','true');addSkeleton(cards);section.appendChild(cards);
  return section;
}
function renderCard(entry){
  var href=entryUrl(entry);if(!href)return null;
  try{var parsed=new URL(href,window.location.href);if(parsed.origin!==window.location.origin)return null;href=parsed.href;}catch(error){return null;}
  var title=String(entry&&entry.title&&entry.title.$t||'Haberi oku').trim();
  var card=document.createElement('a');card.className='hv-home-grid-card';card.href=href;card.target='_blank';card.rel='noopener noreferrer';card.title=title;card.setAttribute('aria-label',title);
  var thumb=document.createElement('div');thumb.className='hv-home-grid-thumb';
  var image=imageFor(entry);
  if(image){var img=document.createElement('img');img.src=resizeImage(image,480);img.alt=title;img.width=480;img.height=270;img.loading='lazy';img.decoding='async';img.setAttribute('fetchpriority','low');img.onerror=function(){img.remove();};thumb.appendChild(img);}
  card.appendChild(thumb);
  var titleEl=document.createElement('div');titleEl.className='hv-home-grid-card-title';var titleText=document.createElement('span');titleText.className='hv-home-grid-card-title-text';titleText.textContent=title;titleEl.appendChild(titleText);card.appendChild(titleEl);
  return card;
}
function loadSection(section){
  if(section.dataset.hvHomeLoaded==='1'||section.dataset.hvHomeLoading==='1')return;
  section.dataset.hvHomeLoading='1';
  var cards=section.querySelector('.hv-home-grid-cards'),config=section._hvHomeConfig;
  if(!cards||!config){section.hidden=true;return;}
  categoryEntries(config).then(function(entries){
    var fragment=document.createDocumentFragment(),count=0;
    (entries||[]).forEach(function(entry){var card=renderCard(entry);if(card&&count<12){fragment.appendChild(card);count++;}});
    if(!count){section.hidden=true;return;}
    cards.replaceChildren(fragment);cards.setAttribute('aria-busy','false');
    section.dataset.hvHomeLoaded='1';
  }).catch(function(){section.hidden=true;}).finally(function(){section.dataset.hvHomeLoading='0';});
}
var configurations=readConfigurations();
if(!configurations.length){root.hidden=true;return;}
var fragment=document.createDocumentFragment();
configurations.forEach(function(config){fragment.appendChild(createSection(config));});
root.replaceChildren(fragment);
var sections=Array.prototype.slice.call(root.querySelectorAll('.hv-home-grid-section'));
/* Kategori kartlarının bağlantıları kaydırma/tıklama beklemeden oluşturulur.
   Görsellerin kendi loading=lazy davranışı korunur. */
sections.forEach(function(section){loadSection(section);});
})(window,document);
//
  };

  /* Orijinal Blogger tema konumu: satir 31731 | hvjs-003 */
  parts["hvjs-003"] = function () {
(adsbygoogle = window.adsbygoogle || []).push({});
  };

  /* Orijinal Blogger tema konumu: satir 32093 | hvjs-004 */
  parts["hvjs-004"] = function () {
//
(function(){
  var script=document.currentScript;
  var el=script&&script.previousElementSibling;
  if(!el||!el.matches||!el.matches('time.post-date'))return;
  var raw=el.getAttribute('datetime')||el.getAttribute('data-date')||'';
  var d=new Date(raw);
  if(isNaN(d.getTime()))return;
  try{
    var parts=new Intl.DateTimeFormat('tr-TR',{timeZone:'Europe/Istanbul',day:'2-digit',month:'2-digit',year:'numeric'}).formatToParts(d);
    var values={};
    parts.forEach(function(part){values[part.type]=part.value;});
    var dateText=(values.day||'')+'.'+(values.month||'')+'.'+(values.year||'');
    var timeText=new Intl.DateTimeFormat('en-GB',{timeZone:'Europe/Istanbul',hour:'2-digit',minute:'2-digit',hourCycle:'h23'}).format(d);
    if(dateText&&timeText)el.textContent=dateText+' - '+timeText;
  }catch(e){}
})();
//
  };

  /* Orijinal Blogger tema konumu: satir 32114 | hvjs-005 */
  parts["hvjs-005"] = function () {
//
(function(){
  var script=document.currentScript;
  var el=script&&script.previousElementSibling;
  if(!el||!el.matches||!el.matches('time.post-date'))return;
  var raw=el.getAttribute('datetime')||el.getAttribute('data-date')||'';
  var d=new Date(raw);
  if(isNaN(d.getTime()))return;
  try{
    var parts=new Intl.DateTimeFormat('tr-TR',{timeZone:'Europe/Istanbul',day:'2-digit',month:'2-digit',year:'numeric'}).formatToParts(d);
    var values={};
    parts.forEach(function(part){values[part.type]=part.value;});
    var dateText=(values.day||'')+'.'+(values.month||'')+'.'+(values.year||'');
    var timeText=new Intl.DateTimeFormat('en-GB',{timeZone:'Europe/Istanbul',hour:'2-digit',minute:'2-digit',hourCycle:'h23'}).format(d);
    if(dateText&&timeText)el.textContent=dateText+' - '+timeText;
  }catch(e){}
})();
//
  };

  /* Orijinal Blogger tema konumu: satir 32409 | hvjs-006 */
  parts["hvjs-006"] = function () {

//
(function () {
  'use strict';
  var anchor = document.getElementById('hv-masthead-ad-anchor');
  var node = document.getElementById('hv-masthead-ad-wrap');
  if (anchor && node && anchor.parentNode) anchor.parentNode.replaceChild(node, anchor);
})();
//
  };

  /* Orijinal Blogger tema konumu: satir 32442 | hvjs-007 */
  parts["hvjs-007"] = function () {

//
(function () {
'use strict';
if (!document.body || !(document.body.classList.contains('item') || document.body.classList.contains('item-view'))) return;
var targets = [
  ['HVAdUpper', 'hv-static-ad-top'],
  ['HVAdLower', 'hv-static-ad-lower'],
  ['HVAdLowerSecond', 'hv-static-ad-lower-second'],
  ['HVAdEnd', 'hv-static-ad-end'],
  ['HVAdEndSecond', 'hv-static-ad-end-second'],
  ['HVSidebarAdBefore', 'hv-sidebar-ad-before-slot'],
  ['HVSidebarAdAfter', 'hv-sidebar-ad-after-slot']
];
var payloadSelector = 'ins.adsbygoogle,iframe,[data-ad-slot],[data-ad-client],[id^="google_ads"],.adsbygoogle,a[href],img[src]';
var placeholderSelector = '.hv-ad-widget-placeholder,.hv-side-rail-placeholder,.hv-ad-slot-placeholder,.piki-ads[aria-hidden="true"],.piki-ads-res[aria-hidden="true"]';
function hasPayload(root) {
  return !!(root && root.querySelector && (root.matches(payloadSelector) || root.querySelector(payloadSelector)));
}
function removeEmptyPlaceholders(root, preserveWhenEmpty) {
  if (!root || !root.querySelectorAll) return;
  var rootHasPayload = hasPayload(root);
  root.querySelectorAll(placeholderSelector).forEach(function (node) {
    if (rootHasPayload || hasPayload(node)) {
      node.remove();
      return;
    }
    if (preserveWhenEmpty) {
      node.classList.add('hv-ad-visible-placeholder');
      node.removeAttribute('aria-hidden');
      node.setAttribute('data-hv-placeholder-visible', '1');
      node.style.setProperty('display', 'flex', 'important');
      node.style.setProperty('visibility', 'visible', 'important');
      node.style.setProperty('opacity', '1', 'important');
    } else {
      node.remove();
    }
  });
}
function activateWidget(widget) {
  if (!widget) return;
  removeEmptyPlaceholders(widget, true);
  widget.classList.add('hv-ad-managed-widget');
  widget.setAttribute('data-hv-ad-ready', '1');
  widget.style.setProperty('display', 'block', 'important');
  widget.style.setProperty('visibility', 'visible', 'important');
  widget.style.setProperty('opacity', '1', 'important');
  widget.style.setProperty('max-height', 'none', 'important');
  var content = widget.querySelector('.widget-content');
  if (content) {
    content.style.setProperty('display', 'block', 'important');
    content.style.setProperty('visibility', 'visible', 'important');
    content.style.setProperty('opacity', '1', 'important');
    content.style.setProperty('max-height', 'none', 'important');
    content.style.setProperty('overflow', 'visible', 'important');
  }
}
function mountTarget(pair) {
  var source = document.getElementById(pair[0]);
  var target = document.getElementById(pair[1]);
  var widget = source && source.querySelector('.widget');
  if (!target || !widget || widget.getAttribute('data-hv-mounted') === '1') return;
  removeEmptyPlaceholders(target, false);
  activateWidget(widget);
  widget.setAttribute('data-hv-mounted', '1');
  target.classList.remove('hv-ad-empty');
  target.setAttribute('data-hv-ad-ready', '1');
  target.appendChild(widget);
  if (target.parentElement && target.parentElement.classList.contains('hv-static-ad-pair')) {
    target.parentElement.classList.remove('hv-ad-empty');
    target.parentElement.setAttribute('data-hv-ad-ready', '1');
  }
}
function mountInlineAd() {
  var articleBody = document.querySelector('body.item #postBody.post-body, body.item-view #postBody.post-body');
  var inlineSource = document.getElementById('HVAdInline');
  var inlineWidget = inlineSource && inlineSource.querySelector('.widget');
  if (!articleBody || !inlineWidget || inlineWidget.getAttribute('data-hv-mounted') === '1') return;
  var headings = articleBody.querySelectorAll('h2');
  if (headings.length <= 5 || document.getElementById('hv-inline-ad-slot')) return;
  var cursor = headings[3].nextElementSibling;
  var targetParagraph = null;
  while (cursor) {
    if (/^H2$/i.test(cursor.tagName)) break;
    if (/^P$/i.test(cursor.tagName)) { targetParagraph = cursor; break; }
    cursor = cursor.nextElementSibling;
  }
  if (!targetParagraph) return;
  var inlineSlot = document.createElement('div');
  inlineSlot.id = 'hv-inline-ad-slot';
  inlineSlot.className = 'hv-inline-ad-slot';
  targetParagraph.insertAdjacentElement('afterend', inlineSlot);
  activateWidget(inlineWidget);
  inlineWidget.setAttribute('data-hv-mounted', '1');
  inlineSlot.setAttribute('data-hv-ad-ready', '1');
  inlineSlot.appendChild(inlineWidget);
}
function moveAds() {
  targets.forEach(mountTarget);
  mountInlineAd();
}
moveAds();
var bank = document.getElementById('hv-ad-widget-bank');
if (bank && window.MutationObserver) {
  var moveQueued = false;
  var moveObserver = new MutationObserver(function () {
    if (moveQueued) return;
    moveQueued = true;
    window.requestAnimationFrame(function () { moveQueued = false; moveAds(); });
  });
  moveObserver.observe(bank, { childList: true, subtree: true, characterData: true });
}
})();
//
  };

  /* Orijinal Blogger tema konumu: satir 32907 | hvjs-008 */
  parts["hvjs-008"] = function () {

(function () { var year = document.getElementById('creditsyear'); if (year) year.textContent = new Date().getFullYear(); })();
  };

  /* Orijinal Blogger tema konumu: satir 32955 | hvjs-009 */
  parts["hvjs-009"] = function () {

//
(function () {
'use strict';
function logoFallback(img) {
if (!img) return;
var anchor = img.closest('a');
if (anchor) anchor.classList.add('hv-logo-missing');
}
function setupLogos() {
document.querySelectorAll('#Header1 .SuperLogo-img img, #Image150 .footer-logo img').forEach(function (img) {
img.addEventListener('error', function () { logoFallback(img); }, { once: true });
if (img.complete && img.naturalWidth === 0) logoFallback(img);
});
}
function fixCommentControls(root) {
(root || document).querySelectorAll('iframe#comment-editor').forEach(function (frame) {
if (!frame.getAttribute('title')) frame.setAttribute('title', 'Blogger yorum formu');
});
(root || document).querySelectorAll('a#comment-editor-src').forEach(function (link) {
if (!link.getAttribute('aria-label')) link.setAttribute('aria-label', 'Blogger yorum formunu aç');
if (!link.getAttribute('title')) link.setAttribute('title', 'Blogger yorum formunu aç');
link.setAttribute('tabindex', '-1');
});
var replyScope = root || document;
var replyLinks = [];
if (replyScope.matches && replyScope.matches('a.comment-reply')) replyLinks.push(replyScope);
Array.prototype.push.apply(replyLinks, replyScope.querySelectorAll('a.comment-reply'));
replyLinks.forEach(function (link) {
if (!link.hasAttribute('href')) {
link.setAttribute('role', 'button');
link.setAttribute('tabindex', '0');
}
if (!link.getAttribute('aria-label')) link.setAttribute('aria-label', 'Yorumu yanıtla');
});
(root || document).querySelectorAll('a[target="_self"]:not([href])').forEach(function (link) {
if (/daha fazla|yükle/i.test(link.textContent || '')) {
link.setAttribute('href', '#comments');
if (!link.getAttribute('aria-label')) link.setAttribute('aria-label', 'Daha fazla yorum yükle');
}
});
(root || document).querySelectorAll('ol.thread-chrome').forEach(function (list) {
Array.prototype.slice.call(list.children).forEach(function (child) {
if (child.tagName === 'DIV') {
var li = document.createElement('li');
li.className = 'hv-comment-list-control';
list.insertBefore(li, child);
li.appendChild(child);
}
});
});
}
function init() {
setupLogos();
fixCommentControls(document);
var holder = document.getElementById('comment-holder') || document.querySelector('.xoxx0i-post-comments');
if (holder && 'MutationObserver' in window) {
var observer = new MutationObserver(function (records) {
records.forEach(function (record) {
record.addedNodes.forEach(function (node) {
if (node.nodeType === 1) fixCommentControls(node);
});
});
});
observer.observe(holder, { childList: true, subtree: true });
}
}
if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init, { once: true }); else init();
})();
//
  };

  /* Orijinal Blogger tema konumu: satir 33029 | hvjs-010 */
  parts["hvjs-010"] = function () {

//
{
document.addEventListener("DOMContentLoaded", () => {
const style = document.createElement("style");
style.textContent = ".ui-menushift li.sub-tab > ul.sub-menu { list-style: none !important; padding-left: 0 !important; display: none !important; } .ui-menushift li.sub-tab.open > ul.sub-menu { display: block !important; }";
document.head.appendChild(style);
const menuList = document.getElementById("xoxx0i-Menulist");
if (!menuList) return;
menuList.setAttribute('data-nosnippet', 'true');
const items = menuList.querySelectorAll("ul > li");
items.forEach(li => {
const anchor = li.querySelector(":scope > a");
if (!anchor) return;
const text = anchor.textContent.trim();
if (text.startsWith("_")) {
let prev = li.previousElementSibling;
while (prev) {
const prevAnchor = prev.querySelector(":scope > a");
if (prevAnchor && !prevAnchor.textContent.trim().startsWith("_")) {
break;
}
prev = prev.previousElementSibling;
}
if (prev) {
let subMenu = prev.querySelector(":scope > ul");
if (!subMenu) {
prev.classList.add("sub-tab");
subMenu = document.createElement("ul");
subMenu.className = "sub-menu m-sub";
prev.appendChild(subMenu);
}
subMenu.appendChild(li);
}
}
});
menuList.querySelectorAll("a").forEach(a => {
if (a.textContent.includes("_")) {
a.textContent = a.textContent.replace(/_/g, "");
}
});
setTimeout(() => {
document.querySelectorAll(".ui-menushift li.sub-tab").forEach(li => {
const anchor = li.querySelector(":scope > a");
if (!anchor) return;
anchor.addEventListener("click", e => {
const rect = anchor.getBoundingClientRect();
const clickX = e.clientX - rect.left;
if (clickX > rect.width * 0.75) {
e.preventDefault();
e.stopPropagation();
li.classList.toggle("open");
}
});
});
}, 500);
});
}
//
  };

  /* Orijinal Blogger tema konumu: satir 33091 | hvjs-011 */
  parts["hvjs-011"] = function () {

//
(function () {
'use strict';
function initSearch() {
var open = document.querySelector('.search-button-flex');
var close = document.querySelector('.search-flex-close');
var panel = document.getElementById('search-flex');
if (!open || !close || !panel || open.getAttribute('data-hv-search-bound') === '1') return;
open.setAttribute('data-hv-search-bound', '1');
panel.setAttribute('data-nosnippet', 'true');
panel.setAttribute('aria-hidden', 'true');
function hide(returnFocus) {
panel.classList.remove('active');
panel.style.display = 'none';
panel.setAttribute('aria-hidden', 'true');
open.setAttribute('aria-expanded', 'false');
if (returnFocus) open.focus();
}
function show() {
if (panel.classList.contains('active')) { hide(false); return; }
panel.classList.add('active');
panel.style.display = 'block';
panel.setAttribute('aria-hidden', 'false');
open.setAttribute('aria-expanded', 'true');
var input = panel.querySelector('input[type="search"],input.search-input');
if (input) window.setTimeout(function () { input.focus(); }, 0);
}
hide(false);
open.addEventListener('click', function (event) {
event.preventDefault(); event.stopPropagation(); show();
});
close.addEventListener('click', function (event) {
event.preventDefault(); event.stopPropagation(); hide(true);
});
document.addEventListener('keydown', function (event) {
if (event.key === 'Escape' && panel.classList.contains('active')) hide(true);
});
document.addEventListener('click', function (event) {
if (panel.classList.contains('active') && !panel.contains(event.target) && !open.contains(event.target)) hide(false);
});
}
if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', initSearch, { once:true });
else initSearch();
})();
//
  };

  /* Orijinal Blogger tema konumu: satir 33140 | hvjs-012 */
  parts["hvjs-012"] = function () {

//
{
document.addEventListener("DOMContentLoaded", () => {
const menuBtn = document.querySelector('.show-menu-space');
const menuWidget = document.getElementById('xoxx0i-proMenu');
const menuList = document.getElementById('xoxx0i-Menulist');
const mobileContainer = document.querySelector('.ui-menushift');
const body = document.body;
if (menuWidget) menuWidget.setAttribute('data-nosnippet', 'true');
if (menuList) menuList.setAttribute('data-nosnippet', 'true');
if (mobileContainer) mobileContainer.setAttribute('data-nosnippet', 'true');
const applyLayout = () => {
const isMobile = window.innerWidth <= 991;
if (!isMobile) {
if (menuWidget) {
menuWidget.style.setProperty('display', 'block', 'important');
const internalWidget = menuWidget.querySelector('.widget');
if (internalWidget) {
internalWidget.style.setProperty('display', 'block', 'important');
}
}
if (menuList) {
menuList.style.setProperty('display', 'flex', 'important');
}
} else {
if (menuList) {
menuList.style.setProperty('display', 'none', 'important');
}
if (menuWidget) {
menuWidget.style.setProperty('display', 'none', 'important');
}
}
};
applyLayout();
window.addEventListener('resize', applyLayout);
if (menuList && mobileContainer && mobileContainer.innerHTML.trim() === "") {
const listCopy = menuList.cloneNode(true);
listCopy.style.setProperty('display', 'block', 'important');
mobileContainer.appendChild(listCopy);
}
if (menuBtn) {
menuBtn.addEventListener('click', (e) => {
e.preventDefault();
body.classList.toggle('spring-open');
});
}
const closeBtn = document.querySelector('.hide-ui-menushift');
if (closeBtn) {
closeBtn.addEventListener('click', () => {
body.classList.remove('spring-open');
});
}
const proEvo = document.querySelector('.pro-evo');
if (proEvo) {
proEvo.setAttribute('data-nosnippet', 'true');
const headerHeight = proEvo.offsetHeight;
let lastScroll = 0;
window.addEventListener('scroll', () => {
const currentScroll = window.pageYOffset;
if (currentScroll > headerHeight) {
proEvo.classList.add('fixed-nos');
} else {
proEvo.classList.remove('fixed-nos');
proEvo.classList.remove('show');
}
if (currentScroll > headerHeight && currentScroll < lastScroll) {
proEvo.classList.add('show');
} else if (currentScroll > lastScroll) {
proEvo.classList.remove('show');
}
lastScroll = currentScroll;
});
}
});
}
//
  };

  /* Orijinal Blogger tema konumu: satir 33220 | hvjs-013 */
  parts["hvjs-013"] = function () {

//
{
document.addEventListener("DOMContentLoaded", () => {
const backButton = document.querySelector('.backTop');
if (backButton) {
backButton.setAttribute('data-nosnippet', 'true');
window.addEventListener('scroll', () => {
if (window.scrollY > 200) {
backButton.classList.add('visible');
backButton.style.display = 'block';
} else {
backButton.classList.remove('visible');
backButton.style.display = 'none';
}
});
backButton.addEventListener('click', (e) => {
e.preventDefault();
window.scrollTo({
top: 0,
behavior: 'smooth'
});
});
}
});
}
//
  };

  /* Orijinal Blogger tema konumu: satir 33251 | hvjs-014 */
  parts["hvjs-014"] = function () {

//
{
document.addEventListener("DOMContentLoaded", () => {
const nextLink = document.querySelector('.next-post-link');
const prevLink = document.querySelector('.prev-post-link');
if (nextLink) nextLink.setAttribute('data-nosnippet', 'true');
if (prevLink) prevLink.setAttribute('data-nosnippet', 'true');
if (nextLink && nextLink.href) {
fetch(nextLink.href)
.then(r => r.text())
.then(html => {
const doc = new DOMParser().parseFromString(html, 'text/html');
const titleEl = doc.querySelector('.post-title, h1.entry-title, h1');
if (titleEl) {
const p = nextLink.querySelector('p');
if (p) p.textContent = titleEl.textContent;
}
});
}
if (prevLink && prevLink.href) {
fetch(prevLink.href)
.then(r => r.text())
.then(html => {
const doc = new DOMParser().parseFromString(html, 'text/html');
const titleEl = doc.querySelector('.post-title, h1.entry-title, h1');
if (titleEl) {
const p = prevLink.querySelector('p');
if (p) p.textContent = titleEl.textContent;
}
});
}
});
}
//
  };

  /* Orijinal Blogger tema konumu: satir 33291 | hvjs-015 */
  parts["hvjs-015"] = function () {

//
(function () {
'use strict';
function normalizeUrl(url) {
try { var u = new URL(url, window.location.origin); return (u.origin + u.pathname).replace(/\/$/, ''); }
catch (e) { return String(url || '').split(/[?#]/)[0].replace(/\/$/, ''); }
}
function entryUrl(entry) {
var links = entry.link || [];
var alt = links.find(function (item) { return item.rel === 'alternate'; });
return alt ? alt.href : '';
}
function text(entry) { return entry.title && entry.title.$t ? entry.title.$t : 'Haberi oku'; }
function responsiveImageUrl(url, width) {
var source = String(url || '').trim();
if (!source || !/blogger\.googleusercontent\.com\/img\/|bp\.blogspot\.com/i.test(source)) return source;
var w = Math.max(320, Math.min(1200, Number(width) || 480));
var h = Math.round(w * 9 / 16);
return source.replace(/\/(?:s\d+(?:-[a-z0-9]+)*|w\d+(?:-[a-z0-9]+)*)(?=\/)/i, '/w' + w + '-c-h' + h);
}
function thumbnail(entry) {
function fromHtml(html) {
if (!html) return '';
try {
var doc = new DOMParser().parseFromString(String(html), 'text/html');
var img = doc.querySelector('img[src],img[data-src],img[srcset]');
if (!img) return '';
var srcset = img.getAttribute('srcset') || '';
if (srcset) {
var candidates = srcset.split(',').map(function (part) {
var pair = part.trim().split(/\s+/);
return { url: pair[0], width: pair[1] && /w$/.test(pair[1]) ? parseInt(pair[1], 10) || 0 : 0 };
}).filter(function (item) { return /^https?:|^\//i.test(item.url); });
candidates.sort(function (a, b) { return b.width - a.width; });
if (candidates.length) return responsiveImageUrl(candidates[0].url, 480);
}
var src = img.getAttribute('src') || img.getAttribute('data-src') || '';
if (src) return responsiveImageUrl(src, 480);
} catch (e) { return ''; }
return '';
}
var full = fromHtml(entry && entry.content && entry.content.$t);
if (full) return full;
var summary = fromHtml(entry && entry.summary && entry.summary.$t);
if (summary) return summary;
return responsiveImageUrl(entry && entry['media$thumbnail'] && entry['media$thumbnail'].url || '', 480);
}
function makeCard(entry) {
var card = document.createElement('article'); card.className = 'relatedui-posts';
var box = document.createElement('div'); box.className = 'relatedui-posts-box';
var url = entryUrl(entry); var title = text(entry); var imgUrl = thumbnail(entry);
if (imgUrl) {
var thumb = document.createElement('div'); thumb.className = 'relatedui-posts-thumb';
var imageLink = document.createElement('a'); imageLink.className = 'post-filter-link'; imageLink.href = url; imageLink.target = '_blank'; imageLink.rel = 'noopener noreferrer'; imageLink.setAttribute('aria-label', title);
var img = document.createElement('img'); img.src = responsiveImageUrl(imgUrl, 480); img.alt = title; img.title = title; img.width = 640; img.height = 360; img.loading = 'lazy'; img.decoding = 'async'; img.sizes = '(max-width:767px) 46vw, (max-width:1200px) 25vw, 300px'; img.srcset = [320,480,640,800,960,1200].map(function(w){return responsiveImageUrl(imgUrl,w)+' '+w+'w';}).join(', '); img.setAttribute('data-nosnippet', 'true');
img.onerror = function () { if (thumb.parentNode) thumb.parentNode.removeChild(thumb); };
imageLink.appendChild(img); thumb.appendChild(imageLink); box.appendChild(thumb);
}
var heading = document.createElement('h3'); heading.className = 'entry-title';
var titleLink = document.createElement('a'); titleLink.href = url; titleLink.target = '_blank'; titleLink.rel = 'noopener noreferrer'; titleLink.textContent = title;
heading.appendChild(titleLink); box.appendChild(heading); card.appendChild(box); return card;
}
function showRelated(data) {
var container = document.querySelector('.xoxx0i-relatedui');
if (!container) return;
var titleArea = document.querySelector('.related-evo .widget-title h3.title');
if (titleArea) titleArea.textContent = 'BENZER HABERLER';
var entries = Array.isArray(data) ? data : (data && data.feed && data.feed.entry) || [];
var here = normalizeUrl((document.querySelector('link[rel="canonical"]') || {}).href || window.location.href);
var used = Object.create(null); var selected = [];
entries.forEach(function (entry) {
var url = entryUrl(entry); var key = normalizeUrl(url);
if (!url || !key || key === here || used[key]) return;
used[key] = true; selected.push(entry);
});
var wrap = document.createElement('div'); wrap.className = 'related-ui'; wrap.setAttribute('data-nosnippet', 'true');
selected.slice(0, 4).forEach(function (entry) { wrap.appendChild(makeCard(entry)); });
var oldMore = container.querySelector('.related-more'); if (oldMore) oldMore.remove();
var oldWrap = container.querySelector('.related-ui'); if (oldWrap) oldWrap.remove();
container.appendChild(wrap);
if (!selected.length) {
var empty = document.createElement('p'); empty.className = 'related-empty'; empty.textContent = 'Şu anda gösterilecek benzer haber bulunamadı.'; wrap.appendChild(empty);
}
return selected.length;
}
window.showRelated = showRelated;
function init() {
var tagElement = document.querySelector('.related-tag');
if (!tagElement || typeof window.HVGetLabelFeed !== 'function') return;
var label = tagElement.getAttribute('label') || '';
if (label === 'recent') label = '';
function recentFallback() {
window.HVGetLabelFeed('', 12).then(showRelated).catch(function () { showRelated([]); });
}
window.HVGetLabelFeed(label, 12).then(function (data) {
var count = showRelated(data);
if (!count && label) recentFallback();
}).catch(function () {
if (label) recentFallback(); else showRelated([]);
});
}
if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init, { once: true }); else init();
})();
//
  };

  /* Orijinal Blogger tema konumu: satir 33401 | hvjs-016 */
  parts["hvjs-016"] = function () {

//
{
document.addEventListener("DOMContentLoaded", () => {
const authorDesc = document.querySelector('.author-description span');
const linkList = document.querySelector('ul.description-links');
if (authorDesc && linkList) {
linkList.setAttribute('data-nosnippet', 'true');
const links = authorDesc.querySelectorAll('a');
links.forEach(link => {
const url = link.href;
const originalText = link.innerText.toLowerCase().trim();
let brand = originalText;
if (brand === 'x') brand = 'x-twitter';
if (brand === 'bluesky') brand = 'bluesky';
const label = originalText.charAt(0).toUpperCase() + originalText.slice(1);
const li = document.createElement('li');
li.innerHTML = `<a href="${url}" target="_blank" rel="nofollow noopener" aria-label="${label}'da takip et">
<i class="fa-brands fa-${brand}" aria-hidden="true"></i>
</a>`;
linkList.appendChild(li);
link.style.display = 'none';
});
linkList.classList.add('show');
linkList.style.display = 'block';
}
});
}
//
  };

  /* Orijinal Blogger tema konumu: satir 33435 | hvjs-017 */
  parts["hvjs-017"] = function () {

//
{
document.addEventListener("DOMContentLoaded", () => {
const showBtn = document.getElementById('show-comment-form');
const commentBox = document.querySelector('.xoxx0i-post-comments');
if (showBtn && commentBox) {
commentBox.setAttribute('data-nosnippet', 'true');
commentBox.style.setProperty('display', 'block', 'important');
showBtn.addEventListener('click', (e) => {
e.preventDefault();
commentBox.classList.toggle('comment-section-visible');
commentBox.scrollIntoView({ behavior: 'smooth', block: 'start' });
});
}
});
}
//
  };

  /* Orijinal Blogger tema konumu: satir 33458 | hvjs-018 */
  parts["hvjs-018"] = function () {
//
{
document.addEventListener('DOMContentLoaded', function() {
document.querySelectorAll('.bayrak-container').forEach(container => {
const img = container.querySelector('.bayrak');
if (!img) return;
const scaleBayrak = () => {
const cHeight = container.clientHeight;
const cWidth = container.clientWidth;
const scaleY = cHeight / img.clientHeight;
img.style.transform = `scaleY(${scaleY})`;
img.style.marginTop = '0'; 
};
img.addEventListener('load', scaleBayrak);
window.addEventListener('resize', scaleBayrak);
if (img.complete) scaleBayrak();
});
});
}
//
  };

  /* Orijinal Blogger tema konumu: satir 33482 | hvjs-019 */
  parts["hvjs-019"] = function () {

//
{
const escapeHTML = (str) => {
return str.replace(/[&<>"']/g, (char) => ({
      '&': '&amp;',
      '<': '&lt;',
      '>': '&gt;',
      '"': '&quot;',
      "'": '&#39;'
    })[char]);
  };
  function insertLabelBox() {
    const getLabelFromURL = () => {
      const path = window.location.pathname;
      if (path.includes('/search/label/')) {
        let label = path.split('/search/label/')[1];
        if (label) {
          // Normal durum: /search/label/_D%C3%BCnya
          return decodeURIComponent(label).replace(/\+/g, ' ');
        }
        // _Dünya gibi etiketler URL hash'ine düşmüşse
        const hash = window.location.hash;
        if (hash) {
          // hash = "_Dünya" -> etiket adı = "_Dünya"
          return '_' + decodeURIComponent(hash.substring(1)).replace(/\+/g, ' ');
        }
      }
      return '';
    };
    const rawLabel = getLabelFromURL();
    const cleanLabel = escapeHTML(rawLabel);
    if (cleanLabel !== '') {
      const labelHtml = `
<div class='label-info-box' data-nosnippet='true'>
<p>
<strong>${cleanLabel}</strong> kategorisi ile ilgili en güncel haberleri, analizleri ve özel içerikleri
<a href="https:
<strong>Haberlerver.com</strong>
</a>
kalitesiyle bu sayfada bulabilirsiniz.
</p>
</div>`;
      const target = document.querySelector('.blog-posts') ||
                     document.querySelector('.main-inner') ||
                     document.querySelector('#main-wrapper');
      if (target) {
        target.insertAdjacentHTML('beforebegin', labelHtml);
      }
    }
  }
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', insertLabelBox);
  } else {
    insertLabelBox();
  }
}
//
  };

  /* Orijinal Blogger tema konumu: satir 33545 | hvjs-020 */
  parts["hvjs-020"] = function () {

//
(function(){
  function bicim(s){
    var m=/^(\d{4})-(\d{2})-(\d{2})T(\d{2}):(\d{2}):(\d{2})/.exec(String(s||'').trim());
    return m ? m[3]+'.'+m[2]+'.'+m[1]+' '+m[4]+':'+m[5]+':'+m[6] : null;
  }
  function calistir(){
    var T=document.querySelectorAll('time.post-date');
    for(var i=0;i<T.length;i++){
      var el=T[i];
      /* Author/yayın/güncelleme kutularının tarihini yalnızca tek formatter yönetir. */
      if(el.closest && el.closest('.author-row-clean')) continue;
      var raw=el.getAttribute('datetime')||el.getAttribute('data-date')||el.textContent||'';
      var y=bicim(raw);
      if(y&&el.textContent.trim()!==y) el.textContent=y;
    }
  }
  if(document.readyState==='loading') document.addEventListener('DOMContentLoaded',calistir,{once:true});
  else calistir();
})();
//
  };

  /* Orijinal Blogger tema konumu: satir 33571 | hvjs-021 */
  parts["hvjs-021"] = function () {

//
{
const init = () => {
const blockList = ["cookiechoices.js", "cookieChoices"];
blockList.forEach(name => {
Object.defineProperty(window, name, {
configurable: false,
enumerable: true,
get() { return undefined; },
set() { return; }
});
});
const observer = new MutationObserver(mutations => {
mutations.forEach(mutation => {
mutation.addedNodes.forEach(node => {
if (node.tagName === 'SCRIPT') {
if (node.src && blockList.some(k => node.src.includes(k))) {
node.remove();
console.warn('Engellendi:', node.src);
}
}
});
});
});
observer.observe(document.head, { childList: true });
observer.observe(document.body, { childList: true });
document.querySelectorAll('script[src*="cookiechoices"]').forEach(s => s.remove());
delete window.cookieChoices;
};
if (document.readyState === 'loading') {
document.addEventListener('DOMContentLoaded', init);
} else {
init();
}
}
//
  };

  /* Orijinal Blogger tema konumu: satir 33613 | hvjs-022 */
  parts["hvjs-022"] = function () {

//
(function () {
'use strict';
function yorumIframeIsaretle() {
var frames = document.querySelectorAll('iframe#comment-editor');
frames.forEach(function (frame) {
frame.setAttribute('data-nosnippet', 'true');
});
}
if (document.readyState === 'loading') {
document.addEventListener('DOMContentLoaded', yorumIframeIsaretle, { once: true });
} else {
yorumIframeIsaretle();
}
})();
//
  };

  /* Orijinal Blogger tema konumu: satir 33635 | hvjs-023 */
  parts["hvjs-023"] = function () {

//
if (!window.__aiPaylasimBariBaslatildi) {
window.__aiPaylasimBariBaslatildi = true;
const GORSEL_SINIFLARI = [
'ai-gorsel',
'gercek-gorsel',
'fotograf',
'bayrak',
'siteye-ait-gorsel',
'ajans-lisansli-gorsel',
'stok-lisansli-gorsel',
'cc0-gorsel',
'cc-by-gorsel',
'cc-by-sa-gorsel',
'cc-by-nd-gorsel',
'cc-by-nc-gorsel',
'cc-by-nc-sa-gorsel',
'cc-by-nc-nd-gorsel',
'public-domain-gorsel',
'public-domain-mark-gorsel',
'kamu-acik-lisans-gorsel',
'izinli-gorsel',
'arsiv-izinli-gorsel',
'editorial-kullanim-gorsel',
'kurum-izinli-gorsel',
'web-kaynakli-gorsel'
];
const VIDEO_SINIFLARI = [
'video',
'ai-video',
'gercek-video',
'karma-video',
'cekim-video',
'ajans-video',
'kamu-video',
'kurum-video',
'stok-video',
'web-kaynakli-video',
'canli-video',
'roportaj-video',
'arsiv-video',
'sosyal-medya-video',
'guvenlik-kamerasi-video',
'okuyucu-video',
'basin-toplantisi-video',
'etkinlik-video',
'ekran-kaydi-video',
'animasyon-video',
'drone-video',
'saha-video',
'muhabir-video',
'studyo-video',
'telefon-video',
'amator-video',
'tanik-video',
'bodycam-video',
'dashcam-video',
'trafik-kamerasi-video',
'hava-goruntusu-video',
'uydu-goruntusu-video',
'zaman-atlamali-video',
'yavas-cekim-video',
'canlandirma-video',
'infografik-video',
'grafik-video',
'dosya-video',
'ozel-haber-video',
'panel-video',
'aciklama-video',
'analiz-video',
'yorum-video',
'podcast-video',
'sokak-roportaji-video',
'telefon-roportaji-video'
];
document.addEventListener('DOMContentLoaded', async () => {
const canonicalURL = document.querySelector("link[rel='canonical']")
? document.querySelector("link[rel='canonical']").href
: window.location.protocol + "//" + window.location.hostname + window.location.pathname;
const pageTitle = document.title;
const eskiTakipHedefi = document.getElementById('follow-all-here');
if (eskiTakipHedefi) {
eskiTakipHedefi.innerHTML = '';
eskiTakipHedefi.style.display = 'none';
}
const customCSS = `
      /* ---- PAYLAŞ + TAKİP BARI (v22) ---- */
      .news-header .hv-share-overlay-host {
        position: relative !important;
        box-sizing: border-box !important;
      }
      .news-header .share-here-wrapper {
        position: absolute !important;
        left: var(--hv-share-left, 0px) !important;
        top: var(--hv-share-top, 0px) !important;
        width: var(--hv-share-width, 340px) !important;
        height: var(--hv-share-height, 240px) !important;
        margin: 0 !important;
        padding: 0 !important;
        box-sizing: border-box !important;
        z-index: 250 !important;
        float: none !important;
        pointer-events: none !important;
        font-family: inherit !important;
        line-height: 1.2 !important;
        text-align: left !important;
      }
      /* Görselin alt kenarında hafif karartma: düğmeler her zeminde okunur kalır. */
      .news-header .share-here-wrapper::before {
        content: "" !important;
        position: absolute !important;
        left: 0 !important;
        right: 0 !important;
        bottom: 0 !important;
        height: 110px !important;
        background: linear-gradient(to top, rgba(0,0,0,.36), rgba(0,0,0,0)) !important;
        pointer-events: none !important;
      }
      .news-header .hv-sh-bar {
        position: absolute !important;
        left: 12px !important;
        right: 12px !important;
        bottom: 12px !important;
        display: flex !important;
        align-items: flex-end !important;
        justify-content: space-between !important;
        gap: 8px !important;
        margin: 0 !important;
        padding: 0 !important;
        box-sizing: border-box !important;
        pointer-events: none !important;
        animation: hvShIn .4s cubic-bezier(.2,.7,.2,1) .1s both;
      }
      @keyframes hvShIn {
        from { opacity: 0; transform: translateY(8px); }
        to { opacity: 1; transform: none; }
      }
      .news-header .hv-sh-grp {
        position: relative !important;
        display: inline-flex !important;
        margin: 0 !important;
        padding: 0 !important;
        pointer-events: none !important;
      }
      .news-header .hv-sh-btn {
        display: inline-flex !important;
        align-items: center !important;
        gap: 7px !important;
        height: 38px !important;
        margin: 0 !important;
        padding: 0 15px 0 12px !important;
        border: 1px solid rgba(255,255,255,.22) !important;
        border-radius: 999px !important;
        background: rgba(14,14,16,.6) !important;
        -webkit-backdrop-filter: blur(10px) saturate(140%);
        backdrop-filter: blur(10px) saturate(140%);
        color: #fff !important;
        font-family: inherit !important;
        font-size: 13px !important;
        font-weight: 600 !important;
        line-height: 1 !important;
        letter-spacing: .1px !important;
        white-space: nowrap !important;
        box-shadow: 0 6px 18px rgba(0,0,0,.28) !important;
        cursor: pointer !important;
        pointer-events: auto !important;
        -webkit-tap-highlight-color: transparent;
        transition: background-color .2s ease, color .2s ease, border-color .2s ease, transform .2s ease !important;
      }
      .news-header .hv-sh-btn:hover {
        background: rgba(14,14,16,.78) !important;
        transform: translateY(-1px) !important;
      }
      .news-header .hv-sh-btn:active {
        transform: scale(.96) !important;
      }
      .news-header .hv-sh-btn[aria-expanded="true"] {
        background: #fff !important;
        border-color: #fff !important;
        color: #111 !important;
      }
      .news-header .hv-sh-btn svg {
        display: block !important;
        flex: 0 0 17px !important;
        width: 17px !important;
        height: 17px !important;
      }
      .news-header .hv-sh-btn:focus-visible {
        outline: 2px solid #fff !important;
        outline-offset: 3px !important;
      }
      .news-header .hv-sh-pop {
        position: absolute !important;
        bottom: calc(100% + 12px) !important;
        left: 0 !important;
        width: min(308px, calc(var(--hv-share-width, 340px) - 24px)) !important;
        max-height: min(280px, 62vh) !important;
        overflow-y: auto !important;
        box-sizing: border-box !important;
        margin: 0 !important;
        padding: 12px !important;
        border: 1px solid rgba(255,255,255,.1) !important;
        border-radius: 18px !important;
        background: #0f0f11 !important;
        box-shadow: 0 18px 40px rgba(0,0,0,.45) !important;
        color: #fff !important;
        text-align: left !important;
        opacity: 0 !important;
        visibility: hidden !important;
        transform: translateY(8px) scale(.98) !important;
        transform-origin: 0 100% !important;
        pointer-events: none !important;
        transition: opacity .18s ease, transform .18s ease, visibility 0s linear .18s !important;
        scrollbar-width: thin;
        scrollbar-color: rgba(255,255,255,.25) transparent;
      }
      .news-header .hv-sh-grp--paylas .hv-sh-pop {
        left: auto !important;
        right: 0 !important;
        transform-origin: 100% 100% !important;
      }
      .news-header .hv-sh-pop.is-open {
        opacity: 1 !important;
        visibility: visible !important;
        transform: none !important;
        pointer-events: auto !important;
        transition: opacity .18s ease, transform .18s ease, visibility 0s !important;
      }
      .news-header .hv-sh-pop.hv-pop-down {
        top: calc(100% + 12px) !important;
        bottom: auto !important;
        transform-origin: 0 0 !important;
      }
      .news-header .hv-sh-grp--paylas .hv-sh-pop.hv-pop-down {
        transform-origin: 100% 0 !important;
      }
      .news-header .hv-in-slider .hv-sh-pop {
        max-height: calc(var(--hv-share-height, 240px) - 80px) !important;
      }
      .news-header .hv-sh-pop-baslik {
        margin: 0 2px 10px !important;
        padding: 0 !important;
        font-family: inherit !important;
        font-size: 12.5px !important;
        font-weight: 600 !important;
        line-height: 1.3 !important;
        color: rgba(255,255,255,.8) !important;
        text-align: left !important;
      }
      .news-header .hv-sh-grid {
        display: flex !important;
        flex-wrap: wrap !important;
        justify-content: center !important;
        gap: 8px !important;
        margin: 0 !important;
        padding: 0 !important;
      }
      .news-header .hv-sh-tile {
        display: inline-flex !important;
        position: relative !important;
        align-items: center !important;
        justify-content: center !important;
        box-sizing: border-box !important;
        flex: 0 0 48px !important;
        width: 48px !important;
        height: 48px !important;
        margin: 0 !important;
        padding: 0 !important;
        border: 0 !important;
        border-radius: 14px !important;
        background: rgba(255,255,255,.07) !important;
        color: var(--c, #fff) !important;
        font-family: inherit !important;
        text-decoration: none !important;
        cursor: pointer !important;
        -webkit-tap-highlight-color: transparent;
        transition: background-color .18s ease, transform .18s ease !important;
      }
      .news-header .hv-sh-tile:hover {
        background: rgba(255,255,255,.16) !important;
        transform: translateY(-2px) !important;
      }
      .news-header .hv-sh-tile:focus-visible {
        outline: 2px solid #fff !important;
        outline-offset: 2px !important;
      }
      .news-header .hv-sh-tile svg {
        display: block !important;
        position: absolute !important;
        top: 0 !important;
        right: 0 !important;
        bottom: 0 !important;
        left: 0 !important;
        margin: auto !important;
        width: 26px !important;
        height: 26px !important;
        overflow: visible !important;
        fill: currentColor !important;
      }
      .news-header .hv-sh-tile.hv-wa { --c: #25D366; }
      .news-header .hv-sh-tile.hv-fb { --c: #1877F2; }
      .news-header .hv-sh-tile.hv-x { --c: #FFFFFF; }
      .news-header .hv-sh-tile.hv-tg { --c: #2AABEE; }
      .news-header .hv-sh-tile.hv-li { --c: #0A66C2; }
      .news-header .hv-sh-tile.hv-rd { --c: #FF4500; }
      .news-header .hv-sh-tile.hv-bs { --c: #0285FF; }
      .news-header .hv-sh-tile.hv-mail { --c: #EA4335; }
      .news-header .hv-sh-tile.hv-copy { --c: #FFFFFF; }
      .news-header .hv-sh-tile.hv-ig { --c: #E1306C; }
      .news-header .hv-sh-tile.hv-yt { --c: #FF0000; }
      .news-header .hv-sh-tile.hv-sp { --c: #1DB954; }
      .news-header .hv-sh-tile.hv-tt { --c: #FFFFFF; }
      .news-header .hv-sh-tile.hv-th { --c: #FFFFFF; }
      .news-header .hv-sh-tile.hv-pin { --c: #E60023; }
      .news-header .hv-sh-tile.hv-tm { --c: #A8B6C7; }
      .news-header .hv-sh-tile.hv-sc { --c: #FFFC00; }
      .news-header .hv-sh-toast {
        position: absolute !important;
        left: 50% !important;
        bottom: 64px !important;
        margin: 0 !important;
        padding: 9px 14px !important;
        border-radius: 999px !important;
        background: #fff !important;
        color: #111 !important;
        font-family: inherit !important;
        font-size: 12.5px !important;
        font-weight: 600 !important;
        line-height: 1.2 !important;
        white-space: nowrap !important;
        box-shadow: 0 10px 26px rgba(0,0,0,.3) !important;
        opacity: 0 !important;
        transform: translate(-50%, 6px) !important;
        pointer-events: none !important;
        transition: opacity .2s ease, transform .2s ease !important;
      }
      .news-header .hv-sh-toast.is-on {
        opacity: 1 !important;
        transform: translate(-50%, 0) !important;
      }
      @media (max-width: 600px) {
        .news-header .hv-sh-bar {
          left: 10px !important;
          right: 10px !important;
          bottom: 10px !important;
        }
        .news-header .hv-sh-btn {
          height: 36px !important;
          padding: 0 13px 0 11px !important;
          font-size: 12.5px !important;
        }
        .news-header .hv-sh-pop {
          width: min(300px, calc(var(--hv-share-width, 340px) - 20px)) !important;
        }
        .news-header .hv-sh-toast {
          bottom: 60px !important;
        }
      }
      @media (prefers-reduced-motion: reduce) {
        .news-header .hv-sh-bar { animation: none !important; }
        .news-header .hv-sh-btn,
        .news-header .hv-sh-pop,
        .news-header .hv-sh-tile,
        .news-header .hv-sh-toast { transition: none !important; }
      }
      @media print {
        .news-header .share-here-wrapper { display: none !important; }
      }
      /* Caption kuralları bağımsız tutulur. */
      .post-body figure figcaption, figure figcaption {
        display: block !important;
        width: 100% !important;
        max-width: 100% !important;
        margin: 10px auto 0 auto !important;
        padding: 5px 0 !important;
        text-align: center !important;
        font-size: 12px !important;
        color: #666 !important;
        font-style: italic !important;
        line-height: 1.5 !important;
        box-sizing: border-box !important;
      }
      /* ---- GOOGLE TAKİP ROZETİ: haber görselinin hemen üstünde (solda G, ortada metin, sağda + düğmesi) ---- */
      .news-header .hv-gtk-banner {
        display: flex !important;
        align-items: center !important;
        justify-content: space-between !important;
        gap: 16px !important;
        box-sizing: border-box !important;
        float: none !important;
        width: 100% !important;
        max-width: 100% !important;
        margin: 0 0 10px !important;
        padding: 13px 14px 13px 16px !important;
        border: 0 !important;
        border-radius: 14px !important;
        background: linear-gradient(100deg, #433238 0%, #3d3a33 34%, #3e4032 50%, #2c3d37 68%, #2b3a42 84%, #2d384e 100%) !important;
        box-shadow: 0 4px 14px rgba(0,0,0,.18), inset 0 0 0 1px rgba(255,255,255,.06) !important;
        color: #fff !important;
        font-family: inherit !important;
        line-height: 1.25 !important;
        text-align: left !important;
      }
      .news-header .hv-gtk-banner {
        -webkit-appearance: none !important;
        appearance: none !important;
        cursor: pointer !important;
        font-size: 16px !important;
        transition: box-shadow .2s ease, transform .2s ease !important;
      }
      .news-header .hv-gtk-banner:hover {
        box-shadow: 0 8px 22px rgba(0,0,0,.28), inset 0 0 0 1px rgba(255,255,255,.12) !important;
        transform: translateY(-1px) !important;
      }
      .news-header .hv-gtk-banner:active {
        transform: scale(.99) !important;
      }
      @media (prefers-reduced-motion: reduce) {
        .news-header .hv-gtk-banner { transition: none !important; }
      }
      .news-header .hv-gtk-g {
        display: flex !important;
        flex: 0 0 44px !important;
        align-items: center !important;
        justify-content: center !important;
        width: 44px !important;
        height: 44px !important;
        margin: 0 !important;
        padding: 0 !important;
      }
      .news-header .hv-gtk-g svg {
        display: block !important;
        width: 44px !important;
        height: 44px !important;
      }
      .news-header .hv-gtk-metin {
        display: flex !important;
        flex: 1 1 auto !important;
        flex-direction: column !important;
        gap: 4px !important;
        min-width: 0 !important;
        margin: 0 !important;
        padding: 0 !important;
      }
      .news-header .hv-gtk-baslik,
      .news-header .hv-gtk-alt {
        display: block !important;
        margin: 0 !important;
        padding: 0 !important;
        background: none !important;
        border: 0 !important;
        text-align: left !important;
      }
      .news-header .hv-gtk-baslik {
        font-size: 16px !important;
        font-weight: 600 !important;
        line-height: 1.25 !important;
        color: #fff !important;
        text-wrap: balance;
      }
      .news-header .hv-gtk-alt {
        font-size: 13px !important;
        font-weight: 400 !important;
        line-height: 1.3 !important;
        color: #b4b2b3 !important;
      }
      .news-header .hv-gtk-arti {
        display: flex !important;
        flex: 0 0 40px !important;
        align-items: center !important;
        justify-content: center !important;
        width: 40px !important;
        height: 40px !important;
        min-width: 40px !important;
        margin: 0 !important;
        padding: 0 !important;
        border: 0 !important;
        border-radius: 50% !important;
        background: #fff !important;
        color: #111 !important;
        box-shadow: 0 1px 4px rgba(0,0,0,.25) !important;
        cursor: pointer !important;
        transition: transform .15s ease !important;
        -webkit-tap-highlight-color: transparent;
      }
      .news-header .hv-gtk-banner:hover .hv-gtk-arti {
        transform: scale(1.06) !important;
      }
      .news-header .hv-gtk-arti svg {
        display: block !important;
        width: 18px !important;
        height: 18px !important;
      }
      .news-header .hv-gtk-banner:focus-visible {
        outline: 2px solid #fff !important;
        outline-offset: 3px !important;
      }
      @media (max-width: 600px) {
        .news-header .hv-gtk-banner {
          gap: 12px !important;
          padding: 11px 12px !important;
          border-radius: 12px !important;
        }
        .news-header .hv-gtk-g,
        .news-header .hv-gtk-g svg {
          width: 34px !important;
          height: 34px !important;
          flex: 0 0 34px !important;
        }
        .news-header .hv-gtk-baslik { font-size: 14px !important; }
        .news-header .hv-gtk-alt { font-size: 12px !important; }
        .news-header .hv-gtk-arti {
          width: 36px !important;
          height: 36px !important;
          min-width: 36px !important;
          flex: 0 0 36px !important;
        }
        .news-header .hv-gtk-arti svg {
          width: 16px !important;
          height: 16px !important;
        }
      }
      @media (prefers-reduced-motion: reduce) {
        .news-header .hv-gtk-arti { transition: none !important; }
      }
      @media print {
        .news-header .hv-gtk-banner { display: none !important; }
      }
    `;
const styleSheet = document.createElement("style");
styleSheet.textContent = customCSS;
document.head.appendChild(styleSheet);
let preferredSource = null;
let preferredSourceLoadPromise = null;
const loadPreferredSource = () => {
if (!preferredSourceLoadPromise) {
preferredSourceLoadPromise = import("https://news.google.com/swg/js/v1/publisher.mjs")
.then((module) => {
preferredSource = module.preferredSource;
preferredSource.init({ theme: 'light', lang: 'tr' });
return preferredSource;
})
.catch((e) => {
console.warn('Preferred Sources yüklenemedi:', e);
preferredSourceLoadPromise = null;
throw e;
});
}
return preferredSourceLoadPromise;
};
const whatsappLink = "https://api.whatsapp.com/send?text=" + encodeURIComponent(pageTitle + " - " + canonicalURL);
const twitterLink = "https://twitter.com/intent/tweet?url=" + encodeURIComponent(canonicalURL) + "&text=" + encodeURIComponent(pageTitle);
const facebookLink = "https://www.facebook.com/sharer/sharer.php?u=" + encodeURIComponent(canonicalURL);
const telegramLink = "https://t.me/share/url?url=" + encodeURIComponent(canonicalURL) + "&text=" + encodeURIComponent(pageTitle);
const linkedinLink = "https://www.linkedin.com/shareArticle?mini=true&url=" + encodeURIComponent(canonicalURL) + "&title=" + encodeURIComponent(pageTitle);
const redditLink = "https://reddit.com/submit?url=" + encodeURIComponent(canonicalURL) + "&title=" + encodeURIComponent(pageTitle);
const blueskyLink = "https://bsky.app/intent/compose?text=" + encodeURIComponent(pageTitle + " " + canonicalURL);
const mailLink = "mailto:?subject=" + encodeURIComponent(pageTitle) + "&body=" + encodeURIComponent(canonicalURL);
const followLinks = {
ig: "https://www.instagram.com/haberlerver",
yt: "https://www.youtube.com/@haberlerver",
wa: "https://www.whatsapp.com/channel/0029Vb6VrpiIt5rwOdpwBP1Y",
x: "https://x.com/haberlerver",
fb: "https://www.facebook.com/haberlerver",
li: "https://www.linkedin.com/company/haberlerver",
tg: "https://t.me/haberlervercomtr",
sp: "https://open.spotify.com/user/haberlerver",
tt: "https://www.tiktok.com/@haberlerver",
th: "https://threads.net/@haberlerver",
bs: "https://bsky.app/profile/haberlerver.bsky.social",
pin: "https://tr.pinterest.com/haberlerver",
rd: "https://www.reddit.com/user/haberlervermedya",
tm: "https://www.tumblr.com/haberlervercom",
sc: "https://snapchat.com/"
};
const GOOGLE_G_SVG =
'<svg viewBox="0 0 48 48" xmlns="http://www.w3.org/2000/svg" aria-hidden="true" focusable="false">' +
'<path fill="#FFC107" d="M43.611,20.083H42V20H24v8h11.303c-1.649,4.657-6.08,8-11.303,8c-6.627,0-12-5.373-12-12c0-6.627,5.373-12,12-12c3.059,0,5.842,1.154,7.961,3.039l5.657-5.657C34.046,6.053,29.268,4,24,4C12.955,4,4,12.955,4,24c0,11.045,8.955,20,20,20c11.045,0,20-8.955,20-20C44,22.659,43.862,21.35,43.611,20.083z"></path>' +
'<path fill="#FF3D00" d="M6.306,14.691l6.571,4.819C14.655,15.108,18.961,12,24,12c3.059,0,5.842,1.154,7.961,3.039l5.657-5.657C34.046,6.053,29.268,4,24,4C16.318,4,9.656,8.337,6.306,14.691z"></path>' +
'<path fill="#4CAF50" d="M24,44c5.166,0,9.86-1.977,13.409-5.192l-6.19-5.238C29.211,35.091,26.715,36,24,36c-5.202,0-9.619-3.317-11.283-7.946l-6.522,5.025C9.505,39.556,16.227,44,24,44z"></path>' +
'<path fill="#1976D2" d="M43.611,20.083H42V20H24v8h11.303c-.792,2.237-2.231,4.166-4.087,5.571c0.001-0.001,0.002-0.002,0.003-0.002l6.19,5.238C36.971,39.205,44,34,44,24C44,22.659,43.862,21.35,43.611,20.083z"></path>' +
'</svg>';
const ARTI_SVG =
'<svg viewBox="0 0 24 24" aria-hidden="true" focusable="false">' +
'<path d="M12 4.5v15M4.5 12h15" fill="none" stroke="currentColor" stroke-width="2.6" stroke-linecap="round"></path>' +
'</svg>';
const TAKIP_IKONU =
'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true" focusable="false">' +
'<path d="M16 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path>' +
'<circle cx="8.5" cy="7" r="4"></circle>' +
'<path d="M20 8v6M23 11h-6"></path>' +
'</svg>';
const PAYLAS_IKONU =
'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true" focusable="false">' +
'<circle cx="18" cy="5" r="3"></circle>' +
'<circle cx="6" cy="12" r="3"></circle>' +
'<circle cx="18" cy="19" r="3"></circle>' +
'<line x1="8.59" y1="13.51" x2="15.42" y2="17.49"></line>' +
'<line x1="15.41" y1="6.51" x2="8.59" y2="10.49"></line>' +
'</svg>';
const UC_NOKTA_IKONU =
'<svg viewBox="0 0 24 24" width="26" height="26" style="position:absolute;top:0;right:0;bottom:0;left:0;margin:auto;display:block;width:26px;height:26px;fill:currentColor" aria-hidden="true" focusable="false">' +
'<circle cx="5" cy="12" r="2.2"></circle>' +
'<circle cx="12" cy="12" r="2.2"></circle>' +
'<circle cx="19" cy="12" r="2.2"></circle>' +
'</svg>';
const IKONLAR = {
ig: '<svg viewBox="0 0 448 448" width="26" height="26" style="position:absolute;top:0;right:0;bottom:0;left:0;margin:auto;display:block;width:26px;height:26px;fill:currentColor" aria-hidden="true" focusable="false"><path fill="currentColor" d="M224 109Q175 110 143 143Q110 175 109 224Q110 273 143 305Q175 338 224 339Q273 338 305 305Q338 273 339 224Q338 175 305 143Q273 110 224 109ZM224 299Q192 298 171 277Q150 256 149 224Q150 192 171 171Q192 150 224 149Q256 150 277 171Q298 192 299 224Q298 256 277 277Q256 298 224 299ZM371 104Q368 129 344 131Q319 129 317 104Q317 93 325 85Q332 78 344 78Q355 78 363 85Q370 93 371 104ZM447 132Q447 77 410 38Q371 1 317 1Q297 0 260 0Q224 0 188 0Q151 0 132 1Q78 1 38 38Q1 77 2 131Q0 151 0 188Q0 224 0 260Q0 296 2 316Q1 371 38 410Q77 447 132 446Q151 447 188 448Q224 448 260 448Q297 447 317 446Q371 447 410 410Q447 371 447 316Q448 296 448 260Q448 224 448 188Q448 151 447 131ZM399 356Q386 386 356 399Q336 406 302 407Q268 408 240 408Q231 408 224 408Q217 408 208 408Q180 408 146 407Q113 406 92 399Q62 386 49 356Q42 335 41 302Q40 268 40 240Q40 231 40 224Q40 217 40 208Q40 180 41 146Q42 112 49 92Q62 62 92 49Q113 42 146 41Q180 39 208 40Q217 40 224 40Q231 40 240 40Q268 40 302 41Q336 42 356 49Q386 62 399 92Q406 112 407 146Q409 180 408 208Q408 217 408 224Q408 231 408 240Q409 268 407 302Q406 336 399 356Z"></path></svg>',
yt: '<svg viewBox="0 0 546 384" width="26" height="26" style="position:absolute;top:0;right:0;bottom:0;left:0;margin:auto;display:block;width:26px;height:26px;fill:currentColor" aria-hidden="true" focusable="false"><path fill="currentColor" d="M535 60Q523 23 486 11Q462 6 412 3Q362 1 319 0Q276 0 273 0Q270 0 227 0Q184 1 134 3Q84 6 60 11Q23 23 11 60Q6 83 3 113Q1 144 0 168Q0 191 0 192Q0 194 0 217Q1 241 3 271Q6 302 11 325Q23 362 60 373Q84 378 134 381Q184 383 227 384Q270 384 273 384Q273 384 273 384Q276 384 319 384Q362 383 412 381Q462 378 486 373Q523 362 535 325Q540 302 543 271Q545 241 546 217Q546 194 546 192Q546 191 546 168Q545 144 543 113Q540 83 535 60ZM217 274V111V274V111L360 192L217 274Z"></path></svg>',
wa: '<svg viewBox="0 0 448 448" width="26" height="26" style="position:absolute;top:0;right:0;bottom:0;left:0;margin:auto;display:block;width:26px;height:26px;fill:currentColor" aria-hidden="true" focusable="false"><path fill="currentColor" d="M381 65Q315 1 224 0Q162 1 112 30Q62 60 32 110Q3 160 2 222Q2 282 31 333L0 448L118 417Q167 444 224 444Q286 443 336 414Q387 384 417 334Q447 284 448 222Q448 177 430 137Q413 97 381 65ZM224 407Q173 406 130 381L123 377L53 395L72 327L68 320Q40 275 39 222Q41 144 94 92Q146 39 224 38Q300 38 354 92Q409 146 411 222Q408 300 355 353Q302 405 224 407ZM325 269Q320 266 306 259Q292 253 287 251Q280 246 275 253Q271 258 266 265Q260 272 257 275Q253 281 245 276Q221 265 203 251Q185 237 170 210Q166 204 173 198Q178 194 186 180Q188 175 185 170Q184 169 181 160Q178 152 174 142Q170 134 168 129Q162 117 157 120Q156 120 156 120Q151 120 145 120Q139 119 130 126Q130 127 129 128Q124 132 118 143Q112 154 111 173Q112 193 121 210Q130 226 133 230Q133 230 134 230Q134 231 135 232Q140 241 165 268Q189 295 228 314Q254 325 268 328Q283 330 295 328Q304 326 316 319Q328 312 332 302Q339 280 336 275Q334 272 328 270Q326 269 325 269Z"></path></svg>',
x: '<svg viewBox="0 0 460 416" width="26" height="26" style="position:absolute;top:0;right:0;bottom:0;left:0;margin:auto;display:block;width:26px;height:26px;fill:currentColor" aria-hidden="true" focusable="false"><path fill="currentColor" d="M362 0H433H362H433L279 176L460 416H318L207 271L80 416H9L174 228L0 0H145L246 133L362 0ZM337 374H377H337H377L124 40H82L337 374Z"></path></svg>',
fb: '<svg viewBox="0 0 292 512" width="26" height="26" style="position:absolute;top:0;right:0;bottom:0;left:0;margin:auto;display:block;width:26px;height:26px;fill:currentColor" aria-hidden="true" focusable="false"><path fill="currentColor" d="M66 299V512V299V512H182V299H269L287 201H182V167Q182 129 199 112Q216 95 255 95Q280 95 292 97V8Q280 5 259 2Q238 0 222 0Q64 -2 66 159V202H0V299H66Z"></path></svg>',
li: '<svg viewBox="0 0 448 448" width="26" height="26" style="position:absolute;top:0;right:0;bottom:0;left:0;margin:auto;display:block;width:26px;height:26px;fill:currentColor" aria-hidden="true" focusable="false"><path fill="currentColor" d="M416 0H32H416H32Q18 0 9 9Q0 19 0 32V416Q0 429 9 439Q18 448 32 448H416Q430 448 439 439Q448 429 448 416V32Q448 19 439 9Q430 0 416 0ZM135 384H69H135H69V170H136V384ZM102 141Q86 141 75 130Q64 119 64 103Q64 86 75 75Q86 64 102 64Q119 64 129 75Q140 86 141 103Q140 119 129 130Q119 141 102 141ZM384 384H318H384H318V280Q319 260 313 242Q308 225 283 223Q258 224 250 240Q243 256 244 278V384H177V170H241V199H242Q248 186 264 176Q280 165 305 165Q354 166 370 194Q386 223 384 267V384Z"></path></svg>',
tg: '<svg viewBox="0 0 496 496" width="26" height="26" style="position:absolute;top:0;right:0;bottom:0;left:0;margin:auto;display:block;width:26px;height:26px;fill:currentColor" aria-hidden="true" focusable="false"><path fill="currentColor" d="M248 0Q179 1 123 34Q67 67 34 123Q1 179 0 248Q1 317 34 373Q67 429 123 462Q179 495 248 496Q317 495 373 462Q429 429 462 373Q495 317 496 248Q495 179 462 123Q429 67 373 34Q317 1 248 0ZM363 169Q361 189 356 223Q351 256 345 290Q339 324 335 347Q329 373 318 372Q302 372 287 360Q283 357 279 354Q262 343 250 334Q238 326 223 317Q208 306 211 299Q213 291 223 283Q226 280 229 277Q230 275 240 267Q256 252 275 233Q295 215 297 210Q298 209 296 206Q293 204 291 205Q287 206 186 275Q171 285 159 284Q152 284 141 281Q130 279 121 275Q118 274 115 274Q94 269 94 259Q95 252 112 245Q221 198 257 183Q307 162 325 156Q344 149 349 149Q354 149 359 152Q362 155 363 159Q363 164 363 169Z"></path></svg>',
sp: '<svg viewBox="0 0 496 496" width="26" height="26" style="position:absolute;top:0;right:0;bottom:0;left:0;margin:auto;display:block;width:26px;height:26px;fill:currentColor" aria-hidden="true" focusable="false"><path fill="currentColor" d="M248 0Q179 1 123 34Q67 67 34 123Q1 179 0 248Q1 317 34 373Q67 429 123 462Q179 495 248 496Q317 495 373 462Q429 429 462 373Q495 317 496 248Q495 179 462 123Q429 67 373 34Q317 1 248 0ZM349 365Q343 365 338 361Q291 334 238 329Q185 325 131 337Q130 337 129 338Q123 339 119 339Q104 338 104 324Q105 309 117 307Q179 293 240 297Q300 302 354 333Q364 337 364 350Q362 364 349 365ZM376 299Q369 299 365 296Q364 295 363 295Q315 267 252 258Q188 249 125 266Q123 266 121 267Q117 268 113 268Q95 267 93 249Q93 233 109 228Q129 222 153 218Q176 215 207 215Q307 215 384 260Q395 267 395 280Q393 298 376 299ZM407 223Q400 223 394 219Q337 187 257 180Q178 172 113 190Q112 190 111 190Q106 192 100 192Q78 190 77 169Q79 148 94 145Q147 129 212 129Q267 129 321 141Q374 153 417 177Q429 183 430 200Q427 222 407 223Z"></path></svg>',
tt: '<svg viewBox="0 0 447.9 512" width="26" height="26" style="position:absolute;top:0;right:0;bottom:0;left:0;margin:auto;display:block;width:26px;height:26px;fill:currentColor" aria-hidden="true" focusable="false"><path fill="currentColor" d="M447.9 210Q379.9 210 324.9 171V349Q324.9 401 295.9 442Q267.9 483 219.9 502Q170.9 519 122.9 507Q74.9 495 39.9 456Q6.9 417 0.9 367Q-4.1 318 19.9 272Q44.9 227 88.9 204Q133.9 182 184.9 188V278Q160.9 271 138.9 279Q116.9 286 101.9 306Q87.9 326 87.9 350Q87.9 373 101.9 394Q116.9 413 139.9 420Q161.9 428 185.9 420Q208.9 412 222.9 393Q236.9 374 236.9 349V0H324.9Q324.9 11 326.9 22Q337.9 73 380.9 102Q411.9 122 447.9 123Z"></path></svg>',
th: '<svg viewBox="0 0 414 480" width="26" height="26" style="position:absolute;top:0;right:0;bottom:0;left:0;margin:auto;display:block;width:26px;height:26px;fill:currentColor" aria-hidden="true" focusable="false"><path fill="currentColor" d="M316 220Q317 220 319 221Q320 222 322 223Q366 244 384 284Q396 312 392 351Q388 390 353 427Q302 480 211 480H210Q105 479 50 410Q1 348 0 240Q1 132 50 70Q105 1 210 0H211Q317 1 373 70Q401 104 414 152L373 162Q363 124 341 97Q297 43 211 42Q125 43 82 97Q43 147 42 240Q43 333 82 383Q125 437 211 438Q285 438 324 397Q348 372 351 346Q354 320 346 301Q336 279 314 266Q308 306 289 331Q263 364 216 366Q180 368 152 350Q121 328 118 291Q117 254 142 231Q168 208 213 204Q245 203 273 207Q269 185 258 172Q243 154 212 154H211Q198 154 183 159Q169 165 158 181L123 157Q153 113 211 112H212Q308 115 316 220H315ZM160 289Q161 307 177 316Q194 325 214 324Q234 324 252 310Q269 296 274 251Q254 246 230 246Q223 246 216 247Q184 249 171 261Q158 274 160 288Z"></path></svg>',
bs: '<svg viewBox="0 0 576 512.2" width="26" height="26" style="position:absolute;top:0;right:0;bottom:0;left:0;margin:auto;display:block;width:26px;height:26px;fill:currentColor" aria-hidden="true" focusable="false"><path fill="currentColor" d="M408 294.8Q407 294.8 407 294.8Q402 293.8 398 292.8Q401 293.8 403 293.8Q405 293.8 408 294.8ZM288 226.8Q267 185.8 221 129.8Q176 72.8 125 34.8Q78 2.8 55 0.8Q33 -2.2 22 5.8Q8 12.8 4 28.8Q0 44.8 0 57.8Q0 68.8 3 101.8Q5 134.8 8 167.8Q12 201.8 15 213.8Q31 262.8 75 281.8Q118 299.8 168 294.8Q171 293.8 174 293.8Q176 293.8 178 292.8Q173 293.8 168 294.8Q120 300.8 85 317.8Q50 334.8 48 368.8Q47 403.8 100 464.8Q160 522.8 197 509.8Q234 496.8 256 449.8Q277 403.8 288 361.8Q288 361.8 288 360.8Q291 369.8 294 380.8Q304 421.8 322 461.8Q341 500.8 376 508.8Q412 516.8 474 464.8Q523 412.8 523 377.8Q522 341.8 489 321.8Q456 300.8 408 294.8Q407 294.8 407 293.8Q402 293.8 398 292.8Q401 293.8 403 293.8Q405 293.8 408 294.8Q458 299.8 501 281.8Q545 262.8 561 213.8Q564 201.8 568 167.8Q571 134.8 573 101.8Q576 68.8 576 57.8Q576 44.8 572 28.8Q568 12.8 554 5.8Q544 -1.2 521 0.8Q498 2.8 451 34.8Q400 72.8 355 129.8Q309 185.8 288 226.8Z"></path></svg>',
pin: '<svg viewBox="0 0 496 496" width="26" height="26" style="position:absolute;top:0;right:0;bottom:0;left:0;margin:auto;display:block;width:26px;height:26px;fill:currentColor" aria-hidden="true" focusable="false"><path fill="currentColor" d="M496 248Q495 317 462 373Q429 429 373 462Q317 495 248 496Q210 496 175 485Q183 472 192 454Q201 437 205 420Q208 409 214 387Q220 365 221 361Q221 361 221 361Q227 373 243 381Q258 389 278 389Q335 388 370 344Q405 301 406 235Q405 172 362 133Q319 93 253 92Q173 94 131 138Q90 181 90 242Q90 271 103 298Q116 326 140 338Q147 341 148 335Q149 331 152 320Q154 312 155 307Q156 303 153 300Q146 290 140 275Q135 259 135 243Q135 200 165 169Q194 137 247 135Q293 136 322 164Q350 191 351 236Q350 287 328 318Q306 349 273 350Q254 349 243 337Q232 324 236 305Q240 289 245 273Q255 244 256 223Q257 191 225 188Q206 188 193 205Q181 221 180 248Q181 265 184 274Q187 284 188 285Q188 285 188 285Q187 286 181 312Q175 338 168 367Q161 396 159 408Q155 424 155 444Q156 464 158 479Q87 451 44 389Q1 328 0 248Q1 179 34 123Q67 67 123 34Q179 1 248 0Q317 1 373 34Q429 67 462 123Q495 179 496 248Z"></path></svg>',
rd: '<svg viewBox="0 0 512 512" width="26" height="26" style="position:absolute;top:0;right:0;bottom:0;left:0;margin:auto;display:block;width:26px;height:26px;fill:currentColor" aria-hidden="true" focusable="false"><path fill="currentColor" d="M0 256Q1 184 35 127Q69 69 127 35Q184 1 256 0Q328 1 385 35Q443 69 477 127Q511 184 512 256Q511 328 477 385Q443 443 385 477Q328 511 256 512H37Q27 511 23 503Q19 494 26 486L75 437Q40 402 20 356Q0 309 0 256ZM350 154Q368 153 380 141Q392 129 392 111Q392 93 380 81Q368 69 350 68Q334 69 322 78Q311 87 308 102Q281 106 264 125Q247 143 246 171Q189 174 147 200Q132 188 111 187Q86 188 69 205Q52 222 51 247Q53 285 86 301Q89 355 137 390Q185 425 256 427Q328 425 376 390Q424 355 427 301Q459 285 461 247Q460 222 443 205Q426 188 401 187Q380 188 365 200Q322 174 265 171Q265 151 277 137Q289 124 308 121Q312 135 323 144Q334 153 350 153ZM177 247Q190 247 198 258Q206 270 206 286Q202 317 175 316Q162 316 153 309Q145 301 145 285Q146 269 155 258Q164 247 177 247ZM367 285Q368 301 359 309Q350 316 337 316Q310 317 307 286Q306 269 314 258Q322 247 335 247Q348 247 357 258Q366 268 367 285ZM319 342Q311 361 294 372Q278 383 256 384Q234 383 218 372Q201 361 193 342Q192 337 197 335Q225 333 256 333Q287 333 315 335Q320 337 319 342Z"></path></svg>',
tm: '<svg viewBox="0 0 304 512" width="26" height="26" style="position:absolute;top:0;right:0;bottom:0;left:0;margin:auto;display:block;width:26px;height:26px;fill:currentColor" aria-hidden="true" focusable="false"><path fill="currentColor" d="M302 480Q291 492 266 502Q240 511 204 512Q145 511 113 487Q81 463 69 431Q57 398 57 371V227H10Q1 227 0 217V149Q0 138 11 133Q57 116 76 82Q94 49 96 16Q97 0 112 0H183Q192 1 193 10V125H276Q285 126 286 135V217Q285 226 276 227H192V360Q192 386 209 397Q227 408 260 396Q267 393 273 394Q278 395 280 401L302 466Q306 474 302 480Z"></path></svg>',
sc: '<svg viewBox="0 0 485.5 478" width="26" height="26" style="position:absolute;top:0;right:0;bottom:0;left:0;margin:auto;display:block;width:26px;height:26px;fill:currentColor" aria-hidden="true" focusable="false"><path fill="currentColor" d="M483.7 350Q477.7 337 466.7 331Q464.7 330 462.7 330Q461.7 329 459.7 328Q457.7 327 455.7 326Q421.7 308 403.7 281Q397.7 273 393.7 265Q392.7 260 393.7 258Q394.7 256 396.7 255Q402.7 251 407.7 248Q414.7 244 418.7 241Q432.7 231 438.7 220Q447.7 202 440.7 184Q429.7 159 400.7 158Q394.7 158 388.7 159Q387.7 159 385.7 160Q385.7 143 384.7 125Q381.7 95 372.7 77Q363.7 58 351.7 46Q337.7 30 318.7 19Q284.7 0 242.7 0Q200.7 0 166.7 19Q147.7 30 133.7 46Q121.7 59 112.7 77Q103.7 95 100.7 125Q99.7 143 99.7 160Q97.7 160 96.7 159Q90.7 158 84.7 158Q55.7 159 44.7 184Q37.7 202 46.7 220Q52.7 231 66.7 241Q69.7 243 74.7 246Q76.7 247 77.7 248Q81.7 251 87.7 255Q89.7 256 91.7 258Q92.7 260 90.7 265Q87.7 273 81.7 281Q63.7 307 30.7 325Q27.7 327 25.7 328Q9.7 334 1.7 350Q-4.3 366 10.7 382Q15.7 388 22.7 392Q36.7 400 52.7 404Q56.7 405 58.7 407Q61.7 409 62.7 413Q63.7 416 66.7 421Q70.7 427 75.7 430Q90.7 439 108.7 438Q125.7 438 145.7 444Q154.7 447 164.7 454Q176.7 462 195.7 470Q214.7 477 242.7 478Q270.7 477 289.7 470Q308.7 462 320.7 454Q320.7 454 320.7 454Q330.7 447 339.7 444Q359.7 438 375.7 438Q376.7 438 376.7 438Q394.7 439 409.7 431Q415.7 426 419.7 419Q421.7 416 422.7 413Q423.7 409 426.7 407Q428.7 405 431.7 404Q447.7 400 462.7 392Q469.7 388 475.7 382V381Q489.7 366 483.7 350ZM449.7 368Q432.7 376 420.7 379Q411.7 381 404.7 385Q397.7 390 397.7 398Q397.7 405 393.7 408Q388.7 411 374.7 411Q357.7 410 330.7 418Q318.7 423 306.7 430Q294.7 438 280.7 444Q265.7 450 242.7 451Q220.7 450 205.7 444Q190.7 438 179.7 430Q167.7 423 154.7 418Q127.7 410 110.7 411Q96.7 411 91.7 408Q87.7 405 87.7 398Q87.7 390 80.7 385Q73.7 381 64.7 379Q52.7 376 35.7 368Q26.7 362 28.7 359Q30.7 356 34.7 354Q89.7 324 106.7 294Q123.7 263 121.7 257Q122.7 257 122.7 257Q124.7 250 117.7 243Q109.7 236 92.7 226Q85.7 221 81.7 219Q65.7 208 69.7 194Q74.7 185 84.7 185Q87.7 185 90.7 186Q101.7 189 110.7 192Q116.7 195 121.7 196Q122.7 196 123.7 196Q128.7 197 128.7 191Q128.7 189 127.7 187Q125.7 164 127.7 128Q129.7 104 136.7 89Q143.7 75 153.7 64Q158.7 57 179.7 43Q201.7 29 242.7 27Q283.7 29 305.7 43Q326.7 57 331.7 64Q341.7 74 348.7 89Q355.7 103 357.7 128Q358.7 145 358.7 162Q357.7 178 356.7 189Q356.7 190 356.7 190Q356.7 197 361.7 196Q362.7 196 363.7 196Q368.7 195 374.7 192Q383.7 188 394.7 186Q397.7 185 400.7 185Q410.7 185 415.7 194Q419.7 208 403.7 219Q399.7 221 392.7 225Q375.7 236 367.7 243Q360.7 250 362.7 257Q362.7 257 363.7 257Q361.7 262 378.7 293Q395.7 324 450.7 354Q454.7 355 456.7 359Q458.7 362 449.7 368Z"></path></svg>',
mail: '<svg viewBox="0 0 512 384" width="26" height="26" style="position:absolute;top:0;right:0;bottom:0;left:0;margin:auto;display:block;width:26px;height:26px;fill:currentColor" aria-hidden="true" focusable="false"><path fill="currentColor" d="M48 0Q28 1 14 14Q1 28 0 48Q1 72 19 86L237 250Q256 262 275 250L493 86Q511 72 512 48Q511 28 498 14Q484 1 464 0H48ZM0 112V320V112V320Q1 347 19 365Q37 383 64 384H448Q475 383 493 365Q511 347 512 320V112L294 275Q277 288 256 288Q235 288 218 275L0 112Z"></path></svg>',
copy: '<svg viewBox="0 0 448 512" width="26" height="26" style="position:absolute;top:0;right:0;bottom:0;left:0;margin:auto;display:block;width:26px;height:26px;fill:currentColor" aria-hidden="true" focusable="false"><path fill="currentColor" d="M208 0H332H208H332Q352 0 366 14L434 82Q448 96 448 116V336Q447 356 434 370Q420 383 400 384H208Q188 383 174 370Q161 356 160 336V48Q161 28 174 14Q188 1 208 0ZM48 128H128H48H128V192H64V448H256V416H320V464Q319 484 306 498Q292 511 272 512H48Q28 511 14 498Q1 484 0 464V176Q1 156 14 142Q28 129 48 128Z"></path></svg>'
};
const PAYLAS_KANALLARI = [
{ c: 'wa', b: 'WhatsApp’ta paylaş', a: 'WhatsApp’ta paylaş', u: whatsappLink },
{ c: 'fb', b: 'Facebook’ta paylaş', a: 'Facebook’ta paylaş', u: facebookLink },
{ c: 'x', b: 'X’te paylaş', a: 'X’te paylaş', u: twitterLink },
{ c: 'tg', b: 'Telegram’da paylaş', a: 'Telegram’da paylaş', u: telegramLink },
{ c: 'li', b: 'LinkedIn’de paylaş', a: 'LinkedIn’de paylaş', u: linkedinLink },
{ c: 'rd', b: 'Reddit’te paylaş', a: 'Reddit’te paylaş', u: redditLink },
{ c: 'bs', b: 'Bluesky’da paylaş', a: 'Bluesky’da paylaş', u: blueskyLink },
{ c: 'mail', b: 'E-posta ile paylaş', a: 'E-posta ile paylaş', u: mailLink }
];
const TAKIP_KANALLARI = [
{ c: 'ig', b: 'Instagram', a: 'Instagram hesabını takip et', u: followLinks.ig },
{ c: 'yt', b: 'YouTube', a: 'YouTube hesabını takip et', u: followLinks.yt },
{ c: 'wa', b: 'WhatsApp kanalı', a: 'WhatsApp kanalını takip et', u: followLinks.wa },
{ c: 'x', b: 'X', a: 'X hesabını takip et', u: followLinks.x },
{ c: 'fb', b: 'Facebook', a: 'Facebook hesabını takip et', u: followLinks.fb },
{ c: 'li', b: 'LinkedIn', a: 'LinkedIn hesabını takip et', u: followLinks.li },
{ c: 'tg', b: 'Telegram kanalı', a: 'Telegram kanalını takip et', u: followLinks.tg },
{ c: 'sp', b: 'Spotify', a: 'Spotify hesabını takip et', u: followLinks.sp },
{ c: 'tt', b: 'TikTok', a: 'TikTok hesabını takip et', u: followLinks.tt },
{ c: 'th', b: 'Threads', a: 'Threads hesabını takip et', u: followLinks.th },
{ c: 'bs', b: 'Bluesky', a: 'Bluesky hesabını takip et', u: followLinks.bs },
{ c: 'pin', b: 'Pinterest', a: 'Pinterest hesabını takip et', u: followLinks.pin },
{ c: 'rd', b: 'Reddit', a: 'Reddit hesabını takip et', u: followLinks.rd },
{ c: 'tm', b: 'Tumblr', a: 'Tumblr hesabını takip et', u: followLinks.tm },
{ c: 'sc', b: 'Snapchat', a: 'Snapchat hesabını takip et', u: followLinks.sc }
];
function kanalHTML(k) {
const eposta = k.c === 'mail';
return '<a class="hv-sh-tile hv-' + k.c + '" href="' + k.u + '" style="position:relative;display:block;width:48px;height:48px;margin:0;padding:0"' +
(eposta ? '' : ' target="_blank" rel="noopener noreferrer nofollow"') +
' title="' + k.b + '" aria-label="' + k.a + '">' +
(IKONLAR[k.c] || '') +
'</a>';
}
function popIcerigiDoldur(pop, ad) {
const takip = ad === 'takip';
let html = '<div class="hv-sh-pop-baslik">' +
(takip ? 'Haberlerver’i takip et' : 'Bu haberi paylaş') +
'</div><div class="hv-sh-grid">';
if (takip) {
html += TAKIP_KANALLARI.map(kanalHTML).join('');
} else {
html += PAYLAS_KANALLARI.map(kanalHTML).join('');
if (navigator.share) {
html += '<button type="button" class="hv-sh-tile hv-more" data-hv-act="native" style="position:relative;display:block;width:48px;height:48px;margin:0;padding:0" title="Diğer uygulamalar" aria-label="Diğer uygulamalarla paylaş">' +
UC_NOKTA_IKONU +
'</button>';
}
html += '<button type="button" class="hv-sh-tile hv-copy" data-hv-act="copy" style="position:relative;display:block;width:48px;height:48px;margin:0;padding:0" title="Bağlantıyı kopyala" aria-label="Bağlantıyı kopyala">' +
IKONLAR.copy +
'</button>';
}
pop.innerHTML = html + '</div>';
pop.dataset.hvHazir = '1';
}
const paylasimSablonHTML =
'<div class="share-here-wrapper hv-sh" data-nosnippet="true">' +
'<div class="hv-sh-bar">' +
'<div class="hv-sh-grp hv-sh-grp--takip">' +
'<button type="button" class="hv-sh-btn" data-hv-panel="takip" aria-expanded="false">' +
TAKIP_IKONU +
'<span>Takip</span>' +
'</button>' +
'<div class="hv-sh-pop" data-hv-pop="takip" role="group" aria-label="Takip seçenekleri"></div>' +
'</div>' +
'<div class="hv-sh-grp hv-sh-grp--paylas">' +
'<div class="hv-sh-pop" data-hv-pop="paylas" role="group" aria-label="Paylaşım seçenekleri"></div>' +
'<button type="button" class="hv-sh-btn" data-hv-panel="paylas" aria-expanded="false">' +
PAYLAS_IKONU +
'<span>Paylaş</span>' +
'</button>' +
'</div>' +
'</div>' +
'</div>';
const paylasimSablonu = document.createElement('template');
paylasimSablonu.innerHTML = paylasimSablonHTML.trim();
function yeniPaylasimBariOlustur() {
return paylasimSablonu.content.firstElementChild.cloneNode(true);
}
const MAKALE_SECICI = '#postBody, .post-body, .entry-content, .post-content, article, .post, .hentry';
function anaKapakGorseliniBul(kapak) {
const imgler = Array.from(kapak.querySelectorAll('img')).filter((img) =>
GORSEL_SINIFLARI.some((sinif) => img.classList.contains(sinif)) &&
img.closest('.news-header') === kapak
);
return imgler.find((img) => img.classList.contains('ai-gorsel')) || imgler[0] || null;
}
function konumSunucusuBul(kapak, img) {
const slider = kapak.querySelector('.ai-video-slider');
if (slider && slider.contains(img)) return slider;
return img.closest('figure') || img.parentElement || kapak;
}
function paylasimKonumunuAyarla(bar, kapak, img, anchor) {
if (!bar || !kapak || !img || !anchor) return;
if (bar._hvShareResizeObserver) {
bar._hvShareResizeObserver.disconnect();
bar._hvShareResizeObserver = null;
}
if (bar._hvShareMutationObserver) {
bar._hvShareMutationObserver.disconnect();
bar._hvShareMutationObserver = null;
}
if (bar._hvShareResizeHandler) {
window.removeEventListener('resize', bar._hvShareResizeHandler);
bar._hvShareResizeHandler = null;
}
if (bar._hvShareAnchor && bar._hvShareAnchor !== anchor) {
bar._hvShareAnchor.classList.remove('hv-share-overlay-host');
}
bar._hvShareImage = img;
bar._hvShareAnchor = anchor;
bar.classList.toggle('hv-in-slider', anchor.classList.contains('ai-video-slider'));
anchor.classList.add('hv-share-overlay-host');
const konumGuncelle = () => {
if (!bar.isConnected || !kapak.isConnected || !img.isConnected || !anchor.isConnected) return;
const imageRect = img.getBoundingClientRect();
const anchorRect = anchor.getBoundingClientRect();
if (imageRect.width < 1 || imageRect.height < 1) return;
const left = imageRect.left - anchorRect.left - anchor.clientLeft + anchor.scrollLeft;
const top = imageRect.top - anchorRect.top - anchor.clientTop + anchor.scrollTop;
bar.style.setProperty('--hv-share-left', Math.max(0, left) + 'px');
bar.style.setProperty('--hv-share-top', Math.max(0, top) + 'px');
bar.style.setProperty('--hv-share-width', imageRect.width + 'px');
bar.style.setProperty('--hv-share-height', imageRect.height + 'px');
};
bar._hvSharePositionUpdate = konumGuncelle;
konumGuncelle();
if ('ResizeObserver' in window) {
bar._hvShareResizeObserver = new ResizeObserver(konumGuncelle);
bar._hvShareResizeObserver.observe(img);
bar._hvShareResizeObserver.observe(anchor);
}
bar._hvShareResizeHandler = konumGuncelle;
window.addEventListener('resize', konumGuncelle, { passive: true });
}
function sliderUzerineTasi(kapak, bar, img) {
const slider = kapak.querySelector('.ai-video-slider');
if (!slider || !bar || !img || !slider.contains(img)) return false;
if (bar.parentElement === slider) {
paylasimKonumunuAyarla(bar, kapak, img, slider);
return true;
}
const eskiEbeveyn = bar.parentElement;
const eylemCubugu = eskiEbeveyn
? Array.from(eskiEbeveyn.children).find((el) => el.classList.contains('hv-haber-eylem-toolbar'))
: null;
slider.appendChild(bar);
if (eylemCubugu && eylemCubugu.parentElement !== slider) slider.appendChild(eylemCubugu);
paylasimKonumunuAyarla(bar, kapak, img, slider);
return true;
}
function barEkle(kapak) {
if (!kapak || !kapak.matches('.news-header')) return;
if (kapak.dataset.hvShareOverlayReady === '1' && kapak.querySelector('.share-here-wrapper')) return;
const img = anaKapakGorseliniBul(kapak);
if (!img) return;
const bar = yeniPaylasimBariOlustur();
bar.setAttribute('data-hv-ana-paylas', '1');
bar.classList.add('hv-share-image-overlay');
const anchor = konumSunucusuBul(kapak, img);
anchor.appendChild(bar);
kapak.dataset.hvShareOverlayReady = '1';
paylasimKonumunuAyarla(bar, kapak, img, anchor);
const observer = new MutationObserver(() => {
const yeniSlider = kapak.querySelector('.ai-video-slider');
if (yeniSlider && yeniSlider.contains(img)) {
sliderUzerineTasi(kapak, bar, img);
observer.disconnect();
bar._hvShareMutationObserver = null;
return;
}
if (bar._hvSharePositionUpdate) requestAnimationFrame(bar._hvSharePositionUpdate);
});
observer.observe(kapak, { childList: true, subtree: true });
bar._hvShareMutationObserver = observer;
window.setTimeout(() => {
if (bar._hvShareMutationObserver === observer) {
observer.disconnect();
bar._hvShareMutationObserver = null;
}
}, 10000);
}
function makaleBarlariniTemizle(makale) {
if (!makale) return;
makale.querySelectorAll('.news-header .share-here-wrapper').forEach((el) => {
if (el._hvShareResizeObserver) el._hvShareResizeObserver.disconnect();
if (el._hvShareMutationObserver) el._hvShareMutationObserver.disconnect();
if (el._hvShareResizeHandler) window.removeEventListener('resize', el._hvShareResizeHandler);
el.remove();
});
makale.querySelectorAll('.news-header .hv-share-overlay-host').forEach((el) => {
el.classList.remove('hv-share-overlay-host');
});
makale.querySelectorAll('.news-header .hv-haber-eylem-toolbar').forEach((el) => el.remove());
makale.querySelectorAll('.news-header').forEach((kapak) => {
delete kapak.dataset.hvShareOverlayReady;
});
}
function paneliAyarla(tetik, acik) {
const wrapper = tetik.closest('.share-here-wrapper');
const ad = tetik.getAttribute('data-hv-panel');
const pop = wrapper ? wrapper.querySelector('.hv-sh-pop[data-hv-pop="' + ad + '"]') : null;
if (!pop) return;
if (acik && pop.dataset.hvHazir !== '1') popIcerigiDoldur(pop, ad);
if (acik && wrapper && !wrapper.classList.contains('hv-in-slider')) {
const r = tetik.getBoundingClientRect();
const ustAlan = r.top - 28;
const altAlan = window.innerHeight - r.bottom - 28;
const asagi = ustAlan < 150 && altAlan > ustAlan;
pop.classList.toggle('hv-pop-down', asagi);
pop.style.setProperty('max-height', Math.max(120, Math.min(280, asagi ? altAlan : ustAlan)) + 'px', 'important');
}
tetik.setAttribute('aria-expanded', acik ? 'true' : 'false');
pop.classList.toggle('is-open', acik);
}
function tumPanelleriKapat(istisna) {
document.querySelectorAll('.news-header .hv-sh-btn[aria-expanded="true"]').forEach((tetik) => {
if (tetik !== istisna) paneliAyarla(tetik, false);
});
}
function toastGoster(wrapper, metin) {
if (!wrapper) return;
let toast = wrapper.querySelector('.hv-sh-toast');
if (!toast) {
toast = document.createElement('div');
toast.className = 'hv-sh-toast';
toast.setAttribute('role', 'status');
wrapper.appendChild(toast);
}
toast.textContent = metin;
toast.classList.add('is-on');
clearTimeout(toast._hvZamanlayici);
toast._hvZamanlayici = setTimeout(() => toast.classList.remove('is-on'), 1800);
}
async function linkiKopyala(wrapper) {
let basarili = false;
try {
if (navigator.clipboard && window.isSecureContext) {
await navigator.clipboard.writeText(canonicalURL);
basarili = true;
}
} catch (e) {
basarili = false;
}
if (!basarili) {
const alan = document.createElement('textarea');
alan.value = canonicalURL;
alan.setAttribute('readonly', '');
alan.style.position = 'fixed';
alan.style.top = '-1000px';
alan.style.opacity = '0';
document.body.appendChild(alan);
alan.select();
try {
basarili = document.execCommand('copy');
} catch (e) {
basarili = false;
}
alan.remove();
}
if (basarili) {
toastGoster(wrapper, 'Bağlantı kopyalandı');
} else {
window.prompt('Bağlantıyı kopyalayın:', canonicalURL);
}
}
async function yerliPaylas() {
if (!navigator.share) return;
try {
await navigator.share({ title: pageTitle, url: canonicalURL });
} catch (e) {
}
}
function googleRozetiOlustur() {
const rozet = document.createElement('button');
rozet.type = 'button';
rozet.className = 'hv-gtk-banner';
rozet.setAttribute('data-nosnippet', 'true');
rozet.setAttribute('title', 'Google’da tercih edilen kaynak olarak ekleyin');
rozet.setAttribute('aria-label', 'Google’da tercih edilen kaynak olarak ekleyin');
rozet.innerHTML =
'<span class="hv-gtk-g" aria-hidden="true">' + GOOGLE_G_SVG + '</span>' +
'<span class="hv-gtk-metin">' +
'<strong class="hv-gtk-baslik">Haberlerimizi Google’da Takip Edin</strong>' +
'<span class="hv-gtk-alt">Gelişmelerden anında haberdar olun.</span>' +
'</span>' +
'<span class="hv-gtk-arti" aria-hidden="true">' + ARTI_SVG + '</span>';
return rozet;
}
function googleRozetleriEkle() {
const islenenMakaleler = new Set();
document.querySelectorAll('.news-header').forEach((kapak) => {
const makale = kapak.closest(MAKALE_SECICI) || kapak;
if (islenenMakaleler.has(makale)) return;
islenenMakaleler.add(makale);
if (kapak.querySelector('.hv-gtk-banner')) return;
const img = anaKapakGorseliniBul(kapak);
if (!img) return;
let ustOge = img;
while (ustOge.parentElement && ustOge.parentElement !== kapak) {
ustOge = ustOge.parentElement;
}
kapak.insertBefore(googleRozetiOlustur(), ustOge);
});
}
function paylasimBarlariniTara() {
const kapaklar = Array.from(document.querySelectorAll('.news-header'));
const islenenMakaleler = new Set();
kapaklar.forEach((kapak) => {
const makale = kapak.closest(MAKALE_SECICI) || kapak;
if (islenenMakaleler.has(makale)) return;
islenenMakaleler.add(makale);
makaleBarlariniTemizle(makale);
barEkle(kapak);
});
document.dispatchEvent(new CustomEvent('hvPaylasBarlariHazir'));
}
googleRozetleriEkle();
if ('requestIdleCallback' in window) {
requestIdleCallback(paylasimBarlariniTara, { timeout: 2000 });
} else {
setTimeout(paylasimBarlariniTara, 0);
}
document.addEventListener('click', (event) => {
const tetik = event.target.closest('.hv-sh-btn');
if (tetik && tetik.closest('.news-header')) {
event.preventDefault();
const acik = tetik.getAttribute('aria-expanded') !== 'true';
tumPanelleriKapat(tetik);
paneliAyarla(tetik, acik);
return;
}
const eylem = event.target.closest('[data-hv-act]');
if (eylem && eylem.closest('.news-header .hv-sh')) {
const tur = eylem.getAttribute('data-hv-act');
const wrapper = eylem.closest('.share-here-wrapper');
tumPanelleriKapat(null);
if (tur === 'copy') linkiKopyala(wrapper);
if (tur === 'native') yerliPaylas();
return;
}
if (event.target.closest('.news-header .hv-sh a.hv-sh-tile')) tumPanelleriKapat(null);
if (!event.target.closest('.news-header .hv-sh')) tumPanelleriKapat(null);
const preferredBtn = event.target.closest('.hv-gtk-banner');
if (preferredBtn && preferredBtn.closest('.news-header')) {
(async () => {
try {
if (!preferredSource) await loadPreferredSource();
if (preferredSource) preferredSource.addPreferredSource();
} catch (e) {
console.warn('Tercih edilen kaynak eklenemedi:', e);
}
})();
}
});
document.addEventListener('keydown', (event) => {
if (event.key !== 'Escape') return;
const acikTetik = document.querySelector('.news-header .hv-sh-btn[aria-expanded="true"]');
if (!acikTetik) return;
tumPanelleriKapat(null);
acikTetik.focus({ preventScroll: true });
});
});
}
//
  };

  /* Orijinal Blogger tema konumu: satir 34632 | hvjs-024 */
  parts["hvjs-024"] = function () {

//
(function () {
'use strict';
function stilEkle() {
if (
document.getElementById(
'ai-yz-bildirim-style'
)
) {
return;
}
const style =
document.createElement(
'style'
);
style.id =
'ai-yz-bildirim-style';
style.textContent = `
            /* =================================================
               NORMAL MOD
            ================================================= */
            .ai-yz-kullanim-notu {
                text-align: center !important;
                font-size: 12px !important;
                color: #595959 !important;
                margin:
                    20px
                    0
                    8px
                    0 !important;
                line-height: 1.8 !important;
                padding:
                    10px
                    16px !important;
                border-top:
                    1px solid #eee !important;
                border-bottom:
                    1px solid #eee !important;
                box-sizing: border-box !important;
            }
            .ai-yz-kullanim-notu strong {
                color: inherit !important;
                font-weight: 700 !important;
            }
            .ai-yz-kullanim-notu a {
                color: #0066cc !important;
                text-decoration:
                    underline !important;
                font-weight: 600 !important;
                cursor: pointer !important;
            }/* =================================================
               LIGHT MODE AÇIKÇA
            ================================================= */
            body
            .ai-yz-kullanim-notu {
                color: #595959 !important;
                border-top-color:
                    #eee !important;
                border-bottom-color:
                    #eee !important;
            }
            body
            .ai-yz-kullanim-notu a {
                color: #0066cc !important;
            }
        `;
document.head.appendChild(
style
);
}
function notuEkle() {
const target =
document.getElementById(
'follow-all-here'
);
if (!target) {
return;
}
if (
document.querySelector(
'.ai-yz-kullanim-notu'
)
) {
return;
}
const not =
document.createElement(
'div'
);
not.className =
'ai-yz-kullanim-notu';
not.setAttribute(
'data-nosnippet',
'true'
);
not.innerHTML = `
            \u{1F916}
<strong>
                Yapay Zeka Kullanım Bildirimi:
</strong>
            Bu makale yapay zeka destekli araçlarla
            üretilmiştir.
            İçerik
<a
                href="https://www.haberlerver.com"
                target="_blank">
                Haberlerver.com
</a>
            sorumluluğu altında yayımlanmaktadır.
            Telif hakkı ve lisans bilgisi için
<a
                href="/p/lisans.html"
                target="_blank"
                rel="nofollow">
                Lisans Sayfamızı
</a>
            ziyaret edebilirsiniz.
            İçerikte hatalı, eksik veya güncel olmadığını
            düşündüğünüz bir bilgi varsa, lütfen
<a
                href="/p/iletisim.html"
                target="_blank"
                rel="nofollow">
                İletişim
</a>
            sayfamız üzerinden bizimle iletişime geçin;
            en kısa sürede gerekli kontrolleri sağlayıp
            güncelleyelim.
        `;
target.parentNode.insertBefore(
not,
target
);
}
function init() {
stilEkle();
notuEkle();
}
if (
document.readyState ===
'loading'
) {
document.addEventListener(
'DOMContentLoaded',
init,
{
once: true
}
);
} else {
init();
}
})();
//
  };

  /* Orijinal Blogger tema konumu: satir 34792 | hvjs-025 */
  parts["hvjs-025"] = function () {

//
(function () {
"use strict";
const CONFIG = {
blockedLabels: ["Hayvan", "Sanat", "Bilim", "Astroloji", "D%C3%BCnya", "Ekonomi", "Tarih", "Gezilecek%20Yerler"],
minWords: 800, 
minH2: 2,      
postSelectors: ["#postBody", "[id^='post-body-']", ".post-body", "[itemprop='articleBody']", ".entry-content"]
};
const DEBUG = /[?&]toc=debug(&|$)/.test(location.search);
const log = (...args) => { if (DEBUG) console.log("[İçindekiler]", ...args); };
const norm = (s) => String(s).trim().toLocaleLowerCase("tr-TR");
const blocked = CONFIG.blockedLabels.map(norm);
const trMap = { "ç": "c", "ğ": "g", "ı": "i", "ö": "o", "ş": "s", "ü": "u", "Ç": "c", "Ğ": "g", "İ": "i", "Ö": "o", "Ş": "s", "Ü": "u" };
const slugify = (s) =>
s.replace(/[çğıöşüÇĞİÖŞÜ]/g, (ch) => trMap[ch])
.toLowerCase()
.replace(/[^a-z0-9]+/g, "-")
.replace(/^-+|-+$/g, "") || "baslik";
const usedIds = new Set();
const uniqueId = (base) => {
let id = base;
let n = 2;
while (usedIds.has(id) || document.getElementById(id)) id = base + "-" + (n++);
usedIds.add(id);
return id;
};
const labelFromLink = (a) => {
const m = (a.getAttribute("href") || "").match(/\/search\/label\/([^\/?#]+)/);
if (!m) return "";
try { return decodeURIComponent(m[1].replace(/\+/g, " ")); } catch (e) { return m[1]; }
};
const findPostBody = () => {
for (const sel of CONFIG.postSelectors) {
const el = document.querySelector(sel);
if (el) return el;
}
return null;
};
const findJumpBreak = (postBody) => {
let marker = postBody.querySelector("a[name='more']");
if (!marker) {
const walker = document.createTreeWalker(postBody, NodeFilter.SHOW_COMMENT);
while (walker.nextNode()) {
if (walker.currentNode.nodeValue.trim().toLowerCase() === "more") {
marker = walker.currentNode;
break;
}
}
}
if (!marker) return null;
const wrap = marker.parentElement;
if (wrap && wrap !== postBody && wrap.tagName === "SPAN" && wrap.textContent.trim() === "" && wrap.children.length <= 1) {
return wrap;
}
return marker;
};
const getPostLabels = (postBody) => {
let scope = null;
for (const sel of ["article", ".hentry", ".post-outer", ".post", "#Blog1", ".blog-posts", "main"]) {
scope = postBody.parentElement && postBody.parentElement.closest(sel);
if (scope) break;
}
log("Etiketlerin aranacağı alan:", scope || "(bulunamadı)");
const IGNORE = "aside, .sidebar, .comments, #comments, [class*='related'], [class*='Related'], [id*='related'], [id*='Related']";
const links = scope
? scope.querySelectorAll("a[href*='/search/label/']")
: document.querySelectorAll(".post-labels a, a[rel='tag']");
const names = [];
links.forEach((a) => {
if (postBody.contains(a)) return; 
if (scope) { 
const skip = a.closest(IGNORE);
if (skip && skip !== scope && scope.contains(skip)) return;
}
const name = labelFromLink(a);
if (name) names.push(name);
});
return names;
};
const init = () => {
const postBody = findPostBody();
if (!postBody) {
log("Yazı gövdesi bulunamadı. CONFIG.postSelectors listesine temanızdaki ID/sınıfı ekleyin.");
return;
}
if (document.querySelector(".toc-container")) {
log("Sayfada zaten bir .toc-container var, ikinci kez eklenmedi.");
return;
}
log("Yazı gövdesi:", postBody);
const labels = getPostLabels(postBody);
log("Yazının etiketleri:", labels);
const hit = labels.find((l) => blocked.includes(norm(l)));
if (hit) {
log("Engelli etiket bulundu, içindekiler eklenmedi:", hit);
return;
}
const text = (postBody.innerText || postBody.textContent || "").trim();
const wordCount = text ? text.split(/\s+/).length : 0;
log("Kelime sayısı:", wordCount, "(en az " + CONFIG.minWords + " gerekli)");
if (wordCount < CONFIG.minWords) return;
const headings = Array.from(postBody.querySelectorAll("h2, h3, h4, h5, h6")).filter((h) => {
if (h.closest(".toc-container")) return false;
if (h.tagName === "H3" && h.closest(".card")) return false;
if (h.classList.contains("spot")) return false;
return h.textContent.replace(/_/g, "").trim() !== "";
});
const h2Count = headings.filter((h) => h.tagName === "H2").length;
log("H2 başlık sayısı:", h2Count, "(en az " + CONFIG.minH2 + " gerekli)");
if (h2Count < CONFIG.minH2) return;
if (!document.getElementById("toc-fixed-final")) {
const style = document.createElement("style");
style.id = "toc-fixed-final";
style.textContent = `
        html { scroll-behavior: smooth; }
        h2, h3, h4, h5, h6 { scroll-margin-top: 100px; }
        .toc-container {
          background: #fff;
          border: 1px solid #e5e7eb;
          border-radius: 12px;
          margin: 30px 0;
          max-width: 650px;
          overflow: hidden;
          box-shadow: 0 2px 4px rgba(0,0,0,0.06);
          font-family: 'Inter', sans-serif;
        }
        .toc-title {
          background: #f9fafb;
          padding: 12px 20px;
          font-weight: 700;
          font-size: 16px;
          font-family: 'Inter', sans-serif;
          border-bottom: 1px solid #e5e7eb;
          margin-bottom: 0;
          color: #111827;
        }
        .toc-container ul { list-style: none !important; margin: 0 !important; padding: 0 !important; }
        .toc-container > ul { padding: 12px 20px !important; }
        .toc-container ul ul { padding-left: 15px !important; margin-top: 4px; border-left: 1px solid #f2f2f2; }
        .toc-container li {
          position: relative;
          padding-left: 28px !important;
          margin-top: 6px !important;
          line-height: 1.5;
          display: block !important;
        }
        .toc-container li::before {
          position: absolute;
          left: 0;
          top: 0;
          width: 25px;
          color: #1A73E8;
          font-weight: 600;
          text-align: left;
          display: inline-block;
        }
        .toc-container a {
          text-decoration: none !important;
          color: #4b5563;
          font-size: 14px;
          font-weight: 500;
          font-family: 'Inter', sans-serif;
          display: block;
        }
        .toc-container a:hover { color: #1A73E8 !important; text-decoration: underline !important; }
        .toc-container > ul { counter-reset: c2; }
        .toc-container > ul > li { counter-increment: c2; }
        .toc-container > ul > li::before { content: counter(c2) "."; font-weight: 700; }
        .toc-container ul ul { counter-reset: c3; }
        .toc-container ul ul li { counter-increment: c3; }
        .toc-container ul ul li::before { content: counter(c3, lower-alpha) "."; font-weight: 400; color: #9ca3af; font-size: 13px; }
        .toc-container ul ul ul { counter-reset: c4; }
        .toc-container ul ul ul li { counter-increment: c4; }
        .toc-container ul ul ul li::before { content: counter(c4, lower-roman) "."; color: #9ca3af; font-size: 12px; }
        .toc-container ul ul ul ul li::before { content: '\\2605'; color: #f59e0b; font-size: 13px; }
        .toc-container ul ul ul ul ul li::before { content: '\\271A'; color: #10b981; font-size: 11px; }
      `;
document.head.appendChild(style);
}
const tocContainer = document.createElement("div");
tocContainer.className = "toc-container";
tocContainer.setAttribute("data-nosnippet", "true");
tocContainer.innerHTML = '<div class="toc-title">İÇİNDEKİLER</div><ul></ul>';
const tocList = tocContainer.querySelector("ul");
const jumpBreak = findJumpBreak(postBody);
const firstH2 = headings.find((h) => h.tagName === "H2");
if (jumpBreak) {
jumpBreak.before(tocContainer);
log("İçindekiler, 'devamını oku' işaretinin üstüne yerleştirildi.");
} else if (firstH2) {
firstH2.before(tocContainer);
log("'Devamını oku' işareti bulunamadı, ilk H2 başlığın üstüne yerleştirildi.");
} else {
postBody.prepend(tocContainer);
}
const tagOrder = ["H2", "H3", "H4", "H5", "H6"];
const stack = [tocList];
const levels = [0];
headings.forEach((header) => {
const headerText = header.textContent.replace(/_/g, "").replace(/\s+/g, " ").trim();
if (!header.id) header.id = uniqueId(slugify(headerText));
const currentIndex = tagOrder.indexOf(header.tagName);
while (currentIndex < levels[0]) {
stack.shift();
levels.shift();
}
if (currentIndex > levels[0]) {
const lastLi = stack[0].lastElementChild;
if (lastLi) {
const newUl = document.createElement("ul");
lastLi.appendChild(newUl);
stack.unshift(newUl);
levels.unshift(currentIndex);
}
}
const li = document.createElement("li");
const a = document.createElement("a");
a.textContent = headerText;
a.href = "#" + header.id;
li.appendChild(a);
stack[0].appendChild(li);
});
log("İçindekiler eklendi. Başlık sayısı:", headings.length);
};
if (document.readyState === "loading") {
document.addEventListener("DOMContentLoaded", init);
} else {
init();
}
})();
//
  };

  /* Orijinal Blogger tema konumu: satir 35030 | hvjs-026 */
  parts["hvjs-026"] = function () {

//
{
document.addEventListener('DOMContentLoaded', () => {
document.querySelectorAll('.card[id^="item"]').forEach((card) => {
const num = card.id.replace('item', '');
if (num) {
const serit = document.createElement('div');
serit.className = 'numara-serit';
serit.textContent = num;
card.prepend(serit);
}
});
});
}
//
  };

  /* Orijinal Blogger tema konumu: satir 35051 | hvjs-027 */
  parts["hvjs-027"] = function () {

//
(function () {
  'use strict';

  function initMediaLicenseArchive() {
    var imageContainer = document.getElementById('sayfa-gorseller') || document.getElementById('makale-gorseller');
    var videoContainer = document.getElementById('sayfa-videolar') || document.getElementById('sayfa-video-lisanslari') || document.getElementById('makale-videolar');
    var mode = videoContainer ? 'video' : (imageContainer ? 'image' : '');
    var container = mode === 'video' ? videoContainer : imageContainer;
    if (!container || !mode) return;
    if (container.getAttribute('data-hv-media-gallery-v16') === mode) return;
    container.setAttribute('data-hv-media-gallery-v16', mode);

    var counterEl = document.querySelector('.gorsel-toplam-sayac') || document.querySelector('.video-toplam-sayac');
    var PAGE_SIZE = 20;
    var BATCH_SIZE = 10;
    var STATIC_BATCH_SIZE = 8;
    var STEP_SIZE = 9;
    var nextStartIndex = 1;
    var postsFinished = false;
    var scanning = false;
    var scanFinished = false;
    var scanErrors = 0;
    var visibleCount = STEP_SIZE;
    var renderedCount = 0;
    var items = [];
    var seenMedia = Object.create(null);
    var seenPosts = Object.create(null);
    var seenStaticPages = Object.create(null);
    var counts = {
      postsScanned: 0,
      staticPagesScanned: 0,
      articleImages: 0,
      staticImages: 0,
      flags: 0,
      articleVideos: 0,
      staticVideos: 0,
      aiImages: 0,
      otherImages: 0,
      aiVideos: 0,
      otherVideos: 0
    };

    var IMAGE_CLASSES = [
      'ai-gorsel', 'gercek-gorsel', 'fotograf', 'bayrak', 'siteye-ait-gorsel',
      'ajans-lisansli-gorsel', 'stok-lisansli-gorsel', 'cc0-gorsel', 'cc-by-gorsel',
      'cc-by-sa-gorsel', 'cc-by-nd-gorsel', 'cc-by-nc-gorsel', 'cc-by-nc-sa-gorsel',
      'cc-by-nc-nd-gorsel', 'public-domain-gorsel', 'public-domain-mark-gorsel',
      'kamu-acik-lisans-gorsel', 'izinli-gorsel', 'arsiv-izinli-gorsel',
      'editorial-kullanim-gorsel', 'kurum-izinli-gorsel', 'web-kaynakli-gorsel'
    ];
    var VIDEO_CLASSES = [
      'video', 'ai-video', 'gercek-video', 'karma-video', 'cekim-video', 'ajans-video',
      'kamu-video', 'kurum-video', 'stok-video', 'web-kaynakli-video', 'canli-video',
      'roportaj-video', 'arsiv-video', 'sosyal-medya-video', 'guvenlik-kamerasi-video',
      'okuyucu-video', 'basin-toplantisi-video', 'etkinlik-video', 'ekran-kaydi-video',
      'animasyon-video', 'drone-video', 'saha-video', 'muhabir-video', 'studyo-video',
      'telefon-video', 'amator-video', 'tanik-video', 'bodycam-video', 'dashcam-video',
      'trafik-kamerasi-video', 'hava-goruntusu-video', 'uydu-goruntusu-video',
      'zaman-atlamali-video', 'yavas-cekim-video', 'canlandirma-video', 'infografik-video',
      'grafik-video', 'dosya-video', 'ozel-haber-video', 'panel-video', 'aciklama-video',
      'analiz-video', 'yorum-video', 'podcast-video', 'sokak-roportaji-video',
      'telefon-roportaji-video'
    ];
    var IMAGE_INFO = {
      'ai-gorsel': { label: 'Haberlerver.com özgün yapay zekâ görseli', note: 'Yapay zekâ ile özgün olarak hazırlanmıştır (Google Flow).', copyright: '© Haberlerver.com', own: true },
      'gercek-gorsel': { label: 'Gerçek görsel', note: 'Görselin gerçek olması tek başına lisansını belirlemez; kaynak ve kullanım izni ayrıca doğrulanmalıdır.' },
      'fotograf': { label: 'Fotoğraf', note: 'Fotoğrafın kaynak, telif ve kullanım izni bilgileri ayrıca doğrulanmalıdır.' },
      'bayrak': { label: 'Kamu Malı / Public Domain', note: 'Bayrak görseli arşiv kaydında kamu malı olarak sınıflandırılmıştır.', copyright: 'Kamu Malı / Public Domain' },
      'siteye-ait-gorsel': { label: 'Haberlerver.com özgün görseli', note: 'Siteye ait özgün görsel.', copyright: '© Haberlerver.com', own: true },
      'ajans-lisansli-gorsel': { label: 'Ajans lisanslı görsel', note: 'İlgili haber ajansının lisans ve atıf koşulları geçerlidir.' },
      'stok-lisansli-gorsel': { label: 'Stok lisanslı görsel', note: 'İlgili stok sağlayıcısının lisans koşulları geçerlidir.' },
      'cc0-gorsel': { label: 'CC0 / Kamu Malı', note: 'CC0 1.0 Evrensel koşulları geçerlidir.', url: 'https://creativecommons.org/publicdomain/zero/1.0/deed.tr', copyright: 'Kamu Malı / Public Domain' },
      'cc-by-gorsel': { label: 'Creative Commons Atıf (CC BY 4.0)', note: 'Atıf koşulları uygulanmalıdır.', url: 'https://creativecommons.org/licenses/by/4.0/deed.tr' },
      'cc-by-sa-gorsel': { label: 'Creative Commons Atıf-AynıLisansla (CC BY-SA 4.0)', note: 'Atıf ve aynı lisans koşulları uygulanmalıdır.', url: 'https://creativecommons.org/licenses/by-sa/4.0/deed.tr' },
      'cc-by-nd-gorsel': { label: 'Creative Commons Atıf-Türetilemez (CC BY-ND 4.0)', note: 'Atıf ve türetilemez koşulları uygulanmalıdır.', url: 'https://creativecommons.org/licenses/by-nd/4.0/deed.tr' },
      'cc-by-nc-gorsel': { label: 'Creative Commons Atıf-GayriTicari (CC BY-NC 4.0)', note: 'Atıf ve ticari olmayan kullanım koşulları uygulanmalıdır.', url: 'https://creativecommons.org/licenses/by-nc/4.0/deed.tr' },
      'cc-by-nc-sa-gorsel': { label: 'Creative Commons Atıf-GayriTicari-AynıLisansla (CC BY-NC-SA 4.0)', note: 'Atıf, ticari olmayan kullanım ve aynı lisans koşulları uygulanmalıdır.', url: 'https://creativecommons.org/licenses/by-nc-sa/4.0/deed.tr' },
      'cc-by-nc-nd-gorsel': { label: 'Creative Commons Atıf-GayriTicari-Türetilemez (CC BY-NC-ND 4.0)', note: 'Atıf, ticari olmayan kullanım ve türetilemez koşulları uygulanmalıdır.', url: 'https://creativecommons.org/licenses/by-nc-nd/4.0/deed.tr' },
      'public-domain-gorsel': { label: 'Kamu Malı / Public Domain', note: 'Görsel kamu malı olarak işaretlenmiştir.', copyright: 'Kamu Malı / Public Domain' },
      'public-domain-mark-gorsel': { label: 'Kamu Malı İşareti', note: 'Görsel kamu malı işaretiyle belirtilmiştir.', copyright: 'Kamu Malı / Public Domain' },
      'kamu-acik-lisans-gorsel': { label: 'Kamu açık lisansı', note: 'İlgili kamu lisansının özel koşulları kontrol edilmelidir.' },
      'izinli-gorsel': { label: 'İzinli kullanım', note: 'Görsel izin kapsamında kullanılmıştır; izin kapsamı ve süresi esas alınmalıdır.' },
      'arsiv-izinli-gorsel': { label: 'Arşiv izni', note: 'Arşiv kullanım izninin kapsamı ve varsa atıf koşulları geçerlidir.' },
      'editorial-kullanim-gorsel': { label: 'Editoryal kullanım', note: 'Yalnızca geçerli editoryal lisansın izin verdiği kullanım kapsamı esas alınmalıdır.' },
      'kurum-izinli-gorsel': { label: 'Kurum izni', note: 'İlgili kurumun verdiği kullanım izni ve koşulları geçerlidir.' },
      'web-kaynakli-gorsel': { label: 'Web kaynaklı görsel', note: 'Kaynak sayfanın hak ve lisans koşulları ayrıca doğrulanmalıdır.' },
      'unknown-static': { label: 'Türü ayrıca belirtilmemiş görsel', note: 'Görsel statik sayfa içeriğinden alınmıştır; tür ve lisans koşulları ayrıca doğrulanmalıdır.' }
    };
    var OWNED_VIDEO_CLASSES = [
      'video', 'ai-video', 'karma-video', 'cekim-video', 'saha-video', 'muhabir-video',
      'studyo-video', 'drone-video', 'canli-video', 'roportaj-video', 'sokak-roportaji-video',
      'telefon-roportaji-video', 'etkinlik-video', 'ekran-kaydi-video', 'animasyon-video',
      'canlandirma-video', 'infografik-video', 'grafik-video', 'ozel-haber-video', 'panel-video',
      'aciklama-video', 'analiz-video', 'yorum-video', 'podcast-video', 'zaman-atlamali-video',
      'yavas-cekim-video'
    ];
    var VIDEO_INFO = {
      'video': { label: 'Haberlerver.com özgün haber videosu', note: 'Haberlerver.com tarafından yayımlanan özgün haber videosu; ilgili makalede belirtilen görsel ve ses unsurlarının hakları ayrıca değerlendirilir.', copyright: '© Haberlerver.com', own: true },
      'ai-video': { label: 'Yapay zekâ destekli video', note: 'Yapay zekâ destekli video; üretim ve kullanım bilgileri bu sınıfta belirtilir.', copyright: '© Haberlerver.com', own: true },
      'gercek-video': { label: 'Gerçek video', note: 'Kaynak, telif sahibi ve kullanım izni ayrıca doğrulanmalıdır.' },
      'karma-video': { label: 'Karma video', note: 'Videoda kullanılan çekim, arşiv ve diğer materyallerin lisansları ayrı ayrı kontrol edilmelidir.' },
      'cekim-video': { label: 'Özgün çekim video', note: 'Çekim ve içerik hakları, varsa üçüncü taraf materyal izinleriyle birlikte değerlendirilmelidir.' },
      'ajans-video': { label: 'Ajans videosu', note: 'İlgili ajansın lisans, atıf ve dağıtım koşulları geçerlidir.' },
      'kamu-video': { label: 'Kamu videosu', note: 'Kamu kurumu tarafından yayımlanmış olması tek başına kamu malı olduğu anlamına gelmez; kullanım şartları doğrulanmalıdır.' },
      'kurum-video': { label: 'Kurum videosu', note: 'İlgili kurumun kullanım izni ve yayın koşulları kontrol edilmelidir.' },
      'stok-video': { label: 'Stok video', note: 'İlgili stok sağlayıcısının lisans koşulları geçerlidir.' },
      'web-kaynakli-video': { label: 'Web kaynaklı video', note: 'Kaynak sayfanın telif, gömme ve yeniden kullanım koşulları doğrulanmalıdır.' },
      'canli-video': { label: 'Canlı yayın videosu', note: 'Yayın sahibinin kayıt, paylaşım ve yeniden kullanım şartları geçerlidir.' },
      'roportaj-video': { label: 'Röportaj videosu', note: 'Görüntü, ses, katılımcı izinleri ve yapım hakları ayrıca değerlendirilmelidir.' },
      'arsiv-video': { label: 'Arşiv videosu', note: 'Arşiv sağlayıcısının kullanım izni ve varsa tarihsel materyal koşulları geçerlidir.' },
      'sosyal-medya-video': { label: 'Sosyal medya videosu', note: 'Sosyal ağda yayımlanması tek başına yeniden kullanım hakkı vermez; kaynak ve izin kontrol edilmelidir.' },
      'guvenlik-kamerasi-video': { label: 'Güvenlik kamerası görüntüsü', note: 'Görüntünün kaynağı, paylaşım yetkisi ve kişisel veri yükümlülükleri kontrol edilmelidir.' },
      'okuyucu-video': { label: 'Okuyucu videosu', note: 'Gönderenin izin ve hak beyanı ile üçüncü taraf hakları doğrulanmalıdır.' },
      'basin-toplantisi-video': { label: 'Basın toplantısı videosu', note: 'Organizatör ve kayıt sahibinin yayın koşulları kontrol edilmelidir.' },
      'etkinlik-video': { label: 'Etkinlik videosu', note: 'Etkinlik kaydı, katılımcı ve üçüncü taraf materyal izinleri kontrol edilmelidir.' },
      'ekran-kaydi-video': { label: 'Ekran kaydı videosu', note: 'Kaydedilen yazılım, görüntü, ses ve kişisel bilgilerin kullanım koşulları kontrol edilmelidir.' },
      'animasyon-video': { label: 'Animasyon videosu', note: 'Animasyon, ses ve içerikte kullanılan varlıkların lisansları değerlendirilmelidir.' },
      'drone-video': { label: 'Drone görüntüsü', note: 'Çekim sahibinin hakları ve uygulanabilir uçuş/görüntüleme izinleri kontrol edilmelidir.' },
      'saha-video': { label: 'Saha videosu', note: 'Kayıt sahibi, kaynak ve üçüncü taraf izinleri doğrulanmalıdır.' },
      'muhabir-video': { label: 'Muhabir videosu', note: 'Muhabir veya yayın kuruluşunun yayın ve kullanım koşulları geçerlidir.' },
      'studyo-video': { label: 'Stüdyo videosu', note: 'Program yapım, yayın, müzik ve konuk izinleri kontrol edilmelidir.' },
      'telefon-video': { label: 'Telefon videosu', note: 'Kayıt sahibinin izni ve videodaki üçüncü taraf hakları doğrulanmalıdır.' },
      'amator-video': { label: 'Amatör video', note: 'Kayıt sahibinin izin ve telif bilgileri ayrıca doğrulanmalıdır.' },
      'tanik-video': { label: 'Tanık videosu', note: 'Kaynak ve kullanım izni ile kişisel veri/güvenlik riskleri kontrol edilmelidir.' },
      'bodycam-video': { label: 'Bodycam görüntüsü', note: 'Görüntüye erişim ve yayın yetkisi ile mahremiyet yükümlülükleri doğrulanmalıdır.' },
      'dashcam-video': { label: 'Araç kamerası görüntüsü', note: 'Kayıt sahibi, kullanım izni ve görüntüdeki kişisel veriler değerlendirilmelidir.' },
      'trafik-kamerasi-video': { label: 'Trafik kamerası görüntüsü', note: 'Kamera işletmecisinin erişim ve yeniden yayın koşulları kontrol edilmelidir.' },
      'hava-goruntusu-video': { label: 'Hava görüntüsü', note: 'Görüntü sağlayıcısı ve kayıt hakları doğrulanmalıdır.' },
      'uydu-goruntusu-video': { label: 'Uydu görüntüsü', note: 'Uydu görüntüsü sağlayıcısının lisans ve atıf koşulları uygulanmalıdır.' },
      'zaman-atlamali-video': { label: 'Zaman atlamalı video', note: 'Kaydın sahibi ve içindeki üçüncü taraf materyal hakları doğrulanmalıdır.' },
      'yavas-cekim-video': { label: 'Yavaş çekim video', note: 'Kayıt sahibinin hakları ve kullanılan materyallerin lisansları kontrol edilmelidir.' },
      'canlandirma-video': { label: 'Canlandırma videosu', note: 'Canlandırma, ses ve kullanılan varlıkların kullanım koşulları değerlendirilmelidir.' },
      'infografik-video': { label: 'İnfografik video', note: 'Grafik, veri kaynağı, animasyon ve ses lisansları kontrol edilmelidir.' },
      'grafik-video': { label: 'Grafik video', note: 'Grafik varlıkları, veriler ve ses içeriğinin lisans koşulları doğrulanmalıdır.' },
      'dosya-video': { label: 'Dosya görüntüsü', note: 'Dosya görüntüsünün asıl kaynağı, tarihi ve kullanım izni doğrulanmalıdır.' },
      'ozel-haber-video': { label: 'Özel haber videosu', note: 'Yayıncı ve yapım hakları ile varsa üçüncü taraf materyal izinleri geçerlidir.' },
      'panel-video': { label: 'Panel videosu', note: 'Etkinlik kaydı, konuşmacı ve kayıt sahibinin kullanım koşulları kontrol edilmelidir.' },
      'aciklama-video': { label: 'Açıklama videosu', note: 'Videonun yapım ve kaynak materyal izinleri doğrulanmalıdır.' },
      'analiz-video': { label: 'Analiz videosu', note: 'Yapım, kullanılan veri/görsel kaynaklar ve üçüncü taraf materyal hakları doğrulanmalıdır.' },
      'yorum-video': { label: 'Yorum videosu', note: 'Yapım ve kullanılan alıntı, görüntü, müzik gibi varlıkların koşulları kontrol edilmelidir.' },
      'podcast-video': { label: 'Podcast videosu', note: 'Ses, görüntü, müzik ve katılımcı hakları birlikte değerlendirilmelidir.' },
      'sokak-roportaji-video': { label: 'Sokak röportajı videosu', note: 'Kayıt ve yayın izni ile kişisel veri/mahremiyet yükümlülükleri kontrol edilmelidir.' },
      'telefon-roportaji-video': { label: 'Telefon röportajı videosu', note: 'Ses kaydı izni, katılımcı onayı ve yayın hakları doğrulanmalıdır.' }
    };
    var VIDEO_LICENSE_INFO = {
      'video': 'Haberlerver.com içerik lisans koşulları',
      'ai-video': 'Haberlerver.com içerik lisans koşulları',
      'gercek-video': 'Kaynak, hak sahibi ve kullanım izni doğrulanmalı',
      'karma-video': 'Videoda bulunan her bileşenin lisansı ayrı doğrulanmalı',
      'cekim-video': 'Özgün çekim; kayıt sahibinin kullanım koşulları geçerlidir',
      'ajans-video': 'Haber ajansının lisans ve atıf koşulları geçerlidir',
      'kamu-video': 'Kamu kurumunun kullanım koşulları geçerlidir; kamu malı olduğu varsayılmaz',
      'kurum-video': 'İlgili kurumun yayın ve kullanım izni geçerlidir',
      'stok-video': 'Stok sağlayıcısının lisans kapsamı ve koşulları geçerlidir',
      'web-kaynakli-video': 'Kaynak web sitesinin lisansı ve yeniden kullanım izni doğrulanmalı',
      'canli-video': 'Yayın sahibinin kayıt, paylaşım ve yeniden kullanım koşulları geçerlidir',
      'roportaj-video': 'Kayıt ve yayın hakları ile katılımcı izinleri doğrulanmalı',
      'arsiv-video': 'Arşiv sağlayıcısının lisans ve atıf koşulları geçerlidir',
      'sosyal-medya-video': 'Platformda yayımlanması yeniden kullanım hakkı vermez; hak sahibi izni doğrulanmalı',
      'guvenlik-kamerasi-video': 'Erişim ve yayın yetkisi ile mahremiyet yükümlülükleri doğrulanmalı',
      'okuyucu-video': 'Gönderenin izin beyanı ve üçüncü taraf hakları doğrulanmalı',
      'basin-toplantisi-video': 'Organizatörün ve kayıt sahibinin yayın koşulları geçerlidir',
      'etkinlik-video': 'Etkinlik kaydı, katılımcılar ve üçüncü taraf materyallerin izinleri doğrulanmalı',
      'ekran-kaydi-video': 'Yazılım, görüntü, ses ve kişisel bilgilerin kullanım koşulları doğrulanmalı',
      'animasyon-video': 'Animasyon, ses ve kullanılan varlıkların lisansları geçerlidir',
      'drone-video': 'Çekim sahibinin hakları ve uygulanabilir çekim izinleri doğrulanmalı',
      'saha-video': 'Kayıt sahibi, kaynak ve üçüncü taraf izinleri doğrulanmalı',
      'muhabir-video': 'Muhabir veya yayın kuruluşunun yayın ve kullanım koşulları geçerlidir',
      'studyo-video': 'Yapım, yayın, müzik ve konuk izinleri doğrulanmalı',
      'telefon-video': 'Kayıt sahibinin izni ve videodaki üçüncü taraf hakları doğrulanmalı',
      'amator-video': 'Kayıt sahibinin hakları ve kullanım izinleri doğrulanmalı',
      'tanik-video': 'Kaynak ve kullanım izni ile güvenlik ve kişisel veri koşulları doğrulanmalı',
      'bodycam-video': 'Görüntüye erişim ve yayın yetkisi ile mahremiyet koşulları doğrulanmalı',
      'dashcam-video': 'Kayıt sahibi, kullanım izni ve kişisel veri koşulları doğrulanmalı',
      'trafik-kamerasi-video': 'Kamera işletmecisinin erişim ve yeniden yayın koşulları geçerlidir',
      'hava-goruntusu-video': 'Görüntü sağlayıcısı ve kayıt hakları doğrulanmalı',
      'uydu-goruntusu-video': 'Uydu görüntüsü sağlayıcısının lisans ve atıf koşulları geçerlidir',
      'zaman-atlamali-video': 'Kayıt sahibinin hakları ve üçüncü taraf materyal lisansları doğrulanmalı',
      'yavas-cekim-video': 'Kayıt sahibi hakları ve kullanılan materyallerin lisansları doğrulanmalı',
      'canlandirma-video': 'Canlandırma, ses ve kullanılan varlıkların lisansları doğrulanmalı',
      'infografik-video': 'Grafik, veri kaynağı, animasyon ve ses lisansları doğrulanmalı',
      'grafik-video': 'Grafik varlıkları, veriler ve ses içeriğinin lisans koşulları doğrulanmalı',
      'dosya-video': 'Dosya görüntüsünün asıl kaynağı, tarihi ve kullanım izni doğrulanmalı',
      'ozel-haber-video': 'Yayıncı ve yapım hakları ile üçüncü taraf izinleri geçerlidir',
      'panel-video': 'Etkinlik kaydı, konuşmacı ve kayıt sahibinin kullanım koşulları doğrulanmalı',
      'aciklama-video': 'Videonun yapım hakları ve kaynak materyal izinleri doğrulanmalı',
      'analiz-video': 'Yapım hakları, veriler ve üçüncü taraf materyal lisansları doğrulanmalı',
      'yorum-video': 'Yapım ile alıntı, görüntü ve müzik gibi varlıkların koşulları doğrulanmalı',
      'podcast-video': 'Ses, görüntü, müzik ve katılımcı hakları birlikte değerlendirilmelidir',
      'sokak-roportaji-video': 'Kayıt ve yayın izni ile kişisel veri ve mahremiyet koşulları doğrulanmalı',
      'telefon-roportaji-video': 'Ses kaydı izni, katılımcı onayı ve yayın hakları doğrulanmalı'
    };
    var VIDEO_COPYRIGHT_INFO = {
      'video': '© Haberlerver.com',
      'ai-video': '© Haberlerver.com',
      'gercek-video': 'Kaynak ve hak sahibi doğrulanmalı',
      'karma-video': 'İlgili bileşenlerin hak sahipleri',
      'cekim-video': 'Kayıt sahibi / üretici',
      'ajans-video': 'İlgili haber ajansı',
      'kamu-video': 'İlgili kamu kurumu veya hak sahibi',
      'kurum-video': 'İlgili kurum',
      'stok-video': 'Stok sağlayıcısı / hak sahibi',
      'web-kaynakli-video': 'Kaynak site veya hak sahibi',
      'canli-video': 'Yayın sahibi',
      'roportaj-video': 'Kayıt sahibi ve ilgili hak sahipleri',
      'arsiv-video': 'Arşiv sağlayıcısı / hak sahibi',
      'sosyal-medya-video': 'Videonun asıl hak sahibi',
      'guvenlik-kamerasi-video': 'Yetkili kayıt sahibi',
      'okuyucu-video': 'Gönderen / hak sahibi',
      'basin-toplantisi-video': 'Organizatör ve kayıt sahibi',
      'etkinlik-video': 'Kayıt sahibi ve ilgili hak sahipleri',
      'ekran-kaydi-video': 'Kayıt sahibi ve ilgili yazılım/içerik hak sahipleri',
      'animasyon-video': 'Animasyonun hak sahibi',
      'drone-video': 'Çekimi yapan / hak sahibi',
      'saha-video': 'Kayıt sahibi / yayın kuruluşu',
      'muhabir-video': 'Muhabir veya yayın kuruluşu',
      'studyo-video': 'Yapımcı / yayın kuruluşu',
      'telefon-video': 'Kaydı yapan / hak sahibi',
      'amator-video': 'Kayıt sahibi',
      'tanik-video': 'Kayıt sahibi / hak sahibi',
      'bodycam-video': 'Yetkili kayıt sahibi',
      'dashcam-video': 'Kayıt sahibi',
      'trafik-kamerasi-video': 'Kamera işletmecisi / yetkili kurum',
      'hava-goruntusu-video': 'Görüntü sağlayıcısı / hak sahibi',
      'uydu-goruntusu-video': 'Uydu görüntüsü sağlayıcısı',
      'zaman-atlamali-video': 'Kayıt sahibi / hak sahibi',
      'yavas-cekim-video': 'Kayıt sahibi / hak sahibi',
      'canlandirma-video': 'Canlandırmanın hak sahibi',
      'infografik-video': 'Yapımcı ve veri/görsel hak sahipleri',
      'grafik-video': 'Grafik/yapım hak sahibi',
      'dosya-video': 'Asıl kaynak veya kayıt sahibi',
      'ozel-haber-video': 'Yayıncı / yapım hak sahibi',
      'panel-video': 'Organizatör ve kayıt sahibi',
      'aciklama-video': 'Yapımcı / hak sahibi',
      'analiz-video': 'Yapımcı ve kaynak hak sahipleri',
      'yorum-video': 'Yapımcı ve kullanılan materyallerin hak sahipleri',
      'podcast-video': 'Yapımcı, konuşmacı ve ses/görüntü hak sahipleri',
      'sokak-roportaji-video': 'Kayıt sahibi ve ilgili katılımcı hakları',
      'telefon-roportaji-video': 'Kayıt sahibi ve katılımcı hakları'
    };
    var LICENSE_PAGE_URL = 'https://www.haberlerver.com/p/lisans.html';

    var styleText = [
      '#sayfa-gorseller,#makale-gorseller,#sayfa-videolar,#sayfa-video-lisanslari,#makale-videolar{width:100%;min-width:0;}',
      '.gorsel-grid{display:grid;grid-template-columns:repeat(3,minmax(0,1fr));gap:18px;margin:18px 0 24px;align-items:stretch;}',
      '.gorsel-grid .gorsel-card{position:relative;min-width:0;overflow:hidden;border:1px solid #e2e8f0;border-radius:14px;background:#fff;box-shadow:0 2px 8px rgba(15,23,42,.06);display:flex;flex-direction:column;}',
      '.gorsel-grid .gorsel-sira-rozet{position:absolute;top:8px;right:8px;z-index:3;display:inline-flex;align-items:center;justify-content:center;min-width:23px;height:23px;padding:0 6px;border-radius:7px;background:rgba(31,41,55,.82);color:#fff;font-size:11px;font-weight:700;line-height:1;box-shadow:0 1px 4px rgba(0,0,0,.18);pointer-events:none;box-sizing:border-box;}',
      '.gorsel-grid .gorsel-card>a{display:block;width:100%;background:#f8fafc;line-height:0;}',
      '.gorsel-grid .gorsel-card>a.gorsel-video-onizleme-link{position:relative;overflow:hidden;}',
      '.gorsel-grid .gorsel-video-oynat{position:absolute;left:50%;top:50%;transform:translate(-50%,-50%);width:60px;height:42px;border-radius:12px;background:rgba(255,0,0,.94);display:flex;align-items:center;justify-content:center;box-shadow:0 3px 12px rgba(0,0,0,.32);pointer-events:none;z-index:2;}',
      '.gorsel-grid .gorsel-video-oynat:before{content:"";display:block;width:0;height:0;border-style:solid;border-width:9px 0 9px 15px;border-color:transparent transparent transparent #fff;margin-left:3px;}',
      '.gorsel-grid .gorsel-card img{display:block;width:100%;height:auto;aspect-ratio:16/9;object-fit:contain;margin:0;background:#f8fafc;}',
      '.gorsel-grid .gorsel-medya-yok{display:flex;align-items:center;justify-content:center;min-height:150px;aspect-ratio:16/9;padding:18px;box-sizing:border-box;background:#eef2f7;color:#475569;text-align:center;font-size:14px;font-weight:700;line-height:1.5;}',
      '.gorsel-grid .gorsel-info{padding:12px;font-size:12px;line-height:1.55;color:#374151;overflow-wrap:anywhere;}',
      '.gorsel-grid .gorsel-info strong{display:block;margin:0 0 7px;font-size:14px;line-height:1.4;color:#111827;}',
      '.gorsel-grid .gorsel-info b{color:#111827;}',
      '.gorsel-grid .gorsel-info a{color:#1769aa;text-decoration:none;font-weight:600;}',
      '.gorsel-grid .gorsel-info a:hover{text-decoration:underline;}',
      '.gorsel-toplam-kutu{margin:14px 0;padding:12px 14px;background:#f4f6fb;border-left:4px solid #6f42c1;border-radius:10px;color:#1f2937;font-size:13px;line-height:1.55;overflow-wrap:anywhere;box-sizing:border-box;}',
      '.gorsel-daha-fazla-alan{display:flex;flex-direction:column;align-items:center;gap:10px;margin:22px 0 30px;}',
      '.gorsel-daha-fazla{appearance:none;border:0;border-radius:9px;padding:12px 24px;background:#1a73e8;color:#fff;font-weight:700;font-size:15px;cursor:pointer;}',
      '.gorsel-daha-fazla:hover{background:#155fc0;}.gorsel-daha-fazla:disabled{opacity:.65;cursor:wait;}',
      '.gorsel-galeri-durum{font-size:13px;text-align:center;color:#64748b;}',
      '.gorsel-galeri-yukleniyor,.gorsel-galeri-hata{padding:24px;text-align:center;color:#64748b;}',
      '@media(max-width:768px){.gorsel-grid{grid-template-columns:minmax(0,1fr);gap:12px}.gorsel-grid .gorsel-info{padding:12px;font-size:12px}.gorsel-grid .gorsel-info strong{font-size:14px}.gorsel-toplam-kutu{font-size:12px;line-height:1.5;padding:9px 10px;margin:10px 0;border-left-width:3px}.gorsel-toplam-kutu b{font-weight:700}}',
      '@media(max-width:420px){.gorsel-grid{gap:10px}.gorsel-grid .gorsel-info{padding:10px}}'
    ].join('');
    if (!document.querySelector('style[data-hv-media-gallery-style="v15"]')) {
      var style = document.createElement('style');
      style.setAttribute('data-hv-media-gallery-style', 'v15');
      style.textContent = styleText;
      document.head.appendChild(style);
    }

    var grid = document.createElement('div');
    grid.className = 'gorsel-grid';
    grid.setAttribute('aria-label', mode === 'video' ? 'Video lisans arşivi' : 'Görsel lisans arşivi');
    var moreArea = document.createElement('div');
    moreArea.className = 'gorsel-daha-fazla-alan';
    var moreButton = document.createElement('button');
    moreButton.type = 'button';
    moreButton.className = 'gorsel-daha-fazla';
    moreButton.textContent = '9 kayıt daha göster';
    moreButton.hidden = true;
    var status = document.createElement('div');
    status.className = 'gorsel-galeri-durum';
    status.setAttribute('aria-live', 'polite');
    moreArea.appendChild(moreButton);
    moreArea.appendChild(status);
    container.innerHTML = '';
    container.appendChild(grid);
    container.appendChild(moreArea);

    function escapeHtml(value) {
      return String(value == null ? '' : value).replace(/[&<>"']/g, function (ch) {
        return ({ '&':'&amp;', '<':'&lt;', '>':'&gt;', '"':'&quot;', "'":'&#39;' })[ch];
      });
    }
    function safeUrl(value, base) {
      try {
        var u = new URL(String(value || ''), base || window.location.href);
        if (u.protocol !== 'http:' && u.protocol !== 'https:') return '';
        return u.href;
      } catch (e) { return ''; }
    }
    function cleanPageUrl(value, base) {
      var raw = safeUrl(value, base);
      if (!raw) return '';
      try {
        var u = new URL(raw);
        if (u.origin !== window.location.origin) return '';
        u.hash = '';
        u.search = '';
        return (u.origin + u.pathname).replace(/\/$/, '');
      } catch (e) { return ''; }
    }
    function canonicalImageKey(value) {
      var url = safeUrl(value);
      if (!url) return '';
      try {
        var u = new URL(url);
        u.hash = '';
        u.search = '';
        u.pathname = u.pathname.replace(/\/(?:w|s)\d+(?:-[^/]+)?\//g, '/');
        return u.origin + u.pathname;
      } catch (e) { return url.split(/[?#]/)[0]; }
    }
    function resolveClass(element, classes) {
      var node = element;
      var depth = 0;
      var genericVideoClass = '';
      while (node && node.nodeType === 1 && depth < 8) {
        if (node.classList) {
          for (var i = 0; i < classes.length; i++) {
            if (node.classList.contains(classes[i])) {
              if (classes[i] === 'video') { genericVideoClass = 'video'; continue; }
              return classes[i];
            }
          }
        }
        node = node.parentElement;
        depth++;
      }
      return genericVideoClass;
    }
    function bestSrcsetCandidate(value) {
      if (!value) return '';
      var candidates = String(value).split(',').map(function (part) {
        var bits = part.trim().split(/\s+/);
        var descriptor = bits[1] || '';
        var amount = parseFloat(descriptor) || 0;
        if (/x$/.test(descriptor)) amount *= 1000;
        return { url: bits[0] || '', amount: amount };
      }).filter(function (item) { return !!safeUrl(item.url); });
      candidates.sort(function (a, b) { return a.amount - b.amount; });
      return candidates.length ? candidates[candidates.length - 1].url : '';
    }
    function getImageSource(img, pageUrl) {
      var srcset = bestSrcsetCandidate(img.getAttribute('data-srcset') || img.getAttribute('srcset') || '');
      var candidates = [img.getAttribute('data-full-src'), img.getAttribute('data-original'), srcset, img.getAttribute('data-src'), img.getAttribute('src')];
      for (var i = 0; i < candidates.length; i++) {
        var candidate = String(candidates[i] || '').trim();
        if (!candidate || /^data:/i.test(candidate)) continue;
        var safe = safeUrl(candidate, pageUrl);
        if (safe) return safe;
      }
      return '';
    }
    function formatDateTR(dateValue) {
      if (!dateValue) return 'Belirtilmedi';
      var raw = String(dateValue).trim();
      var dateOnly = raw.match(/^(\d{4})-(\d{2})-(\d{2})$/);
      if (dateOnly) return dateOnly[3] + '.' + dateOnly[2] + '.' + dateOnly[1] + ' - 00:00';
      var d = new Date(raw);
      if (isNaN(d.getTime())) return 'Belirtilmedi';
      try {
        var parts = new Intl.DateTimeFormat('tr-TR', { timeZone: 'Europe/Istanbul', day: '2-digit', month: '2-digit', year: 'numeric', hour: '2-digit', minute: '2-digit', hourCycle: 'h23' }).formatToParts(d);
        var p = {};
        parts.forEach(function (part) { if (part.type !== 'literal') p[part.type] = part.value; });
        return p.day + '.' + p.month + '.' + p.year + ' - ' + p.hour + ':' + p.minute;
      } catch (e) {
        var pad = function (n) { return String(n).padStart(2, '0'); };
        return pad(d.getDate()) + '.' + pad(d.getMonth() + 1) + '.' + d.getFullYear() + ' - ' + pad(d.getHours()) + ':' + pad(d.getMinutes());
      }
    }
    function getAttributeFromAncestors(element, names) {
      var node = element;
      var depth = 0;
      while (node && node.nodeType === 1 && depth < 8) {
        for (var i = 0; i < names.length; i++) {
          var val = node.getAttribute(names[i]);
          if (val && val.trim()) return val.trim();
        }
        node = node.parentElement;
        depth++;
      }
      return '';
    }
    function titleFromDoc(doc, fallback) {
      var titleNode = doc.querySelector('h1.entry-title, .post-title, article h1, h1');
      if (titleNode && titleNode.textContent.trim()) return titleNode.textContent.trim();
      var titleEl = doc.querySelector('title');
      return titleEl && titleEl.textContent.trim() ? titleEl.textContent.trim() : (fallback || 'Haberlerver.com');
    }
    function entryUrl(entry) {
      var links = Array.isArray(entry && entry.link) ? entry.link : [];
      var alt = links.find(function (link) { return link && link.rel === 'alternate' && link.href; });
      return alt ? safeUrl(alt.href) : '';
    }
    function articleTitle(entry, doc, fallback) {
      return entry && entry.title && entry.title.$t ? entry.title.$t : titleFromDoc(doc, fallback);
    }
    function getContentRoot(doc) {
      return doc.getElementById('postBody') || doc.querySelector('.static_page .post-body.entry-content') || doc.querySelector('.static_page .post-body') || doc.querySelector('.post-body.entry-content') || doc.querySelector('.post-body') || doc.querySelector('.static-page-content, .page-content, .entry-content') || doc.querySelector('main') || doc.querySelector('article') || doc.body;
    }
    function isDecorativeOrOutsideContent(element, root) {
      if (!element || !root || !root.contains(element)) return true;
      if (element.closest('#header-wrapper,#footer-wrapper,#sidebar-container,.author-avatar,[class*="avatar"],[class*="profile"],.post-share,.share-buttons,.related-evo,.related-ui,#sayfa-gorseller,#makale-gorseller,#sayfa-videolar,#sayfa-video-lisanslari,.hv-home-sections,.hv-label-carousel-section')) return true;
      var marker = String(element.className || '') + ' ' + String(element.id || '') + ' ' + (element.getAttribute('src') || element.getAttribute('data-src') || '');
      return /logo|favicon|avatar|emoji|spinner|payment|social-icon/i.test(marker);
    }
    function pageFallbackDate(doc) {
      var meta = doc.querySelector('meta[property="article:modified_time"],meta[name="dateModified"],meta[name="last-modified"],meta[property="og:updated_time"]');
      return meta && meta.content ? meta.content : '';
    }
    function entryFallbackDate(entry) {
      return entry ? ((entry.updated && entry.updated.$t) || (entry.published && entry.published.$t) || '') : '';
    }
    function licenseValueIsUrl(value) {
      return /^(?:https?:\/\/|\/(?!\/)|\.\.?\/)/i.test(String(value || '').trim());
    }
    function getLicenseMeta(element) {
      var licenseValue = getAttributeFromAncestors(element, ['data-license']);
      var licenseName = getAttributeFromAncestors(element, ['data-license-name', 'data-license-label']);
      var explicitLicenseUrl = getAttributeFromAncestors(element, ['data-license-url']);
      var acquireUrl = getAttributeFromAncestors(element, ['data-acquire-license-page', 'data-acquire-license']);
      return {
        date: getAttributeFromAncestors(element, ['data-license-date', 'data-created', 'data-copyright-date', 'data-created-at', 'data-video-date', 'data-published']),
        creator: getAttributeFromAncestors(element, ['data-creator', 'data-video-creator']),
        credit: getAttributeFromAncestors(element, ['data-credit', 'data-credit-text', 'data-video-credit']),
        copyrightHolder: getAttributeFromAncestors(element, ['data-copyright-holder']),
        copyright: getAttributeFromAncestors(element, ['data-copyright-notice', 'data-copyright', 'data-rights']),
        licenseName: licenseName,
        license: licenseName || (licenseValue && !licenseValueIsUrl(licenseValue) ? licenseValue : ''),
        licenseValue: licenseValue,
        licenseUrl: licenseValue && licenseValueIsUrl(licenseValue) ? licenseValue : explicitLicenseUrl,
        acquireUrl: acquireUrl,
        note: getAttributeFromAncestors(element, ['data-license-note', 'data-license-notice', 'data-usage-info']),
        digitalSourceType: getAttributeFromAncestors(element, ['data-digital-source-type'])
      };
    }
    function imageDefaultLicense(type, info, ownClass) {
      if (ownClass) return 'Haberlerver.com görsel lisans koşulları';
      if (type === 'bayrak' || type === 'cc0-gorsel' || type === 'cc-by-gorsel' || type === 'cc-by-sa-gorsel' || type === 'cc-by-nd-gorsel' || type === 'cc-by-nc-gorsel' || type === 'cc-by-nc-sa-gorsel' || type === 'cc-by-nc-nd-gorsel' || type === 'public-domain-gorsel' || type === 'public-domain-mark-gorsel') return info.label;
      if (type === 'editorial-kullanim-gorsel') return 'Haberlerver.com editoryal kullanım lisans koşulları';
      return 'Lisans bilgisi belirtilmemiş; kaynak ve kullanım izni doğrulanmalı';
    }
    function imageCandidate(img, pageUrl, sourceType, sourceTitle, fallbackDate, headerImg) {
      var type = resolveClass(img, IMAGE_CLASSES);
      if (!type) {
        if (sourceType === 'article' && img === headerImg) type = 'ai-gorsel';
        else if (sourceType === 'static' && !isDecorativeOrOutsideContent(img, img.ownerDocument.body)) type = 'unknown-static';
        else return null;
      }
      if (sourceType === 'article' && IMAGE_CLASSES.indexOf(type) === -1) return null;
      var src = getImageSource(img, pageUrl);
      var key = canonicalImageKey(src);
      if (!src || !key) return null;
      var meta = getLicenseMeta(img);
      var info = IMAGE_INFO[type] || IMAGE_INFO['unknown-static'];
      var ownClass = !!info.own || type === 'ai-gorsel' || type === 'siteye-ait-gorsel' || type === 'editorial-kullanim-gorsel';
      var caption = getAttributeFromAncestors(img, ['data-caption', 'data-description', 'alt', 'title']) || (type === 'bayrak' ? 'Resmî bayrak görseli' : sourceTitle);
      var date = meta.date || ((ownClass || type === 'bayrak') ? fallbackDate : '');
      var copyright = meta.copyright || info.copyright || (ownClass ? '© Haberlerver.com' : (type === 'bayrak' ? 'Kamu Malı / Public Domain' : 'Hak sahibi doğrulanmalı'));
      var rawLicenseUrl = meta.licenseUrl || meta.acquireUrl || '';
      var licenseUrl = rawLicenseUrl ? safeUrl(rawLicenseUrl, pageUrl) : (info.url || (ownClass ? LICENSE_PAGE_URL : ''));
      if ((type === 'ai-gorsel' || type === 'siteye-ait-gorsel') && !rawLicenseUrl) licenseUrl = LICENSE_PAGE_URL;
      var licenseLabel = meta.license || imageDefaultLicense(type, info, ownClass);
      return {
        key: key, mode: 'image', src: src, preview: src,
        sourceType: sourceType, sourceUrl: pageUrl, sourceTitle: sourceTitle || 'Haberlerver.com',
        caption: caption, date: formatDateTR(date), rawDate: date, creator: meta.creator, credit: meta.credit,
        copyrightHolder: meta.copyrightHolder, digitalSourceType: meta.digitalSourceType, own: ownClass,
        copyright: copyright, license: licenseLabel, licenseUrl: licenseUrl,
        licenseNote: meta.note || info.note, kind: type
      };
    }
    function youtubeId(url) {
      try {
        var u = new URL(url);
        var host = u.hostname.toLowerCase();
        var m = null;
        if (host === 'youtu.be' || host.endsWith('.youtu.be')) m = u.pathname.match(/^\/([A-Za-z0-9_-]{6,})/);
        if (!m && (host.indexOf('youtube.com') !== -1 || host.indexOf('youtube-nocookie.com') !== -1)) {
          m = u.pathname.match(/\/(?:embed|shorts|live|v)\/([A-Za-z0-9_-]{6,})/);
          if (!m) {
            var id = u.searchParams.get('v');
            if (id) m = [id, id];
          }
        }
        return m ? m[1] : '';
      } catch (e) { return ''; }
    }
    function getSrcdocPreviewUrl(element) {
      var srcdoc = element && element.getAttribute ? element.getAttribute('srcdoc') : '';
      if (!srcdoc) return '';
      try {
        var doc = new DOMParser().parseFromString(srcdoc, 'text/html');
        var img = doc.querySelector('img[src],img[data-src]');
        return img ? (img.getAttribute('data-src') || img.getAttribute('src') || '') : '';
      } catch (e) { return ''; }
    }
    function getSrcdocTargetUrl(element) {
      var srcdoc = element && element.getAttribute ? element.getAttribute('srcdoc') : '';
      if (!srcdoc) return '';
      try {
        var doc = new DOMParser().parseFromString(srcdoc, 'text/html');
        var link = doc.querySelector('a[href]');
        return link ? (link.getAttribute('href') || '') : '';
      } catch (e) { return ''; }
    }
    function getVideoSource(element, pageUrl) {
      var values = [
        getAttributeFromAncestors(element, ['data-video-url', 'data-embed-url', 'data-original-src']),
        element.getAttribute('src'), element.getAttribute('data-src'), element.getAttribute('data-video-src'),
        getSrcdocTargetUrl(element)
      ];
      for (var i = 0; i < values.length; i++) {
        var raw = String(values[i] || '').trim();
        if (!raw || /^data:/i.test(raw) || /^about:/i.test(raw)) continue;
        var url = safeUrl(raw, pageUrl);
        if (url) return url;
      }
      return '';
    }
    function getVideoCoverImageElement(element) {
      var wrapper = element.closest('.haber-video-wrapper, .video-wrapper, .ai-video-slider');
      var inside = wrapper ? wrapper.querySelector('img[src],img[data-src],img[data-original]') : null;
      if (inside) return inside;
      var block = wrapper || element;
      var sibling = block.previousElementSibling;
      var hops = 0;
      while (sibling && hops < 5) {
        if (sibling.matches('figure,.haber-kapak-gorsel,.post-image,.separator') || sibling.querySelector('figure img, img.ai-gorsel, img.gercek-gorsel, img.fotograf')) {
          var img = sibling.matches('img') ? sibling : sibling.querySelector('img[src],img[data-src],img[data-original]');
          if (img) return img;
        }
        if (sibling.matches('.haber-video-wrapper,.video-wrapper,.ai-video-slider')) break;
        sibling = sibling.previousElementSibling;
        hops++;
      }
      var header = element.closest('.news-header');
      return header ? header.querySelector('figure img, .haber-kapak-gorsel img, img.ai-gorsel, img.gercek-gorsel, img.fotograf') : null;
    }
    function getVideoPreview(element, sourceUrl, pageUrl) {
      var poster = getAttributeFromAncestors(element, ['data-poster', 'poster', 'data-thumbnail', 'data-video-thumbnail', 'data-preview-image', 'data-cover-image']);
      if (!poster) poster = getSrcdocPreviewUrl(element);
      if (!poster) {
        var coverImg = getVideoCoverImageElement(element);
        if (coverImg) poster = getImageSource(coverImg, pageUrl);
      }
      if (!poster) {
        var wrapper = element.closest('.haber-video-wrapper, .video-wrapper, figure, .ai-video-slider');
        var nearbyImg = wrapper ? wrapper.querySelector('img[src],img[data-src]') : null;
        if (nearbyImg) poster = nearbyImg.getAttribute('data-src') || nearbyImg.getAttribute('src') || '';
      }
      if (poster) {
        var safePoster = safeUrl(poster, pageUrl);
        if (safePoster && !/youtube(?:-nocookie)?\.com\/embed/i.test(safePoster)) return safePoster;
      }
      var id = youtubeId(sourceUrl);
      return id ? 'https://i.ytimg.com/vi/' + id + '/hqdefault.jpg' : '';
    }
    function videoPlayUrl(sourceUrl) {
      var id = youtubeId(sourceUrl);
      if (id) return 'https://www.youtube.com/watch?v=' + encodeURIComponent(id);
      return sourceUrl;
    }
    function videoCandidate(element, pageUrl, sourceType, sourceTitle, fallbackDate) {
      var type = resolveClass(element, VIDEO_CLASSES);
      if (!type) return null;
      var src = getVideoSource(element, pageUrl);
      if (!src) return null;
      var id = youtubeId(src);
      var key = id ? 'youtube:' + id : (function () {
        try { var u = new URL(src); u.hash = ''; u.search = ''; return u.href; } catch (e) { return src.split(/[?#]/)[0]; }
      })();
      var meta = getLicenseMeta(element);
      var info = VIDEO_INFO[type] || VIDEO_INFO.video;
      var ownClass = OWNED_VIDEO_CLASSES.indexOf(type) !== -1 || !!info.own;
      var coverImage = getVideoCoverImageElement(element);
      var coverMeta = coverImage ? getLicenseMeta(coverImage) : {};
      var title = getAttributeFromAncestors(element, ['data-video-title', 'data-title', 'aria-label', 'title']) || sourceTitle || 'Video';
      var date = meta.date || (ownClass ? coverMeta.date || fallbackDate : '');
      var copyright = meta.copyright || info.copyright || (ownClass ? '© Haberlerver.com' : (VIDEO_COPYRIGHT_INFO[type] || 'Hak sahibi doğrulanmalı'));
      var rawLicenseUrl = meta.licenseUrl || meta.acquireUrl || '';
      var licenseUrl = rawLicenseUrl ? safeUrl(rawLicenseUrl, pageUrl) : (ownClass ? LICENSE_PAGE_URL : '');
      var licenseLabel = meta.license || (ownClass ? 'Haberlerver.com içerik lisans koşulları' : 'Lisans bilgisi belirtilmemiş; kaynak ve kullanım izni doğrulanmalı');
      return {
        key: key, mode: 'video', src: src, playUrl: videoPlayUrl(src), preview: getVideoPreview(element, src, pageUrl),
        sourceType: sourceType, sourceUrl: pageUrl, sourceTitle: sourceTitle || 'Haberlerver.com',
        caption: title, date: formatDateTR(date), rawDate: date, creator: meta.creator, credit: meta.credit,
        copyrightHolder: meta.copyrightHolder, digitalSourceType: meta.digitalSourceType, own: ownClass,
        copyright: copyright, license: licenseLabel, licenseUrl: licenseUrl,
        licenseNote: meta.note || info.note, kind: type
      };
    }
    function extractPageMedia(doc, pageUrl, sourceType, entry, fallbackTitle) {
      var sourceTitle = sourceType === 'article' ? articleTitle(entry, doc, pageUrl) : titleFromDoc(doc, fallbackTitle || pageUrl);
      var fallbackDate = sourceType === 'article' ? entryFallbackDate(entry) : pageFallbackDate(doc);
      var root = sourceType === 'static' ? getContentRoot(doc) : doc;
      var found = [];
      var localSeen = Object.create(null);
      if (mode === 'image') {
        var headerImg = doc.querySelector('.news-header figure img:not(.bayrak), .news-header img:not(.bayrak), figure img:not(.bayrak)');
        Array.prototype.forEach.call(root.querySelectorAll('img'), function (img) {
          var item = imageCandidate(img, pageUrl, sourceType, sourceTitle, fallbackDate, headerImg);
          if (!item || localSeen[item.key]) return;
          localSeen[item.key] = true;
          found.push(item);
        });
      } else {
        Array.prototype.forEach.call(root.querySelectorAll('iframe,video'), function (element) {
          var item = videoCandidate(element, pageUrl, sourceType, sourceTitle, fallbackDate);
          if (!item || localSeen[item.key]) return;
          localSeen[item.key] = true;
          found.push(item);
        });
      }
      return { sourceType: sourceType, sourceUrl: pageUrl, title: sourceTitle, items: found };
    }
    function parseHtml(html) {
      return new DOMParser().parseFromString(String(html || ''), 'text/html');
    }
    async function parsePost(entry) {
      var postUrl = entryUrl(entry);
      var keyUrl = cleanPageUrl(postUrl, window.location.href);
      if (!postUrl || !keyUrl || seenPosts[keyUrl]) return null;
      seenPosts[keyUrl] = true;
      var title = articleTitle(entry, null, postUrl);
      var content = entry && entry.content && entry.content.$t ? entry.content.$t : '';
      if (content) {
        var contentDoc = parseHtml(content);
        var contentResult = extractPageMedia(contentDoc, postUrl, 'article', entry, title);
        if (contentResult.items.length) return contentResult;
      }
      try {
        var response = await fetch(postUrl, { credentials: 'same-origin', cache: 'default' });
        if (!response.ok) throw new Error('Makale HTTP ' + response.status);
        return extractPageMedia(parseHtml(await response.text()), postUrl, 'article', entry, title);
      } catch (err) {
        var summary = entry && entry.summary && entry.summary.$t ? entry.summary.$t : '';
        if (summary) {
          var summaryDoc = parseHtml(summary);
          var summaryResult = extractPageMedia(summaryDoc, postUrl, 'article', entry, title);
          if (summaryResult.items.length) return summaryResult;
        }
        throw err;
      }
    }
    function commitPage(record) {
      if (!record || !Array.isArray(record.items)) return;
      if (record.sourceType === 'article') counts.postsScanned++;
      else if (record.sourceType === 'static') counts.staticPagesScanned++;
      record.items.forEach(function (item) {
        if (!item || !item.key) return;
        var dedupeKey = item.mode === 'video'
          ? 'video-page:' + cleanPageUrl(item.sourceUrl, window.location.href) + '|' + item.key
          : item.key;
        if (seenMedia[dedupeKey]) return;
        seenMedia[dedupeKey] = true;
        if (item.mode === 'video') {
          if (item.sourceType === 'static') counts.staticVideos++;
          else counts.articleVideos++;
          if (item.kind === 'ai-video') counts.aiVideos++;
          else counts.otherVideos++;
        } else {
          if (item.kind === 'bayrak') counts.flags++;
          else if (item.sourceType === 'static') counts.staticImages++;
          else counts.articleImages++;
          if (item.kind === 'ai-gorsel') counts.aiImages++;
          else if (item.kind !== 'bayrak') counts.otherImages++;
        }
        items.push(item);
      });
    }
    function copyrightWithYear(item) {
      var copyright = String(item.copyright || 'Belirtilmedi').trim();
      if (item.kind === 'bayrak') return copyright;
      var isHaberlerver = /©\s*\uFE0F?\s*(?:(?:\d{4})\s+)?Haberlerver\.com(?:\s+\d{4})?/i.test(copyright);
      if (!isHaberlerver) return copyright;
      var inCopyright = copyright.match(/©\s*\uFE0F?\s*(\d{4})\s+Haberlerver\.com|©\s*\uFE0F?\s*Haberlerver\.com\s+(\d{4})/i);
      var dateText = String(item.rawDate || item.date || '');
      var fromDate = dateText.match(/(?:^|[^0-9])(\d{4})(?:[^0-9]|$)/);
      var year = (fromDate && fromDate[1]) || (inCopyright && (inCopyright[1] || inCopyright[2])) || '';
      return year ? '© ' + year + ' Haberlerver.com' : '© Haberlerver.com';
    }
    function cardHtml(item, sequenceNumber) {
      var sourceUrl = escapeHtml(item.sourceUrl);
      var sourceTitle = escapeHtml(item.sourceTitle);
      var src = escapeHtml(item.preview || item.src || '');
      var titleText = item.caption || item.sourceTitle || (mode === 'video' ? 'Video kaydı' : 'Görsel');
      var sourceLabel = item.sourceType === 'static' ? 'Statik sayfa:' : 'Makale başlığı:';
      var copyright = escapeHtml(copyrightWithYear(item));
      var creatorLine = item.creator ? '<br><b>Üretici:</b> ' + escapeHtml(item.creator) : '';
      var creditLine = item.credit ? '<br><b>Kaynak/Kredi:</b> ' + escapeHtml(item.credit) : '';
      var holderLine = item.copyrightHolder ? '<br><b>Hak sahibi:</b> ' + escapeHtml(item.copyrightHolder) : '';
      var digitalSourceLine = item.digitalSourceType ? '<br><b>Dijital kaynak türü:</b> ' + escapeHtml(item.digitalSourceType) : '';
      var previewHtml = src
        ? '<img src="' + src + '" alt="' + escapeHtml(titleText) + '" width="1200" height="675" loading="lazy" decoding="async">'
        : '<span class="gorsel-medya-yok">' + (mode === 'video' ? 'Video önizlemesi mevcut değil' : 'Görsel önizlemesi mevcut değil') + '</span>';
      var previewHref = item.mode === 'video' ? escapeHtml(item.playUrl || item.src || item.sourceUrl) : sourceUrl;
      var previewClass = item.mode === 'video' ? ' class="gorsel-video-onizleme-link"' : '';
      var playBadge = item.mode === 'video' ? '<span class="gorsel-video-oynat" aria-hidden="true"></span>' : '';
      var sourceContentLink = '<b>' + sourceLabel + '</b> <a href="' + sourceUrl + '" target="_blank" rel="noopener noreferrer">' + sourceTitle + '</a>';
      var licenseLink = '<b>Lisans Sayfası:</b> <a href="' + LICENSE_PAGE_URL + '" target="_blank" rel="noopener noreferrer">Haberlerver.com</a>';
      var extraLicenseUrl = item.licenseUrl && item.licenseUrl !== LICENSE_PAGE_URL
        ? '<br><b>Lisans kaynağı:</b> <a href="' + escapeHtml(item.licenseUrl) + '" target="_blank" rel="noopener noreferrer">Resmî lisans bilgisi</a>' : '';
      var typeName;
      if (item.mode === 'video') typeName = (VIDEO_INFO[item.kind] || VIDEO_INFO.video).label;
      else typeName = (IMAGE_INFO[item.kind] || IMAGE_INFO['unknown-static']).label;
      var mediaLabel = item.mode === 'video' ? 'Video türü:' : 'Görsel türü:';
      return '<article class="gorsel-card">' +
        '<span class="gorsel-sira-rozet" aria-label="Kayıt sıra numarası ' + String(sequenceNumber) + '">' + String(sequenceNumber) + '</span>' +
        '<a' + previewClass + ' href="' + previewHref + '" target="_blank" rel="noopener noreferrer" aria-label="' + escapeHtml(item.mode === 'video' ? 'Videoyu oynat: ' + titleText : sourceTitle + ' sayfasını aç') + '">' + previewHtml + playBadge + '</a>' +
        '<div class="gorsel-info">' + licenseLink + '<br>' + sourceContentLink +
        '<br><b>Lisans Tarihi:</b> ' + escapeHtml(item.date || 'Belirtilmedi') +
        '<br><b>Telif:</b> ' + copyright +
        '<br><b>Lisans Türü:</b> ' + escapeHtml(item.license || 'Lisans bilgisi belirtilmemiş') + extraLicenseUrl +
        '<br><b>Lisans Notu:</b> ' + escapeHtml(item.licenseNote || 'Lisans notu belirtilmedi.') +
        '<br><b>' + mediaLabel + '</b> ' + escapeHtml(typeName) + creatorLine + creditLine + holderLine + digitalSourceLine +
        (item.caption && item.caption !== item.sourceTitle ? '<br><b>Açıklama:</b> ' + escapeHtml(item.caption) : '') +
        '</div></article>';
    }
    function appendVisibleCards() {
      var target = Math.min(visibleCount, items.length);
      if (target <= renderedCount) return;
      var fragment = document.createDocumentFragment();
      for (var i = renderedCount; i < target; i++) {
        var wrap = document.createElement('div');
        wrap.innerHTML = cardHtml(items[i], i + 1);
        if (wrap.firstElementChild) fragment.appendChild(wrap.firstElementChild);
      }
      grid.appendChild(fragment);
      renderedCount = target;
    }
    function renderCounter() {
      if (!counterEl) return;
      var total = items.length;
      var scanText = scanFinished ? 'Tarama tamamlandı.' : 'Arşiv taranıyor; sayaç güncellendikçe yenilenir.';
      var html;
      if (mode === 'video') {
        html = '<b>Kaynak taraması:</b> Makale: ' + counts.postsScanned + ' · Statik sayfa: ' + counts.staticPagesScanned + '<br>' +
          '<b>Video sayıları:</b> Makale videosu: ' + counts.articleVideos + ' · Statik sayfa videosu: ' + counts.staticVideos + '<br>' +
          '<b>Toplam video kaydı: ' + total + '</b><br><span>' + scanText + (scanErrors ? ' Atlanan kayıt: ' + scanErrors + '.' : '') + '</span>';
      } else {
        html = '<b>Kaynak taraması:</b> Makale: ' + counts.postsScanned + ' · Statik sayfa: ' + counts.staticPagesScanned + ' · Tekil bayrak: ' + counts.flags + '<br>' +
          '<b>Görsel sayıları:</b> Makale görseli: ' + counts.articleImages + ' · Statik sayfa görseli: ' + counts.staticImages + ' · Yapay zekâ görseli: ' + counts.aiImages + ' · Diğer görsel: ' + counts.otherImages + ' · Bayrak: ' + counts.flags + '<br>' +
          '<b>Toplam tekil görsel: ' + total + '</b><br><span>' + scanText + (scanErrors ? ' Atlanan kayıt: ' + scanErrors + '.' : '') + '</span>';
      }
      counterEl.innerHTML = '<div class="gorsel-toplam-kutu">' + html + '</div>';
    }
    function renderStatus() {
      moreButton.hidden = !items.length || (!scanning && visibleCount >= items.length);
      moreButton.disabled = !scanning && visibleCount >= items.length;
      moreButton.textContent = '9 kayıt daha göster';
      if (scanning) {
        status.textContent = items.length < visibleCount ? 'Yeni kayıtlar taranıyor ve geldikçe gösteriliyor…' : 'Daha fazla kayıt için düğmeye basın. Arşiv taraması sürüyor.';
      } else if (scanFinished) {
        status.textContent = visibleCount >= items.length ? 'Tüm kayıtlar listelendi.' : 'Daha fazla kayıt için düğmeye basın.';
      } else {
        status.textContent = items.length ? 'Bazı kayıtlar alınamadı; bulunan kayıtlar listelendi.' : 'Kayıt bulunamadı veya arşiv akışı okunamadı.';
      }
    }
    function render() { appendVisibleCards(); renderCounter(); renderStatus(); }

    async function fetchFeedPage() {
      var url = '/feeds/posts/default?alt=json&max-results=' + PAGE_SIZE + '&start-index=' + nextStartIndex + '&orderby=updated';
      var response = await fetch(url, { credentials: 'same-origin', cache: 'default' });
      if (!response.ok) throw new Error('Blogger makale akışı HTTP ' + response.status);
      var data = await response.json();
      var feed = data && data.feed ? data.feed : {};
      var entries = !feed.entry ? [] : (Array.isArray(feed.entry) ? feed.entry : [feed.entry]);
      if (!entries.length) { postsFinished = true; return []; }
      nextStartIndex += entries.length;
      if (entries.length < PAGE_SIZE) postsFinished = true;
      return entries;
    }
    async function fetchStaticPageUrls() {
      var urls = [];
      var seen = Object.create(null);
      function addUrl(value, baseUrl) {
        var url = cleanPageUrl(value, baseUrl || window.location.href);
        /* V18: Lisans arşivinin açık olduğu mevcut statik sayfayı da say; yönetim/üyelik panelleri parse aşamasında hariç tutulur. */
        if (!url) return;
        var pathname = '';
        try { pathname = new URL(url).pathname; } catch (e) { return; }
        if (!/\/p\/[^/]+\.html?$/i.test(pathname) || seen[url]) return;
        seen[url] = true;
        urls.push(url);
      }
      async function readXmlSitemap(path) {
        var response = await fetch(path, { credentials: 'same-origin', cache: 'default' });
        if (!response.ok) throw new Error('Statik sayfa site haritası HTTP ' + response.status);
        var xmlText = await response.text();
        var xmlDoc = new DOMParser().parseFromString(xmlText, 'application/xml');
        if (xmlDoc.getElementsByTagName('parsererror').length) throw new Error('Statik sayfa site haritası XML olarak okunamadı');
        var locNodes = xmlDoc.getElementsByTagNameNS ? xmlDoc.getElementsByTagNameNS('*', 'loc') : xmlDoc.getElementsByTagName('loc');
        for (var i = 0; i < locNodes.length; i++) addUrl(locNodes[i].textContent, path);
      }
      try { await readXmlSitemap('/sitemap-pages.xml'); } catch (sitemapError) {}
      if (!urls.length) {
        try {
          var startIndex = 1;
          var pageLimit = 150;
          for (var pageNo = 0; pageNo < 10; pageNo++) {
            var feedUrl = '/feeds/pages/default?alt=json&max-results=' + pageLimit + '&start-index=' + startIndex;
            var feedResponse = await fetch(feedUrl, { credentials: 'same-origin', cache: 'default' });
            if (!feedResponse.ok) throw new Error('Blogger statik sayfa akışı HTTP ' + feedResponse.status);
            var feedData = await feedResponse.json();
            var feed = feedData && feedData.feed ? feedData.feed : {};
            var entries = !feed.entry ? [] : (Array.isArray(feed.entry) ? feed.entry : [feed.entry]);
            entries.forEach(function (entry) { addUrl(entryUrl(entry), window.location.href); });
            if (entries.length < pageLimit) break;
            startIndex += entries.length;
          }
        } catch (feedError) {}
      }
      try {
        var legacyResponse = await fetch('/sitemap-pages.html', { credentials: 'same-origin', cache: 'default' });
        if (legacyResponse.ok) {
          var legacyDoc = parseHtml(await legacyResponse.text());
          Array.prototype.forEach.call(legacyDoc.querySelectorAll('a[href*="/p/"]'), function (a) { addUrl(a.getAttribute('href'), window.location.origin + '/sitemap-pages.html'); });
        }
      } catch (legacyError) {}
      return urls;
    }
    function normalizePanelMatch(value) {
      return String(value || '').toLocaleLowerCase('tr-TR')
        .replace(/ı/g, 'i')
        .normalize('NFD').replace(/[\u0300-\u036f]/g, '')
        .replace(/[^a-z0-9]+/g, ' ').trim();
    }
    function isExcludedStaticPanel(url, doc) {
      var pathname = '';
      try { pathname = new URL(url).pathname; } catch (e) { return false; }
      var slug = normalizePanelMatch(pathname.replace(/\.html?$/i, '').split('/').pop());
      var panelSlugs = /^(?:paneli|admin paneli?|yonetim paneli?|uye paneli?|uyelik paneli?|kullanici paneli?|member panel|login panel|giris paneli?|uye girisi|uye ol giris yap|member login|login|uye giris)$/;
      if (panelSlugs.test(slug)) return true;
      var title = normalizePanelMatch(titleFromDoc(doc, ''));
      var hasPanelAction = /\b(?:panel|dashboard|giris|login|oturum ac)\b/.test(title);
      var identifiesPanelUser = /\b(?:admin|yonetim|uye|uyelik|kullanici|member|login|giris|oturum)\b/.test(title);
      if (hasPanelAction && identifiesPanelUser) return true;
      return /^(?:uye girisi|uye ol giris yap|admin paneli|yonetim paneli|uye paneli|uyelik paneli|kullanici paneli|member panel|login panel|giris paneli|oturum ac)$/.test(title);
    }
    async function parseStaticPage(url) {
      var key = cleanPageUrl(url, window.location.href);
      if (!key || seenStaticPages[key]) return null;
      seenStaticPages[key] = true;
      var response = await fetch(key, { credentials: 'same-origin', cache: 'default' });
      if (!response.ok) throw new Error('Statik sayfa HTTP ' + response.status);
      var doc = parseHtml(await response.text());
      /* V18: Yönetim ve üyelik panelleri medya arşivine katılmaz; iki lisans sayfası dahil tüm normal statik sayfalar sayılır. */
      if (isExcludedStaticPanel(key, doc)) return null;
      return extractPageMedia(doc, key, 'static', null, key);
    }
    async function scanAll() {
      scanning = true;
      render();
      try {
        while (!postsFinished) {
          var entries = await fetchFeedPage();
          if (!entries.length) break;
          for (var offset = 0; offset < entries.length; offset += BATCH_SIZE) {
            var batch = entries.slice(offset, offset + BATCH_SIZE);
            var results = await Promise.all(batch.map(function (entry) {
              return parsePost(entry).catch(function (err) { scanErrors++; console.warn('Medya lisans arşivi: makale okunamadı.', err); return null; });
            }));
            results.forEach(function (record) { if (record) commitPage(record); });
            render();
          }
        }
      } catch (err) {
        postsFinished = true;
        scanErrors++;
        console.error('Medya lisans arşivi: makale akışı okunamadı.', err);
      }
      try {
        var staticUrls = await fetchStaticPageUrls();
        for (var i = 0; i < staticUrls.length; i += STATIC_BATCH_SIZE) {
          var pageBatch = staticUrls.slice(i, i + STATIC_BATCH_SIZE);
          var pageResults = await Promise.all(pageBatch.map(function (url) {
            return parseStaticPage(url).catch(function (err) { scanErrors++; console.warn('Medya lisans arşivi: statik sayfa okunamadı.', url, err); return null; });
          }));
          pageResults.forEach(function (record) { if (record) commitPage(record); });
          render();
        }
      } catch (err) {
        scanErrors++;
        console.error('Medya lisans arşivi: statik sayfalar alınamadı.', err);
      }
      scanning = false;
      scanFinished = true;
      render();
    }
    moreButton.addEventListener('click', function () {
      if (!scanning && visibleCount >= items.length) return;
      visibleCount += STEP_SIZE;
      render();
    });
    if (counterEl) counterEl.innerHTML = '<div class="gorsel-toplam-kutu">' + (mode === 'video' ? 'Video arşivi hazırlanıyor…' : 'Görsel arşivi hazırlanıyor…') + '</div>';
    status.textContent = mode === 'video' ? 'Videolar taranıyor…' : 'Görseller taranıyor…';
    scanAll();
  }
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', initMediaLicenseArchive, { once: true });
  else initMediaLicenseArchive();
})();
//
  };

  /* Orijinal Blogger tema konumu: satir 35976 | hvjs-028 */
  parts["hvjs-028"] = function () {

//
{
"use strict";
const REMOVE_ALL    = false;    
const PRESERVE_HASH = true;    
const DEBUG         = false;   
const TARGET = [
"m",                   
"fbclid",              
"gclid",               
"msclkid",             
"twclid",              
"igshid",              
"yclid",               
"mc_eid",              
"si",                  
"ncid",                
"_ga","_gl",           
"utm_source","utm_medium","utm_campaign",
"utm_term","utm_content","utm_id",
"ref","referrer","source","share",
"action","tab","v"
];
const perf = (typeof performance !== "undefined")
? performance
: { now: () => Date.now() };
const dbg = (...args) => {
if (DEBUG && typeof console !== "undefined")
console.log("[URLCleaner]", ...args);
};
let _cleaning = false;
const clean = () => {
if (_cleaning) return;
const loc = window.location;
if (!loc.search) return;
const t0 = perf.now();
const orig = loc.href;
let qs = "";
if (REMOVE_ALL) {
qs = "";
dbg("Tüm query string siliniyor.");
} else {
const p = new URLSearchParams(loc.search);
const removed = [];
TARGET.forEach((k) => {
if (p.has(k)) { p.delete(k); removed.push(k); }
});
if (!removed.length) { dbg("Silinecek parametre yok."); return; }
dbg("Silindi:", removed.join(", "));
qs = p.toString() ? "?" + p.toString() : "";
}
const next = loc.protocol + "//" + loc.host + loc.pathname + qs +
(PRESERVE_HASH ? loc.hash : "");
if (next === orig) { dbg("URL zaten temiz."); return; }
try {
_cleaning = true;
window.history.replaceState(window.history.state, document.title, next);
dbg(`OK (${(perf.now() - t0).toFixed(2)}ms)`, orig, "\u2192", next);
} catch (e) {
dbg("replaceState hatası:", e);
} finally {
_cleaning = false;
}
};
const _push    = history.pushState;
const _replace = history.replaceState;
history.pushState = function(){
_push.apply(history, arguments);
clean();
};
history.replaceState = function(){
_replace.apply(history, arguments);
if (!_cleaning) clean();
};
window.addEventListener("popstate", clean);
if (document.readyState === "loading") {
document.addEventListener("DOMContentLoaded", clean);
} else {
clean();
}
}
//
  };

  /* Orijinal Blogger tema konumu: satir 36064 | hvjs-029 */
  parts["hvjs-029"] = function () {

//
{
const fixLabels = () => {
const selectors = '.b-label, .clean-label, .label-link, .query-info, .query-success';
document.querySelectorAll(selectors).forEach((el) => {
if (el.textContent.trim().charAt(0) === '_') {
el.textContent = el.textContent.replace(/_/g, '').trim();
}
});
document.querySelectorAll('.label-info-box p strong:first-child').forEach((el) => {
if (el.textContent.trim().charAt(0) === '_') {
el.textContent = el.textContent.replace(/_/g, '').trim();
}
});
};
document.addEventListener('DOMContentLoaded', () => {
setTimeout(fixLabels, 100);
setTimeout(fixLabels, 500);
setTimeout(fixLabels, 1000);
});
}
//
  };

  /* Orijinal Blogger tema konumu: satir 36091 | hvjs-030 */
  parts["hvjs-030"] = function () {

//
"use strict";
{
const PLACEHOLDER = "data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7";
const ILK_ONCELIKLI = 3;
const MAX_DENEME = 2;
const ZAMAN_ASIMI = 15000;
const tamUrl = (url) => {
const value = String(url || "").trim();
return value.startsWith("//") ? "https:" + value : value;
};
const blogImg = (url) => tamUrl(url);
const esc = (str) =>
String(str ?? "")
.replace(/&/g, "&amp;")
.replace(/</g, "&lt;")
.replace(/>/g, "&gt;")
.replace(/"/g, "&quot;")
      .replace(/'/g, "&#39;");
  /* ============ 2) STİLLER ============ */
  if (!document.getElementById("snip-lazy-style")) {
    const st = document.createElement("style");
    st.id = "snip-lazy-style";
    st.textContent = `
      img.snip-thumbnail:not([class*="author"]):not([class*="avatar"]):not([class*="profile"]){display:block!important;width:100%!important;height:auto!important;aspect-ratio:16/9;object-fit:cover!important;object-position:center!important;}
      img.author-avatar{visibility:visible!important;opacity:1!important;filter:none!important;transition:none!important;max-width:100%!important;height:auto!important;aspect-ratio:1/1!important;object-fit:cover!important;object-position:center!important;}
      figure{margin:0;padding:0;overflow:hidden;}
      .lazy-img{opacity:1!important;filter:none!important;transition:none!important;}
      /* Sonsuz yükleme açıkken de Blogger'ın gerçek sayfalama bağlantılarını erişilebilir ve görünür tut. */
      html.snip-inf #blog-pager,html.snip-inf .blog-pager,html.snip-inf #Blog1_blog-pager{position:static!important;display:flex!important;flex-flow:row nowrap!important;align-items:center!important;justify-content:space-between!important;gap:12px!important;width:100%!important;height:auto!important;min-height:44px!important;margin:16px 0 18px!important;padding:0!important;overflow:visible!important;clip:auto!important;white-space:normal!important;visibility:visible!important;opacity:1!important;}
      html.snip-inf #blog-pager .blog-pager-newer-link,html.snip-inf #blog-pager .blog-pager-older-link,html.snip-inf .blog-pager .blog-pager-newer-link,html.snip-inf .blog-pager .blog-pager-older-link,html.snip-inf #Blog1_blog-pager-newer-link,html.snip-inf #Blog1_blog-pager-older-link{position:relative!important;display:inline-flex!important;align-items:center!important;justify-content:center!important;width:auto!important;height:48px!important;min-width:164px!important;margin:0!important;padding:0 25px!important;overflow:visible!important;clip:auto!important;white-space:nowrap!important;visibility:visible!important;opacity:1!important;}
      html.snip-inf #blog-pager .blog-pager-newer-link,html.snip-inf .blog-pager .blog-pager-newer-link,html.snip-inf #Blog1_blog-pager-newer-link{margin-right:auto!important;margin-left:0!important;clip-path:polygon(0 50%,26px 0,100% 0,100% 100%,26px 100%)!important;}
      html.snip-inf #blog-pager .blog-pager-older-link,html.snip-inf .blog-pager .blog-pager-older-link,html.snip-inf #Blog1_blog-pager-older-link{margin-left:auto!important;margin-right:0!important;clip-path:polygon(0 0,calc(100% - 26px) 0,100% 50%,calc(100% - 26px) 100%,0 100%)!important;}
      @media screen and (max-width:767px){html.snip-inf #blog-pager.hv-pager-loadmore-row{position:static!important;inset:auto!important;top:auto!important;right:auto!important;bottom:auto!important;left:auto!important;z-index:auto!important;float:none!important;clear:both!important;display:grid!important;grid-template-columns:minmax(0,1fr) minmax(0,1fr)!important;align-items:center!important;justify-content:stretch!important;gap:8px!important;width:100%!important;height:auto!important;min-height:44px!important;margin:32px 0 24px!important;padding:0!important;transform:none!important;overflow:visible!important;}html.snip-inf #blog-pager.hv-pager-loadmore-row>#snip-load-more-btn,html.snip-inf #blog-pager.hv-pager-loadmore-row>.blog-pager-older-link{position:static!important;float:none!important;transform:none!important;width:100%!important;max-width:100%!important;min-width:0!important;}}
      @media screen and (max-width:480px){html.snip-inf #blog-pager,html.snip-inf .blog-pager,html.snip-inf #Blog1_blog-pager{gap:8px!important;}html.snip-inf #blog-pager .blog-pager-newer-link,html.snip-inf #blog-pager .blog-pager-older-link,html.snip-inf .blog-pager .blog-pager-newer-link,html.snip-inf .blog-pager .blog-pager-older-link,html.snip-inf #Blog1_blog-pager-newer-link,html.snip-inf #Blog1_blog-pager-older-link{flex:0 1 calc(50% - 4px)!important;width:calc(50% - 4px)!important;max-width:calc(50% - 4px)!important;min-width:0!important;height:44px!important;padding:0 19px!important;white-space:nowrap!important;}html.snip-inf #blog-pager .blog-pager-newer-link,html.snip-inf .blog-pager .blog-pager-newer-link,html.snip-inf #Blog1_blog-pager-newer-link{clip-path:polygon(0 50%,21px 0,100% 0,100% 100%,21px 100%)!important;}html.snip-inf #blog-pager .blog-pager-older-link,html.snip-inf .blog-pager .blog-pager-older-link,html.snip-inf #Blog1_blog-pager-older-link{clip-path:polygon(0 0,calc(100% - 21px) 0,100% 50%,calc(100% - 21px) 100%,0 100%)!important;}}
      html.snip-inf .pager,html.snip-inf .pager-text,html.snip-inf .showpageNum,html.snip-inf .showpageOf,html.snip-inf .showpage,html.snip-inf .load-more,html.snip-inf #load-more,html.snip-inf .loadmore,html.snip-inf #loadmore,html.snip-inf .infinite-btn,html.snip-inf [data-page-token]{position:absolute!important;width:1px!important;height:1px!important;margin:-1px!important;padding:0!important;overflow:hidden!important;clip:rect(0 0 0 0)!important;white-space:nowrap!important;border:0!important;}
    `;
    document.head.appendChild(st);
  }
  /* ============ 3) YAZAR AVATARI ============ */
  // Avatar bir kart görseli değildir. Bu fonksiyon avatarın src, srcset, boyut veya
  // yükleme özniteliklerine dokunmaz; yalnızca kart görseli sınıfını kaldırır ki
  // şablondaki snip-thumbnail stilleri avatara uygulanmasın. Avatar yine de
  // display:none ile gizlenmişse (yalnızca o durumda) görünür yapılır.
  const avatarlariHazirla = () => {
    document.querySelectorAll("img.author-avatar").forEach((img) => {
      img.classList.remove("snip-thumbnail");
      if (getComputedStyle(img).display === "none") {
        img.style.setProperty("display", "inline-block", "important");
      }
    });
  };
  /* ============ 4) GÖRSEL TEMBEL YÜKLEME (lazy load) ============ */
  // Bu alanlardaki görseller hiçbir zaman değiştirilmez
  const HARIC_ALAN =
    ".author-avatar, [class*='author'], [class*='avatar'], [class*='profile'], " +
    "#haber-portali-ana, #comments, .comments";
  const kartGorseliMi = (img) => {
    const ust = img.closest(HARIC_ALAN);
    return !ust || ust === document.body || ust === document.documentElement;
  };
  const loadImage = (img, oncelik) => {
    if (img.dataset.loaded) return;
    const src = img.dataset.src || img.getAttribute("src");
    if (!src || src.startsWith("data:")) return;
    // Yalnızca haber kartı küçük resimleri için 16:9 responsive varyant üret; avatar/logo/makale görseline dokunma.
    const finalSrc = blogImg(src);
    if (/blogger\.googleusercontent\.com\/img\//i.test(finalSrc) && img.classList.contains('snip-thumbnail') && !img.matches('.author-avatar,[class*=author],[class*=avatar],[class*=profile]')) {
      const variant = (url, width) => {
        const w = Math.max(320,Math.min(1200,Number(width)||480));
        const h = Math.round(w*9/16);
        return url.replace(/\/(?:s\d+(?:-[a-z0-9]+)*|w\d+(?:-[a-z0-9]+)*)\//i,'/w'+w+'-c-h'+h+'/');
      };
      const candidates = [320,480,640,800,960,1200].map((w)=>variant(finalSrc,w)+' '+w+'w').join(', ');
      img.setAttribute('srcset',candidates);
      img.setAttribute('sizes','(max-width:767px) 46vw, (max-width:1023px) 30vw, 360px');
      img.src = variant(finalSrc,480);
    } else { img.src = finalSrc; }
    img.decoding = "async";
    img.loading = oncelik === "high" ? "eager" : "lazy";
    img.fetchPriority = oncelik === "high" ? "high" : "auto";
    img.classList.add("lazy-img");
    img.dataset.loaded = "true";
  };
  const imgObserver = ("IntersectionObserver" in window)
    ? new IntersectionObserver((entries, obs) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;
          loadImage(entry.target, "lazy");
          obs.unobserve(entry.target);
        });
      }, { rootMargin: "300px", threshold: 0 })
    : null;
  const observeImg = (img) => {
    if (!img || img.dataset.loaded) return;
    if (imgObserver) imgObserver.observe(img);
    else loadImage(img, "lazy");
  };
  // Sayfada zaten çizili kart görselleri
  const initImages = () => {
    const images = [...document.querySelectorAll("img.snip-thumbnail")].filter(kartGorseliMi);
    images.forEach((img, i) => {
      if (i < ILK_ONCELIKLI) loadImage(img, "high");
      else observeImg(img);
    });
  };
  const baslat = () => {
    avatarlariHazirla();
    initImages();
  };
  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", baslat);
  } else {
    baslat();
  }
  /* ============ 5) SONSUZ YÜKLEME (yalnızca ana sayfa) ============ */
  const loc = window.location.href;
  const pathname = window.location.pathname;
  const aramaSorgusu = new URLSearchParams(window.location.search).get("q") || "";
  const isHomepageListing = pathname === "/";
  const isLabelListing = pathname.includes("/search/label/");
  // Sonsuz yükleme yalnızca ana sayfada aktiftir.
  const isListing = isHomepageListing;
  if (isListing) {
    // Etiket sayfalarında Blogger'ın ilk HTML'de oluşturduğu bütün haber kartları korunur.
    // Devam yüklemeleri mevcut davranış gibi 9'lu gruplar halinde sürer.
    const postsPerLoad = isLabelListing ? 9 : (isHomepageListing ? 9 : 30);
    const manualPostsPerLoad = 9;
    const safeDecode = (s) => {
      try { return decodeURIComponent(s); } catch (e) { return s; }
    };
    const etiket = loc.includes("/search/label/")
      ? safeDecode(loc.split("/search/label/")[1].split(/[?#]/)[0])
      : "";
    // Kartların devam yüklemesinde tam makale gövdesi yerine hafif özet feed'ini kullan.
    // Bu akış kartlarda kullanılan başlık, bağlantı, yayın tarihi ve küçük görseli sağlar.
    const feedYolu = etiket
      ? `/feeds/posts/summary/-/${encodeURIComponent(etiket)}`
      : "/feeds/posts/summary";
    const ekSorgu = aramaSorgusu ? `&q=${encodeURIComponent(aramaSorgusu)}` : "";
    const seenKeys = new Set();
    const postKey = (u) => {
      try { return new URL(u, location.href).pathname; } catch (e) { return ""; }
    };
    const getContainer = () => {
      const root = document.querySelector("#Blog1 .post-filter-wrap .grid-posts")
        || document.querySelector("#Blog1 .blog-posts .grid-posts")
        || document.querySelector("#Blog1 .grid-posts")
        || null;
      if (root) root.classList.add("hv-infinite-grid");
      return root;
    };
    // Ana sayfadaki özellik alanı 12 slider + 4 kart olmak üzere 16 kayıttır.
    // Sonsuz yükleme bu ilk 16 kaydın ardından 17. yayından başlar.
    let homepageSourceCount = 15;
    const homepageInitialGridCount = 9;
    const trimInitialPosts = (container) => {
      const root = container || getContainer();
      if (!root) return 0;
      const cards = Array.from(root.querySelectorAll(":scope > article.blog-post.post-filter")).filter((card) => {
        if (card.closest("#haber-portali-ana")) return false;
        return !!card.querySelector(".entry-title a[href],h1 a[href],h2 a[href],h3 a[href],a[rel~='bookmark'][href]");
      });
      if (isHomepageListing && cards.length) homepageSourceCount = Math.min(cards.length, 15);
      const keep = isHomepageListing ? homepageSourceCount : (isLabelListing ? cards.length : postsPerLoad);
      if (!isLabelListing) cards.slice(keep).forEach((card) => card.remove());
      return Math.min(cards.length, keep);
    };
    // Ana sayfada slider ve dört kartta zaten gösterilen ilk 16 kaydın Blog1 kopyalarını kaldır.
    // Hiçbir makale bağlantısı gizli bir kaynak alana taşınmaz.
    const removeHomepageFeaturedDuplicates = (container, entries) => {
      if (!isHomepageListing || !container || container.dataset.hvHomepageFeaturedRemoved === "1") return;
      const featuredKeys = new Set();
      (Array.isArray(entries) ? entries : []).slice(0, 15).forEach((entry) => {
        const alt = (entry.link || []).find((link) => link.rel === "alternate");
        const key = alt && alt.href ? postKey(alt.href) : "";
        if (key) featuredKeys.add(key);
      });
      if (!featuredKeys.size) return;
      const schemaSourceCards = window.HVHomeSchemaSourceCards || (window.HVHomeSchemaSourceCards = []);
      Array.from(container.querySelectorAll(":scope > article.blog-post.post-filter")).forEach((card) => {
        const anchor = card.querySelector(".entry-title a[href],h1 a[href],h2 a[href],h3 a[href],a[rel~='bookmark'][href]");
        const key = anchor ? postKey(anchor.href) : "";
        if (key && featuredKeys.has(key)) {
          if (schemaSourceCards.indexOf(card) === -1) schemaSourceCards.push(card);
          card.remove();
        }
      });
      container.dataset.hvHomepageFeaturedRemoved = "1";
    };
    const scopeAnchorPaths = () => {
      const root = getContainer() || document;
      const set = new Set();
      root.querySelectorAll(":scope > article.blog-post.post-filter").forEach((card) => {
        if (card.closest("#haber-portali-ana")) return;
        const a = card.querySelector(".entry-title a[href],h1 a[href],h2 a[href],h3 a[href],a[rel~='bookmark'][href]");
        if (!a) return;
        const k = postKey(a.href);
        if (k) set.add(k);
      });
      return set;
    };
    // Blogger'ın ilk çizdiği yazılarda yalnızca yazının kendi bağlantıları yeni sekmede açılır
    const yeniSekmeyeAl = (scope) => {
      const root = scope || document;
      root.querySelectorAll("article.blog-post, .blog-post, .post-outer, .hentry, .post-filter").forEach((yazi) => {
        if (yazi.dataset.yeniSekme === "1") return;
        if (yazi.closest("#haber-portali-ana")) return;
        yazi.dataset.yeniSekme = "1";
        const baslik = yazi.querySelector("h1 a[href], h2 a[href], h3 a[href], .entry-title a[href], a[rel~='bookmark'][href]");
        if (!baslik) return;
        const anahtar = postKey(baslik.href);
        if (!anahtar) return;
        yazi.querySelectorAll("a[href]").forEach((a) => {
          if (a.hash || postKey(a.href) !== anahtar) return;
          const kurallar = (a.getAttribute("rel") || "").split(/\s+/).filter((t) => t && t !== "nofollow");
          if (!kurallar.includes("noopener")) kurallar.push("noopener");
          a.setAttribute("target", "_blank");
          a.setAttribute("rel", kurallar.join(" "));
        });
      });
    };
    // Hafif özet feed'indeki görseli önce media$thumbnail alanından alırız.
    // Bu alan yoksa özet HTML'inden ilk görsel URL'sini regex ile çıkarırız;
    // tam içerik/content alanı ve DOMParser ile HTML ağacı oluşturmak gerekmez.
    const getThumbBase = (entry) => {
      const feedThumb = entry.media$thumbnail?.url || "";
      if (feedThumb) return feedThumb;
      const summary = String(entry.summary?.$t || "");
      if (!summary) return "";
      const srcsetMatch = summary.match(/\bsrcset\s*=\s*["']([^"']+)["']/i);
      if (srcsetMatch) {
        const candidates = srcsetMatch[1].split(",").map((part) => {
          const pair = part.trim().split(/\s+/);
          return { url: pair[0], width: pair[1] && /w$/.test(pair[1]) ? parseInt(pair[1], 10) || 0 : 0 };
        }).filter((item) => /^(https?:|\/\/)/i.test(item.url));
        candidates.sort((a, b) => b.width - a.width);
        if (candidates.length) return candidates[0].url;
      }
      const srcMatch = summary.match(/\b(?:src|data-src)\s*=\s*["']([^"']+)["']/i);
      return srcMatch ? srcMatch[1] : "";
    };
    // Feed başlangıç indeksi, Blog1'in gösterdiği yayın adedinden hesaplanır.
    // Böylece etiket/arama sayfalarında 100 kaydı tarayan fazladan istek yapılmaz.
    // Durum değişkenleri
    let detecting = true;
    let isLoading = false;
    let noMore = false;
    let totalPosts = 999999;
    let existingPosts = 0;
    let shownCount = 0;
    let startIndex = 1;
    let loadMoreBtn = null;
    let loadMorePager = null;
    let homepageInitialFillPending = false;
    let homepageInitialAdded = 0;
    const loader = document.createElement("div");
    // Yükleme mesajı grid'in normal akışında yer alır; kartların üzerine bindirilmez.
    loader.style.cssText = "position:relative;float:none;clear:both;width:100%;box-sizing:border-box;text-align:center;padding:20px 0 24px;margin:0;font-size:14px;line-height:1.5;color:#999;display:none;";
    loader.textContent = "Yükleniyor...";
    const pageriListeSonunaAl = () => {
      // Pager masaüstü ve mobilde haber listesinin ardından normal belge akışında kalır.
      const pager = loadMorePager || document.querySelector("#blog-pager");
      const container = getContainer();
      const postsWrap = container && container.closest(".blog-posts");
      if (!pager || !pager.isConnected || !postsWrap || !postsWrap.parentNode) return;
      const parent = postsWrap.parentNode;
      const legacyPager = parent.querySelector("#blog-pager-ok");
      if (legacyPager && legacyPager.parentNode === parent) {
        if (pager.parentNode !== parent || legacyPager.nextElementSibling !== pager) {
          parent.insertBefore(pager, legacyPager.nextSibling);
        }
      } else if (pager.parentNode !== parent || postsWrap.nextElementSibling !== pager) {
        parent.insertBefore(pager, postsWrap.nextSibling);
      }
    };
    const setLoadMoreButtonVisible = (visible) => {
      if (!loadMoreBtn) return;
      if (visible) pageriListeSonunaAl();
      // Ana sayfada görünür sayfalama düğmesi için boşluğu blog-posts sarmalayıcısında etkinleştir.
      if (isHomepageListing) {
        const homeGrid = getContainer();
        const homePostsWrap = homeGrid && homeGrid.closest(".blog-posts");
        if (homePostsWrap) homePostsWrap.classList.toggle("hv-home-infinite-pager-gap", !!visible);
      }
      // İstek boyunca düğmeyi hem görsel hem metinsel olarak kaldır; mobilde
      // tema stilleri devreye girse bile yazı yeni haberlerin üzerinde kalamaz.
      loadMoreBtn.textContent = visible ? "Daha Fazla Göster" : "";
      loadMoreBtn.hidden = !visible;
      loadMoreBtn.style.setProperty("display", visible ? "inline-flex" : "none", "important");
      loadMoreBtn.disabled = !visible;
      loadMoreBtn.setAttribute("aria-hidden", visible ? "false" : "true");
      if (loadMorePager && loadMorePager.isConnected) {
        loadMorePager.classList.toggle("hv-pager-loadmore-row", !!visible);
      }
    };
    const createLoadMoreButton = () => {
      if (loadMoreBtn) return;
      loadMoreBtn = document.createElement("button");
      loadMoreBtn.type = "button";
      loadMoreBtn.id = "snip-load-more-btn";
      loadMoreBtn.className = "hv-load-more-arrow";
      loadMoreBtn.textContent = "Daha Fazla Göster";
      loadMoreBtn.style.cssText = "display:none;margin:0;padding:0;background:#111;color:#fff;border:0;border-radius:0;cursor:pointer;font-family:inherit;font-size:14px;font-weight:700;line-height:1;box-shadow:none;";
      loadMoreBtn.addEventListener("click", () => {
        setLoadMoreButtonVisible(false);
        loadMore();
      });
      const container = getContainer();
      const pager = document.querySelector("#blog-pager");
      const olderLink = pager && pager.querySelector(".blog-pager-older-link");
      const newerLink = pager && pager.querySelector(".blog-pager-newer-link");
      // Sayfalama bağlantıları varsa yükleme düğmesi de aynı pager içinde tutulur.
      // İki yön bağlantısı birlikteyse düğme üst satıra, gezinme bağlantıları alt satıra alınır.
      if (pager && (olderLink || newerLink)) {
        loadMorePager = pager;
        if (olderLink && newerLink) pager.classList.add("hv-pager-has-two-nav");
        if (isLabelListing) pager.classList.add("hv-pager-label-two-nav");
        if (newerLink) pager.insertBefore(loadMoreBtn, newerLink);
        else pager.insertBefore(loadMoreBtn, olderLink);
      } else if (container && container.parentNode) {
        const postsWrap = container.closest(".blog-posts");
        if (postsWrap && postsWrap.parentNode) postsWrap.parentNode.insertBefore(loadMoreBtn, postsWrap.nextSibling);
        else container.parentNode.insertBefore(loadMoreBtn, container.nextSibling);
      } else {
        document.body.appendChild(loadMoreBtn);
      }
    };
    // Yazıları kart olarak ekler (metinler HTML'e güvenle yazılır)
    const appendPosts = (entries) => {
      const container = getContainer();
      if (!container) return 0;
      const frag = document.createDocumentFragment();
      const yeniGorseller = [];
      let added = 0;
      entries.forEach((e) => {
        const title = e.title ? e.title.$t : "";
        let postUrl = "";
        (e.link || []).forEach((l) => {
          if (l.rel === "alternate") postUrl = l.href;
        });
        const key = postKey(postUrl);
        if (key) {
          if (seenKeys.has(key)) return;
          seenKeys.add(key);
        }
        added++;
        const thumb = getThumbBase(e);
        const datetime = e.published ? e.published.$t : "";
        const dateShow = datetime ? datetime.substring(0, 10) : "";
        const article = document.createElement("article");
        article.className = "blog-post hentry post-filter";
        article.innerHTML = `
<div class="post-filter-inside-wrap" data-nosnippet>
<div class="post-filter-image">
              ${thumb
                ? `<a class="post-filter-link background-layer image-nos" aria-label="${esc(title || 'Haberi aç')}" title="${esc(title || 'Haberi aç')}" href="${esc(postUrl)}" target="_blank" rel="noopener">
<img class="snip-thumbnail" data-src="${esc(thumb)}" src="${PLACEHOLDER}"
                          alt="${esc(title || 'Haber görseli')}" width="720" height="405" loading="lazy" decoding="async">
</a>`
                : ""}
</div>
<div class="featured-meta">
<h2 class="entry-title vcard">
<a href="${esc(postUrl)}" aria-label="${esc(title || 'Haberi aç')}" title="${esc(title || 'Haberi aç')}" target="_blank" rel="bookmark noopener">
<span itemprop="name">${esc(title || 'Başlıksız haber')}</span>
</a>
</h2>
<div class="post-snip flex">
<span class="post-date published" datetime="${esc(datetime)}">${esc(dateShow)}</span>
</div>
</div>
</div>
        `;
        frag.appendChild(article);
        const img = article.querySelector("img.snip-thumbnail");
        if (img) yeniGorseller.push(img);
      });
      container.appendChild(frag);
      yeniGorseller.forEach((img) => observeImg(img));
      return added;
    };
    const bitti = () => {
      noMore = true;
      if (isHomepageListing) {
        const homeGrid = getContainer();
        const homePostsWrap = homeGrid && homeGrid.closest(".blog-posts");
        if (homePostsWrap) homePostsWrap.classList.remove("hv-home-infinite-pager-gap");
      }
      const sayi = totalPosts < 999999 ? totalPosts : shownCount;
      loader.style.display = "block";
      loader.textContent = `Tüm ${sayi} yayın yüklendi.`;
      if (loadMoreBtn) {
        loadMoreBtn.remove();
        if (loadMorePager) loadMorePager.classList.remove("hv-pager-loadmore-row", "hv-pager-has-two-nav", "hv-pager-label-two-nav");
        loadMoreBtn = null;
        loadMorePager = null;
      }
    };
    // Hata durumunda sonsuz yükleme kapanır, Blogger'ın sayfalaması geri gelir
    const pagerYedeginiGoster = () => {
      isLoading = false;
      loader.style.display = "none";
      setLoadMoreButtonVisible(false);
      document.documentElement.classList.remove("snip-inf");
    };
    // Aynı alan adındaki hafif Blogger özet feed'ini normal JSON olarak ister.
    // JSONP callback'i, rastgele cache-buster parametresi ve ek script etiketi kullanılmaz.
    const feedIste = (paramlar, geriCagri, deneme = 0) => {
      const controller = new AbortController();
      const zaman = setTimeout(() => controller.abort(), ZAMAN_ASIMI);
      const url = `${feedYolu}?alt=json&${paramlar}${ekSorgu}`;
      fetch(url, {
        credentials: "same-origin",
        cache: "default",
        signal: controller.signal
      })
        .then((response) => {
          if (!response.ok) throw new Error("HTTP " + response.status);
          return response.json();
        })
        .then((json) => {
          clearTimeout(zaman);
          geriCagri(json);
        })
        .catch(() => {
          clearTimeout(zaman);
          if (deneme < MAX_DENEME) {
            setTimeout(() => feedIste(paramlar, geriCagri, deneme + 1), 1000 * (deneme + 1));
          } else {
            pagerYedeginiGoster();
          }
        });
    };
    // Toplam yayın sayısı zaten her feed yanıtında bulunur; başlangıçta ayrı bir
    // max-results=1 isteği yapmayarak ekstra ağ isteğini kaldırıyoruz.
    const infGeriCagri = (json, requestedCount) => {
      isLoading = false;
      loader.style.display = "none";
      const totalFromResponse = parseInt(json?.feed?.openSearch$totalResults?.$t, 10);
      if (Number.isFinite(totalFromResponse) && totalFromResponse >= 0) totalPosts = totalFromResponse;
      const entries = json?.feed?.entry ?? [];
      if (!entries.length) {
        homepageInitialFillPending = false;
        bitti();
        return;
      }
      startIndex += entries.length;
      const addedNow = appendPosts(entries);
      shownCount += addedNow;
      if (homepageInitialFillPending) {
        homepageInitialAdded += addedNow;
        if (homepageInitialAdded < homepageInitialGridCount &&
            entries.length === requestedCount && startIndex <= totalPosts) {
          isLoading = true;
          loader.style.display = "block";
          const remainingInitial = Math.max(1, homepageInitialGridCount - homepageInitialAdded);
          const nextInitialBatch = Math.min(postsPerLoad, remainingInitial);
          feedIste(`start-index=${startIndex}&max-results=${nextInitialBatch}`,
            (nextJson) => infGeriCagri(nextJson, nextInitialBatch));
          return;
        }
        homepageInitialFillPending = false;
      }
      if (shownCount >= totalPosts || startIndex > totalPosts || entries.length < requestedCount) {
        bitti();
        return;
      }
      createLoadMoreButton();
      setLoadMoreButtonVisible(true);
    };
    const loadMore = () => {
      setLoadMoreButtonVisible(false);
      if (detecting || isLoading || noMore) return;
      if (shownCount >= totalPosts) {
        bitti();
        return;
      }
      isLoading = true;
      loader.style.display = "block";
      // Ana sayfa ve devam yüklemeleri üç sütunlu ızgarayı tamamlamak için 9'lu gruplar halinde yüklenir.
      const requestCount = homepageInitialFillPending
        ? Math.min(postsPerLoad, Math.max(1, homepageInitialGridCount - homepageInitialAdded))
        : manualPostsPerLoad;
      feedIste(`start-index=${startIndex}&max-results=${requestCount}`,
        (json) => infGeriCagri(json, requestCount));
    };
    const initScroll = () => {
      const c = getContainer();
      if (!c) return; // Yazı alanı yoksa sayfalama olduğu gibi kalır
      const initialCount = trimInitialPosts(c);
      yeniSekmeyeAl(c);
      const shown = scopeAnchorPaths();
      shown.forEach((k) => seenKeys.add(k));
      if (isHomepageListing) {
        const heroEntries = Array.isArray(window.HVHomeFeedEntries) ? window.HVHomeFeedEntries : [];
        heroEntries.forEach((entry) => {
          const alt = (entry.link || []).find((link) => link.rel === "alternate");
          if (alt) {
            const key = postKey(alt.href);
            if (key) seenKeys.add(key);
          }
        });
        // Slider verisi hazırsa yinelenen Blog1 kopyalarını kaldır; henüz hazır değilse
        // sliderın yayınladığı olayı bekle. Feed/slider çalışmazsa özgün Blog1 kartları kalır.
        if (Array.isArray(window.HVHomeFeedEntries)) {
          removeHomepageFeaturedDuplicates(c, window.HVHomeFeedEntries);
        } else {
          window.addEventListener("hv-home-feed-ready", function onHomeFeedReady(event) {
            removeHomepageFeaturedDuplicates(c, event.detail || window.HVHomeFeedEntries || []);
          }, { once: true });
        }
      }
      existingPosts = initialCount;
      shownCount = isHomepageListing ? homepageSourceCount : initialCount;
      document.documentElement.classList.add("snip-inf");
      c.parentNode.insertBefore(loader, c.nextSibling);
      // Blog1'in render ettiği sayının hemen ardından devam et; ek feed taraması yapma.
      startIndex = (isHomepageListing ? homepageSourceCount : initialCount) + 1;
      existingPosts = initialCount;
      shownCount = isHomepageListing ? homepageSourceCount : initialCount;
      detecting = false;
      if (isHomepageListing) {
        homepageInitialFillPending = true;
        homepageInitialAdded = 0;
        const beginHomepageFill = () => {
          const runWhenIdle = () => {
            if (document.visibilityState === "hidden") {
              document.addEventListener("visibilitychange", function onVisible() {
                if (document.visibilityState !== "visible") return;
                document.removeEventListener("visibilitychange", onVisible);
                runWhenIdle();
              });
              return;
            }
            if ("requestIdleCallback" in window) {
              window.requestIdleCallback(() => loadMore(), { timeout: 1800 });
            } else {
              setTimeout(() => loadMore(), 700);
            }
          };
          // Kategori modülleri uzun sayfa oluşturduğu için son haber feed'ini sayfa açılır açılmaz isteme.
          // Blog1 alanı yaklaşınca ilk 9 haberi al; IntersectionObserver yoksa güvenli gecikmeli geri dönüş kullan.
          if ("IntersectionObserver" in window) {
            let started = false;
            const observer = new IntersectionObserver((entries) => {
              if (started || !entries.some((entry) => entry.isIntersecting)) return;
              started = true;
              observer.disconnect();
              runWhenIdle();
            }, { rootMargin: "700px 0px" });
            observer.observe(c);
          } else {
            setTimeout(runWhenIdle, 1800);
          }
        };
        if (document.readyState === "complete") beginHomepageFill();
        else window.addEventListener("load", beginHomepageFill, { once: true });
      } else {
        createLoadMoreButton();
        setLoadMoreButtonVisible(true);
      }
    };
    // DOM'a erken müdahale ederek Blog1 ayarında belirlenen başlangıç kayıtlarının dışındaki gereksiz ilk yükleri azaltır.
    const earlyContainer = getContainer();
    if (earlyContainer) trimInitialPosts(earlyContainer);
    if (document.readyState === "loading") {
      document.addEventListener("DOMContentLoaded", initScroll);
    } else {
      initScroll();
    }
  }
}
//
  };

  /* Orijinal Blogger tema konumu: satir 36670 | hvjs-031 */
  parts["hvjs-031"] = function () {

//
(function () {
'use strict';
var HV_RELOAD = {
limit: 180000,
check: 5000,
grace: 10000,
cooldown: 15000,
throttle: 600,
key: 'hv_smart_reload_v5'
};
var started = Date.now();
var lastActivity = started;
var lastRecorded = 0;
var timer = null;
var reloading = false;
function getLastReload() {
try {
var value = Number(
sessionStorage.getItem(
HV_RELOAD.key
)
);
return Number.isFinite(value)
? value
: 0;
} catch (e) {
return 0;
}
}
function setLastReload() {
try {
sessionStorage.setItem(
HV_RELOAD.key,
String(Date.now())
);
} catch (e) {}
}
function reloadCooldownPassed() {
var last = getLastReload();
return (
!last ||
Date.now() - last >=
HV_RELOAD.cooldown
);
}
function isInteractive(element) {
if (
!element ||
!(element instanceof Element)
) {
return false;
}
var tag = element.tagName;
return (
tag === 'INPUT' ||
tag === 'TEXTAREA' ||
tag === 'SELECT' ||
element.isContentEditable ||
!!element.closest(
'input,textarea,select,[contenteditable="true"]'
)
);
}
function isEditing() {
return isInteractive(
document.activeElement
);
}
function isMediaPlaying() {
try {
var media =
document.querySelectorAll(
'video,audio'
);
for (
var i = 0;
i < media.length;
i++
) {
var item = media[i];
if (
!item.paused &&
!item.ended &&
item.readyState >= 2
) {
return true;
}
}
} catch (e) {}
return false;
}
function hasSelection() {
try {
var selection =
window.getSelection();
return !!(
selection &&
selection.toString().trim()
);
} catch (e) {
return false;
}
}
function activity(event) {
var now = Date.now();
if (
event &&
isInteractive(event.target)
) {
lastActivity = now;
schedule();
return;
}
if (
now - lastRecorded <
HV_RELOAD.throttle
) {
return;
}
lastRecorded = now;
lastActivity = now;
schedule();
}
var events = [
'pointerdown',
'pointermove',
'touchstart',
'touchmove',
'scroll',
'keydown',
'input',
'change',
'focusin',
'selectionchange'
];
for (
var i = 0;
i < events.length;
i++
) {
var eventName = events[i];
document.addEventListener(
eventName,
activity,
{
passive:
eventName === 'pointermove' ||
eventName === 'touchmove' ||
eventName === 'scroll'
}
);
}
document.addEventListener(
'visibilitychange',
function () {
schedule();
},
{
passive: true
}
);
window.addEventListener(
'pageshow',
schedule,
{
passive: true
}
);
window.addEventListener(
'resume',
schedule,
{
passive: true
}
);
window.addEventListener(
'online',
schedule,
{
passive: true
}
);
window.addEventListener(
'offline',
schedule,
{
passive: true
}
);
window.addEventListener(
'pagehide',
function () {},
{
passive: true
}
);
window.addEventListener(
'freeze',
function () {},
{
passive: true
}
);
function canReload() {
if (
navigator.onLine === false
) {
return false;
}
if (
isEditing()
) {
return false;
}
if (
isMediaPlaying()
) {
return false;
}
if (
hasSelection()
) {
return false;
}
return true;
}
function shouldReload() {
if (
Date.now() - started <
HV_RELOAD.grace
) {
return false;
}
if (
reloading
) {
return false;
}
if (
!reloadCooldownPassed()
) {
return false;
}
if (
Date.now() - lastActivity <
HV_RELOAD.limit
) {
return false;
}
if (
!canReload()
) {
return false;
}
return true;
}
function performReload() {
if (
!shouldReload()
) {
schedule();
return;
}
if (
Date.now() - lastActivity <
HV_RELOAD.limit
) {
schedule();
return;
}
reloading = true;
setLastReload();
window.location.reload();
}
function schedule() {
if (
timer !== null
) {
clearTimeout(timer);
timer = null;
}
var elapsed =
Date.now() - lastActivity;
var remaining =
HV_RELOAD.limit - elapsed;
if (
remaining <= 0
) {
timer = setTimeout(
performReload,
0
);
return;
}
timer = setTimeout(
performReload,
Math.min(
remaining,
HV_RELOAD.check
)
);
}
schedule();
})();
//
  };

  /* Orijinal Blogger tema konumu: satir 36982 | hvjs-032 */
  parts["hvjs-032"] = function () {

//
(function () {
'use strict';
if (window.__aiVideoSliderBaslatildi) {
return;
}
window.__aiVideoSliderBaslatildi = true;
const aylar = [
'Ocak', 'Şubat', 'Mart', 'Nisan', 'Mayıs', 'Haziran',
'Temmuz', 'Ağustos', 'Eylül', 'Ekim', 'Kasım', 'Aralık'
];
function tarihFormatla(tarihStr) {
if (!tarihStr) return '';
const temiz = String(tarihStr).trim();
const eslesme = temiz.match(/^(\d{4})-(\d{2})-(\d{2})/);
if (eslesme) {
const yil = parseInt(eslesme[1], 10);
const ay = parseInt(eslesme[2], 10);
const gun = parseInt(eslesme[3], 10);
if (yil && ay >= 1 && ay <= 12 && gun >= 1 && gun <= 31) {
return gun + ' ' + aylar[ay - 1] + ' ' + yil;
}
}
const d = new Date(temiz);
if (isNaN(d.getTime())) return '';
return d.getDate() + ' ' + aylar[d.getMonth()] + ' ' + d.getFullYear();
}
function h1Bul(header) {
const h1 = header.querySelector('h1');
if (!h1) return '';
return h1.textContent.replace(/\s+/g, ' ').trim();
}
function imageBasligiBul(header, image) {
if (image) {
const title = (image.getAttribute('title') || '').trim();
if (title) return title;
const alt = (image.getAttribute('alt') || '').trim();
if (alt) return alt;
}
return h1Bul(header) || 'Haber';
}
function videoBasligiBul(header, video) {
if (video) {
const dataVideoTitle = (video.getAttribute('data-video-title') || '').trim();
if (dataVideoTitle) return dataVideoTitle;
const title = (video.getAttribute('title') || '').trim();
if (title) return title;
}
return h1Bul(header) || 'Haber';
}
function videoTarihiBul(header, video) {
if (video) {
const videoCreated = video.getAttribute('data-created');
if (videoCreated) {
const sonuc = tarihFormatla(videoCreated);
if (sonuc) return sonuc;
}
}
let tarihElement = header.querySelector('.sabit-yayin-tarihi');
if (!tarihElement) {
const container = header.closest('article, .post, .item-post, .post-body');
if (container) {
tarihElement = container.querySelector('.sabit-yayin-tarihi');
}
}
if (!tarihElement) {
tarihElement = document.querySelector('.sabit-yayin-tarihi');
}
if (!tarihElement) return '';
return tarihFormatla(tarihElement.textContent);
}
const GORSEL_SINIFLARI = [
'ai-gorsel',
'gercek-gorsel',
'fotograf',
'bayrak',
'siteye-ait-gorsel',
'ajans-lisansli-gorsel',
'stok-lisansli-gorsel',
'cc0-gorsel',
'cc-by-gorsel',
'cc-by-sa-gorsel',
'cc-by-nd-gorsel',
'cc-by-nc-gorsel',
'cc-by-nc-sa-gorsel',
'cc-by-nc-nd-gorsel',
'public-domain-gorsel',
'public-domain-mark-gorsel',
'kamu-acik-lisans-gorsel',
'izinli-gorsel',
'arsiv-izinli-gorsel',
'editorial-kullanim-gorsel',
'kurum-izinli-gorsel',
'web-kaynakli-gorsel'
];
const GORSEL_ACIKLAMALARI = {
'ai-gorsel': 'Yapay zekâ destekli görsel \u{1F916}',
'gercek-gorsel': 'Gerçek görsel',
'fotograf': 'Fotoğraf',
'bayrak': 'Bayrak görseli',
'siteye-ait-gorsel': 'Siteye ait özgün görsel',
'ajans-lisansli-gorsel': 'Ajans lisanslı görsel',
'stok-lisansli-gorsel': 'Stok lisanslı görsel',
'cc0-gorsel': 'CC0 (kamu malı) görsel',
'cc-by-gorsel': 'CC BY lisanslı görsel',
'cc-by-sa-gorsel': 'CC BY-SA lisanslı görsel',
'cc-by-nd-gorsel': 'CC BY-ND lisanslı görsel',
'cc-by-nc-gorsel': 'CC BY-NC lisanslı görsel',
'cc-by-nc-sa-gorsel': 'CC BY-NC-SA lisanslı görsel',
'cc-by-nc-nd-gorsel': 'CC BY-NC-ND lisanslı görsel',
'public-domain-gorsel': 'Kamu malı görsel',
'public-domain-mark-gorsel': 'Kamu malı işaretli görsel',
'kamu-acik-lisans-gorsel': 'Kamu açık lisanslı görsel',
'izinli-gorsel': 'İzinli kullanılan görsel',
'arsiv-izinli-gorsel': 'Arşiv izinli görsel',
'editorial-kullanim-gorsel': 'Editoryal kullanım görseli',
'kurum-izinli-gorsel': 'Kurum izinli görsel',
'web-kaynakli-gorsel': 'Web kaynaklı görsel'
};
const VARSAYILAN_LISANS_LINKI = '/p/lisans.html';
const GORSEL_LISANS_LINKLERI = {
'cc0-gorsel': 'https://creativecommons.org/publicdomain/zero/1.0/deed.tr',
'cc-by-gorsel': 'https://creativecommons.org/licenses/by/4.0/deed.tr',
'cc-by-sa-gorsel': 'https://creativecommons.org/licenses/by-sa/4.0/deed.tr',
'cc-by-nd-gorsel': 'https://creativecommons.org/licenses/by-nd/4.0/deed.tr',
'cc-by-nc-gorsel': 'https://creativecommons.org/licenses/by-nc/4.0/deed.tr',
'cc-by-nc-sa-gorsel': 'https://creativecommons.org/licenses/by-nc-sa/4.0/deed.tr',
'cc-by-nc-nd-gorsel': 'https://creativecommons.org/licenses/by-nc-nd/4.0/deed.tr',
'public-domain-gorsel': 'https://creativecommons.org/publicdomain/mark/1.0/deed.tr',
'public-domain-mark-gorsel': 'https://creativecommons.org/publicdomain/mark/1.0/deed.tr'
};
const VIDEO_SINIFLARI = [
'video', 'ai-video', 'gercek-video', 'karma-video', 'cekim-video',
'ajans-video', 'kamu-video', 'kurum-video', 'stok-video',
'web-kaynakli-video', 'canli-video', 'roportaj-video', 'arsiv-video',
'sosyal-medya-video', 'guvenlik-kamerasi-video', 'okuyucu-video',
'basin-toplantisi-video', 'etkinlik-video', 'ekran-kaydi-video',
'animasyon-video', 'drone-video', 'saha-video', 'muhabir-video',
'studyo-video', 'telefon-video', 'amator-video', 'tanik-video',
'bodycam-video', 'dashcam-video', 'trafik-kamerasi-video',
'hava-goruntusu-video', 'uydu-goruntusu-video', 'zaman-atlamali-video',
'yavas-cekim-video', 'canlandirma-video', 'infografik-video',
'grafik-video', 'dosya-video', 'ozel-haber-video', 'panel-video',
'aciklama-video', 'analiz-video', 'yorum-video', 'podcast-video',
'sokak-roportaji-video', 'telefon-roportaji-video'
];
const VIDEO_ACIKLAMALARI = {
'video': 'Gerçek video \u{1F3A5}',
'ai-video': 'Yapay zekâ destekli video \u{1F916}',
'gercek-video': 'Gerçek video \u{1F3A5}',
'karma-video': 'Karma video',
'cekim-video': 'Özgün çekim video',
'ajans-video': 'Ajans videosu',
'kamu-video': 'Kamu videosu',
'kurum-video': 'Kurum videosu',
'stok-video': 'Stok video',
'web-kaynakli-video': 'Web kaynaklı video',
'canli-video': 'Canlı yayın videosu',
'roportaj-video': 'Röportaj videosu',
'arsiv-video': 'Arşiv videosu',
'sosyal-medya-video': 'Sosyal medya videosu',
'guvenlik-kamerasi-video': 'Güvenlik kamerası görüntüsü',
'okuyucu-video': 'Okuyucu videosu',
'basin-toplantisi-video': 'Basın toplantısı videosu',
'etkinlik-video': 'Etkinlik videosu',
'ekran-kaydi-video': 'Ekran kaydı videosu',
'animasyon-video': 'Animasyon videosu',
'drone-video': 'Drone görüntüsü',
'saha-video': 'Saha videosu',
'muhabir-video': 'Muhabir videosu',
'studyo-video': 'Stüdyo videosu',
'telefon-video': 'Telefon videosu',
'amator-video': 'Amatör video',
'tanik-video': 'Tanık videosu',
'bodycam-video': 'Bodycam görüntüsü',
'dashcam-video': 'Dashcam görüntüsü',
'trafik-kamerasi-video': 'Trafik kamerası görüntüsü',
'hava-goruntusu-video': 'Hava görüntüsü',
'uydu-goruntusu-video': 'Uydu görüntüsü',
'zaman-atlamali-video': 'Zaman atlamalı video',
'yavas-cekim-video': 'Yavaş çekim video',
'canlandirma-video': 'Canlandırma videosu',
'infografik-video': 'İnfografik video',
'grafik-video': 'Grafik video',
'dosya-video': 'Dosya görüntüsü',
'ozel-haber-video': 'Özel haber videosu',
'panel-video': 'Panel videosu',
'aciklama-video': 'Açıklama videosu',
'analiz-video': 'Analiz videosu',
'yorum-video': 'Yorum videosu',
'podcast-video': 'Podcast videosu',
'sokak-roportaji-video': 'Sokak röportajı videosu',
'telefon-roportaji-video': 'Telefon röportajı videosu'
};
function sinifVarMi(el, siniflar) {
return siniflar.some(function (sinif) {
return el.classList.contains(sinif);
});
}
function eslesenSinifiBul(el, siniflar) {
for (let i = 0; i < siniflar.length; i++) {
if (el.classList.contains(siniflar[i])) {
return siniflar[i];
}
}
return null;
}
function gecerliFigureMu(figure) {
if (sinifVarMi(figure, GORSEL_SINIFLARI)) return true;
const img = figure.querySelector('img');
return !!(img && sinifVarMi(img, GORSEL_SINIFLARI));
}
function figureVeGorseliBul(block) {
const figure = block.matches('figure') ? block : block.querySelector('figure');
if (!figure) return { figure: null, image: null };
return { figure: figure, image: figure.querySelector('img') };
}
function videoElementiBul(block) {
if (block.tagName === 'IFRAME' && sinifVarMi(block, VIDEO_SINIFLARI)) {
return block;
}
const iframe = block.querySelector('iframe');
return (iframe && sinifVarMi(iframe, VIDEO_SINIFLARI)) ? iframe : null;
}
function medyaBloklariniBul(header) {
const blocks = [];
Array.from(header.children).forEach(function (child) {
if (child.matches('figure') && gecerliFigureMu(child)) {
blocks.push(child);
return;
}
if (child.matches('.haber-kapak-gorsel')) {
const figure = child.querySelector('figure');
if (figure && gecerliFigureMu(figure)) {
blocks.push(child);
}
return;
}
if (child.matches('.haber-video-wrapper')) {
const iframe = child.querySelector('iframe');
if (iframe && sinifVarMi(iframe, VIDEO_SINIFLARI)) {
blocks.push(child);
}
return;
}
if (child.tagName === 'IFRAME' && sinifVarMi(child, VIDEO_SINIFLARI)) {
blocks.push(child);
}
});
return blocks;
}
function medyaTipiniBul(block) {
if (block.matches('figure') || block.matches('.haber-kapak-gorsel')) {
return 'image';
}
return 'video';
}
function lisansAlaniOlustur(slide, block, mediaType) {
if (!slide || !block) return null;
block.querySelectorAll('.ai-alt-yazi').forEach(function (old) {
old.remove();
});
if (block.nextElementSibling && block.nextElementSibling.classList.contains('ai-alt-yazi')) {
block.nextElementSibling.remove();
}
const caption = document.createElement(mediaType === 'image' ? 'figcaption' : 'div');
caption.className = 'ai-alt-yazi';
caption.setAttribute('data-nosnippet', 'true');
if (mediaType === 'image') {
const bulunan = figureVeGorseliBul(block);
if (!bulunan.image) return null;
bulunan.image.insertAdjacentElement('afterend', caption);
} else {
const video = videoElementiBul(block);
if (!video) return null;
video.insertAdjacentElement('afterend', caption);
}
return caption;
}
const LISANS_BASLIK_MAX_UZUNLUK = 110;
function metniKisalt(metin, maxUzunluk) {
if (!metin) return '';
const temiz = String(metin).trim();
if (temiz.length <= maxUzunluk) return temiz;
return temiz.slice(0, Math.max(0, maxUzunluk - 1)).trimEnd() + '…';
}
function lisansOlustur(caption, tur, baslik, tarih, aciklama, lisansLinki) {
if (!caption) return;
caption.textContent = '';
const kisaBaslik = metniKisalt(baslik, LISANS_BASLIK_MAX_UZUNLUK);
const strong = document.createElement('strong');
strong.textContent = tur + ':';
caption.appendChild(strong);
caption.appendChild(document.createTextNode(
' ' + kisaBaslik +
' | \u00A9\uFE0F ' + (tarih || '2026') +
' Haberlerver.com | ' + aciklama + ' | '
));
const link = document.createElement('a');
link.href = lisansLinki || VARSAYILAN_LISANS_LINKI;
link.target = '_blank';
link.rel = 'nofollow noopener';
link.textContent = 'Lisans Bilgisi';
caption.appendChild(link);
if (kisaBaslik.endsWith('…')) {
caption.title =
tur + ': ' + baslik +
' | \u00A9\uFE0F ' + (tarih || '2026') +
' Haberlerver.com | ' + aciklama;
}
}
function slideLisansiHazirla(header, slide, block, mediaType, caption) {
if (mediaType === 'image') {
const bulunan = figureVeGorseliBul(block);
if (!bulunan.image) return;
const image = bulunan.image;
const baslik = imageBasligiBul(header, image);
const tarih = tarihFormatla(image.getAttribute('data-created'));
const sinif =
(bulunan.figure && eslesenSinifiBul(bulunan.figure, GORSEL_SINIFLARI)) ||
eslesenSinifiBul(image, GORSEL_SINIFLARI);
const aciklama = (sinif && GORSEL_ACIKLAMALARI[sinif]) || 'Görsel';
const lisansLinki = (sinif && GORSEL_LISANS_LINKLERI[sinif]) || VARSAYILAN_LISANS_LINKI;
lisansOlustur(caption, 'Görsel', baslik, tarih, aciklama, lisansLinki);
return;
}
const video = videoElementiBul(block);
if (!video) return;
const baslik = videoBasligiBul(header, video);
const tarih = videoTarihiBul(header, video);
const sinif = eslesenSinifiBul(video, VIDEO_SINIFLARI);
const aciklama = (sinif && VIDEO_ACIKLAMALARI[sinif]) || 'Video';
lisansOlustur(caption, 'Video', baslik, tarih, aciklama, VARSAYILAN_LISANS_LINKI);
}
const AI_SLIDER_ILGILI_SECICI =
'.news-header, figure, .haber-kapak-gorsel, .haber-video-wrapper, img, iframe';
function dugumIlgiliMi(node) {
if (node.nodeType !== 1) return false;
if (node.matches && node.matches(AI_SLIDER_ILGILI_SECICI)) return true;
if (node.querySelector && node.querySelector(AI_SLIDER_ILGILI_SECICI)) return true;
return false;
}
function dugumdekiHeaderlariEkle(node, kume) {
if (node.matches && node.matches('.news-header')) {
kume.add(node);
}
if (node.closest) {
const disHeader = node.closest('.news-header');
if (disHeader) kume.add(disHeader);
}
if (node.querySelectorAll) {
node.querySelectorAll('.news-header').forEach(function (bulunanHeader) {
kume.add(bulunanHeader);
});
}
}
function initHeader(header) {
if (!header) return;
if (header.dataset.aiVideoSliderInitialized === '1') return;
const existingSlider = header.querySelector(':scope > .ai-video-slider');
if (existingSlider) {
header.dataset.aiVideoSliderInitialized = '1';
return;
}
const mediaBlocks = medyaBloklariniBul(header);
if (mediaBlocks.length === 0) return;
const firstBlock = mediaBlocks[0];
if (!firstBlock.parentNode) return;
const yerTutucu = document.createComment('ai-video-slider');
firstBlock.parentNode.insertBefore(yerTutucu, firstBlock);
const slider = document.createElement('div');
slider.className = 'ai-video-slider';
slider.setAttribute('role', 'region');
slider.setAttribute('aria-label', 'Haber medya galerisi');
slider.setAttribute('aria-roledescription', 'carousel');
slider.dataset.aiSliderIndex = '0';
slider.dataset.aiSliderTotal = String(mediaBlocks.length);
const stage = document.createElement('div');
stage.className = 'ai-video-slider-stage';
slider.appendChild(stage);
const slides = [];
mediaBlocks.forEach(function (block, index) {
const slide = document.createElement('div');
slide.className = 'ai-video-slider-slide';
slide.dataset.slideIndex = String(index);
slide.setAttribute('role', 'group');
slide.setAttribute('aria-roledescription', 'slide');
slide.setAttribute('aria-label', (index + 1) + ' / ' + mediaBlocks.length);
slide.setAttribute('aria-hidden', 'true');
const mediaType = medyaTipiniBul(block);
slide.dataset.mediaType = mediaType;
if (mediaType === 'video' && index > 0) {
const gecikecekVideo = videoElementiBul(block);
if (gecikecekVideo && gecikecekVideo.getAttribute('src')) {
gecikecekVideo.dataset.aiLazySrc = gecikecekVideo.getAttribute('src');
gecikecekVideo.removeAttribute('src');
}
}
if (mediaType === 'image') {
const oncelikliGorsel = figureVeGorseliBul(block).image;
if (oncelikliGorsel) {
oncelikliGorsel.setAttribute('decoding', 'async');
oncelikliGorsel.setAttribute('fetchpriority', index === 0 ? 'high' : 'low');
}
}
slide.appendChild(block);
const caption = lisansAlaniOlustur(slide, block, mediaType);
if (caption) {
slideLisansiHazirla(header, slide, block, mediaType, caption);
}
stage.appendChild(slide);
slides.push(slide);
});
let currentIndex = 0;
let ilkAtama = true;
let typeElement = null;
let counterElement = null;
function goToSlide(requestedIndex) {
if (slides.length === 0) return;
let index = requestedIndex % slides.length;
if (index < 0) index += slides.length;
const eskiIndex = currentIndex;
currentIndex = index;
slider.dataset.aiSliderIndex = String(currentIndex);
if (ilkAtama || eskiIndex !== currentIndex) {
if (!ilkAtama && slides[eskiIndex]) {
slides[eskiIndex].classList.remove('active');
slides[eskiIndex].setAttribute('aria-hidden', 'true');
}
const yeniSlide = slides[currentIndex];
yeniSlide.classList.add('active');
yeniSlide.setAttribute('aria-hidden', 'false');
if (yeniSlide.dataset.mediaType === 'video') {
const gecikmisVideo = yeniSlide.querySelector('iframe[data-ai-lazy-src]');
if (gecikmisVideo) {
gecikmisVideo.src = gecikmisVideo.dataset.aiLazySrc;
delete gecikmisVideo.dataset.aiLazySrc;
}
}
ilkAtama = false;
}
const aktifSlide = slides[currentIndex];
if (typeElement) {
typeElement.textContent = aktifSlide.dataset.mediaType === 'video' ? 'Video' : 'Görsel';
}
if (counterElement) {
counterElement.textContent = (currentIndex + 1) + ' / ' + slides.length;
}
}
if (slides.length > 1) {
const ui = document.createElement('div');
ui.className = 'ai-video-slider-ui';
ui.innerHTML = `
<div class="ai-video-slider-switch">
<button
                        type="button"
                        class="ai-video-slider-nav ai-video-slider-prev"
                        aria-label="Önceki içerik">
<span aria-hidden="true">&#10094;</span>
</button>
<div
                        class="ai-video-slider-status"
                        aria-live="polite">
<span class="ai-video-slider-type">Görsel</span>
<span class="ai-video-slider-counter">1 / ${slides.length}</span>
</div>
<button
                        type="button"
                        class="ai-video-slider-nav ai-video-slider-next"
                        aria-label="Sonraki içerik">
<span aria-hidden="true">&#10095;</span>
</button>
</div>
            `;
slider.appendChild(ui);
const prevButton = ui.querySelector('.ai-video-slider-prev');
const nextButton = ui.querySelector('.ai-video-slider-next');
typeElement = ui.querySelector('.ai-video-slider-type');
counterElement = ui.querySelector('.ai-video-slider-counter');
prevButton.addEventListener('click', function (event) {
event.preventDefault();
event.stopPropagation();
goToSlide(currentIndex - 1);
});
nextButton.addEventListener('click', function (event) {
event.preventDefault();
event.stopPropagation();
goToSlide(currentIndex + 1);
});
slider.addEventListener('keydown', function (event) {
if (event.key === 'ArrowLeft') {
event.preventDefault();
goToSlide(currentIndex - 1);
} else if (event.key === 'ArrowRight') {
event.preventDefault();
goToSlide(currentIndex + 1);
}
});
let touchStartX = 0;
let touchStartY = 0;
slider.addEventListener('touchstart', function (event) {
if (!event.touches || !event.touches.length) return;
touchStartX = event.touches[0].clientX;
touchStartY = event.touches[0].clientY;
}, { passive: true });
slider.addEventListener('touchend', function (event) {
if (!event.changedTouches || !event.changedTouches.length) return;
const touchEndX = event.changedTouches[0].clientX;
const touchEndY = event.changedTouches[0].clientY;
const deltaX = touchEndX - touchStartX;
const deltaY = touchEndY - touchStartY;
if (Math.abs(deltaX) < 50) return;
if (Math.abs(deltaY) > Math.abs(deltaX)) return;
if (deltaX < 0) {
goToSlide(currentIndex + 1);
} else {
goToSlide(currentIndex - 1);
}
}, { passive: true });
}
goToSlide(0);
yerTutucu.replaceWith(slider);
header.dataset.aiVideoSliderInitialized = '1';
header._aiVideoSlider = slider;
header._aiVideoSliderSlides = slides;
header._aiVideoSliderGoTo = goToSlide;
}
let sliderGozlemcisi = null;
function sliderGozlemcisiKur() {
if (typeof IntersectionObserver === 'undefined') return;
sliderGozlemcisi = new IntersectionObserver(
function (entries) {
entries.forEach(function (entry) {
if (!entry.isIntersecting) return;
sliderGozlemcisi.unobserve(entry.target);
initHeader(entry.target);
});
},
{ rootMargin: '600px 0px' }
);
}
function headerGozlemeAl(header) {
if (
header.dataset.aiVideoSliderInitialized === '1' ||
header.dataset.aiVideoSliderGozlemde === '1'
) {
return;
}
if (!sliderGozlemcisi) {
initHeader(header);
return;
}
header.dataset.aiVideoSliderGozlemde = '1';
sliderGozlemcisi.observe(header);
}
function initAllHeaders() {
document.querySelectorAll('.news-header').forEach(function (header) {
headerGozlemeAl(header);
});
}
function dynamicObserverKur() {
if (typeof MutationObserver === 'undefined') return;
let frame = null;
let bekleyenHeaderlar = null;
const observer = new MutationObserver(function (mutations) {
for (let i = 0; i < mutations.length; i++) {
const mutation = mutations[i];
if (mutation.type !== 'childList' || !mutation.addedNodes.length) continue;
for (let j = 0; j < mutation.addedNodes.length; j++) {
const node = mutation.addedNodes[j];
if (!dugumIlgiliMi(node)) continue;
if (!bekleyenHeaderlar) {
bekleyenHeaderlar = new Set();
}
dugumdekiHeaderlariEkle(node, bekleyenHeaderlar);
}
}
if (!bekleyenHeaderlar || !bekleyenHeaderlar.size) return;
if (frame !== null) return;
frame = requestAnimationFrame(function () {
frame = null;
const headerlar = bekleyenHeaderlar;
bekleyenHeaderlar = null;
headerlar.forEach(function (header) {
headerGozlemeAl(header);
});
});
});
observer.observe(document.body, {
childList: true,
subtree: true
});
}
function init() {
sliderGozlemcisiKur();
initAllHeaders();
dynamicObserverKur();
}
if (document.readyState === 'loading') {
document.addEventListener('DOMContentLoaded', init, { once: true });
} else {
init();
}
})();
//
  };

  /* Orijinal Blogger tema konumu: satir 37593 | hvjs-033 */
  parts["hvjs-033"] = function () {

//
(function () {
'use strict';
if (window.__HV_COOKIE_MANAGER_INITIALIZED__) {
return;
}
window.__HV_COOKIE_MANAGER_INITIALIZED__ = true;
window.dataLayer = window.dataLayer || [];
window.gtag = window.gtag || function () {
window.dataLayer.push(arguments);
};
window.gtag('consent', 'default', {
'ad_storage': 'denied',
'analytics_storage': 'denied',
'ad_user_data': 'denied',
'ad_personalization': 'denied',
'functionality_storage': 'granted',
'security_storage': 'granted',
'personalization_storage': 'denied'
});
window.gtag('set', 'ads_data_redaction', true);
window.clarity = window.clarity || function () {
(window.clarity.q = window.clarity.q || []).push(arguments);
};
window.clarity('consentv2', {
ad_Storage: 'denied',
analytics_Storage: 'denied'
});
window.__cookieIDS = {
gtm: 'GTM-WJHCZK5B',
blogger: '5804309692235712171'
};
document.addEventListener('DOMContentLoaded', function () {
const KEY = 'cookiePrefs_v2';
const POLICY_VERSION = '2.0';
const CONSENT_MAX_AGE_DAYS = 180;
const IDS = window.__cookieIDS;
const prefersReducedMotion =
window.matchMedia &&
window.matchMedia('(prefers-reduced-motion: reduce)').matches;
const style = document.createElement('style');
style.id = 'hv-cookie-manager-style';
style.textContent = `
        #cookie-banner,
        #cookie-drawer,
        #cookie-icon {
          box-sizing: border-box;
        }
        #cookie-banner {
          position: fixed;
          bottom: 16px;
          left: 50%;
          width: calc(100% - 32px);
          max-width: 640px;
          background: rgba(255,255,255,0.97);
          backdrop-filter: blur(14px);
          -webkit-backdrop-filter: blur(14px);
          border: 1px solid #e2e8f0;
          border-radius: 20px;
          box-shadow: 0 8px 30px rgba(0,0,0,0.10);
          padding: 22px;
          font-family:
            system-ui,
            -apple-system,
            BlinkMacSystemFont,
            "Segoe UI",
            sans-serif;
          z-index: 99990;
          display: none;
          color: #0f172a;
          opacity: 0;
          transform: translateX(-50%) translateY(12px);
          transition:
            opacity ${prefersReducedMotion ? '0s' : '.35s'} ease,
            transform ${prefersReducedMotion ? '0s' : '.35s'} ease;
        }
        #cookie-banner.visible {
          opacity: 1;
          transform: translateX(-50%) translateY(0);
        }
        #cookie-banner h4 {
          margin: 0 0 9px 0;
          font-size: 16px;
          line-height: 1.35;
          font-weight: 700;
          text-align: center;
        }
        #cookie-banner p {
          font-size: 13.5px;
          line-height: 1.65;
          margin: 0 0 18px 0;
          text-align: center;
          color: #334155;
        }
        #cookie-banner p a,
        #cookie-banner p button.link-button {
          color: #0a4d92;
          font-weight: 600;
          text-decoration: none;
          border-bottom: 1px dotted #0a4d92;
        }
        #cookie-banner p button.link-button {
          background: none;
          border-top: 0;
          border-left: 0;
          border-right: 0;
          padding: 0;
          margin: 0;
          cursor: pointer;
          font: inherit;
        }
        .cookie-brand {
          text-align: center;
          margin-bottom: 10px;
        }
        .cookie-brand-name {
          display: inline-block;
          font-size: 18px;
          line-height: 1.2;
          font-weight: 800;
          letter-spacing: -0.3px;
          color: #0a4d92;
        }
        .cookie-actions {
          display: flex;
          gap: 10px;
          justify-content: center;
          flex-wrap: wrap;
        }
        .cookie-actions button {
          padding: 12px 22px;
          border-radius: 30px;
          border: none;
          font-weight: 600;
          cursor: pointer;
          font-size: 14px;
          transition:
            background .2s ease,
            transform .2s ease,
            box-shadow .2s ease;
          font-family: inherit;
        }
        .cookie-actions button:hover {
          transform: translateY(-1px);
        }
        .cookie-actions button:disabled {
          cursor: not-allowed;
          opacity: .55;
          transform: none;
        }
        #acceptCookies {
          background: #15803d;
          color: #fff;
          box-shadow: 0 4px 10px rgba(21,128,61,0.30);
        }
        #acceptCookies:hover {
          background: #166534;
        }
        #rejectCookies {
          background: #f1f5f9;
          color: #334155;
          border: 1px solid #e2e8f0;
        }
        #rejectCookies:hover {
          background: #e2e8f0;
        }
        #manageCookies {
          background: #eef5ff;
          color: #1e40af;
          border: 1px solid #bfdbfe;
        }
        #manageCookies:hover {
          background: #cfe0ff;
        }
        #cookie-banner button:focus-visible,
        #cookie-icon:focus-visible,
        .toggle:focus-visible,
        .drawer-close:focus-visible,
        .btn-primary:focus-visible,
        .btn-secondary:focus-visible,
        button.link-button:focus-visible {
          outline: 2px solid #0b72ef;
          outline-offset: 3px;
        }
        #cookie-icon {
          position: fixed;
          bottom: 16px;
          left: 16px;
          width: 48px;
          height: 48px;
          background: #15803d;
          border: none;
          padding: 0;
          border-radius: 50%;
          box-shadow: 0 6px 20px rgba(0,0,0,0.15);
          cursor: pointer;
          z-index: 99999;
          display: none;
          align-items: center;
          justify-content: center;
          opacity: 0;
          transform: scale(.96);
          transition:
            opacity ${prefersReducedMotion ? '0s' : '.3s'} ease,
            transform ${prefersReducedMotion ? '0s' : '.2s'} ease;
        }
        #cookie-icon.visible {
          opacity: 1;
          transform: scale(1);
        }
        #cookie-icon:hover {
          transform: scale(1.05);
        }
        #cookie-icon svg {
          width: 26px;
          height: 26px;
          display: block;
        }
        #cookie-drawer {
          position: fixed;
          top: 0;
          left: 0;
          height: 100%;
          width: 380px;
          max-width: 92%;
          background: #ffffff;
          box-shadow: 8px 0 30px rgba(0,0,0,0.08);
          transform: translateX(-110%);
          transition:
            transform ${prefersReducedMotion ? '0s' : '.3s'}
            cubic-bezier(0.2,0.9,0.2,1);
          z-index: 100000;
          padding: 20px 18px;
          font-family:
            system-ui,
            -apple-system,
            BlinkMacSystemFont,
            "Segoe UI",
            sans-serif;
          overflow-y: auto;
          display: flex;
          flex-direction: column;
          color: #0f172a;
        }
        #cookie-drawer[hidden] {
          display: none !important;
        }
        #cookie-drawer.open {
          transform: translateX(0);
        }
        .drawer-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 12px;
        }
        .drawer-header h3 {
          margin: 0;
          font-size: 18px;
          line-height: 1.3;
          font-weight: 700;
          color: #0f172a;
        }
        .drawer-close {
          background: transparent;
          border: none;
          font-size: 26px;
          cursor: pointer;
          color: #64748b;
          padding: 0 4px;
          line-height: 1;
        }
        .drawer-close:hover {
          color: #0f172a;
        }
        .cookie-brand.drawer-brand {
          margin: 2px 0 8px 0;
        }
        .drawer-description {
          text-align: center;
          margin: 0 0 14px 0;
          color: #475569;
          font-size: 12.5px;
          line-height: 1.5;
        }
        .gpc-notice {
          display: none;
          margin: 0 0 14px 0;
          padding: 11px 12px;
          border-radius: 12px;
          background: #fef3c7;
          border: 1px solid #fde68a;
          color: #78350f;
          font-size: 12.5px;
          line-height: 1.5;
        }
        .gpc-notice.visible {
          display: block;
        }
        /*
          GTM ana izin alanı.
        */
        .gtm-item {
          display: flex;
          gap: 12px;
          align-items: flex-start;
          padding: 14px;
          border-radius: 14px;
          margin-bottom: 12px;
          background: #eef5ff;
          border: 1px solid #bfdbfe;
        }
        .gtm-item .meta {
          flex: 1;
          min-width: 0;
        }
        .gtm-item .meta b {
          display: block;
          font-size: 14px;
          color: #1e3a8a;
          margin-bottom: 6px;
        }
        .gtm-item .meta small {
          color: #475569;
          line-height: 1.55;
          font-size: 12.5px;
        }
        /*
          GTM kapalıyken alt ölçüm kategorileri görsel olarak
          pasif hale getirilir.
        */
        .measurement-group-disabled {
          opacity: .48;
        }
        .measurement-group-disabled .cookie-item {
          cursor: not-allowed;
        }
        .cookie-item {
          display: flex;
          gap: 12px;
          align-items: flex-start;
          padding: 14px;
          border-radius: 14px;
          margin-bottom: 12px;
          background: #f8fafc;
          border: 1px solid #e2e8f0;
          transition:
            opacity .2s ease,
            background .2s ease,
            border-color .2s ease;
        }
        .cookie-item .meta {
          flex: 1;
          min-width: 0;
        }
        .cookie-item .meta b {
          display: block;
          font-size: 14px;
          color: #0f172a;
          margin-bottom: 6px;
        }
        .cookie-item .meta small {
          color: #475569;
          line-height: 1.55;
          font-size: 12.5px;
        }
        .toggle {
          --w: 44px;
          --h: 24px;
          --dot: 18px;
          width: var(--w);
          height: var(--h);
          border-radius: 999px;
          background: #cbd5e1;
          position: relative;
          cursor: pointer;
          flex-shrink: 0;
          transition:
            background .2s ease,
            opacity .2s ease;
          display: inline-block;
          border: none;
          padding: 0;
          -webkit-appearance: none;
          appearance: none;
        }
        .toggle .dot {
          width: var(--dot);
          height: var(--dot);
          background: #fff;
          border-radius: 50%;
          position: absolute;
          top: 3px;
          left: 3px;
          transition:
            transform .2s
            cubic-bezier(0.2,0.9,0.2,1);
          box-shadow: 0 1px 4px rgba(0,0,0,0.1);
          display: block;
        }
        .toggle.active {
          background: #0b72ef;
        }
        .toggle.active .dot {
          transform: translateX(20px);
        }
        .toggle:disabled {
          cursor: not-allowed;
          opacity: .55;
        }
        /*
          GTM kapalıyken çocuk toggle'lar özellikle sönük.
        */
        .toggle.child-disabled {
          opacity: .45;
          cursor: not-allowed;
        }
        .drawer-actions {
          margin-top: auto;
          padding: 16px 0 0 0;
          background: #fff;
          display: flex;
          gap: 10px;
          flex-wrap: wrap;
          border-top: 1px solid #e5e7eb;
          position: sticky;
          bottom: 0;
        }
        .btn-primary {
          background: #15803d;
          color: #fff;
          border: none;
          padding: 14px 20px;
          border-radius: 30px;
          cursor: pointer;
          font-weight: 600;
          font-size: 14px;
          flex: 1;
          white-space: nowrap;
          font-family: inherit;
        }
        .btn-primary:hover {
          background: #166534;
        }
        .btn-primary:disabled {
          cursor: not-allowed;
          opacity: .55;
        }
        .btn-secondary {
          background: #f1f5f9;
          color: #1e40af;
          border: none;
          padding: 12px 16px;
          border-radius: 30px;
          cursor: pointer;
          font-weight: 600;
          font-size: 13px;
          white-space: nowrap;
          font-family: inherit;
        }
        .btn-secondary:hover {
          background: #e2e8f0;
        }
        .btn-secondary:disabled {
          cursor: not-allowed;
          opacity: .55;
        }
        .mandatory-item {
          background: #f8fafc;
        }
        @media (max-width: 480px) {
          #cookie-banner {
            padding: 18px;
            bottom: 10px;
            width: calc(100% - 20px);
          }
          .cookie-actions {
            flex-direction: column;
          }
          .cookie-actions button {
            width: 100%;
          }
          #cookie-icon {
            left: 12px;
            bottom: 12px;
          }
          #cookie-drawer {
            width: 100%;
            max-width: 100%;
            border-radius: 0;
            padding: 16px 12px;
          }
          .drawer-actions {
            flex-direction: column;
          }
          .btn-primary,
          .btn-secondary {
            width: 100%;
            text-align: center;
            padding: 14px 16px;
          }
        }
        @media (prefers-reduced-motion: reduce) {
          #cookie-banner,
          #cookie-icon,
          #cookie-drawer,
          .toggle,
          .toggle .dot,
          .cookie-item {
            transition: none !important;
          }
        }
      `;
document.head.appendChild(style);
const bannerHTML = `
<div
          id="cookie-banner"
          role="region"
          aria-live="polite"
          aria-labelledby="cookie-banner-title">
<div class="cookie-brand">
<span class="cookie-brand-name">
              Haberlerver.com
</span>
</div>
<h4 id="cookie-banner-title">
            Çerez ve Gizlilik Tercihleriniz
</h4>
<p>
            Sitenin temel işlevleri için gerekli teknik teknolojiler
            kullanılabilir. İsteğe bağlı ölçüm ve kullanıcı deneyimi
            analiz hizmetleri ise yalnızca tercih ettiğiniz ölçüde
            etkinleştirilir. Tercihinizi istediğiniz zaman
<button
              type="button"
              class="link-button"
              id="inlineManage">
              ayarlardan
</button>
            değiştirebilirsiniz.
            Ayrıntılar için
<a
              href="/p/cerez-politikasi.html"
              rel="nofollow noopener"
              target="_blank">
              Çerez Politikası
</a>.
</p>
<div class="cookie-actions">
<button
              id="acceptCookies"
              type="button">
              Tümünü Kabul Et
</button>
<button
              id="manageCookies"
              type="button">
              Tercihleri Yönet
</button>
<button
              id="rejectCookies"
              type="button">
              Yalnızca Zorunlu
</button>
</div>
</div>
<button
          id="cookie-icon"
          type="button"
          title="Çerez Ayarları"
          aria-label="Çerez Ayarlarını Aç"
          aria-expanded="false">
<svg
            viewBox="0 0 48 48"
            aria-hidden="true"
            focusable="false">
<path
              d="M31.9 8.2c.5 3.9 3.7 7.1 7.6 7.6A16.9 16.9 0 1 1 32.2 8c-.1.1-.2.1-.3.2Z"
              fill="none"
              stroke="white"
              stroke-width="3.2"
              stroke-linecap="round"
              stroke-linejoin="round"/>
<circle
              cx="19"
              cy="20"
              r="2.1"
              fill="white"/>
<circle
              cx="26"
              cy="28"
              r="2.1"
              fill="white"/>
<circle
              cx="17"
              cy="31"
              r="2.1"
              fill="white"/>
<circle
              cx="28"
              cy="18"
              r="2.1"
              fill="white"/>
</svg>
</button>
<aside
          id="cookie-drawer"
          role="dialog"
          aria-modal="true"
          aria-labelledby="cookie-drawer-title"
          aria-describedby="cookie-drawer-description"
          aria-hidden="true"
          hidden>
<div class="drawer-header">
<h3 id="cookie-drawer-title">
              Çerez Tercihleri
</h3>
<button
              class="drawer-close"
              id="drawerClose"
              type="button"
              aria-label="Kapat">
              &#215;
</button>
</div>
<div class="cookie-brand drawer-brand">
<span class="cookie-brand-name">
              Haberlerver.com
</span>
</div>
<p
            id="cookie-drawer-description"
            class="drawer-description">
            İsteğe bağlı hizmetleri aşağıdan ayrı ayrı
            açıp kapatabilirsiniz. GTM kapalı olduğunda
            GTM üzerinden yönetilen ölçüm hizmetleri
            kullanılamaz.
</p>
<div
            id="gpcNotice"
            class="gpc-notice"
            role="status"
            aria-live="polite">
            Tarayıcınız Global Privacy Control (GPC) sinyali
            gönderdiği için isteğe bağlı ölçüm hizmetleri ve
            Google Tag Manager kapalı tutulmaktadır.
</div>
<div class="gtm-item">
<div class="meta">
<b id="gtmLabel">
                Google Tag Manager
</b>
<small>
                İsteğe bağlı ölçüm etiketlerinin teknik olarak
                yüklenmesini ve yönetilmesini sağlayan üçüncü
                taraf etiket yönetim hizmetidir. Bu hizmet,
                tek başına Google Analytics, Yandex Metrica
                veya Microsoft Clarity izni yerine geçmez.
                Bu üç hizmet için ayrıca tercih yapabilirsiniz.
</small>
</div>
<button
              type="button"
              class="toggle"
              id="gtmToggle"
              role="switch"
              aria-checked="false"
              aria-labelledby="gtmLabel">
<span class="dot"></span>
</button>
</div>
<div id="measurementGroup">
<div class="cookie-item">
<div class="meta">
<b id="gaLabel">
                  Google Analytics (GA4)
</b>
<small>
                  Ziyaret, sayfa görüntüleme, trafik ve
                  site içi etkileşim istatistiklerinin
                  ölçülmesi amacıyla kullanılır.
</small>
</div>
<button
                type="button"
                class="toggle"
                id="gaToggle"
                role="switch"
                aria-checked="false"
                aria-labelledby="gaLabel">
<span class="dot"></span>
</button>
</div>
<div class="cookie-item">
<div class="meta">
<b id="yandexLabel">
                  Yandex Metrica
</b>
<small>
                  Ziyaret ve etkileşimlerin analiz edilmesi
                  amacıyla kullanılır. Tıklama, kaydırma ve
                  oturum davranışları gibi ölçüm özellikleri
                  etkinleştirilebilir.
</small>
</div>
<button
                type="button"
                class="toggle"
                id="yandexToggle"
                role="switch"
                aria-checked="false"
                aria-labelledby="yandexLabel">
<span class="dot"></span>
</button>
</div>
<div class="cookie-item">
<div class="meta">
<b id="clarityLabel">
                  Microsoft Clarity
</b>
<small>
                  Kullanıcı deneyiminin ve sayfa içi
                  etkileşimlerin analiz edilmesi amacıyla
                  kullanılır. Isı haritaları ve oturum
                  davranışı analizi gibi özellikler
                  kullanılabilir.
</small>
</div>
<button
                type="button"
                class="toggle"
                id="clarityToggle"
                role="switch"
                aria-checked="false"
                aria-labelledby="clarityLabel">
<span class="dot"></span>
</button>
</div>
<div class="cookie-item mandatory-item">
<div class="meta">
<b id="bloggerLabel">
                  Zorunlu Teknik Teknolojiler
</b>
<small>
                  Sitenin temel işlevleri, güvenliği ve teknik
                  çalışması için gerekli olan teknolojiler
                  bu isteğe bağlı ölçüm tercihleriyle
                  kapatılmaz.
</small>
</div>
<button
                type="button"
                class="toggle active"
                id="bloggerToggle"
                role="switch"
                aria-checked="true"
                aria-labelledby="bloggerLabel"
                disabled>
<span class="dot"></span>
</button>
</div>
</div>
<div class="drawer-actions">
<button
              class="btn-primary"
              id="saveDrawer"
              type="button">
              Tercihleri Kaydet
</button>
<button
              class="btn-secondary"
              id="selectAll"
              type="button">
              Tümünü Seç
</button>
<button
              class="btn-secondary"
              id="deselectAll"
              type="button">
              Tümünü Kapat
</button>
</div>
</aside>
      `;
const wrapper = document.createElement('div');
wrapper.id = 'hv-cookie-manager';
wrapper.setAttribute(
'data-nosnippet',
'true'
);
wrapper.innerHTML = bannerHTML;
document.body.appendChild(wrapper);
const banner =
document.getElementById('cookie-banner');
const icon =
document.getElementById('cookie-icon');
const drawer =
document.getElementById('cookie-drawer');
const saveDrawer =
document.getElementById('saveDrawer');
const selectAll =
document.getElementById('selectAll');
const deselectAll =
document.getElementById('deselectAll');
const manage =
document.getElementById('manageCookies');
const inlineManage =
document.getElementById('inlineManage');
const accept =
document.getElementById('acceptCookies');
const reject =
document.getElementById('rejectCookies');
const closeBtn =
document.getElementById('drawerClose');
const gpcNotice =
document.getElementById('gpcNotice');
const measurementGroup =
document.getElementById('measurementGroup');
const toggles = {
gtm:
document.getElementById('gtmToggle'),
ga:
document.getElementById('gaToggle'),
yandex:
document.getElementById('yandexToggle'),
clarity:
document.getElementById('clarityToggle'),
blogger:
document.getElementById('bloggerToggle')
};
const hasGPC = function () {
return navigator.globalPrivacyControl === true;
};
const hasMeasurementConsent =
function (p) {
return !!p.ga ||
!!p.yandex ||
!!p.clarity;
};
const allDeniedPrefs =
function (method) {
return {
gtm: false,
ga: false,
yandex: false,
clarity: false,
blogger: true,
choiceMethod:
method || 'reject_all'
};
};
const normalizePrefs =
function (p) {
if (!p ||
typeof p !== 'object') {
return null;
}
let gtm =
!!p.gtm;
let ga =
gtm && !!p.ga;
let yandex =
gtm && !!p.yandex;
let clarity =
gtm && !!p.clarity;
return {
gtm: gtm,
ga: ga,
yandex: yandex,
clarity: clarity,
blogger: true,
choiceMethod:
p.choiceMethod ||
'custom',
timestamp:
p.timestamp ||
null,
policyVersion:
p.policyVersion ||
null
};
};
const isPrefsValid =
function (p) {
if (!p ||
typeof p !== 'object') {
return false;
}
if (
p.policyVersion !==
POLICY_VERSION
) {
return false;
}
if (!p.timestamp) {
return false;
}
const time =
new Date(
p.timestamp
).getTime();
if (!Number.isFinite(time)) {
return false;
}
const ageMs =
Date.now() - time;
const maxMs =
CONSENT_MAX_AGE_DAYS *
24 *
60 *
60 *
1000;
return (
ageMs >= 0 &&
ageMs <= maxMs
);
};
const setPrefs =
function (p) {
const normalized =
normalizePrefs(p);
if (!normalized) {
return;
}
normalized.timestamp =
new Date().toISOString();
normalized.policyVersion =
POLICY_VERSION;
try {
localStorage.setItem(
KEY,
JSON.stringify(normalized)
);
} catch (e) {
}
};
const getPrefs =
function () {
try {
const raw =
localStorage.getItem(KEY);
if (!raw) {
return null;
}
const p =
JSON.parse(raw);
if (!isPrefsValid(p)) {
try {
localStorage.removeItem(
KEY
);
} catch (e) {}
return null;
}
return normalizePrefs(p);
} catch (e) {
return null;
}
};
const setToggle =
function (el, on) {
if (!el) {
return;
}
const active =
!!on;
el.classList.toggle(
'active',
active
);
el.setAttribute(
'aria-checked',
active
? 'true'
: 'false'
);
};
const updateGTMChildren =
function () {
const gtmOn =
toggles.gtm.classList.contains(
'active'
);
const gpcOn =
hasGPC();
const canUseChildren =
gtmOn && !gpcOn;
[
toggles.ga,
toggles.yandex,
toggles.clarity
].forEach(function (toggle) {
toggle.disabled =
!canUseChildren;
toggle.classList.toggle(
'child-disabled',
!canUseChildren
);
});
measurementGroup.classList.toggle(
'measurement-group-disabled',
!canUseChildren
);
};
const updateGPCInterface =
function () {
const active =
hasGPC();
gpcNotice.classList.toggle(
'visible',
active
);
if (active) {
setToggle(
toggles.gtm,
false
);
setToggle(
toggles.ga,
false
);
setToggle(
toggles.yandex,
false
);
setToggle(
toggles.clarity,
false
);
toggles.gtm.disabled =
true;
selectAll.disabled =
true;
deselectAll.disabled =
true;
saveDrawer.disabled =
true;
} else {
toggles.gtm.disabled =
false;
selectAll.disabled =
false;
deselectAll.disabled =
false;
saveDrawer.disabled =
false;
}
updateGTMChildren();
};
const read =
function () {
if (hasGPC()) {
return allDeniedPrefs(
'gpc'
);
}
const gtmOn =
toggles.gtm.classList.contains(
'active'
);
return {
gtm: gtmOn,
ga:
gtmOn &&
toggles.ga.classList.contains(
'active'
),
yandex:
gtmOn &&
toggles.yandex.classList.contains(
'active'
),
clarity:
gtmOn &&
toggles.clarity.classList.contains(
'active'
),
blogger: true,
choiceMethod:
'custom'
};
};
const applyClarityConsent =
function (allowed) {
const analyticsState =
allowed
? 'granted'
: 'denied';
window.__hvClarityAnalyticsConsent =
analyticsState;
try {
if (
typeof window.clarity ===
'function'
) {
window.clarity(
'consentv2',
{
ad_Storage:
'denied',
analytics_Storage:
analyticsState
}
);
}
} catch (e) {}
};
const consentPayload =
function (p) {
return {
event:
'hv_consent_update',
hv_gtm:
!!p.gtm,
hv_ga:
!!p.ga,
hv_yandex:
!!p.yandex,
hv_clarity:
!!p.clarity,
hv_blogger:
true
};
};
const pushConsentToDataLayer =
function (p) {
window.__hvConsent = {
gtm:
!!p.gtm,
ga:
!!p.ga,
yandex:
!!p.yandex,
clarity:
!!p.clarity,
blogger:
true
};
window.dataLayer =
window.dataLayer || [];
window.dataLayer.push(
consentPayload(p)
);
};
const updateConsent =
function (p) {
window.gtag(
'consent',
'update',
{
analytics_storage:
p.ga
? 'granted'
: 'denied',
ad_storage:
'denied',
ad_user_data:
'denied',
ad_personalization:
'denied'
}
);
applyClarityConsent(
!!p.clarity
);
pushConsentToDataLayer(
p
);
};
const loadGTM =
function (p) {
if (!p ||
!p.gtm) {
return;
}
if (hasGPC()) {
return;
}
if (
document.getElementById(
'gtm-script'
) ||
window.__hvGTMLoadRequested
) {
return;
}
window.__hvGTMLoadRequested =
true;
const dataLayer =
window.dataLayer =
window.dataLayer || [];
dataLayer.push({
'gtm.start':
new Date().getTime(),
event:
'gtm.js'
});
const script =
document.createElement(
'script'
);
script.id =
'gtm-script';
script.async =
true;
script.src =
'https://www.googletagmanager.com/gtm.js?id=' +
encodeURIComponent(
IDS.gtm
);
document.head.appendChild(
script
);
};
const expireCookie =
function (name) {
const paths = [
'/',
location.pathname
];
paths.forEach(function (path) {
try {
document.cookie =
name +
'=;' +
'expires=Thu, 01 Jan 1970 00:00:00 GMT;' +
'path=' +
path;
} catch (e) {}
});
};
const expireCookiesByPrefix =
function (prefix) {
try {
const cookies =
document.cookie
? document.cookie.split(';')
: [];
cookies.forEach(
function (cookie) {
const name =
cookie
.split('=')[0]
.trim();
if (
name === prefix ||
name.indexOf(
prefix + '_'
) === 0
) {
expireCookie(name);
}
}
);
} catch (e) {}
};
const cleanupMeasurementCookies =
function (p) {
if (!p.ga) {
expireCookie('_gid');
expireCookiesByPrefix('_ga');
}
if (!p.clarity) {
expireCookie('_clck');
expireCookie('_clsk');
}
if (!p.yandex) {
expireCookie('_ym_d');
expireCookie('_ym_isad');
expireCookie('_ym_uid');
expireCookie('_ym_retryReqs');
}
};
const syncConsent =
function (p, method) {
let normalized =
normalizePrefs(p);
if (!normalized) {
normalized =
allDeniedPrefs(
method || 'reject_all'
);
}
if (hasGPC()) {
normalized =
allDeniedPrefs(
'gpc'
);
}
normalized.choiceMethod =
method ||
normalized.choiceMethod ||
'custom';
setPrefs(
normalized
);
updateConsent(
normalized
);
loadGTM(
normalized
);
};
const sameConsentChoices =
function (a, b) {
if (!a || !b) {
return false;
}
return (
!!a.gtm === !!b.gtm &&
!!a.ga === !!b.ga &&
!!a.yandex === !!b.yandex &&
!!a.clarity === !!b.clarity
);
};
const showIcon =
function () {
banner.classList.remove(
'visible'
);
banner.style.display =
'none';
icon.style.display =
'flex';
requestAnimationFrame(
function () {
requestAnimationFrame(
function () {
icon.classList.add(
'visible'
);
}
);
}
);
};
const hideIcon =
function () {
icon.classList.remove(
'visible'
);
if (prefersReducedMotion) {
icon.style.display =
'none';
return;
}
window.setTimeout(
function () {
if (
!icon.classList.contains(
'visible'
)
) {
icon.style.display =
'none';
}
},
300
);
};
const showBanner =
function () {
hideIcon();
banner.style.display =
'block';
requestAnimationFrame(
function () {
requestAnimationFrame(
function () {
banner.classList.add(
'visible'
);
}
);
}
);
};
const hideBanner =
function () {
banner.classList.remove(
'visible'
);
if (prefersReducedMotion) {
banner.style.display =
'none';
return;
}
window.setTimeout(
function () {
banner.style.display =
'none';
},
350
);
};
let lastFocusedEl =
null;
let drawerHideTimer =
null;
const getFocusable =
function (container) {
return Array.from(
container.querySelectorAll(
'button:not([disabled]), [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
)
).filter(
function (el) {
return (
el.offsetParent !== null
);
}
);
};
const openDrawer =
function (open) {
if (drawerHideTimer) {
window.clearTimeout(
drawerHideTimer
);
drawerHideTimer =
null;
}
if (open) {
lastFocusedEl =
document.activeElement;
hideBanner();
hideIcon();
drawer.removeAttribute(
'hidden'
);
drawer.setAttribute(
'aria-hidden',
'false'
);
drawer.setAttribute(
'aria-modal',
'true'
);
drawer.inert =
false;
drawer.removeAttribute(
'inert'
);
drawer.classList.add(
'open'
);
icon.setAttribute(
'aria-expanded',
'true'
);
document.documentElement
.style
.overflow =
'hidden';
updateGPCInterface();
requestAnimationFrame(
function () {
const focusable =
getFocusable(
drawer
);
if (
focusable.length
) {
focusable[0].focus();
}
}
);
} else {
drawer.setAttribute(
'aria-hidden',
'true'
);
drawer.removeAttribute(
'aria-modal'
);
drawer.inert =
true;
drawer.setAttribute(
'inert',
''
);
drawer.classList.remove(
'open'
);
icon.setAttribute(
'aria-expanded',
'false'
);
document.documentElement
.style
.overflow =
'';
if (
lastFocusedEl &&
typeof lastFocusedEl.focus ===
'function'
) {
try {
lastFocusedEl.focus();
} catch (e) {}
}
if (prefersReducedMotion) {
drawer.setAttribute(
'hidden',
''
);
} else {
drawerHideTimer =
window.setTimeout(
function () {
drawer.setAttribute(
'hidden',
''
);
drawerHideTimer =
null;
},
300
);
}
if (getPrefs()) {
showIcon();
} else {
showBanner();
}
}
};
drawer.inert =
true;
drawer.setAttribute(
'inert',
''
);
document.addEventListener(
'keydown',
function (e) {
if (e.key === 'Escape') {
if (
!drawer.classList.contains(
'open'
)
) {
return;
}
e.preventDefault();
openDrawer(false);
return;
}
if (
e.key !== 'Tab' ||
!drawer.classList.contains(
'open'
)
) {
return;
}
const focusable =
getFocusable(
drawer
);
if (!focusable.length) {
return;
}
const first =
focusable[0];
const last =
focusable[
focusable.length - 1
];
if (
e.shiftKey &&
document.activeElement === first
) {
e.preventDefault();
last.focus();
} else if (
!e.shiftKey &&
document.activeElement === last
) {
e.preventDefault();
first.focus();
}
}
);
toggles.gtm.addEventListener(
'click',
function () {
if (hasGPC()) {
return;
}
const next =
!toggles.gtm.classList.contains(
'active'
);
setToggle(
toggles.gtm,
next
);
if (!next) {
setToggle(
toggles.ga,
false
);
setToggle(
toggles.yandex,
false
);
setToggle(
toggles.clarity,
false
);
}
updateGTMChildren();
}
);
[
toggles.ga,
toggles.yandex,
toggles.clarity
].forEach(
function (toggle) {
toggle.addEventListener(
'click',
function () {
if (
hasGPC() ||
toggles.gtm.disabled ||
!toggles.gtm.classList.contains(
'active'
)
) {
return;
}
const next =
!toggle.classList.contains(
'active'
);
setToggle(
toggle,
next
);
}
);
}
);
selectAll.addEventListener(
'click',
function () {
if (hasGPC()) {
return;
}
setToggle(
toggles.gtm,
true
);
setToggle(
toggles.ga,
true
);
setToggle(
toggles.yandex,
true
);
setToggle(
toggles.clarity,
true
);
updateGTMChildren();
}
);
deselectAll.addEventListener(
'click',
function () {
if (hasGPC()) {
return;
}
setToggle(
toggles.gtm,
false
);
setToggle(
toggles.ga,
false
);
setToggle(
toggles.yandex,
false
);
setToggle(
toggles.clarity,
false
);
updateGTMChildren();
}
);
accept.addEventListener(
'click',
function () {
if (hasGPC()) {
return;
}
const hadGTM =
!!document.getElementById(
'gtm-script'
);
const previousPrefs =
getPrefs();
const p = {
gtm: true,
ga: true,
yandex: true,
clarity: true,
blogger: true,
choiceMethod:
'accept_all'
};
setToggle(
toggles.gtm,
true
);
setToggle(
toggles.ga,
true
);
setToggle(
toggles.yandex,
true
);
setToggle(
toggles.clarity,
true
);
updateGTMChildren();
syncConsent(
p,
'accept_all'
);
hideBanner();
showIcon();
if (
hadGTM &&
previousPrefs &&
!sameConsentChoices(
previousPrefs,
p
)
) {
window.setTimeout(
function () {
window.location.reload();
},
50
);
}
}
);
reject.addEventListener(
'click',
function () {
const hadGTM =
!!document.getElementById(
'gtm-script'
);
const previousPrefs =
getPrefs();
const p =
allDeniedPrefs(
hasGPC()
? 'gpc'
: 'reject_all'
);
setToggle(
toggles.gtm,
false
);
setToggle(
toggles.ga,
false
);
setToggle(
toggles.yandex,
false
);
setToggle(
toggles.clarity,
false
);
updateGTMChildren();
syncConsent(
p,
p.choiceMethod
);
cleanupMeasurementCookies(
p
);
hideBanner();
showIcon();
if (
hadGTM &&
previousPrefs &&
!sameConsentChoices(
previousPrefs,
p
)
) {
window.setTimeout(
function () {
window.location.reload();
},
50
);
}
}
);
manage.addEventListener(
'click',
function () {
openDrawer(true);
}
);
inlineManage.addEventListener(
'click',
function () {
openDrawer(true);
}
);
icon.addEventListener(
'click',
function () {
openDrawer(true);
}
);
closeBtn.addEventListener(
'click',
function () {
openDrawer(false);
}
);
saveDrawer.addEventListener(
'click',
function () {
if (hasGPC()) {
return;
}
const hadGTM =
!!document.getElementById(
'gtm-script'
);
const previousPrefs =
getPrefs();
const p =
read();
const changed =
!sameConsentChoices(
previousPrefs,
p
);
syncConsent(
p,
'custom'
);
cleanupMeasurementCookies(
p
);
openDrawer(false);
if (
hadGTM &&
changed
) {
window.setTimeout(
function () {
window.location.reload();
},
50
);
}
}
);
const initialPrefs =
getPrefs();
if (hasGPC()) {
const denied =
allDeniedPrefs(
'gpc'
);
setToggle(
toggles.gtm,
false
);
setToggle(
toggles.ga,
false
);
setToggle(
toggles.yandex,
false
);
setToggle(
toggles.clarity,
false
);
updateConsent(
denied
);
updateGPCInterface();
showIcon();
} else if (!initialPrefs) {
setToggle(
toggles.gtm,
false
);
setToggle(
toggles.ga,
false
);
setToggle(
toggles.yandex,
false
);
setToggle(
toggles.clarity,
false
);
updateGTMChildren();
showBanner();
} else {
setToggle(
toggles.gtm,
!!initialPrefs.gtm
);
setToggle(
toggles.ga,
!!initialPrefs.ga
);
setToggle(
toggles.yandex,
!!initialPrefs.yandex
);
setToggle(
toggles.clarity,
!!initialPrefs.clarity
);
setToggle(
toggles.blogger,
true
);
updateGTMChildren();
updateConsent(
initialPrefs
);
loadGTM(
initialPrefs
);
showIcon();
}
window.addEventListener(
'storage',
function (e) {
if (e.key !== KEY) {
return;
}
const p =
getPrefs();
if (!p) {
if (
document.getElementById(
'gtm-script'
)
) {
window.location.reload();
} else {
showBanner();
}
return;
}
const current =
window.__hvConsent ||
null;
const choicesChanged =
!current ||
!!current.gtm !== !!p.gtm ||
!!current.ga !== !!p.ga ||
!!current.yandex !== !!p.yandex ||
!!current.clarity !== !!p.clarity;
setToggle(
toggles.gtm,
!!p.gtm
);
setToggle(
toggles.ga,
!!p.ga
);
setToggle(
toggles.yandex,
!!p.yandex
);
setToggle(
toggles.clarity,
!!p.clarity
);
updateGTMChildren();
updateConsent(
p
);
loadGTM(
p
);
showIcon();
if (
choicesChanged &&
document.getElementById(
'gtm-script'
)
) {
window.setTimeout(
function () {
window.location.reload();
},
50
);
}
}
);
window.addEventListener(
'pageshow',
function (event) {
if (!event.persisted) {
return;
}
if (hasGPC()) {
const denied =
allDeniedPrefs(
'gpc'
);
updateConsent(
denied
);
if (
document.getElementById(
'gtm-script'
)
) {
window.location.reload();
return;
}
updateGPCInterface();
showIcon();
return;
}
const p =
getPrefs();
if (!p) {
if (
document.getElementById(
'gtm-script'
)
) {
window.location.reload();
return;
}
showBanner();
return;
}
updateConsent(
p
);
loadGTM(
p
);
showIcon();
}
);
document.addEventListener(
'visibilitychange',
function () {
if (
document.visibilityState !==
'visible'
) {
return;
}
if (!hasGPC()) {
return;
}
const existingGTM =
document.getElementById(
'gtm-script'
);
if (existingGTM) {
window.location.reload();
return;
}
updateGPCInterface();
}
);
updateGPCInterface();
});
})();
//
  };

  /* Orijinal Blogger tema konumu: satir 39699 | hvjs-034 */
  parts["hvjs-034"] = function () {

//
(function (window, document) {
'use strict';
if (window.HVHomeGridV17Installed) return;
window.HVHomeGridV17Installed = true;
function norm(value) {
var text = String(value || '').trim();
try { text = decodeURIComponent(text.replace(/\+/g, '%20')); } catch (e) {}
return text.replace(/^_/, '').trim().toLocaleLowerCase('tr-TR');
}
function entryUrl(entry) {
var links = entry && entry.link || [];
var alt = links.find(function (item) { return item.rel === 'alternate'; });
return alt ? alt.href : '';
}
function upgradeFeedThumbnail(url) {
var source = String(url || '').trim();
if (!source || !/blogger\.googleusercontent\.com\/img\/|bp\.blogspot\.com/i.test(source)) return source;
var viewport = Math.max(320, window.innerWidth || document.documentElement.clientWidth || 1200);
var slot = viewport <= 767 ? (viewport - 40) / 2 : viewport <= 1023 ? (viewport - 64) / 2 : Math.min(320, (viewport - 96) / 4);
var ratio = Math.max(1, Math.min(2, window.devicePixelRatio || 1));
var needed = Math.max(320, slot * ratio);
var sizes = [320,480,640,800,960,1200];
var width = sizes.find(function (w) { return w >= needed; }) || 1200;
var height = Math.round(width * 9 / 16);
var segment = /\/(?:s\d+(?:-[a-z0-9]+)*|w\d+(?:-[a-z0-9]+)*)(?=\/)/i;
if (!segment.test(source)) return source;
return source.replace(segment, '/w' + width + '-c-h' + height);
}
function imageFromHtml(html, summaryOnly) {
if (!html) return '';
try {
var doc = new DOMParser().parseFromString(String(html), 'text/html');
var img = doc.querySelector('img[srcset], img[data-src], img[src]');
if (!img) return '';
var srcset = img.getAttribute('srcset') || '';
if (srcset) {
var candidates = srcset.split(',').map(function (part) {
var pair = part.trim().split(/\s+/);
var width = pair[1] && /w$/.test(pair[1]) ? parseInt(pair[1], 10) || 0 : 0;
return { url: pair[0], width: width };
}).filter(function (item) { return /^https?:|^\//i.test(item.url); });
candidates.sort(function (a, b) { return b.width - a.width; });
if (candidates.length) return upgradeFeedThumbnail(candidates[0].url);
}
return upgradeFeedThumbnail(img.getAttribute('src') || img.getAttribute('data-src') || '');
} catch (e) { return ''; }
}
function imageFor(entry) {
var contentImage = imageFromHtml(entry && entry.content && entry.content.$t, false);
if (contentImage) return contentImage;
var summaryImage = imageFromHtml(entry && entry.summary && entry.summary.$t, true);
if (summaryImage) return summaryImage;
var thumb = entry && entry['media$thumbnail'] && entry['media$thumbnail'].url;
return thumb ? upgradeFeedThumbnail(thumb) : '';
}
function parseLabelCounts(value, fallbackLabels, maxTotal) {
var tokens = String(value || '').split('/').map(function (part) { return part.trim(); }).filter(Boolean);
var specs = [];
var pendingCount = null;
var total = 0;
var limit = Math.max(1, parseInt(maxTotal, 10) || 24);
for (var i = 0; i < tokens.length; i++) {
var token = tokens[i];
if (/^\d+$/.test(token)) {
pendingCount = Math.max(1, Math.min(12, parseInt(token, 10) || 1));
continue;
}
if (total >= limit) break;
var count = pendingCount == null ? 1 : pendingCount;
pendingCount = null;
count = Math.min(count, limit - total);
if (!token) continue;
specs.push({ label: token, count: count });
total += count;
}
if (!specs.length) {
(fallbackLabels || []).some(function (label) {
if (total >= limit) return true;
specs.push({ label: label, count: 1 });
total++;
return false;
});
}
return specs;
}
function fetchLatestMany(label, requestedCount) {
if (typeof window.HVGetLabelFeed !== 'function') return Promise.resolve([]);
var wanted = Math.max(1, Math.min(12, parseInt(requestedCount, 10) || 1));
function tryLabel(value) {
return window.HVGetLabelFeed(value, 12).then(function (data) {
var entries = data && data.feed && data.feed.entry || [];
entries = entries.filter(function (entry) { return !!entryUrl(entry); });
var wantedNorm = norm(label);
var matching = entries.filter(function (entry) {
return (entry.category || []).some(function (cat) { return norm(cat.term) === wantedNorm; });
});
if (matching.length >= wanted) return matching.slice(0, wanted);
if (matching.length) {
var have = Object.create(null);
matching.forEach(function (entry) { have[entryUrl(entry)] = true; });
return matching.concat(entries.filter(function (entry) { return !have[entryUrl(entry)]; })).slice(0, wanted);
}
return entries.slice(0, wanted);
});
}
return tryLabel(label).then(function (entries) {
if (entries && entries.length) return entries;
if (String(label).trim().charAt(0) === '_') return [];
return tryLabel('_' + label).catch(function () { return []; });
}).catch(function () { return []; });
}
function fetchLatest(label) {
return fetchLatestMany(label, 1).then(function (entries) { return entries[0] || null; });
}
function normalizeCurrentUrl(url) {
try {
var parsed = new URL(url, window.location.origin);
return (parsed.origin + parsed.pathname).replace(/\/$/, '');
} catch (e) { return String(url || ''); }
}
function initSidebar() {
if (!document.body || !document.body.classList.contains('item')) return;
if (window.matchMedia && window.matchMedia('(max-width: 1023px)').matches) return;
var widget = document.querySelector('#sidebar-container #HTML25');
if (!widget || widget.getAttribute('data-hv-sidebar-ready') === '1') return;
var configEl = widget.querySelector('.hv-sidebar-config');
var storyMount = widget.querySelector('#hv-sidebar-stories-mount');
if (!configEl || !storyMount) return;
widget.setAttribute('data-hv-sidebar-ready', '1');
widget.classList.add('oz-sidebar-widget');
var config = String(configEl.textContent || '').trim();
configEl.setAttribute('aria-hidden', 'true');
var specs = parseLabelCounts(config, ['Ekonomi', 'Dünya', 'Bilim'], 24);
var block = document.createElement('section');
block.className = 'oz-blok';
block.setAttribute('aria-label', 'Son haberler');
block.setAttribute('data-nosnippet', 'true');
var blockTitle = document.createElement('div');
blockTitle.className = 'oz-blok-baslik';
blockTitle.textContent = 'SON HABERLER';
block.appendChild(blockTitle);
var grid = document.createElement('div');
grid.className = 'oz-grid';
grid.setAttribute('aria-live', 'polite');
block.appendChild(grid);
storyMount.appendChild(block);
var canonical = document.querySelector('link[rel="canonical"]');
var currentUrl = normalizeCurrentUrl((canonical && canonical.href) || window.location.href);
Promise.all(specs.map(function (spec) {
return fetchLatestMany(spec.label, Math.min(12, spec.count + 1)).then(function (entries) {
var usable = (entries || []).filter(function (entry) {
return entryUrl(entry) && normalizeCurrentUrl(entryUrl(entry)) !== currentUrl;
});
return { spec: spec, entries: usable.slice(0, spec.count) };
});
})).then(function (groups) {
var fragment = document.createDocumentFragment();
groups.forEach(function (group) {
group.entries.forEach(function (entry) {
var href = entryUrl(entry);
if (!href) return;
var title = entry.title && entry.title.$t ? entry.title.$t : 'Haberi oku';
var card = document.createElement('a');
card.className = 'oz-kart';
card.href = href;
card.target = '_blank';
card.rel = 'noopener noreferrer';
card.title = title;
card.setAttribute('aria-label', title);
var pic = imageFor(entry);
if (pic) {
var imageWrap = document.createElement('div');
imageWrap.className = 'oz-kart-img';
var img = document.createElement('img');
img.src = pic;
img.alt = title;
img.loading = 'lazy';
img.decoding = 'async';
img.onerror = function () {
if (imageWrap.parentNode) imageWrap.parentNode.removeChild(imageWrap);
};
imageWrap.appendChild(img);
card.appendChild(imageWrap);
}
var titleEl = document.createElement('div');
titleEl.className = 'oz-kart-baslik';
titleEl.textContent = title;
card.appendChild(titleEl);
fragment.appendChild(card);
});
});
grid.appendChild(fragment);
}).catch(function () {});
}
function init() {
initSidebar();
}
if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init, { once: true });
else init();
})(window, document);
//
  };

  /* Orijinal Blogger tema konumu: satir 44915 | hvjs-035 */
  parts["hvjs-035"] = function () {

//
(function () {
'use strict';
var staticSidebarPageTitles = [
'Açık Rıza Metni',
'Çerez Politikası',
'Çocuk Gizliliği Politikası',
'Düzeltme ve İtiraz Hakkı',
'Gizlilik Politikası',
'Hakkımızda',
'İletişim',
'Kullanım Koşulları',
'Künye',
'KVKK Aydınlatma Metni',
'Lisans ve Kullanım Koşulları',
'Reklam ve İş Birliği',
'Sorumluluk Reddi',
'Telif Hakları Politikası',
'Veri İşleme Envanteri',
'Yayın İlkeleri'
].map(function (name) { return name.replace(/\s+/g, ' ').trim().toLocaleLowerCase('tr-TR'); });
var staticSidebarPagePaths = {
'/p/acik-riza-metni.html': true,
'/p/cerez-politikasi.html': true,
'/p/cocuk-gizliligi-politikasi.html': true,
'/p/duzeltme-ve-itiraz-hakki.html': true,
'/p/gizlilik-politikasi.html': true,
'/p/hakkimizda.html': true,
'/p/iletisim.html': true,
'/p/kullanim-kosullari.html': true,
'/p/kunye.html': true,
'/p/kvkk-aydinlatma-metni.html': true,
'/p/lisans.html': true,
'/p/lisans-ve-kullanim-kosullari.html': true,
'/p/reklam-ve-isbirligi.html': true,
'/p/sorumluluk-reddi.html': true,
'/p/telif-haklari.html': true,
'/p/telif-haklari-politikasi.html': true,
'/p/veri-isleme-envanteri.html': true,
'/p/yayin-ilkeleri.html': true
};
function configureStaticPageLayoutMode(layout) {
var heading = layout.querySelector('.hv-static-page-content > .hv-static-page-heading');
var titleNode = heading ? heading.querySelector('h1.entry-title, h1, .entry-title') : null;
var title = titleNode ? (titleNode.textContent || '').replace(/\s+/g, ' ').trim().toLocaleLowerCase('tr-TR') : '';
var path = (window.location.pathname || '/').replace(/\/+$/, '').toLocaleLowerCase('tr-TR') || '/';
var showSidebar = staticSidebarPageTitles.indexOf(title) !== -1 || staticSidebarPagePaths[path] === true;
layout.classList.toggle('hv-static-page-full-width', !showSidebar);
}
function buildStaticPagesList() {
if (!document.body || !document.querySelector('.hv-static-page-layout')) return;
document.querySelectorAll('.hv-static-page-layout').forEach(function (layout) {
configureStaticPageLayoutMode(layout);
if (layout.classList.contains('hv-static-page-index-layout')) {
var heading = layout.querySelector('.hv-static-page-content > .hv-static-page-heading');
if (heading && layout.parentNode && heading.parentNode !== layout.parentNode) {
layout.parentNode.insertBefore(heading, layout);
}
}
var list = layout.querySelector('.hv-static-pages-list');
if (!list || list.getAttribute('data-hv-built') === '1') return;
var sourceLinks = document.querySelectorAll('#footer-wrapper a[href], #footer-container a[href]');
var byPath = Object.create(null);
var pages = [];
Array.prototype.forEach.call(sourceLinks, function (sourceLink) {
var rawHref = sourceLink.getAttribute('href') || '';
if (!rawHref || /^\s*(javascript:|mailto:|tel:|#)/i.test(rawHref)) return;
var url;
try { url = new URL(rawHref, window.location.href); } catch (e) { return; }
if (url.origin !== window.location.origin || !/^\/p\//i.test(url.pathname)) return;
if (/\/p\/paneli\.html$/i.test(url.pathname)) return;
var name = (sourceLink.textContent || sourceLink.getAttribute('title') || sourceLink.getAttribute('aria-label') || '').replace(/\s+/g, ' ').trim();
if (!name || name.length > 140) return;
var path = url.pathname.replace(/\/+$/, '') || '/';
var key = path.toLocaleLowerCase('tr-TR');
var existing = byPath[key];
if (existing) {
  if (name.length > existing.name.length) existing.name = name;
  return;
}
var item = { name: name, href: url.origin + path, order: pages.length };
byPath[key] = item;
pages.push(item);
});
pages.sort(function (a, b) {
var byName = a.name.localeCompare(b.name, 'tr', { sensitivity: 'base' });
return byName || a.href.localeCompare(b.href, 'tr');
});
list.replaceChildren();
pages.forEach(function (page) {
var li = document.createElement('li');
var a = document.createElement('a');
a.href = page.href;
a.textContent = page.name;
a.title = page.name;
li.appendChild(a);
list.appendChild(li);
});
list.setAttribute('data-hv-built', '1');
});
}
function openEmbeddedCommentForm(form) {
if (!form) return;
form.classList.add('hv-comment-editor-active');
form.removeAttribute('data-hv-comment-pending');
form.removeAttribute('data-hv-comment-pending-at');
var frame = form.querySelector('iframe#comment-editor');
var sourceLink = form.querySelector('a#comment-editor-src');
if (frame) {
frame.setAttribute('loading', 'eager');
var frameSrc = (frame.getAttribute('src') || '').trim();
if ((!frameSrc || frameSrc === 'about:blank') && sourceLink && sourceLink.href) {
frame.setAttribute('src', sourceLink.href);
}
window.setTimeout(function () {
try { frame.scrollIntoView({ behavior: 'smooth', block: 'nearest' }); } catch (ignore) {}
}, 80);
}
}
document.addEventListener('click', function (event) {
var link = event.target && event.target.closest ? event.target.closest('.hv-comment-login-prompt,.hv-comment-login-button') : null;
if (!link) return;
var form = link.closest('.comment-form');
if (!form) return;
event.preventDefault();
openEmbeddedCommentForm(form);
});
if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', buildStaticPagesList, { once: true });
else buildStaticPagesList();
})();
//
  };

  /* Orijinal Blogger tema konumu: satir 45051 | hvjs-036 */
  parts["hvjs-036"] = function () {

//
(function () {
'use strict';
var payloadSelector = 'ins.adsbygoogle,iframe,[data-ad-slot],[data-ad-client],[id^="google_ads"],.adsbygoogle,a[href],img[src]';
var placeholderSelector = '.hv-ad-widget-placeholder,.hv-side-rail-placeholder,.hv-ad-slot-placeholder,.piki-ads[aria-hidden="true"],.piki-ads-res[aria-hidden="true"]';
function hasPayload(root) {
  return !!(root && root.querySelector && (root.matches(payloadSelector) || root.querySelector(payloadSelector)));
}
function removeEmptyPlaceholders(root, preserveWhenEmpty) {
  if (!root || !root.querySelectorAll) return;
  var rootHasPayload = hasPayload(root);
  root.querySelectorAll(placeholderSelector).forEach(function (node) {
    if (rootHasPayload || hasPayload(node)) {
      node.remove();
      return;
    }
    if (preserveWhenEmpty) {
      node.classList.add('hv-ad-visible-placeholder');
      node.removeAttribute('aria-hidden');
      node.setAttribute('data-hv-placeholder-visible', '1');
      node.style.setProperty('display', 'flex', 'important');
      node.style.setProperty('visibility', 'visible', 'important');
      node.style.setProperty('opacity', '1', 'important');
    } else {
      node.remove();
    }
  });
}
function firstEnabledWidget(root) {
  if (!root || !root.querySelectorAll) return null;
  var list = root.querySelectorAll('.hv-ad-managed-widget,.widget');
  for (var i = 0; i < list.length; i++) {
    var widget = list[i];
    if (widget.hidden || widget.getAttribute('aria-hidden') === 'true') continue;
    if (widget.style && widget.style.display === 'none') continue;
    return widget;
  }
  return null;
}
function setAdReady(element, ready) {
  if (!element) return;
  /* Başarısız/anlık boş içerik kontrolü hiçbir alanı .hv-ad-empty ile kapatmaz. */
  element.classList.remove('hv-ad-empty');
  if (ready) element.setAttribute('data-hv-ad-ready', '1');
}
function activateWidget(widget) {
  if (!widget) return;
  removeEmptyPlaceholders(widget, true);
  widget.classList.add('hv-ad-managed-widget');
  widget.setAttribute('data-hv-ad-ready', '1');
  widget.style.setProperty('display', 'block', 'important');
  widget.style.setProperty('visibility', 'visible', 'important');
  widget.style.setProperty('opacity', '1', 'important');
  widget.style.setProperty('max-height', 'none', 'important');
  widget.style.setProperty('overflow', 'visible', 'important');
  var content = widget.querySelector('.widget-content');
  if (content) {
    content.style.setProperty('display', 'block', 'important');
    content.style.setProperty('visibility', 'visible', 'important');
    content.style.setProperty('opacity', '1', 'important');
    content.style.setProperty('max-height', 'none', 'important');
    content.style.setProperty('overflow', 'visible', 'important');
  }
}
function manageRoot(root) {
  if (!root) return;
  var widget = firstEnabledWidget(root);
  var stableDesktop = !!(window.matchMedia && window.matchMedia('(min-width: 1024px)').matches);
  /* Desktop: keep empty/moving slots collapsed until the real widget is present. */
  if (stableDesktop && !widget) {
    root.classList.add('hv-ad-empty');
    return;
  }
  root.classList.remove('hv-ad-empty');
  if (widget) {
    activateWidget(widget);
    removeEmptyPlaceholders(root, true);
    setAdReady(root, true);
  }
}
function manageSlots() {
  ['.hv-masthead-ad-wrap','#hv-home-below-grid-ad-wrap','#footer-ads','#hv-side-rail-left','#hv-side-rail-right'].forEach(function (selector) {
    manageRoot(document.querySelector(selector));
  });
  var slotIds = [
    'hv-static-ad-top','hv-static-ad-lower','hv-static-ad-lower-second',
    'hv-static-ad-end','hv-static-ad-end-second',
    'hv-sidebar-ad-before-slot','hv-sidebar-ad-after-slot','hv-inline-ad-slot'
  ];
  slotIds.forEach(function (id) {
    var slot = document.getElementById(id);
    if (!slot) return;
    var widget = firstEnabledWidget(slot);
    var stableDesktop = !!(window.matchMedia && window.matchMedia('(min-width: 1024px)').matches);
    if (stableDesktop && !widget) {
      slot.classList.add('hv-ad-empty');
      var emptyPlaceholder = slot.querySelector(placeholderSelector);
      if (emptyPlaceholder && !hasPayload(slot)) emptyPlaceholder.remove();
      return;
    }
    slot.classList.remove('hv-ad-empty');
    if (widget) {
      activateWidget(widget);
      removeEmptyPlaceholders(slot, true);
      setAdReady(slot, true);
    } else {
      var placeholder = slot.querySelector(placeholderSelector);
      if (placeholder && !hasPayload(slot)) placeholder.remove();
    }
  });
  document.querySelectorAll('.hv-static-ad-pair').forEach(function (pair) {
    var widget = firstEnabledWidget(pair);
    var stableDesktop = !!(window.matchMedia && window.matchMedia('(min-width: 1024px)').matches);
    if (stableDesktop && !widget) {
      pair.classList.add('hv-ad-empty');
      return;
    }
    pair.classList.remove('hv-ad-empty');
    if (widget) {
      activateWidget(widget);
      removeEmptyPlaceholders(pair, true);
      setAdReady(pair, true);
    }
  });
}
function observeAreas() {
  if (!window.MutationObserver || !document.body) return;
  var roots = Array.prototype.slice.call(document.querySelectorAll('.hv-masthead-ad-wrap,#hv-home-below-grid-ad-wrap,#footer-ads,#hv-side-rail-left,#hv-side-rail-right,#hv-ad-widget-bank,#postBody,.hv-static-ad-slot,.hv-sidebar-ad-slot,.hv-static-ad-pair'));
  var observer = new MutationObserver(function () {
    if (observer._hvQueued) return;
    observer._hvQueued = true;
    window.requestAnimationFrame(function () {
      observer._hvQueued = false;
      manageSlots();
    });
  });
  roots.forEach(function (root) {
    observer.observe(root, { childList: true, subtree: true, characterData: true });
  });
}
function init() {
  manageSlots();
  observeAreas();
}
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', init, { once: true });
} else {
  init();
}
})();
//
  };

  /* Orijinal Blogger tema konumu: satir 45207 | hvjs-037 */
  parts["hvjs-037"] = function () {

//
(function () {
'use strict';
function removeLegacyOpeners(root) {
var scope = root || document;
if (scope.nodeType === 1 && scope.matches && scope.matches('#show-comment-form')) {
scope.remove();
return;
}
if (!scope.querySelectorAll) return;
scope.querySelectorAll('#show-comment-form').forEach(function (button) {
button.remove();
});
}
function init() {
removeLegacyOpeners(document);
if (document.body && window.MutationObserver) {
var observer = new MutationObserver(function (records) {
records.forEach(function (record) {
record.addedNodes.forEach(function (node) {
if (node.nodeType !== 1) return;
if ((node.matches && node.matches('#show-comment-form')) ||
(node.querySelector && node.querySelector('#show-comment-form'))) {
removeLegacyOpeners(node);
}
});
});
});
observer.observe(document.body, { childList: true, subtree: true });
}
}
if (document.readyState === 'loading') {
document.addEventListener('DOMContentLoaded', init, { once: true });
} else {
init();
}
})();
//
  };

  /* Orijinal Blogger tema konumu: satir 45251 | hvjs-038 */
  parts["hvjs-038"] = function () {

//
(function () {
'use strict';
function styleRelatedLink() {
  document.querySelectorAll('.related-evo .widget-title h3').forEach(function (heading) {
    if (heading.getAttribute('data-hv-v55-related-title') === '1') return;
    heading.textContent = 'BENZER HABERLER';
    heading.setAttribute('data-hv-v55-related-title', '1');
  });
  document.querySelectorAll('.related-evo .widget-title a.simple-viewmore').forEach(function (a) {
    a.setAttribute('aria-label', 'Benzer haberlerin tümünü görüntüle');
    a.setAttribute('title', 'Benzer haberler etiketine git');
  });
}
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', styleRelatedLink, { once: true });
} else {
  styleRelatedLink();
}
})();
//
  };

  /* Orijinal Blogger tema konumu: satir 45278 | hvjs-039 */
  parts["hvjs-039"] = function () {

//
(function () {
  var selector = 'body.item-view .author-row-clean time.post-date, body.item .author-row-clean time.post-date, body.static_page .author-row-clean time.post-date';
  function formatOne(el) {
    var raw = el.getAttribute('datetime') || el.getAttribute('data-date') || el.textContent || '';
    raw = String(raw).trim();
    if (!raw) {
      if (el.style && el.style.setProperty) el.style.setProperty('visibility', 'visible', 'important');
      return;
    }

    var d = new Date(raw);
    var shown = '';
    if (!isNaN(d.getTime())) {
      try {
        var parts = new Intl.DateTimeFormat('tr-TR', {
          timeZone: 'Europe/Istanbul', day: '2-digit', month: '2-digit', year: 'numeric'
        }).formatToParts(d);
        var values = {};
        parts.forEach(function (part) { values[part.type] = part.value; });
        var dateText = (values.day || '') + '.' + (values.month || '') + '.' + (values.year || '');
        var timeText = new Intl.DateTimeFormat('en-GB', {
          timeZone: 'Europe/Istanbul', hour: '2-digit', minute: '2-digit', hourCycle: 'h23'
        }).format(d);
        shown = dateText + ' - ' + timeText;
      } catch (e) { shown = ''; }
    }
    if (!shown) {
      var match = raw.match(/^(\d{4})-(\d{2})-(\d{2})[T ](\d{2}):(\d{2})/);
      if (match) shown = match[3] + '.' + match[2] + '.' + match[1] + ' - ' + match[4] + ':' + match[5];
    }

    /* Biçimlendirme başarısızsa mevcut tarih kaybolmasın; başarılıysa tek seferde yaz. */
    if (shown && el.textContent.trim() !== shown) el.textContent = shown;
    if (shown) {
      el.setAttribute('data-hv-meta-formatted', '1');
      el.setAttribute('aria-label', shown);
    }
    if (el.style && el.style.setProperty) el.style.setProperty('visibility', 'visible', 'important');
    else el.style.visibility = 'visible';
  }

  function run() {
    document.querySelectorAll(selector).forEach(formatOne);
  }
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', run, { once: true });
  } else {
    run();
  }
})();
//
  };

  /* Orijinal Blogger tema konumu: satir 45335 | hvjs-040 */
  parts["hvjs-040"] = function () {
//
(function(){
'use strict';
const ULKE_VERISI = {
'Afrika': [
['dz', 'Cezayir'], ['ao', 'Angola'], ['bj', 'Benin'], ['bw', 'Botsvana'], ['bf', 'Burkina Faso'],
['bi', 'Burundi'], ['dj', 'Cibuti'], ['cd', 'Demokratik Kongo Cumhuriyeti'], ['gq', 'Ekvator Ginesi'],
['er', 'Eritre'], ['sz', 'Esvatini'], ['et', 'Etiyopya'], ['ma', 'Fas'], ['ci', 'Fildişi Sahili'],
['ga', 'Gabon'], ['gm', 'Gambiya'], ['gh', 'Gana'], ['gn', 'Gine'], ['gw', 'Gine-Bissau'],
['za', 'Güney Afrika'], ['ss', 'Güney Sudan'], ['cm', 'Kamerun'], ['ke', 'Kenya'], ['km', 'Komorlar'],
['cg', 'Kongo Cumhuriyeti'], ['ls', 'Lesotho'], ['lr', 'Liberya'], ['ly', 'Libya'], ['mg', 'Madagaskar'],
['mw', 'Malavi'], ['ml', 'Mali'], ['eg', 'Mısır'], ['mu', 'Mauritius'], ['yt', 'Mayotte'],
['mr', 'Moritanya'], ['mz', 'Mozambik'], ['na', 'Namibya'], ['ne', 'Nijer'], ['ng', 'Nijerya'],
['cf', 'Orta Afrika Cumhuriyeti'], ['rw', 'Ruanda'], ['st', 'S\u00E3o Tom\u00E9 ve Pr\u00EDncipe'], ['sn', 'Senegal'],
['sc', 'Seyşeller'], ['sl', 'Sierra Leone'], ['so', 'Somali'], ['sd', 'Sudan'], ['tz', 'Tanzanya'],
['tg', 'Togo'], ['tn', 'Tunus'], ['ug', 'Uganda'], ['zm', 'Zambiya'], ['zw', 'Zimbabve'],
['eh', 'Batı Sahra'], ['re', 'Reunion'], ['sh', 'Saint Helena, Ascension ve Tristan da Cunha'],
['td', 'Çad'], ['cv', 'Yeşil Burun Adaları']
],
'Asya': [
['af', 'Afganistan'], ['az', 'Azerbaycan'], ['bh', 'Bahreyn'], ['bd', 'Bangladeş'], ['bt', 'Bhutan'],
['ae', 'Birleşik Arap Emirlikleri'], ['bn', 'Brunei'], ['cn', 'Çin'], ['id', 'Endonezya'], ['am', 'Ermenistan'],
['ph', 'Filipinler'], ['ge', 'Gürcistan'], ['kr', 'Güney Kore'], ['in', 'Hindistan'], ['iq', 'Irak'],
['ir', 'İran'], ['il', 'İsrail'], ['jp', 'Japonya'], ['kh', 'Kamboçya'], ['qa', 'Katar'],
['kz', 'Kazakistan'], ['kg', 'Kırgızistan'], ['cy', 'Kıbrıs Cumhuriyeti'], ['kw', 'Kuveyt'], ['kp', 'Kuzey Kore'],
['la', 'Laos'], ['lb', 'Lübnan'], ['my', 'Malezya'], ['mv', 'Maldivler'], ['mn', 'Moğolistan'],
['mm', 'Myanmar'], ['np', 'Nepal'], ['uz', 'Özbekistan'], ['pk', 'Pakistan'], ['ps', 'Filistin'],
['sg', 'Singapur'], ['lk', 'Sri Lanka'], ['sy', 'Suriye'], ['sa', 'Suudi Arabistan'], ['tj', 'Tacikistan'],
['th', 'Tayland'], ['tw', 'Tayvan'], ['tl', 'Doğu Timor'], ['tr', 'Türkiye'], ['tm', 'Türkmenistan'],
['om', 'Umman'], ['vn', 'Vietnam'], ['ye', 'Yemen'], ['jo', 'Ürdün'], ['hk', 'Hong Kong'], ['mo', 'Makao']
],
'Avrupa': [
['de', 'Almanya'], ['ad', 'Andorra'], ['al', 'Arnavutluk'], ['at', 'Avusturya'], ['by', 'Belarus'],
['be', 'Belçika'], ['gb', 'Birleşik Krallık'], ['ba', 'Bosna-Hersek'], ['bg', 'Bulgaristan'], ['cz', 'Çekya'],
['dk', 'Danimarka'], ['ee', 'Estonya'], ['fi', 'Finlandiya'], ['fr', 'Fransa'], ['hr', 'Hırvatistan'],
['nl', 'Hollanda'], ['ie', 'İrlanda'], ['es', 'İspanya'], ['se', 'İsveç'], ['ch', 'İsviçre'],
['it', 'İtalya'], ['is', 'İzlanda'], ['me', 'Karadağ'], ['xk', 'Kosova'], ['mk', 'Kuzey Makedonya'],
['lv', 'Letonya'], ['li', 'Liechtenstein'], ['lt', 'Litvanya'], ['lu', 'Lüksemburg'], ['hu', 'Macaristan'],
['mt', 'Malta'], ['md', 'Moldova'], ['mc', 'Monako'], ['no', 'Norveç'], ['pl', 'Polonya'],
['pt', 'Portekiz'], ['ro', 'Romanya'], ['ru', 'Rusya'], ['sm', 'San Marino'], ['rs', 'Sırbistan'],
['sk', 'Slovakya'], ['si', 'Slovenya'], ['va', 'Vatikan'], ['gr', 'Yunanistan'], ['ax', '\u00C5land Adaları'],
['gi', 'Cebelitarık'], ['fo', 'Faroe Adaları'], ['gg', 'Guernsey'], ['je', 'Jersey'], ['im', 'Man Adası'],
['sj', 'Svalbard ve Jan Mayen'], ['ua', 'Ukrayna']
],
'Kuzey Amerika': [
['us', 'Amerika Birleşik Devletleri', 'ABD'], ['um', 'ABD Küçük Harici Adaları'], ['vi', 'ABD Virjin Adaları'],
['as', 'Amerikan Samoası'], ['ai', 'Anguilla'], ['ag', 'Antigua ve Barbuda'], ['aw', 'Aruba'], ['bs', 'Bahamalar'],
['bb', 'Barbados'], ['bz', 'Belize'], ['bm', 'Bermuda'], ['vg', 'Britanya Virjin Adaları'], ['ky', 'Cayman Adaları'],
['cw', 'Curaçao'], ['do', 'Dominik Cumhuriyeti'], ['dm', 'Dominika'], ['sv', 'El Salvador'], ['gl', 'Grönland'],
['gp', 'Guadeloupe'], ['gu', 'Guam'], ['gt', 'Guatemala'], ['ht', 'Haiti'], ['hn', 'Honduras'], ['jm', 'Jamaika'],
['ca', 'Kanada'], ['bq', 'Karayip Hollandası'], ['cr', 'Kosta Rika'], ['cu', 'Küba'], ['mx', 'Meksika'],
['ms', 'Montserrat'], ['ni', 'Nikaragua'], ['pa', 'Panama'], ['pr', 'Porto Riko'], ['bl', 'Saint Barth\u00E9lemy'],
['kn', 'Saint Kitts ve Nevis'], ['lc', 'Saint Lucia'], ['mf', 'Saint Martin'], ['vc', 'Saint Vincent ve Grenadinler'],
['sx', 'Sint Maarten'], ['tt', 'Trinidad ve Tobago'], ['tc', 'Turks ve Caicos Adaları'], ['gd', 'Grenada'],
['mq', 'Martinik'], ['pm', 'Saint-Pierre ve Miquelon']
],
'Güney Amerika': [
['ar', 'Arjantin'], ['bo', 'Bolivya'], ['br', 'Brezilya'], ['cl', 'Şili'], ['ec', 'Ekvador'], ['fk', 'Falkland Adaları'],
['gf', 'Fransız Guyanası'], ['gy', 'Guyana'], ['co', 'Kolombiya'], ['py', 'Paraguay'], ['pe', 'Peru'], ['sr', 'Surinam'],
['uy', 'Uruguay'], ['ve', 'Venezuela']
],
'Okyanusya': [
['au', 'Avustralya'], ['ck', 'Cook Adaları'], ['cc', 'Cocos (Keeling) Adaları'], ['cx', 'Christmas Adası'], ['fj', 'Fiji'],
['pf', 'Fransız Polinezyası'], ['hm', 'Heard Adası ve McDonald Adaları'], ['ki', 'Kiribati'], ['mh', 'Marshall Adaları'],
['fm', 'Mikronezya'], ['nr', 'Nauru'], ['nu', 'Niue'], ['nf', 'Norfolk Adası'], ['nc', 'Yeni Kaledonya'], ['nz', 'Yeni Zelanda'],
['pw', 'Palau'], ['pn', 'Pitcairn Adaları'], ['ws', 'Samoa'], ['sb', 'Solomon Adaları'], ['tk', 'Tokelau'], ['to', 'Tonga'],
['tv', 'Tuvalu'], ['vu', 'Vanuatu'], ['wf', 'Wallis ve Futuna'], ['mp', 'Kuzey Mariana Adaları'], ['pg', 'Papua Yeni Gine']
],
'Antarktika': [
['aq', 'Antarktika'], ['bv', 'Bouvet Adası'], ['io', 'Britanya Hint Okyanusu Toprakları'],
['tf', 'Fransız Güney ve Antarktika Toprakları'], ['gs', 'Güney Georgia ve Güney Sandwich Adaları']
]
};
const KITA_SIRASI = ['Avrupa', 'Asya', 'Afrika', 'Kuzey Amerika', 'Güney Amerika', 'Okyanusya', 'Antarktika'];
const IKONLAR = {
'dunya': '<svg viewBox="0 0 24 24"><defs><radialGradient id="__P__a" cx="35%" cy="30%" r="75%"><stop offset="0" stop-color="#bbdefb"/><stop offset=".55" stop-color="#1e88e5"/><stop offset="1" stop-color="#0d47a1"/></radialGradient></defs><circle cx="12" cy="12" r="10.5" fill="url(#__P__a)"/><g fill="#66bb6a"><ellipse cx="8.4" cy="9.2" rx="2.7" ry="3.9" transform="rotate(12 8.4 9.2)"/><ellipse cx="15.2" cy="7.6" rx="2.9" ry="2.1" transform="rotate(-14 15.2 7.6)"/><ellipse cx="15.9" cy="15.4" rx="2.1" ry="3" transform="rotate(8 15.9 15.4)"/></g><g fill="none" stroke="#fff" stroke-opacity=".35" stroke-width=".9"><ellipse cx="12" cy="12" rx="4.6" ry="10.5"/><path d="M1.5 12h21"/></g><ellipse cx="8" cy="6.2" rx="3" ry="1.6" fill="#fff" fill-opacity=".45" transform="rotate(-20 8 6.2)"/></svg>',
'ekonomi': '<svg viewBox="0 0 24 24"><defs><linearGradient id="__P__a" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#81c784"/><stop offset="1" stop-color="#1b5e20"/></linearGradient></defs><rect x="2.5" y="13" width="4.6" height="8.5" rx="1.1" fill="url(#__P__a)"/><rect x="9.7" y="9.5" width="4.6" height="12" rx="1.1" fill="url(#__P__a)"/><rect x="16.9" y="5" width="4.6" height="16.5" rx="1.1" fill="url(#__P__a)"/><path d="M2.6 10.4 8 6.2l4.4 2.6 8.1-5.3" fill="none" stroke="#ffb300" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/><path d="M16.2 3.2h4.9v4.9" fill="none" stroke="#ffb300" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg>',
'teknoloji': '<svg viewBox="0 0 24 24"><defs><linearGradient id="__P__a" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#607d8b"/><stop offset="1" stop-color="#1c262d"/></linearGradient></defs><path d="M8.5 2.5v3.2M12 2.5v3.2M15.5 2.5v3.2M8.5 18.3v3.2M12 18.3v3.2M15.5 18.3v3.2M2.5 8.5h3.2M2.5 12h3.2M2.5 15.5h3.2M18.3 8.5h3.2M18.3 12h3.2M18.3 15.5h3.2" stroke="#ffb300" stroke-width="1.7" stroke-linecap="round"/><rect x="5" y="5" width="14" height="14" rx="2.4" fill="url(#__P__a)"/><rect x="8.6" y="8.6" width="6.8" height="6.8" rx="1.2" fill="#29b6f6"/></svg>',
'bilim': '<svg viewBox="0 0 64 64" aria-hidden="true" focusable="false"><defs><linearGradient id="__P__rocketBody" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#ffffff"/><stop offset=".35" stop-color="#e4f5ff"/><stop offset=".7" stop-color="#9bd9f4"/><stop offset="1" stop-color="#5ca8d8"/></linearGradient><linearGradient id="__P__rocketFin" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#ffb24a"/><stop offset="1" stop-color="#f06a43"/></linearGradient><linearGradient id="__P__rocketFlame" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#fff59b"/><stop offset=".5" stop-color="#ffb52e"/><stop offset="1" stop-color="#ff7043"/></linearGradient></defs><g transform="rotate(27 32 32)"><path d="M32 5C25.6 12.2 22.4 20.7 22.9 31.7L26.7 42h10.6l3.8-10.3C41.6 20.7 38.4 12.2 32 5Z" fill="url(#__P__rocketBody)" stroke="#4d9bc9" stroke-width="1.05" stroke-linejoin="round"/><path d="M23.6 27.8 14.3 36.5l1.1-14.2 8.5-4.4ZM40.4 27.8l9.3 8.7-1.1-14.2-8.5-4.4Z" fill="url(#__P__rocketFin)" stroke="#df6544" stroke-width=".9" stroke-linejoin="round"/><path d="M27 40.8 27.4 47.2 32 44.6l4.6 2.6.4-6.4Z" fill="#f3f8fb" stroke="#8ac5e5" stroke-width=".8"/><circle cx="32" cy="22.4" r="5.3" fill="#328bc4" stroke="#ffffff" stroke-width="1.6"/><circle cx="32" cy="22.4" r="3.1" fill="#b9f2ff"/><path d="M29.8 20.5q1.3-1.4 2.7-.8" fill="none" stroke="#fff" stroke-width="1.2" stroke-linecap="round"/><path d="M28 47.1Q28.4 52.5 32 59Q35.6 52.5 36 47.1L32 49.4Z" fill="url(#__P__rocketFlame)" stroke="#f39a33" stroke-width=".75"/><path d="M30.2 48.7q.7 4 1.8 6.4 1.1-2.4 1.8-6.4L32 50Z" fill="#fff7c4"/><path d="M26 13.1q-2.2 4-2.7 8.6M37.6 12.6q2.1 4.4 2.8 9" fill="none" stroke="#fff" stroke-width="1.2" opacity=".9" stroke-linecap="round"/></g><path d="M10 15l1.2 3.1 3.1 1.2-3.1 1.2L10 24l-1.2-3.5-3.1-1.2 3.1-1.2Z" fill="#f8c94e"/><path d="M51 45l.8 2.1 2.1.8-2.1.8L51 50l-.8-2.3-2.1-.8 2.1-.8Z" fill="#72c9ee"/></svg>',
'tarih': '<svg viewBox="0 0 24 24"><defs><linearGradient id="__P__c" x1="0" y1="0" x2="1" y2="0"><stop offset="0" stop-color="#fff8e1"/><stop offset=".5" stop-color="#ffe0b2"/><stop offset="1" stop-color="#d7a86e"/></linearGradient></defs><path d="M12 2.4 22 8.2H2Z" fill="#e57373"/><rect x="2" y="8.2" width="20" height="2.1" rx=".6" fill="#ffcc80"/><g fill="url(#__P__c)"><rect x="3.5" y="10.8" width="3" height="8.4" rx=".4"/><rect x="8.17" y="10.8" width="3" height="8.4" rx=".4"/><rect x="12.83" y="10.8" width="3" height="8.4" rx=".4"/><rect x="17.5" y="10.8" width="3" height="8.4" rx=".4"/></g><rect x="2" y="19.2" width="20" height="2.6" rx=".7" fill="#8d6e63"/></svg>',
'gezilecek': '<svg viewBox="0 0 64 64" aria-hidden="true" focusable="false"><defs><linearGradient id="__P__everestRock" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#6fc7dc"/><stop offset=".42" stop-color="#4e94ae"/><stop offset="1" stop-color="#34677f"/></linearGradient><linearGradient id="__P__everestShade" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#b9d9e8"/><stop offset="1" stop-color="#5e9eb8"/></linearGradient><linearGradient id="__P__everestSnow" x1="0" y1="0" x2="0.8" y2="1"><stop offset="0" stop-color="#ffffff"/><stop offset=".58" stop-color="#f2fbff"/><stop offset="1" stop-color="#cce8f4"/></linearGradient></defs><path d="M2.8 53.8 15.2 30.4 22.2 38.4 39.2 6.2 61.3 53.8Z" fill="url(#__P__everestRock)" stroke="#34758e" stroke-width=".9" stroke-linejoin="round"/><path d="M15.2 30.4 22.2 38.4 32.5 24.9 39.2 6.2 46 22.1 41.2 19.2 37 25.6 31.8 22.4 26.4 32.5 22.2 38.4Z" fill="url(#__P__everestShade)"/><path d="M39.2 6.2 34 18.2 37.6 16.6 35.1 22.2 39.7 20.3 41.8 25 45 21.3 49.2 31.5 53.2 33.8 46 22.1Z" fill="url(#__P__everestSnow)" stroke="#d4edf8" stroke-width=".55" stroke-linejoin="round"/><path d="M39.2 6.2 37.1 16.8 33.7 19.5 35.2 22.3 30.9 25.6 31.8 22.4 26.4 32.5 22.2 38.4 15.2 30.4 19.4 32.7 22.4 27.4 26.2 30.3 31.2 19.7 34.3 15.9Z" fill="#ffffff"/><path d="M2.8 53.8 15.2 30.4 19.9 45.4 29.4 35.8 39.2 53.8Z" fill="#4f91ad" opacity=".88"/><path d="M39.2 6.2 46 22.1 61.3 53.8 48.7 45.2 43.9 35.8 40.2 26.3 37.8 18.3Z" fill="#285e79" opacity=".54"/><path d="M3 53.8 19.2 48.5 29.4 52.2 41 47.9 61.3 53.8 61.3 58H3Z" fill="#71b84b"/><path d="M7.5 55.4 18 52.4 25 55.6M39.7 54.4 47 51.8 57 55.4" fill="none" stroke="#b9df78" stroke-width="1.7" stroke-linecap="round"/></svg>',
'spor': '<svg viewBox="0 0 64 64" aria-hidden="true" focusable="false"><defs><radialGradient id="__P__basketBall" cx="28%" cy="20%" r="82%"><stop offset="0" stop-color="#ffd17a"/><stop offset=".36" stop-color="#f59b2b"/><stop offset=".76" stop-color="#e87919"/><stop offset="1" stop-color="#bd4e10"/></radialGradient><clipPath id="__P__basketClip"><circle cx="32" cy="31" r="25.2"/></clipPath></defs><circle cx="32" cy="31" r="26.1" fill="url(#__P__basketBall)" stroke="#b95614" stroke-width="1.25"/><g clip-path="url(#__P__basketClip)" fill="none" stroke="#713b1d" stroke-width="2.35" stroke-linecap="round"><path d="M29.5 5.8C22 16.2 22 45.7 31.7 56.2"/><path d="M34.5 5.8C42 16.2 42 45.7 32.3 56.2"/><path d="M6.8 22.3C20.2 28.8 43.8 28.8 57.2 22.3"/><path d="M6.8 39.8C20.2 33.2 43.8 33.2 57.2 39.8"/></g><path d="M15.2 13.4C19.7 8.8 25.1 6.6 30.8 6.2" fill="none" stroke="#fff0c6" stroke-width="2.4" stroke-linecap="round"/><path d="M12 45.4C15 50.2 19.4 53.3 24.1 54.9" fill="none" stroke="#f6b15c" stroke-width="1.6" stroke-linecap="round"/></svg>',
'ulkeler': '<svg viewBox="0 0 24 24"><path d="M1.8 5.6 8 3.4v16.9l-6.2 2.2z" fill="#42a5f5"/><path d="M8 3.4 16 6.2v15.3L8 20.3z" fill="#66bb6a"/><path d="M16 6.2 22.2 4v15.6L16 21.5z" fill="#ffa726"/><path d="M12 5.6c-2.3 0-4 1.8-4 4 0 2.9 4 7.5 4 7.5s4-4.6 4-7.5c0-2.2-1.7-4-4-4z" fill="#e53935"/><circle cx="12" cy="9.6" r="1.5" fill="#fff"/></svg>',
'gastronomi': '<svg viewBox="0 0 64 64" aria-hidden="true" focusable="false"><defs><linearGradient id="__P__bunTop" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#ffedb8"/><stop offset=".24" stop-color="#f6bd5e"/><stop offset=".58" stop-color="#df8a32"/><stop offset="1" stop-color="#9c4e1c"/></linearGradient><linearGradient id="__P__bunBase" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#f4bd63"/><stop offset="1" stop-color="#a95f24"/></linearGradient><linearGradient id="__P__meat" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#83442a"/><stop offset=".5" stop-color="#4d281b"/><stop offset="1" stop-color="#2b1713"/></linearGradient><linearGradient id="__P__cheese" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#fff18a"/><stop offset=".55" stop-color="#f6bd24"/><stop offset="1" stop-color="#d6810e"/></linearGradient></defs><ellipse cx="32" cy="57.4" rx="24" ry="3" fill="#3d2415" opacity=".2"/><path d="M8 43h48l-3.4 8c-.8 2-2.5 3.1-5 3.1H16.4c-2.5 0-4.2-1.1-5-3.1Z" fill="url(#__P__bunBase)" stroke="#9d5724" stroke-width=".8"/><path d="M7.3 39.5q4.1-3.2 8.3 0t8.3 0 8.1 0 8.3 0 8.3 0 8.1 0v5H7.3Z" fill="#3a8e37" stroke="#27652b" stroke-width=".8"/><path d="M8.5 36.8q3-2.4 6.3-.2l4.7 3.2h25l4.7-3.2q3.3-2.2 6.3.2v4.1H8.5Z" fill="#e64a3c" stroke="#a92f29" stroke-width=".75"/><path d="M9 30.7h46l-4.8 9.6-7.2-3.1-7 3.6-7-3.6-7 3.6-7-3.6-7.2 3.1Z" fill="url(#__P__cheese)" stroke="#c07b14" stroke-width=".8"/><path d="M8.7 29.3c0-2.2 1.7-3.9 4-3.9h38.6c2.3 0 4 1.7 4 3.9v3.5H8.7Z" fill="url(#__P__meat)" stroke="#46261a" stroke-width=".9"/><path d="M10.5 28.5q7-2.2 13.5 0t14 0 15.5 0" fill="none" stroke="#ae6a43" stroke-width="1.1" stroke-linecap="round"/><path d="M7 28.8C7 16.4 18.1 7 32 7s25 9.4 25 21.8Z" fill="url(#__P__bunTop)" stroke="#a75e24" stroke-width="1.1"/><path d="M12 24.2c3.2-7.1 10-11.3 18-12.7" fill="none" stroke="#fff0c8" stroke-width="2" stroke-linecap="round" opacity=".8"/><g fill="#fff0c1" stroke="#d18c33" stroke-width=".35"><ellipse cx="20.2" cy="15.4" rx="1.15" ry="2.1" transform="rotate(-30 20.2 15.4)"/><ellipse cx="29.4" cy="11.9" rx="1.1" ry="2" transform="rotate(8 29.4 11.9)"/><ellipse cx="39.4" cy="15" rx="1.1" ry="2.1" transform="rotate(30 39.4 15)"/><ellipse cx="47.3" cy="20.6" rx="1.1" ry="1.8" transform="rotate(25 47.3 20.6)"/><ellipse cx="14.8" cy="20.5" rx="1.05" ry="1.8" transform="rotate(-22 14.8 20.5)"/><ellipse cx="32.4" cy="19.4" rx="1.05" ry="2" transform="rotate(-4 32.4 19.4)"/></g><path d="M12 42q20 3 40 0" fill="none" stroke="#ffe1a0" stroke-width=".8" opacity=".75"/></svg>',
'cevre': '<svg viewBox="0 0 24 24"><defs><linearGradient id="__P__l" x1="0" y1="1" x2="1" y2="0"><stop offset="0" stop-color="#1b5e20"/><stop offset="1" stop-color="#9ccc65"/></linearGradient></defs><path d="M4.6 19.4C3.4 11.6 7.9 4.6 20.6 3.4c.5 12.2-6 16.6-16 16z" fill="url(#__P__l)"/><path d="M4.6 19.4C8.8 14.8 11.9 12 16.4 8.6" fill="none" stroke="#33691e" stroke-width="1.1" stroke-linecap="round"/><path d="M18 13.6c-.2 1.6-1.3 3.2-1.3 4.4a2.3 2.3 0 0 0 4.6 0c0-1.2-1.1-2.8-1.3-4.4z" fill="#29b6f6"/></svg>',
'sanat': '<svg viewBox="0 0 24 24"><defs><linearGradient id="__P__w" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#fffdf7"/><stop offset="1" stop-color="#ffe0b2"/></linearGradient></defs><ellipse cx="12" cy="12.3" rx="10" ry="9.7" fill="url(#__P__w)" stroke="#ffcc80" stroke-width=".6"/><circle cx="7.4" cy="9.2" r="1.9" fill="#e53935"/><circle cx="12" cy="6.4" r="1.9" fill="#fdd835"/><circle cx="16.8" cy="8.6" r="1.9" fill="#43a047"/><circle cx="18.4" cy="13.8" r="1.9" fill="#1e88e5"/><circle cx="8.2" cy="15.6" r="1.9" fill="#8e24aa"/></svg>',
'eglence': '<svg viewBox="0 0 24 24"><rect x="3" y="9.6" width="18" height="11.6" rx="1.7" fill="#26a69a"/><path d="M10.8 13.3v4.8l4-2.4z" fill="#fff"/><g transform="rotate(-12 12 7)"><rect x="2.6" y="4.4" width="18.8" height="4.9" rx=".9" fill="#ef5350"/><path d="M6.4 4.4h2.2L7.2 9.3H5Z" fill="#fff"/><path d="M11.9 4.4h2.2l-1.4 4.9h-2.2Z" fill="#fff"/><path d="M17.4 4.4h2.2L18.2 9.3H16Z" fill="#fff"/></g></svg>',
'hayvanlar': '<svg viewBox="0 0 64 64" aria-hidden="true" focusable="false"><defs><radialGradient id="__P__smiMane" cx="46%" cy="15%" r="90%"><stop offset="0" stop-color="#ffe2a0"/><stop offset=".35" stop-color="#f2b85f"/><stop offset=".72" stop-color="#cf803a"/><stop offset="1" stop-color="#a65328"/></radialGradient><linearGradient id="__P__smiFace" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#ffe8b8"/><stop offset=".42" stop-color="#e8b66f"/><stop offset="1" stop-color="#bf7138"/></linearGradient><linearGradient id="__P__smiFang" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#ffffff"/><stop offset=".72" stop-color="#f6f2df"/><stop offset="1" stop-color="#c8d7d9"/></linearGradient><linearGradient id="__P__smiIris" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#ffe36d"/><stop offset="1" stop-color="#d98818"/></linearGradient></defs><path d="M12.5 20.2 7.2 9.8 19.2 14.4Q25.2 9.9 32 11.2Q39 9.9 44.8 14.4L56.8 10 51.5 20.6Q58.3 28.2 55.4 38.7L48.2 53.2 41.7 48.1Q32 54.1 22.3 48.1L15.8 53.2 8.6 38.7Q5.7 28.2 12.5 20.2Z" fill="url(#__P__smiMane)" stroke="#9d5426" stroke-width="1" stroke-linejoin="round"/><path d="M13.1 19.1 9.8 12.8 18.1 16.5 22.2 23.8 17.2 27.4ZM50.9 19.1 54.2 12.8 45.9 16.5 41.8 23.8 46.8 27.4Z" fill="#c57537" stroke="#a65b2b" stroke-width=".75"/><path d="M13.2 17.7 17.7 18.9 19 22.5 15.6 21.2ZM50.8 17.7 46.3 18.9 45 22.5 48.4 21.2Z" fill="#f8d39a"/><path d="M17.1 23.2Q22.1 17 31.7 17.5Q41.7 17 46.9 23.2L45.5 36.1Q43.9 45.1 32 49Q20.1 45.1 18.5 36.1Z" fill="url(#__P__smiFace)" stroke="#c88745" stroke-width=".75"/><path d="M25.1 17.6 28.6 21.3 25.1 24.2 22.5 21.1ZM38.9 17.6 35.4 21.3 38.9 24.2 41.5 21.1Z" fill="#b56b34" opacity=".8"/><path d="M31.7 17.8 29.4 22.8 32 25 34.6 22.8Z" fill="#ffe9b8"/><path d="M18.3 26.8 23 24.1M45.7 26.8 41 24.1M20.1 34.4 24.1 36.1M43.9 34.4 39.9 36.1M20.8 40.5 24.8 41.6M43.2 40.5 39.2 41.6" fill="none" stroke="#a75e31" stroke-width="1.55" stroke-linecap="round"/><path d="M18.8 28.8Q23.2 24.5 28.7 28.2L27.7 31.8Q23.3 30.2 19 32Z" fill="#78452c"/><path d="M45.2 28.8Q40.8 24.5 35.3 28.2L36.3 31.8Q40.7 30.2 45 32Z" fill="#78452c"/><path d="M19.8 29.4Q24 26.3 27.7 29.1Q24 33.1 19.8 29.4Z" fill="#fff0c2"/><path d="M44.2 29.4Q40 26.3 36.3 29.1Q40 33.1 44.2 29.4Z" fill="#fff0c2"/><ellipse cx="23.8" cy="29.6" rx="2.45" ry="2.8" fill="url(#__P__smiIris)"/><ellipse cx="40.2" cy="29.6" rx="2.45" ry="2.8" fill="url(#__P__smiIris)"/><ellipse cx="24" cy="29.7" rx=".82" ry="2.25" fill="#34231b"/><ellipse cx="40" cy="29.7" rx=".82" ry="2.25" fill="#34231b"/><circle cx="23.1" cy="28.8" r=".72" fill="#ffffff"/><circle cx="39.1" cy="28.8" r=".72" fill="#ffffff"/><path d="M17.1 33.6Q20.1 35.7 23 35.2M46.9 33.6Q43.9 35.7 41 35.2" fill="none" stroke="#e7b56d" stroke-width="1.2" stroke-linecap="round"/><path d="M17.6 39.2Q23.1 34.8 29.8 38.2L32 41.2 34.2 38.2Q40.9 34.8 46.4 39.2L42.4 46.1Q37.9 49.3 32 49.4Q26.1 49.3 21.6 46.1Z" fill="#f6dfb0" stroke="#c6894b" stroke-width=".7"/><path d="M24.8 33.1Q21.2 39.6 23.4 47.7Q24.1 50.9 26.1 48.1L30.2 36.4 29.1 32.8Z" fill="url(#__P__smiFang)" stroke="#b9c5c5" stroke-width=".72" stroke-linejoin="round"/><path d="M39.2 33.1Q42.8 39.6 40.6 47.7Q39.9 50.9 37.9 48.1L33.8 36.4 34.9 32.8Z" fill="url(#__P__smiFang)" stroke="#b9c5c5" stroke-width=".72" stroke-linejoin="round"/><path d="M28.4 37.9 32 35.2 35.6 37.9 32 41.1Z" fill="#68422e" stroke="#8d5834" stroke-width=".65" stroke-linejoin="round"/><path d="M32 41.1v3.3M28.8 45.6Q32 48 35.2 45.6" fill="none" stroke="#85502f" stroke-width="1.15" stroke-linecap="round"/><path d="M14.8 36.2 19.6 38.1M13.8 40.2 19.1 40.7M49.2 36.2 44.4 38.1M50.2 40.2 44.9 40.7" fill="none" stroke="#fbe4b9" stroke-width="1.05" stroke-linecap="round"/><path d="M22 17.9 25.1 19.5M42 17.9 38.9 19.5M17.4 44.5 21.3 46.7M46.6 44.5 42.7 46.7" fill="none" stroke="#a75a2d" stroke-width="1.1" stroke-linecap="round"/></svg>',
'egitim': '<svg viewBox="0 0 24 24"><defs><linearGradient id="__P__a" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#5c6bc0"/><stop offset="1" stop-color="#1a237e"/></linearGradient></defs><path d="M12 3.6 22.4 8.9 12 14.2 1.6 8.9Z" fill="url(#__P__a)"/><path d="M6 11.2v4.9c0 2.3 2.7 3.9 6 3.9s6-1.6 6-3.9v-4.9L12 14.6Z" fill="#283593"/><path d="M19.9 9.5v5.8" stroke="#ffb300" stroke-width="1.2" stroke-linecap="round"/><circle cx="19.9" cy="16.4" r="1.5" fill="#ffca28"/></svg>',
'yasam': '<svg viewBox="0 0 24 24"><g><circle cx="12" cy="6.9" r="3.2" fill="#f06292"/><circle cx="16" cy="9.8" r="3.2" fill="#ffb74d"/><circle cx="14.5" cy="14.5" r="3.2" fill="#ba68c8"/><circle cx="9.5" cy="14.5" r="3.2" fill="#4fc3f7"/><circle cx="8" cy="9.8" r="3.2" fill="#ffd54f"/></g><circle cx="12" cy="11.1" r="2.6" fill="#fff176"/><path d="M12 17.6V22" stroke="#43a047" stroke-width="1.4" stroke-linecap="round"/><ellipse cx="9.8" cy="19.5" rx="2.4" ry="1.1" transform="rotate(-25 9.8 19.5)" fill="#66bb6a"/><ellipse cx="14.2" cy="20.6" rx="2.4" ry="1.1" transform="rotate(25 14.2 20.6)" fill="#66bb6a"/></svg>',
'astroloji': '<svg viewBox="0 0 24 24"><defs><linearGradient id="__P__g" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#fff59d"/><stop offset="1" stop-color="#ffa000"/></linearGradient><mask id="__P__m"><rect width="24" height="24" fill="#fff"/><circle cx="15.5" cy="8.5" r="11.5" fill="#000"/></mask></defs><circle cx="11" cy="13" r="9" fill="url(#__P__g)" mask="url(#__P__m)"/><path d="M18 3.2l.7 2.1 2.1.7-2.1.7-.7 2.1-.7-2.1-2.1-.7 2.1-.7z" fill="#ffd54f"/><g fill="#7e57c2"><circle cx="4.2" cy="4.6" r=".8"/><circle cx="21.6" cy="13.6" r=".9"/><circle cx="20.4" cy="19.6" r=".7"/></g></svg>',
'haber': '<svg viewBox="0 0 24 24"><rect x="2.5" y="4" width="19" height="16.5" rx="2" fill="#fff" stroke="#546e7a" stroke-width="1.2"/><rect x="5" y="6.5" width="8" height="4.5" rx=".6" fill="#e53935"/><g fill="#90a4ae"><rect x="14.6" y="6.5" width="4.4" height="1.2" rx=".6"/><rect x="14.6" y="9.1" width="4.4" height="1.2" rx=".6"/><rect x="5" y="12.6" width="14" height="1.2" rx=".6"/><rect x="5" y="15.2" width="14" height="1.2" rx=".6"/></g></svg>',
'account-group': '<svg class="ik" style="--ik-l:#FB8C00;--ik-d:#FB8C00" viewBox="0 0 24 24" aria-hidden="true" focusable="false"><path d="M12,5.5A3.5,3.5 0 0,1 15.5,9A3.5,3.5 0 0,1 12,12.5A3.5,3.5 0 0,1 8.5,9A3.5,3.5 0 0,1 12,5.5M5,8C5.56,8 6.08,8.15 6.53,8.42C6.38,9.85 6.8,11.27 7.66,12.38C7.16,13.34 6.16,14 5,14A3,3 0 0,1 2,11A3,3 0 0,1 5,8M19,8A3,3 0 0,1 22,11A3,3 0 0,1 19,14C17.84,14 16.84,13.34 16.34,12.38C17.2,11.27 17.62,9.85 17.47,8.42C17.92,8.15 18.44,8 19,8M5.5,18.25C5.5,16.18 8.41,14.5 12,14.5C15.59,14.5 18.5,16.18 18.5,18.25V20H5.5V18.25M0,20V18.5C0,17.11 1.89,15.94 4.45,15.6C3.86,16.28 3.5,17.22 3.5,18.25V20H0M24,20H20.5V18.25C20.5,17.22 20.14,16.28 19.55,15.6C22.11,15.94 24,17.11 24,18.5V20Z"/></svg>',
'account-multiple': '<svg class="ik" style="--ik-l:#FB8C00;--ik-d:#FB8C00" viewBox="0 0 24 24" aria-hidden="true" focusable="false"><path d="M16 17V19H2V17S2 13 9 13 16 17 16 17M12.5 7.5A3.5 3.5 0 1 0 9 11A3.5 3.5 0 0 0 12.5 7.5M15.94 13A5.32 5.32 0 0 1 18 17V19H22V17S22 13.37 15.94 13M15 4A3.39 3.39 0 0 0 13.07 4.59A5 5 0 0 1 13.07 10.41A3.39 3.39 0 0 0 15 11A3.5 3.5 0 0 0 15 4Z"/></svg>',
'account-music': '<svg class="ik" style="--ik-l:#8E24AA;--ik-d:#C692D4" viewBox="0 0 24 24" aria-hidden="true" focusable="false"><path d="M11,14C12,14 13.05,14.16 14.2,14.44C13.39,15.31 13,16.33 13,17.5C13,18.39 13.25,19.23 13.78,20H3V18C3,16.81 3.91,15.85 5.74,15.12C7.57,14.38 9.33,14 11,14M11,12C9.92,12 9,11.61 8.18,10.83C7.38,10.05 7,9.11 7,8C7,6.92 7.38,6 8.18,5.18C9,4.38 9.92,4 11,4C12.11,4 13.05,4.38 13.83,5.18C14.61,6 15,6.92 15,8C15,9.11 14.61,10.05 13.83,10.83C13.05,11.61 12.11,12 11,12M18.5,10H20L22,10V12H20V17.5A2.5,2.5 0 0,1 17.5,20A2.5,2.5 0 0,1 15,17.5A2.5,2.5 0 0,1 17.5,15C17.86,15 18.19,15.07 18.5,15.21V10Z"/></svg>',
'account-star': '<svg class="ik" style="--ik-l:#FFB300;--ik-d:#FFB300" viewBox="0 0 24 24" aria-hidden="true" focusable="false"><path d="M15,14C12.33,14 7,15.33 7,18V20H23V18C23,15.33 17.67,14 15,14M15,12A4,4 0 0,0 19,8A4,4 0 0,0 15,4A4,4 0 0,0 11,8A4,4 0 0,0 15,12M5,13.28L7.45,14.77L6.8,11.96L9,10.08L6.11,9.83L5,7.19L3.87,9.83L1,10.08L3.18,11.96L2.5,14.77L5,13.28Z"/></svg>',
'account-tie': '<svg class="ik" style="--ik-l:#37474F;--ik-d:#9BA3A7" viewBox="0 0 24 24" aria-hidden="true" focusable="false"><path d="M12 3C14.21 3 16 4.79 16 7S14.21 11 12 11 8 9.21 8 7 9.79 3 12 3M16 13.54C16 14.6 15.72 17.07 13.81 19.83L13 15L13.94 13.12C13.32 13.05 12.67 13 12 13S10.68 13.05 10.06 13.12L11 15L10.19 19.83C8.28 17.07 8 14.6 8 13.54C5.61 14.24 4 15.5 4 17V21H20V17C20 15.5 18.4 14.24 16 13.54Z"/></svg>',
'account-voice': '<svg class="ik" style="--ik-l:#AB47BC;--ik-d:#D5A3DE" viewBox="0 0 24 24" aria-hidden="true" focusable="false"><path d="M9,5A4,4 0 0,1 13,9A4,4 0 0,1 9,13A4,4 0 0,1 5,9A4,4 0 0,1 9,5M9,15C11.67,15 17,16.34 17,19V21H1V19C1,16.34 6.33,15 9,15M16.76,5.36C18.78,7.56 18.78,10.61 16.76,12.63L15.08,10.94C15.92,9.76 15.92,8.23 15.08,7.05L16.76,5.36M20.07,2C24,6.05 23.97,12.11 20.07,16L18.44,14.37C21.21,11.19 21.21,6.65 18.44,3.63L20.07,2Z"/></svg>',
'airplane': '<svg class="ik" style="--ik-l:#1976D2;--ik-d:#8CBAE8" viewBox="0 0 24 24" aria-hidden="true" focusable="false"><path d="M20.56 3.91C21.15 4.5 21.15 5.45 20.56 6.03L16.67 9.92L18.79 19.11L17.38 20.53L13.5 13.1L9.6 17L9.96 19.47L8.89 20.53L7.13 17.35L3.94 15.58L5 14.5L7.5 14.87L11.37 11L3.94 7.09L5.36 5.68L14.55 7.8L18.44 3.91C19 3.33 20 3.33 20.56 3.91Z"/></svg>',
'airport': '<svg class="ik" style="--ik-l:#5E35B1;--ik-d:#AE9AD8" viewBox="0 0 24 24" aria-hidden="true" focusable="false"><path d="M14.97,5.92C14.83,5.41 14.3,5.1 13.79,5.24L10.39,6.15L5.95,2.03L4.72,2.36L7.38,6.95L4.19,7.8L2.93,6.82L2,7.07L3.66,9.95L14.28,7.11C14.8,6.96 15.1,6.43 14.97,5.92M21,10L20,12H15L14,10L15,9H17V7H18V9H20L21,10M22,20V22H2V20H15V13H20V20H22Z"/></svg>',
'anchor': '<svg class="ik" style="--ik-l:#0D47A1;--ik-d:#86A3D0" viewBox="0 0 24 24" aria-hidden="true" focusable="false"><path d="M12 2A3 3 0 0 0 9 5A3 3 0 0 0 11 7.83V9H8V11H11V19.92C10.26 19.79 9.5 19.58 8.79 19.27C8.05 18.95 7.4 18.56 6.82 18.09C6.24 17.62 5.78 17.11 5.44 16.55L7 15L3 12V15C3 15.97 3.27 16.88 3.82 17.72C4.37 18.56 5.09 19.31 6 19.95C6.87 20.59 7.84 21.09 8.88 21.45C9.93 21.81 10.97 22 12 22C13.03 22 14.07 21.8 15.12 21.44C16.16 21.08 17.13 20.58 18 19.95C18.92 19.31 19.63 18.57 20.18 17.72C20.73 16.88 21 15.97 21 15V12L17 15L18.56 16.55C18.22 17.11 17.76 17.62 17.18 18.09C16.6 18.56 15.95 18.95 15.21 19.27C14.5 19.58 13.74 19.79 13 19.92V11H16V9H13V7.82A3 3 0 0 0 15 5A3 3 0 0 0 12 2M12 4A1 1 0 0 1 13 5A1 1 0 0 1 12 6A1 1 0 0 1 11 5A1 1 0 0 1 12 4Z"/></svg>',
'antenna': '<svg class="ik" style="--ik-l:#78909C;--ik-d:#78909C" viewBox="0 0 24 24" aria-hidden="true" focusable="false"><path d="M12 7.5C12.69 7.5 13.27 7.73 13.76 8.2S14.5 9.27 14.5 10C14.5 11.05 14 11.81 13 12.28V21H11V12.28C10 11.81 9.5 11.05 9.5 10C9.5 9.27 9.76 8.67 10.24 8.2S11.31 7.5 12 7.5M16.69 5.3C17.94 6.55 18.61 8.11 18.7 10C18.7 11.8 18.03 13.38 16.69 14.72L15.5 13.5C16.5 12.59 17 11.42 17 10C17 8.67 16.5 7.5 15.5 6.5L16.69 5.3M6.09 4.08C4.5 5.67 3.7 7.64 3.7 10S4.5 14.3 6.09 15.89L4.92 17.11C3 15.08 2 12.7 2 10C2 7.3 3 4.94 4.92 2.91L6.09 4.08M19.08 2.91C21 4.94 22 7.3 22 10C22 12.8 21 15.17 19.08 17.11L17.91 15.89C19.5 14.3 20.3 12.33 20.3 10S19.5 5.67 17.91 4.08L19.08 2.91M7.31 5.3L8.5 6.5C7.5 7.42 7 8.58 7 10C7 11.33 7.5 12.5 8.5 13.5L7.31 14.72C5.97 13.38 5.3 11.8 5.3 10C5.3 8.2 5.97 6.64 7.31 5.3Z"/></svg>',
'atom': '<svg class="ik" style="--ik-l:#00ACC1;--ik-d:#00ACC1" viewBox="0 0 24 24" aria-hidden="true" focusable="false"><path d="M12,11A1,1 0 0,1 13,12A1,1 0 0,1 12,13A1,1 0 0,1 11,12A1,1 0 0,1 12,11M4.22,4.22C5.65,2.79 8.75,3.43 12,5.56C15.25,3.43 18.35,2.79 19.78,4.22C21.21,5.65 20.57,8.75 18.44,12C20.57,15.25 21.21,18.35 19.78,19.78C18.35,21.21 15.25,20.57 12,18.44C8.75,20.57 5.65,21.21 4.22,19.78C2.79,18.35 3.43,15.25 5.56,12C3.43,8.75 2.79,5.65 4.22,4.22M15.54,8.46C16.15,9.08 16.71,9.71 17.23,10.34C18.61,8.21 19.11,6.38 18.36,5.64C17.62,4.89 15.79,5.39 13.66,6.77C14.29,7.29 14.92,7.85 15.54,8.46M8.46,15.54C7.85,14.92 7.29,14.29 6.77,13.66C5.39,15.79 4.89,17.62 5.64,18.36C6.38,19.11 8.21,18.61 10.34,17.23C9.71,16.71 9.08,16.15 8.46,15.54M5.64,5.64C4.89,6.38 5.39,8.21 6.77,10.34C7.29,9.71 7.85,9.08 8.46,8.46C9.08,7.85 9.71,7.29 10.34,6.77C8.21,5.39 6.38,4.89 5.64,5.64M9.88,14.12C10.58,14.82 11.3,15.46 12,16.03C12.7,15.46 13.42,14.82 14.12,14.12C14.82,13.42 15.46,12.7 16.03,12C15.46,11.3 14.82,10.58 14.12,9.88C13.42,9.18 12.7,8.54 12,7.97C11.3,8.54 10.58,9.18 9.88,9.88C9.18,10.58 8.54,11.3 7.97,12C8.54,12.7 9.18,13.42 9.88,14.12M18.36,18.36C19.11,17.62 18.61,15.79 17.23,13.66C16.71,14.29 16.15,14.92 15.54,15.54C14.92,16.15 14.29,16.71 13.66,17.23C15.79,18.61 17.62,19.11 18.36,18.36Z"/></svg>',
'atom-variant': '<svg class="ik" style="--ik-l:#00ACC1;--ik-d:#00ACC1" viewBox="0 0 24 24" aria-hidden="true" focusable="false"><path d="M18.36,2.64C20,2.64 21.36,4 21.36,5.64C21.36,7.29 20,8.64 18.36,8.64C16.71,8.64 15.36,7.29 15.36,5.64C15.36,5.34 15.41,5.06 15.5,4.8C14.43,4.29 13.25,4 12,4A8,8 0 0,0 4,12L4.04,12.84L2.05,13.05L2,12A10,10 0 0,1 12,2C13.69,2 15.28,2.42 16.67,3.16C17.16,2.83 17.74,2.64 18.36,2.64M18.36,4.64A1,1 0 0,0 17.36,5.64A1,1 0 0,0 18.36,6.64C18.92,6.64 19.36,6.19 19.36,5.64C19.36,5.08 18.92,4.64 18.36,4.64M5.64,15.36C7.29,15.36 8.64,16.71 8.64,18.36C8.64,18.66 8.59,18.94 8.5,19.2C9.57,19.71 10.75,20 12,20A8,8 0 0,0 20,12L19.96,11.16L21.95,10.95L22,12A10,10 0 0,1 12,22C10.31,22 8.72,21.58 7.33,20.84C6.84,21.17 6.26,21.36 5.64,21.36C4,21.36 2.64,20 2.64,18.36C2.64,16.71 4,15.36 5.64,15.36M5.64,17.36C5.08,17.36 4.64,17.81 4.64,18.36C4.64,18.92 5.08,19.36 5.64,19.36A1,1 0 0,0 6.64,18.36A1,1 0 0,0 5.64,17.36M12,8A4,4 0 0,1 16,12A4,4 0 0,1 12,16A4,4 0 0,1 8,12A4,4 0 0,1 12,8Z"/></svg>',
'ay': '<svg viewBox="0 0 24 24" aria-hidden="true"><circle cx="12" cy="12" r="9" fill="#cfd4da"/><circle cx="8.6" cy="9.2" r="1.8" fill="#a9b0b9"/><circle cx="14.6" cy="14.4" r="2.4" fill="#a9b0b9"/><circle cx="15" cy="8.4" r="1.1" fill="#a9b0b9"/></svg>',
'ay_tutulma': '<svg viewBox="0 0 24 24" aria-hidden="true"><circle cx="12" cy="12" r="9" fill="#b9573f"/><circle cx="8.5" cy="11" r="6" fill="#4a1f17" opacity=".55"/></svg>',
'bank': '<svg class="ik" style="--ik-l:#795548;--ik-d:#BCAAA4" viewBox="0 0 24 24" aria-hidden="true" focusable="false"><path d="M11.5,1L2,6V8H21V6M16,10V17H19V10M2,22H21V19H2M10,10V17H13V10M4,10V17H7V10H4Z"/></svg>',
'bank-outline': '<svg class="ik" style="--ik-l:#6D4C41;--ik-d:#B6A6A0" viewBox="0 0 24 24" aria-hidden="true" focusable="false"><path d="M6.5,10H4.5V17H6.5V10M12.5,10H10.5V17H12.5V10M21,19H2V21H21V19M18.5,10H16.5V17H18.5V10M11.5,3.26L16.71,6H6.29L11.5,3.26M11.5,1L2,6V8H21V6L11.5,1Z"/></svg>',
'bayrak_ab': '<svg viewBox="0 0 810 540"><defs><g id="__P__d"><g id="__P__b"><path id="__P__a" d="M0 0v1h.5z" transform="rotate(18 3.157 -.5)"/><use xlink:href="#__P__a" transform="scale(-1 1)"/></g><g id="__P__c"><use xlink:href="#__P__b" transform="rotate(72)"/><use xlink:href="#__P__b" transform="rotate(144)"/></g><use xlink:href="#__P__c" transform="scale(-1 1)"/></g></defs><path fill="#039" d="M0 0h810v540H0z"/><g fill="#fc0" transform="matrix(30 0 0 30 405 270)"><use xlink:href="#__P__d" y="-6"/><use xlink:href="#__P__d" y="6"/><g id="__P__e"><use xlink:href="#__P__d" x="-6"/><use xlink:href="#__P__d" transform="rotate(-144 -2.344 -2.11)"/><use xlink:href="#__P__d" transform="rotate(144 -2.11 -2.344)"/><use xlink:href="#__P__d" transform="rotate(72 -4.663 -2.076)"/><use xlink:href="#__P__d" transform="rotate(72 -5.076 .534)"/></g><use xlink:href="#__P__e" transform="scale(-1 1)"/></g></svg>',
'bayrak_ak': '<svg viewBox="0 0 810 540"><defs><g id="__P__d"><g id="__P__b"><path id="__P__a" d="M0 0v1h.5z" transform="rotate(18 3.157 -.5)"/><use xlink:href="#__P__a" transform="scale(-1 1)"/></g><g id="__P__c"><use xlink:href="#__P__b" transform="rotate(72)"/><use xlink:href="#__P__b" transform="rotate(144)"/></g><use xlink:href="#__P__c" transform="scale(-1 1)"/></g></defs><path fill="#039" d="M0 0h810v540H0z"/><g fill="#fc0" transform="matrix(30 0 0 30 405 270)"><use xlink:href="#__P__d" y="-6"/><use xlink:href="#__P__d" y="6"/><g id="__P__e"><use xlink:href="#__P__d" x="-6"/><use xlink:href="#__P__d" transform="rotate(-144 -2.344 -2.11)"/><use xlink:href="#__P__d" transform="rotate(144 -2.11 -2.344)"/><use xlink:href="#__P__d" transform="rotate(72 -4.663 -2.076)"/><use xlink:href="#__P__d" transform="rotate(72 -5.076 .534)"/></g><use xlink:href="#__P__e" transform="scale(-1 1)"/></g></svg>',
'bayrak_aq': '<svg viewBox="-66.5 0 900 600"><defs><clipPath id="__P__d"><use width="400" height="267" xlink:href="#__P__a"/></clipPath><clipPath clipPathUnits="userSpaceOnUse" id="__P__c"><path d="M-66.5 0h400v267h-400z"/></clipPath><path d="M146.396 44.921l-.624-.267zm17.833 176.42l-2.407-1.425-7.133 1.782-6.242-3.92v1.514l-1.516-2.049 1.784-1.782-.268-5.346h2.05l1.25-3.564 1.426-.624-1.16-1.782 1.784-.624-.268-2.673-1.783-.89 2.318-.268-1.426-6.504-3.567-3.564-2.14.89.892 2.941h-7.4l-6.242-2.673-2.407-1.158-11.859-2.673-.892 1.425-4.19.357h-1.16l-1.783 2.94-5.082-3.564-2.675.89.357 2.407-6.598-3.564-.268 2.316-6.508-2.94-.357.267-3.21 1.248-.624-2.406-7.757-3.831-8.292-2.674-1.516-6.86v-1.515l-3.21-5.88 1.427-7.129-2.675-.89-.892-3.03 4.458-.535h-2.05l.267-4.455-6.509 2.05-.267-1.783-.892 3.297-3.567 1.426-2.407-2.317-.892-2.406-.891-4.722 2.05-1.515.892 1.159.624-1.426-1.515-10.692 2.407.534 1.159-11.226.357-.357 2.318-1.425-2.942.267-1.16-2.673 5.35-5.97-4.815-.891-3.566 3.564-1.427-4.099-2.14 2.94-.535-2.049-2.674.891-1.784.892 1.427-5.347-1.16-.623.625-1.515-1.516.356-.267-3.029h5.617l-.268-1.426h-1.783l-3.299-5.702-1.783.624-1.16-2.05-.623 1.782-1.784-1.247 1.784-1.158-2.675-.891.624-1.515-2.14-1.159-.535-4.722-2.14-.624 1.248-.89-2.407-6.238.267-2.049.892-6.237h1.783l-.535 3.831 4.458 6.237 3.21 4.188 6.598 1.782v.267l.892-1.514 3.567 4.187 1.783 2.05.891.89 10.076 4.812 1.783.891.624.535 4.726 5.702 2.675-1.247 19.615-4.455.625-3.564L97 94.55l-.267-1.159.891-.623 4.191-1.515v-4.099l1.427-1.515 1.783-6.86-.892-2.673 4.19-10.069V59.8h2.052l2.407-3.564 2.942-.891.357-3.297 4.102-4.99 1.783.892 8.381-3.03.892-.89 1.783-1.783-.624-2.94h1.783l.892 4.722 9.183 2.139 1.516-1.515.624.267 8.025 1.782.267-.267 4.191-2.406.268 2.673 3.566.357 2.943 2.316.624.624 4.458 3.831 5.35.357 3.299.534 4.101-1.425.357 2.673 1.783 1.158 1.427-2.673h1.783l1.248 6.86 1.427.268-.268 2.406-.267.267h.535l3.566-1.782 3.3-1.158 9.183 3.207 1.783-.534.624 3.207 2.408.357-.624-1.515h2.05l.624 3.297 2.408-2.673 5.617 3.564 1.516 6.504-2.407.624.624 4.99.891 1.514 6.242 15.771-3.3 2.94-.267 3.565-2.675 3.296 2.943 2.05-1.16.89 2.675 2.674 4.102.624 1.248 1.782 1.16 2.316 2.942 1.248 3.566-2.406 2.408.267-2.943 4.188 2.943 7.752-3.567 2.94 1.516 4.722-.892 4.188 1.783 2.406 4.726.891-4.726 6.504.892 1.159 1.16 1.247-2.052 3.208 2.051 1.247-10.432 8.554 2.408 5.97-.625 3.564-3.566 1.158-.892 3.03-4.101 1.782-1.248 3.83-.892 2.05 4.19 2.139-6.24.534 1.515 3.297-3.032 2.94-4.725.891-1.516 2.673 3.566 1.782-6.776 6.238 2.05 3.296-5.349-1.158-5.974 3.564-8.024 3.831-1.784 2.673-1.159-.89 1.16-2.674-5.35 2.05-1.16-2.05-8.024 4.723-3.567-1.159-6.509 1.159-1.783-.891M166.28 50l-.625-.624h-.267v.357h.624l.268.267zm-2.051 171.342l1.783.89zm0 0l1.783.89M39.044 98.74l.357-2.139-3.299-2.05 2.942 4.189zm-7.133-16.395h-1.783l.892 2.673.891-2.317v-.356zm-.891-2.673l-.892.89 1.783 1.248zm8.024 19.068l.357-2.139-3.299-2.05 2.942 4.189zm-7.133-16.395h-1.783l.892 2.673.891-2.317v-.356zm-.891-2.673l-.892.89 1.783 1.248zm8.024 19.068l.357-2.139-3.299-2.05 2.942 4.189zm-7.133-16.395h-1.783l.892 2.673.891-2.317v-.356zm-.891-2.673l-.892.89 1.783 1.248zm5.35-6.237v-2.317l-2.051.535.267 1.514zm-2.319-6.505l.535 1.159 1.249-2.673-1.784 1.247zm2.319 6.505v-2.317l-2.051.535.267 1.514zm-2.319-6.505l.535 1.159 1.249-2.673-1.784 1.247zm2.319 6.505v-2.317l-2.051.535.267 1.514zm-2.319-6.505l.535 1.159 1.249-2.673-1.784 1.247zm31.742 90.884l-2.05.267-1.784 2.406 2.943-.624.891-2.05zm0 0l-2.05.267-1.784 2.406 2.943-.624.891-2.05zm0 0l-2.05.267-1.784 2.406 2.943-.624.891-2.05zm2.14-60.322l-.624-.534-1.783-.891 1.783.89z" transform="translate(0 -1.5)" id="__P__a" fill="#fff"/><g id="__P__e" fill="none"><circle cx="133.5" cy="133.5" r="49.5"/><circle cx="133.5" cy="133.5" r="92.5"/><circle cx="133.5" cy="133.5" r="133"/><path d="M-100 133.5h467M133.5-100v467" id="__P__b"/><use transform="rotate(30 133.5 133.5)" width="400" height="267" xlink:href="#__P__b"/><use transform="rotate(60 133.5 133.5)" width="400" height="267" xlink:href="#__P__b"/></g></defs><g clip-path="url(#__P__c)" transform="matrix(2.25 0 0 2.25 83.125 -.75)"><path fill="#072b5f" d="M-66.5.333h400V267h-400z"/><g fill="none" stroke="#fff" stroke-width="2"><circle r="49.5" cy="133.5" cx="133.5"/><circle r="92.06" cy="133.667" cx="133.5" stroke-width="1.99"/><circle r="132.118" cy="133.667" cx="133.5" stroke-width="1.987"/><path d="M-100 133.5h467M133.5-100v467"/><use xlink:href="#__P__b" height="267" width="400" transform="rotate(30 133.5 133.5)"/><use xlink:href="#__P__b" height="267" width="400" transform="rotate(60 133.5 133.5)"/></g><use width="400" height="267" xlink:href="#__P__a" transform="matrix(1 0 0 .99875 0 .333)"/><use clip-path="url(#__P__d)" width="400" height="267" xlink:href="#__P__e" transform="matrix(.99795 0 0 .9967 .195 .655)" stroke="#072b5f" stroke-width="2"/></g></svg>',
'bayrak_arap': '<svg xml:space="preserve" version="1.0" id="__P__flag-icons-arab" viewBox="0 0 640 480"><path fill="#006233" d="M0 0v480h640V0Z" class="arab-fil0 arab-str0"/><g fill="#fff" fill-rule="evenodd" stroke="#fff"><path stroke-width=".4" d="M1071.9 2779.7c-25.9 38.9-7.2 64.2 19.5 66 17.6 1.3 54.2-24.9 54.1-55.7l-10-5.6c5.6 15.8-.2 20.8-12.1 31.6-23.5 21.3-71.5 22.8-51.5-36.3z" transform="matrix(.36355 0 0 .3308 -130 -670.9)"/><path d="M1277.2 2881.7c145.8 4.1 192.2-137 102.2-257.8l-8.9 13.3c5.8 56.3 14.2 111.8 15 169.5-17.6 20.7-43.2 13-48.3-10 .3-31.2-9.9-57.6-22.8-82.8l-7.2 13.3c8.4 20.7 17.5 44 19.4 69.5-41.6 49.9-87.6 60-70.5-5.6-32.9 57.5 16.9 98 73.3 9.5 12.1 60.4 58.9 22.9 61.7 9.9 5.1-39.6 2.5-103.4-7.8-153.8 40.6 70.3 42 121 20.4 154.9-24 37.7-76.2 55.3-126.5 70.1z" transform="matrix(.36355 0 0 .3308 -130 -670.9)"/><path d="M1359.9 2722.2c-31.2 2.3-47.2-4.1-30.3-27.2 16.7-22.6 32.3-4.6 36.5 25.6 3.9 28.3-54.8 64.4-75.1 64.4-30.7 0-44.9-39.5-16.6-75-36.4 103.6 78.6 43.5 85.5 12.2zm-21.6-24c-3.8-.2-6.6 6.5-4.7 7.8 5.5 3.8 14.2 1.5 15.1-.4 1.9-4.2-5.1-7.2-10.4-7.4z" transform="matrix(.36355 0 0 .3308 -130 -670.9)"/><path d="M1190.5 2771.1c-30 59-.1 83.4 38.4 76.6 22.4-4.1 50.8-20 67.2-41.7.3-47.8-.4-95.2-4.6-141.5 15-17.9-1.3-17.8-7-37-2.6 11.2-8.9 23.3-2.8 32q6.6 70 6.6 142.2c-30.2 24.3-52.9 33.3-69.1 33.1-33.5-.3-40.7-28.5-28.7-63.7z" transform="matrix(.36355 0 0 .3308 -130 -670.9)"/><path d="M1251.8 2786.7c-.5-44.5-1.2-95-5.2-126.1 15.6-17.3-.8-17.7-5.9-37.1-3 11-9.6 23-3.8 31.9 2.6 47.6 5.1 95.2 5.6 142.8 3.6-2.3 7.7-3.2 9.3-11.5z" transform="matrix(.36355 0 0 .3308 -130 -670.9)"/><path stroke-width=".4" d="M1135.4 2784.6c-3.8-4.8-6.5-10.2-9.6-14.9-.5-6.7 4-12.9 4.6-16.3 5.1 7.9 8.1 13.9 12.2 17.8m5.4 3.1c7.5 3 16.7 3 25.2 3.2 32.8.6 67.3-4.8 63.6 39.6a66 66 0 0 1-65.2 61.9c-41.7-.4-77.3-46.4-13-131.1 6.2-1 14.3.7 21 1.3 11.5.9 23.3-.2 36.8-11-1.6-27.9-1.6-54.3-5-79.5-5.8-8.9.8-20.8 3.8-31.9 5.1 19.4 21.4 19.8 5.9 37.2 3.7 28 4.1 56.5 4.1 73.5-7.8 11.9-13.9 24.5-36.7 29.3-23.3-3.4-33.8-36-58.1-25.2 6.7-29.4 68.4-36.1 74.6-12.9-4.1 24.2-61.7 14.5-77 92.7-4.7 24.1 20.7 46.3 46.8 44.5 25.5-1.7 52.7-19.4 55.4-49.2 2.1-24.9-33-22-47.7-21.7-21.4.5-34.9-2.8-43-7.5m21.9-53.9c3.8-3.6 17.1-6.1 21.9-.3q-5.5 3.5-10 8.1c-5-2.6-8.3-5.2-11.9-7.8z" transform="matrix(.36355 0 0 .3308 -130 -670.9)"/><path d="M1194 2650.9a49 49 0 0 1 5.3 21c-2.2 10.4-11.1 20.1-20.3 20.4-5.7.2-12.1-1.4-16.6-10.3-.5-1.1-2.9-3.7-5.2-2.5-10.1 16.6-17.6 23.6-26.7 23.5-18.2-.3-12.8-16.5-29.6-21.5-7-.2-18.5 6.9-24.4 20.8-22.4 63.5-42.8-.2-34.1-29.8 1.3 28.3 8.1 45.1 15.1 44.6 5.1-.5 9.6-12.3 16.1-24.7 5-9.5 17-26.6 29.7-26.6 11.6.3 4.3 21.6 27.5 21.3 11.2-.2 21.5-8.8 31.9-26 2.3-.4 2.9 3.7 3.4 5.1 1.6 5.9 11.8 22.1 25.6 7.3-.7-3.2-.4-8.5-3.9-9.6z" transform="matrix(.36355 0 0 .3308 -130 -670.9)"/><path stroke-width=".4" d="M1266.9 2598.3c-12.3 6.1-21.3.5-26.4-4.9 8.9-1.8 15.8-5 17.8-12-4-9-13.5-12.9-26.9-13-17.9.5-27.1 7.7-28.2 17.6 8.3.3 15.8-2 19 6-14.7 7.2-32 9.8-50.8 9.7-30.8 1.6-35.3-12.3-43.4-24.5-.6-.8-3.3-2.1-4.7-1.9-9.5 0-16.5 33.2-27.2 33.1-10.7-1.4-8.3-21.4-11.4-32.8-2.6 17.9 3.3 84.5 36.4 12.2 1-2.4 2.4-1.7 3.3.3 8.9 20.2 27 27.2 46.5 28.2 16.3.9 37.1-6.2 59.4-18.8 5.9 6.5 10.6 13.9 23 15.3 14.5.7 30-9.8 33.5-22.8 1.8-6.7 2.1-19.9-5-20.1-9.9-.3-17.1 23.7-14.8 45.3.2-.3 1.3-5.4 1.3-5.4m-43.8-28.8c6.5-3 12.8-4.4 17.8 2.2a27 27 0 0 0-8.4 4c-2.8-2.2-6.6-3.3-9.4-6.2zm47.8 14.9c1.6-7.1 2.5-12.8 8.3-16.5 1.2 7.5 1.4 11.7-8.3 16.5zm39 11c-1.9-6.1-3.8-11.4-4.4-18-1.4-13.4 10.1-21 20.5-19.9 10.7 1.1 17.8 5.1 28 8.6 8 2.7 18.8 4.8 29.1 7.7 5.8 2.6 0 9.4-1.5 10.3-25.8 10.1-44.1 26.1-60.5 26.8q-14.6.7-26.4-19c-.5-25.4-1.4-55.2-3.9-73.9 3.8-3.8 4.6-6.6 6.4-9.7 2 24.7 2.8 50.7 3.3 76.9 2.1 4.5 4.7 8.3 9.4 10.2zm16.5 2c-13.8 3.9-12.1-7.8-13.4-15-1.5-8.4-.5-17.9 10.2-15.5 13.9 3.7 26.6 8.6 38.9 13.8z" transform="matrix(.36355 0 0 .3308 -130 -670.9)"/><path stroke-width=".4" d="m1314.3 2621.3 1.9 9.3h1.5l-.6-8.7" transform="matrix(.36355 0 0 .3308 -130 -670.9)"/><path stroke-linecap="round" stroke-linejoin="round" stroke-width="4" d="m1094.2 2718.5 7-7.2 8.1 6.9-7.5 6.7zm17.8-2.4 7.1-7.2 8.1 6.9-7.5 6.7zm-49.5-74.6 7.1-7.2 8.1 6.9-7.5 6.7zm3.2 21.2 7.1-7.2 8 6.9-7.5 6.7zm128.5 35.5 6.5-5.3 6 6.5-6.8 4.8zm-85.8-135.7 4.6-4.7 5.3 4.5-4.9 4.4zm11.7-1.5 4.6-4.8 5.3 4.6-4.9 4.3zm245.6 53.7-4.4 3.7-4.2-4.3 4.6-3.4z" transform="matrix(.36355 0 0 .3308 -130 -670.9)"/><path stroke-width=".4" d="m1158.7 2747.4-.5 7.9 12.6 1.2 10.1-7.6z" transform="matrix(.36355 0 0 .3308 -130 -670.9)"/><path d="m1265.2 2599.8 3.7-.8-.4 10.3-2.3.9z" transform="matrix(.36355 0 0 .3308 -130 -670.9)"/></g><path fill="#fff" d="M320 326.3c51.6 0 93.6-38.2 93.6-85.2a82 82 0 0 0-32.6-64.4 70 70 0 0 1 19.2 48c0 40.8-35.9 73.9-80.2 73.9s-80.2-33.1-80.2-74c0-18.3 7.2-35.1 19.2-48a82 82 0 0 0-32.6 64.6c0 46.9 42 85.1 93.6 85.1" class="arab-fil2"/><g fill="#fff" stroke="#000" stroke-width="8"><path d="M-54 1623c-88 44-198 32-291-28-4-2-6 1-2 12 10 29 18 52-12 95-13 19 2 22 24 20 112-11 222-36 275-57zm-2 52c-35 14-95 31-162 43-27 4-26 21 22 27 49 5 112-30 150-61z" class="arab-fil2 arab-str2" transform="matrix(.23458 0 0 .21345 320 27.3)"/><path d="M0 1579c12 0 34-5 56-8 41-7 11 56-56 56v21c68 0 139-74 124-107-21-48-79-7-124-7s-103-41-124 7c-15 33 56 107 124 107v-21c-67 0-97-63-56-56 22 3 44 8 56 8z" class="arab-fil2 arab-str2" transform="matrix(.23458 0 0 .21345 320 27.3)"/><path d="M54 1623c88 44 198 32 291-28 4-2 6 1 2 12-10 29-18 52 12 95 13 19-2 22-24 20-112-11-222-36-275-57zm2 52c35 14 94 31 162 43 27 4 26 21-22 27-49 5-112-30-150-61z" class="arab-fil2 arab-str2" transform="matrix(.23458 0 0 .21345 320 27.3)"/><path d="M3 1665c2 17 5 54 28 38 31-21 38-37 38-67 0-19-23-47-69-47s-69 28-69 47c0 30 7 46 38 67 23 16 25-21 28-38 1-6 6-4 6 0z" class="arab-fil2 arab-str2" transform="matrix(.23458 0 0 .21345 320 27.3)"/></g><g fill="#fff" stroke="#000" stroke-width="8"><path d="M-29 384c-13-74-122-79-139-91-20-13-17 0-10 20 20 52 88 73 119 79 25 4 33 6 30-8z" class="arab-fil2 arab-str2" transform="matrix(.23458 0 0 .21345 320 27.3)"/><path d="M4 386c11-76-97-112-110-129-15-18-17-7-10 14 13 45 60 98 88 112 23 12 30 17 32 3z" class="arab-fil2 arab-str2" transform="matrix(.23458 0 0 .21345 320 27.3)"/><path d="M93 430c10-91-78-105-101-134-15-18-16-8-11 13 10 46 54 100 81 117 21 13 30 18 31 4z" class="arab-fil2 arab-str2" transform="matrix(.23458 0 0 .21345 320 27.3)"/><path d="M66 410c-91-59-155-26-181-29-25-3-33 13 10 37 53 29 127 25 156 14 30-12 21-18 15-22zm137 40c-28-98-93-82-112-94s-21-9-17 13c8 39 75 82 108 95 12 4 27 10 21-14z" class="arab-fil2 arab-str2" transform="matrix(.23458 0 0 .21345 320 27.3)"/><path d="M190 467c-78-63-139-16-163-23-18-5-10 7-3 12 50 35 112 54 160 32 19-8 20-10 6-21zm169 64c1-62-127-88-154-126-16-23-30-11-22 26 12 48 100 101 148 111 29 6 28-4 28-11z" class="arab-fil2 arab-str2" transform="matrix(.23458 0 0 .21345 320 27.3)"/><path d="M355 542c-81-73-149-49-174-56-25-6-35 9 4 39 48 36 122 43 153 36s23-14 17-19zm145 107c-23-106-96-128-114-148-17-20-35-14-20 34 18 57 77 107 108 119 30 13 28 3 26-5z" class="arab-fil2 arab-str2" transform="matrix(.23458 0 0 .21345 320 27.3)"/><path d="M499 663c-59-95-136-92-160-105-23-14-39-2-8 39 36 50 110 78 144 80s28-7 24-14z" class="arab-fil2 arab-str2" transform="matrix(.23458 0 0 .21345 320 27.3)"/><path d="M575 776c34-108-44-148-52-166-9-18-18-18-23 1-22 77 49 152 60 167 11 14 13 7 15-2z" class="arab-fil2 arab-str2" transform="matrix(.23458 0 0 .21345 320 27.3)"/><path d="M559 806c-27-121-98-114-114-131-17-17-19-5-16 17 8 59 79 99 111 119 10 6 22 13 19-5zm68 142c49-114-9-191-27-208-18-16-29-23-23 0 8 35-20 125 23 191 14 22 16 43 27 17z" class="arab-fil2 arab-str2" transform="matrix(.23458 0 0 .21345 320 27.3)"/><path d="M601 971c11-70-29-134-72-159-25-15-26-11-26 10 2 65 63 119 81 149 17 28 16 7 17 0z" class="arab-fil2 arab-str2" transform="matrix(.23458 0 0 .21345 320 27.3)"/><path d="M590 1153c-36-132 39-208 62-223 22-16 36-22 26 3-15 37 1 140-56 205-18 22-25 45-32 15z" class="arab-fil2 arab-str2" transform="matrix(.23458 0 0 .21345 320 27.3)"/><path d="M598 1124c30-115-35-180-55-193-19-13-31-18-22 3 12 32-1 122 49 178 16 19 22 38 28 12z" class="arab-fil2 arab-str2" transform="matrix(.23458 0 0 .21345 320 27.3)"/><path d="M561 1070c-54 58-55 143-31 193 15 29 17 27 31 6 38-61 15-149 17-188 1-37-11-17-17-11z" class="arab-fil2 arab-str2" transform="matrix(.23458 0 0 .21345 320 27.3)"/><path d="M650 1162c0 80-49 145-101 165-30 11-30 8-26-16 14-90 83-123 108-152 24-28 19-5 19 3z" class="arab-fil2 arab-str2" transform="matrix(.23458 0 0 .21345 320 27.3)"/><path d="M464 1400c88-80 41-136 45-188 2-28-9-21-19-11-56 55-59 153-47 191 5 17 13 15 21 8z" class="arab-fil2 arab-str2" transform="matrix(.23458 0 0 .21345 320 27.3)"/><path d="M582 1348c-29 88-106 142-171 145-38 2-37-1-24-27 49-94 136-105 175-129 36-22 23 2 20 11z" class="arab-fil2 arab-str2" transform="matrix(.23458 0 0 .21345 320 27.3)"/><path d="M343 1513c114-57 91-152 112-176 15-17-3-15-12-9-67 39-121 101-122 167 0 25 2 28 22 18z" class="arab-fil2 arab-str2" transform="matrix(.23458 0 0 .21345 320 27.3)"/><path d="M187 1619c144 23 211-86 253-96 22-5 6-14-5-15-96-11-218 34-255 84-15 20-15 24 7 27z" class="arab-fil2 arab-str2" transform="matrix(.23458 0 0 .21345 320 27.3)"/><path d="M333 1448c-29 95-137 173-218 179-38 3-38-1-24-26 65-118 178-138 218-168 34-26 27 6 24 15zM29 384c13-74 122-79 139-91 20-13 17 0 10 20-20 52-88 73-119 79-25 4-33 6-30-8z" class="arab-fil2 arab-str2" transform="matrix(.23458 0 0 .21345 320 27.3)"/><path d="M-4 386c-11-76 97-112 110-129 15-18 17-7 10 14-13 45-60 98-88 112-23 12-30 17-32 3z" class="arab-fil2 arab-str2" transform="matrix(.23458 0 0 .21345 320 27.3)"/><path d="M-93 430c-10-91 78-105 101-134 15-18 16-8 11 13-10 46-54 100-81 117-21 13-30 18-31 4z" class="arab-fil2 arab-str2" transform="matrix(.23458 0 0 .21345 320 27.3)"/><path d="M-66 410c91-59 155-26 181-29 25-3 33 13-10 37-53 29-127 25-156 14-30-12-21-18-15-22zm-137 40c28-98 93-82 112-94s21-9 17 13c-8 39-75 82-108 95-12 4-27 10-21-14z" class="arab-fil2 arab-str2" transform="matrix(.23458 0 0 .21345 320 27.3)"/><path d="M-190 467c78-63 139-16 163-23 18-5 10 7 3 12-50 35-112 54-160 32-19-8-20-10-6-21zm-169 64c-1-62 127-88 154-126 16-23 30-11 22 26-12 48-100 101-148 111-29 6-28-4-28-11z" class="arab-fil2 arab-str2" transform="matrix(.23458 0 0 .21345 320 27.3)"/><path d="M-355 542c81-73 149-49 174-56 25-6 35 9-4 39-48 36-122 43-153 36s-23-14-17-19zm-145 107c23-106 96-128 114-148 17-20 35-14 20 34-18 57-77 107-108 119-30 13-28 3-26-5z" class="arab-fil2 arab-str2" transform="matrix(.23458 0 0 .21345 320 27.3)"/><path d="M-499 663c59-95 136-92 160-105 23-14 39-2 8 39-36 50-110 78-144 80s-28-7-24-14z" class="arab-fil2 arab-str2" transform="matrix(.23458 0 0 .21345 320 27.3)"/><path d="M-575 776c-34-108 44-148 52-166 9-18 18-18 23 1 22 77-49 152-60 167-11 14-13 7-15-2z" class="arab-fil2 arab-str2" transform="matrix(.23458 0 0 .21345 320 27.3)"/><path d="M-559 806c27-121 98-114 114-131 17-17 19-5 16 17-8 59-79 99-111 119-10 6-22 13-19-5zm-68 142c-49-114 9-191 27-208 18-16 29-23 23 0-8 35 20 125-23 191-14 22-16 43-27 17z" class="arab-fil2 arab-str2" transform="matrix(.23458 0 0 .21345 320 27.3)"/><path d="M-601 971c-11-70 29-134 72-159 25-15 26-11 26 10-2 65-63 119-81 149-17 28-16 7-17 0z" class="arab-fil2 arab-str2" transform="matrix(.23458 0 0 .21345 320 27.3)"/><path d="M-590 1153c36-132-39-208-62-223-22-16-36-22-26 3 15 37-1 140 56 205 18 22 24 45 32 15z" class="arab-fil2 arab-str2" transform="matrix(.23458 0 0 .21345 320 27.3)"/><path d="M-598 1124c-30-115 35-180 55-193 19-13 31-18 22 3-12 32 1 122-49 178-16 19-22 38-28 12z" class="arab-fil2 arab-str2" transform="matrix(.23458 0 0 .21345 320 27.3)"/><path d="M-561 1070c54 58 55 143 31 193-15 29-17 27-31 6-38-61-15-149-17-188-1-37 11-17 17-11z" class="arab-fil2 arab-str2" transform="matrix(.23458 0 0 .21345 320 27.3)"/><path d="M-650 1162c0 80 49 145 101 165 30 11 30 8 26-16-14-90-83-123-108-152-24-28-19-5-19 3z" class="arab-fil2 arab-str2" transform="matrix(.23458 0 0 .21345 320 27.3)"/><path d="M-464 1400c-88-80-41-136-45-188-2-28 9-21 19-11 56 55 59 153 47 191-5 17-13 15-21 8z" class="arab-fil2 arab-str2" transform="matrix(.23458 0 0 .21345 320 27.3)"/><path d="M-582 1348c29 88 106 142 171 145 38 2 37-1 24-27-49-94-136-105-175-129-36-22-23 2-20 11z" class="arab-fil2 arab-str2" transform="matrix(.23458 0 0 .21345 320 27.3)"/><path d="M-343 1513c-114-57-91-152-112-176-15-17 3-15 12-9 67 39 121 101 122 167 0 25-2 28-22 18z" class="arab-fil2 arab-str2" transform="matrix(.23458 0 0 .21345 320 27.3)"/><path d="M-187 1619c-144 23-211-86-253-96-22-5-6-14 5-15 96-11 218 34 255 84 15 20 15 24-7 27z" class="arab-fil2 arab-str2" transform="matrix(.23458 0 0 .21345 320 27.3)"/><path d="M-333 1448c29 95 137 173 218 179 38 3 38-1 24-26-65-118-178-138-218-168-34-26-27 6-24 15z" class="arab-fil2 arab-str2" transform="matrix(.23458 0 0 .21345 320 27.3)"/></g><path fill="#006233" d="M359.6 128.9c-4.4-3-20.8-1.3-23.9-3.3 5.9 4.5 19 1.3 24 3.3zm39.7 7.6c-3.5-5.7-24.4-9.6-27.5-14.7 5.5 9.8 21.6 8.5 27.5 14.7m-3 6.6c-7.8-6.8-25.8-4-31.3-8 12.7 10.4 19.7 2.3 31.2 8zM351 112.8c4.9 2.4 11 4.7 14 10.3-3.5-4.3-9.8-6-15-9.6q.5-.1 1-.7m77 44c-3.1-6.4-14-13.4-14.9-15.8 3 8.3 12 10.3 14.8 15.8zm2.7 11.3c-9.4-13.4-24.1-12-30-17 4.5 4.9 21.4 8 30 17m21.8 20.7c.7-14.3-11-19.6-11.4-27.7-.3 9.6 12 22.6 11.4 27.7m-5.8 7.7c-2.4-12.4-18.3-13.2-21.1-20.5 0 6.8 18.7 13.9 21 20.5zm13.1-7c8.5 9.4 2.6 23.7 6.1 34.1-4.2-7.7-2.1-26.9-6-34.1zm-13.8 40c12.6 12.5 7.5 26.3 12.6 32.3-6.3-8.3-5.4-24.5-12.6-32.2zm26.3 1.8c-10.9 10.9-4.3 27.3-10 35 6.4-6.6 5.5-27 10-35m-13.7 0c-1.4-12.6-14.3-19.2-15.4-26-1.5 6.8 12.4 17.5 15.4 26m-6.5 30c2 8.8-5.7 27.6-3.3 33.4-5.2-10 4.4-29 3.3-33.3zm16.6 20.1c-5.1 15.6-15.5 14.6-18.7 24 2.3-9 16-17.1 18.7-24m-33.5 7.3c-6.8 10.5-1.2 22.4-6.8 29.9 8-7.5 3.7-21.4 6.8-29.9m16.4 28.6c-8.2 13.9-25.1 12.6-31.9 22.6 6.8-12.6 27.7-14.7 32-22.6zm-29.8-1.7c-14.5 9.2-10 18.8-21.1 29 13.8-10.2 12.7-21.5 21.1-29m-6.8 37.2c-14-.5-34.2 16.2-46.4 14.9 12.2 2.4 34.7-12.6 46.4-15zm-22.7-15c-1 13-37.6 21.4-41.5 30.1 4.4-11.5 36.6-20 41.5-30zm-82.8-240c-4.7-3.7-10.4-6.7-12-10.3 1.2 4.7 5.8 8 10.5 11.3.5-.2 1-.9 1.5-1.1zm-8 3.7c-7.3-3.2-15.7-3-19.5-7.4 2.4 4.4 10.3 6.1 17.1 8.5q1.2-.7 2.4-1zm-21.1 27.3c4.4-3 20.8-1.2 23.9-3.2-5.9 4.5-19 1.3-24 3.2zm-39.7 7.7c3.5-5.7 24.4-9.6 27.5-14.7-5.4 9.8-21.6 8.5-27.5 14.7m3 6.6c7.8-6.8 25.9-4 31.3-8-12.7 10.4-19.7 2.3-31.2 8zm31.3-20c4.4-8.6 17-9.6 20.4-14.8-5 7.7-15.7 9-20.4 14.8m36-7.5c13-5.5 25.7-.8 31.8-3.4-7.5 3.6-25.4 1.9-31.7 3.4zm-98.9 41.2c3-6.4 13.8-13.5 14.8-15.8-3 8.3-12 10.3-14.8 15.8m-2.8 11.3c9.4-13.4 24.1-12 30-17-4.4 4.9-21.3 8-30 17m-21.8 20.7c-.7-14.3 11-19.6 11.5-27.7.2 9.6-12 22.6-11.5 27.7m5.8 7.7c2.4-12.4 18.3-13.2 21.1-20.5 0 6.8-18.7 13.9-21 20.5zm-13.1-7c-8.4 9.4-2.6 23.6-6 34.1 4.1-7.7 2-26.9 6-34.1m13.8 40c-12.6 12.5-7.5 26.3-12.6 32.3 6.3-8.3 5.4-24.5 12.6-32.2zm-26.2 1.8c10.8 10.9 4.2 27.3 9.8 35-6.3-6.6-5.4-27-9.8-35m13.6 0c1.4-12.6 14.3-19.2 15.4-26 1.5 6.8-12.4 17.5-15.4 26m6.5 30c-2 8.8 5.7 27.6 3.3 33.4 5.2-10-4.4-29-3.3-33.3zm-16.6 20.1c5.2 15.6 15.5 14.6 18.8 24-2.4-9-16-17.1-18.8-24m33.5 7.3c6.8 10.5 1.2 22.4 6.8 29.9-8-7.5-3.7-21.4-6.8-29.9m-16.4 28.6c8.2 13.9 25.1 12.6 32 22.6-6.9-12.6-27.8-14.7-32-22.6m29.8-1.7c14.5 9.2 10.1 18.8 21.1 29-13.8-10.2-12.6-21.5-21.1-29m6.8 37.1c14-.4 34.3 16.3 46.4 15-12.1 2.3-34.7-12.6-46.4-15m22.8-15c.9 13.1 37.5 21.4 41.5 30.2-4.5-11.5-36.6-20-41.6-30.1zM301 116c2.8-11.5 17-13.6 18.8-20.5-.7 7.3-17.4 15.4-18.8 20.5m41.5-28.6c-2 8.8-17.3 13.7-19.4 20.3.7-9 16.4-14 19.4-20.3m-12 20.8c7.3-10.7 22.3-8 27.5-14.1-3.8 7.2-22.3 7.4-27.5 14z" class="arab-fil0"/><path fill="none" stroke="#f7c608" stroke-linecap="round" stroke-linejoin="round" stroke-width="1.8" d="M429.8 240c0 55.5-49.3 100.4-110.3 100.4-60.9 0-110.3-44.9-110.3-100.3 0-55.5 49.4-100.4 110.3-100.4 61 0 110.3 45 110.3 100.4z"/><path fill="#f7c608" d="m298 340.5-.5 1.2q-.5 1.3-2.1 1.2l-8-1.9 2.6-7.7 8 1.7q1.5.4 1 1.8l-.2 1m-19-4.8.4-1.2q.5-1.4 2-1l7.8 2.5-2.5 7.7q-4.2-1-7.9-2.3c-.8-.4-1-2-.7-2.9"/><path fill="#006233" d="m296.4 339.8-.3.9q-.5 1-1.7.8l-6.6-1.6 1.8-5.6c2.4.7 4.9 1.2 6.6 1.5q1.3.4 1 1.4l-.2.7m-15.8-4 .3-1q.4-.8 1.6-.6 2.8 1 6.5 2l-1.8 5.6-6.5-1.9c-.7-.4-1-1.5-.7-2.1"/><path fill="#f7c608" d="m267.7 330.8-.7 1q-.9 1.2-2.4.7c-2-1.2-4.7-2.5-7-3.9l4.8-6.8 7.1 3.7q1.2.8.5 2l-.6 1m-16.7-9.6.7-1q1-1.2 2.3-.5 2.8 2 6.7 4.4l-4.9 6.8-6.7-4.2c-.7-.7-.4-2.3 0-3"/><path fill="#006233" d="m266.5 329.7-.6.8q-.6.8-1.9.3c-1.6-1-3.8-2-5.8-3.2l3.5-4.9c2 1.3 4.3 2.4 5.9 3.1q1 .6.5 1.6l-.5.6m-13.8-7.9.5-.8q.7-.8 1.8-.2l5.6 3.6-3.5 4.9q-3.1-1.7-5.6-3.5c-.6-.5-.5-1.7-.1-2.2"/><path fill="#f7c608" d="m241.8 313.7-1 .8q-1.3.8-2.6 0c-1.5-1.6-3.7-3.5-5.5-5.5l6.7-5.3c2 2.1 4.2 4 5.7 5.4q1 1-.1 2l-.9.8m-13-13.4 1-.9q1.2-.8 2.3.2a73 73 0 0 0 5 6l-6.7 5.2q-2.9-3-5.2-5.8c-.5-.8.3-2.2 1-2.8"/><path fill="#006233" d="m240.9 312.4-.8.6q-.8.6-1.9-.2l-4.6-4.6 4.9-3.8 4.7 4.5q.7 1 0 1.7l-.7.5m-10.8-11.2.7-.6q1-.6 1.8.2 1.8 2.3 4.3 5l-4.9 3.7-4.3-4.8c-.4-.6.1-1.7.6-2.1"/><path fill="#f7c608" d="m222.2 290.7-1.3.5q-1.3.4-2.4-.6l-3.6-6.8 8.1-3.3c1.3 2.5 2.7 5 3.8 6.6q.5 1.3-.8 2l-1 .4m-8.4-16.2 1.2-.6q1.5-.4 2.2.8a71 71 0 0 0 3 7l-8 3.3a60 60 0 0 1-3.3-6.8c-.2-1 1-2.1 1.9-2.5"/><path fill="#006233" d="m221.7 289.2-.9.3q-1 .4-1.8-.6l-3-5.6 5.8-2.4 3.2 5.5q.4 1.2-.5 1.6l-.8.3m-7-13.5 1-.3q1-.4 1.6.6l2.5 5.8-5.7 2.4-2.7-5.7c-.2-.7.6-1.6 1.2-1.9"/><path fill="#f7c608" d="m210.5 263.5-1.4.2a2 2 0 0 1-2-1.2l-1.5-7.4 8.8-1.1a64 64 0 0 0 1.7 7.3q0 1.4-1.4 1.7l-1.2.2m-3-17.7 1.4-.2q1.5-.1 1.8 1.2.1 3.3.7 7.5l-8.8 1.1-1-7.4c.2-.9 1.7-1.7 2.6-1.8"/><path fill="#006233" d="m210.5 262-1 .1q-1 .1-1.5-1l-1.1-6.2 6.3-.8 1.3 6.1q.1 1.1-1 1.4l-.8.1m-2.5-14.7 1-.2q1.2 0 1.3 1.1.2 2.8.7 6.2l-6.3.8q-.6-3.1-.8-6.1c0-.7 1.1-1.4 1.8-1.5"/><path fill="#f7c608" d="m207.7 234.5-1.4-.2q-1.5-.2-1.6-1.7c.3-2 .5-4.8 1-7.4l8.7 1.2a65 65 0 0 0-.7 7.4q-.3 1.4-1.8 1.3l-1.2-.2m2.6-17.7 1.4.1q1.4.4 1.4 1.7a69 69 0 0 0-1.7 7.4l-8.8-1.2q.6-3.8 1.4-7.4c.4-.8 2.1-1.2 3-1"/><path fill="#006233" d="M208.2 233h-1q-1-.4-1.1-1.5l.8-6.1 6.3.8-.6 6.2q-.2 1.1-1.4 1h-.8m2.1-14.9 1 .2q1.1.2 1 1.4-.7 2.6-1.3 6l-6.3-.7 1.1-6.2c.3-.7 1.5-1 2.2-1"/><path fill="#f7c608" d="m214 206-1.3-.6q-1.3-.5-1-2c1-2 2-4.6 3.2-6.9l8 3.4a70 70 0 0 0-3 7q-.6 1.1-2 .7l-1.2-.5m8-16.4 1.3.6q1.3.6.8 2l-3.8 6.6-8.1-3.4q1.7-3.6 3.6-6.7c.6-.7 2.4-.7 3.2-.3"/><path fill="#006233" d="m215 204.7-1-.4c-.6-.2-.8-1-.6-1.6l2.6-5.7 5.8 2.4-2.5 5.8q-.6 1-1.6.6l-.8-.3m6.7-13.6.9.4q1 .4.5 1.6l-3.2 5.5-5.7-2.4q1.4-3.1 3-5.6c.4-.6 1.7-.7 2.3-.4"/><path fill="#f7c608" d="m228.9 180.2-1.1-.9q-1-.9-.4-2.2c1.6-1.6 3.4-3.9 5.2-5.8l6.8 5.3a72 72 0 0 0-5 6 2 2 0 0 1-2.4 0l-.9-.6m12.8-13.7 1 .8q1.2 1 .2 2.2l-5.7 5.3-6.8-5.3q2.8-3 5.6-5.5c.8-.5 2.5 0 3.2.5"/><path fill="#006233" d="m230.2 179.2-.8-.6q-.7-.7-.1-1.7l4.3-4.9 4.8 3.8-4.2 5q-.8.8-1.8.2l-.6-.5m10.6-11.4.8.6q.7.7 0 1.6l-4.8 4.6-4.8-3.8q2.3-2.6 4.6-4.6c.7-.5 2-.2 2.4.2"/><path fill="#f7c608" d="m251 159.2-.7-1q-.7-1.2.4-2.3c2-1.1 4.4-2.8 6.8-4.2l4.8 6.8a78 78 0 0 0-6.7 4.4 2 2 0 0 1-2.2-.4l-.7-1m16.5-9.8.7 1q.8 1.4-.4 2.1-3.3 1.5-7.2 3.7l-4.8-6.8q3.5-2.2 7-3.9c1-.2 2.4.7 2.9 1.4"/><path fill="#006233" d="m252.7 158.6-.6-.7q-.4-1 .4-1.7l5.7-3.5 3.4 4.8-5.5 3.7q-1.1.6-1.8-.3l-.5-.6m13.7-8.2.6.8q.4.9-.5 1.5l-6 3.1-3.4-4.8 5.8-3.3c.8-.2 1.9.4 2.3.9"/><path fill="#f7c608" d="m279 144.9-.5-1.3q-.2-1.3 1-2l7.9-2.3 2.5 7.7a83 83 0 0 0-7.8 2.6q-1.4.3-2-1l-.3-1m18.8-5.4.4 1.3q.3 1.3-1 1.8l-8.1 1.7-2.5-7.7a85 85 0 0 1 8-2c.9 0 2 1.3 2.3 2"/><path fill="#006233" d="m280.6 144.7-.3-1q-.1-.8 1-1.4l6.5-2 1.8 5.6-6.5 2q-1.2.4-1.6-.6l-.3-.7m15.7-4.4.3.9q.3 1-1 1.4-3 .5-6.6 1.4l-1.8-5.5 6.6-1.6c.8-.1 1.6.8 1.8 1.4"/><path fill="#f7c608" d="M310 138.2v-1.3q.2-1.3 1.7-1.7l8.2-.2v8.1a84 84 0 0 0-8.2.4q-1.6 0-1.6-1.5v-1m19.7-.2v1.2q-.1 1.4-1.7 1.5l-8.2-.4V135q4.3 0 8.2.2c1 .2 1.7 1.7 1.7 2.6"/><path fill="#006233" d="M311.8 138.5v-1q0-.9 1.3-1.2l6.9-.1v5.8q-4 0-6.9.3-1.2-.1-1.3-1v-.9m16.3-.1v.9q0 1-1.3 1l-6.8-.2v-5.8l6.8.1c.8.2 1.3 1.2 1.3 1.9"/><path fill="#f7c608" d="m340 139.6.3-1.2q.5-1.2 2.1-1.2l8 1.8-2.5 7.8-8-1.6q-1.4-.5-1.1-1.9l.3-1m19 4.7-.4 1.2q-.5 1.4-2 1l-7.8-2.4 2.5-7.8q4.1 1 7.8 2.3c.8.4 1 2 .8 2.8"/><path fill="#006233" d="m341.5 140.3.2-.9q.5-1 1.7-.8l6.6 1.5-1.7 5.6-6.7-1.4q-1.1-.4-1-1.4l.3-.7m15.8 4-.3.8q-.4 1-1.6.7l-6.5-2 1.7-5.6q3.5.9 6.6 1.9c.7.3 1 1.5.7 2"/><path fill="#f7c608" d="m370.2 149.1.7-1q.9-1.2 2.4-.7c2 1.1 4.7 2.4 7.1 3.8l-4.7 6.9a81 81 0 0 0-7.3-3.6q-1.2-.9-.5-2.1l.7-1m16.8 9.5-.8 1a2 2 0 0 1-2.2.5l-6.7-4.3 4.7-6.9q3.7 2 6.8 4.2c.7.6.4 2.2-.1 3"/><path fill="#006233" d="m371.5 150.2.5-.8q.6-.7 1.9-.4l5.8 3.2-3.4 5-6-3.1q-1-.6-.4-1.6l.4-.7m14 7.9-.6.8q-.6.8-1.8.2l-5.6-3.6 3.4-4.9 5.7 3.4c.6.6.5 1.7.1 2.3"/><path fill="#f7c608" d="m396.3 166 1-.9q1.2-.8 2.5 0l5.6 5.5-6.6 5.3a75 75 0 0 0-5.8-5.3q-1-1 .1-2l.9-.8m13.2 13.3-1 .9a2 2 0 0 1-2.4-.2 72 72 0 0 0-5-5.9l6.7-5.3 5.2 5.7c.4.8-.3 2.3-1 2.8"/><path fill="#006233" d="m397.2 167.3.7-.6q.8-.5 2 .1l4.6 4.6-4.8 3.8-4.8-4.5q-.8-.9 0-1.6l.7-.5m11 11-.8.7q-.9.6-1.8-.2l-4.3-4.9 4.8-3.8 4.4 4.7c.4.7-.1 1.8-.6 2.2"/><path fill="#f7c608" d="m416.1 188.9 1.3-.6q1.4-.4 2.4.7l3.7 6.6-8.1 3.5q-2-4-4-6.6-.5-1.3.9-2l1-.5m8.6 16.2-1.3.5c-.8.4-1.8 0-2.1-.7a71 71 0 0 0-3.1-7l8-3.4 3.3 6.9c.2.9-1 2-1.8 2.4"/><path fill="#006233" d="m416.6 190.4.9-.4q1-.4 1.8.6l3 5.5-5.8 2.5-3.2-5.5q-.4-1 .5-1.6l.8-.3m7 13.5-.8.3q-1 .4-1.7-.6-1-2.6-2.6-5.8l5.8-2.5 2.8 5.7c.1.8-.7 1.7-1.3 2"/><path fill="#f7c608" d="m428 215.9 1.4-.2a2 2 0 0 1 2.1 1.2l1.5 7.3-8.8 1.3a65 65 0 0 0-1.7-7.3q-.1-1.4 1.4-1.7l1.1-.2m3.2 17.7-1.4.2q-1.5.1-1.8-1.3l-.8-7.4 8.8-1.3 1 7.5c0 .9-1.6 1.7-2.5 1.8"/><path fill="#006233" d="m428 217.4 1-.1q1.1 0 1.5 1l1.2 6.1-6.3 1-1.3-6.2q-.2-1.2 1-1.3l.8-.2m2.6 14.7-1 .2q-1.1 0-1.4-1l-.7-6.3 6.3-.9q.7 3.3.9 6.2c0 .7-1.1 1.4-1.8 1.5"/><path fill="#f7c608" d="m431.1 244.9 1.4.1q1.5.3 1.7 1.8l-.9 7.4-8.8-1.1c.4-2.7.6-5.5.6-7.5.1-.8 1-1.4 1.9-1.2l1.1.1m-2.4 17.8-1.4-.2q-1.5-.2-1.4-1.7 1-3.1 1.6-7.3l8.8 1q-.6 4-1.3 7.4c-.4.9-2.1 1.3-3 1.2"/><path fill="#006233" d="M430.6 246.4h1q1 .4 1.2 1.5l-.8 6.2-6.3-.8.6-6.2q.1-1.1 1.3-1.1h.9m-2 14.9-1-.1q-1.1-.2-1-1.4.7-2.7 1.2-6.1l6.3.8-1 6c-.3.8-1.6 1.2-2.2 1"/><path fill="#f7c608" d="m425.1 273.5 1.3.5q1.3.7 1 2l-3 7-8.2-3.3a66 66 0 0 0 3-7q.6-1.2 2-.8l1.2.4m-7.9 16.5-1.2-.5q-1.4-.7-.9-2 1.9-2.8 3.8-6.6l8.1 3.3-3.5 6.7c-.6.7-2.4.7-3.3.3"/><path fill="#006233" d="m424.2 274.8 1 .3q.7.5.6 1.7l-2.6 5.7-5.9-2.3 2.5-5.8q.6-1 1.6-.8l.8.4m-6.5 13.6-1-.3q-1-.6-.4-1.6l3-5.5 5.9 2.3-3 5.6c-.5.6-1.8.7-2.4.4"/><path fill="#f7c608" d="m410.5 299.4 1.1.8q1 1 .4 2.3c-1.6 1.6-3.4 3.8-5.2 5.8L400 303c2-2 3.8-4.3 5-6q1-.9 2.3-.1l.9.7m-12.6 13.8-1-.8q-1.2-1-.3-2.1 2.6-2.2 5.7-5.5l6.8 5.3-5.5 5.6c-.8.5-2.5 0-3.2-.6"/><path fill="#006233" d="m409.2 300.4.8.6q.7.6.1 1.7l-4.3 4.8-4.9-3.7q2.6-2.8 4.2-5 .9-.8 1.8-.2l.6.5m-10.4 11.5-.8-.6q-.8-.7 0-1.7l4.6-4.5 5 3.7q-2.4 2.6-4.7 4.7c-.6.4-1.8.1-2.4-.3"/><path fill="#f7c608" d="m388.5 320.5.7 1q.7 1.3-.3 2.3l-6.7 4.3-5-6.8a78 78 0 0 0 6.7-4.4 2 2 0 0 1 2.2.4l.7.9m-16.4 10-.7-1q-.8-1.3.4-2.2l7.2-3.7 4.8 6.8-7 4c-.9.2-2.3-.7-2.9-1.4"/><path fill="#006233" d="m386.9 321.1.5.8q.5.8-.4 1.7l-5.6 3.5-3.5-4.8 5.6-3.7q1-.6 1.7.2l.5.7m-13.6 8.3-.6-.8q-.4-.9.5-1.6l6-3.1 3.4 4.8q-3 1.9-5.8 3.3c-.7.3-1.9-.3-2.2-.8"/><path fill="#f7c608" d="m360.8 335.1.4 1.2q.3 1.4-1 2l-7.8 2.5-2.6-7.8a75 75 0 0 0 7.7-2.6q1.5-.2 2 1l.4 1m-18.8 5.5-.4-1.3q-.3-1.4 1-1.8 3.6-.6 8-1.8l2.7 7.8-8 2c-1 0-2-1.3-2.3-2"/><path fill="#006233" d="m359 335.3.4.9q.2 1-1 1.5l-6.4 2-1.9-5.6 6.4-2q1.3-.4 1.7.6l.2.7m-15.6 4.5-.3-.9q-.2-1 1-1.4l6.6-1.5 1.9 5.6-6.6 1.6c-.8 0-1.7-.8-2-1.4"/><path fill="#f7c608" d="M329.7 342v1.3q-.1 1.4-1.6 1.7c-2.4 0-5.4.3-8.2.3l-.1-8.1a82 82 0 0 0 8.2-.5q1.6 0 1.6 1.5v1m-19.6.4v-1.2q0-1.4 1.6-1.5l8.2.3v8.1l-8.2-.1c-.9-.2-1.6-1.7-1.6-2.6"/><path fill="#006233" d="M328 341.8v.9q-.1.9-1.4 1.2l-6.8.2v-5.7q4-.1 6.8-.4 1.2 0 1.4 1v.8m-16.4.3v-1q0-.9 1.3-1 3 .3 6.9.2v5.8H313c-.8-.2-1.4-1.3-1.4-1.9"/></svg>',
'bayrak_asean': '<svg xml:space="preserve" id="__P__flag-icons-asean" viewBox="0 0 640 480"><path fill="#0039a6" d="M0 0h640v480H0z"/><circle cx="320" cy="240" r="144" fill="#fff"/><circle cx="320" cy="240" r="137.3" fill="#ed2939"/><use xlink:href="#__P__asean-a" transform="matrix(-1 0 0 1 640 0)"/><g id="__P__asean-a" fill="#f9e300"><path d="M357 240c24-14.4 35-43.2 35-72h-11v1c0 9.6-1.5 44.6-27.9 71a106 106 0 0 1 27.9 71v1h11c0-28.8-11.5-57.6-35-72"/><path d="M377.6 169v-1h-11.5v1.4c0 9.6-2 43.2-20.7 70.6 19.2 27.4 20.7 61 20.7 70.6v1.4h11.5v-1c0-9.6-2.4-44.6-27.8-71a106 106 0 0 0 27.8-71"/><path d="m341.1 240 1-1a130 130 0 0 0 20.1-69.6V168h-10.5v2c0 10-1.5 42.2-14.4 70a182 182 0 0 1 14.4 70v2h10.5v-1.4c0-9.6-1-39.9-20.1-69.6"/><path d="M333.4 240a178 178 0 0 0 14.4-72h-11v3.4c0 12-1 41.2-7.2 68.6a336 336 0 0 1 7.2 68.6v3.4h10.6v-2c0-10-1-43.1-13.5-69.5"/><path d="M325.8 240a331 331 0 0 0 6.7-68.6V168h-10.6v144h10.6v-3.4c0-11.5 0-41.2-6.7-68.1"/></g></svg>',
'bayrak_bm': '<svg id="__P__flag-icons-un" viewBox="0 0 640 480"><path fill="#4b92db" fill-rule="evenodd" d="M0 0h640v480H0z"/><g transform="translate(-40.6)scale(.6)"><path id="__P__un-a" fill="#fff" d="M663.9 587a71 71 0 0 1-9.5 8.6c-21.2-22-46.2-46.2-69.9-46.2-14.7 0-25.2 11.2-37.6 19-17.1 11-40.6 17.2-60.7 9.1a66 66 0 0 1-29.2-20 64 64 0 0 0 57.5 5c19.7-8.2 39.9-19.1 62.4-19.1 33.2 0 64.8 22.5 87 43.6m-245.6-69c22 25 57.9 17 87.2 23.2 4.1 1 8 2.3 12.4 1.6-3.5-2.2-8.2-2.5-12.2-4-22.8-8.6-26.3-33-38.8-49.7 16 10.6 29.1 25 44 38.7a74 74 0 0 0 36.7 16.2c-3.2 1.2-7.4 1-11 1.8-24 6-50.6 15.4-76.2 7a75 75 0 0 1-42-34.8zm-35.2-58c13.7 31.1 48.2 33.6 71 52.6a64 64 0 0 0 13.5 9.2l.3-.2a100 100 0 0 1-15.1-16.5c-13.1-19-8.8-45-18.9-65.2a142 142 0 0 1 23.1 34.9c8.5 20.2 11.4 43.3 30.5 58.7-20.7-6.8-44.5-5.5-63-17.6-19.6-12.8-37.7-33-41.4-55.8zm-14.7-62.8c2 27.4 31 42 45 64.5 3 4.8 6 9.8 10.3 13.6-.7-2.9-3-5.5-4.4-8.3a63 63 0 0 1-5.3-32.3c1.3-14 7.1-27 4.9-41.7 12 25.9 8.1 58.2 15 86.1 1.6 6.2 5.3 11.6 7.6 17.5-11.7-9-27.1-17-40-27a86 86 0 0 1-29-36.5 85 85 0 0 1-4.1-35.9m.8-50.4c1.4-6.1 2.5-12.4 5.1-18-5 25.8 12.2 44.4 18 66.8 2.2 8.4 3 17.3 6.4 25.2q.5 0 .8-.4c-8.5-23.8 4-45.8 16-64.5a55 55 0 0 0 6.2-16.5c1.3 10.8-1 23.2-3 34.3-2.5 14.3-7.4 27.7-11.3 41.5a65 65 0 0 0-.5 27.4l-1.3-1c-9-16.6-26.8-29.6-32.1-47.8a103 103 0 0 1-4.3-47m9.5-27.8a79 79 0 0 1 19-50q.4-.4 1-.4c-12.6 19-1.1 43.2-2.8 64.9l-1.6 22.2c.2.2.2.9.8.6.8-2.5 1-5.1 1.4-7.7 3-18 18.8-30.4 32.1-43a29 29 0 0 0 7-10.4c-1.1 9-3.6 18.1-7.6 26.2-10.3 20.8-30.1 37.6-33.7 61.3-1.7-22.7-15.6-39.6-15.6-63.7m33-65.9a46 46 0 0 1 22-14.6c-16.5 11.3-15.6 31.4-20.6 48.2-1.8 6.1-4.5 11.9-6 18.2l.5.4a54 54 0 0 1 13.5-19.9c11.5-10.8 28.8-17.4 34.5-33.3-.3 22.1-19.1 38.9-36.3 51.9a63 63 0 0 0-18.2 21.8c.6-6 1-11.2.4-17.1-1.8-19.3-3-41 10.3-55.6zm66.5-37.1c-12.1 10.7-20.2 24.4-29.6 36.7-7.7 10.3-18.4 16.6-27.5 25.2 5-10.2 5.8-22 12.1-31.9 10.7-17 28.5-23.6 45-30"/><use xlink:href="#__P__un-a" width="100%" height="100%" transform="matrix(-1 0 0 1 1202.2 0)"/></g><path fill="#fff" d="m409 262-2.1-1.2a97 97 0 0 1-17.9 25.4l-12.5-12.6a79 79 0 0 0 14.7-21.3l-2.1-1.2a77 77 0 0 1-14.4 20.8l-11.4-11.4a60 60 0 0 0 11.6-17.1l-2.1-1.2a58 58 0 0 1-11.2 16.6l-12.5-12.5a40 40 0 0 0 8-12.6l-2.1-1.2a38 38 0 0 1-7.6 12l-11.5-11.4a21 21 0 0 0 5.4-13h16.2a37 37 0 0 1-2.5 12.4l2.1 1.2a40 40 0 0 0 2.8-13.6h17.8a57 57 0 0 1-5 22.1l2.2 1.2a60 60 0 0 0 5.2-23.3h16.2a76 76 0 0 1-7.2 31l2.1 1.2a78 78 0 0 0 7.4-32.2h17.9a96 96 0 0 1-9.6 40.7za99 99 0 0 0 10-43 99 99 0 0 0-7.2-37.1l-2.2 1a96 96 0 0 1 7 34.9h-17.9a79 79 0 0 0-5.5-28l-2.2 1a76 76 0 0 1 5.4 27H380a60 60 0 0 0-4-20.6l-2.2 1a58 58 0 0 1 3.8 19.6H360a40 40 0 0 0-2.4-12.6l-2.2 1a38 38 0 0 1 2.2 11.6h-16.2a21 21 0 0 0-5.4-13l11.5-11.5a37 37 0 0 1 7.9 12.8l2.2-.9a40 40 0 0 0-8.4-13.6l12.6-12.6a58 58 0 0 1 12.2 19.2l2.2-1a60 60 0 0 0-12.8-19.9l11.5-11.4a76 76 0 0 1 16.1 25l2.2-1a79 79 0 0 0-16.7-25.7l12.6-12.6a96 96 0 0 1 20.5 31.3l2.2-1a99 99 0 0 0-21.8-32.8 99 99 0 0 0-33-21.9l-.8 2.3a96 96 0 0 1 31.3 20.4l-12.6 12.6a79 79 0 0 0-25.2-16.4l-1 2.2a76 76 0 0 1 24.5 16l-11.4 11.4a60 60 0 0 0-19-12.4l-.8 2.2a58 58 0 0 1 18 11.8l-12.5 12.6a40 40 0 0 0-12-7.8l-.9 2.3a37 37 0 0 1 11.2 7.2L334.2 203a21 21 0 0 0-13-5.4v-16.2a37 37 0 0 1 13.3 2.9l.9-2.2a40 40 0 0 0-14.2-3.1v-17.8a58 58 0 0 1 20.7 4.2l.9-2.2a60 60 0 0 0-21.6-4.4v-16.2a76 76 0 0 1 27.5 5.6l.8-2.2a79 79 0 0 0-28.3-5.7v-17.9a96 96 0 0 1 34.9 7l.8-2.3a99 99 0 0 0-36.9-7 98 98 0 0 0-44.2 10.4l1 2a96 96 0 0 1 42-10v17.8a78 78 0 0 0-33.7 8.1l1.1 2a76 76 0 0 1 32.6-7.8v16.2a60 60 0 0 0-25 6l1 2.1a58 58 0 0 1 24-5.7V179a40 40 0 0 0-15.7 3.8l1 2a37 37 0 0 1 14.7-3.4v16.2a21 21 0 0 0-7 1.6l1 2a19 19 0 0 1 7.2-1.3 19 19 0 0 1 13.4 5.5A19 19 0 0 1 339 219a19 19 0 0 1-19 19 19 19 0 0 1-13.4-5.6A19 19 0 0 1 301 219a19 19 0 0 1 5.6-13.5 19 19 0 0 1 6.2-4.1l-1.1-2.1a21 21 0 0 0-6 3.8l-11.4-11.5a38 38 0 0 1 9.9-6.7l-1.1-2a40 40 0 0 0-10.5 7L280 177.3a58 58 0 0 1 14.8-10.3l-1-2a60 60 0 0 0-15.4 10.7L266.9 164a76 76 0 0 1 19.3-13.6l-1-2a79 79 0 0 0-20 14l-12.6-12.7a97 97 0 0 1 24.3-17.2l-1.1-2.1a100 100 0 0 0-44.5 44.8l2 1a97 97 0 0 1 17.6-24.8l12.7 12.7a79 79 0 0 0-14.5 20.7l2 1.1a76 76 0 0 1 14.1-20.2l11.5 11.4a60 60 0 0 0-11.3 16.5l2 1.1a58 58 0 0 1 11-15.9l12.6 12.6a40 40 0 0 0-7.8 11.8l2.1 1.2a37 37 0 0 1 7.3-11.3l11.5 11.4a21 21 0 0 0-5.4 13.1h-16.2a38 38 0 0 1 2.8-13.2l-2-1.2a40 40 0 0 0-3.2 14.4h-17.8a58 58 0 0 1 5.2-22.9l-2-1a60 60 0 0 0-5.6 23.9h-16.2a76 76 0 0 1 7.5-31.7l-2.1-1.1a78 78 0 0 0-7.7 32.8h-17.9a96 96 0 0 1 9.9-41.3l-2.1-1.1a98 98 0 0 0-10.2 43.6 99 99 0 0 0 4 27.9l2.3-.6a97 97 0 0 1-3.9-26.1h17.9a79 79 0 0 0 3.3 21.7l2.3-.6a76 76 0 0 1-3.3-21.1H260a60 60 0 0 0 2.8 17.2l2.4-.6a58 58 0 0 1-2.8-16.6H280a40 40 0 0 0 2.3 12.2l2.3-.6a38 38 0 0 1-2.2-11.6h16.2a21 21 0 0 0 5.4 13l-11.5 11.5a37 37 0 0 1-7.9-12.9l-2.3.6a40 40 0 0 0 8.6 14l-12.7 12.6a58 58 0 0 1-13.2-22.2l-2.4.6a60 60 0 0 0 14 23.3L265.2 272a76 76 0 0 1-18.1-30.8l-2.3.6a78 78 0 0 0 18.7 31.9L251 286.3a96 96 0 0 1-23.5-40.1l-2.4.6a98 98 0 0 0 25 42 99 99 0 0 0 27.3 19.4l1.2-2.1a96 96 0 0 1-26-18.1l12.6-12.6a79 79 0 0 0 22.1 15l1.2-2a76 76 0 0 1-21.6-14.7l11.4-11.4a60 60 0 0 0 18.2 12l1.2-2.1a58 58 0 0 1-17.7-11.6l12.6-12.6a40 40 0 0 0 14 8.5l1.1-2.1a37 37 0 0 1-13.4-8.1l11.5-11.5a21 21 0 0 0 13 5.4v16.2a38 38 0 0 1-11-2l-1.3 2a40 40 0 0 0 12.3 2.4v17.8a58 58 0 0 1-21.1-4.4l-1.2 2a60 60 0 0 0 22.3 4.8v16.2a76 76 0 0 1-30.3-6.8l-1.2 2a78 78 0 0 0 31.5 7.2v17.8a96 96 0 0 1-40.2-9.3l-1.2 2a99 99 0 0 0 42.6 9.7c15.8 0 31-3.7 44.6-10.6l-1.2-2.2a96 96 0 0 1-42.2 10.4v-17.9a78 78 0 0 0 34-8.3l-1-2.1a76 76 0 0 1-33 8v-16a60 60 0 0 0 25.6-6.4l-1.1-2.1a57 57 0 0 1-24.5 6v-17.8a40 40 0 0 0 16.3-4l-1-2.2a37 37 0 0 1-15.3 3.8v-16.2a21 21 0 0 0 13-5.4l11.5 11.5a38 38 0 0 1-9.3 6.3l1.1 2.2a40 40 0 0 0 9.9-6.8l12.6 12.5a58 58 0 0 1-14.3 10.1l1 2.1a60 60 0 0 0 15-10.5l11.4 11.4a77 77 0 0 1-19 13.5l1.2 2.1a79 79 0 0 0 19.5-13.9l12.5 12.6a97 97 0 0 1-23.9 17.1l1.2 2.2a99 99 0 0 0 25.3-18.4A99 99 0 0 0 409 262"/><path fill="#fff" d="M325.7 196h-.6v.7h.6zm-1.5-1h.8v.6h-.8zm-1.4-.2.6.1.1-.6h-.7zm-.6-.2h-.7v-.7l.8.1zm-5.8-.8h.8v.6h-.8zm-1.7 1.2.7.1v-.6h-.6zm0 1-.7-.3v-.6l.9.3zm-1.4.7v-.6l.5-.1.1.6zm-78.6 61.6v-.5h-.5v1h.8v1.3h.6v-1.5zm7.5 9-1-1-.9-1.1-.4-1-.7-1.8 1.5.8.5 1.4.7.5.7 1.5zm20.7 27.1-.1-.9-.9-1.2 1.3.2 1.2 1.1.6 1.3-.8.4-.3-.6zm54-91.9h-1l-.3-2.2.6-.4v-1.1h-3.5v-1.1l.4-.3-.8-.3-.6.8-.2.9-1 .2v.5h-.7v1.3l-2.8 2.3-5.6-.2c-.3 1-1.3 0-1.3 0-.3-.7-1.6 0-1.6 0 0 1-2-.6-2-.6l-3.4-2.5c-2-1.8-5 .5-5.1 1 0 1.4-2.3.3-2.3.3s-2-.6-2.3.2-1.6.6-1.6.6l-.2.4-1 .2-.2.6-1.2.2h3c.8-.2-.3 1.7-.8 1.6H280l-.5.6h-1.3l-.6.8-1.9-.1s-1 .9-1 1.2c.1.3-.2 1.2-.5 1.2s-.9 1-.7 1.2c.2.3-.6 1.3-.6 1.3l-.2 1-.6.3v2.7l-1.2.8v1.2l-1.8 2 .2 1.5-1.5 1.7.2 1.6-.9.3-.2.7-.4 2.1 1 .1c.5-.2.4 1.3 0 1.6-.4.2-1.5.6-.9 1s-1.6.3-1.6-.3-1.2-1.2-1.5-1-.8-.9-.8-.9c-1-1-4.4.1-4.4.1l-.5 1.7c-1.1.1-1.8 2-1.8 2-1 .3-1.6 1.4-1.3 1.7s-.5.4-.5.4v2.2l-.5.7v2.5c.7 0 .6 1 .6 1-1 .2-.8 1.5-.8 1.5l-2.1.7-.4.6h-2.6l-.7.6-.7-.7h-5l-.2-.5-1-.2v-1.1h-1.6l-.3.7-1.6.1c.1 1-1.6 2.5-1.8 2.1s-1.3-1.5-.8-1.7l1.8-.4v-.7l-3.7-.1-.4.6-1.5.1v1.6l-.7.2c-.5.3.1 1.4.1 1.4.7.7 0 1.9 0 1.9-.7.6.4 1.7.4 1.7.8.2-.5.8-.5.8.2 1 .8 1.3.8 1.3-.6 1 .4 1.5.4 1.5l.1 1.7.7.4v1.2l.4.7h1.6v-2.6c-1.5-1.6 1.1-2 1.2-1.4s1.2 1 1.2 1c.2 1.5 2 2.4 2.4.8.5-1.5 1-.6 1.2.1.3.8 2.2 2.5 2.2 2.5h1.5l.2 1.4c1.7-.1 2.2 0 2.9 2.4a4 4 0 0 0 2.6 3l1.4-.1c0-1.3 1.4.2 1.4.8s2.7 2.9 2.7 2.9l2.7.6 2.5 2 1.9-.2h.8c.5-1.7 2.9.1 3 .7s1.8 1.7 2 1.2 1.3-.2 1.5 1.3 1 1.2 1 1.2l5.6-.1 2-1.7 5.1-.1c2.6-.1 1-3.7.5-3.7-.9-.7.3-3.6.3-3.6l-7.3-6.8c-1.7 0-.2-2.4-.2-2.4 1.3-.8-.3-2.2-.3-2.2.2-1.2-.7-2.6-.7-2.6-1.8-1.2-1.3-3.5-1.3-3.5V245c-1.5-1.4.6-1.6.6-1.6.7-1.2-.5-2.1-.5-2.1V240l-1.7-.2-.2-4.8-3.6-5.1c-.7-.2-.2-1.5-.2-1.5 1-.5-.2-1.7-.2-1.7v-2.2l2-.2.5-.8h1v-2.6c.4-1.4 1.6-.7 1.6-.7l1.4.1.8-1.5.2-1.2h-1c-1.3-.8-.7-3.4-.7-3.4 2-2.9 4.1-1.2 4.1-1.2l1.4-.1c2.1 1.4.2 4 .2 4-.4.6-.2 2.5-.2 2.5l.5 3.3-1.3 1c-1 .7-1 2.1.1 2.4.8.1.5 2-.7.7-1.8 0 1 1.6.2 1.2 1.8 1 1.4-.8 1.4-.8l2.4-1.9c1-.7 2.5 1.5 2.5 1.8s4 .1 4 .1c1 .7 1.5 2.6 1.5 2.6 1-1.5 3.4-.1 1.7.7 1.6 1 1.6 1.9 1.6 1.9 1.3-.4 1.3.6 1.3.9l.4-1.5c-1.5-1.1 2-1.5 1 .5l-.6.9 1 .8v2.3c2.3-.2 1.7-2.9 1.7-2.9l1-.2c0-1 .7-.4.7-.4-.7-3.4 1.6-4 1.6-4 1.3-.4 1.4-3.1 1.4-3.1-1-.4-.4-1.8.6-.6s-.6-2.4-.6-2.4l-.8-.7-1.1-.1-.1-1.1h-1.8l-.3 1.4-.7.2-.2-.4-.3 1H296l-.1-1.1 1-.3.5-.6.3-1.7h1.3l1.7-.5c0-1.7 1-1.3 1-1.3l.6.5.9.7v.6l-.5.3-.1.8.3 1.2h.7c.3-1.7 2.4-1.7 3-.6l.6-1.5c-1.4-.7 0-1.8.4-1.3s1.3-1.3 1.3-1.3.7 1 0-.3c-.7-1.2.5-1.8.5-1.8-.2-1.2 1.3-1 1.3-1l.1-1.7h-1.4c-.3 1.4-1.5.1-.9-.2s1.2-.9 1.2-.9v-1l.6-.2.1-1h1.5l1.3-.6.3-.5 1.4-.1 2-1.8-.2-.8c-1.2 0 0-1 0-1z"/><path fill="#fff" d="m276.7 222.6-1.8-.2.1.7h.5c.8 1.4.1 4.8.1 4.8s-1.2.1-1.4-.5-.7 1.3-.3 1.7 1.8 0 2 1c0 1.2.8-.6.8-.6z"/><path fill="#fff" d="m276.7 231.2.6-.1.1-.7-1.5 1-1-.6v2.4l1.6 2.1.6-1.4.2-.9-.7-.3zm.8 6.4v-1h-.7v.9zm-.9 4.8v-.7l-.8.1v.7zm1.2-3.1a.4.4 0 0 0 0-.9.4.4 0 0 0-.4.5q0 .3.4.4"/><circle cx="278.5" cy="241" r=".4" fill="#fff"/><circle cx="278.5" cy="229.4" r=".4" fill="#fff"/><path fill="#fff" d="m312.4 214.5-1-.1-.3.5h-.5v.8h.5l.1.6-.4.4-.2.5-.8.2-1.8 1.7v.8l-.6.7-.6 1.6h-2l-.5 1.9.3 1.5 1.8.7.2-1 .6-.3.1-1 .4-.7.6-.7.2-.8 1-.6 1.2-.3.5-.6.2-1.2v-.9l.5-.6 1.2-.5v-2h-.6zm2.8 6.9v-1.5l-.2-1.3-1.5-.7-1 1-.3 1.4v1l-1 .2-.2 2.7-.8.3.1 1-1 .3-1.2.3-.2 1.3-.8.5-.4 1.3-.5 2.9s1 1.7 1.4.9c.5-.8 1.3-1 1.3-1l.3-.6h2.7c.2-1 1.5-.6 1.5-.1s1 0 1 0l.7-1h1.1l.1-1.3.5-.3V227c1.6-.5 1.4-2 1.4-2l.4-.5-.2-.7c-.8-.3-.4-1 .1-.8s-.7-1-.7-1c-.6.6-1-.5-1-.5zm1.6 12.2c0 1.2-1.6 1.6-1.6 1.6l-1-.3-.7-.5V233l.8-.1.2.6zm5.4-6.5c.2 1 .2-1.4.6-1.3s.1-1.4.1-1.4l-1.8 1.3c.9.1 1 1 1.1 1.4m5.3-5.2c.4.9.3 2.2 1.8 3.2.5.3-.3 1-.8.7l-2-2.5V222c.4-.8.8-.5 1-.1m.3 31 .3.5.7-1-.6-.3-.7.5zM325 251v1.2m14.4-2.6.8-.5-.3-.6-.8.5zm28.9 21 .9.5v1.7c1.3 1.2 5.2.2 5.2-.1l-.2-3.8-.5-.5-.1-2.5c.4-1.3-2-3.2-2.1-2.8s-1.5 0-1.5.5-.8 2.4-.4 3.1-.3.7-.4 1.4-1.1 2-1 2.6zm-2.2-4c-.2.8-1 1.2-1.3 1-.4-.4.5.4.7.8q.5.6 1 0c.2-.4 0-1.3.3-1.7s-.6-.5-.7 0zm-4.7-18.6h.7v2h-.7zm10.4-19.4c-.5-.6 2-1.7 2.4-.4s0 1-.4.9-1.4.3-2-.5m2.1-13.6v.6l1 .2.1-.6zm-4.5 1.6.8.5h.3l.6-.4v.2l.6-.2-.2-.5v-.3l-.4.1-.7.5-.7-.5zM375 192h-1.5s.5.2-1-1.1c-1.3-1.3-2.2.3-2.2.3l-1.6.2v1.6l-.8.3v1h1.2s0 1.1.3.6 2.8.1 2.6 1.4c-.1.5 2.5 1.8 2.2 3.4 1.3.2 1 1.5 1 1.5l1.7.2.5-1 .5.1v-.6l-1.1-.3-.2-3.3-.7-.5.2-.8-.8-.3.4-1.3zm4.3 10.3h-.8l-1.8.2-1 2s.5.3 1 1c.3.7.5 4.8-.7 5.5s.1.3.1.3l-.2 2.3c.3 1 .8.5 1.1 0s.6-.6 1-1.1 1-1.5 1.1-2.2.6-1.8.3-2.1.3-1.7.3-1.7.4-.8 0-1.6.1-1.8.4-2.2zm1.2 4.2.1-.8h.6v.8zm0 2.8-.5-.3.3-.6.5.3zm-.9-8-.4-1s0-.8.2-1.2-.4-.8-.7-1c-.3 0-.2-.8-.3-1.2s-.8-.7-.8-.7l-.2-1.9c0-.3-.9-.7-.6-1l.8-.9c.3-.2-.3-1.6.2-1.3q.6.5.7 1.2c.2.4 0 1.8.4 2.1s0 1.4.7 1.4c.8 0 .3 1.9.3 1.9s-.2 1.4.3 1.5.2 2.5.2 2.5zm-6.4-16.5c.3.4.9.7.9 1.1s-.2.7.4.8q.9 0 1.2.4c.2.5.2 1.4 0 1.8q0 .8.7 1c.7.2.6 0 .6.4 0 .3.6-1.1.6-1.1-.5-.4-1-1.3-1-1.3l-.4-1.7c0-.2-.7-.4-1-.5s-.8-1-.8-1zm1-.9q-.4-.6-1-.9t-1.1-.4a.7.7 0 0 1-.6-1c.2-.4-.3-.6-.3-1s.3-.4.8-.1.4.4.8.9.6 1 1 .9.7.9 1 .6c.5-.3.4.7.4.7zm-11.7 11.4c.5.6-3 .4-3 0s.3-1.8 1.2-1.5 1-1.8 1-1.8-.8.1-.1-.3 0-1-.3-1.3l-.6-.8h1.4c.6-.4.8-2.3.8-2.3 1.2.4 1.8-.5 1.8-.5l.6 1.2c.4.5-1 .7-.5 1s.7 1.2.5 1.5-1.3 0-1.3-.3-.4.5 0 1-.5 1.2-.7 1.2-1.5.2-.4.8c1 .6 2.3.3 2.3.3s.9 0 1.2.4q.3.7-.6.6l-3-.2s-.6.7-.3 1m-6.4 1c.5-.1 1.7-.2 2 0 .1.4-.8.8-.8.8l-1.2.2q-.7-.9 0-1m12.9-8.5c.8-.4 2.5-.4 2.4-1s1-.9 1-.9l.3 1.2.9.7v1l-.7.2c-1.1.3-.4.8-.4.8H370l-.3-1-.8-1zm-4-5.5c.7 0-.1 2.3 1.5 2.1s0 .7 1.3.8c1.2.1.9-.9 1.3-1.6q.6-1-.5-1.3c-.7-.2-.7-.2-1-1-.1-.8-1-1-1-1l-.2-1.2-1.3.8-1.3 1.7c0 1.3.7.7 1.3.7zm2.7 8.5.3-.6.6.3-.3.6zm-1-1h.6v.8h-.6zm.5-13.4v.9h-.5l-.1-.8zm-1.7 9.4h.6v.5h-.6zm-1.6 0v-.6h1v.5zm-8.2 9.8-.6-.3.3-.7.6.3zm-3.2-1.9v-.6h1v.5zm-17.3-.2-2.2.1v.6h2.3zm-3.6.9-.2-.9.6-.1.2.9zm-.4.6-.2-.5.3-.1.2.5zm5-1.7-.1.7 1 .1s.5.4.5.7.7.6 1.1.6 1.5-.8 1.5-.8.5-1.4.1-1.3-1.2.7-1.3.1c0-.6-1.3-.3-1.3-.3zm5-1c0 .2-.3.6.3.7s1.7-.4 1.8.2.1 1 1 1.3l1.8.4 2-.2s1.3.3 1.6.5q1.6 1.8 2.1 1c.3-.5 0-1.7-.2-2 0-.5-1.5-2.4-2-2s-.6 0-1.5.3-2.8.1-2.9-.3c0-.4-1.5-.6-1.5-1s-1-1-.9-.3-.7.9-.9.7-.8.6-.8.6zm22.9-13 .7-2.3c-1-.2-.8-1.3-.8-1.3-.1-1-1.5-2-2-1.6s-.3-2.1-.3-2.1.9-.6 1.3-.3-3.4-5.1-4.2-4.6-2.6-.5-2.5-1.4c.1-1-3.6-4-3.6-4s-1.2-.8-1.4-.2-.6 1 0 1.4.5-.5 1.2.2 2 1.6 1.5 2.2l-1 .8.6.8h1.1l.2 1.7s1.2.6 1.5 1.3q.4 1 0 1.6c-.3.4-.9 1-.8 1.8.1.7 1 1 1 1h.7l.6.4v1.3c.8-.2 2.1 1 2 1.6 0 .7.2.3 1.2 1s.7.8 1.4 1.4q1.1.7 1.6-.8z"/><path fill="#fff" d="M347.5 165.6c0-.4-.3-1.8.3-1.7.6 0 .2 0 1 .3s.7-.5.7-.5h1.1l1.4 1-.2 1h-1c-.5-.7-1.5-.4-1.3.3s-.5 2-.9 2.1-1.7.1-1.6-.5zm-.8-2.7v-.9s0-.8-.6-.8-1.4-.6-1.2-1-1.7-.8-1.7-.8-1.7-1.6-1-1.4c.5.2.2-.7.2-.7s-1.2.2-1.5 0c-.3 0-.2-1-.2-1s-1.2-.2-1.2 0 .4.4.6 1 .1 1.6 1 1.8 1.1.4 1.2.8 1.2.5 1.2.5l.8.4zM336 152.5l-.3-.8-.8-.2v1zm-.3-4.2c-1-.8 1.4.6 1.4.6.8 0 1.3.6 1.3.9s1 .2 1 .2l.1-.7-.8-1-.7-.5s-1-.1-1-.4-1 1.2-1.4.9zm18.3.6c-.3.9-.4 2.1-.9 2.1s-.3 1.3-.3 1.3l1.7.1c.4.1.4 1.1.4 1.1 1.5 0 2.1 2 2 2.5-.3.5.5.5.5.5s0 1.6-.2 2 1.3.7 1.7 1.3-.2 2.6-.5 2.7.8.5.7 1 .3 0 .4.8l.3 2.5 1.4.1c.2-1.3 2.8-1.4 3.2-1.2 1.7.6 3 3.2 3 3.8s-1.1.7-1.1.7l.2 3c1.7.5 3 3 2.9 3.3-.2.4 1.2.3 1.2.3.2-1.8 1.9-1.2 2-.6 0 .6.4 2 .4 2l.5.8.7.7h1l.4.6 1.2.2s1.1 1.2 1.2 1.5 1.6.2 2 .3q.8 0 1.1.9c.1.5.7 1.3.7 1.3s1.2.3 1.3.7l.6 1.3 1 .8.1 1h1.1l.3 1.3 1.8-.1 1-.7a6 6 0 0 0 2.3-2c.1-.5.3-2 1.3-1.7s.3-2.2.3-2.2-1.4-1-1.3-1.5-1.4-1.5-1.3-2c.1-.3-1.3-1.2-1.2-1.6s-.7-1.5-.7-1.5L387 175l-.2-1h-1.2l-2.4-3 .1-.8h-.7V169l-.7-.4h-1l-2.3-2.5-.2-1.1h-1l.2-2.1c.7-1 .3-2.7.3-2.7s-1.4.7-2.1.4.3-1 .3-1v-.8l-.6-.6s-1.7.2-1.8-.1l-.4-1.6-.1-1.7-.7-.3-.1-.7-1.1.1v-1.2l-.6-.2-.6-.3-.1-1.2-2.2-.1-.7-1-.8-1.2-2.5-.2-.6-.6-1-.2-.7-.3-.3.5h-2v.7c-1 .5-5 0-5 .4zm10.5-2.7c-.2-.7 2-1.5 2.5-.9s1.9.7 2 3.8c.1 1-1.7-1.1-1.7-1.1l-1.5-.5q-1.2-.4-1.3-1.2zm-29.3 1.3-.5-.3.4-.9.5.3zm-5.1-10-1.3-1.3v-1l-.4-.5-.4-1.4-1.3-.4-1.3.5-1.4.9-1.5.2-.8 1 3.2.2.6 1 2.3.2 1.5 1.5c1.3.5 1.6-.2.8-.9m-.2-5c-.2-.8-1.5 1.2-.2 1.6s2.6 0 2.6 0l.3-.6 5 .1c.4-.4.6-1 .6-1s1.2-.4 1.7-.2 0-1.4-.4-1.2-1.5 0-1.5 0h-1.8c-.1-.6-1.7-.3-1.8 0-.1.5-.7.6-.7.6l-2.3.2c-.2.6-1.4 1-1.5.6zm-9.9 17.2c1.5.5 2.1 0 2.2-.3q0-.5.8-.6c.6-.1-.1-1.3-.7-1.2q-1 0-1.3-.7c-.1-.6-1.1-1.9-1.2-.9s-.7 1-.6 1.8c.1.7.4 1.7.8 1.9m-11.5 1.1c0-.4 2-.4 2.3-.1s.1.8 1 .8.5.6.4 1c0 .2-1 .1-1.2-.2 0-.3-1.6-.4-1.6-.4s-.8-.6-.9-1.1m34-21.7-.8.6-.5-.5-.5.5.7.7.2.2.2-.2 1-.8zm-5.5-1.8-.7-.4-.3.5.8.5h.3l1.1-.7-.3-.5zm-3.3 20.8-1-.1v.6h.8l.6 1 .5-.3-.7-1zm-33 28.2.1 1.1h1.5c.6 0-.5-.7-.5-.7s-1.2.1-1-.4zm2 0 .3-.4.6.5-.4.4zm-18.2-18.9.4-.4.6.6-.4.4zm29 130.3-1-.5-.3.5.6.3-.2.2.4.5.5-.5.3-.3zm-7.8-7.3-.4-.5-.6.5-.3.3.4.2.7.5.3-.5-.4-.3zm74.2-19.2c-.1-.5-.7-.7-.8-.8l-.2.6.2.1.1.5-.1.2.4.4q.6-.5.4-1m1-2h-1v-.9l1 .2zm23-7.8c.5-.3 1-.8 1 .4-.1 1.1-.6.7-1 1.1-.3.4-.6-1.1 0-1.5m5.1-4.3-.2-.7-.5.3.1.4q0 .3.2.5.1.2.4 0l-.1-.5zm-1.3.5.4 1.2.5-.2-.3-1.2zm-2.2 2.4h-.6c0 .4 0 1 .5 1l.2-.5zm-2.6-12-.4-.5q-.7-.2-1.5.4l.3.5q.7-.4 1-.4zm-27.7-32.4c-.4.4-1.3.6-1.3.6l-.3 1-.4.5v1c0 .7-1 1.1-1 1.1l-.4.5h-2.7c-1-.4-.3-1.6.3-1.5s-.1-1.7-.1-1.7l.8-.1s0-1.8.4-1.8q.3-.2-.5-1c-.4-.3-1-1.3-1.3-1.2h-2l-.3.6-1.1.2-.1 1c-.6.8-3 2.3-2-.2l.4-.7v-.9h-1.8s-1-.4-1-.8v-.9l-2.1-2.3-2.5-.3-.2-.5-1.5-.2c-1.8-1-3.4-.1-3 1.4.2 1.5.7 2.1-.3 2.1s-1.2-.8-1.2-.8-.8-.3-.8.1-.3 1.2 0 1.6-.4 1-.7.7-1-1.2-.9-1.5c.2-.3-1.4-2.2.2-2.5s0-1.2.5-1.4l.8-.4h.8l.5-.4-1.3-.2-.8-.1-1.5-.1a4 4 0 0 0-1.8 2.2c-.8 1.5-2.7-.6-2-1.4s-2.2-.1-2.7.3-2 .2-2 .2c-.3.9-1.7-.1-1.3-.7l.4-1-.5-.2-.6 1.2c-1.3 0-1.7.8-1.5 1.3.3.5-.4-.1-.6.6s.2.7.7 1c.6.3-.3.3.1.8s1.6 0 1 .7c-.8.7-2.1.4-2.1.4-.1 1-2 .7-2.2.4l-1.7-2.1-2-.1c-.1-1.4 1-.7 1.4-1.8s.6-3 .6-3-1.6 0-1.7.4-1.1.9-1.1.9-.8.3-.5.7-.6.6-.6.6.1.6-.1.9c-.8.8-2.8 0-3.1-.2l-1.2-.5-1.2-.8-1.4.6-.4.4h-1.5l-.1 1.2 2.7.3.2 2.5-1.1-.4h-.7l-.3-.6h-.6v2.1l.6.5.5.5 1 .1.2 1.3h2.5l.3.6h1.5l2.9 3-.2 1-.5.2c.2.7-1.3.3-1.3.3v.6l.7.1.7.4 1-1.7c1-.7 1.6.3 1.7 1 0 .5-.5.4-.5.4v1.5l.6.2c1 1.2-.4 1.9-.4 1.9l-.3 1c-.3.9-1.4.7-1.4.7l-.4.6-1.2.3 2.4.3q.5-1.2 1-.6c.4.4.4 1.1.4 1.1l.6.1-.1 1.1.6.2v3.3l.7.8c1.2-.5 1.2.3.6.7s-.2 2.2-.2 2.2l-.5.5v.8l-.6.4v1.2c-1-.5-2.2-.3-2.5 0-1-.6-2.8-.4-2.8 0 .6.9-.7 1-.7 1l-.7.9c.5 1-.5 1.1-.5 1.1v2l-1.2 1v2.7c0 .7 1.6.8 1.9.4s1.5.8 1.5.8h.9l.2-1.8-.6-.3v-3l1-1c1.2-.5.8 2.5.8 2.8 0 1.2.6 1 1 .8 1-.4.3 1.2-.5 1-.8 0-.3 1-.3 1l.5.3-1 .7-.7.9-1-.3-1.2-.1-.4-.7-.7-.1-.1 1.4-.5.6-1.2 1.2c1.6 0-.2 1.1-.6 1.1.9.3-.1 1.2-2.4.5v.7l-.8.1.7.9h.8l-.3 1.8c0 1.3-3.3.4-3.6 0v2h-.7l.1 1.2v1.7l1-.2v.7l2.7.1 3.9-4.1 2.3-.5c.2-1 1.2.2 1.2.2 1-.1 1.2.6 1.2.6l1.3.2c1 .3.4.4.5.8 0 .6.6.4.6.4l.2-1.3.6.1-.6-.7-1.1-.5-1.2-.5c-.8-1.1.2-1 1-.8h1.3s1.5 2 1.5 2.5.7.6.7.6h.9l.3.6h.9l.3.6h1.8v-.9l-1.6-.3-.1-1-1.2-.3c-.4-1.7.3-2.2.8-1.4h.6l-.2-1.4.7-.2-.2-2.2-.6-.2v-.7l2.5.1v-1.9h.8v.5l3.1.3 2.2-2.5c-.1-.2.2-.3 0-.5-.4-.3-.8 0-1.3-.3s0-2 0-2.5c-.2-.4 1.6-1 1.3 0-.3.8 0 1.3 0 1.3 1.3-1.3 2.4 0 2.3.4 0 .3.7.6 1.2.3s1.1.9 1 1.5c-.3.6-2 .5-2.2-.1q-.1-.7-.6-.1t-1.6.2l-.1-.2-2.2 2.5h.1c1.2.7.6 1.6.2 1.8s-1 .2-1 .2l-.3.4-2.6.2-.2 1c-1.2-.1-1.7 1.3-1.4 2s0 1.3 0 1.3l1 .5 1.5-.4c.2-1 1-1.2 1.8-1.8s2.1 1 1.7 1.9l-.4 1.1.1 1-1 .3-.8.4v.5h-2.8l-.4.5-1.3.1-.4.7h-1s-1.4.8-.8 1.6-2.5.7-3.2-.4c-.2 1-1.3 0-1.3 0l-1.1-.2-.1-1.5c-.2-1-2.1-1-2-.3 0 .7-3.6.3-3.6.3l-1.2.5-1.1.7-.1.5-1.8.2-.8.4-.3-.6h-.8l-.8 1c-2 .2-4 1.4-3.9 2 .2.4-.8 1-.8 1l-.9.2-.6 1-1.2.3-.2 2.2-.6.4v.9l-.7.2v.5h-1l.6 1.6.8.4c1.4.2.8 2 .8 2h.8l.4 1.1.8 1.7c.3 1.2 1.2.9 1.6.8s.8 1.2.8 1.2l4 .1s-.2.4.5.6 5.3.4 5.5.1c-.2-.9 2.5-1.1 3.6-.3 1 .8 2.6.3 2.6.3l1.5 1.8 1 2.3 1.7.5 1.2.3.4 1.7h.9l.3 1.2c1 .8-.3 2.5-.3 2.5v2.3l.8.4-.1.8 1.3 1.3h1.5l3.7 4.1 3 1 .5 1.6.8-.1.6-.5 2.4-.1 1.2-1.2 1.3-.2 11-9.4-1-.6v-2.2c1.9-1.3 2-3.7.3-3.9-1.3-.1-.7-1.5.5-1.7l.7-.3v-.9l2.3-2.1v-1.6l-5-4.2c-2.2-.8 0-5.7 1.5-5.6s-.1-7.4-.1-7.4l-.8-.4.2-2.5h-1.1l-1.8 2.4-.5 1.6c-.2 2.1-6.4 1.7-6.7 1.4s-2.4-1.2-2.4-1.2-1.6-1.3-1.9-1c-.3.5-1.7-.4-1.7-.1s-1.3-.8-1.3-.8l-2-.7 1.5-.3-.3-1.2 2.6 1.3c.3.4 1.6.3 1.6.3l.4.5s.8 0 1.3.5c.5.7 3.1.2 3.1.2l.7.6 1.1.4h3.1l.1-1.9.6-.6v-1.2l.6-.6v-1l.6-.2.1-2.2.5-.1v-4.9l-1.5-1.4c-.1.5-1.7.5-1.7.5s-.4.7-.7.7.4 1 .2 1.5-1 .6-1 .6l-1.5.4-.4.5h-1.6l-.2-1.3 1.8-.5 1-.5.5-1c.1-1 1.3-.9 1.3-.9s2.3-2 2.4-2.8c.1-1 .9-3.5 2.3-3.5h2.6c1-.4.7-1.7.7-1.7l1.3-.2.2.7s1.8.2 2 0c.2-.4.6-1 1-.8.6.3 2.2-.7 2.2-.7 0-.7 2.6-.4 2.6-.4l.3-1s-1.7-2.3-2-2.3-2-1.4-2.1-.9c-1.6-.4-1.5-2.6-1.5-2.6l-.6-1.4c0-.8-1.5-2.5-1.8-2.3a1.5 1.5 0 0 1 0-2.6c.4 0 1.4-1.5 1.4-1.5l.5-1.4 1.7-.5.2-1.3-1-.1s1-1.9 1.6-1.9 3.8 0 4-.2c.4-.2 1-1.8 1-2 0-.4.8-.5 1-.6.4 0 1-.9 1.3-1.3.2-.4-.5-3-1-2.5"/><path fill="#fff" d="M320 242c.1 0 .3.5.6.4s.5.6.1.6q-.2.1-.2.5 0 .3-.3.8-.3.2-.7-.1-.4-.2-.9-.2c-.3 0 0 .6 0 .6s-1.6 0-1.3-.3q.6-.3.4-.4t0-.6c.1-.4.7-.2.5-.4s0-1.1.4-.6l.2-.5c-.2-.3 0-.3-.5-.5s-.1-1-.1-1v-.7c.2-.7 1.7-.8 1.8-.1v1.1l.5.2s-.1.4-.5.4 0 .2-.2.5l.2.4zm-5 .8c.3-.4.8-2.4 1.4-1.8s1 0 1 0 .3.3.1 1q-.2.9-.6 1.2l-1.2.4c-.4 0-.6-.8-.6-.8z"/></svg>',
'bayrak_nato': '<svg viewBox="0 0 1024 768"><rect width="1024" height="768" fill="#004990"/><g transform="translate(166.4 38.4) scale(1.35)"><g><path fill="#ffffff" d="m365.9 273.9l46-17.9l-46-17.9l-25.3-9.8l-41-16l-16-41a89.4 89.4 0 0 1 57 57l25.3 9.8a112 112 0 0 0-92-92l-17.9-46l-17.9 46a112 112 0 0 0-92 92l-46 17.9l46 17.9a112 112 0 0 0 92 92l17.9 46l17.9-46a112 112 0 0 0 92-92m-83.5-44.3L256 256h94.4l-68 26.4L256 256v94.4l-26.4-68L256 256h-94.4l68-26.4L256 256v-94.4zm-54-58.2l-16 41l-41 16a89.4 89.4 0 0 1 57-57m-57 112.3l41 16l16 41a89.4 89.4 0 0 1-57-57m112.3 57l16-41l41-16a89.4 89.4 0 0 1-57 57"/><path fill="#004990" d="M350.4 256H256l26.4 26.4zm-188.8 0H256l-26.4-26.4zm94.4 94.4V256l-26.4 26.4zm0-94.4l26.4-26.4l-26.4-68z"/><path fill="#ffffff" d="M244.9 33.4H267v44.5h-22zM33.4 244.9h44.5V267H33.4zM244.9 434H267v44.5h-22zM434 244.9h44.5V267H434z"/></g></g></svg>',
'bayrak_tr': '<svg id="__P__flag-icons-tr" viewBox="0 0 640 480"><g fill-rule="evenodd"><path fill="#e30a17" d="M0 0h640v480H0z"/><path fill="#fff" d="M407 247.5c0 66.2-54.6 119.9-122 119.9s-122-53.7-122-120 54.6-119.8 122-119.8 122 53.7 122 119.9"/><path fill="#e30a17" d="M413 247.5c0 53-43.6 95.9-97.5 95.9s-97.6-43-97.6-96 43.7-95.8 97.6-95.8 97.6 42.9 97.6 95.9z"/><path fill="#fff" d="m430.7 191.5-1 44.3-41.3 11.2 40.8 14.5-1 40.7 26.5-31.8 40.2 14-23.2-34.1 28.3-33.9-43.5 12-25.8-37z"/></g></svg>',
'beach': '<svg class="ik" style="--ik-l:#FFB300;--ik-d:#FFB300" viewBox="0 0 24 24" aria-hidden="true" focusable="false"><path d="M15,18.54C17.13,18.21 19.5,18 22,18V22H5C5,21.35 8.2,19.86 13,18.9V12.4C12.16,12.65 11.45,13.21 11,13.95C10.39,12.93 9.27,12.25 8,12.25C6.73,12.25 5.61,12.93 5,13.95C5.03,10.37 8.5,7.43 13,7.04V7A1,1 0 0,1 14,6A1,1 0 0,1 15,7V7.04C19.5,7.43 22.96,10.37 23,13.95C22.39,12.93 21.27,12.25 20,12.25C18.73,12.25 17.61,12.93 17,13.95C16.55,13.21 15.84,12.65 15,12.39V18.54M7,2A5,5 0 0,1 2,7V2H7Z"/></svg>',
'beaker': '<svg class="ik" style="--ik-l:#00897B;--ik-d:#80C4BD" viewBox="0 0 24 24" aria-hidden="true" focusable="false"><path d="M3,3V5A2,2 0 0,1 5,7V19A2,2 0 0,0 7,21H17A2,2 0 0,0 19,19V7A2,2 0 0,1 21,5V3H3M7,9H10V10H7V9M7,11H10V12H7V11M10,16H7V15H10V16M12,14H7V13H12V14M12,8H7V7H12V8Z"/></svg>',
'bed': '<svg class="ik" style="--ik-l:#7E57C2;--ik-d:#BEABE0" viewBox="0 0 24 24" aria-hidden="true" focusable="false"><path d="M19,7H11V14H3V5H1V20H3V17H21V20H23V11A4,4 0 0,0 19,7M7,13A3,3 0 0,0 10,10A3,3 0 0,0 7,7A3,3 0 0,0 4,10A3,3 0 0,0 7,13Z"/></svg>',
'blur-linear': '<svg class="ik" style="--ik-l:#7E57C2;--ik-d:#BEABE0" viewBox="0 0 24 24" aria-hidden="true" focusable="false"><path d="M13,17A1,1 0 0,0 14,16A1,1 0 0,0 13,15A1,1 0 0,0 12,16A1,1 0 0,0 13,17M13,13A1,1 0 0,0 14,12A1,1 0 0,0 13,11A1,1 0 0,0 12,12A1,1 0 0,0 13,13M13,9A1,1 0 0,0 14,8A1,1 0 0,0 13,7A1,1 0 0,0 12,8A1,1 0 0,0 13,9M17,12.5A0.5,0.5 0 0,0 17.5,12A0.5,0.5 0 0,0 17,11.5A0.5,0.5 0 0,0 16.5,12A0.5,0.5 0 0,0 17,12.5M17,8.5A0.5,0.5 0 0,0 17.5,8A0.5,0.5 0 0,0 17,7.5A0.5,0.5 0 0,0 16.5,8A0.5,0.5 0 0,0 17,8.5M3,3V5H21V3M17,16.5A0.5,0.5 0 0,0 17.5,16A0.5,0.5 0 0,0 17,15.5A0.5,0.5 0 0,0 16.5,16A0.5,0.5 0 0,0 17,16.5M9,17A1,1 0 0,0 10,16A1,1 0 0,0 9,15A1,1 0 0,0 8,16A1,1 0 0,0 9,17M5,13.5A1.5,1.5 0 0,0 6.5,12A1.5,1.5 0 0,0 5,10.5A1.5,1.5 0 0,0 3.5,12A1.5,1.5 0 0,0 5,13.5M5,9.5A1.5,1.5 0 0,0 6.5,8A1.5,1.5 0 0,0 5,6.5A1.5,1.5 0 0,0 3.5,8A1.5,1.5 0 0,0 5,9.5M3,21H21V19H3M9,9A1,1 0 0,0 10,8A1,1 0 0,0 9,7A1,1 0 0,0 8,8A1,1 0 0,0 9,9M9,13A1,1 0 0,0 10,12A1,1 0 0,0 9,11A1,1 0 0,0 8,12A1,1 0 0,0 9,13M5,17.5A1.5,1.5 0 0,0 6.5,16A1.5,1.5 0 0,0 5,14.5A1.5,1.5 0 0,0 3.5,16A1.5,1.5 0 0,0 5,17.5Z"/></svg>',
'blur-radial': '<svg class="ik" style="--ik-l:#7E57C2;--ik-d:#BEABE0" viewBox="0 0 24 24" aria-hidden="true" focusable="false"><path d="M14,13A1,1 0 0,0 13,14A1,1 0 0,0 14,15A1,1 0 0,0 15,14A1,1 0 0,0 14,13M14,16.5A0.5,0.5 0 0,0 13.5,17A0.5,0.5 0 0,0 14,17.5A0.5,0.5 0 0,0 14.5,17A0.5,0.5 0 0,0 14,16.5M12,20A8,8 0 0,1 4,12A8,8 0 0,1 12,4A8,8 0 0,1 20,12A8,8 0 0,1 12,20M12,2A10,10 0 0,0 2,12A10,10 0 0,0 12,22A10,10 0 0,0 22,12A10,10 0 0,0 12,2M17,9.5A0.5,0.5 0 0,0 16.5,10A0.5,0.5 0 0,0 17,10.5A0.5,0.5 0 0,0 17.5,10A0.5,0.5 0 0,0 17,9.5M17,13.5A0.5,0.5 0 0,0 16.5,14A0.5,0.5 0 0,0 17,14.5A0.5,0.5 0 0,0 17.5,14A0.5,0.5 0 0,0 17,13.5M14,7.5A0.5,0.5 0 0,0 14.5,7A0.5,0.5 0 0,0 14,6.5A0.5,0.5 0 0,0 13.5,7A0.5,0.5 0 0,0 14,7.5M14,9A1,1 0 0,0 13,10A1,1 0 0,0 14,11A1,1 0 0,0 15,10A1,1 0 0,0 14,9M10,7.5A0.5,0.5 0 0,0 10.5,7A0.5,0.5 0 0,0 10,6.5A0.5,0.5 0 0,0 9.5,7A0.5,0.5 0 0,0 10,7.5M7,13.5A0.5,0.5 0 0,0 6.5,14A0.5,0.5 0 0,0 7,14.5A0.5,0.5 0 0,0 7.5,14A0.5,0.5 0 0,0 7,13.5M10,16.5A0.5,0.5 0 0,0 9.5,17A0.5,0.5 0 0,0 10,17.5A0.5,0.5 0 0,0 10.5,17A0.5,0.5 0 0,0 10,16.5M7,9.5A0.5,0.5 0 0,0 6.5,10A0.5,0.5 0 0,0 7,10.5A0.5,0.5 0 0,0 7.5,10A0.5,0.5 0 0,0 7,9.5M10,13A1,1 0 0,0 9,14A1,1 0 0,0 10,15A1,1 0 0,0 11,14A1,1 0 0,0 10,13M10,9A1,1 0 0,0 9,10A1,1 0 0,0 10,11A1,1 0 0,0 11,10A1,1 0 0,0 10,9Z"/></svg>',
'bomb': '<svg class="ik" style="--ik-l:#B71C1C;--ik-d:#DB8E8E" viewBox="0 0 24 24" aria-hidden="true" focusable="false"><path d="M11.25,6A3.25,3.25 0 0,1 14.5,2.75A3.25,3.25 0 0,1 17.75,6C17.75,6.42 18.08,6.75 18.5,6.75C18.92,6.75 19.25,6.42 19.25,6V5.25H20.75V6A2.25,2.25 0 0,1 18.5,8.25A2.25,2.25 0 0,1 16.25,6A1.75,1.75 0 0,0 14.5,4.25A1.75,1.75 0 0,0 12.75,6H14V7.29C16.89,8.15 19,10.83 19,14A7,7 0 0,1 12,21A7,7 0 0,1 5,14C5,10.83 7.11,8.15 10,7.29V6H11.25M22,6H24V7H22V6M19,4V2H20V4H19M20.91,4.38L22.33,2.96L23.04,3.67L21.62,5.09L20.91,4.38Z"/></svg>',
'book-multiple': '<svg class="ik" style="--ik-l:#5D4037;--ik-d:#AEA09B" viewBox="0 0 24 24" aria-hidden="true" focusable="false"><path d="M19,18H9A2,2 0 0,1 7,16V4A2,2 0 0,1 9,2H10V7L12,5.5L14,7V2H19A2,2 0 0,1 21,4V16A2,2 0 0,1 19,18M17,20V22H5A2,2 0 0,1 3,20V6H5V20H17Z"/></svg>',
'book-open-variant': '<svg class="ik" style="--ik-l:#5D4037;--ik-d:#AEA09B" viewBox="0 0 24 24" aria-hidden="true" focusable="false"><path d="M12 21.5C10.65 20.65 8.2 20 6.5 20C4.85 20 3.15 20.3 1.75 21.05C1.65 21.1 1.6 21.1 1.5 21.1C1.25 21.1 1 20.85 1 20.6V6C1.6 5.55 2.25 5.25 3 5C4.11 4.65 5.33 4.5 6.5 4.5C8.45 4.5 10.55 4.9 12 6C13.45 4.9 15.55 4.5 17.5 4.5C18.67 4.5 19.89 4.65 21 5C21.75 5.25 22.4 5.55 23 6V20.6C23 20.85 22.75 21.1 22.5 21.1C22.4 21.1 22.35 21.1 22.25 21.05C20.85 20.3 19.15 20 17.5 20C15.8 20 13.35 20.65 12 21.5M12 8V19.5C13.35 18.65 15.8 18 17.5 18C18.7 18 19.9 18.15 21 18.5V7C19.9 6.65 18.7 6.5 17.5 6.5C15.8 6.5 13.35 7.15 12 8M13 11.5C14.11 10.82 15.6 10.5 17.5 10.5C18.41 10.5 19.26 10.59 20 10.78V9.23C19.13 9.08 18.29 9 17.5 9C15.73 9 14.23 9.28 13 9.84V11.5M17.5 11.67C15.79 11.67 14.29 11.93 13 12.46V14.15C14.11 13.5 15.6 13.16 17.5 13.16C18.54 13.16 19.38 13.24 20 13.4V11.9C19.13 11.74 18.29 11.67 17.5 11.67M20 14.57C19.13 14.41 18.29 14.33 17.5 14.33C15.67 14.33 14.17 14.6 13 15.13V16.82C14.11 16.16 15.6 15.83 17.5 15.83C18.54 15.83 19.38 15.91 20 16.07V14.57Z"/></svg>',
'bookmark': '<svg class="ik" style="--ik-l:#8E24AA;--ik-d:#C692D4" viewBox="0 0 24 24" aria-hidden="true" focusable="false"><path d="M17,3H7A2,2 0 0,0 5,5V21L12,18L19,21V5C19,3.89 18.1,3 17,3Z"/></svg>',
'bookshelf': '<svg class="ik" style="--ik-l:#795548;--ik-d:#BCAAA4" viewBox="0 0 24 24" aria-hidden="true" focusable="false"><path d="M9 3V18H12V3H9M12 5L16 18L19 17L15 4L12 5M5 5V18H8V5H5M3 19V21H21V19H3Z"/></svg>',
'bottle-wine': '<svg class="ik" style="--ik-l:#BF5B2E;--ik-d:#DFAD96" viewBox="0 0 24 24" aria-hidden="true" focusable="false"><path d="M10,22A1,1 0 0,1 9,21V11C9,9 10,7.25 11,7V2.5A0.5,0.5 0 0,1 11.5,2H12.5A0.5,0.5 0 0,1 13,2.5V7C14,7.25 15,9 15,11V21A1,1 0 0,1 14,22H10Z"/></svg>',
'bowl-mix': '<svg class="ik" style="--ik-l:#FB8C00;--ik-d:#FB8C00" viewBox="0 0 24 24" aria-hidden="true" focusable="false"><path d="M16.2 11L20.3 4.5L22 5.5L18.6 11H16.2M15.6 12H2V15C2 18.9 5.1 22 9 22H15C18.9 22 22 18.9 22 15V12H15.6Z"/></svg>',
'brain': '<svg class="ik" style="--ik-l:#F06292;--ik-d:#F06292" viewBox="0 0 24 24" aria-hidden="true" focusable="false"><path d="M21.33,12.91C21.42,14.46 20.71,15.95 19.44,16.86L20.21,18.35C20.44,18.8 20.47,19.33 20.27,19.8C20.08,20.27 19.69,20.64 19.21,20.8L18.42,21.05C18.25,21.11 18.06,21.14 17.88,21.14C17.37,21.14 16.89,20.91 16.56,20.5L14.44,18C13.55,17.85 12.71,17.47 12,16.9C11.5,17.05 11,17.13 10.5,17.13C9.62,17.13 8.74,16.86 8,16.34C7.47,16.5 6.93,16.57 6.38,16.56C5.59,16.57 4.81,16.41 4.08,16.11C2.65,15.47 1.7,14.07 1.65,12.5C1.57,11.78 1.69,11.05 2,10.39C1.71,9.64 1.68,8.82 1.93,8.06C2.3,7.11 3,6.32 3.87,5.82C4.45,4.13 6.08,3 7.87,3.12C9.47,1.62 11.92,1.46 13.7,2.75C14.12,2.64 14.56,2.58 15,2.58C16.36,2.55 17.65,3.15 18.5,4.22C20.54,4.75 22,6.57 22.08,8.69C22.13,9.8 21.83,10.89 21.22,11.82C21.29,12.18 21.33,12.54 21.33,12.91M16.33,11.5C16.9,11.57 17.35,12 17.35,12.57A1,1 0 0,1 16.35,13.57H15.72C15.4,14.47 14.84,15.26 14.1,15.86C14.35,15.95 14.61,16 14.87,16.07C20,16 19.4,12.87 19.4,12.82C19.34,11.39 18.14,10.27 16.71,10.33A1,1 0 0,1 15.71,9.33A1,1 0 0,1 16.71,8.33C17.94,8.36 19.12,8.82 20.04,9.63C20.09,9.34 20.12,9.04 20.12,8.74C20.06,7.5 19.5,6.42 17.25,6.21C16,3.25 12.85,4.89 12.85,5.81V5.81C12.82,6.04 13.06,6.53 13.1,6.56A1,1 0 0,1 14.1,7.56C14.1,8.11 13.65,8.56 13.1,8.56V8.56C12.57,8.54 12.07,8.34 11.67,8C11.19,8.31 10.64,8.5 10.07,8.56V8.56C9.5,8.61 9.03,8.21 9,7.66C8.92,7.1 9.33,6.61 9.88,6.56C10.04,6.54 10.82,6.42 10.82,5.79V5.79C10.82,5.13 11.07,4.5 11.5,4C10.58,3.75 9.59,4.08 8.59,5.29C6.75,5 6,5.25 5.45,7.2C4.5,7.67 4,8 3.78,9C4.86,8.78 5.97,8.87 7,9.25C7.5,9.44 7.78,10 7.59,10.54C7.4,11.06 6.82,11.32 6.3,11.13C5.57,10.81 4.75,10.79 4,11.07C3.68,11.34 3.68,11.9 3.68,12.34C3.68,13.08 4.05,13.77 4.68,14.17C5.21,14.44 5.8,14.58 6.39,14.57C6.24,14.31 6.11,14.04 6,13.76C5.81,13.22 6.1,12.63 6.64,12.44C7.18,12.25 7.77,12.54 7.96,13.08C8.36,14.22 9.38,15 10.58,15.13C11.95,15.06 13.17,14.25 13.77,13C14,11.62 15.11,11.5 16.33,11.5M18.33,18.97L17.71,17.67L17,17.83L18,19.08L18.33,18.97M13.68,10.36C13.7,9.83 13.3,9.38 12.77,9.33C12.06,9.29 11.37,9.53 10.84,10C10.27,10.58 9.97,11.38 10,12.19A1,1 0 0,0 11,13.19C11.57,13.19 12,12.74 12,12.19C12,11.92 12.07,11.65 12.23,11.43C12.35,11.33 12.5,11.28 12.66,11.28C13.21,11.31 13.68,10.9 13.68,10.36Z"/></svg>',
'bread-slice': '<svg class="ik" style="--ik-l:#D39B5B;--ik-d:#D39B5B" viewBox="0 0 24 24" aria-hidden="true" focusable="false"><path d="M12,2C17.5,2 22,5.36 22,9.5C22,11.19 21.26,12.75 20,14V22H4V14C2.74,12.75 2,11.19 2,9.5C2,5.36 6.5,2 12,2M8,18H12V14H8V18Z"/></svg>',
'briefcase': '<svg class="ik" style="--ik-l:#5D4037;--ik-d:#AEA09B" viewBox="0 0 24 24" aria-hidden="true" focusable="false"><path d="M10,2H14A2,2 0 0,1 16,4V6H20A2,2 0 0,1 22,8V19A2,2 0 0,1 20,21H4C2.89,21 2,20.1 2,19V8C2,6.89 2.89,6 4,6H8V4C8,2.89 8.89,2 10,2M14,6V4H10V6H14Z"/></svg>',
'brush': '<svg class="ik" style="--ik-l:#EF6C00;--ik-d:#EF6C00" viewBox="0 0 24 24" aria-hidden="true" focusable="false"><path d="M20.71,4.63L19.37,3.29C19,2.9 18.35,2.9 17.96,3.29L9,12.25L11.75,15L20.71,6.04C21.1,5.65 21.1,5 20.71,4.63M7,14A3,3 0 0,0 4,17C4,18.31 2.84,19 2,19C2.92,20.22 4.5,21 6,21A4,4 0 0,0 10,17A3,3 0 0,0 7,14Z"/></svg>',
'bus': '<svg class="ik" style="--ik-l:#F9A825;--ik-d:#F9A825" viewBox="0 0 24 24" aria-hidden="true" focusable="false"><path d="M18,11H6V6H18M16.5,17A1.5,1.5 0 0,1 15,15.5A1.5,1.5 0 0,1 16.5,14A1.5,1.5 0 0,1 18,15.5A1.5,1.5 0 0,1 16.5,17M7.5,17A1.5,1.5 0 0,1 6,15.5A1.5,1.5 0 0,1 7.5,14A1.5,1.5 0 0,1 9,15.5A1.5,1.5 0 0,1 7.5,17M4,16C4,16.88 4.39,17.67 5,18.22V20A1,1 0 0,0 6,21H7A1,1 0 0,0 8,20V19H16V20A1,1 0 0,0 17,21H18A1,1 0 0,0 19,20V18.22C19.61,17.67 20,16.88 20,16V6C20,2.5 16.42,2 12,2C7.58,2 4,2.5 4,6V16Z"/></svg>',
'cake': '<svg class="ik" style="--ik-l:#F48FB1;--ik-d:#F48FB1" viewBox="0 0 24 24" aria-hidden="true" focusable="false"><path d="M11.5,0.5C12,0.75 13,2.4 13,3.5C13,4.6 12.33,5 11.5,5C10.67,5 10,4.85 10,3.75C10,2.65 11,2 11.5,0.5M18.5,9C21,9 23,11 23,13.5C23,15.06 22.21,16.43 21,17.24V23H12L3,23V17.24C1.79,16.43 1,15.06 1,13.5C1,11 3,9 5.5,9H10V6H13V9H18.5M12,16A2.5,2.5 0 0,0 14.5,13.5H16A2.5,2.5 0 0,0 18.5,16A2.5,2.5 0 0,0 21,13.5A2.5,2.5 0 0,0 18.5,11H5.5A2.5,2.5 0 0,0 3,13.5A2.5,2.5 0 0,0 5.5,16A2.5,2.5 0 0,0 8,13.5H9.5A2.5,2.5 0 0,0 12,16Z"/></svg>',
'calculator': '<svg class="ik" style="--ik-l:#455A64;--ik-d:#A2ACB2" viewBox="0 0 24 24" aria-hidden="true" focusable="false"><path d="M7,2H17A2,2 0 0,1 19,4V20A2,2 0 0,1 17,22H7A2,2 0 0,1 5,20V4A2,2 0 0,1 7,2M7,4V8H17V4H7M7,10V12H9V10H7M11,10V12H13V10H11M15,10V12H17V10H15M7,14V16H9V14H7M11,14V16H13V14H11M15,14V16H17V14H15M7,18V20H9V18H7M11,18V20H13V18H11M15,18V20H17V18H15Z"/></svg>',
'calendar': '<svg class="ik" style="--ik-l:#E53935;--ik-d:#F29C9A" viewBox="0 0 24 24" aria-hidden="true" focusable="false"><path d="M19,19H5V8H19M16,1V3H8V1H6V3H5C3.89,3 3,3.89 3,5V19A2,2 0 0,0 5,21H19A2,2 0 0,0 21,19V5C21,3.89 20.1,3 19,3H18V1M17,12H12V17H17V12Z"/></svg>',
'calendar-month': '<svg class="ik" style="--ik-l:#E53935;--ik-d:#F29C9A" viewBox="0 0 24 24" aria-hidden="true" focusable="false"><path d="M9,10V12H7V10H9M13,10V12H11V10H13M17,10V12H15V10H17M19,3A2,2 0 0,1 21,5V19A2,2 0 0,1 19,21H5C3.89,21 3,20.1 3,19V5A2,2 0 0,1 5,3H6V1H8V3H16V1H18V3H19M19,19V8H5V19H19M9,14V16H7V14H9M13,14V16H11V14H13M17,14V16H15V14H17Z"/></svg>',
'calendar-today': '<svg class="ik" style="--ik-l:#E53935;--ik-d:#F29C9A" viewBox="0 0 24 24" aria-hidden="true" focusable="false"><path d="M7,10H12V15H7M19,19H5V8H19M19,3H18V1H16V3H8V1H6V3H5C3.89,3 3,3.9 3,5V19A2,2 0 0,0 5,21H19A2,2 0 0,0 21,19V5A2,2 0 0,0 19,3Z"/></svg>',
'calendar-week': '<svg class="ik" style="--ik-l:#E53935;--ik-d:#F29C9A" viewBox="0 0 24 24" aria-hidden="true" focusable="false"><path d="M6 1H8V3H16V1H18V3H19C20.11 3 21 3.9 21 5V19C21 20.11 20.11 21 19 21H5C3.89 21 3 20.1 3 19V5C3 3.89 3.89 3 5 3H6V1M5 8V19H19V8H5M7 10H17V12H7V10Z"/></svg>',
'camera': '<svg class="ik" style="--ik-l:#424242;--ik-d:#A0A0A0" viewBox="0 0 24 24" aria-hidden="true" focusable="false"><path d="M4,4H7L9,2H15L17,4H20A2,2 0 0,1 22,6V18A2,2 0 0,1 20,20H4A2,2 0 0,1 2,18V6A2,2 0 0,1 4,4M12,7A5,5 0 0,0 7,12A5,5 0 0,0 12,17A5,5 0 0,0 17,12A5,5 0 0,0 12,7M12,9A3,3 0 0,1 15,12A3,3 0 0,1 12,15A3,3 0 0,1 9,12A3,3 0 0,1 12,9Z"/></svg>',
'camera-account': '<svg class="ik" style="--ik-l:#424242;--ik-d:#A0A0A0" viewBox="0 0 24 24" aria-hidden="true" focusable="false"><path d="M4,5H7L9,3H15L17,5H20A2,2 0 0,1 22,7V19A2,2 0 0,1 20,21H4A2,2 0 0,1 2,19V7A2,2 0 0,1 4,5M16,17V16C16,14.67 13.33,14 12,14C10.67,14 8,14.67 8,16V17H16M12,9A2,2 0 0,0 10,11A2,2 0 0,0 12,13A2,2 0 0,0 14,11A2,2 0 0,0 12,9Z"/></svg>',
'car': '<svg class="ik" style="--ik-l:#C62828;--ik-d:#E29494" viewBox="0 0 24 24" aria-hidden="true" focusable="false"><path d="M5,11L6.5,6.5H17.5L19,11M17.5,16A1.5,1.5 0 0,1 16,14.5A1.5,1.5 0 0,1 17.5,13A1.5,1.5 0 0,1 19,14.5A1.5,1.5 0 0,1 17.5,16M6.5,16A1.5,1.5 0 0,1 5,14.5A1.5,1.5 0 0,1 6.5,13A1.5,1.5 0 0,1 8,14.5A1.5,1.5 0 0,1 6.5,16M18.92,6C18.72,5.42 18.16,5 17.5,5H6.5C5.84,5 5.28,5.42 5.08,6L3,12V20A1,1 0 0,0 4,21H5A1,1 0 0,0 6,20V19H18V20A1,1 0 0,0 19,21H20A1,1 0 0,0 21,20V12L18.92,6Z"/></svg>',
'carrot': '<svg class="ik" style="--ik-l:#FF6F00;--ik-d:#FF6F00" viewBox="0 0 24 24" aria-hidden="true" focusable="false"><path d="M16,10L15.8,11H13.5A0.5,0.5 0 0,0 13,11.5A0.5,0.5 0 0,0 13.5,12H15.6L14.6,17H12.5A0.5,0.5 0 0,0 12,17.5A0.5,0.5 0 0,0 12.5,18H14.4L14,20A2,2 0 0,1 12,22A2,2 0 0,1 10,20L9,15H10.5A0.5,0.5 0 0,0 11,14.5A0.5,0.5 0 0,0 10.5,14H8.8L8,10C8,8.8 8.93,7.77 10.29,7.29L8.9,5.28C8.59,4.82 8.7,4.2 9.16,3.89C9.61,3.57 10.23,3.69 10.55,4.14L11,4.8V3A1,1 0 0,1 12,2A1,1 0 0,1 13,3V5.28L14.5,3.54C14.83,3.12 15.47,3.07 15.89,3.43C16.31,3.78 16.36,4.41 16,4.84L13.87,7.35C15.14,7.85 16,8.85 16,10Z"/></svg>',
'cash-multiple': '<svg class="ik" style="--ik-l:#2E7D32;--ik-d:#96BE98" viewBox="0 0 24 24" aria-hidden="true" focusable="false"><path d="M5,6H23V18H5V6M14,9A3,3 0 0,1 17,12A3,3 0 0,1 14,15A3,3 0 0,1 11,12A3,3 0 0,1 14,9M9,8A2,2 0 0,1 7,10V14A2,2 0 0,1 9,16H19A2,2 0 0,1 21,14V10A2,2 0 0,1 19,8H9M1,10H3V20H19V22H1V10Z"/></svg>',
'castle': '<svg class="ik" style="--ik-l:#757575;--ik-d:#BABABA" viewBox="0 0 24 24" aria-hidden="true" focusable="false"><path d="M2,13H4V15H6V13H8V15H10V13H12V15H14V10L17,7V1H19L23,3L19,5V7L22,10V22H11V19A2,2 0 0,0 9,17A2,2 0 0,0 7,19V22H2V13M18,10C17.45,10 17,10.54 17,11.2V13H19V11.2C19,10.54 18.55,10 18,10Z"/></svg>',
'cellphone': '<svg class="ik" style="--ik-l:#424242;--ik-d:#A0A0A0" viewBox="0 0 24 24" aria-hidden="true" focusable="false"><path d="M17,19H7V5H17M17,1H7C5.89,1 5,1.89 5,3V21A2,2 0 0,0 7,23H17A2,2 0 0,0 19,21V3C19,1.89 18.1,1 17,1Z"/></svg>',
'chart-bar': '<svg class="ik" style="--ik-l:#1565C0;--ik-d:#8AB2E0" viewBox="0 0 24 24" aria-hidden="true" focusable="false"><path d="M22,21H2V3H4V19H6V10H10V19H12V6H16V19H18V14H22V21Z"/></svg>',
'chart-bell-curve': '<svg class="ik" style="--ik-l:#1565C0;--ik-d:#8AB2E0" viewBox="0 0 24 24" aria-hidden="true" focusable="false"><path d="M9.96,11.31C10.82,8.1 11.5,6 13,6C14.5,6 15.18,8.1 16.04,11.31C17,14.92 18.1,19 22,19V17C19.8,17 19,14.54 17.97,10.8C17.08,7.46 16.15,4 13,4C9.85,4 8.92,7.46 8.03,10.8C7.03,14.54 6.2,17 4,17V2H2V22H22V20H4V19C7.9,19 9,14.92 9.96,11.31Z"/></svg>',
'chart-line': '<svg class="ik" style="--ik-l:#2E7D32;--ik-d:#96BE98" viewBox="0 0 24 24" aria-hidden="true" focusable="false"><path d="M16,11.78L20.24,4.45L21.97,5.45L16.74,14.5L10.23,10.75L5.46,19H22V21H2V3H4V17.54L9.5,8L16,11.78Z"/></svg>',
'cheese': '<svg class="ik" style="--ik-l:#FDD835;--ik-d:#FDD835" viewBox="0 0 24 24" aria-hidden="true" focusable="false"><path d="M11 17.5C11 16.67 11.67 16 12.5 16C12.79 16 13.06 16.09 13.29 16.23L20.75 11.93C20.35 11.22 19.9 10.55 19.41 9.9C19.29 9.96 19.15 10 19 10C18.45 10 18 9.55 18 9C18 8.8 18.08 8.62 18.18 8.46C16.45 6.64 14.34 5.2 12 4.25C11.85 5.24 11 6 10 6C8.9 6 8 5.11 8 4C8 3.72 8.06 3.45 8.16 3.21C7.3 3.08 6.41 3 5.5 3C5.33 3 5.17 3 5 3.03V9.05C6.14 9.28 7 10.29 7 11.5S6.14 13.72 5 13.95V21L11 17.54C11 17.53 11 17.5 11 17.5M14 9C15.11 9 16 9.9 16 11S15.11 13 14 13 12 12.11 12 11 12.9 9 14 9M9 16C8.45 16 8 15.55 8 15S8.45 14 9 14 10 14.45 10 15 9.55 16 9 16M9 10C8.45 10 8 9.55 8 9S8.45 8 9 8 10 8.45 10 9 9.55 10 9 10Z"/></svg>',
'chef-hat': '<svg class="ik" style="--ik-l:#78909C;--ik-d:#78909C" viewBox="0 0 24 24" aria-hidden="true" focusable="false"><path d="M12.5,1.5C10.73,1.5 9.17,2.67 8.67,4.37C8.14,4.13 7.58,4 7,4A4,4 0 0,0 3,8C3,9.82 4.24,11.41 6,11.87V19H19V11.87C20.76,11.41 22,9.82 22,8A4,4 0 0,0 18,4C17.42,4 16.86,4.13 16.33,4.37C15.83,2.67 14.27,1.5 12.5,1.5M12,10.5H13V17.5H12V10.5M9,12.5H10V17.5H9V12.5M15,12.5H16V17.5H15V12.5M6,20V21A1,1 0 0,0 7,22H18A1,1 0 0,0 19,21V20H6Z"/></svg>',
'chevron-down': '<svg class="ik" style="--ik-l:#5F6368;--ik-d:#AFB1B4" viewBox="0 0 24 24" aria-hidden="true" focusable="false"><path d="M7.41,8.58L12,13.17L16.59,8.58L18,10L12,16L6,10L7.41,8.58Z"/></svg>',
'chevron-left': '<svg class="ik" style="--ik-l:#5F6368;--ik-d:#AFB1B4" viewBox="0 0 24 24" aria-hidden="true" focusable="false"><path d="M15.41,16.58L10.83,12L15.41,7.41L14,6L8,12L14,18L15.41,16.58Z"/></svg>',
'chevron-right': '<svg class="ik" style="--ik-l:#5F6368;--ik-d:#AFB1B4" viewBox="0 0 24 24" aria-hidden="true" focusable="false"><path d="M8.59,16.58L13.17,12L8.59,7.41L10,6L16,12L10,18L8.59,16.58Z"/></svg>',
'chevron-up': '<svg class="ik" style="--ik-l:#5F6368;--ik-d:#AFB1B4" viewBox="0 0 24 24" aria-hidden="true" focusable="false"><path d="M7.41,15.41L12,10.83L16.59,15.41L18,14L12,8L6,14L7.41,15.41Z"/></svg>',
'chip': '<svg class="ik" style="--ik-l:#546E7A;--ik-d:#AAB6BC" viewBox="0 0 24 24" aria-hidden="true" focusable="false"><path d="M6,4H18V5H21V7H18V9H21V11H18V13H21V15H18V17H21V19H18V20H6V19H3V17H6V15H3V13H6V11H3V9H6V7H3V5H6V4M11,15V18H12V15H11M13,15V18H14V15H13M15,15V18H16V15H15Z"/></svg>',
'church': '<svg class="ik" style="--ik-l:#8D6E63;--ik-d:#C6B6B1" viewBox="0 0 24 24" aria-hidden="true" focusable="false"><path d="M18 12.22V9L13 6.5V5H15V3H13V1H11V3H9V5H11V6.5L6 9V12.22L2 14V22H10V19C10 17.9 10.9 17 12 17S14 17.9 14 19V22H22V14L18 12.22M12 13.5C11.17 13.5 10.5 12.83 10.5 12S11.17 10.5 12 10.5 13.5 11.17 13.5 12 12.83 13.5 12 13.5Z"/></svg>',
'circle-small': '<svg class="ik" style="--ik-l:#607D8B;--ik-d:#B0BEC5" viewBox="0 0 24 24" aria-hidden="true" focusable="false"><path d="M12,10A2,2 0 0,0 10,12C10,13.11 10.9,14 12,14C13.11,14 14,13.11 14,12A2,2 0 0,0 12,10Z"/></svg>',
'city': '<svg class="ik" style="--ik-l:#5D6D7E;--ik-d:#AEB6BE" viewBox="0 0 24 24" aria-hidden="true" focusable="false"><path d="M19,15H17V13H19M19,19H17V17H19M13,7H11V5H13M13,11H11V9H13M13,15H11V13H13M13,19H11V17H13M7,11H5V9H7M7,15H5V13H7M7,19H5V17H7M15,11V5L12,2L9,5V7H3V21H21V11H15Z"/></svg>',
'city-variant': '<svg class="ik" style="--ik-l:#5D6D7E;--ik-d:#AEB6BE" viewBox="0 0 24 24" aria-hidden="true" focusable="false"><path d="M19,9V7A2,2 0 0,0 17,5H16V2H14V5H13A2,2 0 0,0 11,7V9A2,2 0 0,0 9,11V12H5A2,2 0 0,0 3,14V22H6V20H8V22H12V20H14V22H16V20H18V22H21V11A2,2 0 0,0 19,9M8,18H6V16H8V18M14,18H12V16H14V18M14,14H12V12H14V14M13,9V7H17V9H13M18,18H16V16H18V18M18,14H16V12H18V14Z"/></svg>',
'clipboard-check': '<svg class="ik" style="--ik-l:#00897B;--ik-d:#80C4BD" viewBox="0 0 24 24" aria-hidden="true" focusable="false"><path d="M10,17L6,13L7.41,11.59L10,14.17L16.59,7.58L18,9M12,3A1,1 0 0,1 13,4A1,1 0 0,1 12,5A1,1 0 0,1 11,4A1,1 0 0,1 12,3M19,3H14.82C14.4,1.84 13.3,1 12,1C10.7,1 9.6,1.84 9.18,3H5A2,2 0 0,0 3,5V19A2,2 0 0,0 5,21H19A2,2 0 0,0 21,19V5A2,2 0 0,0 19,3Z"/></svg>',
'close': '<svg class="ik" style="--ik-l:#D93025;--ik-d:#EC9892" viewBox="0 0 24 24" aria-hidden="true" focusable="false"><path d="M19,6.41L17.59,5L12,10.59L6.41,5L5,6.41L10.59,12L5,17.59L6.41,19L12,13.41L17.59,19L19,17.59L13.41,12L19,6.41Z"/></svg>',
'cloud': '<svg class="ik" style="--ik-l:#4FC3F7;--ik-d:#4FC3F7" viewBox="0 0 24 24" aria-hidden="true" focusable="false"><path d="M6.5 20Q4.22 20 2.61 18.43 1 16.85 1 14.58 1 12.63 2.17 11.1 3.35 9.57 5.25 9.15 5.88 6.85 7.75 5.43 9.63 4 12 4 14.93 4 16.96 6.04 19 8.07 19 11 20.73 11.2 21.86 12.5 23 13.78 23 15.5 23 17.38 21.69 18.69 20.38 20 18.5 20Z"/></svg>',
'code-tags': '<svg class="ik" style="--ik-l:#00796B;--ik-d:#80BCB5" viewBox="0 0 24 24" aria-hidden="true" focusable="false"><path d="M14.6,16.6L19.2,12L14.6,7.4L16,6L22,12L16,18L14.6,16.6M9.4,16.6L4.8,12L9.4,7.4L8,6L2,12L8,18L9.4,16.6Z"/></svg>',
'compass': '<svg class="ik" style="--ik-l:#EF6C00;--ik-d:#EF6C00" viewBox="0 0 24 24" aria-hidden="true" focusable="false"><path d="M14.19,14.19L6,18L9.81,9.81L18,6M12,2A10,10 0 0,0 2,12A10,10 0 0,0 12,22A10,10 0 0,0 22,12A10,10 0 0,0 12,2M12,10.9A1.1,1.1 0 0,0 10.9,12A1.1,1.1 0 0,0 12,13.1A1.1,1.1 0 0,0 13.1,12A1.1,1.1 0 0,0 12,10.9Z"/></svg>',
'compass-rose': '<svg class="ik" style="--ik-l:#5C6BC0;--ik-d:#AEB5E0" viewBox="0 0 24 24" aria-hidden="true" focusable="false"><path d="M15 9L12 0L9 9L0 12L9 15L12 24L15 15L24 12L15 9M4 12L10 10L11 12H4M12 20L10 14L12 13V20M12 4L14 10L12 11V4M14 14L13 12H20L14 14M8.7 17.3L5 19L6.7 15.3L8.3 15.8L8.7 17.3M17.3 15.3L19 19L15.3 17.3L15.8 15.7L17.3 15.3M6.7 8.7L5 5L8.7 6.7L8.2 8.2L6.7 8.7M15.3 6.7L19 5L17.3 8.7L15.7 8.2L15.3 6.7Z"/></svg>',
'console': '<svg class="ik" style="--ik-l:#7B1FA2;--ik-d:#BD8FD0" viewBox="0 0 24 24" aria-hidden="true" focusable="false"><path d="M20,19V7H4V19H20M20,3A2,2 0 0,1 22,5V19A2,2 0 0,1 20,21H4A2,2 0 0,1 2,19V5C2,3.89 2.9,3 4,3H20M13,17V15H18V17H13M9.58,13L5.57,9H8.4L11.7,12.3C12.09,12.69 12.09,13.33 11.7,13.72L8.42,17H5.59L9.58,13Z"/></svg>',
'cookie': '<svg class="ik" style="--ik-l:#A1887F;--ik-d:#A1887F" viewBox="0 0 24 24" aria-hidden="true" focusable="false"><path d="M12,3A9,9 0 0,0 3,12A9,9 0 0,0 12,21A9,9 0 0,0 21,12C21,11.5 20.96,11 20.87,10.5C20.6,10 20,10 20,10H18V9C18,8 17,8 17,8H15V7C15,6 14,6 14,6H13V4C13,3 12,3 12,3M9.5,6A1.5,1.5 0 0,1 11,7.5A1.5,1.5 0 0,1 9.5,9A1.5,1.5 0 0,1 8,7.5A1.5,1.5 0 0,1 9.5,6M6.5,10A1.5,1.5 0 0,1 8,11.5A1.5,1.5 0 0,1 6.5,13A1.5,1.5 0 0,1 5,11.5A1.5,1.5 0 0,1 6.5,10M11.5,11A1.5,1.5 0 0,1 13,12.5A1.5,1.5 0 0,1 11.5,14A1.5,1.5 0 0,1 10,12.5A1.5,1.5 0 0,1 11.5,11M16.5,13A1.5,1.5 0 0,1 18,14.5A1.5,1.5 0 0,1 16.5,16H16.5A1.5,1.5 0 0,1 15,14.5H15A1.5,1.5 0 0,1 16.5,13M11,16A1.5,1.5 0 0,1 12.5,17.5A1.5,1.5 0 0,1 11,19A1.5,1.5 0 0,1 9.5,17.5A1.5,1.5 0 0,1 11,16Z"/></svg>',
'cpu-64-bit': '<svg class="ik" style="--ik-l:#1565C0;--ik-d:#8AB2E0" viewBox="0 0 24 24" aria-hidden="true" focusable="false"><path d="M9,3V5H7A2,2 0 0,0 5,7V9H3V11H5V13H3V15H5V17A2,2 0 0,0 7,19H9V21H11V19H13V21H15V19H17A2,2 0 0,0 19,17V15H21V13H19V11H21V9H19V7A2,2 0 0,0 17,5H15V3H13V5H11V3M8,9H11.5V10.5H8.5V11.25H10.5A1,1 0 0,1 11.5,12.25V14A1,1 0 0,1 10.5,15H8A1,1 0 0,1 7,14V10A1,1 0 0,1 8,9M12.5,9H14V11H15.5V9H17V15H15.5V12.5H12.5M8.5,12.75V13.5H10V12.75"/></svg>',
'cup': '<svg class="ik" style="--ik-l:#6D4C41;--ik-d:#B6A6A0" viewBox="0 0 24 24" aria-hidden="true" focusable="false"><path d="M18.32,8H5.67L5.23,4H18.77M3,2L5,20.23C5.13,21.23 5.97,22 7,22H17C18,22 18.87,21.23 19,20.23L21,2H3Z"/></svg>',
'currency-eur': '<svg class="ik" style="--ik-l:#2E7D32;--ik-d:#96BE98" viewBox="0 0 24 24" aria-hidden="true" focusable="false"><path d="M15 18.5C12.5 18.5 10.32 17.08 9.24 15H15L16 13H8.58C8.53 12.67 8.5 12.34 8.5 12S8.53 11.33 8.58 11H15L16 9H9.24C10.32 6.92 12.5 5.5 15 5.5C16.61 5.5 18.09 6.09 19.23 7.07L21 5.3C19.41 3.87 17.3 3 15 3C11.08 3 7.76 5.5 6.5 9H3L2 11H6.06C6 11.33 6 11.66 6 12S6 12.67 6.06 13H3L2 15H6.5C7.76 18.5 11.08 21 15 21C17.31 21 19.41 20.13 21 18.7L19.22 16.93C18.09 17.91 16.62 18.5 15 18.5Z"/></svg>',
'dna': '<svg class="ik" style="--ik-l:#8E24AA;--ik-d:#C692D4" viewBox="0 0 24 24" aria-hidden="true" focusable="false"><path d="M4,2H6V4C6,5.44 6.68,6.61 7.88,7.78C8.74,8.61 9.89,9.41 11.09,10.2L9.26,11.39C8.27,10.72 7.31,10 6.5,9.21C5.07,7.82 4,6.1 4,4V2M18,2H20V4C20,6.1 18.93,7.82 17.5,9.21C16.09,10.59 14.29,11.73 12.54,12.84C10.79,13.96 9.09,15.05 7.88,16.22C6.68,17.39 6,18.56 6,20V22H4V20C4,17.9 5.07,16.18 6.5,14.79C7.91,13.41 9.71,12.27 11.46,11.16C13.21,10.04 14.91,8.95 16.12,7.78C17.32,6.61 18,5.44 18,4V2M14.74,12.61C15.73,13.28 16.69,14 17.5,14.79C18.93,16.18 20,17.9 20,20V22H18V20C18,18.56 17.32,17.39 16.12,16.22C15.26,15.39 14.11,14.59 12.91,13.8L14.74,12.61M7,3H17V4L16.94,4.5H7.06L7,4V3M7.68,6H16.32C16.08,6.34 15.8,6.69 15.42,7.06L14.91,7.5H9.07L8.58,7.06C8.2,6.69 7.92,6.34 7.68,6M9.09,16.5H14.93L15.42,16.94C15.8,17.31 16.08,17.66 16.32,18H7.68C7.92,17.66 8.2,17.31 8.58,16.94L9.09,16.5M7.06,19.5H16.94L17,20V21H7V20L7.06,19.5Z"/></svg>',
'domain': '<svg class="ik" style="--ik-l:#6D4C41;--ik-d:#B6A6A0" viewBox="0 0 24 24" aria-hidden="true" focusable="false"><path d="M18,15H16V17H18M18,11H16V13H18M20,19H12V17H14V15H12V13H14V11H12V9H20M10,7H8V5H10M10,11H8V9H10M10,15H8V13H10M10,19H8V17H10M6,7H4V5H6M6,11H4V9H6M6,15H4V13H6M6,19H4V17H6M12,7V3H2V21H22V7H12Z"/></svg>',
'drama-masks': '<svg class="ik" style="--ik-l:#8E24AA;--ik-d:#C692D4" viewBox="0 0 24 24" aria-hidden="true" focusable="false"><path d="M8.11,19.45C5.94,18.65 4.22,16.78 3.71,14.35L2.05,6.54C1.81,5.46 2.5,4.4 3.58,4.17L13.35,2.1L13.38,2.09C14.45,1.88 15.5,2.57 15.72,3.63L16.07,5.3L20.42,6.23H20.45C21.5,6.47 22.18,7.53 21.96,8.59L20.3,16.41C19.5,20.18 15.78,22.6 12,21.79C10.42,21.46 9.08,20.61 8.11,19.45V19.45M20,8.18L10.23,6.1L8.57,13.92V13.95C8,16.63 9.73,19.27 12.42,19.84C15.11,20.41 17.77,18.69 18.34,16L20,8.18M16,16.5C15.37,17.57 14.11,18.16 12.83,17.89C11.56,17.62 10.65,16.57 10.5,15.34L16,16.5M8.47,5.17L4,6.13L5.66,13.94L5.67,13.97C5.82,14.68 6.12,15.32 6.53,15.87C6.43,15.1 6.45,14.3 6.62,13.5L7.05,11.5C6.6,11.42 6.21,11.17 6,10.81C6.06,10.2 6.56,9.66 7.25,9.5C7.33,9.5 7.4,9.5 7.5,9.5L8.28,5.69C8.32,5.5 8.38,5.33 8.47,5.17M15.03,12.23C15.35,11.7 16.03,11.42 16.72,11.57C17.41,11.71 17.91,12.24 18,12.86C17.67,13.38 17,13.66 16.3,13.5C15.61,13.37 15.11,12.84 15.03,12.23M10.15,11.19C10.47,10.66 11.14,10.38 11.83,10.53C12.5,10.67 13.03,11.21 13.11,11.82C12.78,12.34 12.11,12.63 11.42,12.5C10.73,12.33 10.23,11.8 10.15,11.19M11.97,4.43L13.93,4.85L13.77,4.05L11.97,4.43Z"/></svg>',
'earth': '<svg class="ik" style="--ik-l:#1E88E5;--ik-d:#1E88E5" viewBox="0 0 24 24" aria-hidden="true" focusable="false"><path d="M17.9,17.39C17.64,16.59 16.89,16 16,16H15V13A1,1 0 0,0 14,12H8V10H10A1,1 0 0,0 11,9V7H13A2,2 0 0,0 15,5V4.59C17.93,5.77 20,8.64 20,12C20,14.08 19.2,15.97 17.9,17.39M11,19.93C7.05,19.44 4,16.08 4,12C4,11.38 4.08,10.78 4.21,10.21L9,15V16A2,2 0 0,0 11,18M12,2A10,10 0 0,0 2,12A10,10 0 0,0 12,22A10,10 0 0,0 22,12A10,10 0 0,0 12,2Z"/></svg>',
'email': '<svg class="ik" style="--ik-l:#EF6C00;--ik-d:#EF6C00" viewBox="0 0 24 24" aria-hidden="true" focusable="false"><path d="M20,8L12,13L4,8V6L12,11L20,6M20,4H4C2.89,4 2,4.89 2,6V18A2,2 0 0,0 4,20H20A2,2 0 0,0 22,18V6C22,4.89 21.1,4 20,4Z"/></svg>',
'emo-crab': '<svg class="ik-emo" viewBox="0 0 32 32"><g fill="none"><path fill="#ca0b4a" d="M12.52 6.48h-.42V5H14c0 .82-.66 1.48-1.48 1.48m0 .33h-.42v1.48H14c0-.82-.66-1.48-1.48-1.48m6.96-.33H20V5h-2c0 .82.66 1.48 1.48 1.48m0 .33H20v1.48h-2c0-.82.66-1.48 1.48-1.48M7.61 12.73a.98.98 0 1 0-.956-.006a.87.87 0 0 0-.394.72a3.65 3.65 0 0 0 3.64 3.64a.868.86 0 1 0 0-1.73a1.91 1.91 0 0 1-1.91-1.91c0-.3-.153-.566-.385-.721m16.83 6.92c-.64.03-.98-.73-.53-1.18l4.33-4.33c.45-.45 1.21-.1 1.18.53c-.05 1.26-.56 2.5-1.52 3.46s-2.2 1.47-3.46 1.52m-1.26.66c-.64 0-.93.78-.46 1.21a5.21 5.21 0 0 0 7.04 0c.47-.43.17-1.21-.46-1.21zm-2.78 2.92a.7.7 0 0 1 .675-.895c1.26.01 2.52.47 3.51 1.4s1.55 2.15 1.65 3.4c.05.63-.7 1-1.16.57l-4.47-4.17c.432.72.696 1.56.73 2.47c.05 1.36-.42 2.61-1.24 3.57c-.41.48-1.2.22-1.22-.42l-.23-6.11a.695.69 0 0 1 1.19-.51q.316.32.573.69M9.20 21.59c.46-.43.17-1.2-.46-1.2h-6.06c-.63 0-.92.77-.46 1.2a5.15 5.15 0 0 0 6.98 0m-1.71-1.86c.63.03.97-.72.52-1.17l-4.29-4.3c-.45-.44-1.2-.1-1.17.53c.05 1.25.56 2.48 1.51 3.43s2.18 1.46 3.43 1.51m3.33 2.66c.63 0 .94.76.48 1.19l-4.44 4.14c-.46.42-1.2.06-1.15-.57c.1-1.25.64-2.46 1.63-3.38c.98-.91 2.23-1.37 3.48-1.38m1.33.28a.695.69 0 0 1 1.19.51l-.23 6.11c-.02.64-.81.9-1.22.42a5.17 5.17 0 0 1-1.24-3.57a5.22 5.22 0 0 1 1.5-3.47m13.41-9.21a.87.87 0 0 0-.39-.724a.98.98 0 1 0-.956 0a.87.87 0 0 0-.39.72a1.91 1.91 0 0 1-1.91 1.91a.868.86 0 0 0 0 1.73a3.65 3.65 0 0 0 3.64-3.64"/><path fill="#533566" d="M13 14a1 1 0 1 0 0-2a1 1 0 0 0 0 2m6 0a1 1 0 1 0 0-2a1 1 0 0 0 0 2"/><path fill="#f8312f" d="M8.31 11.5H6C6 7.91 8.90 5 12.5 5v2.32A4.18 4.18 0 0 1 8.31 11.5m15.36 0H26C26 7.91 23.09 5 19.5 5v2.32a4.18 4.18 0 0 0 4.18 4.17M16 27c4.97 0 9-3.90 9-8.71C25 13.46 20.97 13 16 13s-9 .475-9 5.28S11.03 27 16 27"/></g></svg>',
'emo-crocodile': '<svg class="ik-emo" viewBox="0 0 32 32"><g fill="none"><path fill="#00d26a" d="M10.89 4.03c1.68-1.52 3.66-1.82 5.89-1.82c3.78.05 7.07 2.33 8.48 5.63h.335c.602 0 1.39.906 1.39.906l2.38 2.28c.56.56.68 1.23.68 2.14v2.08c0 .28-.082.66-.512.66c-.461 0-.487-.422-.503-.68c-.007-.113-.012-.195-.052-.195s-.043.08-.047.20c-.009.25-.022.67-.449.67c-.512 0-.53-.444-.541-.7c-.004-.103-.007-.175-.041-.175c-.036 0-.041.07-.048.18c-.017.25-.044.66-.468.66c-.431 0-.52-.387-.52-.637v-1.84c0-.483-.425-.63-.884-.647v7.69c0 .862-.118 1.71-.347 2.54h2.78c.86 0 1.56.7 1.56 1.56v2.94c0 .262-.186.42-.5.42c-.413 0-.44-.392-.457-.65c-.009-.127-.016-.221-.064-.221c-.05 0-.055.09-.062.22c-.014.25-.034.64-.427.64c-.444 0-.462-.394-.474-.652c-.005-.126-.01-.22-.06-.22c-.052 0-.055.09-.058.22c-.006.25-.017.65-.455.65c-.28 0-.443-.145-.443-.425v-1.31c0-.14-.11-.25-.25-.25h-2.48a9.51 9.51 0 0 1-7.79 4.03h-6.29c-1.34 0-2.24-.634-2.25-1.62c-.01-.74.79-1.45 1.31-1.75c.516-.297 2.33-1.21 2.33-1.21c.07-.03.11-.09.11-.17c0-.598.59-1.29 1.37-1.29c.384 0 .638.05.87.18c.06.06.15.07.22.03q.136-.075.27-.147c.564-.302 1.12-.6 1.41-1.17c.26-.52.26-1.09.262-1.67V21h-1.83c-.14 0-.25.03-.25.17v1.27c0 .28-.08.55-.44.55c-.422 0-.455-.39-.478-.658c-.012-.14-.02-.248-.082-.248c-.063 0-.07.11-.08.26c-.016.26-.04.64-.42.64c-.404 0-.414-.373-.422-.64c-.004-.15-.007-.266-.078-.266c-.072 0-.088.12-.107.27c-.033.26-.079.62-.45.62c-.328 0-.443-.285-.443-.555v-2.78c0-.86.85-1.61 1.71-1.61h3.39l.032-5.22c-.899.00-.926.44-.926 1.10v1.45c0 .172-.035.52-.484.52c-.405 0-.44-.376-.463-.628c-.011-.128-.02-.224-.073-.224c-.05 0-.054.09-.059.21c-.01.25-.025.63-.476.63c-.456 0-.477-.397-.49-.649c-.006-.117-.01-.203-.057-.203c-.046 0-.05.08-.056.20c-.014.25-.035.64-.49.64c-.356 0-.47-.254-.47-.524V12.29c0-.64.67-1.33 1.08-1.73a250 250 0 0 1 2.92-2.78c-.197-.5-.631-.814-1.49-.642c-.652.13-1.25.52-1.92.956c-.695.45-1.46.95-2.44 1.26c-1.93.61-4.23 1.05-7.07-.781c-.472-.306-1.10-.831-.93-1.16c.161-.303.44-.3.70-.297h.076s1.64.047 2.23 0c1.72-.138 3.24-.89 5.64-3.07"/><path fill="#1c1c1c" d="M16.5 26a.5.5 0 1 0 0-1a.5.5 0 0 0 0 1"/><path fill="#fcd53f" d="M20.52 10.20a.49.49 0 1 0 .98-.01v-1.05a.49.49 0 0 0-.98 0zm-1.93.001a.49.49 0 1 0 .98-.01v-1.05a.49.49 0 0 0-.98 0zm.49 3.54a.49.49 0 0 1-.49-.49v-1.05a.49.49 0 0 1 .98 0v1.05c.01.27-.21.49-.49.49m-.49 2.56c0 .27.22.49.49.49c.28 0 .5-.22.49-.49v-1.05a.49.49 0 0 0-.98 0zm0 3.05c0 .27.22.49.49.49c.28 0 .5-.22.49-.49v-1.05a.49.49 0 0 0-.98 0zm2.42.49a.49.49 0 0 1-.49-.49v-1.05a.49.49 0 0 1 .98 0v1.05c.01.27-.21.49-.49.49m-.49-3.54c0 .27.22.49.49.49c.28 0 .5-.22.49-.49v-1.05a.49.49 0 0 0-.98 0zm.49-2.56a.49.49 0 0 1-.49-.49v-1.05a.49.49 0 0 1 .98 0v1.05c.01.27-.21.49-.49.49m1.93 6.11a.49.49 0 0 1-.49-.49v-1.05a.49.49 0 0 1 .98 0v1.05c0 .27-.22.49-.49.49m-.49-3.51a.49.49 0 0 0 .98 0v-1.05a.49.49 0 0 0-.98 0zm.49-2.60a.49.49 0 0 1-.49-.49v-1.05a.49.49 0 0 1 .98 0v1.05c0 .27-.22.49-.49.49m-.49-3.54c0 .27.22.49.49.49a.5.5 0 0 0 .49-.5v-1.05a.49.49 0 0 0-.98 0z"/><path fill="#008463" d="M9.99 28.5a.5.5 0 1 1-1 0a.5.5 0 0 1 1 0m2.00 0a.5.5 0 1 1-1 0a.5.5 0 0 1 1 0"/></g></svg>',
'emo-dolphin': '<svg class="ik-emo" viewBox="0 0 32 32"><g fill="none"><path fill="#00a6ed" d="M15.69 2.03c1.32.064 2.61.37 3.81.87a11.04 11.04 0 0 1 6.49-.7l.37.07c.74.15 1.03 1.10.52 1.67a12.7 12.7 0 0 0-2.06 3.24c1.32 1.88 2.12 4.14 2.13 6.51c-.095 7.21-5.55 11.56-11.82 11.54c-1.07 0-2.08-.002-3.06-.282v1.51c0 1.95-1.60 3.27-3.52 3.47c-.277.02-.503-.201-.5-.48l.041-3.44c.192-1.31.959-2.02 1.48-2.51c.287-.267.50-.466.51-.66c.007-.182-.191-.365-.467-.619c-.548-.503-1.40-1.28-1.55-2.92V15.89c0-.594.53-.555.79-.461c1.84.31 3.21 2.11 3.21 4.03v1.99c1.82.046 2.81-.83 3.85-1.74l.21-.185c3.31-2.65 3.17-5.37 2.38-7.02c-.42-.865-.98-1.37-1.75-1.66c-.53 1.94-.231 3.68.118 4.65c.37 1.02-.548.98-.922.67c-1.62-1.36-2.02-3.04-1.90-5.67H6l-.942-.515c-.328-1.09.214-2.44 1.64-2.59l.218-.017c.443-.031.82-.058.80-.605c0-2.34 2.40-4.75 4.95-4.75z"/><path fill="#1c1c1c" d="M12.70 7.41a.707.70 0 1 0 0-1.41a.707.70 0 0 0 0 1.41"/><path fill="#aeddff" d="m16.48 12.26l.03.02c2.48 2.15 1.45 5.24-.398 7.24c3.33-2.65 4.21-5.16 3.19-7.27c-.522-1.07-1.37-1.65-2.40-1.95a8.2 8.2 0 0 0-.426 1.96m-2.42-2.30l-.47-.003H5.04c.221.78.885 1.43 1.98 1.43q.626 0 1.24-.003c2.14-.007 4.16-.014 5.74.17q-.011-.743.05-1.60"/></g></svg>',
'emo-eagle': '<svg class="ik-emo" viewBox="0 0 32 32"><g fill="none"><path fill="#d3d3d3" d="m3 15l1-3.04A4.75 4.75 0 0 1 6.86 11h3.57v5H4zm21.81 10.99c1.14 0 1.45-1.17.997-1.80l-1.95-2.33h-5.84c0 1.98 1.01 4.13 4.06 4.13z"/><path fill="#6d4534" d="M17.05 10.17h-.022c-.75 0-1.25-.791-.92-1.47L19 6h11.24a4.16 4.16 0 0 1-2.26 3.72c-.08 1.69-1.34 2.99-2.97 3.23C24.99 14.86 23.32 16 22.25 16h-5.12c-.79 0-1.25-.785-.78-1.42l.852-1.57h-.022c-.79 0-1.29-.765-.9-1.45zM11.95 17L9 22h8z"/><path fill="#f9c23c" d="M2.71 16.85c.504-.285 1.3-.852 1.3-.852L4 11.95c-.528.38-2 1.65-2 4.04c0 1.14.21 1.13.71.85m7.88 6.02c-.47-.6-1.32-.664-1.95-.297c-.605.35-.875 1.05-.758 1.55c.042.17-.234.33-.36.19C7.2 23.97 7 23.54 7 23.02c0-1.12.91-2.04 2.04-2.02c.806.01 1.51.537 1.83 1.28c.063.15.105.30.126.45c.02.18-.23.36-.405.13"/><path fill="#a56953" d="m19 16l4.97 6H17.12C12.63 22 9 18.41 9 14s3.63-8 8.12-8H19z"/><path fill="#1c1c1c" d="M6 13.51a.5.5 0 1 1-1 0a.5.5 0 0 1 1 0"/></g></svg>',
'emo-elephant': '<svg class="ik-emo" viewBox="0 0 32 32"><g fill="none"><path fill="#636363" d="M14 24.56c0-1.24-.98-2.25-2.25-2.25L19 16.7v11.09C19 28.46 18.43 29 17.75 29h-2.5c-.68 0-1.25-.54-1.25-1.20zm8.51-2.31L22 22h7v6.06c0 .52-.42.94-.94.94h-3.12c-.52 0-.94-.42-.94-.94v-3.39c0-1.03-.57-1.96-1.49-2.42"/><path fill="#9b9b9b" d="M19.35 6C25.23 6 30 10.72 29.99 16.56V27.78c0 .674-.55 1.22-1.23 1.22h-2.52c-.68 0-1.23-.546-1.23-1.22v-3.26c0-1.26-1.03-2.51-2.3-2.51H17.5c-1.01 0-1.71.95-2.18 1.79l-.27.48c-1.02 1.85-2.62 4.72-4 4.72H8.31q-.039-.001-.072-.005q-.03-.005-.058-.005c-.83-.08-1.22-1.06-.73-1.72l1.71-2.33c.72-.973.91-2.25.43-3.35c-.742-1.70-2.43-2.43-4.59-2.72V22.5c0 .278.07.395.09.41c.003.00.013.01.05.03A.9.9 0 0 0 5.5 23a1.5 1.5 0 0 1 0 3c-1.11 0-2.06-.387-2.71-1.16C2.17 24.10 2 23.22 2 22.5V10.99C2 8.23 4.25 6 7.03 6z"/><path fill="#1c1c1c" d="M5.5 12.5a.5.5 0 0 1 .5.5v1a.5.5 0 0 1-1 0v-1a.5.5 0 0 1 .5-.5"/><path fill="#d3d3d3" d="M10 6c4.47 0 8.20 3.18 8.97 7.37A1.38 1.38 0 0 1 17.60 15h-6.20A1.38 1.38 0 0 1 10 13.62zM3.46 19.7c0 .5.4.9.9.9c2 0 3.62-1.6 3.63-3.6h-1.8c0 1.01-.82 1.8-1.83 1.8c-.5 0-.9.4-.9.9"/></g></svg>',
'emo-fish': '<svg class="ik-emo" viewBox="0 0 32 32"><g fill="none"><path fill="#00a6ed" d="M16.40 5.86c-2.68 0-3.79 2.51-3.84 4.82h-.908a8.66 8.66 0 0 0-8.31 6.24a1.05 1.05 0 0 0-.622 2.01a1.05 1.05 0 0 0 .438 2.05a8.66 8.66 0 0 0 8.5 7.00h1.78c.036.96.51 1.99 1.63 1.99h2.20c.106.01.308-.046.26-.45c-.043-.407-.231-1.23-1.23-1.54h.036a8.66 8.66 0 0 0 8.57-7.48v4.17c0 2.25 4.92 4.62 4.92 2.43v-4.5c0-1.20-2.03-3.26-3.30-3.28c1.26-.021 3.30-2.07 3.30-3.28v-4.5c0-2.18-4.92.188-4.92 2.43v4.17a8.66 8.66 0 0 0-7.03-7.35c3.61-.276 4.20-2.77 4.32-3.9c.1-.95-.375-1.10-.625-1.06z"/><path fill="#0074ba" d="M11.72 13.80a.5.5 0 0 1 .704-.062c3.05 2.55 3.21 7.04.043 10.39a.5.5 0 1 1-.727-.687c2.83-2.99 2.58-6.81.042-8.94a.5.5 0 0 1-.062-.704"/><path fill="#1c1c1c" d="M9.07 17.5a.61.61 0 1 1-1.21 0a.61.61 0 0 1 1.22 0"/></g></svg>',
'emo-frog': '<svg class="ik-emo" viewBox="0 0 32 32"><g fill="none"><path fill="#00d26a" d="M28 8.44c.01.86-.18 1.67-.52 2.4c-.15.33-.1.71.13.99c1.49 1.82 2.39 4.14 2.39 6.67q-.002 1.05-.2 2.05c.01-.053-.416.05-.406 0l-1.82 1.25l-11.74 3.99L4.4 21.80l-1.98-1.23c.007.04-.233-.102-.226-.062A10.6 10.6 0 0 1 2 18.50c0-2.53.9-4.85 2.39-6.67c.23-.28.28-.67.13-1c-.34-.72-.53-1.54-.52-2.4c.04-2.95 2.43-5.36 5.38-5.43a5.49 5.49 0 0 1 5.56 4.73c.02.15.15.27.31.27h1.49c.16 0 .29-.12.31-.27a5.5 5.5 0 0 1 5.57-4.73c2.95.07 5.34 2.48 5.38 5.44"/><path fill="#fff478" d="M13 8.5a3.5 3.5 0 1 1-7 0a3.5 3.5 0 0 1 7 0m13 0a3.5 3.5 0 1 1-7 0a3.5 3.5 0 0 1 7 0"/><path fill="#1c1c1c" d="M12 8.5a2.5 2.5 0 1 1-5 0a2.5 2.5 0 0 1 5 0m13 .001a2.5 2.5 0 1 1-5 0a2.5 2.5 0 0 1 5 0m-7.5 5.5a.5.5 0 1 0 0-1a.5.5 0 0 0 0 1m-2.5-.5a.5.5 0 1 1-1 0a.5.5 0 0 1 1 0"/><path fill="#fcd53f" d="M27.57 20.39c-1.18 0-2.27-.4-3.15-1.06a13.43 13.43 0 0 0-8.43-2.95c-3.22 0-6.17 1.12-8.49 3v-.01a5.2 5.2 0 0 1-3.1 1.02H2.17c.89 4.9 5.18 8.61 10.33 8.61h7c5.15 0 9.44-3.71 10.33-8.61z"/></g></svg>',
'emo-jellyfish': '<svg class="ik-emo" viewBox="0 0 32 32"><g fill="none"><path fill="#a4aeeb" fill-rule="evenodd" d="M11 14a1 1 0 1 0-2 0v6.64a2 2 0 0 1-4 0V19a1 1 0 1 0-2 0v1.64c0 2.97 3.13 4.90 5.78 3.57A4 4 0 0 0 11 20.64zm10 0a1 1 0 1 1 2 0v6.64a2 2 0 0 0 4 0V19a1 1 0 1 1 2 0v1.64c0 2.97-3.13 4.90-5.78 3.57A4 4 0 0 1 21 20.64zm-7-.5a1 1 0 0 1 1 1V24a6 6 0 0 1-6 6H7.5a1 1 0 1 1 0-2H9a4 4 0 0 0 4-4v-9.5a1 1 0 0 1 1-1m3 1a1 1 0 1 1 2 0V24a4 4 0 0 0 4 4h1.5a1 1 0 1 1 0 2H23a6 6 0 0 1-6-6z" clip-rule="evenodd"/><path fill="#7e8ad9" fill-rule="evenodd" d="M9 18.28V14a1 1 0 1 1 2 0v5.19c-.73-.253-1.40-.56-2-.912m4 1.44V14.5a1 1 0 1 1 2 0v5.47a16 16 0 0 1-2-.245m4 .245V14.5a1 1 0 1 1 2 0v5.22q-.963.18-2 .245m4-.773V14a1 1 0 1 1 2 0v4.28c-.598.35-1.27.65-2 .912" clip-rule="evenodd"/><path fill="#3f5fff" d="M26 11c0 3.86-4.47 7-10 7S6 14.86 6 11s3.5-9 10-9s10 5.13 10 9"/><path fill="#3351f8" fill-rule="evenodd" d="M24.66 14.49C22.83 16.02 20.07 17 17 17c-5.52 0-10-3.13-10-7c0-1.80.762-3.88 2.23-5.59C7.10 6.24 6 8.82 6 11c0 3.86 4.47 7 10 7c3.70 0 6.93-1.41 8.66-3.50" clip-rule="evenodd"/><path fill="#1345b7" fill-rule="evenodd" d="M17.52 4.29q-.153.18-.344.31C18.15 8.71 19.16 16 16.07 16c-3.07 0-2.09-7.18-1.12-11.29a2 2 0 0 1-.473-.404c-.905.69-1.74 2.48-2.55 4.21c-.517 1.10-1.02 2.19-1.53 2.95c-1.43 2.15-4.48 1.27-2.98-2.73c1.18-3.16 3.99-4.91 6.60-5.5a2 2 0 0 1 .181-1.09C14.76 2.04 15.37 2 16 2q.945.00 1.80.139a2 2 0 0 1 .192.94c2.38.39 5.28 2.15 6.59 5.64c1.5 4-1.55 4.88-2.98 2.73c-.508-.76-1.01-1.84-1.53-2.95c-.81-1.73-1.64-3.52-2.55-4.21" clip-rule="evenodd"/><path fill="#bbd5ff" fill-rule="evenodd" d="M18 6c1.10 0 2-.672 2-1.5S19.10 3 18 3s-2 .672-2 1.5s.895 1.5 2 1.5m2.65 6.78c-.273.83-.343 1.97.512 2.18q.164.03.333.03c1.38 0 2.5-2.01 2.5-4.5S22.88 6 21.5 6q-.17 0-.333.04c-.855.20-.785 1.34-.512 2.17c.22.66.345 1.44.345 2.28c0 .832-.126 1.61-.345 2.28" clip-rule="evenodd"/><path fill="#83b2ff" fill-rule="evenodd" d="M16.12 3.98c.237-.48.79-.845 1.47-.95c.595.06 1.23.21 1.87.455c.328.26.528.62.528 1.01c0 .626-.512 1.16-1.23 1.38C18.12 4.79 17.46 4 16.75 4c-.26 0-.468-.007-.633-.02M24 10.5a7.5 7.5 0 0 1-.283 2.08c-.698.11-1.53-.256-2.11-1.11A12 12 0 0 1 21 10.41a7.4 7.4 0 0 0-.344-2.19c-.273-.836-.343-1.97.511-2.18Q21.33 6 21.5 6c1.38 0 2.5 2.01 2.5 4.5" clip-rule="evenodd"/></g></svg>',
'emo-lady-beetle': '<svg class="ik-emo" viewBox="0 0 32 32"><g fill="none"><path fill="#212121" d="M13.57 1.75a.5.5 0 0 0-.865.5l1.42 2.47a6.96 6.96 0 0 0-5.08 6.22L7.82 9.71c-.21-.21-.33-.49-.33-.79v-2a.749.74 0 1 0-1.5 0v2c0 .7.27 1.36.77 1.86l2.45 2.45q.035.03.07.05a6.96 6.96 0 0 0 5.71 5.03v11.1c.33.03.66.05 1 .05s.67-.02 1-.05v-11.1a6.96 6.96 0 0 0 5.70-5.01a1 1 0 0 0 .075-.066l2.45-2.45c.5-.5.77-1.16.77-1.86v-2c0-.41-.34-.75-.75-.75s-.75.34-.75.75v2c0 .31-.12.59-.33.8l-1.22 1.22a6.96 6.96 0 0 0-5.24-6.27L19.1 2.25a.5.5 0 1 0-.865-.5l-1.59 2.75a7 7 0 0 0-1.47.019zm15.14 14.41c.15.15.34.22.53.22s.38-.08.53-.22c.29-.29.29-.77 0-1.06l-.67-.67c-.62-.62-1.44-.96-2.32-.96h-1.75c-.41 0-.75.34-.75.75s.34.75.75.75h1.75c.47 0 .92.18 1.26.52zm-1.47 13.28c-.41 0-.75-.34-.75-.75V26.6c0-.62-.24-1.2-.68-1.64l-2.56-2.56a.754.75 0 0 1 0-1.06c.29-.29.77-.29 1.06 0l2.56 2.56c.72.72 1.12 1.68 1.12 2.7v2.09c0 .41-.34.75-.75.75m-21.75-.77c0 .41-.34.75-.75.75s-.75-.34-.75-.75v-2.09c0-1.02.4-1.98 1.12-2.7l2.56-2.56c.29-.29.77-.29 1.06 0s.29.77 0 1.06l-2.56 2.56a2.3 2.3 0 0 0-.68 1.64zm-2.22-12.53c-.15.15-.34.22-.53.22s-.38-.08-.53-.22a.754.75 0 0 1 0-1.06l.67-.67c.62-.62 1.44-.96 2.32-.96h1.75c.41 0 .75.34.75.75s-.34.75-.75.75h-1.75c-.47 0-.92.18-1.26.52z"/><path fill="#f8312f" d="M15.5 9.46H9.31q-.001.00-.005.01q-.005.00-.005.01c-1 .755-1.86 1.67-2.56 2.71L8 15l-2.99 1.71a11 11 0 0 0-.12 1.64c0 5.8 4.44 10.56 10.11 11.07q.25.02.502.03zm1 19.99q.25-.013.49-.036c5.67-.51 10.11-5.27 10.11-11.07q-.001-.823-.116-1.61L24 15l1.25-2.8a11.1 11.1 0 0 0-2.56-2.72v-.02H16.5z"/><path fill="#212121" d="M19.89 14.92a3.9 3.9 0 1 1-7.8 0a3.9 3.9 0 0 1 7.8 0m-7.01 7.15a2.64 2.64 0 1 1-5.28 0a2.64 2.64 0 0 1 5.28 0m-6.07-9.88h-.07c-.9 1.34-1.51 2.89-1.75 4.55c.47.45 1.11.72 1.82.72c1.46 0 2.64-1.18 2.64-2.64s-1.18-2.63-2.64-2.63m18.42 0c.9 1.34 1.51 2.88 1.75 4.55c-.47.45-1.11.72-1.82.73c-1.46 0-2.64-1.18-2.64-2.64s1.18-2.64 2.64-2.64zm-3.49 12.52a2.64 2.64 0 1 0 0-5.28a2.64 2.64 0 0 0 0 5.28m-4.29 1.45a1.46 1.46 0 1 1-2.92 0a1.46 1.46 0 0 1 2.92 0"/></g></svg>',
'emo-lion': '<svg class="ik-emo" viewBox="0 0 32 32"><g fill="none"><path fill="#6d4534" d="m28.66 12.33l.75.37c.27.14.59-.06.59-.36V8.41A3.41 3.41 0 0 0 26.59 5H26l.59-1.77c.2-.6-.25-1.23-.89-1.23H19c-.65 0-1.28.21-1.8.6A3.03 3.03 0 0 0 16 4.86h-.01c-.04-.89-.48-1.72-1.2-2.25C14.28 2.21 13.65 2 13 2H6.3c-.64 0-1.09.63-.89 1.23L6 5h-.59A3.41 3.41 0 0 0 2 8.41v3.93c0 .3.32.5.59.36l.75-.37c.28-.14.58-.01.65.29c.05.21-.05.41-.24.5l-1 .5c-.46.23-.75.7-.75 1.22v6.45c0 2.79 1.85 5.24 4.53 6.01l8.88 2.54c.38.11.79.11 1.18 0l8.88-2.54A6.25 6.25 0 0 0 30 21.29v-6.45c0-.51-.29-.98-.75-1.21l-1-.5a.46.46 0 0 1-.24-.5a.44.44 0 0 1 .65-.3"/><path fill="#ffb02e" d="M10.42 4a3 3 0 0 1 2.54 1.41a4.34 4.34 0 0 0 6.06 0a2.99 2.99 0 0 1 3.28-1.31a2.99 2.99 0 0 1 2.23 3.29a3 3 0 0 1-.996 1.86l2.3 3.16A6.04 6.04 0 0 1 27 15.96C27 19.3 24.3 22 20.96 22h-9.92C7.7 22 5 19.3 5 15.96c0-1.27.4-2.52 1.15-3.55l2.3-3.16a3 3 0 0 1-.935-2.96A3.03 3.03 0 0 1 9.74 4.08q.328-.08.68-.08"/><path fill="#d3883e" d="M9.32 8.06c-.1.12-.19.24-.28.37c-.38-.36-.61-.87-.61-1.43c0-1.1.9-2 2-2c.66 0 1.25.32 1.61.82a8.6 8.6 0 0 0-2.72 2.23zm13.45.117l-.091-.117a8.5 8.5 0 0 0-2.72-2.23c.37-.5.96-.82 1.62-.82c1.1 0 2 .9 2 2c0 .56-.24 1.07-.61 1.43a5 5 0 0 0-.199-.263"/><path fill="#f3c07b" d="M16 27c-3.31 0-6-2.69-6-6v-1.57h12V21c0 3.31-2.69 6-6 6"/><path fill="#ffdea7" d="M19.43 16.86c-.27 0-.53-.12-.71-.32l-1.99-2.3a.97.97 0 0 0-1.47 0l-1.99 2.3c-.18.21-.44.32-.71.32c-1.41 0-2.56 1.15-2.56 2.57A2.57 2.57 0 0 0 12.57 22h1.29c.89 0 1.68-.46 2.14-1.15c.46.69 1.25 1.15 2.14 1.15h1.29a2.57 2.57 0 1 0 0-5.14"/><path fill="#212121" d="M12 16c-.55 0-1-.45-1-1v-1c0-.55.45-1 1-1s1 .45 1 1v1c0 .55-.45 1-1 1m8 0c-.55 0-1-.45-1-1v-1c0-.55.45-1 1-1s1 .45 1 1v1c0 .55-.45 1-1 1m-4.56 3.72l-1.95-1.95c-.34-.34-.1-.91.39-.91h4.27c.48 0 .72.57.38.91l-1.95 1.95c-.32.31-.83.31-1.14 0"/></g></svg>',
'emo-lizard': '<svg class="ik-emo" viewBox="0 0 32 32"><g fill="none"><path fill="#00d26a" d="M24.05 11.01c.29-.04.56.14.63.42c0 0 1.95 11.44 1.94 12.75c0 3.34-1.96 5.76-5.34 5.76c-4.21 0-6-3.46-6-6.92c0-.399-.064-.767-.179-1.11H13.85a.125.12 0 0 0-.123.12v1.01c0 .818-.668 1.47-1.29 1.55l-.113.01c-.246.02-.441.04-.622.22c0 0-.473.49-.627.58s-.576.17-.782-.035c-.205-.205-.225-.56-.02-.765l.238-.235c.03-.04.02-.113-.024-.113l-.515.04a.454.45 0 0 1-.453-.41c-.02-.24.07-.47.45-.536l.34-.077c.05 0 .081-.062.05-.103l-.214-.248c-.176-.166-.186-.523.02-.728c.204-.206.60-.174.80.03l.605.55c.09.09.149.14.266.14c.061 0 .14-.051.14-.123v-1.18c0-.83.71-1.47 1.54-1.47h.44c-.266-.272-.56-.53-.87-.781c-1.33-1.08-2.48-2.39-3.13-3.95H7.68c-1.01 0-1.52-.782-1.52-1.39v-.715a.27.27 0 0 0-.062-.176l-.625-.664c-.2-.2-.226-.59-.016-.78c.2-.19.54-.2.73 0l.117.05c.04.04.11.01.11-.04v-.22c0-.27.22-.517.49-.517c.309 0 .562.22.562.51v.26c0 .06.07.08.11.04l.14-.117c.19-.19.50-.18.70 0c.21.19.2.57 0 .773l-.578.63a.24.24 0 0 0-.067.18v.051c0 .085-.002.24 0 .342c.003.10.06.11.102.11h1.58a7.7 7.7 0 0 1-.112-1.31v-.82q0-.074.00-.152c.012-.198.02-.399-.14-.517c-.98-.71-1.72-1.98-1.75-3.27c-.036-1.66 1.10-3.10 2.14-4.41c.227-.286.44-.565.65-.839c.583-.785 1.79-.797 2.5 0q.235.26.477.52c1.17 1.28 2.38 2.60 2.38 4.72c0 1.35-.714 2.60-1.74 3.32c-.21.14-.24.37-.24.62v.77c.03.58.08.999.22 1.36h1.69c.072 0 .071-.048.07-.116v-.439c0-.07-.042-.13-.092-.18l-.601-.589c-.2-.2-.21-.551 0-.742c.2-.19.54-.23.73-.03l.152.07c.04.04.11.02.11-.04v-.297c0-.18.17-.46.47-.46c.328 0 .545.22.545.46l.037.29c0 .05.07.08.11.04l.125-.07c.19-.2.51-.162.69 0c.18.16.27.52.07.72l-.582.67l-.01.01c-.04.05-.099.12-.099.18v.726c0 .83-.66 1.47-1.59 1.47h-.475l.239.21c.794.72 1.59 1.46 2.28 2.32l.001-.066c0-.81.99-.934 1.80-.934h.755c.07 0 .117-.07.11-.13v-.226s.006-.27-.024-.3l-.605-.727c-.193-.193-.18-.495.02-.695s.433-.165.58-.098l.282.14c.04.03.1 0 .1-.05v-.268c0-.28.25-.5.53-.5s.526.22.52.5v.244c0 .05.06.08.1.05l.228-.124c.121-.074.40-.126.60.074c.2.2.19.484.02.719l-.258.31l-.195.25c-.02.02-.04.06-.04.09v.873c0 1.17-.914 1.71-1.72 1.71h-.91c-.07 0-.12.10-.12.16l.008 3.46q.042.45.043.95c0 1.26.619 2.57 2.13 2.53c1.08-.03 1.70-.797 1.70-2.53l.144-11.88c0-.28.19-.53.47-.57"/><path fill="#1c1c1c" d="M10 6.5a.5.5 0 1 1-1 0a.5.5 0 0 1 1 0m4 0a.5.5 0 1 1-1 0a.5.5 0 0 1 1 0"/></g></svg>',
'emo-mammoth': '<svg class="ik-emo" viewBox="0 0 32 32"><g fill="none"><path fill="#6d4534" d="M16 23h5v6.06c0 .52-.42.94-.94.94h-3.12c-.52 0-.94-.42-.94-.94zm6.51.25L22 23h7v6.06c0 .52-.42.94-.94.94h-3.12c-.52 0-.94-.42-.94-.94v-3.39c0-1.03-.57-1.96-1.49-2.42"/><path fill="#a56953" d="M21.25 7c-.83 0-1.59-.42-2.07-1.09A4.49 4.49 0 0 0 15.5 4c-1.52 0-2.86.75-3.68 1.91l-.01.01c-.45.63-1.31.8-1.97.41l-2.9-1.67a.383.38 0 0 0-.58.31c-.04.67.18 1.32.6 1.82c.07.08.01.21-.1.21H4.63c-.19 0-.35.16-.35.35c0 .16.04.31.13.44c.25.4.6.71 1 .92c-.87.94-1.41 2.21-1.41 3.6V24c0 1.66 1.34 3 3 3h.5c.83 0 1.5-.67 1.5-1.5S8.33 24 7.5 24h-.17c-.18 0-.33-.15-.33-.33v-3.29c0-.21.17-.38.38-.38h1.37c.77 0 1.52.3 2.07.85l.29.28c.57.56.89 1.32.89 2.11c0 .49-.15.98-.42 1.39L9.3 28.06c-.56.83.04 1.94 1.04 1.94h2.39c.79 0 1.51-.42 1.9-1.1l3.1-5.43c.17-.29.48-.47.81-.47h3.89c.37 0 .74.09 1.07.25a2.69 2.69 0 0 1 1.49 2.42v3.39c0 .52.42.94.94.94h3.12c.52 0 .94-.42.94-.94V15.75C30 10.92 26.08 7 21.25 7"/><path fill="#1c1c1c" d="M8.5 12.5a.5.5 0 0 1 .5.5v1a.5.5 0 0 1-1 0v-1a.5.5 0 0 1 .5-.5"/><path fill="#6d4534" d="M14.13 7c2.1 0 3.8 1.67 3.87 3.75c0 1.45-.66 2.83-1.78 3.76l-2.62 2.14c-.61.56-1.6.13-1.6-.7V7.69c0-.38.31-.69.69-.69zM8.1 18.26h1.97c.17 0 .3-.13.31-.3v-1.05c0-.71-.58-1.29-1.29-1.29s-1.29.58-1.29 1.29v1.05c0 .17.13.3.3.3"/><path fill="#ffdea7" d="M8.08 18.26c0 1.13-.92 2.04-2.04 2.04c-1.12.01-2.04-.91-2.04-2.04v-.86c0-.86-.2-1.7-.58-2.46l-.25-.49a.61.61 0 0 0-.55-.34c-.34 0-.62.27-.62.61v3.54c0 2.23 1.81 4.04 4.04 4.04s4.04-1.81 4.04-4.04z"/></g></svg>',
'emo-parrot': '<svg class="ik-emo" viewBox="0 0 32 32"><g fill="none"><path fill="#f70a8d" d="M11.04 2.00a5.21 5.21 0 0 1 5.38 4.26l1.71 8.36l-2.56 5.00l4.03 2.17l.011.05v-.08l7.65-.73c.37-.03.69.26.68.63v2.19c0 1.72-1.39 3.12-3.12 3.12h-7.87l-.743.65l-.743-.656H14.17q-.394 0-.78-.028l-.885.46l-.548-.671C7.40 25.77 4 21.80 4 17.04c0-2.22.76-4.32 2.06-6.01c.46-.58.58-1.36.33-2.06c-.22-.62-.33-1.31-.3-2.02a5.17 5.17 0 0 1 4.95-4.95"/><path fill="#ff822d" d="M8.87 7.88a1.76 1.76 0 1 1-3.52 0a1.76 1.76 0 0 1 3.52 0m2.59 20.61l.49-1.73q.704.15 1.44.209l-.432 1.52h1.25c.41 0 .75.34.75.75s-.34.75-.75.75h-5.5a.749.74 0 1 1 0-1.5z"/><path fill="#ffb02e" d="m8.84 7.54l-2.81 1.28a.67.67 0 0 0-.39.61v.24c0 .28-.32.44-.54.28a2.37 2.37 0 0 1-1-2.14c.1-1.19 1.08-2.14 2.27-2.19a2.4 2.4 0 0 1 2.47 1.92m1.53 6.98a3.95 3.95 0 0 1 3.86-3.15c1.88 0 3.49 1.31 3.87 3.15l1.89 9.27H19.8v.01c-2.21-.296-4.94-.747-6.53-2.15c-1.90-1.67-2.5-4.5-2.89-7.12m5.08 12.46v1.5h-2.75a.749.74 0 1 0 0 1.5h5.5c.41 0 .75-.34.75-.75s-.34-.75-.75-.75h-1.25v-1.5z"/><path fill="#00a6ed" d="M19.8 23.80c-4.86-.65-8.71-4.46-9.43-9.29c-.03.13-.05.27-.06.4q-.06.57-.06 1.14c0 5.59 4.16 10.21 9.55 10.93c.45 0 .78-.41.69-.85l-.48-2.34h-.21z"/><path fill="#e6e6e6" d="M11.32 8.64a2.32 2.32 0 1 0 0-4.64a2.32 2.32 0 0 0 0 4.64"/><path fill="#212121" d="M11.32 7.36a1.04 1.04 0 1 0 0-2.08a1.04 1.04 0 0 0 0 2.08"/></g></svg>',
'emo-paw-prints': '<svg class="ik-emo" viewBox="0 0 32 32"><path fill="#321b41" d="M7.78 5.46c.66 0 1.84.204 1.84 1.82s-1.17 2.25-1.84 2.25s-1.70-.638-1.70-2.25s1.13-1.82 1.70-1.82M4.15 7.5C4.81 7.5 6 7.70 6 9.32s-1.17 2.25-1.84 2.25s-1.70-.637-1.70-2.25S3.58 7.5 4.15 7.5M14 7.28c0-1.62-1.18-1.82-1.84-1.82c-.57 0-1.70.215-1.70 1.82s1.03 2.25 1.70 2.25S14 8.91 14 7.28m1.70.211c.66 0 1.84.203 1.84 1.82s-1.17 2.25-1.84 2.25S14 10.94 14 9.32S15.13 7.5 15.70 7.5m-.719 7.96c0-2.92-1.89-5.45-4.98-5.45s-4.95 2.46-4.95 5.45c0 2.48 2.96 2.48 4.94 2.48H10c2.20 0 4.98-.078 4.98-2.48m1.17 4.07c.66 0 1.84.203 1.84 1.82s-1.17 2.25-1.84 2.25s-1.70-.638-1.70-2.25s1.13-1.82 1.70-1.82m5.46-.211c0-1.62-1.18-1.82-1.84-1.82c-.57 0-1.70.215-1.70 1.82s1.03 2.25 1.70 2.25s1.84-.625 1.84-2.25m2.53-1.82c.66 0 1.84.203 1.84 1.82s-1.17 2.25-1.84 2.25s-1.70-.638-1.70-2.25s1.13-1.82 1.70-1.82m5.39 3.86c0-1.62-1.18-1.82-1.84-1.82c-.57 0-1.70.215-1.70 1.82s1.03 2.25 1.70 2.25s1.84-.625 1.84-2.25M22 22.06c3.09 0 4.98 2.53 4.98 5.45C26.98 29.92 24.20 30 22 30h-.008c-1.98 0-4.94 0-4.94-2.48c0-2.98 1.86-5.45 4.95-5.45"/></svg>',
'emo-sauropod': '<svg class="ik-emo" viewBox="0 0 32 32"><g fill="none"><path fill="#008463" d="M12 23h4v6.5c0 .28-.22.5-.5.5h-3c-.28 0-.5-.22-.5-.5zm5 0h4v6.5c0 .28-.22.5-.5.5h-3c-.28 0-.5-.22-.5-.5z"/><path fill="#00d26a" d="M30 14.97c0-3.14-1.73-6.08-4.45-7.16a.5.5 0 0 0-.49.04s-.01 0-.01.01c-.27.2-.232.52.04.78c1.33 1.23 2.05 2.43 2.19 4.17c.064.80-.292 1.57-.702 2.27c-.37.63-1.02 1.12-1.57 1.12c-.812 0-1.28-.558-1.75-1.04c-.66-.8-1.74-1.17-2.85-1.17H9.31c-.17 0-.357-.14-.357-.31V3.88c0-1.04-.793-1.69-1.83-1.69H4C2.9 2.18 2 2.9 2 4s.9 2 2 2h.69c.17 0 .529.14.52.31l-.094 14.7c0 1.18.56 2.21 1.56 2.69c.39.19.6.62.5 1.05l-1.1 4.87c-.05.19.1.38.3.38H9.6c.23 0 .44-.16.49-.39l1.25-5.12c.06-.29.21-.49.50-.49h9.2c.29 0 .437.2.49.49l1.26 5.05c.05.23.25.39.49.39h3.21c.2 0 .491-.2.44-.39L25.3 22.95c-.08-.36.09-.74.42-.91c2.54-1.33 4.28-4 4.28-7.07"/><path fill="#1c1c1c" d="M6.5 4.03a.5.5 0 1 0 0-1a.5.5 0 0 0 0 1"/></g></svg>',
'emo-snail': '<svg class="ik-emo" viewBox="0 0 32 32"><g fill="none"><path fill="#d3883e" d="M2.5 3.75C2.5 2.79 3.29 2 4.25 2S6 2.79 6 3.75c0 .7-.41 1.3-1 1.58v3.52H3.5V5.33c-.59-.28-1-.88-1-1.58m3.5 0c0 .7.41 1.3 1 1.58v3.52h1.5V5.33c.59-.28 1-.88 1-1.58C9.5 2.79 8.71 2 7.75 2S6 2.79 6 3.75"/><path fill="#212121" d="M5 3.75a.75.75 0 1 1-1.5 0a.75.75 0 0 1 1.5 0m3.5 0a.75.75 0 1 1-1.5 0a.75.75 0 0 1 1.5 0"/><path fill="#6d4534" d="M18 5c-4.76 0-8.87 2.77-10.81 6.78V21h-.51c1.65 4.66 6.09 8 11.32 8c6.63 0 12-5.37 12-12S24.63 5 18 5"/><path fill="#f3ad61" d="M11.96 23.35c-1.18-.81-1.99-2.30-1.99-3.76v-8.67c0-2.2-1.78-3.98-3.98-3.98A3.97 3.97 0 0 0 2 10.92v12.76c0 3.45 2.8 6.24 6.24 6.24l20.2.08c.86 0 1.56-.7 1.56-1.56v-.42a3.99 3.99 0 0 0-3.19-3.91A8.6 8.6 0 0 1 19.60 28a8.6 8.6 0 0 1-7.64-4.65"/><path fill="#a56953" d="M29 19.28a9.51 9.51 0 1 1-19.02 0a9.51 9.51 0 0 1 19.02 0m-2.78 2.5a4.75 4.75 0 1 0-9.5 0a4.75 4.75 0 0 0 9.5 0"/></g></svg>',
'emo-spider': '<svg class="ik-emo" viewBox="0 0 32 32"><path fill="#635994" d="M26.23 3a.5.5 0 0 0-1 0a8.2 8.2 0 0 1-4.75 7.44l-1.06.497l-.1-.044a3.82 3.82 0 0 0-1.23-5.48V4.37A1.37 1.37 0 0 0 16.70 3v1.94a4 4 0 0 0-1.09.00V3c-.76 0-1.37.62-1.37 1.37v1.05a3.82 3.82 0 0 0-1.22 5.47l-.107.04l-1.07-.5A8.2 8.2 0 0 1 7.1 3a.5.5 0 0 0-1 0a9.2 9.2 0 0 0 5.33 8.35l.398.18a8.04 8.04 0 0 0-2.57 2.69a8.45 8.45 0 0 1-5.76-6.32a.5.5 0 0 0-.978.20a9.45 9.45 0 0 0 6.29 7.01a8 8 0 0 0-.616 2.63a9.45 9.45 0 0 0-5.67 6.79a.5.5 0 0 0 .978.20a8.46 8.46 0 0 1 4.70-5.91a7.96 7.96 0 0 0 1.32 3.84A9.2 9.2 0 0 0 6.1 29.86a.5.5 0 0 0 1 0a8.2 8.2 0 0 1 3.02-6.36a7.98 7.98 0 0 0 6.05 2.76a7.98 7.98 0 0 0 6.04-2.76a8.2 8.2 0 0 1 3.01 6.36a.5.5 0 1 0 1 0c0-2.81-1.28-5.43-3.40-7.15a7.96 7.96 0 0 0 1.32-3.84a8.46 8.46 0 0 1 4.69 5.90a.5.5 0 0 0 .978-.208a9.45 9.45 0 0 0-5.66-6.78a7.9 7.9 0 0 0-.62-2.63a9.45 9.45 0 0 0 6.28-7.01a.5.5 0 1 0-.978-.208a8.45 8.45 0 0 1-5.76 6.32a8.1 8.1 0 0 0-2.57-2.69l.398-.185A9.2 9.2 0 0 0 26.23 3"/></svg>',
'emo-spiral-shell': '<svg class="ik-emo" viewBox="0 0 32 32"><g fill="none"><path fill="#d3d3d3" d="m6.77 3.61l-.379.36a2.43 2.43 0 0 0-2.06-.708l-1.30.76v4.10l10.01 20.18L26 29.89l.848-.002c3.95-3.77 4.14-10.03.375-13.99l-1.81-1.9a7.5 7.5 0 0 0-2.04-4.57a7.48 7.48 0 0 0-6.18-2.27l-1.62-1.70a3.47 3.47 0 0 0-4.79-.265l.291-.305l-1.14-1.2c-.84-.88-2.25-.92-3.14-.07"/><path fill="#212121" d="m22.78 25.6l2.66 2.79c3.2-3.05 3.32-8.11.27-11.3l-.524-.55a7.46 7.46 0 0 1-2.08 3.52a4.06 4.06 0 0 0-.322 5.53"/><path fill="#9b9b9b" d="M4.37 9c-.276-1.47 2.25-4.40 3.86-5.99a2.2 2.2 0 0 0-1.46.613L3.98 6.27c-.848-1.03-.167-2.35.392-3.00A2.44 2.44 0 0 0 2.86 7.33l-.166.15c-.89.85-.93 2.26-.08 3.15l1.18 1.25a3.51 3.51 0 0 0 .293 4.48L5.88 18.25a9.80 9.80 0 0 0 9.64 11.66l10.68-.019c-5.3-.698-13.53-3.33-14.58-8.89c-1.36-7.20 3.56-11.94 9.88-12.98a7.54 7.54 0 0 0-4.77-.804L7.25 15.43c-.517-.571-1.08-1.54-1.00-2.80c.1-1.7 4.79-6.20 7.12-8.25a3.45 3.45 0 0 0-2.76.95l-5.57 5.31c-.262-.326-.518-.844-.666-1.63"/></g></svg>',
'emo-t-rex': '<svg class="ik-emo" viewBox="0 0 32 32"><g fill="none"><path fill="#00d26a" d="M14.96 7.65c0-2.62-2.07-3.62-3.59-3.62c-1.69 0-2.57-.014-4.27 0h-.029c-.571.00-1.87.017-2.36.164c-3.01.922-2.68 3.43-2.68 4.96c0 1.20.688 1.82 1.28 1.82c.734 0 1.55-.013 2.32 0c.569.01.78.055.78.68v3.37L5 16.5l1.45 1.15c.272 2.23 1.76 3.88 3.35 4.93C10.45 23.02 11 24 12.5 24.5s2.42-.562 2.42-.562c.592.03 1.11.036 1.51 0c.618 1.10 2.31 1.70 2.68 1.82c.3.1.07.28 0 .375c-.844.78-2.46 2.4-2.93 2.90c-.492.53.034.84.274.89h3.25c.725 0 1.11-.541 1.21-.812V24c11.36-.453 9.09-11.18 8.01-12.53c-.123-.154-.692-1.24-1.02-1.00c-.117.08-.06.39-.051.56c.187 4.07-1.87 5.64-3.75 6.54c-1.59.56-3.18.36-3.18.36s-.433-4.84-5.86-4.90a.1.1 0 0 1-.102-.1z"/><path fill="#008463" d="m9.81 22.59l-.178-.121c.319 1.11 1.63 2.84 3.52 3.19c.292.05.156.28 0 .437l-3.03 3.06c-.219.24-.167.77.438.77h3.44c.323-.03.96-.297.96-1.28V23.94c-1.68-.103-3.91-.524-5.15-1.34m-3.39-5.67v-1.90H4.82c-.266-.005-.797.15-.797.81v2.48c0 .552.71.993 1.37.421c.323-.28.49-.503.63-.675c.141-.182.24-.308.42-.387a6 6 0 0 1-.046-.75M8.99 18.5c0 .367.71.727 1.22.219l.215-.216c.679-.677 1.77-1.76 2.37-2.44c.412-.457.18-1.03-.547-1.03H9.87c-.27.01-.883.18-.883.81z"/><path fill="#1c1c1c" d="M9.03 5.32a.49.49 0 1 1 .682.70l-.704.68a.49.49 0 1 1-.682-.706z"/></g></svg>',
'emo-tropical-fish': '<svg class="ik-emo" viewBox="0 0 32 32"><g fill="none"><path fill="#635994" d="M3.39 18.94a1.05 1.05 0 1 0-.671 0a1.05 1.05 0 1 0 .672 0"/><path fill="#f9c23c" d="M23 7h-8.62v23H23a3 3 0 0 0 3-3v-8.05c.002 2.40 1.43 4.15 2.65 4.15c.975 0 1.28-.688 1.31-1.03V16.75c0-1.42-.313-1.65-.875-1.65c-1.99 0-2.98 2.01-3.09 3.36V10a3 3 0 0 0-3-3"/><path fill="#00a6ed" d="M14.5 30C20.85 30 26 24.85 26 18.5S20.85 7 14.5 7a11.46 11.46 0 0 0-7.8 3.05l-.073 16.83A11.46 11.46 0 0 0 14.5 30"/><path fill="#8d65c5" d="M6.62 26.88A11.47 11.47 0 0 1 3 18.5a11.47 11.47 0 0 1 3.7-8.45a10.8 10.8 0 0 1 3.98 8.38c0 3.41-1.58 6.46-4.06 8.44"/><path fill="#f9c23c" d="M18 21.45v-5.87a.7.7 0 0 0-1.17-.516l-2.99 2.75a1 1 0 0 0 .01 1.48l2.99 2.67A.7.7 0 0 0 18 21.45"/><path fill="#1c1c1c" d="M8.17 16.51a.625.62 0 1 1-1.25 0a.625.62 0 0 1 1.25 0"/></g></svg>',
'emo-worm': '<svg class="ik-emo" viewBox="0 0 32 32"><g fill="none"><path fill="#ff8687" d="M24.68 29.56a1.51 1.51 0 0 0 2.13 0c.59-.59.59-1.53 0-2.12l-.23-.23a8 8 0 0 1-.414-.447a1 1 0 0 0 .084.10l-1.30.651l-.817 1.46a.1.1 0 0 0-.023-.018q.167.18.343.35zm-1.19-1.33l1.36-.863l.786-1.28q.026.03.06.07A8.2 8.2 0 0 1 24.59 24l-1.56-.349l-1.57.349a11.15 11.15 0 0 0 2.02 4.22M21.26 23l1.76.47l1.29-.47a8.3 8.3 0 0 1-.043-3.05h-.015l-1.23-.712l-1.67-.067A11.4 11.4 0 0 0 21.26 23m.331-4.8h.001l1.43.673l1.46.107l.01.01a8.2 8.2 0 0 1 1.52-2.87h-.016l-1.03-.94l-1.58-.57a11.1 11.1 0 0 0-1.80 3.59m2.44-4.36q.195-.216.40-.423a2.72 2.72 0 0 0 .76-2.41l1.5-.395l1.53.395q.018.22.018.46a5.73 5.73 0 0 1-1.55 3.92q0-.012.00-.017l-1.59-.445zM28.07 10l-1.36.375L24.82 10a2.72 2.72 0 0 0-2.20-1.26l-.417-1.25l.417-1.76A5.74 5.74 0 0 1 28.07 10M21.62 5.79a5.7 5.7 0 0 0-3.16 1.61l-.857.85l.002-.001l.855 1.27l1.26.845l.845-.845a2.8 2.8 0 0 1 1.05-.651l.376-1.39zm-2.60 5.29l-.698-1.35l-1.42-.762v-.002l-2.46 2.46l.871 1.34l1.24.777v.006zm-3.16 3.16l-.009.00l-.72-1.35l-1.39-.762l-2.47 2.47l.728 1.27l1.39.844zm-3.18 3.18l-.008.00l-.682-1.37l-1.43-.744a2.74 2.74 0 0 1-1.91.67l-.535 1.32l.535 1.67a5.76 5.76 0 0 0 4.03-1.55M7.63 18.87l.336-1.57l-.336-1.55A2.74 2.74 0 0 1 6.00 13l-1.32-.363L3.00 13a5.7 5.7 0 0 0 1.67 4.3a5.76 5.76 0 0 0 2.95 1.57M3.13 12l1.54.57L6.29 12c.128-.252.29-.49.50-.7l1.38-1.38l-.633-1.27l-1.48-.836v-.01L4.68 9.18A5.74 5.74 0 0 0 3.13 12m3.63-4.90l.01.00l.853 1.36l1.26.753L10.62 7.48c.63-.63.98-1.47.98-2.37V3.5c0-.83-.68-1.5-1.5-1.5s-1.49.67-1.5 1.5v1.61c0 .09-.03.18-.1.25z"/><path fill="#e39d89" d="M21.62 8.87V5.79c.29-.04.59-.07.89-.07h.11v3h-.11c-.31 0-.61.05-.89.15M6.06 7.80l.707-.707l2.12 2.12l-.707.70zM28.06 10h-3.23c.19.3.32.64.38 1h3.02c-.02-.34-.08-.67-.17-1m-2.04 6.12l-2.62-1.51c.2-.27.42-.53.64-.78l2.67 1.54c-.04.05-.09.1-.14.15c-.2.19-.38.39-.55.6M21.6 18.2l2.9.78c-.09.32-.17.65-.23.97l-2.91-.78c.07-.33.15-.65.24-.97m2.72 4.8h-3.05c.05.34.11.67.19 1h3.12c-.11-.33-.2-.67-.26-1m1.93 3.87l-2.12 2.12c-.23-.25-.45-.5-.65-.76l2.15-2.15c.19.27.39.54.62.79M6.01 13h-3c.01-.34.05-.67.13-1h3.15c-.15.32-.25.66-.28 1m5.24 1.61l-.57.57c-.04.04-.09.09-.14.13l2.12 2.12q.037-.031.07-.065t.07-.065l.57-.57zm2.47-2.48l.707-.707l2.12 2.12l-.707.70zM8.63 15.98a2.7 2.7 0 0 1-1-.23v3.13c.33.06.66.1 1 .1zm8.97-7.72l-.707.70l2.12 2.12l.707-.707z"/><path fill="#212121" d="M10.1 4.51a.5.5 0 1 0 0-1a.5.5 0 0 0 0 1"/></g></svg>',
'ev-station': '<svg class="ik" style="--ik-l:#43A047;--ik-d:#43A047" viewBox="0 0 24 24" aria-hidden="true" focusable="false"><path d="M19.77,7.23L19.78,7.22L16.06,3.5L15,4.56L17.11,6.67C16.17,7.03 15.5,7.93 15.5,9A2.5,2.5 0 0,0 18,11.5C18.36,11.5 18.69,11.42 19,11.29V18.5A1,1 0 0,1 18,19.5A1,1 0 0,1 17,18.5V14A2,2 0 0,0 15,12H14V5A2,2 0 0,0 12,3H6A2,2 0 0,0 4,5V21H14V13.5H15.5V18.5A2.5,2.5 0 0,0 18,21A2.5,2.5 0 0,0 20.5,18.5V9C20.5,8.31 20.22,7.68 19.77,7.23M18,10A1,1 0 0,1 17,9A1,1 0 0,1 18,8A1,1 0 0,1 19,9A1,1 0 0,1 18,10M8,18V13.5H6L10,6V11H12L8,18Z"/></svg>',
'expansion-card': '<svg class="ik" style="--ik-l:#00838F;--ik-d:#80C1C7" viewBox="0 0 24 24" aria-hidden="true" focusable="false"><path d="M2,7V8.5H3V17H4.5V7C3.7,7 2.8,7 2,7M6,7V7L6,16H7V17H14V16H22V7H6M17.5,9A2.5,2.5 0 0,1 20,11.5A2.5,2.5 0 0,1 17.5,14A2.5,2.5 0 0,1 15,11.5A2.5,2.5 0 0,1 17.5,9Z"/></svg>',
'eye-off': '<svg class="ik" style="--ik-l:#607D8B;--ik-d:#B0BEC5" viewBox="0 0 24 24" aria-hidden="true" focusable="false"><path d="M11.83,9L15,12.16C15,12.11 15,12.05 15,12A3,3 0 0,0 12,9C11.94,9 11.89,9 11.83,9M7.53,9.8L9.08,11.35C9.03,11.56 9,11.77 9,12A3,3 0 0,0 12,15C12.22,15 12.44,14.97 12.65,14.92L14.2,16.47C13.53,16.8 12.79,17 12,17A5,5 0 0,1 7,12C7,11.21 7.2,10.47 7.53,9.8M2,4.27L4.28,6.55L4.73,7C3.08,8.3 1.78,10 1,12C2.73,16.39 7,19.5 12,19.5C13.55,19.5 15.03,19.2 16.38,18.66L16.81,19.08L19.73,22L21,20.73L3.27,3M12,7A5,5 0 0,1 17,12C17,12.64 16.87,13.26 16.64,13.82L19.57,16.75C21.07,15.5 22.27,13.86 23,12C21.27,7.61 17,4.5 12,4.5C10.6,4.5 9.26,4.75 8,5.2L10.17,7.35C10.74,7.13 11.35,7 12,7Z"/></svg>',
'factory': '<svg class="ik" style="--ik-l:#607D8B;--ik-d:#B0BEC5" viewBox="0 0 24 24" aria-hidden="true" focusable="false"><path d="M4,18V20H8V18H4M4,14V16H14V14H4M10,18V20H14V18H10M16,14V16H20V14H16M16,18V20H20V18H16M2,22V8L7,12V8L12,12V8L17,12L18,2H21L22,12V22H2Z"/></svg>',
'feather': '<svg class="ik" style="--ik-l:#6D4C41;--ik-d:#B6A6A0" viewBox="0 0 24 24" aria-hidden="true" focusable="false"><path d="M22,2C22,2 14.36,1.63 8.34,9.88C3.72,16.21 2,22 2,22L3.94,21C5.38,18.5 6.13,17.47 7.54,16C10.07,16.74 12.71,16.65 15,14C13,13.44 11.4,13.57 9.04,13.81C11.69,12 13.5,11.6 16,12L17,10C15.2,9.66 14,9.63 12.22,10.04C14.19,8.65 15.56,7.87 18,8L19.21,6.07C17.65,5.96 16.71,6.13 14.92,6.57C16.53,5.11 18,4.45 20.14,4.32C20.14,4.32 21.19,2.43 22,2Z"/></svg>',
'ferry': '<svg class="ik" style="--ik-l:#01579B;--ik-d:#80ABCD" viewBox="0 0 24 24" aria-hidden="true" focusable="false"><path d="M6,6H18V9.96L12,8L6,9.96M3.94,19H4C5.6,19 7,18.12 8,17C9,18.12 10.4,19 12,19C13.6,19 15,18.12 16,17C17,18.12 18.4,19 20,19H20.05L21.95,12.31C22.03,12.06 22,11.78 21.89,11.54C21.76,11.3 21.55,11.12 21.29,11.04L20,10.62V6C20,4.89 19.1,4 18,4H15V1H9V4H6A2,2 0 0,0 4,6V10.62L2.71,11.04C2.45,11.12 2.24,11.3 2.11,11.54C2,11.78 1.97,12.06 2.05,12.31M20,21C18.61,21 17.22,20.53 16,19.67C13.56,21.38 10.44,21.38 8,19.67C6.78,20.53 5.39,21 4,21H2V23H4C5.37,23 6.74,22.65 8,22C10.5,23.3 13.5,23.3 16,22C17.26,22.65 18.62,23 20,23H22V21H20Z"/></svg>',
'film': '<svg class="ik" style="--ik-l:#37474F;--ik-d:#9BA3A7" viewBox="0 0 24 24" aria-hidden="true" focusable="false"><path d="M3.5,3H5V1.8C5,1.36 5.36,1 5.8,1H10.2C10.64,1 11,1.36 11,1.8V3H12.5A1.5,1.5 0 0,1 14,4.5V5H22V20H14V20.5A1.5,1.5 0 0,1 12.5,22H3.5A1.5,1.5 0 0,1 2,20.5V4.5A1.5,1.5 0 0,1 3.5,3M18,7V9H20V7H18M14,7V9H16V7H14M10,7V9H12V7H10M14,16V18H16V16H14M18,16V18H20V16H18M10,16V18H12V16H10Z"/></svg>',
'filmstrip': '<svg class="ik" style="--ik-l:#37474F;--ik-d:#9BA3A7" viewBox="0 0 24 24" aria-hidden="true" focusable="false"><path d="M18,9H16V7H18M18,13H16V11H18M18,17H16V15H18M8,9H6V7H8M8,13H6V11H8M8,17H6V15H8M18,3V5H16V3H8V5H6V3H4V21H6V19H8V21H16V19H18V21H20V3H18Z"/></svg>',
'finance': '<svg class="ik" style="--ik-l:#1565C0;--ik-d:#8AB2E0" viewBox="0 0 24 24" aria-hidden="true" focusable="false"><path d="M6,16.5L3,19.44V11H6M11,14.66L9.43,13.32L8,14.64V7H11M16,13L13,16V3H16M18.81,12.81L17,11H22V16L20.21,14.21L13,21.36L9.53,18.34L5.75,22H3L9.47,15.66L13,18.64"/></svg>',
'fire': '<svg class="ik" style="--ik-l:#F4511E;--ik-d:#F4511E" viewBox="0 0 24 24" aria-hidden="true" focusable="false"><path d="M17.66 11.2C17.43 10.9 17.15 10.64 16.89 10.38C16.22 9.78 15.46 9.35 14.82 8.72C13.33 7.26 13 4.85 13.95 3C13 3.23 12.17 3.75 11.46 4.32C8.87 6.4 7.85 10.07 9.07 13.22C9.11 13.32 9.15 13.42 9.15 13.55C9.15 13.77 9 13.97 8.8 14.05C8.57 14.15 8.33 14.09 8.14 13.93C8.08 13.88 8.04 13.83 8 13.76C6.87 12.33 6.69 10.28 7.45 8.64C5.78 10 4.87 12.3 5 14.47C5.06 14.97 5.12 15.47 5.29 15.97C5.43 16.57 5.7 17.17 6 17.7C7.08 19.43 8.95 20.67 10.96 20.92C13.1 21.19 15.39 20.8 17.03 19.32C18.86 17.66 19.5 15 18.56 12.72L18.43 12.46C18.22 12 17.66 11.2 17.66 11.2M14.5 17.5C14.22 17.74 13.76 18 13.4 18.1C12.28 18.5 11.16 17.94 10.5 17.28C11.69 17 12.4 16.12 12.61 15.23C12.78 14.43 12.46 13.77 12.33 13C12.21 12.26 12.23 11.63 12.5 10.94C12.69 11.32 12.89 11.7 13.13 12C13.9 13 15.11 13.44 15.37 14.8C15.41 14.94 15.43 15.08 15.43 15.23C15.46 16.05 15.1 16.95 14.5 17.5H14.5Z"/></svg>',
'fish': '<svg class="ik" style="--ik-l:#0288D1;--ik-d:#0288D1" viewBox="0 0 24 24" aria-hidden="true" focusable="false"><path d="M12,20L12.76,17C9.5,16.79 6.59,15.4 5.75,13.58C5.66,14.06 5.53,14.5 5.33,14.83C4.67,16 3.33,16 2,16C3.1,16 3.5,14.43 3.5,12.5C3.5,10.57 3.1,9 2,9C3.33,9 4.67,9 5.33,10.17C5.53,10.5 5.66,10.94 5.75,11.42C6.4,10 8.32,8.85 10.66,8.32L9,5C11,5 13,5 14.33,5.67C15.46,6.23 16.11,7.27 16.69,8.38C19.61,9.08 22,10.66 22,12.5C22,14.38 19.5,16 16.5,16.66C15.67,17.76 14.86,18.78 14.17,19.33C13.33,20 12.67,20 12,20M17,11A1,1 0 0,0 16,12A1,1 0 0,0 17,13A1,1 0 0,0 18,12A1,1 0 0,0 17,11Z"/></svg>',
'flag': '<svg class="ik" style="--ik-l:#C62828;--ik-d:#E29494" viewBox="0 0 24 24" aria-hidden="true" focusable="false"><path d="M14.4,6L14,4H5V21H7V14H12.6L13,16H20V6H14.4Z"/></svg>',
'flask': '<svg class="ik" style="--ik-l:#00897B;--ik-d:#80C4BD" viewBox="0 0 24 24" aria-hidden="true" focusable="false"><path d="M6,22A3,3 0 0,1 3,19C3,18.4 3.18,17.84 3.5,17.37L9,7.81V6A1,1 0 0,1 8,5V4A2,2 0 0,1 10,2H14A2,2 0 0,1 16,4V5A1,1 0 0,1 15,6V7.81L20.5,17.37C20.82,17.84 21,18.4 21,19A3,3 0 0,1 18,22H6M5,19A1,1 0 0,0 6,20H18A1,1 0 0,0 19,19C19,18.79 18.93,18.59 18.82,18.43L16.53,14.47L14,17L8.93,11.93L5.18,18.43C5.07,18.59 5,18.79 5,19M13,10A1,1 0 0,0 12,11A1,1 0 0,0 13,12A1,1 0 0,0 14,11A1,1 0 0,0 13,10Z"/></svg>',
'food': '<svg class="ik" style="--ik-l:#E65100;--ik-d:#E65100" viewBox="0 0 24 24" aria-hidden="true" focusable="false"><path d="M18.06 23H19.72C20.56 23 21.25 22.35 21.35 21.53L23 5.05H18V1H16.03V5.05H11.06L11.36 7.39C13.07 7.86 14.67 8.71 15.63 9.65C17.07 11.07 18.06 12.54 18.06 14.94V23M1 22V21H16.03V22C16.03 22.54 15.58 23 15 23H2C1.45 23 1 22.54 1 22M16.03 15C16.03 7 1 7 1 15H16.03M1 17H16V19H1V17Z"/></svg>',
'food-apple': '<svg class="ik" style="--ik-l:#D32F2F;--ik-d:#E99797" viewBox="0 0 24 24" aria-hidden="true" focusable="false"><path d="M20,10C22,13 17,22 15,22C13,22 13,21 12,21C11,21 11,22 9,22C7,22 2,13 4,10C6,7 9,7 11,8V5C5.38,8.07 4.11,3.78 4.11,3.78C4.11,3.78 6.77,0.19 11,5V3H13V8C15,7 18,7 20,10Z"/></svg>',
'food-croissant': '<svg class="ik" style="--ik-l:#D4A373;--ik-d:#D4A373" viewBox="0 0 24 24" aria-hidden="true" focusable="false"><path d="M22,19L19,17L22,15V19M15,15L19,9L22,13L18,16L15,15M5,17L2,19V15L5,17M9,15L6,16L2,13L5,9L9,15M14,6L18,8L13,15H11L6,8L10,6H14Z"/></svg>',
'food-fork-drink': '<svg class="ik" style="--ik-l:#EF6C00;--ik-d:#EF6C00" viewBox="0 0 24 24" aria-hidden="true" focusable="false"><path d="M3,3A1,1 0 0,0 2,4V8L2,9.5C2,11.19 3.03,12.63 4.5,13.22V19.5A1.5,1.5 0 0,0 6,21A1.5,1.5 0 0,0 7.5,19.5V13.22C8.97,12.63 10,11.19 10,9.5V8L10,4A1,1 0 0,0 9,3A1,1 0 0,0 8,4V8A0.5,0.5 0 0,1 7.5,8.5A0.5,0.5 0 0,1 7,8V4A1,1 0 0,0 6,3A1,1 0 0,0 5,4V8A0.5,0.5 0 0,1 4.5,8.5A0.5,0.5 0 0,1 4,8V4A1,1 0 0,0 3,3M19.88,3C19.75,3 19.62,3.09 19.5,3.16L16,5.25V9H12V11H13L14,21H20L21,11H22V9H18V6.34L20.5,4.84C21,4.56 21.13,4 20.84,3.5C20.63,3.14 20.26,2.95 19.88,3Z"/></svg>',
'food-steak': '<svg class="ik" style="--ik-l:#B23B2B;--ik-d:#D89D95" viewBox="0 0 24 24" aria-hidden="true" focusable="false"><path d="M11.9 2C8 2 4.9 5.4 5 9.3C5.1 11.9 6.6 14.1 8.7 15.2C10.1 15.9 11 17.3 11 18.8V19C11 20.7 12.3 22 14 22C18 22 19 17 19 9C19 9 19 2 11.9 2M14 20C13.4 20 13 19.6 13 19V18.8C13 16.6 11.7 14.5 9.7 13.4C8.1 12.6 7.1 11 7 9.2C7 7.9 7.5 6.5 8.4 5.5C9.3 4.5 10.6 4 11.8 4C16.7 4 17 8.2 17 9C17 18.9 15.3 20 14 20M15.8 7.6L8.3 10.3C8.1 10 8 9.6 8 9.1C8 8.4 8.2 7.8 8.5 7.1L13.7 5.2C14.9 5.8 15.5 6.7 15.8 7.6M12.9 15.1L15.7 14.1C15.6 15.6 15.3 16.7 15.1 17.4L13.8 17.9C13.8 16.9 13.5 16 12.9 15.1M16 9.2C16 10.4 16 11.5 15.9 12.4L11.9 13.9C11.4 13.4 10.8 12.9 10.1 12.6C9.7 12.4 9.3 12.1 9 11.8L16 9.2Z"/></svg>',
'food-takeout-box': '<svg class="ik" style="--ik-l:#EF6C00;--ik-d:#EF6C00" viewBox="0 0 24 24" aria-hidden="true" focusable="false"><path d="M5.26 11H18.74L18.07 20H5.93L5.26 11M9 4H14.97L19 7.38L20.59 5.79L22 7.21L19.21 10H4.79L2 7.21L3.41 5.8L5 7.38L9 4Z"/></svg>',
'forest': '<svg class="ik" style="--ik-l:#2E7D32;--ik-d:#96BE98" viewBox="0 0 24 24" aria-hidden="true" focusable="false"><path d="M16 12L9 2L2 12H3.86L0 18H7V22H11V18H18L14.14 12H16M20.14 12H22L15 2L12.61 5.41L17.92 13H15.97L19.19 18H24L20.14 12M13 19H17V22H13V19Z"/></svg>',
'format-paint': '<svg class="ik" style="--ik-l:#EF6C00;--ik-d:#EF6C00" viewBox="0 0 24 24" aria-hidden="true" focusable="false"><path d="M18,4V3A1,1 0 0,0 17,2H5A1,1 0 0,0 4,3V7A1,1 0 0,0 5,8H17A1,1 0 0,0 18,7V6H19V10H9V21A1,1 0 0,0 10,22H12A1,1 0 0,0 13,21V12H21V4H18Z"/></svg>',
'fountain-pen': '<svg class="ik" style="--ik-l:#3949AB;--ik-d:#9CA4D5" viewBox="0 0 24 24" aria-hidden="true" focusable="false"><path d="M6.95,14.93L11.19,9.27L19.68,2.2C20.07,1.81 20.72,1.81 21.09,2.2L21.8,2.91C22.19,3.28 22.19,3.93 21.8,4.32L14.73,12.81L9.07,17.05L6.95,14.93M8.36,17.76L6.24,15.64L3.41,17.05L2,21.29L4.12,19.17C4.32,19 4.63,19 4.83,19.17C5,19.37 5,19.68 4.83,19.88L2.71,22L6.95,20.59L8.36,17.76Z"/></svg>',
'fuel': '<svg class="ik" style="--ik-l:#FBC02D;--ik-d:#FBC02D" viewBox="0 0 24 24" aria-hidden="true" focusable="false"><path d="M3,2H6C6.28,2 6.53,2.11 6.71,2.29L8.79,4.38L9.59,3.59C10,3.2 10.5,3 11,3H17C17.5,3 18,3.2 18.41,3.59L19.41,4.59C19.8,5 20,5.5 20,6V19A2,2 0 0,1 18,21H8A2,2 0 0,1 6,19V13L6,12V8C6,7.5 6.2,7 6.59,6.59L7.38,5.79L5.59,4H3V2M11,5V7H17V5H11M11.41,11L9.41,9H8V10.41L10,12.41V15.59L8,17.59V19H9.41L11.41,17H14.59L16.59,19H18V17.59L16,15.59V12.41L18,10.41V9H16.59L14.59,11H11.41M12,13H14V15H12V13Z"/></svg>',
'gamepad-variant': '<svg class="ik" style="--ik-l:#5E35B1;--ik-d:#AE9AD8" viewBox="0 0 24 24" aria-hidden="true" focusable="false"><path d="M7,6H17A6,6 0 0,1 23,12A6,6 0 0,1 17,18C15.22,18 13.63,17.23 12.53,16H11.47C10.37,17.23 8.78,18 7,18A6,6 0 0,1 1,12A6,6 0 0,1 7,6M6,9V11H4V13H6V15H8V13H10V11H8V9H6M15.5,12A1.5,1.5 0 0,0 14,13.5A1.5,1.5 0 0,0 15.5,15A1.5,1.5 0 0,0 17,13.5A1.5,1.5 0 0,0 15.5,12M18.5,9A1.5,1.5 0 0,0 17,10.5A1.5,1.5 0 0,0 18.5,12A1.5,1.5 0 0,0 20,10.5A1.5,1.5 0 0,0 18.5,9Z"/></svg>',
'gas-burner': '<svg class="ik" style="--ik-l:#FF6F00;--ik-d:#FF6F00" viewBox="0 0 24 24" aria-hidden="true" focusable="false"><path d="M16.14 8.79L16.12 8.8C16.35 9.07 16.55 9.39 16.7 9.72L16.79 9.91C17.5 11.6 17 13.55 15.69 14.77C14.5 15.86 12.84 16.15 11.3 15.95C9.84 15.77 8.5 14.85 7.73 13.58C7.5 13.19 7.3 12.75 7.2 12.3C7.07 11.93 7.03 11.57 7 11.2C6.91 9.6 7.55 7.9 8.76 6.9C8.21 8.11 8.34 9.62 9.15 10.67L9.26 10.8C9.4 10.92 9.57 10.96 9.73 10.89C9.88 10.83 10 10.68 10 10.5L9.93 10.28C9.05 7.96 9.79 5.25 11.66 3.72C12.17 3.3 12.8 2.92 13.46 2.75C12.78 4.11 13 5.89 14.09 6.96C14.55 7.43 15.1 7.74 15.58 8.18L16.14 8.79M13.86 13.43L13.85 13.42C14.3 13.03 14.55 12.36 14.53 11.76L14.5 11.44C14.3 10.44 13.43 10.11 12.87 9.38C12.7 9.16 12.55 8.88 12.44 8.6C12.22 9.1 12.2 9.57 12.29 10.11C12.39 10.68 12.62 11.17 12.5 11.76C12.34 12.41 11.83 13.06 10.94 13.27C11.44 13.76 12.25 14.15 13.06 13.87C13.32 13.8 13.65 13.61 13.86 13.43M11 18V19C11 19.55 11.45 20 12 20C12.55 20 13 19.55 13 19V18H15V19C15 19.55 15.45 20 16 20C16.55 20 17 19.55 17 19V18C18.11 18 20 18.9 20 20V22H4V20C4 18.9 5.9 18 7 18V19C7 19.55 7.45 20 8 20C8.55 20 9 19.55 9 19V18H11Z"/></svg>',
'gez_dunya': '<svg viewBox="0 0 24 24" aria-hidden="true"><circle cx="12" cy="12" r="9" fill="#3c86d9"/><ellipse cx="8.8" cy="10" rx="2.6" ry="3.2" fill="#4caf50"/><ellipse cx="15.5" cy="15.2" rx="2.2" ry="2.4" fill="#4caf50"/></svg>',
'gez_jupiter': '<svg viewBox="0 0 24 24" aria-hidden="true"><circle cx="12" cy="12" r="9" fill="#d9a46b"/><path d="M3.5 9h17M3.3 14.5h17.4" stroke="#a86d3e" stroke-width="1.3"/><ellipse cx="15.2" cy="12.6" rx="1.9" ry="1.2" fill="#b65a37"/></svg>',
'gez_mars': '<svg viewBox="0 0 24 24" aria-hidden="true"><circle cx="12" cy="12" r="9" fill="#c8532b"/><ellipse cx="12" cy="4.9" rx="3.2" ry="1.5" fill="#f3e6dc"/><circle cx="9" cy="14" r="1.4" fill="#9a3c1d"/><circle cx="15" cy="10" r="1" fill="#9a3c1d"/></svg>',
'gez_merkur': '<svg viewBox="0 0 24 24" aria-hidden="true"><circle cx="12" cy="12" r="9" fill="#9b9b9b"/><circle cx="8.5" cy="9.5" r="1.7" fill="#7a7a7a"/><circle cx="14.5" cy="14" r="2.3" fill="#7a7a7a"/><circle cx="13.5" cy="8" r="1" fill="#7a7a7a"/></svg>',
'gez_neptun': '<svg viewBox="0 0 24 24" aria-hidden="true"><circle cx="12" cy="12" r="9" fill="#3a5fd0"/><ellipse cx="9.4" cy="9.6" rx="1.8" ry="1.1" fill="#8fb0ff"/><circle cx="15" cy="15" r="1.3" fill="#23408f"/></svg>',
'gez_saturn': '<svg viewBox="0 0 24 24" aria-hidden="true"><circle cx="12" cy="12" r="6.2" fill="#e8d199"/><ellipse cx="12" cy="12" rx="11" ry="3.4" transform="rotate(-18 12 12)" fill="none" stroke="#c9a96a" stroke-width="1.4"/></svg>',
'gez_uranus': '<svg viewBox="0 0 24 24" aria-hidden="true"><circle cx="12" cy="12" r="9" fill="#8fdbe8"/><ellipse cx="12" cy="12" rx="10.5" ry="2.6" transform="rotate(82 12 12)" fill="none" stroke="#5aaec0" stroke-width="1"/></svg>',
'gez_venus': '<svg viewBox="0 0 24 24" aria-hidden="true"><circle cx="12" cy="12" r="9" fill="#e8c27a"/><path d="M3.5 10c3 1.4 5-1.2 8.5 0s5-1.2 8.5 0M3.5 14.5c3 1 5-1 8.5 0s5-1 8.5 0" fill="none" stroke="#c4903a" stroke-width="1.1"/></svg>',
'ghost': '<svg class="ik" style="--ik-l:#B0BEC5;--ik-d:#B0BEC5" viewBox="0 0 24 24" aria-hidden="true" focusable="false"><path d="M12,2A9,9 0 0,0 3,11V22L6,19L9,22L12,19L15,22L18,19L21,22V11A9,9 0 0,0 12,2M9,8A2,2 0 0,1 11,10A2,2 0 0,1 9,12A2,2 0 0,1 7,10A2,2 0 0,1 9,8M15,8A2,2 0 0,1 17,10A2,2 0 0,1 15,12A2,2 0 0,1 13,10A2,2 0 0,1 15,8Z"/></svg>',
'globe-model': '<svg class="ik" style="--ik-l:#1E88E5;--ik-d:#1E88E5" viewBox="0 0 24 24" aria-hidden="true" focusable="false"><path d="M17.36,2.64L15.95,4.06C17.26,5.37 18,7.14 18,9A7,7 0 0,1 11,16C9.15,16 7.37,15.26 6.06,13.95L4.64,15.36C6.08,16.8 7.97,17.71 10,17.93V20H6V22H16V20H12V17.94C16.55,17.43 20,13.58 20,9C20,6.62 19.05,4.33 17.36,2.64M11,3.5A5.5,5.5 0 0,0 5.5,9A5.5,5.5 0 0,0 11,14.5A5.5,5.5 0 0,0 16.5,9A5.5,5.5 0 0,0 11,3.5M11,5.5C12.94,5.5 14.5,7.07 14.5,9A3.5,3.5 0 0,1 11,12.5A3.5,3.5 0 0,1 7.5,9A3.5,3.5 0 0,1 11,5.5Z"/></svg>',
'grain': '<svg class="ik" style="--ik-l:#F9A825;--ik-d:#F9A825" viewBox="0 0 24 24" aria-hidden="true" focusable="false"><path d="M10,12A2,2 0 0,0 8,14A2,2 0 0,0 10,16A2,2 0 0,0 12,14A2,2 0 0,0 10,12M6,8A2,2 0 0,0 4,10A2,2 0 0,0 6,12A2,2 0 0,0 8,10A2,2 0 0,0 6,8M6,16A2,2 0 0,0 4,18A2,2 0 0,0 6,20A2,2 0 0,0 8,18A2,2 0 0,0 6,16M18,8A2,2 0 0,0 20,6A2,2 0 0,0 18,4A2,2 0 0,0 16,6A2,2 0 0,0 18,8M14,16A2,2 0 0,0 12,18A2,2 0 0,0 14,20A2,2 0 0,0 16,18A2,2 0 0,0 14,16M18,12A2,2 0 0,0 16,14A2,2 0 0,0 18,16A2,2 0 0,0 20,14A2,2 0 0,0 18,12M14,8A2,2 0 0,0 12,10A2,2 0 0,0 14,12A2,2 0 0,0 16,10A2,2 0 0,0 14,8M10,4A2,2 0 0,0 8,6A2,2 0 0,0 10,8A2,2 0 0,0 12,6A2,2 0 0,0 10,4Z"/></svg>',
'guitar-acoustic': '<svg class="ik" style="--ik-l:#8D6E63;--ik-d:#C6B6B1" viewBox="0 0 24 24" aria-hidden="true" focusable="false"><path d="M19.59,3H22V5H20.41L16.17,9.24C15.8,8.68 15.32,8.2 14.76,7.83L19.59,3M12,8A4,4 0 0,1 16,12C16,13.82 14.77,15.42 13,15.87V16A5,5 0 0,1 8,21A5,5 0 0,1 3,16A5,5 0 0,1 8,11H8.13C8.58,9.24 10.17,8 12,8M12,10.5A1.5,1.5 0 0,0 10.5,12A1.5,1.5 0 0,0 12,13.5A1.5,1.5 0 0,0 13.5,12A1.5,1.5 0 0,0 12,10.5M6.94,14.24L6.23,14.94L9.06,17.77L9.77,17.06L6.94,14.24Z"/></svg>',
'gunes': '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M12 2.5v3M12 18.5v3M2.5 12h3M18.5 12h3M5.3 5.3l2.1 2.1M16.6 16.6l2.1 2.1M5.3 18.7l2.1-2.1M16.6 7.4l2.1-2.1" stroke="#f7b733" stroke-width="1.8" stroke-linecap="round"/><circle cx="12" cy="12" r="5.2" fill="#f7b733"/></svg>',
'gunes_tutulma': '<svg viewBox="0 0 24 24" aria-hidden="true"><circle cx="12" cy="12" r="9" fill="#f7b733"/><circle cx="14.5" cy="11" r="7.2" fill="#1b1b1b"/></svg>',
'hamburger': '<svg class="ik" style="--ik-l:#D2691E;--ik-d:#D2691E" viewBox="0 0 24 24" aria-hidden="true" focusable="false"><path d="M22 13C22 14.11 21.11 15 20 15H4C2.9 15 2 14.11 2 13S2.9 11 4 11H13L15.5 13L18 11H20C21.11 11 22 11.9 22 13M12 3C3 3 3 9 3 9H21C21 9 21 3 12 3M3 18C3 19.66 4.34 21 6 21H18C19.66 21 21 19.66 21 18V17H3V18Z"/></svg>',
'hand-heart': '<svg class="ik" style="--ik-l:#E91E63;--ik-d:#F48EB1" viewBox="0 0 24 24" aria-hidden="true" focusable="false"><path d="M20 17Q20.86 17 21.45 17.6T22.03 19L14 22L7 20V11H8.95L16.22 13.69Q17 14 17 14.81 17 15.28 16.66 15.63T15.8 16H13L11.25 15.33L10.92 16.27L13 17H20M16 3.23Q17.06 2 18.7 2 20.06 2 21 3T22 5.3Q22 6.33 21 7.76T19.03 10.15 16 13Q13.92 11.11 12.94 10.15T10.97 7.76 10 5.3Q10 3.94 10.97 3T13.31 2Q14.91 2 16 3.23M.984 11H5V22H.984V11Z"/></svg>',
'handshake': '<svg class="ik" style="--ik-l:#F57C00;--ik-d:#F57C00" viewBox="0 0 24 24" aria-hidden="true" focusable="false"><path d="M11 6H14L17.29 2.7A1 1 0 0 1 18.71 2.7L21.29 5.29A1 1 0 0 1 21.29 6.7L19 9H11V11A1 1 0 0 1 10 12A1 1 0 0 1 9 11V8A2 2 0 0 1 11 6M5 11V15L2.71 17.29A1 1 0 0 0 2.71 18.7L5.29 21.29A1 1 0 0 0 6.71 21.29L11 17H15A1 1 0 0 0 16 16V15H17A1 1 0 0 0 18 14V13H19A1 1 0 0 0 20 12V11H13V12A2 2 0 0 1 11 14H9A2 2 0 0 1 7 12V9Z"/></svg>',
'hanger': '<svg class="ik" style="--ik-l:#AB47BC;--ik-d:#D5A3DE" viewBox="0 0 24 24" aria-hidden="true" focusable="false"><path d="M12 4A3.5 3.5 0 0 0 8.5 7.5H10.5A1.5 1.5 0 0 1 12 6A1.5 1.5 0 0 1 13.5 7.5A1.5 1.5 0 0 1 12 9C11.45 9 11 9.45 11 10V11.75L2.4 18.2A1 1 0 0 0 3 20H21A1 1 0 0 0 21.6 18.2L13 11.75V10.85A3.5 3.5 0 0 0 15.5 7.5A3.5 3.5 0 0 0 12 4M12 13.5L18 18H6Z"/></svg>',
'harddisk': '<svg class="ik" style="--ik-l:#607D8B;--ik-d:#B0BEC5" viewBox="0 0 24 24" aria-hidden="true" focusable="false"><path d="M6,2H18A2,2 0 0,1 20,4V20A2,2 0 0,1 18,22H6A2,2 0 0,1 4,20V4A2,2 0 0,1 6,2M12,4A6,6 0 0,0 6,10C6,13.31 8.69,16 12.1,16L11.22,13.77C10.95,13.29 11.11,12.68 11.59,12.4L12.45,11.9C12.93,11.63 13.54,11.79 13.82,12.27L15.74,14.69C17.12,13.59 18,11.9 18,10A6,6 0 0,0 12,4M12,9A1,1 0 0,1 13,10A1,1 0 0,1 12,11A1,1 0 0,1 11,10A1,1 0 0,1 12,9M7,18A1,1 0 0,0 6,19A1,1 0 0,0 7,20A1,1 0 0,0 8,19A1,1 0 0,0 7,18M12.09,13.27L14.58,19.58L17.17,18.08L12.95,12.77L12.09,13.27Z"/></svg>',
'heart': '<svg class="ik" style="--ik-l:#E91E63;--ik-d:#F48EB1" viewBox="0 0 24 24" aria-hidden="true" focusable="false"><path d="M12,21.35L10.55,20.03C5.4,15.36 2,12.27 2,8.5C2,5.41 4.42,3 7.5,3C9.24,3 10.91,3.81 12,5.08C13.09,3.81 14.76,3 16.5,3C19.58,3 22,5.41 22,8.5C22,12.27 18.6,15.36 13.45,20.03L12,21.35Z"/></svg>',
'heart-multiple': '<svg class="ik" style="--ik-l:#E91E63;--ik-d:#F48EB1" viewBox="0 0 24 24" aria-hidden="true" focusable="false"><path d="M13.5,20C6.9,13.9 3.5,10.8 3.5,7.1C3.5,4 5.9,1.6 9,1.6C10.7,1.6 12.4,2.4 13.5,3.7C14.6,2.4 16.3,1.6 18,1.6C21.1,1.6 23.5,4 23.5,7.1C23.5,10.9 20.1,14 13.5,20M12,21.1C5.4,15.2 1.5,11.7 1.5,7C1.5,6.8 1.5,6.6 1.5,6.4C0.9,7.3 0.5,8.4 0.5,9.6C0.5,13.4 3.9,16.5 10.5,22.4L12,21.1Z"/></svg>',
'helicopter': '<svg class="ik" style="--ik-l:#33691E;--ik-d:#99B48E" viewBox="0 0 24 24" aria-hidden="true" focusable="false"><path d="M3,3H17V5H3V3M23,6V10.5L14.75,12.2C14.91,12.6 15,13.04 15,13.5C15,14.9 14.18,16.1 13,16.66V17L13,19H16V21H4A3,3 0 0,1 1,18V17H3V18A1,1 0 0,0 4,19H5V16.74C3.25,16.13 2,14.46 2,12.5C2,10 4,8 6.5,8H9V6H11V8H21V6H23M11,19V17H7V19H11M7.5,10C6.12,10 5,10.9 5,12C5,13.1 6.12,14 7.5,14C8.88,14 10,13.1 10,12C10,10.9 8.88,10 7.5,10Z"/></svg>',
'history': '<svg class="ik" style="--ik-l:#8D6E63;--ik-d:#C6B6B1" viewBox="0 0 24 24" aria-hidden="true" focusable="false"><path d="M13.5,8H12V13L16.28,15.54L17,14.33L13.5,12.25V8M13,3A9,9 0 0,0 4,12H1L4.96,16.03L9,12H6A7,7 0 0,1 13,5A7,7 0 0,1 20,12A7,7 0 0,1 13,19C11.07,19 9.32,18.21 8.06,16.94L6.64,18.36C8.27,20 10.5,21 13,21A9,9 0 0,0 22,12A9,9 0 0,0 13,3"/></svg>',
'home': '<svg class="ik" style="--ik-l:#1A73E8;--ik-d:#8CB9F4" viewBox="0 0 24 24" aria-hidden="true" focusable="false"><path d="M10,20V14H14V20H19V12H22L12,3L2,12H5V20H10Z"/></svg>',
'home-automation': '<svg class="ik" style="--ik-l:#43A047;--ik-d:#43A047" viewBox="0 0 24 24" aria-hidden="true" focusable="false"><path d="M12,3L2,12H5V20H19V12H22L12,3M12,8.5C14.34,8.5 16.46,9.43 18,10.94L16.8,12.12C15.58,10.91 13.88,10.17 12,10.17C10.12,10.17 8.42,10.91 7.2,12.12L6,10.94C7.54,9.43 9.66,8.5 12,8.5M12,11.83C13.4,11.83 14.67,12.39 15.6,13.3L14.4,14.47C13.79,13.87 12.94,13.5 12,13.5C11.06,13.5 10.21,13.87 9.6,14.47L8.4,13.3C9.33,12.39 10.6,11.83 12,11.83M12,15.17C12.94,15.17 13.7,15.91 13.7,16.83C13.7,17.75 12.94,18.5 12,18.5C11.06,18.5 10.3,17.75 10.3,16.83C10.3,15.91 11.06,15.17 12,15.17Z"/></svg>',
'home-city': '<svg class="ik" style="--ik-l:#546E7A;--ik-d:#AAB6BC" viewBox="0 0 24 24" aria-hidden="true" focusable="false"><path d="M0,21V10L7.5,5L15,10V21H10V14H5V21H0M24,2V21H17V8.93L16,8.27V6H14V6.93L10,4.27V2H24M21,14H19V16H21V14M21,10H19V12H21V10M21,6H19V8H21V6Z"/></svg>',
'home-group': '<svg class="ik" style="--ik-l:#795548;--ik-d:#BCAAA4" viewBox="0 0 24 24" aria-hidden="true" focusable="false"><path d="M17,16H15V22H12V17H8V22H5V16H3L10,10L17,16M6,2L10,6H9V9H7V6H5V9H3V6H2L6,2M18,3L23,8H22V12H19V9H17V12H15.34L14,10.87V8H13L18,3Z"/></svg>',
'home-variant': '<svg class="ik" style="--ik-l:#5D4037;--ik-d:#AEA09B" viewBox="0 0 24 24" aria-hidden="true" focusable="false"><path d="M12,3L20,9V21H15V14H9V21H4V9L12,3Z"/></svg>',
'hospital-box': '<svg class="ik" style="--ik-l:#E53935;--ik-d:#F29C9A" viewBox="0 0 24 24" aria-hidden="true" focusable="false"><path d="M18,14H14V18H10V14H6V10H10V6H14V10H18M19,3H5C3.89,3 3,3.89 3,5V19A2,2 0 0,0 5,21H19A2,2 0 0,0 21,19V5C21,3.89 20.1,3 19,3Z"/></svg>',
'human': '<svg class="ik" style="--ik-l:#E0A77A;--ik-d:#E0A77A" viewBox="0 0 24 24" aria-hidden="true" focusable="false"><path d="M21,9H15V22H13V16H11V22H9V9H3V7H21M12,2A2,2 0 0,1 14,4A2,2 0 0,1 12,6C10.89,6 10,5.1 10,4C10,2.89 10.89,2 12,2Z"/></svg>',
'human-female-dance': '<svg class="ik" style="--ik-l:#EC407A;--ik-d:#EC407A" viewBox="0 0 24 24" aria-hidden="true" focusable="false"><path d="M17 17H15V23H13V17H10.88L9.34 18.93L11.71 21.29L10.29 22.71L7.93 20.34C7.58 20 7.38 19.53 7.35 19.04C7.32 18.55 7.47 18.06 7.78 17.68L8.32 17H7L9 13V10C8.38 10.47 7.88 11.07 7.53 11.76C7.18 12.46 7 13.22 7 14H5C5 12.14 5.74 10.36 7.05 9.05C8.36 7.74 10.14 7 12 7C13.33 7 14.6 6.47 15.54 5.54C16.47 4.6 17 3.33 17 2H19C19 3.32 18.62 4.62 17.91 5.73C17.2 6.85 16.2 7.74 15 8.31V13L17 17M14 4C14 4.4 13.88 4.78 13.66 5.11C13.44 5.44 13.13 5.7 12.77 5.85C12.4 6 12 6.04 11.61 5.96C11.22 5.88 10.87 5.69 10.59 5.41C10.31 5.13 10.12 4.78 10.04 4.39C9.96 4 10 3.6 10.15 3.24C10.3 2.87 10.56 2.56 10.89 2.34C11.22 2.12 11.6 2 12 2C12.53 2 13.04 2.21 13.41 2.59C13.79 2.96 14 3.47 14 4Z"/></svg>',
'human-male-board': '<svg class="ik" style="--ik-l:#37474F;--ik-d:#9BA3A7" viewBox="0 0 24 24" aria-hidden="true" focusable="false"><path d="M20,17A2,2 0 0,0 22,15V4A2,2 0 0,0 20,2H9.46C9.81,2.61 10,3.3 10,4H20V15H11V17M15,7V9H9V22H7V16H5V22H3V14H1.5V9A2,2 0 0,1 3.5,7H15M8,4A2,2 0 0,1 6,6A2,2 0 0,1 4,4A2,2 0 0,1 6,2A2,2 0 0,1 8,4Z"/></svg>',
'human-male-female': '<svg class="ik" style="--ik-l:#AD1457;--ik-d:#D68AAB" viewBox="0 0 24 24" aria-hidden="true" focusable="false"><path d="M7.5,2A2,2 0 0,1 9.5,4A2,2 0 0,1 7.5,6A2,2 0 0,1 5.5,4A2,2 0 0,1 7.5,2M6,7H9A2,2 0 0,1 11,9V14.5H9.5V22H5.5V14.5H4V9A2,2 0 0,1 6,7M16.5,2A2,2 0 0,1 18.5,4A2,2 0 0,1 16.5,6A2,2 0 0,1 14.5,4A2,2 0 0,1 16.5,2M15,22V16H12L14.59,8.41C14.84,7.59 15.6,7 16.5,7C17.4,7 18.16,7.59 18.41,8.41L21,16H18V22H15Z"/></svg>',
'image-filter-hdr': '<svg class="ik" style="--ik-l:#8D6E63;--ik-d:#C6B6B1" viewBox="0 0 24 24" aria-hidden="true" focusable="false"><path d="M14,6L10.25,11L13.1,14.8L11.5,16C9.81,13.75 7,10 7,10L1,18H23L14,6Z"/></svg>',
'image-frame': '<svg class="ik" style="--ik-l:#5D4037;--ik-d:#AEA09B" viewBox="0 0 24 24" aria-hidden="true" focusable="false"><path d="M10,14.29L6.5,19H17.46L14.75,15.46L12.78,17.8L10,14.29M5,21V7H18.96V21H5M12,2.4L14.61,5.03H9.37L12,2.4M5,5.03C4.5,5.03 4,5.22 3.61,5.61C3.2,6 3,6.46 3,7V21C3,21.5 3.2,22 3.61,22.39C4,22.8 4.5,23 5,23H18.96C19.5,23 19.96,22.8 20.37,22.39C20.77,22 21,21.5 21,21V7C21,6.46 20.77,6 20.37,5.61C19.96,5.22 19.5,5.03 18.96,5.03H16L12,1L7.96,5.03H5Z"/></svg>',
'image-multiple': '<svg class="ik" style="--ik-l:#0288D1;--ik-d:#0288D1" viewBox="0 0 24 24" aria-hidden="true" focusable="false"><path d="M22,16V4A2,2 0 0,0 20,2H8A2,2 0 0,0 6,4V16A2,2 0 0,0 8,18H20A2,2 0 0,0 22,16M11,12L13.03,14.71L16,11L20,16H8M2,6V20A2,2 0 0,0 4,22H18V20H4V6"/></svg>',
'information': '<svg class="ik" style="--ik-l:#0288D1;--ik-d:#0288D1" viewBox="0 0 24 24" aria-hidden="true" focusable="false"><path d="M13,9H11V7H13M13,17H11V11H13M12,2A10,10 0 0,0 2,12A10,10 0 0,0 12,22A10,10 0 0,0 22,12A10,10 0 0,0 12,2Z"/></svg>',
'island': '<svg class="ik" style="--ik-l:#00838F;--ik-d:#80C1C7" viewBox="0 0 24 24" aria-hidden="true" focusable="false"><path d="M20 20C18.61 20 17.22 19.53 16 18.67C13.56 20.38 10.44 20.38 8 18.67C6.78 19.53 5.39 20 4 20H2V22H4C5.37 22 6.74 21.65 8 21C10.5 22.3 13.5 22.3 16 21C17.26 21.65 18.62 22 20 22H22V20H20M20.78 19H20C18.82 19 17.64 18.6 16.58 17.85L16 17.45L15.42 17.85C14.39 18.57 13.21 18.95 12 18.95C10.77 18.95 9.59 18.57 8.56 17.85L8 17.45L7.43 17.85C6.36 18.6 5.18 19 4 19H3.22C3.75 17.54 5.58 15 12 15C14 15 15 15.24 15 15.24C15.68 13.87 16.83 10.77 16 6.82L17.06 7.53C17.39 8.96 18 11.75 16.8 15.65C19.43 16.5 20.42 18 20.78 19M22 7.59C21.21 6.5 20 5.71 18.58 5.53C18.7 5.67 18.81 5.83 18.92 6C20.12 7.91 19.87 10.32 18.47 11.95C19.06 10.5 19 8.79 18.08 7.36C18 7.28 17.96 7.2 17.9 7.11C17.5 6.53 16.96 6.06 16.38 5.72C14.35 6.37 12.88 8.27 12.88 10.5C12.88 11.03 12.96 11.53 13.1 12C12.5 11.17 12.16 10.17 12.16 9.07C12.16 7.41 12.96 5.95 14.2 5.03C13.16 4.95 12.09 5.18 11.14 5.78C10.7 6.05 10.32 6.38 10 6.76C10.39 5.82 11.05 5 12 4.4C13.04 3.74 14.25 3.5 15.39 3.69C15.1 3.29 14.75 2.92 14.33 2.6C13.92 2.29 13.47 2.05 13 1.88C14 1.91 15.04 2.24 15.91 2.89C16.35 3.22 16.7 3.62 17 4.05C17.06 4.05 17.12 4.04 17.19 4.04C19.45 4.04 21.37 5.53 22 7.59Z"/></svg>',
'kara_delik': '<svg viewBox="0 0 24 24" aria-hidden="true"><ellipse cx="12" cy="12" rx="10" ry="3.6" fill="none" stroke="#f08c2c" stroke-width="2"/><circle cx="12" cy="12" r="5.2" fill="#111"/></svg>',
'laptop': '<svg class="ik" style="--ik-l:#546E7A;--ik-d:#AAB6BC" viewBox="0 0 24 24" aria-hidden="true" focusable="false"><path d="M4,6H20V16H4M20,18A2,2 0 0,0 22,16V6C22,4.89 21.1,4 20,4H4C2.89,4 2,4.89 2,6V16A2,2 0 0,0 4,18H0V20H24V18H20Z"/></svg>',
'layers-triple': '<svg class="ik" style="--ik-l:#8D6E63;--ik-d:#C6B6B1" viewBox="0 0 24 24" aria-hidden="true" focusable="false"><path d="M12 0L3 7L4.63 8.27L12 14L19.36 8.27L21 7L12 0M19.37 10.73L12 16.47L4.62 10.74L3 12L12 19L21 12L19.37 10.73M19.37 15.73L12 21.47L4.62 15.74L3 17L12 24L21 17L19.37 15.73Z"/></svg>',
'leaf': '<svg class="ik" style="--ik-l:#43A047;--ik-d:#43A047" viewBox="0 0 24 24" aria-hidden="true" focusable="false"><path d="M17,8C8,10 5.9,16.17 3.82,21.34L5.71,22L6.66,19.7C7.14,19.87 7.64,20 8,20C19,20 22,3 22,3C21,5 14,5.25 9,6.25C4,7.25 2,11.5 2,13.5C2,15.5 3.75,17.25 3.75,17.25C7,8 17,8 17,8Z"/></svg>',
'lightbulb': '<svg class="ik" style="--ik-l:#FBC02D;--ik-d:#FBC02D" viewBox="0 0 24 24" aria-hidden="true" focusable="false"><path d="M12,2A7,7 0 0,0 5,9C5,11.38 6.19,13.47 8,14.74V17A1,1 0 0,0 9,18H15A1,1 0 0,0 16,17V14.74C17.81,13.47 19,11.38 19,9A7,7 0 0,0 12,2M9,21A1,1 0 0,0 10,22H14A1,1 0 0,0 15,21V20H9V21Z"/></svg>',
'lightbulb-on': '<svg class="ik" style="--ik-l:#FBC02D;--ik-d:#FBC02D" viewBox="0 0 24 24" aria-hidden="true" focusable="false"><path d="M12,6A6,6 0 0,1 18,12C18,14.22 16.79,16.16 15,17.2V19A1,1 0 0,1 14,20H10A1,1 0 0,1 9,19V17.2C7.21,16.16 6,14.22 6,12A6,6 0 0,1 12,6M14,21V22A1,1 0 0,1 13,23H11A1,1 0 0,1 10,22V21H14M20,11H23V13H20V11M1,11H4V13H1V11M13,1V4H11V1H13M4.92,3.5L7.05,5.64L5.63,7.05L3.5,4.93L4.92,3.5M16.95,5.63L19.07,3.5L20.5,4.93L18.37,7.05L16.95,5.63Z"/></svg>',
'lightning-bolt': '<svg class="ik" style="--ik-l:#FDD835;--ik-d:#FDD835" viewBox="0 0 24 24" aria-hidden="true" focusable="false"><path d="M11 15H6L13 1V9H18L11 23V15Z"/></svg>',
'lipstick': '<svg class="ik" style="--ik-l:#E91E63;--ik-d:#F48EB1" viewBox="0 0 24 24" aria-hidden="true" focusable="false"><path d="M9 23C8.45 23 8 22.55 8 22V13C8 12.45 8.45 12 9 12H15C15.55 12 16 12.45 16 13V22C16 22.55 15.55 23 15 23H9M10 11C9.45 11 9 10.55 9 10V5.25C9 5.25 11 3 11.75 1C12.83 1.67 13.92 2.33 14.46 3.83C15 5.33 15 7.67 15 10C15 10.55 14.55 11 14 11H10Z"/></svg>',
'lock': '<svg class="ik" style="--ik-l:#F9A825;--ik-d:#F9A825" viewBox="0 0 24 24" aria-hidden="true" focusable="false"><path d="M12,17A2,2 0 0,0 14,15C14,13.89 13.1,13 12,13A2,2 0 0,0 10,15A2,2 0 0,0 12,17M18,8A2,2 0 0,1 20,10V20A2,2 0 0,1 18,22H6A2,2 0 0,1 4,20V10C4,8.89 4.9,8 6,8H7V6A5,5 0 0,1 12,1A5,5 0 0,1 17,6V8H18M12,3A3,3 0 0,0 9,6V8H15V6A3,3 0 0,0 12,3Z"/></svg>',
'magnify': '<svg class="ik" style="--ik-l:#607D8B;--ik-d:#B0BEC5" viewBox="0 0 24 24" aria-hidden="true" focusable="false"><path d="M9.5,3A6.5,6.5 0 0,1 16,9.5C16,11.11 15.41,12.59 14.44,13.73L14.71,14H15.5L20.5,19L19,20.5L14,15.5V14.71L13.73,14.44C12.59,15.41 11.11,16 9.5,16A6.5,6.5 0 0,1 3,9.5A6.5,6.5 0 0,1 9.5,3M9.5,5C7,5 5,7 5,9.5C5,12 7,14 9.5,14C12,14 14,12 14,9.5C14,7 12,5 9.5,5Z"/></svg>',
'map': '<svg class="ik" style="--ik-l:#00897B;--ik-d:#80C4BD" viewBox="0 0 24 24" aria-hidden="true" focusable="false"><path d="M15,19L9,16.89V5L15,7.11M20.5,3C20.44,3 20.39,3 20.34,3L15,5.1L9,3L3.36,4.9C3.15,4.97 3,5.15 3,5.38V20.5A0.5,0.5 0 0,0 3.5,21C3.55,21 3.61,21 3.66,20.97L9,18.9L15,21L20.64,19.1C20.85,19 21,18.85 21,18.62V3.5A0.5,0.5 0 0,0 20.5,3Z"/></svg>',
'map-marker': '<svg class="ik" style="--ik-l:#E53935;--ik-d:#F29C9A" viewBox="0 0 24 24" aria-hidden="true" focusable="false"><path d="M12,11.5A2.5,2.5 0 0,1 9.5,9A2.5,2.5 0 0,1 12,6.5A2.5,2.5 0 0,1 14.5,9A2.5,2.5 0 0,1 12,11.5M12,2A7,7 0 0,0 5,9C5,14.25 12,22 12,22C12,22 19,14.25 19,9A7,7 0 0,0 12,2Z"/></svg>',
'map-marker-question': '<svg class="ik" style="--ik-l:#E53935;--ik-d:#F29C9A" viewBox="0 0 24 24" aria-hidden="true" focusable="false"><path d="M12,2C8.14,2 5,5.14 5,9C5,14.25 12,22 12,22C12,22 19,14.25 19,9C19,5.14 15.86,2 12,2M12.88,15.75H11.13V14H12.88M12.88,12.88H11.13C11.13,10.04 13.75,10.26 13.75,8.5A1.75,1.75 0 0,0 12,6.75A1.75,1.75 0 0,0 10.25,8.5H8.5A3.5,3.5 0 0,1 12,5A3.5,3.5 0 0,1 15.5,8.5C15.5,10.69 12.88,10.91 12.88,12.88Z"/></svg>',
'map-marker-radius': '<svg class="ik" style="--ik-l:#D81B60;--ik-d:#EC8DB0" viewBox="0 0 24 24" aria-hidden="true" focusable="false"><path d="M12,2C15.31,2 18,4.66 18,7.95C18,12.41 12,19 12,19C12,19 6,12.41 6,7.95C6,4.66 8.69,2 12,2M12,6A2,2 0 0,0 10,8A2,2 0 0,0 12,10A2,2 0 0,0 14,8A2,2 0 0,0 12,6M20,19C20,21.21 16.42,23 12,23C7.58,23 4,21.21 4,19C4,17.71 5.22,16.56 7.11,15.83L7.75,16.74C6.67,17.19 6,17.81 6,18.5C6,19.88 8.69,21 12,21C15.31,21 18,19.88 18,18.5C18,17.81 17.33,17.19 16.25,16.74L16.89,15.83C18.78,16.56 20,17.71 20,19Z"/></svg>',
'map-outline': '<svg class="ik" style="--ik-l:#00897B;--ik-d:#80C4BD" viewBox="0 0 24 24" aria-hidden="true" focusable="false"><path d="M20.5,3L20.34,3.03L15,5.1L9,3L3.36,4.9C3.15,4.97 3,5.15 3,5.38V20.5A0.5,0.5 0 0,0 3.5,21L3.66,20.97L9,18.9L15,21L20.64,19.1C20.85,19.03 21,18.85 21,18.62V3.5A0.5,0.5 0 0,0 20.5,3M10,5.47L14,6.87V18.53L10,17.13V5.47M5,6.46L8,5.45V17.15L5,18.31V6.46M19,17.54L16,18.55V6.86L19,5.7V17.54Z"/></svg>',
'medal': '<svg class="ik" style="--ik-l:#F9A825;--ik-d:#F9A825" viewBox="0 0 24 24" aria-hidden="true" focusable="false"><path d="M20,2H4V4L9.81,8.36C6.14,9.57 4.14,13.53 5.35,17.2C6.56,20.87 10.5,22.87 14.19,21.66C17.86,20.45 19.86,16.5 18.65,12.82C17.95,10.71 16.3,9.05 14.19,8.36L20,4V2M14.94,19.5L12,17.78L9.06,19.5L9.84,16.17L7.25,13.93L10.66,13.64L12,10.5L13.34,13.64L16.75,13.93L14.16,16.17L14.94,19.5Z"/></svg>',
'memory': '<svg class="ik" style="--ik-l:#2E7D32;--ik-d:#96BE98" viewBox="0 0 24 24" aria-hidden="true" focusable="false"><path d="M17,17H7V7H17M21,11V9H19V7C19,5.89 18.1,5 17,5H15V3H13V5H11V3H9V5H7C5.89,5 5,5.89 5,7V9H3V11H5V13H3V15H5V17A2,2 0 0,0 7,19H9V21H11V19H13V21H15V19H17A2,2 0 0,0 19,17V15H21V13H19V11M13,13H11V11H13M15,9H9V15H15V9Z"/></svg>',
'menu': '<svg class="ik" style="--ik-l:#37474F;--ik-d:#9BA3A7" viewBox="0 0 24 24" aria-hidden="true" focusable="false"><path d="M3,6H21V8H3V6M3,11H21V13H3V11M3,16H21V18H3V16Z"/></svg>',
'meteor': '<svg class="ik" style="--ik-l:#FF7043;--ik-d:#FF7043" viewBox="0 0 24 24" aria-hidden="true" focusable="false"><path d="M2.8,3L19.67,18.82C19.67,18.82 20,19.27 19.58,19.71C19.17,20.15 18.63,19.77 18.63,19.77L2.8,3M7.81,4.59L20.91,16.64C20.91,16.64 21.23,17.08 20.82,17.5C20.4,17.97 19.86,17.59 19.86,17.59L7.81,4.59M4.29,8L17.39,20.03C17.39,20.03 17.71,20.47 17.3,20.91C16.88,21.36 16.34,21 16.34,21L4.29,8M12.05,5.96L21.2,14.37C21.2,14.37 21.42,14.68 21.13,15C20.85,15.3 20.47,15.03 20.47,15.03L12.05,5.96M5.45,11.91L14.6,20.33C14.6,20.33 14.82,20.64 14.54,20.95C14.25,21.26 13.87,21 13.87,21L5.45,11.91M16.38,7.92L20.55,11.74C20.55,11.74 20.66,11.88 20.5,12.03C20.38,12.17 20.19,12.05 20.19,12.05L16.38,7.92M7.56,16.1L11.74,19.91C11.74,19.91 11.85,20.06 11.7,20.2C11.56,20.35 11.37,20.22 11.37,20.22L7.56,16.1Z"/></svg>',
'microphone-variant': '<svg class="ik" style="--ik-l:#424242;--ik-d:#A0A0A0" viewBox="0 0 24 24" aria-hidden="true" focusable="false"><path d="M9,3A4,4 0 0,1 13,7H5A4,4 0 0,1 9,3M11.84,9.82L11,18H10V19A2,2 0 0,0 12,21A2,2 0 0,0 14,19V14A4,4 0 0,1 18,10H20L19,11L20,12H18A2,2 0 0,0 16,14V19A4,4 0 0,1 12,23A4,4 0 0,1 8,19V18H7L6.16,9.82C5.67,9.32 5.31,8.7 5.13,8H12.87C12.69,8.7 12.33,9.32 11.84,9.82M9,11A1,1 0 0,0 8,12A1,1 0 0,0 9,13A1,1 0 0,0 10,12A1,1 0 0,0 9,11Z"/></svg>',
'microscope': '<svg class="ik" style="--ik-l:#5C6BC0;--ik-d:#AEB5E0" viewBox="0 0 24 24" aria-hidden="true" focusable="false"><path d="M9.46,6.28L11.05,9C8.47,9.26 6.5,11.41 6.5,14A5,5 0 0,0 11.5,19C13.55,19 15.31,17.77 16.08,16H13.5V14H21.5V16H19.25C18.84,17.57 17.97,18.96 16.79,20H19.5V22H3.5V20H6.21C4.55,18.53 3.5,16.39 3.5,14C3.5,10.37 5.96,7.2 9.46,6.28M12.74,2.07L13.5,3.37L14.36,2.87L17.86,8.93L14.39,10.93L10.89,4.87L11.76,4.37L11,3.07L12.74,2.07Z"/></svg>',
'monitor': '<svg class="ik" style="--ik-l:#455A64;--ik-d:#A2ACB2" viewBox="0 0 24 24" aria-hidden="true" focusable="false"><path d="M21,16H3V4H21M21,2H3C1.89,2 1,2.89 1,4V16A2,2 0 0,0 3,18H10V20H8V22H16V20H14V18H21A2,2 0 0,0 23,16V4C23,2.89 22.1,2 21,2Z"/></svg>',
'mosque': '<svg class="ik" style="--ik-l:#00695C;--ik-d:#80B4AE" viewBox="0 0 24 24" aria-hidden="true" focusable="false"><path d="M7 8H17C17.3 8 17.6 8.1 17.8 8.1C17.9 7.8 18 7.4 18 7.1C18 5.8 17.4 4.6 16.3 3.9L12 1L7.7 3.8C6.7 4.6 6 5.8 6 7.1C6 7.5 6.1 7.8 6.2 8.1C6.4 8.1 6.7 8 7 8M24 7C24 5.9 22 4 22 4S20 5.9 20 7C20 7.7 20.4 8.4 21 8.7V13H19V11C19 9.9 18.1 9 17 9H7C5.9 9 5 9.9 5 11V13H3V8.7C3.6 8.4 4 7.7 4 7C4 5.9 2 4 2 4S0 5.9 0 7C0 7.7 .4 8.4 1 8.7V21H10V17C10 15.9 10.9 15 12 15S14 15.9 14 17V21H23V8.7C23.6 8.4 24 7.7 24 7Z"/></svg>',
'movie-open': '<svg class="ik" style="--ik-l:#37474F;--ik-d:#9BA3A7" viewBox="0 0 24 24" aria-hidden="true" focusable="false"><path d="M20.84 2.18L16.91 2.96L19.65 6.5L21.62 6.1L20.84 2.18M13.97 3.54L12 3.93L14.75 7.46L16.71 7.07L13.97 3.54M9.07 4.5L7.1 4.91L9.85 8.44L11.81 8.05L9.07 4.5M4.16 5.5L3.18 5.69A2 2 0 0 0 1.61 8.04L2 10L6.9 9.03L4.16 5.5M2 10V20C2 21.11 2.9 22 4 22H20C21.11 22 22 21.11 22 20V10H2Z"/></svg>',
'movie-roll': '<svg class="ik" style="--ik-l:#37474F;--ik-d:#9BA3A7" viewBox="0 0 24 24" aria-hidden="true" focusable="false"><path d="M12,2A10,10 0 0,1 22,12A10,10 0 0,1 12,22A10,10 0 0,1 2,12A10,10 0 0,1 12,2M12,4A2.5,2.5 0 0,0 9.5,6.5A2.5,2.5 0 0,0 12,9A2.5,2.5 0 0,0 14.5,6.5A2.5,2.5 0 0,0 12,4M4.4,9.53C3.97,10.84 4.69,12.25 6,12.68C7.32,13.1 8.73,12.39 9.15,11.07C9.58,9.76 8.86,8.35 7.55,7.92C6.24,7.5 4.82,8.21 4.4,9.53M19.61,9.5C19.18,8.21 17.77,7.5 16.46,7.92C15.14,8.34 14.42,9.75 14.85,11.07C15.28,12.38 16.69,13.1 18,12.67C19.31,12.25 20.03,10.83 19.61,9.5M7.31,18.46C8.42,19.28 10,19.03 10.8,17.91C11.61,16.79 11.36,15.23 10.24,14.42C9.13,13.61 7.56,13.86 6.75,14.97C5.94,16.09 6.19,17.65 7.31,18.46M16.7,18.46C17.82,17.65 18.07,16.09 17.26,14.97C16.45,13.85 14.88,13.6 13.77,14.42C12.65,15.23 12.4,16.79 13.21,17.91C14,19.03 15.59,19.27 16.7,18.46M12,10.5A1.5,1.5 0 0,0 10.5,12A1.5,1.5 0 0,0 12,13.5A1.5,1.5 0 0,0 13.5,12A1.5,1.5 0 0,0 12,10.5Z"/></svg>',
'music': '<svg class="ik" style="--ik-l:#8E24AA;--ik-d:#C692D4" viewBox="0 0 24 24" aria-hidden="true" focusable="false"><path d="M21,3V15.5A3.5,3.5 0 0,1 17.5,19A3.5,3.5 0 0,1 14,15.5A3.5,3.5 0 0,1 17.5,12C18.04,12 18.55,12.12 19,12.34V6.47L9,8.6V17.5A3.5,3.5 0 0,1 5.5,21A3.5,3.5 0 0,1 2,17.5A3.5,3.5 0 0,1 5.5,14C6.04,14 6.55,14.12 7,14.34V6L21,3Z"/></svg>',
'music-note': '<svg class="ik" style="--ik-l:#8E24AA;--ik-d:#C692D4" viewBox="0 0 24 24" aria-hidden="true" focusable="false"><path d="M12 3V13.55C11.41 13.21 10.73 13 10 13C7.79 13 6 14.79 6 17S7.79 21 10 21 14 19.21 14 17V7H18V3H12Z"/></svg>',
'noodles': '<svg class="ik" style="--ik-l:#FFB74D;--ik-d:#FFB74D" viewBox="0 0 24 24" aria-hidden="true" focusable="false"><path d="M22 3L10 4.41V6H22V7H10V12H22C22 13.81 21.43 15.46 20.32 16.95S17.77 19.53 16 20.25V22H8V20.25C6.24 19.53 4.79 18.43 3.68 16.95S2 13.81 2 12H5V4L22 2V3M6 4.88V6H7V4.78L6 4.88M6 7V12H7V7H6M9 12V7H8V12H9M9 6V4.55L8 4.64V6H9Z"/></svg>',
'office-building': '<svg class="ik" style="--ik-l:#5D6D7E;--ik-d:#AEB6BE" viewBox="0 0 24 24" aria-hidden="true" focusable="false"><path d="M5,3V21H11V17.5H13V21H19V3H5M7,5H9V7H7V5M11,5H13V7H11V5M15,5H17V7H15V5M7,9H9V11H7V9M11,9H13V11H11V9M15,9H17V11H15V9M7,13H9V15H7V13M11,13H13V15H11V13M15,13H17V15H15V13M7,17H9V19H7V17M15,17H17V19H15V17Z"/></svg>',
'oil': '<svg class="ik" style="--ik-l:#3E2723;--ik-d:#9E9391" viewBox="0 0 24 24" aria-hidden="true" focusable="false"><path d="M22,12.5C22,12.5 24,14.67 24,16A2,2 0 0,1 22,18A2,2 0 0,1 20,16C20,14.67 22,12.5 22,12.5M6,6H10A1,1 0 0,1 11,7A1,1 0 0,1 10,8H9V10H11C11.74,10 12.39,10.4 12.73,11L19.24,7.24L22.5,9.13C23,9.4 23.14,10 22.87,10.5C22.59,10.97 22,11.14 21.5,10.86L19.4,9.65L15.75,15.97C15.41,16.58 14.75,17 14,17H5A2,2 0 0,1 3,15V12A2,2 0 0,1 5,10H7V8H6A1,1 0 0,1 5,7A1,1 0 0,1 6,6M5,12V15H14L16.06,11.43L12.6,13.43L11.69,12H5M0.38,9.21L2.09,7.5C2.5,7.11 3.11,7.11 3.5,7.5C3.89,7.89 3.89,8.5 3.5,8.91L1.79,10.62C1.4,11 0.77,11 0.38,10.62C0,10.23 0,9.6 0.38,9.21Z"/></svg>',
'orbit': '<svg class="ik" style="--ik-l:#3949AB;--ik-d:#9CA4D5" viewBox="0 0 24 24" aria-hidden="true" focusable="false"><path d="M8.11,1.75C9.3,1.25 10.62,1 12,1C18.08,1 23,5.92 23,12C23,18.08 18.08,23 12,23C5.92,23 1,18.08 1,12C1,10.62 1.25,9.3 1.72,8.08C2.24,8.61 2.83,8.96 3.45,9.18C3.16,10.07 3,11 3,12A9,9 0 0,0 12,21A9,9 0 0,0 21,12A9,9 0 0,0 12,3C11,3 10.07,3.16 9.18,3.45C8.96,2.83 8.61,2.24 8.11,1.75M4.93,2.93C6.03,2.93 6.93,3.82 6.93,4.93A2,2 0 0,1 4.93,6.93C3.82,6.93 2.93,6.03 2.93,4.93C2.93,3.82 3.82,2.93 4.93,2.93M12,7A5,5 0 0,1 17,12A5,5 0 0,1 12,17A5,5 0 0,1 7,12A5,5 0 0,1 12,7Z"/></svg>',
'orbit-variant': '<svg class="ik" style="--ik-l:#3949AB;--ik-d:#9CA4D5" viewBox="0 0 24 24" aria-hidden="true" focusable="false"><path d="M19 8L15 12H18C18 15.31 15.31 18 12 18C11 18 10.03 17.75 9.2 17.3L7.74 18.76C8.97 19.54 10.43 20 12 20C16.42 20 20 16.42 20 12H23M6 12C6 8.69 8.69 6 12 6C13 6 13.97 6.25 14.8 6.7L16.26 5.24C15.03 4.46 13.57 4 12 4C7.58 4 4 7.58 4 12H1L5 16L9 12M14 12C14 13.11 13.11 14 12 14S10 13.11 10 12 10.9 10 12 10 14 10.9 14 12Z"/></svg>',
'palette': '<svg class="ik" style="--ik-l:#8E24AA;--ik-d:#C692D4" viewBox="0 0 24 24" aria-hidden="true" focusable="false"><path d="M17.5,12A1.5,1.5 0 0,1 16,10.5A1.5,1.5 0 0,1 17.5,9A1.5,1.5 0 0,1 19,10.5A1.5,1.5 0 0,1 17.5,12M14.5,8A1.5,1.5 0 0,1 13,6.5A1.5,1.5 0 0,1 14.5,5A1.5,1.5 0 0,1 16,6.5A1.5,1.5 0 0,1 14.5,8M9.5,8A1.5,1.5 0 0,1 8,6.5A1.5,1.5 0 0,1 9.5,5A1.5,1.5 0 0,1 11,6.5A1.5,1.5 0 0,1 9.5,8M6.5,12A1.5,1.5 0 0,1 5,10.5A1.5,1.5 0 0,1 6.5,9A1.5,1.5 0 0,1 8,10.5A1.5,1.5 0 0,1 6.5,12M12,3A9,9 0 0,0 3,12A9,9 0 0,0 12,21A1.5,1.5 0 0,0 13.5,19.5C13.5,19.11 13.35,18.76 13.11,18.5C12.88,18.23 12.73,17.88 12.73,17.5A1.5,1.5 0 0,1 14.23,16H16A5,5 0 0,0 21,11C21,6.58 16.97,3 12,3Z"/></svg>',
'passport': '<svg class="ik" style="--ik-l:#1565C0;--ik-d:#8AB2E0" viewBox="0 0 24 24" aria-hidden="true" focusable="false"><path d="M6,2A2,2 0 0,0 4,4V20A2,2 0 0,0 6,22H18A2,2 0 0,0 20,20V4A2,2 0 0,0 18,2H6M12,5A5,5 0 0,1 17,10A5,5 0 0,1 12,15A5,5 0 0,1 7,10A5,5 0 0,1 12,5M12,6C11.59,6.62 11.25,7.29 11.04,8H12.96C12.75,7.29 12.42,6.62 12,6M10.7,6.22C9.78,6.53 9,7.17 8.54,8H10C10.18,7.38 10.4,6.78 10.7,6.22M13.29,6.22C13.59,6.78 13.82,7.38 14,8H15.46C15,7.17 14.21,6.54 13.29,6.22M8.13,9C8.05,9.32 8,9.65 8,10C8,10.35 8.05,10.68 8.13,11H9.82C9.78,10.67 9.75,10.34 9.75,10C9.75,9.66 9.78,9.33 9.82,9H8.13M10.83,9C10.78,9.32 10.75,9.66 10.75,10C10.75,10.34 10.78,10.67 10.83,11H13.17C13.21,10.67 13.25,10.34 13.25,10C13.25,9.66 13.21,9.32 13.17,9H10.83M14.18,9C14.22,9.33 14.25,9.66 14.25,10C14.25,10.34 14.22,10.67 14.18,11H15.87C15.95,10.68 16,10.35 16,10C16,9.65 15.95,9.32 15.87,9H14.18M8.54,12C9,12.83 9.78,13.46 10.7,13.78C10.4,13.22 10.18,12.63 10,12H8.54M11.04,12C11.25,12.72 11.59,13.38 12,14C12.42,13.38 12.75,12.72 12.96,12H11.04M14,12C13.82,12.63 13.59,13.22 13.29,13.78C14.21,13.46 15,12.83 15.46,12H14M7,17H17V19H7V17Z"/></svg>',
'pasta': '<svg class="ik" style="--ik-l:#F9A825;--ik-d:#F9A825" viewBox="0 0 24 24" aria-hidden="true" focusable="false"><path d="M4 16.5V8H3V7H4V6H3V5H4V4H3V3H9C9.5 3.03 9.95 3.24 10.34 3.63S10.95 4.5 11 5H21V6H11C10.95 6.53 10.73 7 10.34 7.43S9.5 8.05 9 8H7V15.05C7.05 15.05 7.13 15.04 7.24 15S7.44 15 7.5 15C8.06 15 8.7 15.14 9.42 15.42C9.83 14.5 10.53 13.68 11.53 13S13.53 12 14.53 12C16.06 12 17.36 12.53 18.42 13.59S20 15.95 20 17.5C20 17.55 20 17.64 20 17.77S19.97 17.97 19.97 18H3.14C3.27 17.5 3.55 17 4 16.5M6 15.23V8H5V15.7C5.5 15.45 5.81 15.3 6 15.23M9 7V6H7V7H9M9 4H7V5H9V4M5 4V5H6V4H5M5 6V7H6V6H5M2 19H22L20 21H4L2 19Z"/></svg>',
'periodic-table': '<svg class="ik" style="--ik-l:#00897B;--ik-d:#80C4BD" viewBox="0 0 24 24" aria-hidden="true" focusable="false"><path d="M2,4V6H4V4H2M20,4V6H22V4H20M2,7V9H4V7H2M5,7V9H7V7H5M14,7V9H16V7H14M17,7V9H19V7H17M20,7V9H22V7H20M2,10V12H4V10H2M5,10V12H7V10H5M8,10V12H10V10H8M11,10V12H13V10H11M14,10V12H16V10H14M17,10V12H19V10H17M20,10V12H22V10H20M2,13V15H4V13H2M5,13V15H7V13H5M8,13V15H10V13H8M11,13V15H13V13H11M14,13V15H16V13H14M17,13V15H19V13H17M20,13V15H22V13H20M5,17V19H7V17H5M8,17V19H10V17H8M11,17V19H13V17H11M14,17V19H16V17H14M17,17V19H19V17H17Z"/></svg>',
'pickaxe': '<svg class="ik" style="--ik-l:#616161;--ik-d:#B0B0B0" viewBox="0 0 24 24" aria-hidden="true" focusable="false"><path d="M14.79,10.62L3.5,21.9L2.1,20.5L13.38,9.21L14.79,10.62M19.27,7.73L19.86,7.14L19.07,6.35L19.71,5.71L18.29,4.29L17.65,4.93L16.86,4.14L16.27,4.73C14.53,3.31 12.57,2.17 10.47,1.37L9.64,3.16C11.39,4.08 13,5.19 14.5,6.5L14,7L17,10L17.5,9.5C18.81,11 19.92,12.61 20.84,14.36L22.63,13.53C21.83,11.43 20.69,9.47 19.27,7.73Z"/></svg>',
'pill': '<svg class="ik" style="--ik-l:#43A047;--ik-d:#43A047" viewBox="0 0 24 24" aria-hidden="true" focusable="false"><path d="M4.22,11.29L11.29,4.22C13.64,1.88 17.43,1.88 19.78,4.22C22.12,6.56 22.12,10.36 19.78,12.71L12.71,19.78C10.36,22.12 6.56,22.12 4.22,19.78C1.88,17.43 1.88,13.64 4.22,11.29M5.64,12.71C4.59,13.75 4.24,15.24 4.6,16.57L10.59,10.59L14.83,14.83L18.36,11.29C19.93,9.73 19.93,7.2 18.36,5.64C16.8,4.07 14.27,4.07 12.71,5.64L5.64,12.71Z"/></svg>',
'pillar': '<svg class="ik" style="--ik-l:#BCAAA4;--ik-d:#BCAAA4" viewBox="0 0 24 24" aria-hidden="true" focusable="false"><path d="M6,5H18A1,1 0 0,1 19,6A1,1 0 0,1 18,7H6A1,1 0 0,1 5,6A1,1 0 0,1 6,5M21,2V4H3V2H21M15,8H17V22H15V8M7,8H9V22H7V8M11,8H13V22H11V8Z"/></svg>',
'pine-tree': '<svg class="ik" style="--ik-l:#2E7D32;--ik-d:#96BE98" viewBox="0 0 24 24" aria-hidden="true" focusable="false"><path d="M10,21V18H3L8,13H5L10,8H7L12,3L17,8H14L19,13H16L21,18H14V21H10Z"/></svg>',
'pizza': '<svg class="ik" style="--ik-l:#F57F17;--ik-d:#F57F17" viewBox="0 0 24 24" aria-hidden="true" focusable="false"><path d="M12,15A2,2 0 0,1 10,13C10,11.89 10.9,11 12,11A2,2 0 0,1 14,13A2,2 0 0,1 12,15M7,7C7,5.89 7.89,5 9,5A2,2 0 0,1 11,7A2,2 0 0,1 9,9C7.89,9 7,8.1 7,7M12,2C8.43,2 5.23,3.54 3,6L12,22L21,6C18.78,3.54 15.57,2 12,2Z"/></svg>',
'playlist-music': '<svg class="ik" style="--ik-l:#AB47BC;--ik-d:#D5A3DE" viewBox="0 0 24 24" aria-hidden="true" focusable="false"><path d="M15,6H3V8H15V6M15,10H3V12H15V10M3,16H11V14H3V16M17,6V14.18C16.69,14.07 16.35,14 16,14A3,3 0 0,0 13,17A3,3 0 0,0 16,20A3,3 0 0,0 19,17V8H22V6H17Z"/></svg>',
'podium': '<svg class="ik" style="--ik-l:#F9A825;--ik-d:#F9A825" viewBox="0 0 24 24" aria-hidden="true" focusable="false"><path d="M12,7.09L14.45,8.58L13.8,5.77L16,3.89L13.11,3.64L12,1L10.87,3.64L8,3.89L10.18,5.77L9.5,8.58L12,7.09M4,13.09L6.45,14.58L5.8,11.77L8,9.89L5.11,9.64L4,7L2.87,9.64L0,9.89L2.18,11.77L1.5,14.58L4,13.09M20,10.09L22.45,11.58L21.8,8.77L24,6.89L21.11,6.64L20,4L18.87,6.64L16,6.89L18.18,8.77L17.5,11.58L20,10.09M15,23H9V10H15V23M7,23H1V17H7V23M23,23H17V13H23V23Z"/></svg>',
'popcorn': '<svg class="ik" style="--ik-l:#FFD54F;--ik-d:#FFD54F" viewBox="0 0 24 24" aria-hidden="true" focusable="false"><path d="M7,22H4.75C4.75,22 4,22 3.81,20.65L2.04,3.81L2,3.5C2,2.67 2.9,2 4,2C5.1,2 6,2.67 6,3.5C6,2.67 6.9,2 8,2C9.1,2 10,2.67 10,3.5C10,2.67 10.9,2 12,2C13.09,2 14,2.66 14,3.5V3.5C14,2.67 14.9,2 16,2C17.1,2 18,2.67 18,3.5C18,2.67 18.9,2 20,2C21.1,2 22,2.67 22,3.5L21.96,3.81L20.19,20.65C20,22 19.25,22 19.25,22H17L16.5,22H13.75L10.25,22H7.5L7,22M17.85,4.93C17.55,4.39 16.84,4 16,4C15.19,4 14.36,4.36 14,4.87L13.78,20H16.66L17.85,4.93M10,4.87C9.64,4.36 8.81,4 8,4C7.16,4 6.45,4.39 6.15,4.93L7.34,20H10.22L10,4.87Z"/></svg>',
'pot': '<svg class="ik" style="--ik-l:#546E7A;--ik-d:#AAB6BC" viewBox="0 0 24 24" aria-hidden="true" focusable="false"><path d="M19 19C19 20.1 18.1 21 17 21H7C5.9 21 5 20.1 5 19V12H3V10H21V12H19V19Z"/></svg>',
'pulse': '<svg class="ik" style="--ik-l:#E53935;--ik-d:#F29C9A" viewBox="0 0 24 24" aria-hidden="true" focusable="false"><path d="M3,13H5.79L10.1,4.79L11.28,13.75L14.5,9.66L17.83,13H21V15H17L14.67,12.67L9.92,18.73L8.94,11.31L7,15H3V13Z"/></svg>',
'pyramid': '<svg class="ik" style="--ik-l:#C49A2C;--ik-d:#C49A2C" viewBox="0 0 24 24" aria-hidden="true" focusable="false"><path d="M21.85 16.96H21.85L12.85 2.47C12.65 2.16 12.33 2 12 2S11.35 2.16 11.15 2.47L2.15 16.96H2.15C1.84 17.45 2 18.18 2.64 18.43L11.64 21.93C11.75 22 11.88 22 12 22S12.25 22 12.36 21.93L21.36 18.43C22 18.18 22.16 17.45 21.85 16.96M11 6.5V13.32L5.42 15.5L11 6.5M12 19.93L5.76 17.5L12 15.07L18.24 17.5L12 19.93M13 13.32V6.5L18.58 15.5L13 13.32Z"/></svg>',
'quadcopter': '<svg class="ik" style="--ik-l:#546E7A;--ik-d:#AAB6BC" viewBox="0 0 24 24" aria-hidden="true" focusable="false"><path d="M5.5,1C8,1 10,3 10,5.5C10,6.38 9.75,7.2 9.31,7.9L9.41,8H14.59L14.69,7.9C14.25,7.2 14,6.38 14,5.5C14,3 16,1 18.5,1C21,1 23,3 23,5.5C23,8 21,10 18.5,10C17.62,10 16.8,9.75 16.1,9.31L15,10.41V13.59L16.1,14.69C16.8,14.25 17.62,14 18.5,14C21,14 23,16 23,18.5C23,21 21,23 18.5,23C16,23 14,21 14,18.5C14,17.62 14.25,16.8 14.69,16.1L14.59,16H9.41L9.31,16.1C9.75,16.8 10,17.62 10,18.5C10,21 8,23 5.5,23C3,23 1,21 1,18.5C1,16 3,14 5.5,14C6.38,14 7.2,14.25 7.9,14.69L9,13.59V10.41L7.9,9.31C7.2,9.75 6.38,10 5.5,10C3,10 1,8 1,5.5C1,3 3,1 5.5,1M5.5,3A2.5,2.5 0 0,0 3,5.5A2.5,2.5 0 0,0 5.5,8A2.5,2.5 0 0,0 8,5.5A2.5,2.5 0 0,0 5.5,3M5.5,16A2.5,2.5 0 0,0 3,18.5A2.5,2.5 0 0,0 5.5,21A2.5,2.5 0 0,0 8,18.5A2.5,2.5 0 0,0 5.5,16M18.5,3A2.5,2.5 0 0,0 16,5.5A2.5,2.5 0 0,0 18.5,8A2.5,2.5 0 0,0 21,5.5A2.5,2.5 0 0,0 18.5,3M18.5,16A2.5,2.5 0 0,0 16,18.5A2.5,2.5 0 0,0 18.5,21A2.5,2.5 0 0,0 21,18.5A2.5,2.5 0 0,0 18.5,16M3.91,17.25L5.04,17.91C5.17,17.81 5.33,17.75 5.5,17.75A0.75,0.75 0 0,1 6.25,18.5L6.24,18.6L7.37,19.25L7.09,19.75L5.96,19.09C5.83,19.19 5.67,19.25 5.5,19.25A0.75,0.75 0 0,1 4.75,18.5L4.76,18.4L3.63,17.75L3.91,17.25M3.63,6.25L4.76,5.6L4.75,5.5A0.75,0.75 0 0,1 5.5,4.75C5.67,4.75 5.83,4.81 5.96,4.91L7.09,4.25L7.37,4.75L6.24,5.4L6.25,5.5A0.75,0.75 0 0,1 5.5,6.25C5.33,6.25 5.17,6.19 5.04,6.09L3.91,6.75L3.63,6.25M16.91,4.25L18.04,4.91C18.17,4.81 18.33,4.75 18.5,4.75A0.75,0.75 0 0,1 19.25,5.5L19.24,5.6L20.37,6.25L20.09,6.75L18.96,6.09C18.83,6.19 18.67,6.25 18.5,6.25A0.75,0.75 0 0,1 17.75,5.5L17.76,5.4L16.63,4.75L16.91,4.25M16.63,19.25L17.75,18.5A0.75,0.75 0 0,1 18.5,17.75C18.67,17.75 18.83,17.81 18.96,17.91L20.09,17.25L20.37,17.75L19.25,18.5A0.75,0.75 0 0,1 18.5,19.25C18.33,19.25 18.17,19.19 18.04,19.09L16.91,19.75L16.63,19.25Z"/></svg>',
'radar': '<svg class="ik" style="--ik-l:#2E7D32;--ik-d:#96BE98" viewBox="0 0 24 24" aria-hidden="true" focusable="false"><path d="M19.07,4.93L17.66,6.34C19.1,7.79 20,9.79 20,12A8,8 0 0,1 12,20A8,8 0 0,1 4,12C4,7.92 7.05,4.56 11,4.07V6.09C8.16,6.57 6,9.03 6,12A6,6 0 0,0 12,18A6,6 0 0,0 18,12C18,10.34 17.33,8.84 16.24,7.76L14.83,9.17C15.55,9.9 16,10.9 16,12A4,4 0 0,1 12,16A4,4 0 0,1 8,12C8,10.14 9.28,8.59 11,8.14V10.28C10.4,10.63 10,11.26 10,12A2,2 0 0,0 12,14A2,2 0 0,0 14,12C14,11.26 13.6,10.62 13,10.28V2H12A10,10 0 0,0 2,12A10,10 0 0,0 12,22A10,10 0 0,0 22,12C22,9.24 20.88,6.74 19.07,4.93Z"/></svg>',
'recycle': '<svg class="ik" style="--ik-l:#43A047;--ik-d:#43A047" viewBox="0 0 24 24" aria-hidden="true" focusable="false"><path d="M21.82,15.42L19.32,19.75C18.83,20.61 17.92,21.06 17,21H15V23L12.5,18.5L15,14V16H17.82L15.6,12.15L19.93,9.65L21.73,12.77C22.25,13.54 22.32,14.57 21.82,15.42M9.21,3.06H14.21C15.19,3.06 16.04,3.63 16.45,4.45L17.45,6.19L19.18,5.19L16.54,9.6L11.39,9.69L13.12,8.69L11.71,6.24L9.5,10.09L5.16,7.59L6.96,4.47C7.37,3.64 8.22,3.06 9.21,3.06M5.05,19.76L2.55,15.43C2.06,14.58 2.13,13.56 2.64,12.79L3.64,11.06L1.91,10.06L7.05,10.14L9.7,14.56L7.97,13.56L6.56,16H11V21H7.4C6.47,21.07 5.55,20.61 5.05,19.76Z"/></svg>',
'road-variant': '<svg class="ik" style="--ik-l:#616161;--ik-d:#B0B0B0" viewBox="0 0 24 24" aria-hidden="true" focusable="false"><path d="M18.1,4.8C18,4.3 17.6,4 17.1,4H13L13.2,7H10.8L11,4H6.8C6.3,4 5.9,4.4 5.8,4.8L3.1,18.8C3,19.4 3.5,20 4.1,20H10L10.3,15H13.7L14,20H19.8C20.4,20 20.9,19.4 20.8,18.8L18.1,4.8M10.4,13L10.6,9H13.2L13.4,13H10.4Z"/></svg>',
'robot': '<svg class="ik" style="--ik-l:#78909C;--ik-d:#78909C" viewBox="0 0 24 24" aria-hidden="true" focusable="false"><path d="M12,2A2,2 0 0,1 14,4C14,4.74 13.6,5.39 13,5.73V7H14A7,7 0 0,1 21,14H22A1,1 0 0,1 23,15V18A1,1 0 0,1 22,19H21V20A2,2 0 0,1 19,22H5A2,2 0 0,1 3,20V19H2A1,1 0 0,1 1,18V15A1,1 0 0,1 2,14H3A7,7 0 0,1 10,7H11V5.73C10.4,5.39 10,4.74 10,4A2,2 0 0,1 12,2M7.5,13A2.5,2.5 0 0,0 5,15.5A2.5,2.5 0 0,0 7.5,18A2.5,2.5 0 0,0 10,15.5A2.5,2.5 0 0,0 7.5,13M16.5,13A2.5,2.5 0 0,0 14,15.5A2.5,2.5 0 0,0 16.5,18A2.5,2.5 0 0,0 19,15.5A2.5,2.5 0 0,0 16.5,13Z"/></svg>',
'rocket': '<svg class="ik" style="--ik-l:#D84315;--ik-d:#ECA18A" viewBox="0 0 24 24" aria-hidden="true" focusable="false"><path d="M20 22L16.14 20.45C16.84 18.92 17.34 17.34 17.65 15.73L20 22M7.86 20.45L4 22L6.35 15.73C6.66 17.34 7.16 18.92 7.86 20.45M12 2C12 2 17 4 17 12C17 15.1 16.25 17.75 15.33 19.83C15 20.55 14.29 21 13.5 21H10.5C9.71 21 9 20.55 8.67 19.83C7.76 17.75 7 15.1 7 12C7 4 12 2 12 2M12 12C13.1 12 14 11.1 14 10C14 8.9 13.1 8 12 8C10.9 8 10 8.9 10 10C10 11.1 10.9 12 12 12Z"/></svg>',
'ruler': '<svg class="ik" style="--ik-l:#FFB300;--ik-d:#FFB300" viewBox="0 0 24 24" aria-hidden="true" focusable="false"><path d="M1.39,18.36L3.16,16.6L4.58,18L5.64,16.95L4.22,15.54L5.64,14.12L8.11,16.6L9.17,15.54L6.7,13.06L8.11,11.65L9.53,13.06L10.59,12L9.17,10.59L10.59,9.17L13.06,11.65L14.12,10.59L11.65,8.11L13.06,6.7L14.47,8.11L15.54,7.05L14.12,5.64L15.54,4.22L18,6.7L19.07,5.64L16.6,3.16L18.36,1.39L22.61,5.64L5.64,22.61L1.39,18.36Z"/></svg>',
'ruler-square': '<svg class="ik" style="--ik-l:#FFB300;--ik-d:#FFB300" viewBox="0 0 24 24" aria-hidden="true" focusable="false"><path d="M3,5V21H9V19.5H7V18H9V16.5H5V15H9V13.5H7V12H9V10.5H5V9H9V5H10.5V9H12V7H13.5V9H15V5H16.5V9H18V7H19.5V9H21V3H5A2,2 0 0,0 3,5M6,7A1,1 0 0,1 5,6A1,1 0 0,1 6,5A1,1 0 0,1 7,6A1,1 0 0,1 6,7Z"/></svg>',
'sail-boat': '<svg class="ik" style="--ik-l:#0277BD;--ik-d:#80BBDE" viewBox="0 0 24 24" aria-hidden="true" focusable="false"><path d="M3 13.5L11 2.03V13.5H3M12.5 13.5C13.85 9.75 13.67 4.71 12.5 1C17.26 2.54 20.9 8.4 20.96 13.5H12.5M21.1 17.08C20.69 17.72 20.21 18.27 19.65 18.74C19 18.45 18.42 18 17.96 17.5C16.47 19.43 13.46 19.43 11.97 17.5C10.5 19.43 7.47 19.43 6 17.5C5.5 18 4.95 18.45 4.3 18.74C3.16 17.8 2.3 16.46 2 15H21.94C21.78 15.75 21.5 16.44 21.1 17.08M20.96 23C19.9 23 18.9 22.75 17.96 22.25C16.12 23.25 13.81 23.25 11.97 22.25C10.13 23.25 7.82 23.25 6 22.25C4.77 22.94 3.36 23.05 2 23V21C3.41 21.05 4.77 20.9 6 20C7.74 21.25 10.21 21.25 11.97 20C13.74 21.25 16.2 21.25 17.96 20C19.17 20.9 20.54 21.05 21.94 21V23H20.96Z"/></svg>',
'sausage': '<svg class="ik" style="--ik-l:#A0522D;--ik-d:#D0A896" viewBox="0 0 24 24" aria-hidden="true" focusable="false"><path d="M19 5.3C20.2 5.8 21 7.1 21 8.5C21 15.4 15.4 21 8.5 21C7.1 21 5.9 20.2 5.3 19L3 20.5V14.5L5.3 16C5.9 14.8 7.1 14 8.5 14C11.5 14 14 11.5 14 8.5C14 7.1 14.8 5.9 16 5.3L14.5 3H20.5L19 5.3Z"/></svg>',
'school': '<svg class="ik" style="--ik-l:#283593;--ik-d:#949AC9" viewBox="0 0 24 24" aria-hidden="true" focusable="false"><path d="M12,3L1,9L12,15L21,10.09V17H23V9M5,13.18V17.18L12,21L19,17.18V13.18L12,17L5,13.18Z"/></svg>',
'script': '<svg class="ik" style="--ik-l:#546E7A;--ik-d:#AAB6BC" viewBox="0 0 24 24" aria-hidden="true" focusable="false"><path d="M17.8,20C17.4,21.2 16.3,22 15,22H5C3.3,22 2,20.7 2,19V18H5L14.2,18C14.6,19.2 15.7,20 17,20H17.8M19,2H8C6.3,2 5,3.3 5,5V16H16V17C16,17.6 16.4,18 17,18H18V5C18,4.4 18.4,4 19,4C19.6,4 20,4.4 20,5V6H22V5C22,3.3 20.7,2 19,2Z"/></svg>',
'script-text-outline': '<svg class="ik" style="--ik-l:#546E7A;--ik-d:#AAB6BC" viewBox="0 0 24 24" aria-hidden="true" focusable="false"><path d="M15,20A1,1 0 0,0 16,19V4H8A1,1 0 0,0 7,5V16H5V5A3,3 0 0,1 8,2H19A3,3 0 0,1 22,5V6H20V5A1,1 0 0,0 19,4A1,1 0 0,0 18,5V9L18,19A3,3 0 0,1 15,22H5A3,3 0 0,1 2,19V18H13A2,2 0 0,0 15,20M9,6H14V8H9V6M9,10H14V12H9V10M9,14H14V16H9V14Z"/></svg>',
'server': '<svg class="ik" style="--ik-l:#37474F;--ik-d:#9BA3A7" viewBox="0 0 24 24" aria-hidden="true" focusable="false"><path d="M4,1H20A1,1 0 0,1 21,2V6A1,1 0 0,1 20,7H4A1,1 0 0,1 3,6V2A1,1 0 0,1 4,1M4,9H20A1,1 0 0,1 21,10V14A1,1 0 0,1 20,15H4A1,1 0 0,1 3,14V10A1,1 0 0,1 4,9M4,17H20A1,1 0 0,1 21,18V22A1,1 0 0,1 20,23H4A1,1 0 0,1 3,22V18A1,1 0 0,1 4,17M9,5H10V3H9V5M9,13H10V11H9V13M9,21H10V19H9V21M5,3V5H7V3H5M5,11V13H7V11H5M5,19V21H7V19H5Z"/></svg>',
'shaker': '<svg class="ik" style="--ik-l:#78909C;--ik-d:#78909C" viewBox="0 0 24 24" aria-hidden="true" focusable="false"><path d="M7 16C7 16.55 6.55 17 6 17S5 16.55 5 16C5 15.45 5.45 15 6 15S7 15.45 7 16M9 16C8.45 16 8 16.45 8 17S8.45 18 9 18 10 17.55 10 17 9.55 16 9 16M4 18C3.45 18 3 18.45 3 19S3.45 20 4 20 5 19.55 5 19 4.55 18 4 18M7 19C6.45 19 6 19.45 6 20S6.45 21 7 21 8 20.55 8 20 7.55 19 7 19M15.33 2.72L9.8 9.65L13.34 13.19L20.28 7.67C21.18 6.91 21.25 5.54 20.41 4.7L18.3 2.59C17.46 1.75 16.09 1.82 15.33 2.72M8.39 12.5L10.5 14.6C10.9 15 11.54 15 11.93 14.6L12.63 13.9L9.1 10.36L8.39 11.07C8 11.46 8 12.09 8.39 12.5Z"/></svg>',
'shaker-outline': '<svg class="ik" style="--ik-l:#78909C;--ik-d:#78909C" viewBox="0 0 24 24" aria-hidden="true" focusable="false"><path d="M16.88 4L16.88 4L19.03 6.1L13.5 10.5L12.5 9.5L16.87 4L16.88 4M16.88 2C16.3 2 15.73 2.24 15.33 2.72L9.8 9.65L13.34 13.19L20.28 7.67C21.18 6.91 21.25 5.54 20.41 4.7L18.3 2.59C17.9 2.19 17.39 2 16.88 2M9.1 10.36L8.39 11.07C8 11.46 8 12.09 8.39 12.5L10.5 14.6C10.71 14.8 10.96 14.89 11.22 14.89S11.73 14.8 11.93 14.6L12.63 13.9L9.1 10.36M6 15C5.45 15 5 15.45 5 16C5 16.55 5.45 17 6 17C6.55 17 7 16.55 7 16C7 15.45 6.55 15 6 15M9 16C8.45 16 8 16.45 8 17S8.45 18 9 18C9.55 18 10 17.55 10 17S9.55 16 9 16M4 18C3.45 18 3 18.45 3 19S3.45 20 4 20C4.55 20 5 19.55 5 19S4.55 18 4 18M7 19C6.45 19 6 19.45 6 20S6.45 21 7 21C7.55 21 8 20.55 8 20S7.55 19 7 19Z"/></svg>',
'shape': '<svg class="ik" style="--ik-l:#42A5F5;--ik-d:#42A5F5" viewBox="0 0 24 24" aria-hidden="true" focusable="false"><path d="M11,13.5V21.5H3V13.5H11M12,2L17.5,11H6.5L12,2M17.5,13C20,13 22,15 22,17.5C22,20 20,22 17.5,22C15,22 13,20 13,17.5C13,15 15,13 17.5,13Z"/></svg>',
'shape-outline': '<svg class="ik" style="--ik-l:#42A5F5;--ik-d:#42A5F5" viewBox="0 0 24 24" aria-hidden="true" focusable="false"><path d="M11,13.5V21.5H3V13.5H11M9,15.5H5V19.5H9V15.5M12,2L17.5,11H6.5L12,2M12,5.86L10.08,9H13.92L12,5.86M17.5,13C20,13 22,15 22,17.5C22,20 20,22 17.5,22C15,22 13,20 13,17.5C13,15 15,13 17.5,13M17.5,15A2.5,2.5 0 0,0 15,17.5A2.5,2.5 0 0,0 17.5,20A2.5,2.5 0 0,0 20,17.5A2.5,2.5 0 0,0 17.5,15Z"/></svg>',
'share-variant': '<svg class="ik" style="--ik-l:#1E88E5;--ik-d:#1E88E5" viewBox="0 0 24 24" aria-hidden="true" focusable="false"><path d="M18,16.08C17.24,16.08 16.56,16.38 16.04,16.85L8.91,12.7C8.96,12.47 9,12.24 9,12C9,11.76 8.96,11.53 8.91,11.3L15.96,7.19C16.5,7.69 17.21,8 18,8A3,3 0 0,0 21,5A3,3 0 0,0 18,2A3,3 0 0,0 15,5C15,5.24 15.04,5.47 15.09,5.7L8.04,9.81C7.5,9.31 6.79,9 6,9A3,3 0 0,0 3,12A3,3 0 0,0 6,15C6.79,15 7.5,14.69 8.04,14.19L15.16,18.34C15.11,18.55 15.08,18.77 15.08,19C15.08,20.61 16.39,21.91 18,21.91C19.61,21.91 20.92,20.61 20.92,19A2.92,2.92 0 0,0 18,16.08Z"/></svg>',
'shield': '<svg class="ik" style="--ik-l:#546E7A;--ik-d:#AAB6BC" viewBox="0 0 24 24" aria-hidden="true" focusable="false"><path d="M12,1L3,5V11C3,16.55 6.84,21.74 12,23C17.16,21.74 21,16.55 21,11V5L12,1Z"/></svg>',
'shield-bug': '<svg class="ik" style="--ik-l:#2E7D32;--ik-d:#96BE98" viewBox="0 0 24 24" aria-hidden="true" focusable="false"><path d="M11 13H13V14H11V13M21 5V11C21 16.5 17.2 21.7 12 23C6.8 21.7 3 16.5 3 11V5L12 1L21 5M17 10H14.8C14.6 9.4 14.2 8.9 13.7 8.5L14.9 7.3L14.2 6.6L12.8 8H12C11.8 8 11.5 8 11.3 8.1L9.9 6.6L9.1 7.4L10.3 8.6C9.8 8.9 9.4 9.4 9.2 10H7V11H9V12H7V13H9V14H7V15H9.2C9.6 16.2 10.7 17 12 17S14.4 16.2 14.8 15H17V14H15V13H17V12H15V11H17V10M11 12H13V11H11V12Z"/></svg>',
'shield-car': '<svg class="ik" style="--ik-l:#689F38;--ik-d:#689F38" viewBox="0 0 24 24" aria-hidden="true" focusable="false"><path d="M14.42 7.5L16 11H8L9.42 7.5H14.42M9 12C8.45 12 8 12.45 8 13S8.45 14 9 14 10 13.55 10 13 9.55 12 9 12M15 12C14.45 12 14 12.45 14 13S14.45 14 15 14 16 13.55 16 13 15.55 12 15 12M21 5V11C21 16.55 17.16 21.74 12 23C6.84 21.74 3 16.55 3 11V5L12 1L21 5M18 12L15.84 7C15.64 6.42 15.08 6 14.42 6H9.42C8.76 6 8.2 6.42 8 7L6 12V16C6 16.55 6.45 17 7 17H8C8.55 17 9 16.55 9 16V15H15V16C15 16.55 15.45 17 16 17H17C17.55 17 18 16.55 18 16V12Z"/></svg>',
'shield-check': '<svg class="ik" style="--ik-l:#2E7D32;--ik-d:#96BE98" viewBox="0 0 24 24" aria-hidden="true" focusable="false"><path d="M10,17L6,13L7.41,11.59L10,14.17L16.59,7.58L18,9M12,1L3,5V11C3,16.55 6.84,21.74 12,23C17.16,21.74 21,16.55 21,11V5L12,1Z"/></svg>',
'sigma': '<svg class="ik" style="--ik-l:#3949AB;--ik-d:#9CA4D5" viewBox="0 0 24 24" aria-hidden="true" focusable="false"><path d="M18,6H8.83L14.83,12L8.83,18H18V20H6V18L12,12L6,6V4H18V6Z"/></svg>',
'silverware-fork-knife': '<svg class="ik" style="--ik-l:#D84315;--ik-d:#ECA18A" viewBox="0 0 24 24" aria-hidden="true" focusable="false"><path d="M11,9H9V2H7V9H5V2H3V9C3,11.12 4.66,12.84 6.75,12.97V22H9.25V12.97C11.34,12.84 13,11.12 13,9V2H11V9M16,6V14H18.5V22H21V2C18.24,2 16,4.24 16,6Z"/></svg>',
'soccer': '<svg class="ik" style="--ik-l:#2E7D32;--ik-d:#96BE98" viewBox="0 0 24 24" aria-hidden="true" focusable="false"><path d="M16.93 17.12L16.13 15.76L17.59 11.39L19 10.92L20 11.67C20 11.7 20 11.75 20 11.81C20 11.88 20.03 11.94 20.03 12C20.03 13.97 19.37 15.71 18.06 17.21L16.93 17.12M9.75 15L8.38 10.97L12 8.43L15.62 10.97L14.25 15H9.75M12 20.03C11.12 20.03 10.29 19.89 9.5 19.61L8.81 18.1L9.47 17H14.58L15.19 18.1L14.5 19.61C13.71 19.89 12.88 20.03 12 20.03M5.94 17.21C5.41 16.59 4.95 15.76 4.56 14.75C4.17 13.73 3.97 12.81 3.97 12C3.97 11.94 4 11.88 4 11.81C4 11.75 4 11.7 4 11.67L5 10.92L6.41 11.39L7.87 15.76L7.07 17.12L5.94 17.21M11 5.29V6.69L7 9.46L5.66 9.04L5.24 7.68C5.68 7 6.33 6.32 7.19 5.66S8.87 4.57 9.65 4.35L11 5.29M14.35 4.35C15.13 4.57 15.95 5 16.81 5.66C17.67 6.32 18.32 7 18.76 7.68L18.34 9.04L17 9.47L13 6.7V5.29L14.35 4.35M4.93 4.93C3 6.89 2 9.25 2 12S3 17.11 4.93 19.07 9.25 22 12 22 17.11 21 19.07 19.07 22 14.75 22 12 21 6.89 19.07 4.93 14.75 2 12 2 6.89 3 4.93 4.93Z"/></svg>',
'speaker': '<svg class="ik" style="--ik-l:#424242;--ik-d:#A0A0A0" viewBox="0 0 24 24" aria-hidden="true" focusable="false"><path d="M12,12A3,3 0 0,0 9,15A3,3 0 0,0 12,18A3,3 0 0,0 15,15A3,3 0 0,0 12,12M12,20A5,5 0 0,1 7,15A5,5 0 0,1 12,10A5,5 0 0,1 17,15A5,5 0 0,1 12,20M12,4A2,2 0 0,1 14,6A2,2 0 0,1 12,8C10.89,8 10,7.1 10,6C10,4.89 10.89,4 12,4M17,2H7C5.89,2 5,2.89 5,4V20A2,2 0 0,0 7,22H17A2,2 0 0,0 19,20V4C19,2.89 18.1,2 17,2Z"/></svg>',
'spray-bottle': '<svg class="ik" style="--ik-l:#26A69A;--ik-d:#26A69A" viewBox="0 0 24 24" aria-hidden="true" focusable="false"><path d="M16.72 10.43C14.68 8.39 14.5 4.66 14.5 4H13V6H9V4H7C7 2.9 7.9 2 9 2H16V3C16 3.08 16.04 7.63 17.78 9.37L16.72 10.43M17 2V4H18V2H17M15 12C13 10 13 7 13 7H9V9C9 10 9 10 8 11S7 13 7 13V20C7 21.1 7.9 22 9 22H13C14.1 22 15 21.1 15 20V12Z"/></svg>',
'sprout': '<svg class="ik" style="--ik-l:#66BB6A;--ik-d:#66BB6A" viewBox="0 0 24 24" aria-hidden="true" focusable="false"><path d="M2,22V20C2,20 7,18 12,18C17,18 22,20 22,20V22H2M11.3,9.1C10.1,5.2 4,6.1 4,6.1C4,6.1 4.2,13.9 9.9,12.7C9.5,9.8 8,9 8,9C10.8,9 11,12.4 11,12.4V17C11.3,17 11.7,17 12,17C12.3,17 12.7,17 13,17V12.8C13,12.8 13,8.9 16,7.9C16,7.9 14,10.9 14,12.9C21,13.6 21,4 21,4C21,4 12.1,3 11.3,9.1Z"/></svg>',
'star': '<svg class="ik" style="--ik-l:#FFB300;--ik-d:#FFB300" viewBox="0 0 24 24" aria-hidden="true" focusable="false"><path d="M12,17.27L18.18,21L16.54,13.97L22,9.24L14.81,8.62L12,2L9.19,8.62L2,9.24L7.45,13.97L5.82,21L12,17.27Z"/></svg>',
'star-circle': '<svg class="ik" style="--ik-l:#FFB300;--ik-d:#FFB300" viewBox="0 0 24 24" aria-hidden="true" focusable="false"><path d="M16.23,18L12,15.45L7.77,18L8.89,13.19L5.16,9.96L10.08,9.54L12,5L13.92,9.53L18.84,9.95L15.11,13.18L16.23,18M12,2C6.47,2 2,6.5 2,12A10,10 0 0,0 12,22A10,10 0 0,0 22,12A10,10 0 0,0 12,2Z"/></svg>',
'star-four-points': '<svg class="ik" style="--ik-l:#FFB300;--ik-d:#FFB300" viewBox="0 0 24 24" aria-hidden="true" focusable="false"><path d="M12,1L9,9L1,12L9,15L12,23L15,15L23,12L15,9L12,1Z"/></svg>',
'star-shooting': '<svg class="ik" style="--ik-l:#FFCA28;--ik-d:#FFCA28" viewBox="0 0 24 24" aria-hidden="true" focusable="false"><path d="M18.09 11.77L19.56 18.1L14 14.74L8.44 18.1L9.9 11.77L5 7.5L11.47 6.96L14 1L16.53 6.96L23 7.5L18.09 11.77M2 12.43C2.19 12.43 2.38 12.37 2.55 12.26L5.75 10.15L4.18 8.79L1.45 10.59C.989 10.89 .861 11.5 1.16 12C1.36 12.27 1.68 12.43 2 12.43M1.16 21.55C1.36 21.84 1.68 22 2 22C2.19 22 2.38 21.95 2.55 21.84L6.66 19.13L7 17.76L7.31 16.31L1.45 20.16C.989 20.47 .861 21.09 1.16 21.55M1.45 15.38C.989 15.68 .861 16.3 1.16 16.76C1.36 17.06 1.68 17.21 2 17.21C2.19 17.21 2.38 17.16 2.55 17.05L7.97 13.5L8.24 12.31L7.32 11.5L1.45 15.38Z"/></svg>',
'store': '<svg class="ik" style="--ik-l:#00897B;--ik-d:#80C4BD" viewBox="0 0 24 24" aria-hidden="true" focusable="false"><path d="M12,18H6V14H12M21,14V12L20,7H4L3,12V14H4V20H14V14H18V20H20V14M20,4H4V6H20V4Z"/></svg>',
'submarine': '<svg class="ik" style="--ik-l:#263238;--ik-d:#92989C" viewBox="0 0 24 24" aria-hidden="true" focusable="false"><path d="M8 3.67C6.78 4.53 5.39 4.93 4 5H2V7H4C5.37 7 6.74 6.65 8 6C10.5 7.3 13.5 7.3 16 6C17.26 6.65 18.62 6.94 20 7H22V5H20C18.61 5 17.22 4.53 16 3.67C13.56 5.38 10.44 5.38 8 3.67M16 8.67L15 10V12H14L12 14H9L6 16L5 14H4V16L2 17L4 18V20H5.14L6 18L9 20H20A2 2 0 0 0 22 18V16A2 2 0 0 0 20 14H18L17 13V12H16V10H17V8.67Z"/></svg>',
'swap-horizontal': '<svg class="ik" style="--ik-l:#546E7A;--ik-d:#AAB6BC" viewBox="0 0 24 24" aria-hidden="true" focusable="false"><path d="M21,9L17,5V8H10V10H17V13M7,11L3,15L7,19V16H14V14H7V11Z"/></svg>',
'tablet': '<svg class="ik" style="--ik-l:#37474F;--ik-d:#9BA3A7" viewBox="0 0 24 24" aria-hidden="true" focusable="false"><path d="M19,18H5V6H19M21,4H3C1.89,4 1,4.89 1,6V18A2,2 0 0,0 3,20H21A2,2 0 0,0 23,18V6C23,4.89 22.1,4 21,4Z"/></svg>',
'tag': '<svg class="ik" style="--ik-l:#D81B60;--ik-d:#EC8DB0" viewBox="0 0 24 24" aria-hidden="true" focusable="false"><path d="M5.5,7A1.5,1.5 0 0,1 4,5.5A1.5,1.5 0 0,1 5.5,4A1.5,1.5 0 0,1 7,5.5A1.5,1.5 0 0,1 5.5,7M21.41,11.58L12.41,2.58C12.05,2.22 11.55,2 11,2H4C2.89,2 2,2.89 2,4V11C2,11.55 2.22,12.05 2.59,12.41L11.58,21.41C11.95,21.77 12.45,22 13,22C13.55,22 14.05,21.77 14.41,21.41L21.41,14.41C21.78,14.05 22,13.55 22,13C22,12.44 21.77,11.94 21.41,11.58Z"/></svg>',
'tank': '<svg class="ik" style="--ik-l:#558B2F;--ik-d:#AAC597" viewBox="0 0 24 24" aria-hidden="true" focusable="false"><path d="M20,12H4V11H6L7,6H12L13,11H20V12M13.22,7L13.62,9H22V7H13.22M22,16A3,3 0 0,1 19,19H5A3,3 0 0,1 2,16A3,3 0 0,1 5,13H19A3,3 0 0,1 22,16M6,16A1,1 0 0,0 5,15A1,1 0 0,0 4,16A1,1 0 0,0 5,17A1,1 0 0,0 6,16M13,16A1,1 0 0,0 12,15A1,1 0 0,0 11,16A1,1 0 0,0 12,17A1,1 0 0,0 13,16M20,16A1,1 0 0,0 19,15A1,1 0 0,0 18,16A1,1 0 0,0 19,17A1,1 0 0,0 20,16Z"/></svg>',
'telescope': '<svg class="ik" style="--ik-l:#546E7A;--ik-d:#AAB6BC" viewBox="0 0 24 24" aria-hidden="true" focusable="false"><path d="M21.9,8.9L20.2,9.9L16.2,3L17.9,2L21.9,8.9M9.8,7.9L12.8,13.1L18.9,9.6L15.9,4.4L9.8,7.9M11.4,12.7L9.4,9.2L5.1,11.7L7.1,15.2L11.4,12.7M2.1,14.6L3.1,16.3L5.7,14.8L4.7,13.1L2.1,14.6M12.1,14L11.8,13.6L7.5,16.1L7.8,16.5C8,16.8 8.3,17.1 8.6,17.3L7,22H9L10.4,17.7H10.5L12,22H14L12.1,16.4C12.6,15.7 12.6,14.8 12.1,14Z"/></svg>',
'television': '<svg class="ik" style="--ik-l:#37474F;--ik-d:#9BA3A7" viewBox="0 0 24 24" aria-hidden="true" focusable="false"><path d="M21,17H3V5H21M21,3H3A2,2 0 0,0 1,5V17A2,2 0 0,0 3,19H8V21H16V19H21A2,2 0 0,0 23,17V5A2,2 0 0,0 21,3Z"/></svg>',
'television-classic': '<svg class="ik" style="--ik-l:#5D4037;--ik-d:#AEA09B" viewBox="0 0 24 24" aria-hidden="true" focusable="false"><path d="M8.16,3L6.75,4.41L9.34,7H4C2.89,7 2,7.89 2,9V19C2,20.11 2.89,21 4,21H20C21.11,21 22,20.11 22,19V9C22,7.89 21.11,7 20,7H14.66L17.25,4.41L15.84,3L12,6.84L8.16,3M4,9H17V19H4V9M19.5,9A1,1 0 0,1 20.5,10A1,1 0 0,1 19.5,11A1,1 0 0,1 18.5,10A1,1 0 0,1 19.5,9M19.5,12A1,1 0 0,1 20.5,13A1,1 0 0,1 19.5,14A1,1 0 0,1 18.5,13A1,1 0 0,1 19.5,12Z"/></svg>',
'temple-buddhist': '<svg class="ik" style="--ik-l:#D84315;--ik-d:#ECA18A" viewBox="0 0 24 24" aria-hidden="true" focusable="false"><path d="M21 9C21 10.1 20.1 11 19 11H5C3.9 11 3 10.1 3 9H1C1 10.9 2.3 12.4 4 12.8V22H10V19C10 17.9 10.9 17 12 17S14 17.9 14 19V22H20V12.9C20.5 12.8 23 11.9 23 9H21M6 8.9V10H18V8.9C18.5 8.8 21 7.9 21 5H19C19 6.1 18.1 7 17 7H7C5.9 7 5 6.1 5 5H3C3 6.9 4.3 8.4 6 8.9M12 1L8.2 6H15.7L12 1Z"/></svg>',
'terrain': '<svg class="ik" style="--ik-l:#6D8B3A;--ik-d:#6D8B3A" viewBox="0 0 24 24" aria-hidden="true" focusable="false"><path d="M14,6L10.25,11L13.1,14.8L11.5,16C9.81,13.75 7,10 7,10L1,18H23L14,6Z"/></svg>',
'theater': '<svg class="ik" style="--ik-l:#6A1B9A;--ik-d:#B48DCC" viewBox="0 0 24 24" aria-hidden="true" focusable="false"><path d="M4,15H6A2,2 0 0,1 8,17V19H9V17A2,2 0 0,1 11,15H13A2,2 0 0,1 15,17V19H16V17A2,2 0 0,1 18,15H20A2,2 0 0,1 22,17V19H23V22H1V19H2V17A2,2 0 0,1 4,15M11,7L15,10L11,13V7M4,2H20A2,2 0 0,1 22,4V13.54C21.41,13.19 20.73,13 20,13V4H4V13C3.27,13 2.59,13.19 2,13.54V4A2,2 0 0,1 4,2Z"/></svg>',
'thermometer': '<svg class="ik" style="--ik-l:#E53935;--ik-d:#F29C9A" viewBox="0 0 24 24" aria-hidden="true" focusable="false"><path d="M15 13V5A3 3 0 0 0 9 5V13A5 5 0 1 0 15 13M12 4A1 1 0 0 1 13 5V8H11V5A1 1 0 0 1 12 4Z"/></svg>',
'train': '<svg class="ik" style="--ik-l:#37474F;--ik-d:#9BA3A7" viewBox="0 0 24 24" aria-hidden="true" focusable="false"><path d="M12,2C8,2 4,2.5 4,6V15.5A3.5,3.5 0 0,0 7.5,19L6,20.5V21H8.23L10.23,19H14L16,21H18V20.5L16.5,19A3.5,3.5 0 0,0 20,15.5V6C20,2.5 16.42,2 12,2M7.5,17A1.5,1.5 0 0,1 6,15.5A1.5,1.5 0 0,1 7.5,14A1.5,1.5 0 0,1 9,15.5A1.5,1.5 0 0,1 7.5,17M11,10H6V6H11V10M13,10V6H18V10H13M16.5,17A1.5,1.5 0 0,1 15,15.5A1.5,1.5 0 0,1 16.5,14A1.5,1.5 0 0,1 18,15.5A1.5,1.5 0 0,1 16.5,17Z"/></svg>',
'tree': '<svg class="ik" style="--ik-l:#2E7D32;--ik-d:#96BE98" viewBox="0 0 24 24" aria-hidden="true" focusable="false"><path d="M11,21V16.74C10.53,16.91 10.03,17 9.5,17C7,17 5,15 5,12.5C5,11.23 5.5,10.09 6.36,9.27C6.13,8.73 6,8.13 6,7.5C6,5 8,3 10.5,3C12.06,3 13.44,3.8 14.25,5C14.33,5 14.41,5 14.5,5A5.5,5.5 0 0,1 20,10.5A5.5,5.5 0 0,1 14.5,16C14,16 13.5,15.93 13,15.79V21H11Z"/></svg>',
'triangle-outline': '<svg class="ik" style="--ik-l:#5C6BC0;--ik-d:#AEB5E0" viewBox="0 0 24 24" aria-hidden="true" focusable="false"><path d="M12,2L1,21H23M12,6L19.53,19H4.47"/></svg>',
'trophy': '<svg class="ik" style="--ik-l:#F9A825;--ik-d:#F9A825" viewBox="0 0 24 24" aria-hidden="true" focusable="false"><path d="M18 2C17.1 2 16 3 16 4H8C8 3 6.9 2 6 2H2V11C2 12 3 13 4 13H6.2C6.6 15 7.9 16.7 11 17V19.08C8 19.54 8 22 8 22H16C16 22 16 19.54 13 19.08V17C16.1 16.7 17.4 15 17.8 13H20C21 13 22 12 22 11V2H18M6 11H4V4H6V11M20 11H18V4H20V11Z"/></svg>',
'tshirt-crew': '<svg class="ik" style="--ik-l:#00ACC1;--ik-d:#00ACC1" viewBox="0 0 24 24" aria-hidden="true" focusable="false"><path d="M16,21H8A1,1 0 0,1 7,20V12.07L5.7,13.07C5.31,13.46 4.68,13.46 4.29,13.07L1.46,10.29C1.07,9.9 1.07,9.27 1.46,8.88L7.34,3H9C9,4.1 10.34,5 12,5C13.66,5 15,4.1 15,3H16.66L22.54,8.88C22.93,9.27 22.93,9.9 22.54,10.29L19.71,13.12C19.32,13.5 18.69,13.5 18.3,13.12L17,12.12V20A1,1 0 0,1 16,21"/></svg>',
'video': '<svg class="ik" style="--ik-l:#263238;--ik-d:#92989C" viewBox="0 0 24 24" aria-hidden="true" focusable="false"><path d="M17,10.5V7A1,1 0 0,0 16,6H4A1,1 0 0,0 3,7V17A1,1 0 0,0 4,18H16A1,1 0 0,0 17,17V13.5L21,17.5V6.5L17,10.5Z"/></svg>',
'view-column': '<svg class="ik" style="--ik-l:#78909C;--ik-d:#78909C" viewBox="0 0 24 24" aria-hidden="true" focusable="false"><path d="M16,5V18H21V5M4,18H9V5H4M10,18H15V5H10V18Z"/></svg>',
'view-grid': '<svg class="ik" style="--ik-l:#00897B;--ik-d:#80C4BD" viewBox="0 0 24 24" aria-hidden="true" focusable="false"><path d="M3,11H11V3H3M3,21H11V13H3M13,21H21V13H13M13,3V11H21V3"/></svg>',
'virtual-reality': '<svg class="ik" style="--ik-l:#7E57C2;--ik-d:#BEABE0" viewBox="0 0 24 24" aria-hidden="true" focusable="false"><path d="M5,3C3.89,3 3,3.9 3,5V19A2,2 0 0,0 5,21H19A2,2 0 0,0 21,19V5A2,2 0 0,0 19,3H5M6,9H7.5L8.5,12.43L9.5,9H11L9.25,15H7.75L6,9M13,9H16.5C17.35,9 18,9.65 18,10.5V11.5C18,12.1 17.6,12.65 17.1,12.9L18,15H16.5L15.65,13H14.5V15H13V9M14.5,10.5V11.5H16.5V10.5H14.5Z"/></svg>',
'volcano': '<svg class="ik" style="--ik-l:#E64A19;--ik-d:#F2A48C" viewBox="0 0 24 24" aria-hidden="true" focusable="false"><path d="M18 8H11L9 13H6L2 22H22L18 8M13 1H15V5H13V1M16.12 5.47L18.95 2.64L20.36 4.05L17.54 6.88L16.12 5.47M7.64 4.05L9.05 2.64L11.88 5.46L10.47 6.88L7.64 4.05Z"/></svg>',
'watch': '<svg class="ik" style="--ik-l:#212121;--ik-d:#909090" viewBox="0 0 24 24" aria-hidden="true" focusable="false"><path d="M6,12A6,6 0 0,1 12,6A6,6 0 0,1 18,12A6,6 0 0,1 12,18A6,6 0 0,1 6,12M20,12C20,9.45 18.81,7.19 16.95,5.73L16,0H8L7.05,5.73C5.19,7.19 4,9.45 4,12C4,14.54 5.19,16.81 7.05,18.27L8,24H16L16.95,18.27C18.81,16.81 20,14.54 20,12Z"/></svg>',
'waves': '<svg class="ik" style="--ik-l:#0277BD;--ik-d:#80BBDE" viewBox="0 0 24 24" aria-hidden="true" focusable="false"><path d="M20,12H22V14H20C18.62,14 17.26,13.65 16,13C13.5,14.3 10.5,14.3 8,13C6.74,13.65 5.37,14 4,14H2V12H4C5.39,12 6.78,11.53 8,10.67C10.44,12.38 13.56,12.38 16,10.67C17.22,11.53 18.61,12 20,12M20,6H22V8H20C18.62,8 17.26,7.65 16,7C13.5,8.3 10.5,8.3 8,7C6.74,7.65 5.37,8 4,8H2V6H4C5.39,6 6.78,5.53 8,4.67C10.44,6.38 13.56,6.38 16,4.67C17.22,5.53 18.61,6 20,6M20,18H22V20H20C18.62,20 17.26,19.65 16,19C13.5,20.3 10.5,20.3 8,19C6.74,19.65 5.37,20 4,20H2V18H4C5.39,18 6.78,17.53 8,16.67C10.44,18.38 13.56,18.38 16,16.67C17.22,17.53 18.61,18 20,18Z"/></svg>',
'weather-cloudy': '<svg class="ik" style="--ik-l:#90A4AE;--ik-d:#90A4AE" viewBox="0 0 24 24" aria-hidden="true" focusable="false"><path d="M6,19A5,5 0 0,1 1,14A5,5 0 0,1 6,9C7,6.65 9.3,5 12,5C15.43,5 18.24,7.66 18.5,11.03L19,11A4,4 0 0,1 23,15A4,4 0 0,1 19,19H6M19,13H17V12A5,5 0 0,0 12,7C9.5,7 7.45,8.82 7.06,11.19C6.73,11.07 6.37,11 6,11A3,3 0 0,0 3,14A3,3 0 0,0 6,17H19A2,2 0 0,0 21,15A2,2 0 0,0 19,13Z"/></svg>',
'weather-night': '<svg class="ik" style="--ik-l:#3949AB;--ik-d:#9CA4D5" viewBox="0 0 24 24" aria-hidden="true" focusable="false"><path d="M17.75,4.09L15.22,6.03L16.13,9.09L13.5,7.28L10.87,9.09L11.78,6.03L9.25,4.09L12.44,4L13.5,1L14.56,4L17.75,4.09M21.25,11L19.61,12.25L20.2,14.23L18.5,13.06L16.8,14.23L17.39,12.25L15.75,11L17.81,10.95L18.5,9L19.19,10.95L21.25,11M18.97,15.95C19.8,15.87 20.69,17.05 20.16,17.8C19.84,18.25 19.5,18.67 19.08,19.07C15.17,23 8.84,23 4.94,19.07C1.03,15.17 1.03,8.83 4.94,4.93C5.34,4.53 5.76,4.17 6.21,3.85C6.96,3.32 8.14,4.21 8.06,5.04C7.79,7.9 8.75,10.87 10.95,13.06C13.14,15.26 16.1,16.22 18.97,15.95M17.33,17.97C14.5,17.81 11.7,16.64 9.53,14.5C7.36,12.31 6.2,9.5 6.04,6.68C3.23,9.82 3.34,14.64 6.35,17.66C9.37,20.67 14.19,20.78 17.33,17.97Z"/></svg>',
'weather-sunset-up': '<svg class="ik" style="--ik-l:#FF8F00;--ik-d:#FF8F00" viewBox="0 0 24 24" aria-hidden="true" focusable="false"><path d="M3,12H7A5,5 0 0,1 12,7A5,5 0 0,1 17,12H21A1,1 0 0,1 22,13A1,1 0 0,1 21,14H3A1,1 0 0,1 2,13A1,1 0 0,1 3,12M15,12A3,3 0 0,0 12,9A3,3 0 0,0 9,12H15M12,2L14.39,5.42C13.65,5.15 12.84,5 12,5C11.16,5 10.35,5.15 9.61,5.42L12,2M3.34,7L7.5,6.65C6.9,7.16 6.36,7.78 5.94,8.5C5.5,9.24 5.25,10 5.11,10.79L3.34,7M20.65,7L18.88,10.79C18.74,10 18.47,9.23 18.05,8.5C17.63,7.78 17.1,7.15 16.5,6.64L20.65,7M12.71,16.3L15.82,19.41C16.21,19.8 16.21,20.43 15.82,20.82C15.43,21.21 14.8,21.21 14.41,20.82L12,18.41L9.59,20.82C9.2,21.21 8.57,21.21 8.18,20.82C7.79,20.43 7.79,19.8 8.18,19.41L11.29,16.3C11.5,16.1 11.74,16 12,16C12.26,16 12.5,16.1 12.71,16.3Z"/></svg>',
'web': '<svg class="ik" style="--ik-l:#1E88E5;--ik-d:#1E88E5" viewBox="0 0 24 24" aria-hidden="true" focusable="false"><path d="M16.36,14C16.44,13.34 16.5,12.68 16.5,12C16.5,11.32 16.44,10.66 16.36,10H19.74C19.9,10.64 20,11.31 20,12C20,12.69 19.9,13.36 19.74,14M14.59,19.56C15.19,18.45 15.65,17.25 15.97,16H18.92C17.96,17.65 16.43,18.93 14.59,19.56M14.34,14H9.66C9.56,13.34 9.5,12.68 9.5,12C9.5,11.32 9.56,10.65 9.66,10H14.34C14.43,10.65 14.5,11.32 14.5,12C14.5,12.68 14.43,13.34 14.34,14M12,19.96C11.17,18.76 10.5,17.43 10.09,16H13.91C13.5,17.43 12.83,18.76 12,19.96M8,8H5.08C6.03,6.34 7.57,5.06 9.4,4.44C8.8,5.55 8.35,6.75 8,8M5.08,16H8C8.35,17.25 8.8,18.45 9.4,19.56C7.57,18.93 6.03,17.65 5.08,16M4.26,14C4.1,13.36 4,12.69 4,12C4,11.31 4.1,10.64 4.26,10H7.64C7.56,10.66 7.5,11.32 7.5,12C7.5,12.68 7.56,13.34 7.64,14M12,4.03C12.83,5.23 13.5,6.57 13.91,8H10.09C10.5,6.57 11.17,5.23 12,4.03M18.92,8H15.97C15.65,6.75 15.19,5.55 14.59,4.44C16.43,5.07 17.96,6.34 18.92,8M12,2C6.47,2 2,6.5 2,12A10,10 0 0,0 12,22A10,10 0 0,0 22,12A10,10 0 0,0 12,2Z"/></svg>',
'wifi': '<svg class="ik" style="--ik-l:#0097A7;--ik-d:#0097A7" viewBox="0 0 24 24" aria-hidden="true" focusable="false"><path d="M12,21L15.6,16.2C14.6,15.45 13.35,15 12,15C10.65,15 9.4,15.45 8.4,16.2L12,21M12,3C7.95,3 4.21,4.34 1.2,6.6L3,9C5.5,7.12 8.62,6 12,6C15.38,6 18.5,7.12 21,9L22.8,6.6C19.79,4.34 16.05,3 12,3M12,9C9.3,9 6.81,9.89 4.8,11.4L6.6,13.8C8.1,12.67 9.97,12 12,12C14.03,12 15.9,12.67 17.4,13.8L19.2,11.4C17.19,9.89 14.7,9 12,9Z"/></svg>',
'zodiac-aquarius': '<svg class="ik" style="--ik-l:#29B6F6;--ik-d:#29B6F6" viewBox="0 0 24 24" aria-hidden="true" focusable="false"><path d="M15,12.41L12,9.41L9,12.41L6,9.41L3.71,11.71L2.29,10.29L6,6.59L9,9.59L12,6.59L15,9.59L18,6.59L21.71,10.29L20.29,11.71L18,9.41L15,12.41M18,15.41L20.29,17.71L21.71,16.29L18,12.59L15,15.59L12,12.59L9,15.59L6,12.59L2.29,16.29L3.71,17.71L6,15.41L9,18.41L12,15.41L15,18.41L18,15.41Z"/></svg>',
'zodiac-aries': '<svg class="ik" style="--ik-l:#E53935;--ik-d:#F29C9A" viewBox="0 0 24 24" aria-hidden="true" focusable="false"><path d="M16,2C14.95,2 13.91,2.27 13,2.81C12.64,3 12.3,3.26 12,3.54C11.7,3.26 11.36,3 11,2.81C10.09,2.27 9.05,2 8,2A6,6 0 0,0 2,8A6,6 0 0,0 8,14V12A4,4 0 0,1 4,8A4,4 0 0,1 8,4C9,4 10,4.39 10.75,5.1C10.84,5.18 10.92,5.27 11,5.36V22H13V5.36C13.08,5.27 13.16,5.18 13.25,5.1C14.85,3.58 17.38,3.64 18.91,5.25C20.43,6.85 20.36,9.38 18.76,10.9C18,11.61 17.03,12 16,12V14A6,6 0 0,0 22,8A6,6 0 0,0 16,2Z"/></svg>',
'zodiac-cancer': '<svg class="ik" style="--ik-l:#90A4AE;--ik-d:#90A4AE" viewBox="0 0 24 24" aria-hidden="true" focusable="false"><path d="M12,4C6.5,4 2,7.58 2,12C2,14.12 3.65,15.87 5.76,16H6A4,4 0 0,0 10,12A4,4 0 0,0 6,8H5.76C7.44,6.41 9.69,5.55 12,5.6C13.77,5.58 15.5,6.07 17,7L18.25,5.75C16.38,4.58 14.21,3.97 12,4M6,10A2,2 0 0,1 8,12C8,13.11 7.08,14 6,14C4.96,14 4.1,13.22 4,12.2C4,12.07 4,11.93 4,11.8C4.1,10.77 4.97,10 6,10M18.24,8H18A4,4 0 0,0 14,12A4,4 0 0,0 18,16H18.24C16.56,17.59 14.31,18.45 12,18.4C10.23,18.42 8.5,17.93 7,17L5.76,18.24C7.63,19.41 9.79,20 12,20C17.5,20 22,16.42 22,12C22,9.88 20.35,8.13 18.24,8M18,14A2,2 0 0,1 16,12C16,10.89 16.92,10 18,10C19.04,10 19.9,10.78 20,11.8C20,11.93 20,12.07 20,12.2C19.9,13.23 19.03,14 18,14Z"/></svg>',
'zodiac-capricorn': '<svg class="ik" style="--ik-l:#6D4C41;--ik-d:#B6A6A0" viewBox="0 0 24 24" aria-hidden="true" focusable="false"><path d="M15,13C14.3,13 13.61,13.19 13,13.55V6A3,3 0 0,0 10,3C9.25,3 8.55,3.29 8,3.78C7.45,3.28 6.74,3 6,3V5A1,1 0 0,1 7,6V16H9V6A1,1 0 0,1 10,5A1,1 0 0,1 11,6V17A2,2 0 0,1 9,19V21C10.15,21 11.25,20.5 12,19.62C13.45,21.29 15.97,21.47 17.64,20C19.31,18.58 19.5,16.05 18.04,14.38C17.28,13.5 16.17,13 15,13M15,19A2,2 0 0,1 13,17A2,2 0 0,1 15,15A2,2 0 0,1 17,17A2,2 0 0,1 15,19Z"/></svg>',
'zodiac-gemini': '<svg class="ik" style="--ik-l:#FDD835;--ik-d:#FDD835" viewBox="0 0 24 24" aria-hidden="true" focusable="false"><path d="M18,5.3C19.35,4.97 20.66,4.54 21.94,4L21.18,2.14C18.27,3.36 15.15,4 12,4C8.85,4 5.73,3.38 2.82,2.17L2.06,4C3.34,4.54 4.65,4.97 6,5.3V18.7C4.65,19.03 3.34,19.46 2.06,20L2.82,21.86C8.7,19.42 15.3,19.42 21.18,21.86L21.94,20C20.66,19.46 19.35,19.03 18,18.7V5.3M8,18.3V5.69C9.32,5.89 10.66,6 12,6C13.34,6 14.68,5.89 16,5.69V18.31C13.35,17.9 10.65,17.9 8,18.31V18.3Z"/></svg>',
'zodiac-leo': '<svg class="ik" style="--ik-l:#FB8C00;--ik-d:#FB8C00" viewBox="0 0 24 24" aria-hidden="true" focusable="false"><path d="M20,17A3,3 0 0,1 17,20C15.38,19.92 14.08,18.62 14,17C14.16,15.39 14.5,13.8 15,12.26C15.54,10.55 15.87,8.79 16,7C15.93,4.27 13.73,2.07 11,2C8.27,2.07 6.07,4.27 6,7C6.15,8.53 6.5,10.03 7,11.5L7.21,12.2C5.1,11.53 2.86,12.7 2.19,14.8C1.5,16.91 2.68,19.16 4.79,19.83C6.9,20.5 9.14,19.33 9.81,17.22C9.94,16.83 10,16.41 10,16C9.84,14.27 9.5,12.56 8.91,10.92C8.47,9.65 8.16,8.34 8,7C8.08,5.38 9.38,4.08 11,4C12.62,4.08 13.92,5.38 14,7C13.84,8.61 13.5,10.2 13,11.74C12.46,13.45 12.13,15.21 12,17C12.07,19.73 14.27,21.93 17,22A5,5 0 0,0 22,17H20M6,18A2,2 0 0,1 4,16A2,2 0 0,1 6,14A2,2 0 0,1 8,16A2,2 0 0,1 6,18Z"/></svg>',
'zodiac-libra': '<svg class="ik" style="--ik-l:#EC407A;--ik-d:#EC407A" viewBox="0 0 24 24" aria-hidden="true" focusable="false"><path d="M20,16V18H13V15.91C16,15.36 17.96,12.5 17.41,9.5C16.86,6.5 14,4.54 11,5.09C8,5.65 6.04,8.5 6.59,11.5C7,13.74 8.76,15.5 11,15.91V18H4V16H6.92C5.37,14.59 4.5,12.59 4.5,10.5A7.5,7.5 0 0,1 12,3A7.5,7.5 0 0,1 19.5,10.5C19.5,12.59 18.63,14.59 17.08,16H20M20,19H4V21H20V19Z"/></svg>',
'zodiac-pisces': '<svg class="ik" style="--ik-l:#26A69A;--ik-d:#26A69A" viewBox="0 0 24 24" aria-hidden="true" focusable="false"><path d="M20,11H18C18.11,8.19 18.73,5.42 19.81,2.82L18,2.06C16.81,4.9 16.13,7.92 16,11H8C7.87,7.92 7.19,4.9 6,2.06L4.14,2.82C5.24,5.41 5.87,8.18 6,11H4V13H6C5.89,15.81 5.27,18.58 4.19,21.18L6,21.94C7.19,19.1 7.87,16.08 8,13H16C16.13,16.08 16.81,19.1 18,21.94L19.86,21.18C18.76,18.59 18.13,15.82 18,13H20V11Z"/></svg>',
'zodiac-sagittarius': '<svg class="ik" style="--ik-l:#8E24AA;--ik-d:#C692D4" viewBox="0 0 24 24" aria-hidden="true" focusable="false"><path d="M22,2V12H20V5.41L10.41,15L12.71,17.29L11.29,18.71L9,16.41L3.71,21.71L2.29,20.29L7.59,15L5.29,12.71L6.71,11.29L9,13.59L18.59,4H12V2H22Z"/></svg>',
'zodiac-scorpio': '<svg class="ik" style="--ik-l:#B71C1C;--ik-d:#DB8E8E" viewBox="0 0 24 24" aria-hidden="true" focusable="false"><path d="M17.71,15.29L16.29,16.71L17.59,18H16A2,2 0 0,1 14,16V6A3,3 0 0,0 11,3C10.25,3 9.55,3.29 9,3.78C7.86,2.76 6.14,2.76 5,3.78C4.45,3.28 3.74,3 3,3V5A1,1 0 0,1 4,6V16H6V6A1,1 0 0,1 7,5A1,1 0 0,1 8,6V16H10V6A1,1 0 0,1 11,5A1,1 0 0,1 12,6V16A4,4 0 0,0 16,20H17.59L16.29,21.29L17.71,22.71L21.41,19L17.71,15.29Z"/></svg>',
'zodiac-taurus': '<svg class="ik" style="--ik-l:#43A047;--ik-d:#43A047" viewBox="0 0 24 24" aria-hidden="true" focusable="false"><path d="M15.59,9C17.7,7.74 19,5.46 19,3H17A5,5 0 0,1 12,8A5,5 0 0,1 7,3H5C5,5.46 6.3,7.74 8.41,9C5.09,11 4,15.28 6,18.6C7.97,21.92 12.27,23 15.59,21C18.91,19.04 20,14.74 18,11.42C17.42,10.43 16.58,9.59 15.59,9M12,20A5,5 0 0,1 7,15A5,5 0 0,1 12,10A5,5 0 0,1 17,15A5,5 0 0,1 12,20Z"/></svg>',
'zodiac-virgo': '<svg class="ik" style="--ik-l:#7CB342;--ik-d:#7CB342" viewBox="0 0 24 24" aria-hidden="true" focusable="false"><path d="M18.5,19.13C20,17.77 20,15.18 20,14A4,4 0 0,0 16,10C15.3,10 14.6,10.2 14,10.56V6A3,3 0 0,0 11,3C10.25,3 9.55,3.29 9,3.78C7.86,2.76 6.14,2.76 5,3.78C4.45,3.28 3.74,3 3,3V5A1,1 0 0,1 4,6V16H6V6A1,1 0 0,1 7,5A1,1 0 0,1 8,6V16H10V6A1,1 0 0,1 11,5A1,1 0 0,1 12,6V14C12,15.18 12,17.77 13.5,19.13C12.72,19.54 11.88,19.84 11,20V22C12.29,22 14.84,20.74 16,20.13C17.16,20.74 19.71,22 21,22V20C20.12,19.84 19.28,19.54 18.5,19.13M16,12A2,2 0 0,1 18,14C18,16.92 17.46,18 16,18C14.54,18 14,16.92 14,14A2,2 0 0,1 16,12Z"/></svg>'
};
const KITA_IKON = { 'Avrupa': 'castle', 'Asya': 'temple-buddhist', 'Afrika': 'pyramid', 'Kuzey Amerika': 'city-variant', 'Güney Amerika': 'terrain', 'Okyanusya': 'island', 'Antarktika': 'bayrak_aq' };
const YEDEK_BAYRAK = 'https://raw.githubusercontent.com/haberlerver/flags-svg/main/';
const PLAIN = function(etiket){ return '/search/label/' + encodeURIComponent(etiket); };
const N = function(ad, ikon, cocuk, o){ return Object.assign({ ad: ad, ikon: ikon, cocuk: cocuk }, o || {}); };
const Y = function(ad, ikon, etiket){ return { ad: ad, ikon: ikon, etiket: etiket }; };
const K = function(ad, kita, sonek, o){ return Object.assign({ ad: ad, tip: 'ulke-liste', kita: kita, sonek: sonek || '' }, o || {}); };
const T = function(ad, sonek){ return { ad: ad, tip: 'ulke-tum', sonek: sonek || '' }; };
const VARSAYILAN_KATEGORILER = [
{ ad: 'Dünya', etiket: '_Dünya', ikon: 'dunya', aciklama: 'Dünya gündemi ve uluslararası gelişmeler' },
{ ad: 'Ekonomi', etiket: '_Ekonomi', ikon: 'ekonomi', aciklama: 'Ekonomi, piyasalar ve şirketler' },
{ ad: 'Teknoloji', etiket: '_Teknoloji', ikon: 'teknoloji', aciklama: 'Teknoloji ve dijital dünya' },
{ ad: 'Bilim', etiket: '_Bilim', ikon: 'bilim', aciklama: 'Bilimsel gelişmeler ve keşifler' },
{ ad: 'Tarih', etiket: '_Tarih', ikon: 'tarih', aciklama: 'Tarih, uygarlıklar ve kültürel miras' },
{ ad: 'Gezilecek Yerler', etiket: '_Gezilecek Yerler', ikon: 'gezilecek', aciklama: 'Gezi rehberleri ve keşfedilecek yerler' },
{ ad: 'Spor', etiket: '_Spor', ikon: 'spor', aciklama: 'Spor dalları ve müsabakalar' },
{ ad: 'Eğitim', etiket: '_Eğitim', ikon: 'egitim', aciklama: 'Eğitim, öğrenme ve üniversiteler' },
{ ad: 'Sanat', etiket: '_Sanat', ikon: 'sanat', aciklama: 'Görsel sanatlar, müzik ve edebiyat' },
{ ad: 'Ülkeler', etiket: '_Ülkeler', ikon: 'ulkeler', tip: 'ulke-tum', sonek: '', aciklama: 'Ülkeler ve bayrakları' }
];
const VARSAYILAN_CEKMECE_KATEGORILER = [
{ ad: 'Astroloji', etiket: '_Astroloji', ikon: 'astroloji', aciklama: 'Burçlar ve astroloji' },
{ ad: 'Bilim', etiket: '_Bilim', ikon: 'bilim', aciklama: 'Bilimsel gelişmeler ve keşifler' },
{ ad: 'Çevre', etiket: '_Çevre', ikon: 'cevre', aciklama: 'Doğa, iklim ve sürdürülebilirlik' },
{ ad: 'Dünya', etiket: '_Dünya', ikon: 'dunya', aciklama: 'Dünya gündemi ve uluslararası gelişmeler' },
{ ad: 'Eğitim', etiket: '_Eğitim', ikon: 'egitim', aciklama: 'Eğitim, öğrenme ve üniversiteler' },
{ ad: 'Eğlence', etiket: '_Eğlence', ikon: 'eglence', aciklama: 'Sinema, dizi ve eğlence dünyası' },
{ ad: 'Ekonomi', etiket: '_Ekonomi', ikon: 'ekonomi', aciklama: 'Ekonomi, piyasalar ve şirketler' },
{ ad: 'Gastronomi', etiket: '_Gastronomi', ikon: 'gastronomi', aciklama: 'Dünya mutfakları ve lezzetler' },
{ ad: 'Gezilecek Yerler', etiket: '_Gezilecek Yerler', ikon: 'gezilecek', aciklama: 'Gezi rehberleri ve keşfedilecek yerler' },
{ ad: 'Hayvanlar Alemi', etiket: '_Hayvanlar Alemi', ikon: 'hayvanlar', aciklama: 'Hayvanlar ve doğal yaşam' },
{ ad: 'Sanat', etiket: '_Sanat', ikon: 'sanat', aciklama: 'Görsel sanatlar, müzik ve edebiyat' },
{ ad: 'Spor', etiket: '_Spor', ikon: 'spor', aciklama: 'Spor dalları ve müsabakalar' },
{ ad: 'Tarih', etiket: '_Tarih', ikon: 'tarih', aciklama: 'Tarih, uygarlıklar ve kültürel miras' },
{ ad: 'Teknoloji', etiket: '_Teknoloji', ikon: 'teknoloji', aciklama: 'Teknoloji ve dijital dünya' },
{ ad: 'Yaşam', etiket: '_Yaşam', ikon: 'yasam', aciklama: 'Günlük yaşam ve yaşam kültürü' }
];
const VARSAYILAN_MOBIL_ADLAR = [
'Haber', 'Türkiye', 'Dünya', 'Ekonomi', 'Teknoloji', 'Bilim', 'Tarih', 'Gezilecek Yerler', 'Spor',
'Gastronomi', 'Çevre', 'Sanat', 'Eğlence', 'Hayvanlar Alemi', 'Eğitim', 'Yaşam', 'Astroloji', 'Ülkeler'
];
const VARSAYILAN_MOBIL_KATEGORILER = VARSAYILAN_MOBIL_ADLAR.map(function(ad){
if (ad === 'Haber') return { ad:'Haber', etiket:'', href:'/', ikon:'dunya', aciklama:'Ana sayfa' };
if (ad === 'Türkiye') return { ad:'Türkiye', etiket:'Türkiye', href:'/search/label/Türkiye', ikon:'bayrak_tr', aciklama:'Türkiye haberleri' };
const hepsi = VARSAYILAN_KATEGORILER.concat(VARSAYILAN_CEKMECE_KATEGORILER);
for (let i = 0; i < hepsi.length; i++) if (hepsi[i].ad === ad) return Object.assign({}, hepsi[i]);
return { ad:ad, etiket:'_' + ad, href:'/search/label/_' + encodeURIComponent(ad).replace(/%20/g,'%20'), ikon:'dunya', aciklama:ad + ' haberleri' };
});
const MENU_META = Object.create(null);
function menuNorm(value){ return String(value || '').toLocaleLowerCase('tr-TR').replace(/\s+/g,' ').trim(); }
[VARSAYILAN_KATEGORILER, VARSAYILAN_CEKMECE_KATEGORILER, VARSAYILAN_MOBIL_KATEGORILER].forEach(function(list){
list.forEach(function(item){ MENU_META[menuNorm(item.ad)] = item; });
});
function okuMenuListesi(id, varsayilanlar){
const root = document.getElementById(id);
if (!root) return varsayilanlar.map(function(item){ return Object.assign({}, item); });
const links = Array.prototype.slice.call(root.querySelectorAll('.widget-content a[href]'));
const items = links.map(function(a){
const ad = (a.textContent || '').trim();
const href = (a.getAttribute('href') || '').trim();
if (!ad || !href) return null;
const eski = MENU_META[menuNorm(ad)];
if (eski) return Object.assign({}, eski, {ad:ad, href:href});
let etiket = ad;
try {
const u = new URL(href, location.href);
const p = u.pathname.match(/\/search\/label\/([^/]+)$/i);
if (p) etiket = decodeURIComponent(p[1].replace(/\+/g,' '));
} catch (e) {}
if (menuNorm(ad) === 'ülkeler') return {ad:ad, etiket:etiket, href:href, ikon:'ulkeler', tip:'ulke-tum', sonek:'', aciklama:'Ülkeler ve bayrakları'};
return {ad:ad, etiket:etiket, href:href, ikon:'dunya', aciklama:ad + ' haberleri'};
}).filter(Boolean);
return items.length ? items : varsayilanlar.map(function(item){ return Object.assign({}, item); });
}
const KATEGORILER = okuMenuListesi('HVMegaMenuSettings', VARSAYILAN_KATEGORILER);
const CEKMECE_KATEGORILER = okuMenuListesi('HVMegaDrawerSettings', VARSAYILAN_CEKMECE_KATEGORILER);
const MOBIL_KATEGORILER = okuMenuListesi('HVMegaMobileSettings', VARSAYILAN_MOBIL_KATEGORILER);
/* V42: Mobil menü sırası Blogger'daki 'Mega Menü - Mobil Kategorileri' listesinden aynen alınır. */
const MOBIL_SIRALAMA = MOBIL_KATEGORILER.map(function(item){ return item.ad; });
const IKON_ADI = {
'Küresel Marka Sıralamaları': 'trophy', 'Gıda ve İçecek Markaları': 'food-apple', 'Moda Markaları': 'hanger',
'Kozmetik Markaları': 'lipstick', 'Perakende Markaları': 'store', 'Teknoloji ve Telekom Markaları': 'cellphone',
'Otomotiv ve Ulaşım Markaları': 'car', 'Finans ve Sigorta Markaları': 'bank', 'Sağlık ve İlaç Markaları': 'pill',
'Sanayi ve Altyapı Markaları': 'factory', 'İş ve Profesyonel Hizmet Markaları': 'briefcase', 'Turizm ve Konaklama Markaları': 'bed',
'Gayrimenkul Markaları': 'home-city', 'Medya ve Spor Markaları': 'soccer', 'Dünya Ekonomileri': 'earth',
'Satın Alma Gücü ve Zenginlik': 'cash-multiple', 'Borsalar ve Piyasa Değeri': 'finance',
'Antivirüs Programları': 'shield-bug', 'Antivirüs Testleri': 'clipboard-check', 'Siber Güvenlik': 'lock',
'Dijital Gizlilik ve Veri Güvenliği': 'eye-off', 'İşletim Sistemleri': 'monitor', 'Dizüstü Bilgisayarlar': 'laptop',
'İşlemciler': 'cpu-64-bit', 'Ekran Kartları': 'expansion-card', 'Depolama Teknolojileri': 'harddisk',
'Yarı İletkenler ve Çip Teknolojileri': 'memory', 'Akıllı Telefonlar': 'cellphone', 'Tabletler': 'tablet',
'Akıllı Saatler ve Giyilebilir Teknoloji': 'watch', 'İnternet ve Ağ Teknolojileri': 'web', 'Telekomünikasyon ve Mobil Ağlar': 'antenna',
'Bulut Teknolojileri': 'cloud', 'Veri Merkezleri': 'server', 'Televizyonlar ve Görüntü Teknolojileri': 'television-classic',
'Ses Teknolojileri': 'speaker', 'Fotoğraf ve Video Teknolojileri': 'video', 'Elektrikli Araç Teknolojileri': 'ev-station',
'Kuantum Teknolojileri': 'atom-variant', 'Sanal ve Artırılmış Gerçeklik': 'virtual-reality', 'Drone ve İnsansız Sistemler': 'quadcopter',
'Teknoloji Şirketleri': 'office-building', 'Teknoloji Markaları': 'tag', 'Teknoloji Sıralamaları': 'podium',
'Ürün Testleri ve Karşılaştırmaları': 'clipboard-check',
'Jeolojik Oluşumlar': 'layers-triple', 'Depremler ve Tektonik': 'pulse', 'İklim ve Atmosfer': 'weather-cloudy',
'Kuantum Fiziği': 'atom-variant', 'Enerji ve Termodinamik': 'fire', 'Işık ve Optik': 'lightbulb-on',
'Kimyasal Elementler': 'periodic-table', 'Kimyasal Maddeler': 'beaker', 'Kimya ve Günlük Yaşam': 'spray-bottle',
'Hücre ve Genetik': 'microscope', 'Canlıların Yapısı': 'human', 'Evrim ve Biyolojik Çeşitlilik': 'sprout',
'Ekosistemler': 'forest', 'İklim Değişikliği': 'thermometer', 'Doğal Kaynaklar': 'recycle',
'Sayılar ve İşlemler': 'calculator', 'Geometri': 'triangle-outline', 'İstatistik ve Olasılık': 'chart-bell-curve',
'Bilim İnsanları': 'account-tie', 'Önemli Bilimsel Keşifler': 'lightbulb', 'Bilim Tarihi': 'history',
'Antik Kentler ve Ören Yerleri': 'pillar', 'Tarihî Yapılar ve Anıtlar': 'castle', 'Müzeler ve Kültürel Miras': 'bank-outline',
'Ormanlar ve Yağmur Ormanları': 'tree', 'Adalar ve Koylar': 'beach', 'Şelaleler ve Akarsular': 'waves',
'Dağlar ve Jeolojik Oluşumlar': 'terrain', 'Mağaralar ve Yeraltı Nehirleri': 'image-filter-hdr', 'Vize ve Giriş Koşulları': 'passport',
'Ulaşım ve Konaklama': 'bus', 'Seyahat İçin En Uygun Zaman': 'calendar-month', 'Yerel Yemekler ve Kültür': 'food-fork-drink',
'Antik Kentler ve Arkeolojik Alanlar': 'pillar', 'Tapınaklar ve Kutsal Yapılar': 'church', 'Kaleler ve Surlar': 'castle',
'Antik Tiyatrolar ve Kamusal Yapılar': 'theater', 'Anıtlar ve Tarihî Heykeller': 'human-male-board', 'Kaya Yapıları ve Yeraltı Şehirleri': 'terrain',
'Tarihî Yerleşimler': 'home-group', 'Antik Dünyanın Yedi Harikası': 'star-four-points', 'Piramitler ve Anıtsal Yapılar': 'pyramid',
'Antik Uygarlıklar': 'bottle-wine', 'Tarihî Halklar': 'account-multiple', 'Efsanevi Kıtalar ve Kayıp Uygarlıklar': 'map-marker-question',
'Yemekler': 'food', 'Çorbalar': 'bowl-mix', 'Et Yemekleri': 'food-steak', 'Sebze Yemekleri': 'carrot',
'Güveçler ve Sulu Yemekler': 'pot', 'Deniz Ürünleri': 'fish', 'Makarnalar': 'pasta', 'Erişte ve Noodle Yemekleri': 'noodles',
'Mantı ve Hamur Yemekleri': 'food-croissant', 'Pizzalar': 'pizza', 'Salatalar': 'leaf', 'Tatlılar': 'cake',
'Kurabiyeler ve Kekler': 'cookie', 'Peynirler': 'cheese', 'Ekmekler ve Hamur İşleri': 'bread-slice', 'İçecekler': 'cup',
'Mutfaklar': 'chef-hat', 'Sokak Lezzetleri': 'food-takeout-box', 'Sandviçler': 'hamburger', 'Atıştırmalıklar': 'popcorn',
'Soslar ve Mezeler': 'shaker', 'Şarküteri Ürünleri': 'sausage', 'Baharatlar': 'shaker-outline', 'Gıda Ürünleri': 'food-apple',
'Gastronomi Şehirleri': 'city', 'Gastronomi Bölgeleri': 'map-marker-radius', 'Gıda Üreticileri': 'factory', 'Restoranlar': 'silverware-fork-knife',
'Dinozorlar': 'emo-t-rex', 'Uçan Sürüngenler': 'emo-eagle', 'Deniz Sürüngenleri': 'emo-crocodile', 'Tarih Öncesi Memeliler': 'emo-mammoth',
'Tarih Öncesi Balıklar': 'emo-fish', 'Tarih Öncesi Omurgasızlar': 'emo-spiral-shell', 'Memeliler': 'emo-elephant', 'Kuşlar': 'emo-parrot',
'Sürüngenler': 'emo-lizard', 'Amfibiler': 'emo-frog', 'Balıklar': 'emo-tropical-fish', 'Deniz Canlıları': 'emo-dolphin', 'Böcekler': 'emo-lady-beetle',
'Örümcekler ve Akrabaları': 'emo-spider', 'Kabuklular': 'emo-crab', 'Yumuşakçalar': 'emo-snail', 'Solucanlar': 'emo-worm',
'Diğer Omurgasızlar': 'emo-jellyfish',
'Klasik Müzik Bestecileri': 'account-music', 'Müzik Eserleri': 'music-note', 'Müzik Türleri': 'playlist-music',
'Müzik Enstrümanları': 'guitar-acoustic', 'Orkestralar ve Müzik Toplulukları': 'account-group', 'Müzik Tarihi': 'history',
'Ressamlar': 'format-paint', 'Heykeltıraşlar': 'shape', 'Sanat Eserleri': 'image-frame', 'Sanat Akımları': 'shape-outline',
'Resim ve Heykel Teknikleri': 'brush', 'Yazarlar': 'feather', 'Şairler': 'script-text-outline',
'Kitaplar ve Edebî Eserler': 'book-multiple', 'Edebiyat Akımları': 'bookshelf', 'Yönetmenler': 'movie-roll',
'Oyuncular': 'account-star', 'Filmler': 'filmstrip', 'Sinema Tarihi': 'film', 'Tiyatro Sanatçıları': 'account-voice',
'Tiyatro Eserleri': 'script', 'Dans ve Bale': 'human-female-dance', 'Opera': 'microphone-variant', 'Mimarlar': 'compass-rose',
'Mimari Eserler': 'office-building', 'Mimari Akımlar': 'view-column', 'Fotoğrafçılar': 'camera-account',
'Fotoğraf Sanatı': 'image-multiple', 'Seramik ve Çini': 'pot', 'Hat ve Kaligrafi': 'fountain-pen',
'Tekstil ve Dokuma Sanatları': 'tshirt-crew',
'Günlük Burç Yorumları': 'calendar-today', 'Haftalık Burç Yorumları': 'calendar-week', 'Aylık Burç Yorumları': 'calendar-month',
'Yıllık Burç Yorumları': 'calendar', 'Burç Özellikleri': 'star-circle', 'Burç Erkeği ve Kadını': 'human-male-female',
'Aşk ve İlişki Uyumu': 'heart-multiple', 'Yükselen Burç': 'weather-sunset-up', 'Doğum Haritası': 'map-outline',
'Gezegenler': 'orbit', 'Burçların Elementleri': 'fire', 'Burçların Nitelikleri': 'star-four-points', 'Astrolojik Evler': 'home-variant'
};
const ikonYay = function(d, miras){
if (d.tip === 'ulke-tum' && !d.ikon) d.ikon = 'flag';
if (!d.ikon && !d.tip && !d.kita) {
d.ikon = (Object.prototype.hasOwnProperty.call(IKON_ADI, d.ad) ? IKON_ADI[d.ad] : null) || miras || 'earth';
}
if (d.cocuk) d.cocuk.forEach(function(c){ ikonYay(c, d.ikon || miras); });
};
KATEGORILER.forEach(function(k){ ikonYay(k, null); });
CEKMECE_KATEGORILER.forEach(function(k){ ikonYay(k, null); });
MOBIL_KATEGORILER.forEach(function(k){ ikonYay(k, null); });
const dugumMu = function(d){ return !!(d && (d.tip || (d.cocuk && d.cocuk.length))); };
const cocuklar = function(d){
if (d.tip === 'ulke-liste') {
return ULKE_VERISI[d.kita].slice().sort(function(x, y){ return x[1].localeCompare(y[1], 'tr'); })
.map(function(s){ return { ad: s[1], kod: s[0], etiket: s[1] + (d.sonek || '') }; });
}
if (d.tip === 'ulke-tum') {
const hepsi = [];
KITA_SIRASI.forEach(function(k){
ULKE_VERISI[k].forEach(function(s){ hepsi.push({ ad: s[1], kod: s[0], etiket: s[1] + (d.sonek || '') }); });
});
return hepsi.sort(function(x, y){ return x.ad.localeCompare(y.ad, 'tr'); });
}
return d.cocuk || [];
};
const onbellek = new Map();
const yapraklar = function(d){
if (onbellek.has(d)) return onbellek.get(d);
let s = [];
cocuklar(d).forEach(function(c){ s = s.concat(dugumMu(c) ? yapraklar(c) : [c]); });
onbellek.set(d, s);
return s;
};
const hedef = function(d){ return PLAIN(d.etiket || d.ad); };
const simge = function(d){
if (d.kod && IKONLAR['bayrak_' + d.kod]) return 'bayrak_' + d.kod;
if (d.ikon) return d.ikon;
if (d.kita && KITA_IKON[d.kita]) return KITA_IKON[d.kita];
return null;
};
const birim = function(d){ return (d.tip && d.tip.indexOf('ulke') === 0) ? 'ülke' : 'öğe'; };
const ARAYUZ = { kapat: 'close', geri: 'chevron-left', ileri: 'chevron-right', asagi: 'chevron-down', yukari: 'chevron-up', menu: 'menu', ana: 'home', tum: 'view-grid', bilgi: 'information', iletisim: 'email', yer: 'bookmark', alt: 'circle-small' };
const YARDIMCI = {
haber: { ad: 'HABER', href: '/', ikon: ARAYUZ.ana }
};
window.HABER_MENU = {
KITA_SIRASI: KITA_SIRASI,
ULKE_VERISI: ULKE_VERISI,
IKONLAR: IKONLAR,
KITA_IKON: KITA_IKON,
YEDEK_BAYRAK: YEDEK_BAYRAK,
KATEGORILER: KATEGORILER,
CEKMECE_KATEGORILER: CEKMECE_KATEGORILER,
MOBIL_KATEGORILER: MOBIL_KATEGORILER,
MOBIL_SIRALAMA: MOBIL_SIRALAMA,
YARDIMCI: YARDIMCI,
ARAYUZ: ARAYUZ,
PLAIN: PLAIN,
dugumMu: dugumMu,
cocuklar: cocuklar,
yapraklar: yapraklar,
hedef: hedef,
simge: simge,
birim: birim
};
})();
//
  };

  /* Orijinal Blogger tema konumu: satir 45924 | hvjs-041 */
  parts["hvjs-041"] = function () {
//
(function(){
'use strict';
var baslatildi = false;
function baslat(){
if (baslatildi) return true;
var M = window.HABER_MENU;
if (!M) return false;
var nav = document.getElementById('site-navigation');
var ul = document.getElementById('main-nav-list');
var btn = document.getElementById('tk-btn');
var dd = document.getElementById('tk-dropdown');
var hamEl = document.getElementById('tk-ham');
if (!nav || !ul || !btn || !dd || !hamEl) return false;
baslatildi = true;
var IKON_SAYAC = 0;
var PANEL_SIFIRLA = [];
var dinamik = [];
function el(etiket, sinif, metin){
var e = document.createElement(etiket);
if (sinif) e.className = sinif;
if (metin !== undefined) e.textContent = metin;
return e;
}
function normal(s){ return String(s).trim().toLocaleLowerCase('tr'); }
function ikonKutusu(ad, sinif){
var icerik = M.IKONLAR[ad];
if (!icerik) return null;
var kutu = el('span', sinif || 'ikon-kutu');
IKON_SAYAC++;
kutu.innerHTML = icerik.replace(/__P__/g, 'k' + IKON_SAYAC + '-');
if (ad.indexOf('bayrak_') === 0) kutu.classList.add('bayrak');
return kutu;
}
function bosMesaj(){ return el('div', 'country-empty', 'Sonuç bulunamadı'); }
function sayfaIkonu(){ return ikonKutusu(M.ARAYUZ.ileri, 'ikon-kutu'); }
function okEkle(parent){
var o = ikonKutusu(M.ARAYUZ.ileri, 'ikon-kutu ok-ikon');
if (o) parent.appendChild(o);
}
function tkHamAyarla(acik){
/* Tek kaynaklı, CSS ile çizilen üç çizgi. Menü ikonlarını gizleyen genel SVG kuralından etkilenmez. */
hamEl.innerHTML = '<span class="hv-ham-line hv-ham-line-1"></span><span class="hv-ham-line hv-ham-line-2"></span><span class="hv-ham-line hv-ham-line-3"></span>';
btn.classList.toggle('open', !!acik);
hamEl.setAttribute('data-open', acik ? 'true' : 'false');
}
tkHamAyarla(false);
btn.setAttribute('aria-expanded', 'false');
function tkKapat(){
dd.style.display = 'none';
btn.setAttribute('aria-expanded', 'false');
tkHamAyarla(false);
}
function hepsiniKapat(){
tkKapat();
dinamik.forEach(function(x){ x.style.display = 'none'; });
nav.querySelectorAll('.dyn-ok').forEach(function(x){ x.style.transform = ''; });
nav.querySelectorAll('[data-acilir]').forEach(function(x){ x.setAttribute('aria-expanded', 'false'); });
PANEL_SIFIRLA.forEach(function(f){ f(); });
}
function kapatDugmesi(){
var b = el('button', 'menu-kapat');
b.type = 'button';
b.title = 'Menüyü kapat';
var ik = ikonKutusu(M.ARAYUZ.kapat, 'ikon-kutu ikon-close');
if (ik) b.appendChild(ik);
b.appendChild(el('span', null, 'Kapat'));
b.addEventListener('click', function(){ hepsiniKapat(); });
return b;
}
function positionFull(drop){
var vw = document.documentElement.clientWidth || window.innerWidth;
var width = Math.min(1200, Math.max(0, vw - 32));
drop.style.setProperty('width', width + 'px', 'important');
drop.style.setProperty('left', '50%', 'important');
drop.style.setProperty('right', 'auto', 'important');
drop.style.setProperty('transform', 'translateX(-50%)', 'important');
}
function agacPaneli(kok, kategori){
var yigin = [kategori];
var baslik = el('div', 'country-menu-header');
var sol = el('div', 'country-menu-left');
var geriBtn = el('button', 'menu-geri');
geriBtn.type = 'button';
geriBtn.title = 'Bir üst seviyeye dön';
var gIk = ikonKutusu(M.ARAYUZ.geri, 'ikon-kutu');
if (gIk) geriBtn.appendChild(gIk);
geriBtn.appendChild(el('span', null, 'Geri'));
var baslikYazi = el('span', 'country-menu-title', kategori.ad);
sol.appendChild(geriBtn);
sol.appendChild(baslikYazi);
var sag = el('div', 'country-menu-right');
var sayi = el('span', 'country-menu-subtitle', '');
var sayfaLink = null;
if (kategori.tip !== 'ulke-tum') {
sayfaLink = el('a', 'country-page-link');
sayfaLink.appendChild(el('span', null, 'Sayfaya git'));
var sIk = sayfaIkonu();
if (sIk) sayfaLink.appendChild(sIk);
sayfaLink.style.display = 'none';
}
sag.appendChild(sayi);
if (sayfaLink) sag.appendChild(sayfaLink);
sag.appendChild(kapatDugmesi());
baslik.appendChild(sol);
baslik.appendChild(sag);
var aramaKutusu = el('div', 'country-search');
var arama = el('input');
arama.type = 'search';
arama.placeholder = kategori.ad + ' içinde ara...';
arama.setAttribute('autocomplete', 'off');
aramaKutusu.appendChild(arama);
var govde = el('div', 'agac-govde');
kok.appendChild(baslik);
kok.appendChild(aramaKutusu);
kok.appendChild(govde);
function sayfaHedefi(d){
if (d === kategori && d.tip === 'ulke-tum') return null;
if (d.sayfa) return M.PLAIN(d.sayfa);
if (d === kategori) return M.PLAIN(kategori.etiket);
return null;
}
function aramaSonucu(d, q){
var gorulen = {}, sonuc = [];
M.yapraklar(d).forEach(function(y){
if (sonuc.length >= 300) return;
if (normal(y.ad).indexOf(q) === -1) return;
var anahtar = M.hedef(y) + '|' + (y.kod || '');
if (gorulen[anahtar]) return;
gorulen[anahtar] = true;
sonuc.push(y);
});
return sonuc;
}
function kartIzgarasi(liste){
var g = el('div', 'country-continent-grid');
liste.forEach(function(d){
var s = M.simge(d);
var b = el('button', 'country-continent-button' + (s ? ' ikonlu' : ''));
b.type = 'button';
if (s) { var kutu = ikonKutusu(s, 'ikon-kutu'); if (kutu) b.appendChild(kutu); }
b.appendChild(el('span', 'cc-ad', d.ad));
b.appendChild(el('small', 'cc-say', M.cocuklar(d).length + ' ' + M.birim(d)));
okEkle(b);
b.addEventListener('click', function(){ arama.value = ''; yigin.push(d); ciz(); });
g.appendChild(b);
});
return g;
}
function baglantiYap(y){
var a = el('a');
a.href = M.hedef(y);
a.setAttribute('itemprop', 'url');
var s = M.simge(y);
if (y.kod && !M.IKONLAR['bayrak_' + y.kod]) {
var img = el('img', 'country-flag');
img.dataset.kod = y.kod;
img.src = 'https://flagcdn.com/' + y.kod + '.svg';
img.alt = '';
img.loading = 'lazy';
img.width = 22;
img.height = 15;
a.appendChild(img);
} else if (s) {
var kutu2 = ikonKutusu(s, s.indexOf('bayrak_') === 0 ? 'country-flag-svg' : 'ikon-kutu');
if (kutu2) a.appendChild(kutu2);
}
var isim = el('span', null, y.ad);
isim.setAttribute('itemprop', 'name');
a.appendChild(isim);
return a;
}
function yaprakIzgarasi(liste){
var g = el('div', 'country-second-grid');
g.style.display = 'grid';
liste.forEach(function(y){ g.appendChild(baglantiYap(y)); });
return g;
}
function ciz(){
var d = yigin[yigin.length - 1];
var q = normal(arama.value);
baslikYazi.textContent = q ? 'Arama' : d.ad;
geriBtn.style.display = yigin.length > 1 ? '' : 'none';
var h = sayfaHedefi(d);
if (sayfaLink) {
if (h && !q) { sayfaLink.href = h; sayfaLink.style.display = ''; }
else { sayfaLink.style.display = 'none'; }
}
govde.innerHTML = '';
if (q) {
var sonuc = aramaSonucu(d, q);
sayi.textContent = sonuc.length + ' sonuç';
govde.appendChild(sonuc.length ? yaprakIzgarasi(sonuc) : bosMesaj());
} else {
var ch = M.cocuklar(d);
sayi.textContent = ch.length + ' ' + M.birim(d);
var dugumler = ch.filter(function(c){ return M.dugumMu(c); });
var yap = ch.filter(function(c){ return !M.dugumMu(c); });
if (dugumler.length) govde.appendChild(kartIzgarasi(dugumler));
if (yap.length) govde.appendChild(yaprakIzgarasi(yap));
if (!ch.length) govde.appendChild(bosMesaj());
}
}
function sifirla(){
yigin.length = 1;
arama.value = '';
ciz();
}
geriBtn.addEventListener('click', function(){
if (yigin.length > 1) { yigin.pop(); arama.value = ''; ciz(); }
});
baslik.addEventListener('click', function(e){
if (e.target.closest && e.target.closest('.country-menu-title')) sifirla();
});
arama.addEventListener('input', function(){ ciz(); });
PANEL_SIFIRLA.push(sifirla);
sifirla();
}
function tumPaneli(kok){
kok.innerHTML = '';
var ic = el('div', 'tum-icerik');
var b = el('div', 'country-menu-header');
var sol2 = el('div', 'country-menu-left');
var yz = el('span', 'country-menu-title', 'Tüm Kategoriler');
yz.style.cursor = 'default';
sol2.appendChild(yz);
var sag2 = el('div', 'country-menu-right');
var drawerKategorileri = M.CEKMECE_KATEGORILER || [];
var st = el('span', 'country-menu-subtitle', drawerKategorileri.length + ' kategori');
sag2.appendChild(st);
sag2.appendChild(kapatDugmesi());
b.appendChild(sol2);
b.appendChild(sag2);
ic.appendChild(b);
var ak = el('div', 'country-search');
var inp = el('input');
inp.type = 'search';
inp.placeholder = 'Kategori ara...';
inp.setAttribute('autocomplete', 'off');
ak.appendChild(inp);
ic.appendChild(ak);
var kartlar = el('div', 'country-continent-grid');
var satirlar = drawerKategorileri.map(function(k){
var a = el('a', 'country-continent-button ikonlu');
a.href = k.href || M.PLAIN(k.etiket);
a.setAttribute('itemprop', 'url');
var kutu = ikonKutusu(k.ikon, 'ikon-kutu');
if (kutu) a.appendChild(kutu);
a.appendChild(el('span', 'cc-ad', k.ad));
a.appendChild(el('span', 'cc-acik', k.aciklama || ''));

kartlar.appendChild(a);
return { a: a, ad: normal(k.ad) };
});
ic.appendChild(kartlar);
var bos = bosMesaj();
bos.style.display = 'none';
ic.appendChild(bos);
kok.appendChild(ic);
function filtrele(){
var q = normal(inp.value);
var say = 0;
satirlar.forEach(function(s){
var e = !q || s.ad.indexOf(q) !== -1;
s.a.style.display = e ? '' : 'none';
if (e) say++;
});
bos.style.display = say ? 'none' : '';
st.textContent = q ? say + ' sonuç' : drawerKategorileri.length + ' kategori';
}
inp.addEventListener('input', filtrele);
PANEL_SIFIRLA.push(function(){ inp.value = ''; filtrele(); });
filtrele();
}
M.KATEGORILER.forEach(function(k){
var li = el('li');
var a = el('a');
a.href = k.href || M.PLAIN(k.etiket);
if (k.tip === 'ulke-tum') {
a.setAttribute('data-acilir', k.ad);
a.setAttribute('data-ikon', k.ikon);
}
a.setAttribute('itemprop', 'url');
/* V32: Kategori açıklamaları kullanıcıya tooltip olarak gösterilmez. */
var kutu = ikonKutusu(k.ikon, 'ikon-kutu ust-ikon');
if (kutu) a.appendChild(kutu);
var isim = el('span', null, k.ad);
isim.setAttribute('itemprop', 'name');
a.appendChild(isim);
li.appendChild(a);
ul.appendChild(li);
});
M.KATEGORILER.filter(function(k){ return k.tip === 'ulke-tum'; }).forEach(function(k){
var drop = el('div', 'dynamic-category-dropdown country-grid');
drop.setAttribute('data-menu', k.ad);
drop.style.display = 'none';
var grid = el('div', 'tk-grid');
drop.appendChild(grid);
nav.appendChild(drop);
dinamik.push(drop);
agacPaneli(grid, k);
});
tumPaneli(dd);
ul.querySelectorAll('li > a[data-acilir]').forEach(function(link){
var anahtar = link.getAttribute('data-acilir');
var drop = nav.querySelector('.dynamic-category-dropdown[data-menu="' + anahtar + '"]');
if (!drop) return;
link.setAttribute('aria-haspopup', 'true');
link.setAttribute('aria-expanded', 'false');
var ok = ikonKutusu(M.ARAYUZ.asagi, 'ikon-kutu dyn-ok');
if (ok) link.appendChild(ok);
link.addEventListener('click', function(e){
e.preventDefault();
e.stopPropagation();
var acik = drop.style.display === 'block';
hepsiniKapat();
if (!acik) {
drop.style.display = 'block';
link.setAttribute('aria-expanded', 'true');
if (ok) ok.style.transform = 'rotate(180deg)';
positionFull(drop);
}
});
});
btn.addEventListener('click', function(e){
e.preventDefault();
e.stopPropagation();
var acik = dd.style.display === 'block';
hepsiniKapat();
if (!acik) {
dd.style.display = 'block';
btn.setAttribute('aria-expanded', 'true');
tkHamAyarla(true);
positionFull(dd);
}
});
document.addEventListener('click', function(e){
var yol = e.composedPath ? e.composedPath() : [];
var icerde = yol.length ? yol.indexOf(nav) !== -1 : nav.contains(e.target);
if (!icerde) hepsiniKapat();
});
window.addEventListener('resize', function(){
if (dd.style.display === 'block') positionFull(dd);
dinamik.forEach(function(d){ if (d.style.display === 'block') positionFull(d); });
});
function bayrakEmojisi(kod){
var k = String(kod || '').toUpperCase();
if (!/^[A-Z]{2}$/.test(k)) return '\u{1F3F3}\u{FE0F}';
return String.fromCodePoint(127397 + k.charCodeAt(0), 127397 + k.charCodeAt(1));
}
document.addEventListener('error', function(e){
var t = e.target;
if (!(t && t.classList && t.classList.contains('country-flag'))) return;
if (!t.dataset.yedek) {
t.dataset.yedek = '1';
t.src = M.YEDEK_BAYRAK + t.dataset.kod + '.svg';
} else {
var yedek = el('span', 'country-flag-fallback', bayrakEmojisi(t.dataset.kod));
yedek.setAttribute('aria-hidden', 'true');
if (t.parentNode) t.parentNode.replaceChild(yedek, t);
}
}, true);
return true;
}
if (!baslat()) {
document.addEventListener('DOMContentLoaded', baslat);
var deneme = 0;
var zamanlayici = setInterval(function(){
if (baslat() || ++deneme > 80) clearInterval(zamanlayici);
}, 100);
}
})();
//
  };

  /* Orijinal Blogger tema konumu: satir 46299 | hvjs-042 */
  parts["hvjs-042"] = function () {
//
//<![CDATA[
(function(){
'use strict';
if (window.innerWidth > 768) return;
var kurulduMu = false;
function kur(){
if (kurulduMu) return true;
var M = window.HABER_MENU;
if (!M) return false;
var menuUl = document.querySelector('.ui-menushift > ul');
if (!menuUl) return false;
kurulduMu = true;
mobilKur(M, menuUl);
return true;
}
function mobilKur(M, menuUl){
var SAYAC = 0;
function yeniOn(){ SAYAC++; return 'm' + SAYAC + '-'; }
function el(etiket, sinif, metin){
var e = document.createElement(etiket);
if (sinif) e.className = sinif;
if (metin !== undefined) e.textContent = metin;
return e;
}
function normal(s){ return String(s).trim().toLocaleLowerCase('tr'); }
function simgeSinifi(ad){ return (ad && ad.indexOf('bayrak_') === 0) ? 'mm-bayrak-yerel' : 'mm-ikon'; }
function ikonUret(ad, sinif){
var icerik = M.IKONLAR[ad];
if (!icerik) return null;
var k = el('span', sinif || 'mm-ikon');
k.innerHTML = icerik.replace(/__P__/g, yeniOn());
return k;
}
function ikonEkle(ust, ad, sinif){
var k = ikonUret(ad, sinif);
if (k) ust.appendChild(k);
}
function bayrakUret(kod){
if (M.IKONLAR['bayrak_' + kod]) return ikonUret('bayrak_' + kod, 'mm-bayrak-yerel');
var img = el('img', 'mm-bayrak');
img.dataset.kod = kod;
img.src = 'https://flagcdn.com/' + kod + '.svg';
img.alt = '';
img.loading = 'lazy';
img.width = 22;
img.height = 15;
return img;
}
function bayrakEmojisi(kod){
var k = String(kod || '').toUpperCase();
if (!/^[A-Z]{2}$/.test(k)) return '\u{1F3F3}\u{FE0F}';
return String.fromCodePoint(127397 + k.charCodeAt(0), 127397 + k.charCodeAt(1));
}
document.addEventListener('error', function(e){
var t = e.target;
if (!(t && t.classList && t.classList.contains('mm-bayrak'))) return;
if (!t.dataset.yedek) {
t.dataset.yedek = '1';
t.src = M.YEDEK_BAYRAK + t.dataset.kod + '.svg';
} else {
var yedek = el('span', 'mm-bayrak-fallback', bayrakEmojisi(t.dataset.kod));
yedek.setAttribute('aria-hidden', 'true');
if (t.parentNode) t.parentNode.replaceChild(yedek, t);
}
}, true);
var yigin = [];
var kok = el('div', 'mm-root');
function goster(f){ kok.innerHTML = ''; kok.appendChild(f()); }
function ilerle(f){ yigin.push(f); goster(f); }
function geri(){
if (yigin.length > 1) { yigin.pop(); goster(yigin[yigin.length - 1]); }
}
function kapat(){
if (yigin.length > 1) { yigin.length = 1; goster(yigin[0]); }
}
function hapDugmesi(metin, ikon, tikla){
var b = el('button', 'mm-hap');
b.type = 'button';
ikonEkle(b, ikon, 'mm-ikon');
b.appendChild(el('span', null, metin));
b.addEventListener('click', tikla);
return b;
}
function bos(){ return el('div', 'mm-bos', 'Sonuç bulunamadı'); }
function ekran(o){
var v = el('div', 'mm-ekran');
var ust = el('div', 'mm-ust');
var sol = el('div', 'mm-ust-sol');
if (yigin.length > 1) sol.appendChild(hapDugmesi('Geri', M.ARAYUZ.geri, geri));
var sag = el('div', 'mm-ust-sag');
sag.appendChild(hapDugmesi('Kapat', M.ARAYUZ.kapat, kapat));
ust.appendChild(sol);
ust.appendChild(sag);
v.appendChild(ust);
var baslik = el('div', 'mm-baslik');
baslik.appendChild(el('div', 'mm-h', o.baslik));
var say = el('span', 'mm-say', o.altYazi(''));
baslik.appendChild(say);
v.appendChild(baslik);
if (o.aramaYazisi) {
var aramaKutusu = el('div', 'mm-arama');
var girdi = el('input');
girdi.type = 'search';
girdi.placeholder = o.aramaYazisi;
girdi.setAttribute('autocomplete', 'off');
aramaKutusu.appendChild(girdi);
v.appendChild(aramaKutusu);
girdi.addEventListener('input', function(){ guncelle(normal(girdi.value)); });
}
var govde = el('div', 'mm-govde');
v.appendChild(govde);
function guncelle(q){
govde.innerHTML = '';
if (o.sayfa && !q) {
var sa = el('a', 'mm-sayfa');
sa.href = o.sayfa;
sa.appendChild(el('span', null, 'Sayfaya git'));
var saOk = ikonUret(M.ARAYUZ.ileri, 'mm-sayfa-ok');
if (saOk) sa.appendChild(saOk);
govde.appendChild(sa);
}
govde.appendChild(o.govde(q));
say.textContent = o.altYazi(q);
}
guncelle('');
return v;
}
function kartlar(liste, tek){
if (!liste.length) return bos();
var g = el('div', 'mm-kartlar' + (tek ? ' mm-tek' : ''));
liste.forEach(function(k){
var e = el(k.href ? 'a' : 'button', 'mm-kart' + (k.ikon ? '' : ' mm-ikonsuz'));
if (k.href) e.href = k.href; else e.type = 'button';
if (k.ikon) ikonEkle(e, k.ikon, simgeSinifi(k.ikon));
var m = el('span', 'mm-kart-metin');
m.appendChild(el('span', 'mm-kart-ad', k.ad));
if (k.sayi) m.appendChild(el('span', 'mm-kart-say', k.sayi));
if (k.aciklama) m.appendChild(el('span', 'mm-kart-acik', k.aciklama));
e.appendChild(m);
var ok = ikonUret(M.ARAYUZ.ileri, 'mm-ok');
if (ok) e.appendChild(ok);
if (k.tikla) e.addEventListener('click', k.tikla);
g.appendChild(e);
});
return g;
}
function liste(satirlar){
if (!satirlar.length) return bos();
var l = el('div', 'mm-liste');
satirlar.forEach(function(s){
var a = el('a', 'mm-oge');
a.href = M.hedef(s);
if (s.kod && !M.IKONLAR['bayrak_' + s.kod]) {
a.appendChild(bayrakUret(s.kod));
} else {
var sm = M.simge(s);
if (sm) ikonEkle(a, sm, simgeSinifi(sm));
}
a.appendChild(el('span', 'mm-oge-ad', s.ad));
l.appendChild(a);
});
return l;
}
function aramaSonucu(d, q){
var gorulen = {}, sonuc = [];
M.yapraklar(d).forEach(function(y){
if (sonuc.length >= 300) return;
if (normal(y.ad).indexOf(q) === -1) return;
var anahtar = M.hedef(y) + '|' + (y.kod || '');
if (gorulen[anahtar]) return;
gorulen[anahtar] = true;
sonuc.push(y);
});
return sonuc;
}
function dugumEkrani(kategori, d){
var ogeler = M.cocuklar(d);
var kokMu = (d === kategori);
return ekran({
baslik: d.ad,
altYazi: function(q){ return q ? aramaSonucu(d, q).length + ' sonuç' : ogeler.length + ' ' + M.birim(d); },
aramaYazisi: kategori.ad + ' içinde ara...',
sayfa: (kokMu && d.tip === 'ulke-tum') ? null : (kokMu ? M.PLAIN(kategori.etiket) : (d.sayfa ? M.PLAIN(d.sayfa) : null)),
govde: function(q){
if (q) return liste(aramaSonucu(d, q));
var f = el('div', 'mm-grup');
var dugumler = ogeler.filter(function(c){ return M.dugumMu(c); });
var yaprak = ogeler.filter(function(c){ return !M.dugumMu(c); });
if (dugumler.length) {
f.appendChild(kartlar(dugumler.map(function(c){
return {
ad: c.ad,
ikon: M.simge(c),
sayi: M.cocuklar(c).length + ' ' + M.birim(c),
tikla: function(){ ilerle(function(){ return dugumEkrani(kategori, c); }); }
};
}), true));
}
if (yaprak.length) f.appendChild(liste(yaprak));
if (!ogeler.length) f.appendChild(bos());
return f;
}
});
}
function tumEkrani(){
var eslesen = function(q){
return M.KATEGORILER.filter(function(k){ return !q || normal(k.ad).indexOf(q) !== -1; });
};
return ekran({
baslik: 'Tüm Kategoriler',
altYazi: function(q){ return q ? eslesen(q).length + ' sonuç' : M.KATEGORILER.length + ' kategori'; },
aramaYazisi: 'Kategori ara...',
govde: function(q){
return kartlar(eslesen(q).map(function(k){
return { ad: k.ad, ikon: k.ikon, aciklama: k.aciklama || '', href: (k.href || M.PLAIN(k.etiket)) };
}), true);
}
});
}
function uyeGirisSatiriMi(ad){
var n = normal(ad).replace(/\s+/g, ' ');
return n === 'üye girişi' || n === 'üye ol/giriş yap' || n === 'üye ol / giriş yap' || n === 'üye giriş';
}
function baglantiSatiri(h, vurgu){
var adNorm = normal(h.ad).replace(/\s+/g, ' ');
var uyeGirisi = uyeGirisSatiriMi(h.ad);
var gorunenAd = uyeGirisi ? 'Üye Ol/Giriş Yap' : h.ad;
var a = el('a', 'mm-satir mm-ana-satir' + (vurgu ? ' mm-vurgu' : '') + (uyeGirisi ? ' mm-uye-girisi' : ''));
a.setAttribute('data-menu-label', adNorm);
a.href = h.href;
if (uyeGirisi) {
a.setAttribute('aria-label', 'Üye Ol/Giriş Yap');
a.setAttribute('title', 'Üye Ol/Giriş Yap');
var kullaniciIkonu = el('span', 'mm-ikon');
kullaniciIkonu.innerHTML = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true" focusable="false"><circle cx="12" cy="8" r="3.2"></circle><path d="M5.8 19c.7-3 2.8-4.6 6.2-4.6s5.5 1.6 6.2 4.6"></path><circle cx="12" cy="12" r="9"></circle></svg>';
a.appendChild(kullaniciIkonu);
} else if (h.kod) a.appendChild(bayrakUret(h.kod));
else ikonEkle(a, h.ikon, 'mm-ikon');
a.appendChild(el('span', 'mm-satir-ad', gorunenAd));
return a;
}
function panelSatiri(ad, ikon, fn){
var b = el('button', 'mm-satir mm-ana-satir');
b.type = 'button';
b.setAttribute('data-menu-label', normal(ad).replace(/\s+/g, ' '));
ikonEkle(b, ikon, 'mm-ikon');
b.appendChild(el('span', 'mm-satir-ad', ad));
var ok = ikonUret(M.ARAYUZ.ileri, 'mm-ok');
if (ok) b.appendChild(ok);
b.addEventListener('click', function(){ ilerle(fn); });
return b;
}
function anaEkran(){
var v = el('div', 'mm-ana');
var tumKategoriler = (M.MOBIL_KATEGORILER || []).concat(M.KATEGORILER || [], M.CEKMECE_KATEGORILER || []);
function kategoriBul(ad){
for (var i = 0; i < tumKategoriler.length; i++) {
if (tumKategoriler[i].ad === ad) return tumKategoriler[i];
}
return null;
}
if ((M.MOBIL_SIRALAMA || []).some(function(ad){ return normal(ad) === 'haber'; })) v.appendChild(baglantiSatiri({ad:'Haber', href:M.YARDIMCI.haber.href, ikon:M.YARDIMCI.haber.ikon}, false));
M.MOBIL_SIRALAMA.forEach(function(ad){
if (ad === 'Haber') return;
if (ad === 'Türkiye') {
var turkiye = kategoriBul(ad);
v.appendChild(baglantiSatiri({ ad: 'Türkiye', href: (turkiye && turkiye.href) || M.PLAIN('Türkiye'), ikon: (turkiye && turkiye.ikon) || 'bayrak_tr' }, false));
return;
}
var k = kategoriBul(ad);
if (!k) return;
if (k.tip === 'ulke-tum') {
v.appendChild(panelSatiri(k.ad, k.ikon, function(){ return dugumEkrani(k, k); }));
} else {
v.appendChild(baglantiSatiri({ ad: k.ad, href: (k.href || M.PLAIN(k.etiket)), ikon: k.ikon }, false));
}
});
return v;
}
menuUl.style.display = 'none';
menuUl.parentNode.insertBefore(kok, menuUl);
var dugme = document.querySelector('.show-menu-space');
if (dugme && !dugme.dataset.mmBagli) {
dugme.dataset.mmBagli = '1';
dugme.addEventListener('click', function(){ kapat(); });
}
yigin.length = 0;
yigin.push(anaEkran);
goster(anaEkran);
}
if (!kur()) {
var deneme = 0;
var zamanlayici = setInterval(function(){
if (kur() || ++deneme > 40) clearInterval(zamanlayici);
}, 250);
document.addEventListener('DOMContentLoaded', kur);
}
})();
//
  };

  /* Orijinal Blogger tema konumu: satir 46600 | hvjs-043 */
  parts["hvjs-043"] = function () {

//
(async function() {
  // ★ Sayfa boşta kalınca çalıştır (LCP'yi bloklamaz)
  await new Promise(function(resolve) {
    if ('requestIdleCallback' in window) {
      requestIdleCallback(resolve, { timeout: 5000 });
    } else {
      setTimeout(resolve, 4000);
    }
  });

  try {
    const res = await fetch('https://raw.githubusercontent.com/haberlerver/panel/main/giris-paneli.html?t=' + Date.now(), { cache: 'no-store' });
    const text = await res.text();
    const doc = new DOMParser().parseFromString(text, 'text/html');

    doc.querySelectorAll('style').forEach(function(style) {
      document.head.appendChild(style.cloneNode(true));
    });

    Array.from(doc.body.children).forEach(function(el) {
      if (el.tagName.toLowerCase() !== 'script') {
        document.body.appendChild(el.cloneNode(true));
      }
    });

    doc.querySelectorAll('script').forEach(function(oldScript) {
      var newScript = document.createElement('script');
      if (oldScript.type) newScript.type = oldScript.type;
      if (oldScript.src) {
        newScript.src = oldScript.src;
      } else {
        newScript.textContent = oldScript.textContent;
      }
      document.body.appendChild(newScript);
    });
  } catch (e) {
    console.error('Giriş paneli yüklenemedi:', e);
  }
})();
//
  };

  /* Orijinal Blogger tema konumu: satir 30823 | hvjs-044 */
  parts["hvjs-044"] = function () {
//<![CDATA[
(function () {
'use strict';
const EKO_URL = 'https://canli-piyasa.haberlervermedya.workers.dev/';
const SLAYT_MS = 6000;
const EKO_MS = 10000;
const el = (id) => document.getElementById(id);
const esc = (s) => String(s == null ? '' : s)
.replace(/&/g, '&amp;')
.replace(/"/g, '&quot;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;');
  const domHazir = (fn) => {
    if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', fn);
    else fn();
  };
  const uniq = (arr) => arr.filter((u, i) => u && arr.indexOf(u) === i);
  const baslik = (e) => String((e && e.title && typeof e.title === 'object' && e.title.$t) || (e && typeof e.title === 'string' && e.title) || '').trim();
  const linkOf = (e) => {
    const a = (e.link || []).find((x) => x.rel === 'alternate');
    return a ? a.href : '#';
  };
  /* ===== Görsel adresleri ===== */
  const BLOGGER = /^https:\/\/blogger\.googleusercontent\.com\/img\//;
  const blogUrl = (u) => (BLOGGER.test(u || '') ? u : '');
  const dosyaAdi = (u) => String(u || '').split('?')[0].split('/').pop();
  const bloggerVariant = (url, width) => {
    const u = String(url || '');
    if (!BLOGGER.test(u)) return u;
    const w = Math.max(320, Math.min(1200, Number(width) || 480));
    const h = Math.round(w * 9 / 16);
    /* V7: Kaynak görselin kalite parametresini zorla düşürme; Blogger'ın varsayılan dönüşüm kalitesini koru. */
    return u.replace(/\/(?:s\d+(?:-[a-z0-9]+)*|w\d+(?:-[a-z0-9]+)*)\//i, '/w' + w + '-c-h' + h + '/');
  };
  const responsiveSet = (url) => [320,480,640,800,960,1200].map((w) => bloggerVariant(url,w) + ' ' + w + 'w').join(', ');
  /* Görsel varyantları responsive; URL'lerde -rw eki üretilmez. */
  /* Etiketteki bir özniteliğin değeri (src, srcset) */
  const oznitelik = (tag, ad) => {
    const m = tag.match(new RegExp('\\s' + ad + '="([^"]*)"', 'i'));
    return m ? m[1].replace(/&amp;/g, '&') : '';
  };
  /* srcset metni -> [{url, w}] (yalnızca Blogger adresleri) */
  const srcsetListesi = (s) => s.split(',')
    .map((p) => p.trim().split(/\s+/))
    .filter((p) => blogUrl(p[0]))
    .map((p) => ({ url: p[0], w: parseInt(p[1], 10) || 0 }));
  /* feed'in küçük resmi: görselin asıl fotoğrafını verir (birincil kaynak) */
const kucukUrl = (e) => (e.media$thumbnail && e.media$thumbnail.url) || '';
const icerikGorselleri = (e) => {
const html = (e.content && e.content.$t) || '';
return (html.match(/<img\b[^>]*>/gi) || [])
.map((t) => ({
src: blogUrl(oznitelik(t, 'src')),
srcset: srcsetListesi(oznitelik(t, 'srcset'))
}))
.filter((g) => g.src || g.srcset.length);
};
const kapakGorseli = (e) => {
const liste = icerikGorselleri(e);
const ad = dosyaAdi(kucukUrl(e));
const eslesen = ad
? liste.find((g) => dosyaAdi(g.src || (g.srcset[0] || {}).url) === ad)
: undefined;
return eslesen || liste[0] || null;
};
const buyukBaglanti = (e, src) => {
const html = (e.content && e.content.$t) || '';
const re = /<a\b[^>]*href="(https:\/\/blogger\.googleusercontent\.com\/img\/[^"]+)"[^>]*>\s*<img/gi;
    const ad = dosyaAdi(src);
    let m;
    while ((m = re.exec(html)) !== null) {
      if (dosyaAdi(m[1]) === ad) return m[1].replace(/&amp;/g, '&');
    }
    return '';
  };
  /* Bir yazı için görsel: birincil adres (BOYUT) ve yedek zincir.
     Birincil adres fotoğrafın asıl kaynağından (küçük resim, yoksa büyük sürüm) üretilir.
     Yedekler yazıdaki gerçek adreslerdir. */
  const gorselBilgi = (e) => {
    const kapak = kapakGorseli(e);
    const kucuk = kucukUrl(e);
    const yazida = kapak ? kapak.src : '';
    const srcsetUrls = kapak
      ? kapak.srcset.slice().sort((a, b) => b.w - a.w).map((c) => c.url)
      : [];
    const buyuk = kapak ? buyukBaglanti(e, yazida || srcsetUrls[0] || '') : '';
    // Önce içerikte zaten bulunan en büyük adresi dene; hiçbir yeni Blogger boyut varyantı üretme.
    const taban = srcsetUrls[0] || yazida || buyuk || kucuk || '';
    const zincir = uniq([taban, yazida, buyuk, ...srcsetUrls, kucuk]);
    return { src: zincir[0] || '', zincir };
  };
  const gorselVar = (e) => gorselBilgi(e).zincir.length > 0;
  /* <img> adres öznitelikleri: birincil adres + yedek zincir */
  const resimAttr = (b, slot, deferred) => {
    const yedek = b.zincir.slice(1).join(' ');
    const small = bloggerVariant(b.src, 480);
    const sizes = slot === 'hero' ? '(max-width:767px) 100vw, (max-width:1200px) 58vw, 720px' : '(max-width:767px) 46vw, (max-width:1200px) 25vw, 300px';
    const hasSet = BLOGGER.test(b.src || '');
    const srcAttr = deferred ? 'data-src' : 'src';
    const setAttr = deferred ? 'data-srcset' : 'srcset';
    const sizesAttr = deferred ? 'data-sizes' : 'sizes';
    const set = hasSet ? `${setAttr}="${esc(responsiveSet(b.src))}" ${sizesAttr}="${sizes}"` : '';
    return `${srcAttr}="${esc(small || b.src)}" ${set} data-fb="${esc(yedek)}"`;
  };
  /* ===== HTML üretimi ===== */
  const slaytHTML = (e, i) => {
    const yukleme = i === 0
      ? 'loading="eager" fetchpriority="high" decoding="async"'
      : 'loading="lazy" fetchpriority="auto" decoding="async"';
    const accessibleTitle = baslik(e) || 'Haberi aç';
    /* V6: İlk slayt hemen yüklenir; diğer yatay slaytların görsel URL'leri etkinleşene kadar data-* alanında kalır. */
    return `<div class="slayt"><a aria-label="${esc(accessibleTitle)}" title="${esc(accessibleTitle)}" href="${esc(linkOf(e))}" target="_blank" rel="noopener">` +
      `<img ${resimAttr(gorselBilgi(e), 'hero', i !== 0)} alt="${esc(accessibleTitle)}" width="1200" height="675" ${yukleme} ` +
      `noimageindex="true" noindex="true"></a></div>`;
  };
  const dortluKartHTML = (e) => {
    const title = baslik(e);
    const accessibleTitle = title || 'Haberi aç';
    return `<a class="hv-home-grid-card" aria-label="${esc(accessibleTitle)}" title="${esc(accessibleTitle)}" href="${esc(linkOf(e))}" target="_blank" rel="noopener">` +
      `<span class="hv-home-grid-thumb"><img ${resimAttr(gorselBilgi(e), 'card')} alt="${esc(accessibleTitle)}" width="480" height="270" loading="lazy" decoding="async"></span>` +
      `<span class="hv-home-grid-card-title"><span class="hv-home-grid-card-title-text">${esc(title)}</span></span></a>`;
  };
  /* ===== Yedek adres ===== */
  /* Adres yüklenemezse zincirdeki sıradaki adrese geçer; hepsi bozuksa görseli gizler */
  const gorselHatasi = (ev) => {
    const img = ev.target;
    if (!img || img.tagName !== 'IMG') return;
    const kalan = (img.getAttribute('data-fb') || '').split(' ').filter(Boolean);
    const sonraki = kalan.shift();
    img.removeAttribute('srcset');
    img.removeAttribute('sizes');
    img.setAttribute('data-fb', kalan.join(' '));
    if (sonraki) { img.src = bloggerVariant(sonraki, 480); }
    else img.style.visibility = 'hidden';
  };
  /* ===== Slider ===== */
  let slaytlar = [];
  let suankiSira = 0;
  /* V6: Yalnızca aktif slayt ve sıradaki slayt için resim isteği başlatılır. */
  const yukleSlaytGorseli = (index) => {
    const kap = el('sliderSarici');
    if (!kap) return;
    const images = kap.querySelectorAll('.slayt img');
    const img = images[index];
    if (!img || img.dataset.hvLoadStarted === '1' || img.getAttribute('src') || img.getAttribute('srcset')) return;
    const source = img.getAttribute('data-src') || '';
    const sourceSet = img.getAttribute('data-srcset') || '';
    const sizes = img.getAttribute('data-sizes') || '';
    img.loading = 'eager';
    if (sourceSet) {
      if (sizes) img.setAttribute('sizes', sizes);
      img.setAttribute('srcset', sourceSet);
    } else if (source) {
      img.setAttribute('src', source);
    }
    img.dataset.hvLoadStarted = '1';
    img.removeAttribute('data-src');
    img.removeAttribute('data-srcset');
    img.removeAttribute('data-sizes');
  };
  const siradakiSlaytGorseliniHazirla = () => {
    if (!slaytlar.length) return;
    const kap = el('sliderSarici');
    const images = kap ? kap.querySelectorAll('.slayt img') : [];
    const active = images[suankiSira];
    if (!active) return;
    const schedule = () => {
      const nextIndex = (suankiSira + 1) % slaytlar.length;
      const start = () => yukleSlaytGorseli(nextIndex);
      if (typeof window.requestIdleCallback === 'function') window.requestIdleCallback(start, { timeout: 1600 });
      else window.setTimeout(start, 500);
    };
    if (!active.complete && active.getAttribute('src') && active.dataset.hvWarmListener !== '1') {
      active.dataset.hvWarmListener = '1';
      active.addEventListener('load', schedule, { once: true });
      active.addEventListener('error', schedule, { once: true });
    } else {
      schedule();
    }
  };
  const arayuzGuncelle = () => {
    yukleSlaytGorseli(suankiSira);
    const sarici = el('sliderSarici');
    if (sarici) sarici.style.transform = `translateX(-${suankiSira * 100}%)`;
    const metin = baslik(slaytlar[suankiSira] || {});
    el('sliderBaslikDesktop').textContent = metin;
    el('sliderBaslikMobil').textContent = metin;
    document.querySelectorAll('.numara-butonu')
      .forEach((b, i) => b.classList.toggle('aktif', i === suankiSira));
    siradakiSlaytGorseliniHazirla();
  };
  /* Global: HTML onclick ve otomatik geçiş için */
  window.slaytDegistir = (n) => {
    if (!slaytlar.length) return;
    suankiSira = (suankiSira + n + slaytlar.length) % slaytlar.length;
    arayuzGuncelle();
  };
  window.numarayaGit = (i) => {
    suankiSira = i;
    arayuzGuncelle();
  };
  /* İlk slaytın görseli (LCP) sayfa açılır açılmaz istenir */
  const preloadLcp = (e) => {
    const b = gorselBilgi(e);
    if (!b.src || document.querySelector('link[data-hv-lcp-preload="1"]')) return;
    const l = document.createElement('link');
    l.rel = 'preload';
    l.as = 'image';
    l.href = b.src;
    /* V6: Preload and <img> share srcset/sizes so the browser does not fetch an extra full-size variant. */
    if (BLOGGER.test(b.src)) {
      l.setAttribute('imagesrcset', responsiveSet(b.src));
      l.setAttribute('imagesizes', '(max-width:767px) 100vw, (max-width:1200px) 58vw, 720px');
    }
    l.setAttribute('fetchpriority', 'high');
    l.setAttribute('data-hv-lcp-preload', '1');
    document.head.appendChild(l);
  };
  const render = (liste) => {
    const tumHaberler = (liste || []).slice();
    /* Blog1'in ilk 16 yayını iki alana dağıtılır: 12 slider + 4 haber kartı.
       İlk 16 kayıttan sonra sonsuz yükleme 17. yayından devam eder. */
    slaytlar = tumHaberler.slice(0, 12);
    const dortluKartlar = tumHaberler.slice(12, 16);
    if (!slaytlar.length) return;
    const sliderKap = el('sliderSarici');
    const dortluKap = el('hv-home-blog1-four-grid');
    if (!sliderKap) return;
    /* Hata dinleyicileri, görseller eklenmeden önce bağlanır. */
    [sliderKap, dortluKap].filter(Boolean).forEach((k) => k.addEventListener('error', gorselHatasi, true));
    sliderKap.innerHTML = slaytlar.map(slaytHTML).join('');
    el('sliderNumaralar').innerHTML = slaytlar.map((_, i) =>
      `<div class="numara-butonu${i === 0 ? ' aktif' : ''}" onclick="numarayaGit(${i})" aria-label="Slayt Git ${i + 1}">${i + 1}</div>`
    ).join('');
    if (dortluKap) dortluKap.innerHTML = dortluKartlar.map(dortluKartHTML).join('');
    /* CLS: içeriğe ait placeholder boyut kısıtlamalarını kaldır. */
    const kutu = document.querySelector('.slider-kutu');
    if (kutu) kutu.classList.add('yuklendi');
    suankiSira = 0;
    arayuzGuncelle();
  };
  /* ===== Piyasa şeridi ===== */
  const onceki = {};
  const oncekiPct = {};
  const oncekiDirection = {};
  const fmt = (v, dec) => (v != null)
    ? v.toLocaleString('tr-TR', { minimumFractionDigits: dec, maximumFractionDigits: dec })
    : '---';
  const set = (key, val, ch, dec) => {
    const vel = el('v-' + key);
    const cel = el('c-' + key);
    const box = el('cell-' + key);
    const unit = el('unit-' + key);
    if (!vel || !cel || !box) return;
    const numericChange = Number(ch);
    const isUp = Number.isFinite(numericChange) ? numericChange >= 0 : true;
    /* Fiyat hassasiyeti masaüstü ve mobilde aynıdır; Worker'dan gelen alanlar doğrudan kullanılır. */
    const txt = fmt(val == null ? null : Number(val), dec);
    const pct = '% ' + Math.abs(Number.isFinite(numericChange) ? numericChange : 0).toLocaleString('tr-TR', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
    const changed = onceki[key] !== undefined &&
      (onceki[key] !== txt || oncekiPct[key] !== pct || oncekiDirection[key] !== isUp);
    onceki[key] = txt;
    oncekiPct[key] = pct;
    oncekiDirection[key] = isUp;
    vel.textContent = txt;
    vel.classList.toggle('up', isUp);
    vel.classList.toggle('dn', !isUp);
    if (unit) {
      unit.classList.toggle('up', isUp);
      unit.classList.toggle('dn', !isUp);
    }
    const pctEl = cel.querySelector('.eco-pct');
    if (pctEl) pctEl.textContent = pct;
    cel.className = 'eco-chg ' + (isUp ? 'up' : 'dn');
    box.classList.remove('up', 'dn');
    box.classList.add(isUp ? 'up' : 'dn');
    if (changed) {
      cel.classList.remove('eco-pulse');
      box.classList.remove('eco-pulse');
      void cel.offsetWidth;
      void box.offsetWidth;
      cel.classList.add('eco-pulse');
      box.classList.add('eco-pulse');
      if (unit) {
        unit.classList.remove('eco-pulse');
        void unit.offsetWidth;
        unit.classList.add('eco-pulse');
      }
    }
  };
  const loadEco = () => {
    fetch(EKO_URL, { cache: 'no-store' })
      .then((r) => r.json())
      .then((d) => {
        set('bist', d.bist && d.bist.value, d.bist && d.bist.change, 2);
        set('usd', d.usd && d.usd.value, d.usd && d.usd.change, 4);
        set('eur', d.eur && d.eur.value, d.eur && d.eur.change, 4);
        set('gold', d.gold && d.gold.value, d.gold && d.gold.change, 2);
        set('btc', d.btc && d.btc.price, d.btc && d.btc.change, 2);
        set('brent', d.brent && d.brent.value, d.brent && d.brent.change, 2);
        set('eth', d.eth && d.eth.price, d.eth && d.eth.change, 2);
        set('ons', d.ons && d.ons.value, d.ons && d.ons.change, 2);
        set('ceyrek', d.ceyrek && d.ceyrek.value, d.ceyrek && d.ceyrek.change, 2);
      })
      .catch(() => {});
  };
  /* ===== Başlatma ===== */
  /* Ana sayfa slider sayısı Blog1'in Blogger ayarıyla oluşturulan yayın adedine göre belirlenir. */
  const nativeBlog1Entries = () => {
    const root = document.querySelector('#Blog1 .post-filter-wrap .grid-posts')
      || document.querySelector('#Blog1 .blog-posts .grid-posts')
      || document.querySelector('#Blog1 .grid-posts');
    if (!root) return [];
    let cards = Array.from(root.querySelectorAll(':scope > article.blog-post.post-filter'));
    if (!cards.length) cards = Array.from(document.querySelectorAll('#Blog1 article.blog-post.post-filter'));
    if (!cards.length) cards = Array.from(document.querySelectorAll('#Blog1 .post-outer-container'));
    const fallbackImage = 'https://4.bp.blogspot.com/-O3EpVMWcoKw/WxY6-6I4--I/AAAAAAAAB2s/KzC0FqUQtkMdw7VzT6oOR_8vbZO6EJc-A/w405/nth.png';
    return cards.map((card) => {
      const a = card.querySelector('.entry-title a[href], h1 a[href], h2 a[href], h3 a[href], a[rel~="bookmark"][href]');
      if (!a) return null;
      const img = card.querySelector('.post-filter-image img.snip-thumbnail, .post-filter-image img, img.snip-thumbnail, img');
      let srcset = img ? (img.getAttribute('srcset') || img.getAttribute('data-srcset') || '') : '';
      const candidates = srcset.split(',').map((part) => {
        const pair = part.trim().split(/\s+/);
        return { url: pair[0] || '', width: pair[1] && /w$/.test(pair[1]) ? parseInt(pair[1], 10) || 0 : 0 };
      }).filter((item) => /^https?:|^\/\//i.test(item.url));
      candidates.sort((x, y) => y.width - x.width);
      let image = (candidates[0] && candidates[0].url)
        || (img && (img.getAttribute('data-src') || img.getAttribute('data-original') || img.getAttribute('src')))
        || fallbackImage;
      if (/^data:/i.test(image)) image = fallbackImage;
      const title = (a.textContent || a.getAttribute('title') || '').trim();
      const safeImage = esc(image);
      const safeSet = srcset ? ' srcset="' + esc(srcset) + '"' : '';
      const html = '<img src="' + safeImage + '"' + safeSet + ' />';
      const time = card.querySelector('time[datetime], .post-date[datetime], [datetime]');
      return {
        title: { $t: title },
        link: [{ rel: 'alternate', href: a.href }],
        content: { $t: html },
        summary: { $t: html },
        published: { $t: time ? (time.getAttribute('datetime') || time.textContent || '') : '' },
        'media$thumbnail': { url: image }
      };
    }).filter(Boolean);
  };
  const feedP = new Promise((resolve) => {
    domHazir(() => {
      const nativeEntries = nativeBlog1Entries();
      /* Blog1, Blogger'da ayarlanan başlangıç yayınlarını kaynak olarak verir.
         İlk 12 yayın slidera, sonraki 4 yayın alt grid'e ayrılır.
         İlk 16 kayıttan sonra sonsuz yükleme 17. yayından devam eder. */
      if (nativeEntries.length) {
        resolve({ feed: { entry: nativeEntries } });
        return;
      }
      /* DOM kartları henüz okunamadıysa, Blog1'deki gerçek kart adedini ölçerek yalnızca o kadar feed kaydı al. */
      const renderedArticleCards = document.querySelectorAll('#Blog1 article.blog-post.post-filter');
      const renderedPostWrappers = document.querySelectorAll('#Blog1 .post-outer-container');
      const requestedCount = renderedArticleCards.length || renderedPostWrappers.length;
      if (!requestedCount) {
        resolve({ feed: { entry: [] } });
        return;
      }
      const fallbackUrl = '/feeds/posts/default?alt=json&max-results=' + requestedCount + '&orderby=published';
      fetch(fallbackUrl)
        .then((r) => r.ok ? r.json() : null)
        .then((data) => {
          const feedEntries = (data && data.feed && data.feed.entry) || [];
          resolve({ feed: { entry: feedEntries.slice(0, requestedCount) } });
        })
        .catch(() => resolve({ feed: { entry: [] } }));
    });
  });
  feedP.then((d) => {
    const entries = ((d && d.feed && d.feed.entry) || []);
    const liste = entries.filter(gorselVar);
    window.HVHomeFeedEntries = liste;
    window.dispatchEvent(new CustomEvent('hv-home-feed-ready', { detail: liste }));
    if (liste[0]) preloadLcp(liste[0]);
    domHazir(() => render(liste));
  });
  domHazir(() => {
    loadEco();
    setInterval(loadEco, EKO_MS);
    setInterval(() => window.slaytDegistir(1), SLAYT_MS);
  });
})();
//]]]]><![CDATA[>
  };

  window.HVRunExternalJSPart = function (id) {
    var part = parts[id];
    if (typeof part !== 'function') throw new Error('Haberlerver JS parcasi bulunamadi: ' + id);
    return part.call(window);
  };
})(window);
