const PptxGenJS = require('pptxgenjs');
const path = require('path');
const fs = require('fs');

const pptx = new PptxGenJS();
pptx.defineLayout({ name: 'WIDE', width: 13.33, height: 7.5 });
pptx.layout = 'WIDE';

const SHOT_DIR = 'C:\\Users\\YSJ\\WorkBuddy\\Claw\\stemcell-kb\\screenshots\\';
const OUT = 'C:\\Users\\YSJ\\WorkBuddy\\Claw\\stemcell-kb\\';

const C = {
  bg: '0A0F1A', cyan: '00E5FF', white: 'E0E0E0', light: '8A9BB0',
  card: '121A2A', cardLine: '1A2A3F',
  purple: 'AFA9EC', green: '5DCAA5', blue: '85B7EB', orange: 'F0997B', pink: 'ED93B1',
  purpleD: '3C3489', greenD: '085041', blueD: '0C447C', orangeD: '712B13',
};

pptx.defineSlideMaster({
  title: 'DARK',
  background: { color: C.bg },
  objects: [
    { rect: { x: 0, y: 0, w: '100%', h: '100%', fill: { color: C.bg } } },
  ],
  slideNumber: { x: 12.5, y: 7.05, w: 0.6, h: 0.3, fontSize: 9, color: C.light, align: 'right' },
});

function footer(slide, pageNum) {
  slide.addText('CGT知识库平台 · 使用培训', {
    x: 0.5, y: 7.05, w: 6, h: 0.3, fontSize: 9, color: C.light, fontFace: '微软雅黑', align: 'left'
  });
  slide.addText(pageNum + ' / 25', {
    x: 12.0, y: 7.05, w: 0.8, h: 0.3, fontSize: 9, color: C.light, fontFace: '微软雅黑', align: 'right'
  });
}

function titleBar(slide, title, accent) {
  slide.addShape('roundRect', {
    x: 0.5, y: 0.3, w: 0.08, h: 0.55, fill: { color: accent || C.cyan }, line: { width: 0 }
  });
  slide.addText(title, {
    x: 0.75, y: 0.3, w: 12.0, h: 0.55,
    fontSize: 26, color: C.cyan, fontFace: '微软雅黑', bold: true, align: 'left', valign: 'middle'
  });
}

function shotExists(name) {
  return fs.existsSync(path.join(SHOT_DIR, name));
}

function imgPath(name) {
  return path.join(SHOT_DIR, name);
}

// Layout A: Cover
function coverSlide() {
  const slide = pptx.addSlide({ masterName: 'DARK' });
  if (shotExists('opencgt-3d-upgraded.png')) {
    slide.addImage({ path: imgPath('opencgt-3d-upgraded.png'), x: 0, y: 0, w: 13.33, h: 7.5, sizing: { type: 'cover', w: 13.33, h: 7.5 } });
  }
  slide.addShape('rect', { x: 0, y: 0, w: 13.33, h: 7.5, fill: { color: C.bg, transparency: 35 }, line: { width: 0 } });
  slide.addText('CGT 知识库平台', {
    x: 1.0, y: 2.2, w: 11.33, h: 1.0,
    fontSize: 44, color: C.cyan, fontFace: '微软雅黑', bold: true, align: 'center', valign: 'middle'
  });
  slide.addText('使用培训 · 研究人员与临床医生指南', {
    x: 1.0, y: 3.3, w: 11.33, h: 0.6,
    fontSize: 22, color: C.white, fontFace: '微软雅黑', align: 'center', valign: 'middle'
  });
  slide.addText('https://1984331-bit.github.io/stemcell-kb/', {
    x: 1.0, y: 5.8, w: 11.33, h: 0.4,
    fontSize: 14, color: C.light, fontFace: '微软雅黑', align: 'center'
  });
  slide.addText('2026年7月', {
    x: 1.0, y: 6.3, w: 11.33, h: 0.4,
    fontSize: 14, color: C.light, fontFace: '微软雅黑', align: 'center'
  });
  return slide;
}

