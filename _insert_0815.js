// 2026-08-15 板块插入脚本：CLINICAL_PROGRESS +3 / FRONTIER_RESEARCH +1 / FUNDING_TRENDS +1 / EXPERT_VIEWS +1 / LEARNING_COURSES +1 / INDUSTRY_BOOKS +2
const fs = require('fs');
const path = 'C:/Users/YSJ/WorkBuddy/Claw/stemcell-kb/index.html';
let src = fs.readFileSync(path, 'utf-8');

// ---- 工具：括号配对定位数组结束 ----
function findArrayEnd(text, startIdx) {
  let depth = 0, k = text.indexOf('[', startIdx);
  while (k < text.length) {
    if (text[k] === '[') depth++;
    else if (text[k] === ']') { depth--; if (depth === 0) return k; }
    k++;
  }
  return -1;
}
function findArrayStart(text, name) {
  for (const kw of ['var ' + name + ' = [', 'const ' + name + ' = [']) {
    const i = text.indexOf(kw);
    if (i >= 0) return i;
  }
  return -1;
}
// 在数组末尾插入：把 ']' 前的内容 + 新条目
function insertIntoArray(name, newItems, src) {
  const start = findArrayStart(src, name);
  if (start < 0) { console.log('!! 未找到数组 ' + name); return src; }
  const end = findArrayEnd(src, start);
  if (end < 0) { console.log('!! 括号配对失败 ' + name); return src; }
  // 取 ] 前的尾巴，决定是否需要加逗号
  let tail = src.slice(end - 1, end);
  const itemsStr = newItems.join(',\n  ');
  let insert = '';
  if (tail.trim() === '[') { // 空数组
    insert = '\n  ' + itemsStr + '\n';
  } else {
    insert = ',\n  ' + itemsStr + '\n';
  }
  return src.slice(0, end) + insert + src.slice(end);
}

// ---- 新条目定义（字符串内严禁 ASCII 双引号） ----

// CLINICAL_PROGRESS +3
const cpItems = [
  `{date:'2026-08-07',title:'全球首款BCD基因疗法ZVS101e拟纳入CDE优先审评——结晶样视网膜变性III期达主要终点',tag:'优先审评',source:'CDE官网/医药经济报/派真生物 2026-08-07',url:'https://global.pharmcube.com/news/detail/8b61b7d8aae34dcbb0b99ca22b828be5?type=dailyNews',desc:'中因科技与北京大学第三医院合作开发的ZVS101e（rAAV2/8-hCYP4V2）注射液拟纳入CDE优先审评程序，用于治疗携带CYP4V2双等位基因突变的结晶样视网膜变性（BCD）。随机对照III期试验（治疗组31例，单次视网膜下注射7.5×10¹⁰ vg/眼；对照组32例未治疗）第24周：治疗组35%患者BCVA提升≥15个字母 vs 对照组3%（p=0.001），平均改善11.5 vs 1.5个字母。BCD全球无获批药物，中国患者约6万至14万。ZVS101e已获FDA孤儿药（2021）与RMAT（2024，中国首个眼科基因治疗获此认定）及NMPA突破性疗法认定。'}`,
  `{date:'2026-08-13',title:'济元基因CG101获FDA IND批准——中国首个基因编辑iPSC来源通用现货免疫细胞产品',tag:'FDA IND',source:'搜狐/生物医学快报 2026-08-13',url:'https://www.sohu.com/a/1062376585_122639130',desc:'杭州济元基因CG101注射液（iPSC来源通用现货型免疫细胞产品，经精准基因编辑增强免疫活性、定向趋化迁移、肿瘤浸润与免疫微环境改善）获美国FDA IND许可，获准开展多中心I期临床，治疗急性髓系白血病（AML）。公司已建成单克隆细胞株筛选、iPSC定向分化、全悬浮3D分化扩增的全流程工艺平台，GMP体系下完成主/工作细胞库建设。标志中国首个基因编辑iPSC来源免疫细胞治疗产品进入国际临床开发阶段。'}`,
  `{date:'2026-08-14',title:'京东方再生医学NK细胞注射液获临床试验默示许可——科技企业跨界细胞治疗，瞄准膀胱癌术后防复发',tag:'获批临床',source:'CDE官网/雪球 2026-08-14',url:'https://xueqiu.com/2076269149/405134821',desc:'京东方再生医学（京东方BOE全资子公司）自主研发的NK细胞注射液获NMPA临床试验默示许可，用于治疗晚期实体瘤，核心适应症聚焦膀胱癌术后防复发（临床需求明确、竞争相对较小切入点）。该获批体现其干细胞+免疫细胞双平台战略落地，是继赛奥斯博SK-NK、英百瑞ACC-NK（II期）、达博生物E10H（II期）之后又一家跨界入局NK细胞疗法的企业，目前处于I期临床早期探索阶段。'}`
];

// FRONTIER_RESEARCH +1
const frItems = [
  `{date:'2026-08-10',title:'Nature Medicine：CD19 CAR-T细胞在B细胞淋巴瘤中存续超十年——宾大团队38例患者超长期随访',tag:'顶刊研究',source:'Nature Medicine（2026-08-10）',url:'https://www.nature.com/articles/s41591-026-04578-1',desc:'宾夕法尼亚大学Stephen J. Schuster、Marco Ruella及Carl H. June团队在Nature Medicine发表研究：对38例接受4-1BB共刺激抗CD19 CAR-T（tisagenlecleucel）治疗的B细胞非霍奇金淋巴瘤患者进行最长10年随访（NCT02030834）。5年后的8例长期缓解者中5例（62.5%）仍可检出CAR19转基因（7.0-10.1年），3例持续B细胞缺失提示功能活跃；1例FL患者无进展生存10.1年，输注9.3年时CAR-T仍占循环T细胞1.2%，呈CD4-CD8双阴性效应记忆样表型、寡克隆存留（优势克隆约占70%），未发现已知CAR-T扩增驱动基因整合。为CAR-T长期存续与安全性的里程碑证据。'}`
];

