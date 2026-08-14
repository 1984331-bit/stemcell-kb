// L1 2026-08-14 板块插入脚本：11 条新条目 + 轮播替换（北京新政）
// 安全规则：字符串值内严禁 ASCII 双引号（用中文引号）；find_array_span 感知字符串；插入后复验条数
const fs = require('fs');
const file = 'index.html';
let html = fs.readFileSync(file, 'utf8');

function findArrayEnd(src, start) {
  // start 指向 '[' 的索引，返回配对 ']' 的索引（感知单/双引号字符串）
  let depth = 0, i = start;
  let inStr = null;
  while (i < src.length) {
    const c = src[i];
    if (inStr) {
      if (c === '\\') { i += 2; continue; }
      if (c === inStr) inStr = null;
      i++; continue;
    }
    if (c === "'" || c === '"') { inStr = c; i++; continue; }
    if (c === '[') depth++;
    else if (c === ']') {
      depth--;
      if (depth === 0) return i;
    }
    i++;
  }
  throw new Error('unbalanced array at ' + start);
}

function insertItems(arrName, declRe, items) {
  const m = declRe.exec(html);
  if (!m) throw new Error('array not found: ' + arrName);
  const start = html.indexOf('[', m.index);
  const end = findArrayEnd(html, start);
  let p = start + 1;
  while (p < end && /\s/.test(html[p])) p++;
  let block = '\n    ' + items.join(',\n    ') + ',\n  ';
  html = html.slice(0, p) + block + html.slice(p);
  console.log(arrName + ': 插入 ' + items.length + ' 条');
}

// ---------- 1. LOCAL_POLICY：北京 CGT 九大举措 ----------
const localPolicy = [
`{title:'北京发布《关于促进细胞与基因治疗领域高质量发展的若干措施（征求意见稿）》——九条举措覆盖创新、临床、平台、监管、产业全链条', date:'2026-08-12', tag:'北京', source:'北京市科委、中关村管委会（官方）', url:'https://kw.beijing.gov.cn/zmhd/dczj/202608/t20260812_4820494.html', desc:'2026-08-12 北京市科委、中关村管委会会同多部门发布征求意见稿（征求至 8 月 18 日），为落实《生物医学新技术临床研究和临床转化应用管理条例》推出九条举措：①关键技术突破按每项最高 500 万元择优支持（免疫细胞药物、干细胞药物、基因编辑和基因治疗、类器官与器官芯片等）；②鼓励 CDMO 面向 CGT 临床研究开展样品制备、质量控制标准化建设；③临床研究与转化能力建设（备案项目择优支持、纳入医院绩效考核与职称评定依据）；④区域管理与资源协同（市级质促中心、检验检测实验室、关键质量属性方法学与质量标准制定）；⑤重点项目评估指导与培育（按药品注册路径推进的备案项目分阶段每项最高 500 万元）；⑥强化创新品种产业化全链条服务，医保部门提前介入提供价格政策辅导，构建“基本医保+商保”多层次支付体系；⑦新药上市“一品一策”、提前介入、全程指导；⑧鼓励外商投资企业在自贸区从事人体干细胞、基因诊断与治疗技术开发应用；⑨执行期三年。'}`
];

// ---------- 2. CLINICAL_PROGRESS：RiboX RXIM002 ----------
const clinical = [
`{date:'2026-08-08', title:'RiboX环状RNA体内CAR-T RXIM002获FDA IND批准——全球首款circRNA体内CAR-T进入临床', tag:'前沿突破', source:'PR Newswire/医麦客 2026-08-08', url:'https://www.prnewswire.com/news-releases/ribox-therapeutics-announces-fda-ind-clearance-for-rxim002-the-first-circular-rna-based-in-vivo-car-therapy-for-autoimmune-cytopenias-302846525.html', desc:'RiboX Therapeutics（转录本生物）RXIM002：采用靶向脂质纳米颗粒（tLNP）包封编码 CD19 CAR 的环状 RNA，在体内直接生成功能性 CAR-T，治疗自身免疫性血细胞减少症（I 期 POPULUS-1 研究先入组复发/难治 ITP）。中国 IIT 数据支撑 IND 申报，FDA 批准加速剂量滴定方案并允许皮下制剂，为潜在门诊给药铺路；“原位生成”策略绕过传统体外制造，有望大幅提升可及性。'}`
];