// Layout B: TOC
function tocSlide() {
  const slide = pptx.addSlide({ masterName: 'DARK' });
  titleBar(slide, '今日培训内容');
  const items = [
    { num: '01', title: '平台是什么', desc: '定位 · 核心数据 · 五大板块', color: C.green },
    { num: '02', title: '文献库实操', desc: '搜索 · 证据分级 · 全文解读', color: C.cyan },
    { num: '03', title: '监管政策与备案', desc: '818号令 · 备案机构 · 临床招募', color: C.orange },
    { num: '04', title: '获批产品与精选', desc: '28款产品 · 编辑精选解读', color: C.purple },
    { num: '05', title: 'AI看板实操', desc: '10个智能体 · 文献综述 · 试验设计', color: C.blue },
    { num: '06', title: '生态与日常使用', desc: 'Open CGT · 实验室 · 手机端 · 日报', color: C.pink },
  ];
  items.forEach((item, i) => {
    const col = i % 2;
    const row = Math.floor(i / 2);
    const x = 0.8 + col * 6.2;
    const y = 1.3 + row * 1.85;
    slide.addShape('roundRect', { x, y, w: 5.8, h: 1.55, fill: { color: C.card }, line: { color: C.cardLine, width: 1 }, rectRadius: 0.1 });
    slide.addShape('roundRect', { x: x + 0.2, y: y + 0.25, w: 0.9, h: 1.05, fill: { color: item.color, transparency: 75 }, line: { color: item.color, width: 1 }, rectRadius: 0.08 });
    slide.addText(item.num, { x: x + 0.2, y: y + 0.25, w: 0.9, h: 1.05, fontSize: 28, color: item.color, fontFace: '微软雅黑', bold: true, align: 'center', valign: 'middle' });
    slide.addText(item.title, { x: x + 1.3, y: y + 0.25, w: 4.3, h: 0.5, fontSize: 18, color: C.white, fontFace: '微软雅黑', bold: true, align: 'left', valign: 'middle' });
    slide.addText(item.desc, { x: x + 1.3, y: y + 0.75, w: 4.3, h: 0.5, fontSize: 13, color: C.light, fontFace: '微软雅黑', align: 'left', valign: 'middle' });
  });
  footer(slide, 2);
  return slide;
}

// Layout C/D: Screenshot + Text (left or right)
function screenshotSlide(title, bullets, imageName, side, accent, pageNum) {
  const slide = pptx.addSlide({ masterName: 'DARK' });
  titleBar(slide, title, accent);
  const isLeft = side !== 'right';
  const txtX = isLeft ? 0.6 : 7.2;
  const imgX = isLeft ? 6.0 : 0.6;
  const txtW = 5.0;
  const imgW = 6.7;

  const n = bullets.length;
  const rowH = n > 5 ? Math.min(1.05, 5.3 / n) : 1.05;
  const cardH = rowH - 0.12;
  const fSize = n > 5 ? 12 : 14;
  const cSize = n > 5 ? 0.38 : 0.45;
  const cOff = n > 5 ? 0.12 : 0.22;
  const cPad = n > 5 ? 0.6 : 0.75;

  bullets.forEach((b, i) => {
    const by = 1.3 + i * rowH;
    slide.addShape('roundRect', { x: txtX, y: by, w: txtW, h: cardH, fill: { color: C.card }, line: { color: C.cardLine, width: 0.5 }, rectRadius: 0.08 });
    slide.addShape('circle', { x: txtX + 0.15, y: by + cOff, w: cSize, h: cSize, fill: { color: accent || C.cyan, transparency: 70 }, line: { color: accent || C.cyan, width: 1 } });
    slide.addText(String(i + 1), { x: txtX + 0.15, y: by + cOff, w: cSize, h: cSize, fontSize: n > 5 ? 11 : 14, color: accent || C.cyan, fontFace: '微软雅黑', bold: true, align: 'center', valign: 'middle' });
    slide.addText(b, { x: txtX + cPad, y: by, w: txtW - cPad - 0.15, h: cardH, fontSize: fSize, color: C.white, fontFace: '微软雅黑', align: 'left', valign: 'middle', lineSpacing: n > 5 ? 14 : 18 });
  });

  if (shotExists(imageName)) {
    slide.addShape('roundRect', { x: imgX, y: 1.2, w: imgW, h: 5.6, fill: { color: C.card }, line: { color: C.cardLine, width: 1 }, rectRadius: 0.1 });
    slide.addImage({ path: imgPath(imageName), x: imgX + 0.1, y: 1.3, w: imgW - 0.2, h: 5.4, sizing: { type: 'contain', w: imgW - 0.2, h: 5.4 } });
  } else {
    slide.addShape('roundRect', { x: imgX, y: 1.2, w: imgW, h: 5.6, fill: { color: C.card }, line: { color: C.cardLine, width: 1 }, rectRadius: 0.1 });
    slide.addText('[截图待补充]', { x: imgX, y: 1.2, w: imgW, h: 5.6, fontSize: 16, color: C.light, fontFace: '微软雅黑', align: 'center', valign: 'middle' });
  }
  footer(slide, pageNum);
  return slide;
}

