const fs = require('fs');
const file = 'index.html';
let s = fs.readFileSync(file, 'utf8');

function findArrEnd(name) {
  const re = new RegExp('(?:const|var)\\s+' + name + '\\s*=\\s*\\[');
  const m = s.match(re);
  if (!m) throw new Error(name + ' NOT FOUND');
  const start = s.indexOf('[', m.index);
  let d = 0, end = -1;
  for (let i = start; i < s.length; i++) {
    if (s[i] === '[') d++;
    else if (s[i] === ']') { d--; if (d === 0) { end = i; break; } }
  }
  if (end < 0) throw new Error(name + ' END NOT FOUND');
  return end;
}

function insertItems(name, items) {
  const end = findArrEnd(name);
  const insertText = items.map(it => '\n  ' + it).join(',') + '\n';
  // ★关键修复：原数组末元素后无尾随逗号时，新条目前必须补逗号，否则 JS "Unexpected token '{'"
  const charBeforeEnd = s[end - 1];
  const isArrayEmpty = charBeforeEnd === '[';
  const prefix = isArrayEmpty ? '' : ',';
  s = s.slice(0, end) + prefix + insertText + s.slice(end);
  console.log(name + ' +' + items.length + ' inserted at ' + end + ' (prefix comma: ' + (prefix === ',') + ')');
}

// ============ REGULATIONS +2 ============
const regItems = [
`{category:'专家共识', title:'Claudin18.2靶点CAR-T治疗晚期胃癌的临床应用专家共识——国内首个胃癌CAR-T临床应用专家共识（中华胃肠外科杂志2026年）', date:'2026', issuer:'中华胃肠外科杂志（肖秀英牵头）', source:'中国新闻网/中华胃肠外科杂志', url:'https://m.chinanews.com/wap/detail/cht/zw/10664599.shtml', desc:'《Claudin18.2靶点CAR-T治疗晚期胃癌的临床应用专家共识》发表于《中华胃肠外科杂志》2026年第29卷第5期（421-428页），由上海交通大学医学院附属仁济医院肿瘤科主任医师肖秀英牵头编制。共识围绕Claudin18.2阳性晚期胃癌患者CAR-T治疗的适应证筛选（IHC≥40%肿瘤细胞2+/3+、HER2阴性、至少二线治疗失败）、临床评估四大维度（疾病特征、生物标志物状态、患者身体基础、认知程度）、治疗流程与毒性管理等作出推荐，为实体瘤CAR-T领域首个国家级临床应用专家共识，与《CSCO胃癌诊疗指南（2026版）》以注释形式纳入舒瑞基奥仑赛（CT041）相互印证，标志实体瘤CAR-T进入规范化临床应用阶段。'}`,
`{category:'专家共识', title:'中国帕金森病治疗指南（第五版）（2026）——首设干细胞疗法与基因治疗专章', date:'2026', issuer:'中华医学会神经病学分会帕金森病及运动障碍学组', source:'脑医汇/中华医学会神经病学分会', url:'https://www.brainmed.com/info/detail?id=58752', desc:'《中国帕金森病治疗指南（第五版）》（2026）新增干细胞疗法与基因治疗章节：综述人多能干细胞（hiPSC/hESC）来源多巴胺能前体细胞双侧壳核移植的日本Ⅰ/Ⅱ期与美国Ⅰ期临床试验（总体安全可行、具潜在临床获益），以及国内人源神经干细胞经鼻移植Ⅰ期临床试验结果；基因治疗部分梳理AAV2-GAD（谷氨酸脱羧酶基因递送至丘脑底核以增强GABA能抑制）等对症性策略与AAV载体递送治疗性基因的进展。指南指出干细胞疗法与基因治疗在帕金森病治疗中具潜在前景，但现有证据全部来自早期临床研究，尚不足以证实明确疗效，仍面临肿瘤形成与免疫排斥等挑战。'}`
];
insertItems('REGULATIONS', regItems);