// FUNDING_TRENDS +1
const ftItems = [
  `{title:'Obsidian Therapeutics完成与Galera合并并募资3.5亿美元——工程化TIL细胞疗法平台纳斯达克上市',date:'2026-08-03',source:'Business Wire/PackGene 2026-08-03',url:'https://www.businesswire.com/news/home/20260803549139/en/Obsidian-Therapeutics-Completes-Closing-of-Transaction-with-Galera-Therapeutics-and-Previously-Announced-Private-Placement-of-%24350-Million',desc:'Obsidian Therapeutics于8月3日宣布完成与Galera Therapeutics的合并交易，同时完成超额认购的3.5亿美元私募融资（新投资者含Balyasny、Caligan、Eventide、Nantahala、Octagon、Redmile等，老股东Atlas Venture、Novo Holdings、RA Capital、RTW等跟投），合并后公司以OBX代码8月4日在纳斯达克开始交易，现金约3.5亿美元可支撑运营至2028下半年。核心管线OBX-115为cytoDRiVE平台工程化自体TIL细胞疗法（膜结合mbIL15装甲），已获FDA Fast Track与RMAT认定，正在黑色素瘤II期与NSCLC I期试验中评估，黑色素瘤注册性试验数据预计2027年底读出。'}`
];

// EXPERT_VIEWS +1
const evItems = [
  `{name:'项鹏',title:'中山大学中山医学院教授·中山大学干细胞与组织工程研究中心主任·赛隽生物创始人',avatar:'项',quote:'全球围绕MSC开展了2000余项临床试验，但至今仅18款产品上市——深入解析MSC的治疗机理、精准定位体内作用靶点、科学筛选最适宜人群，可能是破解MSC成药性难题的关键。MSC作为机体的稳态调控者与组织者，未来有望从体外细胞治疗迈向体内精准调控，直接激活内源性MSC实现器官功能再生。',source:'2026全球医疗峰会（2026-08-07~08 香港）主题演讲《修复的艺术：间充质干细胞创新药物研发》·微博/第一财经报道',date:'2026-08',cat:'干细胞专家'}`
];

// LEARNING_COURSES +1
const lcItems = [
  `{title:'浙江大学iPSC&成体干细胞类器官技术培训班（2026年9月·杭州）',desc:'浙江大学主办，2026-09-11~13 浙大紫金港校区，理论+沉浸式实操：成体干细胞类器官全套构建技术（小鼠小肠、肿瘤类器官建模），iPSC干细胞标准化培养与质控，脑/心/肝/肾/肠道/肺及血管多器官iPSC类器官定向诱导构建，类器官固定切片与形态学鉴定。面向科研人员、研究生与生物医药从业者，培训费6800元/人。',provider:'浙江大学',duration:'3 天（线下实操）',level:'进阶',tag:'类器官/iPSC',courseCat:'科研实操',url:'https://dy.163.com/article/L3M51C8505568W0A.html'}`
];

// INDUSTRY_BOOKS +2（封面待用户提供原图，coverColor 占位）
const bkItems = [
  `{title:'中国细胞治疗',author:'中国细胞生物学学会细胞与基因治疗分会 编',desc:'科学出版社2025年1月出版（ISBN 9787030810571）：基于前沿性、关键性和发展前景三个维度，选取免疫细胞、间充质细胞、胰岛细胞、神经细胞、肝细胞、肺细胞和肌肉细胞七类细胞治疗，从基础研究、临床转化、产业发展和监管四个环节开展全面系统分析，重点剖析我国发展现状、瓶颈问题及前景，并分别提出发展建议。中国细胞生物学学会细胞与基因治疗分会组织编写，为国内细胞治疗产业全景式权威参考。',publisher:'科学出版社',year:'2025',pages:'161',cat:'细胞治疗',coverType:'coverColor',coverColor:'#4A6572',url:'https://book.kongfz.com/436737/9794493206/',coverNote:'封面待用户提供原图（科学出版社）'}`,
  `{title:'脐带间充质干细胞：理论与技术解析',author:'潘兴华、何志旭、田川 编著',desc:'科学出版社2025年6月出版（ISBN 9787030804754）：图文并茂系统解析脐带间充质干细胞（UC-MSC）基础理论与转化应用，涵盖干细胞基本生物学特性、脐带MSC的获取与质量、制备与质量评价、修复组织损伤原理、治疗适应证与技术方法、疗效与安全性风险防范、产业发展趋势九章，精绘194幅示意图。以作者研究成果为基础，结合衰老干预、代谢疾病、免疫性疾病等多领域临床应用案例，为UC-MSC研究与应用的系统性专著。',publisher:'科学出版社',year:'2025',pages:'249',cat:'间充质干细胞',coverType:'coverColor',coverColor:'#3E6B8C',url:'https://product.dangdang.com/11962255702.html',coverNote:'封面待用户提供原图（科学出版社）'}`
];

// ---- 执行插入 ----
src = insertIntoArray('CLINICAL_PROGRESS', cpItems, src);
src = insertIntoArray('FRONTIER_RESEARCH', frItems, src);
src = insertIntoArray('FUNDING_TRENDS', ftItems, src);
src = insertIntoArray('EXPERT_VIEWS', evItems, src);
src = insertIntoArray('LEARNING_COURSES', lcItems, src);
src = insertIntoArray('INDUSTRY_BOOKS', bkItems, src);

fs.writeFileSync(path, src, 'utf-8');
console.log('OK：全部数组插入完成');