// Layout E: Icon list
function iconListSlide(title, items, accent, pageNum) {
  const slide = pptx.addSlide({ masterName: 'DARK' });
  titleBar(slide, title, accent);
  const rowH = 5.4 / items.length;
  items.forEach((item, i) => {
    const y = 1.3 + i * rowH;
    slide.addShape('roundRect', { x: 0.8, y: y + 0.05, w: 11.73, h: rowH - 0.15, fill: { color: C.card }, line: { color: C.cardLine, width: 0.5 }, rectRadius: 0.06 });
    slide.addShape('circle', { x: 1.1, y: y + rowH / 2 - 0.3, w: 0.6, h: 0.6, fill: { color: item.color || accent || C.cyan, transparency: 70 }, line: { color: item.color || accent || C.cyan, width: 1 } });
    slide.addText(item.icon || String(i + 1), { x: 1.1, y: y + rowH / 2 - 0.3, w: 0.6, h: 0.6, fontSize: 16, color: item.color || accent || C.cyan, fontFace: '微软雅黑', bold: true, align: 'center', valign: 'middle' });
    slide.addText(item.title, { x: 2.0, y: y + 0.05, w: 4.0, h: rowH - 0.15, fontSize: 16, color: C.white, fontFace: '微软雅黑', bold: true, align: 'left', valign: 'middle' });
    slide.addText(item.desc, { x: 6.2, y: y + 0.05, w: 6.0, h: rowH - 0.15, fontSize: 13, color: C.light, fontFace: '微软雅黑', align: 'left', valign: 'middle', lineSpacing: 16 });
  });
  footer(slide, pageNum);
  return slide;
}

// Layout F: Data stats
function dataSlide(title, intro, stats, pageNum) {
  const slide = pptx.addSlide({ masterName: 'DARK' });
  titleBar(slide, title);
  if (intro) {
    slide.addText(intro, { x: 0.8, y: 1.1, w: 11.73, h: 0.5, fontSize: 16, color: C.white, fontFace: '微软雅黑', align: 'left', valign: 'middle' });
  }
  const cols = 3;
  const rows = Math.ceil(stats.length / cols);
  const cardW = 3.65, cardH = 2.1, gapX = 0.3, gapY = 0.35;
  const startX = (13.33 - cols * cardW - (cols - 1) * gapX) / 2;
  const startY = 1.8;
  stats.forEach((s, i) => {
    const col = i % cols;
    const row = Math.floor(i / cols);
    const x = startX + col * (cardW + gapX);
    const y = startY + row * (cardH + gapY);
    slide.addShape('roundRect', { x, y, w: cardW, h: cardH, fill: { color: C.card }, line: { color: s.color || C.cyan, width: 1 }, rectRadius: 0.12 });
    slide.addText(s.number, { x, y: y + 0.3, w: cardW, h: 0.9, fontSize: 44, color: s.color || C.cyan, fontFace: '微软雅黑', bold: true, align: 'center', valign: 'middle' });
    slide.addText(s.label, { x, y: y + 1.25, w: cardW, h: 0.6, fontSize: 14, color: C.white, fontFace: '微软雅黑', align: 'center', valign: 'middle' });
  });
  footer(slide, pageNum);
  return slide;
}

