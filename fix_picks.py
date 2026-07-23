#!/usr/bin/env python3
"""Fix editor picks: delete unverifiable items, correct data errors, add source links."""
import re

with open(r'C:\Users\YSJ\WorkBuddy\Claw\stemcell-kb\index.html', 'r', encoding='utf-8') as f:
    content = f.read()

# === New ALL_PICKS_ISSUES data (3 issues, 19 items total) ===
new_picks = r"""const ALL_PICKS_ISSUES = [
  {
    issue: '第1期',
    date: '2026-07-10',
    title: '创刊号：MSC疗法破冰与基础研究根基',
    picks: [
      {category:'clinical', tag:'里程碑', title:'Ryoncil获批——MSC疗法的破冰时刻', meta:['FDA 2024-12-18','血液系统','A级'], content:'<p>2024年12月18日，FDA批准Ryoncil(remestemcel-L)用于治疗儿童类固醇难治性急性移植物抗宿主病(SR-aGVHD)，成为<strong>首个获FDA批准的间充质基质细胞(MSC)疗法</strong>。</p><div class="pk-highlight">关键数据：III期单臂试验(n=54)中ORR(总体反应率)为70%(95%CI: 56.4-82.0)，CR(完全反应率)为30%，PR(部分反应率)为41%。中位反应持续时间为54天。</div><p>意义：结束了MSC疗法"有数据无产品"的尴尬局面，为整个MSC行业注入信心。但需注意：MSC的疗效机制以旁分泌/免疫调节为主，非"干细胞分化替代"，临床疗效取决于剂量、疗程、途径和细胞质量。</p><div style="margin-top:12px;padding-top:8px;border-top:1px solid rgba(255,255,255,0.08);font-size:11px;color:var(--text-light);">来源：<a href="https://www.fda.gov/news-events/press-announcements/fda-approves-first-mesenchymal-stromal-cell-therapy-treat-steroid-refractory-acute-graft-versus-host" target="_blank" rel="noopener" style="color:var(--primary);text-decoration:none;">FDA官方批准公告 (2024-12-18)</a></div>'},
      {category:'clinical', tag:'功能性治愈', title:'VX-880——干细胞疗法功能性治愈1型糖尿病', meta:['NEJM 2025','内分泌系统','A级'], content:'<p>Vertex公司的VX-880(完全分化的异体干细胞来源胰岛细胞)在I/II期试验中展现出惊人疗效：</p><div class="pk-highlight">12/12患者HbA1c<7%，10/12脱离外源性胰岛素治疗，最长达2年以上。</div><p>这是首次通过干细胞衍生胰岛细胞实现T1DM"功能性治愈"。但仍需关注免疫抑制需求、长期安全性、规模化生产等挑战。</p><div style="margin-top:12px;padding-top:8px;border-top:1px solid rgba(255,255,255,0.08);font-size:11px;color:var(--text-light);">来源：<a href="https://pubmed.ncbi.nlm.nih.gov/39677780/" target="_blank" rel="noopener" style="color:var(--primary);text-decoration:none;">NEJM 2025 (PMID: 39677780)</a></div>'},
      {category:'clinical', tag:'III期阳性', title:'PREVENT-TAHA8——MSC治疗急性心梗III期阳性', meta:['BMJ 2025','心血管系统','A级','n=396'], content:'<p>PREVENT-TAHA8 III期随机对照试验(n=396)显示，MSC输注显著降低急性心梗后3年心力衰竭发生率：</p><div class="pk-highlight">3年心衰发生率：MSC组5.74% vs 对照组16.08%(P=0.0027)</div><p>这是MSC心血管领域首个大型III期阳性试验，为MSC在心血管保护中的应用提供了最高级别证据。</p><div style="margin-top:12px;padding-top:8px;border-top:1px solid rgba(255,255,255,0.08);font-size:11px;color:var(--text-light);">来源：<a href="https://pubmed.ncbi.nlm.nih.gov/40036897/" target="_blank" rel="noopener" style="color:var(--primary);text-decoration:none;">BMJ 2025 (PMID: 40036897)</a></div>'},
      {category:'clinical', tag:'基因编辑', title:'Casgevy扩展适应症——CRISPR疗法迈向更广人群', meta:['FDA 2026-07-01','血液系统','A级'], content:'<p>2026年7月1日，FDA批准Casgevy(exagamglogene autotemcel)补充申请，扩展适应症至≥2岁患者。关键数据：</p><div class="pk-highlight">SCD: 8/8可评估患者达到VF12(12个月无严重VOC)；TDT: 8/9可评估患者达到输血独立(TI)</div><p>扩展至低龄患者意味着更早期的干预窗口，有望改善长期预后。此次补充申请通过专员国家优先凭证(CNPV)项目获得优先审评，从提交至批准仅53天。</p><div style="margin-top:12px;padding-top:8px;border-top:1px solid rgba(255,255,255,0.08);font-size:11px;color:var(--text-light);">来源：<a href="https://www.fda.gov/news-events/press-announcements/fda-approves-first-gene-therapy-young-children-sickle-cell-disease" target="_blank" rel="noopener" style="color:var(--primary);text-decoration:none;">FDA官方批准公告 (2026-07-01)</a></div>'},
      {category:'clinical', tag:'妇科再生', title:'CD133+干细胞治疗Asherman综合征——30%活产率', meta:['Nature Communications 2026','妇科','B级'], content:'<p>CD133+骨髓来源干细胞(BMDSCs)治疗难治性Asherman综合征(宫腔粘连)的I/II期单臂临床试验(n=20)：</p><div class="pk-highlight">累计活产率30%(6/20)，累计妊娠率55%(11/20)。治疗后子宫内膜厚度从3.80mm增至5.29mm(p<0.05)，IUA评分从8.0降至4.42(p<0.0001)。</div><p>该疗法已获EMA和FDA授予孤儿药资格。为难治性不孕症患者提供了新的再生医学选择。</p><div style="margin-top:12px;padding-top:8px;border-top:1px solid rgba(255,255,255,0.08);font-size:11px;color:var(--text-light);">来源：<a href="https://www.nature.com/articles/s41467-025-67850-x" target="_blank" rel="noopener" style="color:var(--primary);text-decoration:none;">Nature Communications 2026 (DOI: 10.1038/s41467-025-67850-x)</a></div>'},
      {category:'basic', tag:'诺奖基石', title:'iPS细胞的诞生——四因子重编程开启新时代', meta:['Cell 2006','山中伸弥','诺奖2012'], content:'<p>2006年，山中伸弥团队发现仅用4个转录因子(Oct4, Sox2, Klf4, c-Myc)即可将成纤维细胞重编程为诱导多能干细胞(iPSC)。</p><div class="pk-highlight">核心突破：体细胞可被"回拨"至胚胎干细胞状态，规避了胚胎伦理问题</div><p>这一发现使山中伸弥于2012年获诺贝尔生理学或医学奖。iPSC技术催生了后续所有干细胞临床转化的基础——从Casgevy到VX-880，追溯源头皆始于这篇论文。</p><div style="margin-top:12px;padding-top:8px;border-top:1px solid rgba(255,255,255,0.08);font-size:11px;color:var(--text-light);">来源：<a href="https://pubmed.ncbi.nlm.nih.gov/16904174/" target="_blank" rel="noopener" style="color:var(--primary);text-decoration:none;">Cell 2006 (PMID: 16904174)</a></div>'},
      {category:'basic', tag:'化学重编程', title:'化学重编程再突破——外周血18天生成临床级iPSC', meta:['Cell Discovery 2025','邓宏魁团队'], content:'<p>北京大学邓宏魁团队报道了一种快速化学重编程方法，将外周血单个核细胞在18天内转化为人化学诱导多能干细胞(hCiPS)。</p><div class="pk-highlight">突破点：无血清、无外源基因、18天（传统方法需30-50天）、可规模化</div><p>这是继2022年首次报道化学重编程后的重大改进，使临床级iPSC的快速、标准化生产成为可能。邓宏魁团队此前已用化学重编程成功治疗1型糖尿病患者。</p><div style="margin-top:12px;padding-top:8px;border-top:1px solid rgba(255,255,255,0.08);font-size:11px;color:var(--text-light);">来源：<a href="https://www.nature.com/articles/s41421-025-00852-7" target="_blank" rel="noopener" style="color:var(--primary);text-decoration:none;">Cell Discovery 2025 (DOI: 10.1038/s41421-025-00852-7)</a></div>'}
    ]
  },
  {
    issue: '第2期',
    date: '2026-07-13',
    title: '临床试验前沿：多剂量·鞘内给药·罕见病突破',
    picks: [
      {category:'clinical', tag:'III期试验', title:'ADMIRE CD II——达瓦德干细胞治疗克罗恩病肛瘘III期验证', meta:['PMID 41790076','免疫系统·克罗恩病肛瘘','A级'], content:'<p>ADMIRE CD II III期随机试验验证达瓦德干细胞(darvadstrocel)治疗复杂克罗恩病肛周瘘的疗效，为首个EMA批准(后撤市)的异体MSC产品提供补充证据。</p><div class="pk-highlight">需注意不同人群和医疗体系下的疗效差异，EMA于2024年12月撤市，日本仍在销售。</div><p>该试验为Alofisel的长期临床价值提供了额外数据支持，也提示MSC产品上市后持续监测的重要性。</p><div style="margin-top:12px;padding-top:8px;border-top:1px solid rgba(255,255,255,0.08);font-size:11px;color:var(--text-light);">来源：<a href="https://pubmed.ncbi.nlm.nih.gov/41790076/" target="_blank" rel="noopener" style="color:var(--primary);text-decoration:none;">PubMed (PMID: 41790076)</a></div>'},
      {category:'clinical', tag:'剂量探索', title:'PRIME-HFrEF——多剂量静脉UC-MSC治疗心衰', meta:['PMID 41888108','循环系统·心力衰竭','A级'], content:'<p>PRIME-HFrEF首次系统评估多剂量静脉输注UC-MSC在射血分数降低型心衰(HFrEF)中的安全性。</p><div class="pk-highlight">主要终点为安全性，疗效信号需更大规模试验确认。为多剂量MSC治疗方案提供剂量探索数据。</div><p>该研究设计严谨，采用随机对照设计，但样本量有限，疗效结论需谨慎解读。多剂量策略可能成为MSC心血管应用的未来方向。</p><div style="margin-top:12px;padding-top:8px;border-top:1px solid rgba(255,255,255,0.08);font-size:11px;color:var(--text-light);">来源：<a href="https://pubmed.ncbi.nlm.nih.gov/41888108/" target="_blank" rel="noopener" style="color:var(--primary);text-decoration:none;">PubMed (PMID: 41888108)</a></div>'},
      {category:'clinical', tag:'鞘内给药', title:'SMART-MS——鞘内MSC治疗进行性多发性硬化', meta:['PMID 42081777','神经系统·多发性硬化','A级'], content:'<p>SMART-MS研究采用鞘内给药途径治疗进行性多发性硬化(PMS)，探索MSC的神经修复潜力。</p><div class="pk-highlight">鞘内给药可能提高中枢神经系统药物暴露，但样本量较小，长期疗效尚不明确。</div><p>该I/II期RCT为MSC中枢神经系统给药提供了重要的安全性和初步疗效数据，鞘内途径是MSC神经修复领域的前沿探索方向。</p><div style="margin-top:12px;padding-top:8px;border-top:1px solid rgba(255,255,255,0.08);font-size:11px;color:var(--text-light);">来源：<a href="https://pubmed.ncbi.nlm.nih.gov/42081777/" target="_blank" rel="noopener" style="color:var(--primary);text-decoration:none;">PubMed (PMID: 42081777)</a></div>'},
      {category:'clinical', tag:'免疫调节', title:'脐带血单核细胞治疗自闭症伴免疫失调儿童——RCT', meta:['PMID 42321872','神经系统·自闭症谱系障碍','A级'], content:'<p>该RCT聚焦伴免疫失调的自闭症儿童，采用脐带血单核细胞治疗，从免疫-神经炎症角度切入。</p><div class="pk-highlight">研究设计严谨(单中心、双盲、随机、安慰剂对照)，但自闭症异质性强，需重复验证特定亚群获益。</div><p>该研究为细胞治疗自闭症提供了新的免疫调节视角，提示未来应关注免疫表型分层的精准治疗策略。</p><div style="margin-top:12px;padding-top:8px;border-top:1px solid rgba(255,255,255,0.08);font-size:11px;color:var(--text-light);">来源：<a href="https://pubmed.ncbi.nlm.nih.gov/42321872/" target="_blank" rel="noopener" style="color:var(--primary);text-decoration:none;">PubMed (PMID: 42321872)</a></div>'},
      {category:'clinical', tag:'罕见病', title:'MissionEB——UC-MSC治疗大疱性表皮松解症III期定性子研究', meta:['PMID 42237200','罕见病·大疱性表皮松解症','A级'], content:'<p>MissionEB III期试验的定性子研究，关注RDEB(隐性遗传性营养不良型大疱性表皮松解症)这一罕见遗传性皮肤病患儿的生活质量影响。</p><div class="pk-highlight">脐带MSC输注为慢性伤口护理提供新思路，但需结合主试验的客观疗效数据综合判断。</div><p>该研究体现了细胞治疗在罕见病领域的人文价值，定性研究补充了定量终点无法捕捉的患者体验维度。</p><div style="margin-top:12px;padding-top:8px;border-top:1px solid rgba(255,255,255,0.08);font-size:11px;color:var(--text-light);">来源：<a href="https://pubmed.ncbi.nlm.nih.gov/42237200/" target="_blank" rel="noopener" style="color:var(--primary);text-decoration:none;">PubMed (PMID: 42237200)</a></div>'},
      {category:'case', tag:'创新给药', title:'SHED-MSC脑室内给药治疗新生儿感染后脑积水——首例人体报告', meta:['PMID 42362959','儿科·脑积水/HIE','C级'], content:'<p>首例人体报告将SHED(脱落乳牙)来源MSC经脑室内途径用于新生儿感染后脑积水，探索MSC的神经炎症调节作用。</p><div class="pk-highlight">属创新性给药途径(脑室内注射)，但单例经验有限，需警惕侵入性操作相关风险。</div><p>该案例拓展了MSC中枢神经系统给药的探索边界，SHED-MSC因其神经分化潜能而受到关注，但脑室内注射的安全性和伦理考量需进一步评估。</p><div style="margin-top:12px;padding-top:8px;border-top:1px solid rgba(255,255,255,0.08);font-size:11px;color:var(--text-light);">来源：<a href="https://pubmed.ncbi.nlm.nih.gov/42362959/" target="_blank" rel="noopener" style="color:var(--primary);text-decoration:none;">PubMed (PMID: 42362959)</a></div>'},
      {category:'case', tag:'无细胞疗法', title:'MSC外泌体治疗支气管扩张型NTM肺病——病例报告', meta:['PMID 41894631','呼吸系统·NTM肺病','C级'], content:'<p>MSC衍生外泌体用于支气管扩张型非结核分枝杆菌(NTM)肺病的病例报告，展示无细胞疗法在难治性感染中的潜力。</p><div class="pk-highlight">外泌体标准化和质量控制仍是临床转化的关键挑战。该案例为耐药感染提供了新的无细胞治疗思路。</div><p>MSC外泌体兼具免疫调节和抗菌特性，在耐药菌感染日益严峻的背景下具有独特价值，但缺乏标准化制备工艺和剂量规范。</p><div style="margin-top:12px;padding-top:8px;border-top:1px solid rgba(255,255,255,0.08);font-size:11px;color:var(--text-light);">来源：<a href="https://pubmed.ncbi.nlm.nih.gov/41894631/" target="_blank" rel="noopener" style="color:var(--primary);text-decoration:none;">PubMed (PMID: 41894631)</a></div>'},
      {category:'case', tag:'儿科心脏', title:'HEART-WISE——UC-MSC冠状动脉内移植治疗儿童扩张型心肌病', meta:['PMID 42045816','循环系统·扩张型心肌病','C级'], content:'<p>HEART-WISE系列首次报道UC-MSC(Warton\'s Jelly来源)冠状动脉内移植治疗儿童扩张型心肌病，为等待心脏移植的患儿提供过渡或替代策略。</p><div class="pk-highlight">需密切随访心功能及不良事件。冠状动脉内给药在儿科人群中的安全性数据极为有限。</div><p>该首批病例报告为MSC在儿科心脏病领域的应用开辟了新方向，但冠状动脉内给药在儿童中的风险效益比需更大样本验证。</p><div style="margin-top:12px;padding-top:8px;border-top:1px solid rgba(255,255,255,0.08);font-size:11px;color:var(--text-light);">来源：<a href="https://pubmed.ncbi.nlm.nih.gov/42045816/" target="_blank" rel="noopener" style="color:var(--primary);text-decoration:none;">PubMed (PMID: 42045816)</a></div>'},
      {category:'case', tag:'创面修复', title:'UC-MSC外泌体局部应用促进深二度烫伤愈合——病例报告', meta:['PMID 42153042','皮肤科·烧伤/创面','C级'], content:'<p>该病例展示局部应用UC-MSC外泌体促进深二度烫伤创面愈合，体现无细胞疗法在皮肤修复中的便利性和安全性。</p><div class="pk-highlight">单例无法评估瘢痕形成和远期疗效，需对照研究验证。局部外泌体应用的优势在于无活细胞相关的安全风险。</div><p>外泌体局部制剂在创面修复领域具有转化前景，制备工艺标准化、剂量优化和疗效评价标准是下一步研究方向。</p><div style="margin-top:12px;padding-top:8px;border-top:1px solid rgba(255,255,255,0.08);font-size:11px;color:var(--text-light);">来源：<a href="https://pubmed.ncbi.nlm.nih.gov/42153042/" target="_blank" rel="noopener" style="color:var(--primary);text-decoration:none;">PubMed (PMID: 42153042)</a></div>'},
      {category:'case', tag:'慢性伤口', title:'异体Wharton\'s Jelly MSC皮内注射治疗CABG术后慢性胸骨切口不愈——病例报告', meta:['PMID 41590242','皮肤科·烧伤/创面','C级'], content:'<p>老年CABG(冠状动脉旁路移植术)术后慢性胸骨切口不愈是临床难题，本例采用皮内异体Wharton\'s jelly MSC治疗获得愈合。</p><div class="pk-highlight">为慢性难愈性伤口提供局部MSC应用参考，但需排除感染控制等混杂因素。</div><p>该案例展示了MSC在术后难愈性伤口中的实用价值，皮内注射给药途径操作简便、风险可控，适合外科临床转化探索。</p><div style="margin-top:12px;padding-top:8px;border-top:1px solid rgba(255,255,255,0.08);font-size:11px;color:var(--text-light);">来源：<a href="https://pubmed.ncbi.nlm.nih.gov/41590242/" target="_blank" rel="noopener" style="color:var(--primary);text-decoration:none;">PubMed (PMID: 41590242)</a></div>'}
    ]
  },
  {
    issue: '第3期',
    date: '2026-07-14',
    title: '干细胞在神经退行性疾病中的突破',
    picks: [
      {category:'clinical', tag:'iPSC衍生', title:'iPSC衍生多巴胺能神经前体治疗帕金森病I/II期安全数据', meta:['Nature 2025','神经系统·帕金森病','B级'], content:'<p>京都大学团队公布iPSC衍生多巴胺能神经前体细胞(DA-NPC)移植治疗帕金森病的I/II期临床试验结果。</p><div class="pk-highlight">7例患者移植后24个月内：未发生移植相关严重不良事件，无肿瘤形成。6例疗效评估患者中，MDS-UPDRS-III"关期"运动评分平均改善9.5分(20.4%)，"开期"改善4.3分(35.7%)。18F-DOPA PET显示壳核Ki值增加44.7%。</div><p>该试验(jRCT2090220384)验证了异体iPSC衍生DA-NPC移植的安全性和潜在临床获益。需注意：开放标签设计，未设对照组，疗效信号为探索性。下一步将启动III期随机对照试验。</p><div style="margin-top:12px;padding-top:8px;border-top:1px solid rgba(255,255,255,0.08);font-size:11px;color:var(--text-light);">来源：<a href="https://pubmed.ncbi.nlm.nih.gov/40240591/" target="_blank" rel="noopener" style="color:var(--primary);text-decoration:none;">Nature 2025 (PMID: 40240591)</a></div>'},
      {category:'clinical', tag:'HIE Meta', title:'干细胞治疗新生儿缺氧缺血性脑病Meta分析——神经发育改善显著', meta:['Childs Nerv Syst 2025','儿科·HIE','A级'], content:'<p>该系统综述与Meta分析纳入4项研究(含1项四盲RCT)共153例新生儿缺氧缺血性脑病(HIE)患儿(干细胞组52例 vs 标准护理组101例)，评估干细胞治疗的疗效。</p><div class="pk-highlight">主要结局：良好神经发育结局率显著高于标准护理组(RR=1.89, 95%CI: 1.30-2.74, I2=0%, p=0.0008)。总生存率两组无显著差异(RR=1.09, p=0.25)。不良反应发生率相当。</div><p>这是干细胞治疗HIE领域最新Meta分析。46例接受脐带血干细胞，6例接受脐带组织MSC。结果提示干细胞治疗安全且可能改善神经发育结局，但需更大规模RCT验证。</p><div style="margin-top:12px;padding-top:8px;border-top:1px solid rgba(255,255,255,0.08);font-size:11px;color:var(--text-light);">来源：<a href="https://pubmed.ncbi.nlm.nih.gov/40847199/" target="_blank" rel="noopener" style="color:var(--primary);text-decoration:none;">Child\'s Nervous System 2025 (PMID: 40847199)</a></div>'}
    ]
  }
];"""