// ---------- 3. EXPERT_VIEWS：翟晓梅 + 邓宏魁 ----------
const experts = [
`{name:'翟晓梅', title:'国家科技伦理委员会委员·北京协和医学院医学伦理委员会副主任委员·WHO人类基因编辑治理全球标准专家咨询委员会成员', avatar:'翟', quote:'坚守科研伦理是开展探索性人体试验不容突破的底线，专业胜任力是伦理审查委员会履职的基础。两个案例性质完全不同：必须将生殖系基因编辑与体细胞基因编辑划出分界线，生殖系基因的改变可遗传给后代，科学界对其认知尚不完整，随意改动可能带来不可预知的长期健康风险。', source:'新京报专访（2026-08-05）·上海6岁女童基因编辑事件伦理反思', date:'2026-08', cat:'伦理专家'}`,
`{name:'邓宏魁', title:'中国科学院院士·北京大学干细胞研究中心主任', avatar:'邓', quote:'生命科学的参数最多、最复杂，隐藏在海量测序数据背后的规律仅靠人力很难发现；未来细胞治疗必将走向个体化医学，每个样本都千差万别，科学智能就有了用武之地——这绝不仅是提高效率，更是一场范式革命。底层技术、设备与 AI 融合正是国际竞争力的体现，期待人造干细胞实现肝脏、心肌、神经等细胞量产，为更多疾病提供治疗新方案。', source:'北京日报客户端专访《细胞“重生”》（2026-08-06）', date:'2026-08', cat:'院士'}`
];

// ---------- 4. CONFERENCE_EVENTS：珠海医药生物技术大会 + 成都天府生物医药大会 ----------
const conferences = [
`{title:'第十四届中国医药生物技术大会暨珠海生物医药产业招商大会（2026）', desc:'中国医药生物技术协会、珠海市投资服务署、金湾区招商局联合主办，主题“智汇金湾·药创未来”。技术分会场含细胞与基因治疗药物研发与产业化、干细胞疗法技术突破与临床转化、类器官技术创新与转化、核酸药物、合成生物学、AI 赋能医药等 11 个方向；政策商务分会场含 818 号令、828 号令最新政策解读、粤港澳大湾区生物医药创新合作、生物医药投融资趋势等，另设项目路演与展览展示。', date:'2026年10月30日-11月1日', location:'中国 珠海（金湾区）', cat:'国内会议', url:'https://www.bio-equip.com/news453099085.html'}`,
`{title:'第三届天府生物医药产业发展与合作大会（2026）', desc:'成都高新区生物产业联合会与药视声 Medispace 联合主办，主题“前沿突破·链接全球”，聚焦 ADC、细胞与基因治疗、AI 制药、蛋白降解等颠覆性技术，探索前沿科技转化路径与产业协同新模式；超 400 家药企报名，强化成渝双城经济圈生物医药创新策源地与先进制造基地建设。', date:'2026年9月17-18日', location:'中国 成都（前沿医学中心）', cat:'国内会议', url:'https://finance.sina.com.cn/jjxw/2026-08-13/doc-inineqhn3160025.shtml'}`
];

// ---------- 5. INDUSTRY_REPORTS：IIM 中国细胞技术报告 ----------
const reports = [
`{title:'IIM《全球及中国细胞技术行业深度发展研究报告(2026)》——2026 全球 CGT 市场约 412 亿美元', date:'2026-08', source:'产业信息网（IIM）', url:'https://www.iim.net.cn/103/view-329031-1.html', desc:'产业信息网 2026 年报告测算：2026 年全球细胞与基因治疗（CGT）市场约 412 亿美元，中国突破 98 亿美元（占 23.8%）；预计 2030 年全球达 1150 亿美元（CAGR 18.7%），中国市场 CAGR 高达 24.3%。细胞治疗药物（CAR-T/TCR-T/TIL/NK）约 286 亿美元；iPSC 衍生细胞产品 2025 年首次进入商业化验证阶段，预计 2030 年前 CAGR 超 60%；行业正从自体定制模式向“通用型现货+自动化封闭式生产”工业化模式转型，运营效率提升约 35%。'}`
];

// ---------- 6. INDUSTRY_BOOKS：CAR-T Manufacturing ----------
const books = [
`{title:'CAR-T Manufacturing: Technologies and Innovations', author:'Andy Kah Ping Tay (ed.)', desc:'CRC Press（Routledge）2025 年出版（2026-06 平装上市，ISBN 9781032660738）：新加坡国立大学生物医学工程系 Andy Tay 教授主编，系统覆盖 CAR-T 制造全链条创新——免疫细胞选择与分离、T 细胞激活策略、CAR-T 基因工程工具（含临床经验）、胞内递送方法、生物反应器技术、CAR-T 产品质量控制、体内 CAR-T 制造前沿。旨在帮助从业者降低制造成本与生产周期、提升 CAR-T 疗法可及性，是 CAR-T CMC 工艺从业者与研究生的重要参考。', publisher:'CRC Press (Routledge)', year:'2025', pages:'约 300 页', cat:'产业参考', coverType:'coverColor', coverColor:'#00695C', url:'https://www.routledge.com/CAR-T-Manufacturing-Technologies-and-Innovations/Tay/p/book/9781032660769', coverNote:'封面待办：Routledge 官网高清封面待获取，暂用 coverColor，待用户提供原图升级为 coverType:image+assets/'}`
];