// Layout G: Steps
function stepsSlide(title, steps, accent, pageNum) {
  const slide = pptx.addSlide({ masterName: 'DARK' });
  titleBar(slide, title, accent);
  const stepW = 2.15, gap = 0.25;
  const startX = (13.33 - steps.length * stepW - (steps.length - 1) * gap) / 2;
  steps.forEach((s, i) => {
    const x = startX + i * (stepW + gap);
    const y = 1.5;
    slide.addShape('roundRect', { x, y, w: stepW, h: 4.5, fill: { color: C.card }, line: { color: accent || C.cyan, width: 1 }, rectRadius: 0.1 });
    slide.addShape('circle', { x: x + stepW / 2 - 0.4, y: y + 0.3, w: 0.8, h: 0.8, fill: { color: accent || C.cyan, transparency: 60 }, line: { color: accent || C.cyan, width: 1.5 } });
    slide.addText(String(i + 1), { x: x + stepW / 2 - 0.4, y: y + 0.3, w: 0.8, h: 0.8, fontSize: 24, color: accent || C.cyan, fontFace: '微软雅黑', bold: true, align: 'center', valign: 'middle' });
    slide.addText(s.title, { x: x + 0.15, y: y + 1.3, w: stepW - 0.3, h: 0.6, fontSize: 15, color: C.white, fontFace: '微软雅黑', bold: true, align: 'center', valign: 'middle' });
    slide.addText(s.desc, { x: x + 0.15, y: y + 2.0, w: stepW - 0.3, h: 2.2, fontSize: 12, color: C.light, fontFace: '微软雅黑', align: 'center', valign: 'top', lineSpacing: 16 });
    if (i < steps.length - 1) {
      slide.addText('\u2192', { x: x + stepW - 0.05, y: y + 1.8, w: 0.3, h: 0.4, fontSize: 20, color: accent || C.cyan, fontFace: '微软雅黑', align: 'center', valign: 'middle' });
    }
  });
  footer(slide, pageNum);
  return slide;
}

// Layout H: Grid cards
function gridSlide(title, items, cols, accent, pageNum) {
  const slide = pptx.addSlide({ masterName: 'DARK' });
  titleBar(slide, title, accent);
  const rows = Math.ceil(items.length / cols);
  const cardW = cols === 2 ? 5.8 : 3.65;
  const cardH = rows === 2 ? 2.55 : 1.85;
  const gapX = 0.3, gapY = 0.3;
  const startX = (13.33 - cols * cardW - (cols - 1) * gapX) / 2;
  const startY = 1.3;
  items.forEach((item, i) => {
    const col = i % cols;
    const row = Math.floor(i / cols);
    const x = startX + col * (cardW + gapX);
    const y = startY + row * (cardH + gapY);
    const itemColor = item.color || accent || C.cyan;
    slide.addShape('roundRect', { x, y, w: cardW, h: cardH, fill: { color: C.card }, line: { color: itemColor, width: 1 }, rectRadius: 0.1 });
    slide.addShape('roundRect', { x: x + 0.2, y: y + 0.2, w: 0.5, h: 0.5, fill: { color: itemColor, transparency: 70 }, line: { color: itemColor, width: 1 }, rectRadius: 0.06 });
    slide.addText(item.icon || '!', { x: x + 0.2, y: y + 0.2, w: 0.5, h: 0.5, fontSize: 14, color: itemColor, fontFace: '微软雅黑', bold: true, align: 'center', valign: 'middle' });
    slide.addText(item.title, { x: x + 0.85, y: y + 0.15, w: cardW - 1.1, h: 0.55, fontSize: 16, color: C.white, fontFace: '微软雅黑', bold: true, align: 'left', valign: 'middle' });
    slide.addText(item.desc, { x: x + 0.25, y: y + 0.8, w: cardW - 0.5, h: cardH - 1.0, fontSize: 13, color: C.light, fontFace: '微软雅黑', align: 'left', valign: 'top', lineSpacing: 16 });
  });
  footer(slide, pageNum);
  return slide;
}

// Layout I: Closing
function closingSlide() {
  const slide = pptx.addSlide({ masterName: 'DARK' });
  if (shotExists('opencgt-3d-upgraded.png')) {
    slide.addImage({ path: imgPath('opencgt-3d-upgraded.png'), x: 0, y: 0, w: 13.33, h: 7.5, sizing: { type: 'cover', w: 13.33, h: 7.5 } });
  }
  slide.addShape('rect', { x: 0, y: 0, w: 13.33, h: 7.5, fill: { color: C.bg, transparency: 40 }, line: { width: 0 } });
  slide.addText('互动答疑', {
    x: 1.0, y: 1.5, w: 11.33, h: 0.8,
    fontSize: 36, color: C.cyan, fontFace: '微软雅黑', bold: true, align: 'center', valign: 'middle'
  });
  slide.addText('感谢您的参与', {
    x: 1.0, y: 2.5, w: 11.33, h: 0.6,
    fontSize: 20, color: C.white, fontFace: '微软雅黑', align: 'center', valign: 'middle'
  });
  const infos = [
    { label: '网站地址', value: 'https://1984331-bit.github.io/stemcell-kb/' },
    { label: '每日日报', value: '公众号「CGT知识库」每日推送' },
    { label: '研究者社群', value: '微信群「CGT研究者交流群」' },
    { label: '合作咨询', value: 'Open CGT 联盟 · 在建实验室合作' },
  ];
  infos.forEach((info, i) => {
    const y = 3.6 + i * 0.6;
    slide.addText(info.label + '：', { x: 3.5, y, w: 2.5, h: 0.5, fontSize: 14, color: C.cyan, fontFace: '微软雅黑', bold: true, align: 'right', valign: 'middle' });
    slide.addText(info.value, { x: 6.0, y, w: 5.0, h: 0.5, fontSize: 14, color: C.white, fontFace: '微软雅黑', align: 'left', valign: 'middle' });
  });
  slide.addText('扫码访问平台', {
    x: 1.0, y: 6.3, w: 11.33, h: 0.4,
    fontSize: 12, color: C.light, fontFace: '微软雅黑', align: 'center'
  });
  return slide;
}

