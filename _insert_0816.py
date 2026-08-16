# -*- coding: utf-8 -*-
"""2026-08-16 L1 板块写入脚本：括号配对定位数组 end，插入新条目 + 轮播替换。"""
import io, re, sys

PATH = r"C:\Users\YSJ\WorkBuddy\Claw\stemcell-kb\index.html"

with io.open(PATH, encoding="utf-8", newline="") as f:
    html = f.read()

def find_array_end(text, name):
    """定位 'var/const NAME = [' 起始，括号配对找到匹配的 ']' 结束索引。"""
    m = re.search(r'(?:const|var|let)\s+' + re.escape(name) + r'\s*=\s*\[', text)
    if not m:
        raise RuntimeError("array not found: " + name)
    i = m.end() - 1  # 指向 '['
    depth = 0
    in_str = None
    while i < len(text):
        c = text[i]
        if in_str:
            if c == '\\':
                i += 2
                continue
            if c == in_str:
                in_str = None
            i += 1
            continue
        if c == '"' or c == "'":
            in_str = c
            i += 1
            continue
        if c == '[':
            depth += 1
        elif c == ']':
            depth -= 1
            if depth == 0:
                return i
        i += 1
    raise RuntimeError("unbalanced array: " + name)

def insert_items(text, name, items):
    """在数组 ']' 前插入条目。items: list of str（不含首尾逗号，完整 JS 对象字面量）。"""
    end = find_array_end(text, name)
    # 找 ']' 前最后一个非空白字符，判断是否已有逗号分隔（避免双逗号或缺逗号）
    j = end - 1
    while j >= 0 and text[j] in " \t\r\n":
        j -= 1
    joiner = "" if (j >= 0 and text[j] == ",") else ","
    block = joiner + "\n" + "".join("  " + it + ",\n" for it in items)
    return text[:end] + block + text[end:]

# ============ 1. CLINICAL_PROGRESS +3 ============
cli_items = [
    "{date:'2026-08-11', title:'石药集团体内CAR-T SYS6042获系统性红斑狼疮临床许可——全球首款获批开展SLE临床试验的LNP-mRNA CD19/BCMA CAR-T，国产首款进入注册临床的体内CAR-T', tag:'IND获批', source:'石药集团港股公告/PharmCube 2026-08-11', url:'https://bydrug.pharmcube.com/news/detail/9d5b320a76eb377a75d74caa4b475b66', desc:'8月11日石药集团（1093.HK）公告：靶向CD19/BCMA的体内CAR-T疗法SYS6042获得系统性红斑狼疮（SLE）临床许可。产品采用脂质纳米颗粒（LNP）将编码CD19和BCMA的CAR mRNA转染入T细胞，使其同步表达两个完整CAR蛋白，有效杀伤分泌自身反应抗体的CD19/BCMA阳性细胞。这是全球首款获批开展SLE临床试验的LNP-mRNA CD19/BCMA CAR-T产品，也是国产首款进入注册临床阶段的体内CAR-T；全球范围内目前尚无CAR-T疗法获批用于SLE。'}",
    "{date:'2026-08-03', title:'全球首款基因编辑药物CASGEVY上半年销售额1.19亿美元——FDA扩展至2岁及以上儿童，体内基因编辑管线密集推进', tag:'产业动态', source:'CRISPR Therapeutics Q2财报/研发客 2026-08-03', url:'https://www.phirda.com/artilce_43380.html', desc:'CRISPR Therapeutics公布2026 Q2业绩：CASGEVY（exa-cel，全球首款获批CRISPR/Cas9基因编辑细胞疗法）Q2单季营收7600万美元、环比+78%、同比+151%，上半年累计约1.19亿美元，已在39个国家获批用于镰状细胞病（SCD）和输血依赖性地中海贫血（TDT）。本季度关键里程碑：FDA批准CASGEVY用于2岁及以上SCD/TDT患儿，从提交到获批仅53天，约5500名患儿首次获得治疗资格；体内基因编辑管线方面，CTX310（ANGPTL3，1b期）最高剂量组降幅73%-80%，CTX340（AGT，难治性高血压）已获FDA IND并于Q2启动1期。'}",
    "{date:'2024-08', title:'百吉生物BRG01（EBV特异性CAR-T）获FDA批准关键II期——首个在中美同步进入复发/转移性EBV阳性鼻咽癌II期的细胞疗法（存量补充）', tag:'临床进展', source:'PR Newswire 2024-08-13 / Targeted Oncology', url:'https://www.targetedonc.com/view/fda-greenlights-phase-2-trial-for-brg01-in-ebv-nasopharyngeal-carcinoma', desc:'百吉生物（Biosyngen）的EBV特异性CAR-T候选BRG01获美国FDA批准开展关键II期临床试验，此前中国NMPA/CDE已批准同类关键II期，使其成为首个在中美同步进入该适应症II期的细胞疗法。I期（NCT05864924）自2024年初在中美入组，9名至少接受过一种免疫检查点抑制剂治疗的晚期鼻咽癌患者完成输注，未见DLT，高剂量组约75%患者PET-CT显示病灶坏死与代谢降低。BRG01于2023年6月获FDA孤儿药资格、2023年7月获快速通道资格。'}",
]
html = insert_items(html, 'CLINICAL_PROGRESS', cli_items)