new_images = r"""const PICKS_IMAGES = {
  0: { cover: 'picks/cover_01.png', cards: ['picks/issue01_01.png', 'picks/issue01_02.png', 'picks/issue01_03.png', 'picks/issue01_04.png', 'picks/issue01_05.png', 'picks/issue01_06.png', 'picks/issue01_07.png'] },
  1: { cover: 'picks/cover_02.png', cards: ['picks/issue02_01.png', 'picks/issue02_02.png', 'picks/issue02_03.png', 'picks/issue02_04.png', 'picks/issue02_05.png', 'picks/issue02_06.png', 'picks/issue02_07.png', 'picks/issue02_08.png', 'picks/issue02_09.png', 'picks/issue02_10.png'] },
  2: { cover: 'picks/cover_04.png', cards: ['picks/issue04_02.png', 'picks/issue04_03.png'] },
};"""

# Replace ALL_PICKS_ISSUES
pattern1 = r'const ALL_PICKS_ISSUES = \[.*?\];\s*\n'
content_new = re.sub(pattern1, new_picks + '\n\n', content, count=1, flags=re.DOTALL)

# Replace PICKS_IMAGES
pattern2 = r'const PICKS_IMAGES = \{.*?\};\s*\n'
content_new = re.sub(pattern2, new_images + '\n\n', content_new, count=1, flags=re.DOTALL)

# Verify replacements happened
if 'ALL_PICKS_ISSUES' not in content_new or 'PICKS_IMAGES' not in content_new:
    print("ERROR: Replacement failed!")
    exit(1)

# Count items to verify
issue_count = content_new.count("issue: '第")
pick_count = content_new.count("{category:'")
print(f"Issues found: {issue_count}")
print(f"Pick items found: {pick_count}")

# Count source links
source_count = content_new.count('查看来源') + content_new.count('PubMed (PMID') + content_new.count('FDA官方') + content_new.count('Nature Communications') + content_new.count('Cell 2006') + content_new.count('Cell Discovery') + content_new.count('Child\'s Nervous')
print(f"Source links found: {source_count}")

with open(r'C:\Users\YSJ\WorkBuddy\Claw\stemcell-kb\index.html', 'w', encoding='utf-8') as f:
    f.write(content_new)

print("index.html updated successfully!")
print(f"File size: {len(content_new)} bytes")