// ===== 25 PAGES =====

// P01: Cover
coverSlide();

// P02: TOC
tocSlide();

// P03: Pain points (grid 2x2)
gridSlide('你是否遇到这些问题？', [
  { icon: '?', title: '文献太多找不到', desc: 'CGT领域数万篇文献分散在PubMed、知网、各期刊官网，检索一条适应症的文献需要数小时', color: C.orange },
  { icon: '?', title: '临床试验数据分散', desc: '没有系统化的MSC/CAR-T临床试验数据库，入组人数、剂量、终点数据难以横向对比', color: C.pink },
  { icon: '?', title: '政策更新跟不上', desc: '818号令、FDA、EMA政策频繁更新，缺乏一站式政策追踪与解读工具', color: C.purple },
  { icon: '?', title: '缺少专业AI工具', desc: '通用AI不了解CGT专业知识，文献综述和试验设计仍靠人工逐篇阅读', color: C.blue },
], 2, C.orange, 3);

// P04: Platform positioning (data stats)
dataSlide('CGT知识库平台 · 你的CGT研究助手',
  '中国首个CGT领域AI驱动的专业知识库，整合文献、政策、产品、AI工具于一体',
  [
    { number: '730+', label: '临床试验文献', color: C.cyan },
    { number: '19', label: '生理系统覆盖', color: C.green },
    { number: '137+', label: '适应症分类', color: C.blue },
    { number: '28', label: '全球获批产品', color: C.purple },
    { number: '21', label: '核心监管政策', color: C.orange },
    { number: '10', label: 'AI智能体', color: C.pink },
  ], 4);

// P05: Five sections overview (screenshot left, text right)
screenshotSlide('五大板块 · 一站式CGT知识中枢', [
  '临床试验数据：730篇文献，19个生理系统，137+适应症',
  '监管政策汇编：818号令/FDA/EMA/NMPA共21份文件',
  '获批产品名录：28款全球CGT产品，含MSC/CAR-T/iPSC',
  '编辑精选：每期5+5篇重要文献与前沿资讯深度解读',
  'AI看板：10个AI智能体覆盖文献/试验/监管/产业',
  '新增：在建实验室 · 商业蓝图 · Open CGT联盟',
], 'home-with-new-entries.png', 'right', C.cyan, 5);

// P06: Literature entrance (screenshot right, text left)
screenshotSlide('文献库 · 19系统全覆盖入口', [
  '左侧导航：19个生理系统一键定位（循环/神经/免疫等）',
  '顶部分类：MSC / CAR-T / 基因治疗，按细胞类型筛选',
  '统计卡片：每个系统/适应症的文献数量与证据等级',
  '搜索框：支持标题、作者、期刊、PMID、适应症多字段检索',
], 'literature-viewport.png', 'left', C.cyan, 6);

// P07: Literature search methods (icon list)
iconListSlide('文献库 · 三种搜索方式', [
  { icon: '1', title: '按系统浏览', desc: '左侧19个生理系统导航，从循环系统到罕见病，点击即进入对应分类的文献列表', color: C.cyan },
  { icon: '2', title: '按适应症搜索', desc: '在搜索框输入适应症关键词，如「心肌梗死」「糖尿病」「肝硬化」，快速定位相关文献', color: C.green },
  { icon: '3', title: '多字段检索', desc: '支持标题、作者、期刊名、PMID编号等多字段组合搜索，精确找到目标文献', color: C.blue },
  { icon: '\u2605', title: '搜索技巧', desc: '英文关键词检索效果更佳（如 mesenchymal stem cell acute myocardial infarction），可配合系统筛选缩小范围', color: C.orange },
], C.cyan, 7);