// ============ CLINICAL_PROGRESS +1 ============
const cpItems = [
`{date:'2026-08-27', title:'全球首个CAR-T治疗类风湿关节炎临床试验结果发表于Nature Medicine——6例重度难治性患者全部改善、3例停药缓解（免疫重置）', tag:'临床突破', source:'Nature Medicine/澎湃新闻', url:'https://www.thepaper.cn/newsDetail_forward_33967820', desc:'柏林夏里特医学院（Charité）David Simon、Gerhard Krönke团队在Nature Medicine（DOI: 10.1038/s41591-026-04603-3）发表全球首个CAR-T治疗类风湿关节炎（RA）的临床试验结果：COMPARE试验1期评估Kyverna开发的自体全人源CD19 CAR-T（miv-cel，mivocabtagene autoleucel）治疗6例重度难治性ACPA阳性RA患者（此前平均用过多达8种靶向或生物制剂均效果不佳）。单次输注后所有患者疾病活动度显著下降，3例达DAS28-CRP缓解标准并符合ACR70应答、已无需任何RA药物治疗；自身抗体总体下降超90%，B细胞以naïve表型重建，疾病特异性B细胞几乎不可检出（免疫重置机制证据）；安全性方面仅出现1-2级CRS、无ICANS、无严重不良事件。该结果为CAR-T从血液肿瘤向自身免疫病领域拓展提供了首个RA前瞻性证据，推动免疫重置（immune reset）成为风湿免疫领域核心方向。'}`
];
insertItems('CLINICAL_PROGRESS', cpItems);

// ============ EXPERT_VIEWS +1 ============
const expItems = [
`{name:'魏于全', title:'中国科学院院士·四川大学华西医院临床肿瘤中心主任·生物治疗国家重点实验室主任', avatar:'魏', quote:'我国基因治疗研发整体已居全球第二，已有8款CAR-T细胞治疗产品获批上市，针对实体瘤的治疗也取得进展；个性化肿瘤新抗原疫苗已在胃癌等瘤种的临床应用中显现疗效。眼部注射类基因治疗费用可降至百元人民币左右，为黄斑变性、遗传性视网膜劈裂症等罕见病患者带来希望。组学技术、结构生物学与合成生物学的突破，正推动细胞治疗、抗体药物、基因治疗、mRNA疫苗等领域快速迭代。', source:'2026腾冲科学家论坛·生命科学与大健康专题活动主旨报告《生物技术药物与生物治疗研究进展与发展趋势》（每日经济新闻 2026-08-29）', date:'2026-08', cat:'院士'}`
];
insertItems('EXPERT_VIEWS', expItems);

// ============ CONFERENCE_EVENTS +1 ============
const confItems = [
`{title:'2026CPHI「CGT药物开发实例与策略论坛」——深圳会展中心', desc:'2026年9月17日13:30-16:00在深圳会展中心（福田）9号馆K88展位举行，由上海博华国际展览有限公司（CPHI）与摩熵医药联合主办。论坛围绕全球CGT产业趋势、CAR-NK、TCR-T、干细胞药物及创新免疫细胞疗法等方向设置5场分享，探讨CGT从技术创新走向药物开发和产业转化的关键问题：全球CGT产业发展阶段与下一阶段值得关注的技术路线、CGT产品如何走向临床、不同技术路线的开发逻辑差异、从技术创新到产业化企业需要解决的问题。同期2026 CPHI & PMEC制药工业展（深圳）于9月16-18日举办，预计展示面积超3万平方米、汇聚800+海内外参展企业与20+场现场会议活动。', date:'2026年9月17日（深圳会展中心·福田）', location:'中国 深圳', cat:'国内会议', url:'https://www.pharnexcloud.com/meeting/9859.html'}`
];
insertItems('CONFERENCE_EVENTS', confItems);