# ============ 2. INDUSTRY_NEWS +2 ============
ind_items = [
    "{date:'2026-07-29', title:'纳基奥仑赛、瑞基奥仑赛两款CAR-T通过2026年基本医保目录初步形式审查——CAR-T首次进入基本医保目录初审', tag:'政策支付', source:'国家医保局/湖南日报 2026-07-29', url:'https://www.toutiao.com/article/7667723322259407375/', desc:'国家医保局公布2026年基本医保目录调整初步形式审查结果：合源生物纳基奥仑赛注射液（99.9万元/针）、药明巨诺瑞基奥仑赛注射液（129万元/针）两款CAR-T以目录外条件通过初审——这是CAR-T产品首次进入基本医保目录初审名单。同时，雷尼基奥仑赛、普基奥仑赛出现在2026年商保创新药目录的目录外药品初审名单，舒瑞基奥仑赛通过首次引入的预申报制度参与商保目录初审。业内分析认为与医保目录首次引入预申报机制、打通商保转入通道等制度创新密切相关，虽最终谈判仍有不确定性，但百万CAR-T叩响基本医保大门具有标志性意义。'}",
    "{date:'2026-08-05', title:'石药集团与阿斯利康成立合资公司——共建新一代生物制品制造基地（51/49股权），深化战略合作', tag:'产业合作', source:'石药集团港交所公告 2026-08-05', url:'https://www1.hkexnews.hk/listedco/listconews/sehk/2026/0805/2026080500460.pdf', desc:'8月5日石药集团（1093.HK）公告与阿斯利康签署合资合同：按51%:49%股权比例成立合资公司，在石家庄建设新一代生物制品制造基地，初期聚焦为全球市场生产和供应双方约定的生物药原液（DS），未来视业务发展扩展更多产品。合资公司结合石药AI驱动GMP体系与制造能力、阿斯利康全球质量标准与供应链管理经验，标志石药国际化从产品技术出海迈向制造与供应链体系出海。'}",
]
html = insert_items(html, 'INDUSTRY_NEWS', ind_items)