// P08: Evidence grading (grid 2x2)
gridSlide('文献库 · 证据分级体系', [
  { icon: 'I', title: 'I级证据 · RCT', desc: '随机对照试验，最高等级证据。平台标注入组人数、分组方式、主要终点数值及P值', color: C.green },
  { icon: 'II', title: 'II级证据 · Meta分析', desc: '系统综述与Meta分析，整合多项RCT结果。平台标注纳入研究数、总样本量、效应量', color: C.cyan },
  { icon: 'III', title: 'III级证据 · 队列研究', desc: '前瞻性/回顾性队列研究、病例对照研究。平台标注随访时间、对照组设计', color: C.blue },
  { icon: 'IV', title: 'IV级证据 · 病例报告', desc: '病例报告与病例系列，提供早期临床探索数据。平台标注病例数、给药方式、安全性事件', color: C.orange },
], 2, C.green, 8);

// P09: Full-text interpretation (icon list)
iconListSlide('文献库 · 每篇文献的结构化解读', [
  { icon: '\u2713', title: '入组人数与分组', desc: '明确标注总入组人数、试验组与对照组样本量、随机化方式', color: C.cyan },
  { icon: '\u2713', title: '细胞类型与剂量', desc: '标注细胞来源（BM/UC/AD-MSC等）、具体细胞数或百万/kg剂量、传代次数', color: C.green },
  { icon: '\u2713', title: '给药途径与次数', desc: '静脉输注/局部注射/动脉灌注等给药方式，单次或多次给药方案', color: C.blue },
  { icon: '\u2713', title: '主要终点数据', desc: 'ABI/TcPO2/截肢率/溃疡愈合率/步行距离/VAS评分等具体数值与P值', color: C.purple },
  { icon: '\u2713', title: '安全性事件', desc: '不良事件发生率、严重不良事件、与细胞治疗的相关性评估', color: C.orange },
], C.cyan, 9);

// P10: Regulations (screenshot right)
screenshotSlide('监管政策汇编 · 21份核心文件', [
  '覆盖NMPA/FDA/EMA/ISCT四大监管体系',
  '818号令全文解读：58条7章，双轨制管理',
  '政策分类导航：按机构/类型/状态快速筛选',
  '每份政策附关键条款摘要与影响分析',
], 'regulations-viewport.png', 'left', C.orange, 10);

// P11: 818 Order (icon list)
iconListSlide('818号令 · 核心要点解读', [
  { icon: '!', title: '施行日期', desc: '2026年5月1日正式施行，细胞治疗行业进入规范化管理新阶段', color: C.orange },
  { icon: '!', title: '法规结构', desc: '共58条7章，涵盖细胞采集、制备、检验、运输、临床应用全链条', color: C.cyan },
  { icon: '!', title: '双轨制管理', desc: '按风险等级分类管理，高风险产品走审批制，低风险走备案制', color: C.green },
  { icon: '!', title: '处罚力度', desc: '违规最高可处20倍罚款，远超此前法规力度，合规要求大幅提升', color: C.pink },
  { icon: '!', title: '备案机构', desc: '全国已有XXX家机构完成备案，平台可按地区/机构类型查询', color: C.blue },
], C.orange, 11);

// P12: Institutions (screenshot right)
screenshotSlide('备案机构查询 · 全国细胞治疗中心', [
  '全国细胞治疗备案机构一览',
  '按地区/机构类型/项目状态筛选',
  '备案项目详情：适应症/细胞类型/状态',
  '临床招募信息：正在招募的试验项目',
], 'institutions-viewport.png', 'left', C.orange, 12);

// P13: Products (screenshot right)
screenshotSlide('获批产品名录 · 28款全球CGT产品', [
  '按类型筛选：MSC/CAR-T/iPSC/基因治疗',
  '按地区筛选：FDA/EMA/NMPA批准',
  '产品详情：适应症/企业/批准日期/给药方式',
  '包含博鳌乐城先行区特许产品',
], 'products-viewport.png', 'left', C.purple, 13);

// P14: Editor picks (screenshot right)
screenshotSlide('编辑精选 · 重要文献深度解读', [
  '每期精选5篇重要文献 + 5篇前沿资讯',
  '专家团队审核，确保学术准确性与临床价值',
  '每篇附深度解读：背景/方法/结果/意义',
  '按期筛选，追溯往期精选内容',
  '已发布5期共52篇精选文献',
], 'picks-viewport.png', 'left', C.purple, 14);

