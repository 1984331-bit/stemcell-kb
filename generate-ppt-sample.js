const PptxGenJS = require('pptxgenjs');
const path = require('path');

const pptx = new PptxGenJS();
const outDir = 'C:\\Users\\YSJ\\WorkBuddy\\Claw\\stemcell-kb\\';

// 深色科技风主题
pptx.layout = 'LAYOUT_16x9';
pptx.defineSlideMaster({
  title: 'MASTER_DARK',
  background: { color: '0A0F1A' },
  objects: [
    { rect: { x: 0, y: 0, w: '100%', h: '100%', fill: { color: '0A0F1A' } } },
    { line: { x: 0.35, y: 0.35, w: '92%', h: 0, line: { color: '00E5FF', width: 1 } } }
  ]
});

const CYAN = '00E5FF';
const WHITE = 'E0E0E0';
const LIGHT = '8A9BB0';
const CARD_BG = '121A2A';

function addSlide(title, bullets, imageName, imagePos) {
  const slide = pptx.addSlide({ masterName: 'MASTER_DARK' });

  // 顶部标题
  slide.addText(title, {
    x: 0.5, y: 0.45, w: '92%', h: 0.6,
    fontSize: 28, color: CYAN, fontFace: '微软雅黑', bold: true,
    align: 'left', valign: 'middle'
  });

  // 左侧要点
  const bulletText = bullets.map((b, i) => (i === 0 ? b : '• ' + b)).join('\n');
  slide.addText(bulletText, {
    x: 0.5, y: 1.2, w: 4.2, h: 5.2,
    fontSize: 16, color: WHITE, fontFace: '微软雅黑',
    lineSpacing: 28, bullet: false, valign: 'top'
  });

  // 右侧截图卡片
  const imgPath = path.join(outDir, 'screenshots', imageName);
  slide.addShape('roundRect', {
    x: 5.0, y: 1.2, w: 8.2, h: 5.2,
    fill: { color: CARD_BG },
    line: { color: '1A2A3F', width: 1 },
    rectRadius: 0.15
  });
  slide.addImage({
    path: imgPath,
    x: 5.1, y: 1.3, w: 8.0, h: 5.0,
    sizing: { type: 'contain', w: 8.0, h: 5.0 }
  });

  return slide;
}

// 第1页：平台定位（第1部分）
addSlide(
  '01 · 平台定位：CGT 领域的知识中枢',
  [
    '聚焦细胞与基因治疗（CGT）产业，整合公开学术文献、监管政策、获批产品、行业资讯。',
    '数据规模：730+ 临床文献、19 个生理系统、137 个适应症、28 款获批产品。',
    '维护团队：11 位专家 + 6 位运维 AI + 5 位产业分析 AI，每日自动迭代。',
    '核心价值：让研发、注册、临床、市场、投资人员都能快速找到所需信息。'
  ],
  'landing.png',
  { x: 5.0, y: 1.2, w: 8.2, h: 5.2 }
);

// 第2页：首页总览（第2部分）
addSlide(
  '02 · 首页总览：四大入口一键直达',
  [
    '顶部导航：首页 / 精选 / 资讯 / 政策 / 文献 / 产品 / 机构 / 数据 / 企业 / AI。',
    '数据库入口：认识细胞治疗、临床文献数据、监管政策汇编、获批产品名录、备案机构查询。',
    '热门检索与快捷入口：放在页面底部，按常见适应症/关键词快速筛选。',
    'AI 赋能 Banner：点击直达 AI 看板，获取平台数据迭代与行业分析。'
  ],
  'home-viewport.png',
  { x: 5.0, y: 1.2, w: 8.2, h: 5.2 }
);

// 第3页：文献库实操（第3部分）
addSlide(
  '03 · 场景实操：研发人员如何查文献',
  [
    '左侧系统导航：按神经系统、循环系统、免疫系统等 19 个系统快速定位。',
    '顶部分类：MSC / CAR-T / 基因治疗，按细胞类型一键筛选。',
    '统计卡片：直观看到每个系统/适应症的文献数量与证据等级。',
    '搜索框：支持标题、作者、期刊、PMID、适应症等多字段检索。'
  ],
  'literature-viewport.png',
  { x: 5.0, y: 1.2, w: 8.2, h: 5.2 }
);

// 第4页：AI看板（第4部分）
addSlide(
  '04 · AI 赋能：CGT 行业全场景 AI 团队',
  [
    'AI 看板标题：AI 赋能 · 平台数据迭代。',
    '核心引擎：AI 智能引擎驱动文献筛选、政策追踪、产品监测、数据分析。',
    'AI 更新数据集：AI 团队持续更新文献、政策、产品、行业资讯等数据。',
    'Open CGT：提交你的想法，AI 团队帮你规划实现路径，联通平台资源。'
  ],
  'ai-dashboard.png',
  { x: 5.0, y: 1.2, w: 8.2, h: 5.2 }
);

// 保存
const outputFile = outDir + 'CGT知识库使用指南_4页样张.pptx';
pptx.writeFile({ fileName: outputFile })
  .then(() => console.log('PPT saved: ' + outputFile))
  .catch(err => console.error('Error:', err));