// ============ FUNDING_TRENDS +1 ============
const fundItems = [
`{date:'2026-08-18', title:'易慕峰生物再次递表港交所——累计融资约9.73亿元、估值20.75亿元，CLDN18.2 CAR-T冲刺实体瘤注册III期', tag:'IPO', source:'动脉网/中国医药创新促进会', url:'https://www.phirda.com/artilce_43544.html', desc:'2026年8月18日，深圳易慕峰生物科技股份有限公司更新港股招股申请（再次递表）。公司成立于2020年7月，创始人孙敏敏博士曾任复星凯特创始团队成员、主导中国首个CAR-T产品奕凯达（阿基仑赛）上市申报；联合创始人沈青山（复星凯特生产质量负责人）、郝瑞棟（传奇生物LB2102项目曾以11亿美元授权诺华）。从2021年天使轮到2026年C轮累计融资约9.73亿元人民币，最新一轮后估值达20.75亿元，高榕创投、济峰投资、国投创业基金、维梧资本、鹏复深圳等先后入局。公司避开CAR-T血液肿瘤拥挤赛道，主攻Claudin18.2阳性胃癌/胰腺癌等实体瘤：核心管线IMC002（VHH纳米抗体结构CLDN18.2 CAR-T）已启动注册性III期确证性研究，早期数据ORR 66.7%、一例CR持续超60周。'}`
];
insertItems('FUNDING_TRENDS', fundItems);

// ============ INDUSTRY_BOOKS +2 ============
const bookItems = [
`{title:'Nonclinical Evaluation Studies of Cellular and Gene Therapy Products: Strategies, Models, and Regulatory Frameworks', author:'Wang Quanjun, Wang Qingli, Geng Xingchao (Eds.)', desc:'Elsevier 2026年6月26日出版（第1版，1050页），由赛赋实验室CEO/中科院苏州医工所副所长王全军、CDE药理毒理学部部长王庆利、中检院国家药物安全评价监测中心耿兴超联合主编。系统阐述CGT产品非临床评价的策略、模型与监管框架：20+章覆盖临床前毒理、药代动力学与创新评价模型，为全球首部将器官芯片（organ-on-chip）模型整合进CGT评价的专著，反映FDA/NMPA现代化监管倡议；涵盖CRISPR脱靶效应、免疫原性、长期致癌风险应对的实用指南，以及mRNA药物、外泌体疗法、红细胞载药等新兴疗法评价策略，含FDA获批CRISPR疗法、CAR-T安全性评估与失败试验案例。', publisher:'Elsevier', year:'2026', pages:'1050 页', cat:'国际专著', isbn:'9780443486128', coverType:'coverColor', coverColor:'#1565C0', url:'https://shop.elsevier.com/books/title/author/9780443486135', coverNote:'封面待办：Elsevier官网封面沙箱无法访问，待用户提供原图升级为 coverType:image+assets/'}`,
`{title:'Gene and Cell Therapies: Principles of Pharmaceutical Development', author:'Chris Van Der Walle', desc:'Elsevier 2026年7月27日出版（第1版，平装）。系统阐述基因与细胞疗法的药物开发原理：覆盖病毒载体设计、溶瘤病毒、RNA癌症疫苗、自体与异体细胞疗法及其对药学开发的影响；结合分子与细胞生物学进展如何催生安全有效的基因与细胞疗法，以及与工艺和分析开发的关系；含案例研究、学习要点与教学幻灯片，帮助非专业人士建立基础认知，同时为前沿概念提供进阶探讨。内容直击复杂制造这一制约患者可及性的关键障碍。', publisher:'Elsevier', year:'2026', pages:'平装', cat:'国际专著', isbn:'9780443457913', coverType:'coverColor', coverColor:'#2E7D32', url:'https://www.booktopia.com.au/gene-and-cell-therapies-chris-van-der-walle/book/9780443457913.html', coverNote:'封面待办：Elsevier官网封面沙箱无法访问，待用户提供原图升级为 coverType:image+assets/'}`
];
insertItems('INDUSTRY_BOOKS', bookItems);