// ---------- 7. LEARNING_COURSES：药成材 GMP 培训 + 中国生物工程学会培训 ----------
const courses = [
`{title:'细胞治疗产品GMP生产与质量管理专题培训班（2026年9月·线上直播）', desc:'药成材信息技术（北京）有限公司主办，2026-09-19~20 线上直播，面向 CGT 企业生产/质量/注册人员与一线操作者：建立细胞治疗产品国内外 GMP 法规体系认知，熟悉 GMP 设施设计原则与环境监测体系，理解从细胞采集到成品放行的完整工艺链与关键控制点，掌握 QA 体系搭建、文件管理、偏差处理与 CAPA 闭环，运用 ICH Q9 质量风险管理工具，了解监管检查重点与迎检策略。', provider:'药成材信息技术（北京）有限公司', duration:'2 天（线上直播）', level:'全级别', tag:'GMP制造', courseCat:'行业培训', url:'http://cpcpc.org.cn/detail.php?en=c&id=5&infoid=2388'}`,
`{title:'基因编辑与干细胞技术及干细胞制剂质量评价技术培训班（中国生物工程学会·2026年8月）', desc:'中国生物工程学会、中质国认（北京）计量科学研究院主办，2026-08-29~31 线上直播（保留一年回放）：iPS 技术（培养、质粒转染、病毒包装、病毒滴度测定、重编程细胞鉴定、MEF 原代取材）、CRISPR/Cas9 原理与技术操作、MSC 基础与药物开发、iPS 药物开发策略、干细胞临床研究备案要求、干细胞产品临床前评价、干细胞伦理与人遗资源审核等；考核合格颁发“基因编辑和干细胞制备”岗位能力培训证书。', provider:'中国生物工程学会', duration:'3 天（线上直播）', level:'中级', tag:'干细胞技术', courseCat:'行业培训', url:'https://bio-industry.org.cn/a1384.html'}`
];

// ---------- 8. INDUSTRY_NEWS：服贸会 ----------
const news = [
`{title:'2026服贸会健康卫生服务专题首设“未来医疗科技产业前沿展区”——8家精准医疗、细胞治疗企业集中亮相', date:'2026-08-06', source:'北京商报/央视新闻客户端', url:'https://m.chinanews.com/wap/detail/cht/zw/10673144.shtml', desc:'2026 中国国际服务贸易交易会 9 月 9-13 日在北京首钢园举办，健康卫生服务专题首次设立“未来医疗科技产业前沿展区”，专门吸纳 8 家精准医疗、细胞治疗领域创新型中小企业，为科创团队搭建展示、洽谈与合作空间；世界 500 强及行业龙头参展占比 61.5%、国际化率 56.6%，武田等 22 家企业首次亮相，多款前沿技术产品将全球首发、中国首展；同期以“1+11+3”架构举办首都国际医学大会等 15 场会议论坛。'}`
];

// ---------- 执行插入 ----------
insertItems('LOCAL_POLICY', /var LOCAL_POLICY = \[/, localPolicy);
insertItems('CLINICAL_PROGRESS', /var CLINICAL_PROGRESS = \[/, clinical);
insertItems('EXPERT_VIEWS', /const EXPERT_VIEWS = \[/, experts);
insertItems('CONFERENCE_EVENTS', /const CONFERENCE_EVENTS = \[/, conferences);
insertItems('INDUSTRY_REPORTS', /var INDUSTRY_REPORTS = \[/, reports);
insertItems('INDUSTRY_BOOKS', /const INDUSTRY_BOOKS = \[/, books);
insertItems('LEARNING_COURSES', /const LEARNING_COURSES = \[/, courses);
insertItems('INDUSTRY_NEWS', /var INDUSTRY_NEWS = \[/, news);

// ---------- 轮播替换：第五批备案 -> 北京 CGT 新政 ----------
const oldSlide = `{type:'policy', tag:'备案', text:'<div style="font-size:20px;font-weight:700;line-height:1.35;margin-bottom:6px;">第五批生物医学新技术备案清单出炉：80 个项目</div><div style="font-size:13px;opacity:0.92;font-weight:400;">全部三甲医院实施 · 近七成医企联合 · 本土原创技术占主体</div>', action:'switchSection(\\'news\\')', bg:'url(https://images.unsplash.com/photo-1450101499163-c8848c66ca85?w=1200&q=80)'}`;
const newSlide = `{type:'policy', tag:'北京新政', text:'<div style="font-size:20px;font-weight:700;line-height:1.35;margin-bottom:6px;">北京发布CGT高质量发展九条举措（征求意见）</div><div style="font-size:13px;opacity:0.92;font-weight:400;">单项最高500万支持 · 医保提前介入 · 构建基本医保+商保支付体系</div>', action:'switchSection(\\'news\\')', bg:'url(https://images.unsplash.com/photo-1450101499163-c8848c66ca85?w=1200&q=80)'}`;
if (html.includes(oldSlide)) {
  html = html.replace(oldSlide, newSlide);
  console.log('highlights: 轮播替换成功（第五批备案 -> 北京 CGT 新政）');
} else {
  console.log('highlights: 未找到目标轮播条目，跳过替换（需人工检查）');
}

fs.writeFileSync(file, html, 'utf8');
console.log('写入完成');