# ============ 3. FUNDING_TRENDS +1 ============
fund_items = [
    "{date:'2026-08-13', title:'虹信生物完成数亿元B轮融资——中金资本领投，体内CAR-T管线HN2301领跑（SLE首例FIH）', source:'医药魔方/PharmCube 2026-08-13', url:'https://bydrug.pharmcube.com/news/detail/a793c2137cbc4f29755bf14aac3ca3a3', desc:'深圳虹信生物（MagicRNA）宣布完成B轮融资，由中金资本旗下基金领投、康君资本联合领投，国开科创、中银资产、苏高新金控、国舜投资及老股东经纬创投、IDG资本、南岭资本、华泰金斯瑞、中国生物制药（中生引领基金）、海愿资本跟投，金额达数亿元人民币。公司攻克mRNA肝外非APC靶向递送难题，开发工程化细胞靶向递送平台（EnC-LNP）；in vivo CAR-T管线HN2301于2025年Q1完成全球首例SLE患者给药（First-in-human），已入组数十例自免病患者、未见肝毒性及>2级CRS，首批临床成果发表于NEJM并入选2026 ASGCT口头报告与EULAR Highlights。近一年完成三轮市场化融资，资金用于中美IND申报与全球临床开发。'}",
]
html = insert_items(html, 'FUNDING_TRENDS', fund_items)

# ============ 4. EXPERT_VIEWS +2 ============
exp_items = [
    "{name:'陈竺', title:'中国科学院院士·血液学', avatar:'陈', quote:'上海市脐带血造血干细胞库与上海交通大学医学院附属瑞金医院深度合作，推进脐带血来源通用型CAR-T细胞临床转化，并已取得阶段性成功——依托脐带血免疫扩增潜力强的独特优势，直击当前细胞治疗成本高、可及性差的痛点，为复发难治性血液肿瘤患者带来切实希望；这不仅是产学研医用一体化协同创新的生动范例，更标志着中国在该前沿领域已具备与国际顶尖水平同台竞技的实力。', source:'全国脐带血库行业协同与高质量发展研讨会暨第二十二届中国脐带血造血干细胞移植与伦理峰会（2026-08-01 上海）·经济日报', date:'2026-08', cat:'院士'}",
    "{name:'程涛', title:'中国工程院院士·血液病学专家', avatar:'程', quote:'全球现存储约800万份脐带血（中国245万份），构成天然干细胞战略储备资源，行业需着力提升临床使用效率、拓展治疗适应症，为我国脐血资源开发利用指明发展方向；脐带血移植稳定植入率已提升至97%以上，治疗病种覆盖近80种，从血液病拓展至免疫缺陷病、遗传代谢病乃至部分神经系统疾病。', source:'第二届脐血应用与转化大会暨中国血液病专科联盟脐血研究及应用联盟会议主旨报告（2026-08-13 天津）·新浪财经', date:'2026-08', cat:'院士'}",
]
html = insert_items(html, 'EXPERT_VIEWS', exp_items)

# ============ 5. LOCAL_POLICY +1 ============
pol_items = [
    "{date:'2026-07-27', title:'福州市服务业扩大开放综合试点实施方案——探索允许外商投资企业开展细胞治疗、基因诊断与治疗技术转化应用，打造榕台细胞治疗临床研究核心基地', source:'福州市人民政府办公厅 2026-07-27', url:'https://www.fuzhou.gov.cn/zwgk/gb/202607/t20260727_5350694.htm', desc:'《福州市服务业扩大开放综合试点工作实施方案》明确：探索允许外商投资企业依法依规开展细胞治疗、基因诊断与治疗技术转化和临床应用；以在榕医院和高校为载体，打造榕台细胞治疗临床研究核心基地，成立细胞与基因治疗研究中心，推进细胞治疗类临床研究协同攻关；支持符合条件的外籍及港澳台医生在榕设立诊所；畅通临床急需药械进口，允许合规创新药械在符合条件时随批随进。'}",
]
html = insert_items(html, 'LOCAL_POLICY', pol_items)