// ============ LEARNING_COURSES +1 ============
const courseItems = [
`{title:'亦弘商学院重磅新课：细胞治疗与生物医学新技术——818/828政策解读与合规布局', desc:'亦弘商学院围绕2026年两大国务院令（818号令技术轨、828号令药品轨）推出的双轨监管体系系统课程，打通医院、企业、审评、临床多维视角：课程主席为昌平实验室资深科学家、原CDE生物制品临床部部长高晨燕，师资包括原药品审评中心主审审评员戴学栋、同济大学附属东方医院再生医学研究所执行所长何志颖、北京大学肿瘤医院伦理委员会主任委员李洁、北医三院药物临床试验机构主任李海燕、中国医药生物技术协会驻会副理事长吴朝晖等。内容涵盖818/828双法规底层逻辑与适用边界、医疗机构新技术备案与伦理审查、临床转化合规风险、CGT细胞产品药品注册申报要点与商业化路径，面向药企研发注册负责人、医疗机构临床研究负责人、CRO项目管理及投资人。', provider:'亦弘商学院', duration:'待定（线下）', level:'高级', tag:'政策合规', courseCat:'行业培训', url:'https://bydrug.pharmcube.com/news/detail/284d8ec425a407f9e556934df73f5337'}`
];
insertItems('LEARNING_COURSES', courseItems);

// ============ REPRINT_ARTICLES +2 ============
const reprintItems = [
`{tag:'行业报道', title:'多位血液肿瘤专家解读细胞治疗发展现状：中国CAR-T正站在规范化与可及性的新起点', date:'2026-08', source:'央广网', url:'https://www.cnr.cn/hlj/jkgy/20260806/t20260806_527751132.shtml', words:'约1500字', desc:'央广网在CSCO第十届血液肿瘤学术大会（哈尔滨）期间采访多位血液肿瘤权威专家：马军教授（CSCO监事会监事长、哈尔滨血液病肿瘤研究所所长）指出CAR-T已成为成熟的先进治疗手段，当前治疗费用普遍处于99万至129万元区间，仅5%至10%的患者能够接受治疗；2026年医保商保双目录机制允许商保目录品种申报基本医保目录，7款商保目录药品通过医保形式审查；合源生物CEO吕璐璐介绍国产CAR-T正从解决有药用迈向用得上；姜尔烈（中国医学科学院血液病医院副院长）介绍CAR-T与造血干细胞移植互补方案；全球CAR-T临床试验约1822项、中国占比57.2%，国内CAR-T研发实现从跟跑、并跑向局部领跑转变。'}`,
`{tag:'政策解读', title:'多层次医保体系助力国产创新疗法加速落地', date:'2026-08', source:'经济日报', url:'https://www.jingjiribao.cn/static/detail.jsp?id=676152', words:'约1200字', desc:'经济日报报道2026年医保商保创新药双目录联动机制落地：58款药品通过商保创新药目录形式审查，纳基奥仑赛注射液等多款CAR-T产品在列；2026年双目录机制允许商保目录品种申报基本医保目录，实现基本医保与商业健康保险双向衔接，另有7款商保目录药品同步通过医保目录形式审查。马军教授指出CAR-T单疗程费用集中在99万至129万元、仅5%-10%患者有条件接受治疗；姜尔烈介绍CD7 CAR-T序贯异基因造血干细胞移植等成熟临床方案；多位专家呼吁搭建全国统一的标准化诊疗体系，依托权威诊疗指南与专家共识明确适用人群，防范过度医疗。'}`,
];
insertItems('REPRINT_ARTICLES', reprintItems);

fs.writeFileSync(file, s);
console.log('ALL DONE. total inserted: ' + (regItems.length + cpItems.length + expItems.length + confItems.length + fundItems.length + bookItems.length + courseItems.length + reprintItems.length));