// P15: AI Dashboard (screenshot right)
screenshotSlide('AI看板 · 10个CGT专业智能体', [
  '文献检索员：自动检索PubMed/数据库，相关性过滤',
  '临床机制撰写者：结构化撰写机制分析',
  '试验数据分析师：试验设计/样本量/终点规划',
  '监管合规专家：申报路径/法规解读',
  '产业分析AI：行业趋势/竞争格局/投融资',
  'AI团队每日自动更新文献/政策/产品数据',
], 'ai-dashboard.png', 'left', C.blue, 15);

// P16: AI Literature Review (steps)
stepsSlide('AI实操 · 用AI写文献综述', [
  { title: '选择智能体', desc: '进入AI看板，选择「文献检索员」智能体' },
  { title: '输入主题', desc: '输入综述主题，如「MSC治疗2型糖尿病」' },
  { title: 'AI检索', desc: 'AI自动检索PubMed+平台数据库，过滤相关文献' },
  { title: '生成综述', desc: 'AI按结构化格式生成综述初稿，含数据表格' },
  { title: '专家审核', desc: '医学审核专家校验数据准确性，输出终稿' },
], C.blue, 16);

// P17: AI Trial Design (steps)
stepsSlide('AI实操 · 用AI设计临床试验', [
  { title: '选择智能体', desc: '进入AI看板，选择「试验数据分析师」' },
  { title: '输入参数', desc: '输入适应症、细胞类型、给药途径等参数' },
  { title: '数据匹配', desc: 'AI匹配平台已有同类试验数据，分析设计方案' },
  { title: '生成方案', desc: '输出给药策略/终点设计/样本量计算/对照方案' },
  { title: '监管路径', desc: '监管合规专家附加申报路径与法规要求建议' },
], C.blue, 17);

// P18: Open CGT (screenshot left)
screenshotSlide('Open CGT · 产业共创联盟', [
  '42个节点，10类伙伴：科研/临床/企业/投资/监管',
  '提交想法 → AI规划路径 → 专家解答 → 资源对接',
  '平台48小时内生成可行性分析与实现路径建议',
  '推送给已入驻专家库，AI精准匹配行业资源',
  '点击3D球面图节点查看伙伴详情',
  '拖拽旋转/滚轮缩放/点击交互',
], 'opencgt-3d-upgraded.png', 'left', C.cyan, 18);

// P19: Lab (screenshot right)
screenshotSlide('在建实验室 · 7大可服务方向', [
  'MSC工艺优化：3D微载体/生物反应器培养',
  '基因编辑精准化与多样化',
  '通用/现货型CAR-T疗法',
  '体内CAR-T疗法',
  '实体瘤CAR-T技术优化',
  'LNP递送系统开发',
  'CAR-T/M/NK/Treg抗衰研究',
], 'lab-full.png', 'left', C.green, 19);

// P20: Mobile (dual screenshot)
function mobileSlide() {
  const slide = pptx.addSlide({ masterName: 'DARK' });
  titleBar(slide, '手机端 · 全功能移动适配', C.pink);
  const imgs = ['lab-mobile.png', 'blueprint-mobile.png'];
  imgs.forEach((name, i) => {
    if (shotExists(name)) {
      const x = 1.5 + i * 5.5;
      slide.addShape('roundRect', { x, y: 1.3, w: 4.5, h: 5.3, fill: { color: C.card }, line: { color: C.cardLine, width: 1 }, rectRadius: 0.15 });
      slide.addImage({ path: imgPath(name), x: x + 0.15, y: 1.45, w: 4.2, h: 5.0, sizing: { type: 'contain', w: 4.2, h: 5.0 } });
    }
  });
  const tips = [
    { label: '扫码访问', desc: '无需下载APP' },
    { label: '全功能适配', desc: '触摸操作流畅' },
    { label: '免费使用', desc: '所有板块均开放' },
  ];
  tips.forEach((t, i) => {
    const tx = 2.0 + i * 3.5;
    slide.addShape('roundRect', { x: tx, y: 6.5, w: 3.0, h: 0.6, fill: { color: C.card }, line: { color: C.pink, width: 0.5 }, rectRadius: 0.08 });
    slide.addText(t.label + ' · ' + t.desc, { x: tx, y: 6.5, w: 3.0, h: 0.6, fontSize: 12, color: C.white, fontFace: '微软雅黑', align: 'center', valign: 'middle' });
  });
  footer(slide, 20);
  return slide;
}
mobileSlide();