# ============ 6. INDUSTRY_REPORTS +1 ============
rep_items = [
    "{title:'中关村新兴科技服务业产业联盟《2025中国细胞与基因治疗产业发展全景报告》', date:'2026-08', source:'中关村新兴科技服务业产业联盟/新京报', url:'https://news.qq.com/rain/a/20260814A0AU2X00', desc:'报告指出CGT研发风险高、早期成功率低；产业链关键环节如病毒载体生产依赖进口、成本高；高价格导致患者可及性受限；生产制造复杂。未来产业链瓶颈包括病毒载体产能不足、关键耗材依赖进口、支付体系尚不完善。建议政府进一步完善技术评价体系、加快审批与上市通道、出台针对性支持政策、推动国产关键材料和装备研发，并鼓励企业与医院、保险公司合作创新商业模式和支付方案。（2026-08-14 新京报报道引用）'}",
]
html = insert_items(html, 'INDUSTRY_REPORTS', rep_items)

# ============ 7. CONFERENCE_EVENTS +1 ============
conf_items = [
    "{title:'ICGT 2026第十届细胞治疗深度聚焦论坛（2026-10-22~23 上海）——聚焦体内CAR-T、自免与CNS适应症及联合治疗', date:'2026-10', source:'PharnexCloud/药研社', url:'https://www.pharnexcloud.com/zixun/shiye/ytsd_339367', desc:'第十届细胞治疗深度聚焦论坛（ICGT 2026）将于2026年10月22-23日在上海举行，聚焦细胞治疗未来图景，涵盖体内CAR-T前沿、多适应症拓展与联合治疗策略核心模块，围绕递送体系、体内重编程效率与安全性控制、自免与中枢神经系统疾病治疗、实体瘤治疗、多模态协同治疗及临床转化决策等议题深入探讨，报名通道已开启。'}",
]
html = insert_items(html, 'CONFERENCE_EVENTS', conf_items)

# ============ 8. LEARNING_COURSES +1 ============
course_items = [
    "{title:'明眸计划——第三期单采治疗技术精英培训班（中国医学科学院血液病医院·2026年10月下旬）', org:'中国医学科学院血液病医院（血液学研究所）', date:'2026-10', source:'中国医学科学院血液病医院招生简章', url:'https://m.sohu.com/a/1057188196_121106842', desc:'国家级继续医学教育项目，每年1期、每期4-5天、最多15名学员，免培训费。理论模块涵盖单采治疗筹备及管理路径、外周血造血干细胞采集、CAR-T细胞治疗相关临床和采集内容、儿科患者干细胞采集与安全管理；临床实践在输血医学中心单采治疗室开展CAR-T制备所需淋巴细胞采集、外周血造血干细胞采集、血浆置换等实操。面向从事单采治疗5年以上、中级及以上职称的医疗技术人员。'}",
]
html = insert_items(html, 'LEARNING_COURSES', course_items)

# ============ 9. 轮播 highlights 替换：霍德C轮 → 石药SYS6042 ============
old_slide = "    {type:'funding', tag:'融资', text:'<div style=\"font-size:20px;font-weight:700;line-height:1.35;margin-bottom:6px;\">霍德生物完成近2亿元C轮融资首关</div><div style=\"font-size:13px;opacity:0.92;font-weight:400;\">iPSC神经细胞疗法加速全球临床 · 天士力资本领衔</div>', action:'switchSection(\\'news\\')', bg:'url(https://images.unsplash.com/photo-1579165466741-7f35e4755662?w=1200&q=80)'}"
new_slide = "    {type:'clinical', tag:'体内CAR-T', text:'<div style=\"font-size:20px;font-weight:700;line-height:1.35;margin-bottom:6px;\">石药体内CAR-T SYS6042获SLE临床许可</div><div style=\"font-size:13px;opacity:0.92;font-weight:400;\">全球首款获批SLE临床试验的LNP-mRNA CD19/BCMA CAR-T · 国产首款注册临床体内CAR-T</div>', action:'switchSection(\\'news\\')', bg:'url(https://images.unsplash.com/photo-1532187863486-abf9dbad1b69?w=1200&q=80)'}"
if old_slide in html:
    html = html.replace(old_slide, new_slide)
    print("轮播替换 OK")
else:
    print("!! 轮播替换未命中，检查原文")

with io.open(PATH, "w", encoding="utf-8", newline="") as f:
    f.write(html)
print("写入完成")