// P21: Daily report (icon list)
iconListSlide('每日日报 · CGT行业资讯每日推送', [
  { icon: '\u2709', title: '行业资讯精选', desc: '前沿研究、行业报告、地方政策、融资趋势，每日精选5-8条', color: C.cyan },
  { icon: '\u2709', title: '前沿文献速递', desc: 'PubMed最近7天MSC/CAR-T/基因治疗新文献，AI筛选+人工审核', color: C.green },
  { icon: '\u2709', title: '监管政策更新', desc: 'NMPA/FDA/EMA最新政策动态，关键条款解读', color: C.orange },
  { icon: '\u2709', title: '投融资动态', desc: 'CGT领域融资/并购/IPO动态，涵盖国内外', color: C.purple },
  { icon: '\u2605', title: '订阅方式', desc: '关注公众号「CGT知识库」 / 加入微信群 / 网站每日更新', color: C.pink },
], C.cyan, 21);

// P22: Community (grid 2x2)
gridSlide('加入社群 · 与同行交流', [
  { icon: 'W', title: '微信群', desc: 'CGT研究者交流群：讨论文献/试验/政策\n干细胞学习群：面向学生与入门研究者', color: C.green },
  { icon: 'G', title: '公众号', desc: '「CGT知识库」：每日推送日报精华\n3D球面图/数据可视化/深度解读', color: C.cyan },
  { icon: 'Z', title: '知乎专栏', desc: 'CGT领域专业问答与专栏文章\n搜索「干细胞 临床试验」「CGT 行业」即可找到', color: C.blue },
  { icon: 'O', title: 'Open CGT', desc: '提交你的想法，平台48小时内生成路径建议\n推送给专家库，AI匹配行业资源', color: C.purple },
], 2, C.green, 22);

// P23: Tips (icon list)
iconListSlide('5个使用技巧 · 让效率翻倍', [
  { icon: '1', title: '善用系统筛选', desc: '先选19系统中的目标系统，再用搜索框细化，缩小范围比直接搜索更高效', color: C.cyan },
  { icon: '2', title: '关注证据分级', desc: '优先看I级RCT和II级Meta分析，快速获取高等级证据，再补充低等级探索性研究', color: C.green },
  { icon: '3', title: '利用AI智能体', desc: '批量文献分析用「文献检索员」，试验设计用「试验数据分析师」，监管问题用「监管合规专家」', color: C.blue },
  { icon: '4', title: '订阅每日日报', desc: '公众号+微信群双渠道，每天5分钟掌握CGT行业最新动态，不漏重要信息', color: C.orange },
  { icon: '5', title: '加入社群交流', desc: '群内可提问、分享文献、讨论试验设计，同行反馈比独自摸索效率高10倍', color: C.pink },
], C.cyan, 23);

// P24: FAQ (grid 2x4)
gridSlide('常见问题 FAQ', [
  { icon: 'Q', title: '数据来源是什么？', desc: 'PubMed检索+人工筛选，覆盖2006-2026年MSC/CAR-T/基因治疗临床文献', color: C.cyan },
  { icon: 'Q', title: '多久更新一次？', desc: '每日自动检索PubMed最近7天新文献，经AI筛选+人工审核后入库', color: C.green },
  { icon: 'Q', title: 'AI智能体怎么用？', desc: '进入AI看板，选择对应智能体，输入需求即可。每个智能体有专属功能领域', color: C.blue },
  { icon: 'Q', title: '手机端能看吗？', desc: '可以。网址手机直接访问，全功能适配，支持触摸操作和收藏', color: C.purple },
  { icon: 'Q', title: '需要付费吗？', desc: '当前阶段完全免费。文献库/政策/产品/AI看板均可免费使用', color: C.orange },
  { icon: 'Q', title: '怎么加入Open CGT？', desc: '进入Open CGT页面，提交你的想法或合作意向，平台48小时内响应', color: C.pink },
  { icon: 'Q', title: '实验室可以合作吗？', desc: '可以。在建实验室提供7大方向技术服务，通过合作入口提交意向', color: C.green },
  { icon: 'Q', title: '怎么订阅日报？', desc: '关注公众号「CGT知识库」或加入微信群，每日自动推送', color: C.cyan },
], 4, C.cyan, 24);

// P25: Closing
closingSlide();

// Save
const outputFile = OUT + 'CGT知识库平台_使用培训.pptx';
pptx.writeFile({ fileName: outputFile })
  .then(() => console.log('PPT saved: ' + outputFile))
  .catch(err => console.error('Error:', err));
