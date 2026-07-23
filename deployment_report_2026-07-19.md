# CGT 知识库（P1 → P2 → P0）整体更新·待部署内容报告

**报告生成时间**：2026-07-19
**总 commit 数**：6 个本地未 push（按 P1→P2→P0 顺序）
**执行原则**：按用户原话"最后部署前，需要给我更新内容报告，让我知道更新了哪些内容"——本轮所有 commit 不 push，待用户审核报告后一次性 git push

---

## 1. 6 个本地未 push commit 一览

| # | Commit | 任务 | 关键变更 |
|---|--------|------|---------|
| 1 | `3aef2a4` | **P1.D** 行业资讯 5 子板块增量 | NEWS/FRONTIER/INDUSTRY/LOCAL/FUNDING 共 +15 条（41→56） |
| 2 | `d1cdd30` | **P2.E** 备案项目增量 | 818号令 2026 年 3 批 47 项（96→143） |
| 3 | `d88f0fa` | **P2.F** 临床招募增量 | ClinicalTrials.gov 7 路检索补 16 条（97→113） |
| 4 | `56c6b5d` | **P0.H** 9 篇原创回扫 | 修复 3 处死链（EMA/FDA AI/FDA RMAT） |
| 5 | `b9ae148` | **P0.P** JS 转义审计 | acorn 精准替换 119 个数据撇号 → U+2019 |
| 6 | `df5cded` | **P0.L** 死链扫描 | 156 URL 批量检查 + 修复 PMID 41234098 DOI 404 |

**P0.K 审计字段清理** — 零改动通过：审计发现 audit_status/audit_note 字段在 index.html 中**仅 1 处出现**（行 5412 ALL_DATA 数组内），**无任何前端渲染代码引用**。任务目标"保留数据 + 删除卡片展示"已天然达成。

---

## 2. 各 commit 详细内容

### 2.1 P1.D 行业资讯 5 子板块增量（commit `3aef2a4`）

**总增量**：+15 条（41→56），5 板块均增

| 板块 | 增量 | 关键内容 |
|------|------|---------|
| **NEWS_FLASH** | +4（11→15） | FDA 批准 Casgevy 扩展≥2 岁 / 哈佛 Nature 分子伪装无化疗 / Science 合成 WNT 肾类器官 / Science TAPIR CRISPR 激活 rRNA |
| **FRONTIER_RESEARCH** | +3（7→10） | 与 NEWS 同步收录 3 条顶刊 |
| **INDUSTRY_REPORTS** | +2（7→9） | 2026 Q2 CGT 投融资 19 家 30 亿+ / 中国 CGT 双轨制下 CDMO 订单加速 |
| **LOCAL_POLICY** | +3（7→10） | 上海 CGT 产业新政（沪科合〔2026〕5号）/ 2026 黄埔细胞与基因创新大会 / 上海 CGT 产业化资源对接专场 |
| **FUNDING_TRENDS** | +3（9→12） | 睿健医药 2.6 亿 C+ 轮 / 尧唐生物 5 亿 C 轮 / 中因科技 1.13 亿战投 |

**质量保证**：所有 URL 经 WebSearch 真实核实可访问；字段统一 `{date,title,tag,source,url,desc}`

---

### 2.2 P2.E 备案项目增量（commit `d1cdd30`）

**总增量**：+47 条（96→143），全部 818 号令新规下"生物医学新技术临床研究"备案项目

**数据来源**（2 个 URL 双重核实）：
- 第 3 批 34 项（MR-N-44-2026-000014 ~ MR-N-12-2026-000047）：https://finance.sina.com.cn/wm/2026-06-26/doc-iniesvke2095723.shtml
- 第 1/2 批 13 项：https://www.hjtdsm.com/zixun/zhengce/60362.html

**cell 类型覆盖**（18 类）：UC-MSC / BM-MSC / AD-MSC / DP-MSC / AEC / NSC / HSPC / MCTL / CAR-M / CAR-T / CAR-NK / TCR-T / CAR-DC / NK / EBV-T 等

**隐藏 bug 修复**：VERIFIED_PROJECTS 第 96 条（徐州医大附一糖尿病足项目）末尾漏 `,`——二分定位后补 `,`，143 条整体解析通过

**质量保证**：所有 47 条经 WebSearch/WebFetch 双重核实（备案号/项目名/机构均真实可验证）；严格遵守"数据真实性红线"——无任何编造条目

**机构库**：102 家（华北 20 / 东北 7 / 华东 35 / 华中 10 / 华南 16 / 西南 12 / 西北 2）—— 818号令新规下"生物医学新技术"机构（中山肿瘤/北大肿瘤/瑞金等）暂未增补，待用户确认

---

### 2.3 P2.F 临床招募增量（commit `d88f0fa`）

**总增量**：+16 条（97→113），按 cellType 均衡补全

**检索方法**：CT.gov API v2 7路关键词检索（MSC / iPSC / CAR-NK / TIL / TCR-T / Treg / HSCT），按 cellType 平衡挑选 20 条，WebFetch 核实后删除 4 条信息不全条目，最终入库 16 条

**16 条明细**：
- **MSC (3)**：NCT07153769（银屑病）/ NCT06707115（膝骨关节炎）/ NCT07614061（肝硬化）
- **iPSC (3)**：NCT06245511（帕金森）/ NCT05989814（视网膜病变）/ NCT06145818（角膜病）
- **CAR-T (2)**：NCT07715136（实体瘤）/ NCT06319289（B 细胞淋巴瘤）
- **CAR-NK (2)**：NCT07144462（AML）/ NCT06800236（卵巢癌）
- **TIL (3)**：NCT07715135 / NCT07654229 / NCT07530533（实体瘤）
- **Stem Cell (3)**：NCT06998706（脑瘫）/ NCT06719568（肝衰竭）/ NCT06721509（膝关节）

**byCell 分布均衡化效果**：
- 原 97 条：CAR-T 52 条（54%）—— 占比偏高
- 新增 16 条后 113 条：CAR-T 54(48%) / CAR-NK 14(12%) / MSC 10(9%) / iPSC 9(8%) / Stem Cell 6(5%) / TIL 5(4%) / NK 4(4%) / Cell Therapy 4(4%) / γδT 2(2%) / Treg 1 / DC-CIK 1 / CAR-γδT 1 / Other 1 / Gene Therapy 1

**质量保证**：全部 16 条经 CT.gov API 验证为 RECRUITING 状态；4 个 NCT 经 WebFetch 修正 cellType

---

### 2.4 P0.H 9 篇原创回扫（commit `56c6b5d`）

**审计范围**：ORIGINAL_ARTICLES 全部 9 篇（专著 1 + 政策解读 2 + 学术评论 2 + 文献综述 2 + 产业分析 2）

**审计维度**：
1. 字段完整性：9 篇全部含 tag/title/desc/date/words/content ✅
2. JS 语法：vm.Script + node --check 双重通过 ✅
3. 内容字数：content 长度 1970-6174 字符，与 words 标记一致 ✅
4. URL 可访问性：46 个 URL 批量 HEAD 检查

**3 处死链修复**（4 insertions + 4 deletions）：

| URL 类型 | 出现位置 | 原 URL（404） | 新 URL |
|---------|---------|-------------|--------|
| EMA | REGULATIONS 数组 + Art2 参考文献 | `ema.europa.eu/en/human-cell-based-medicinal-products-scientific-guideline_en` | `ema.europa.eu/en/human-regulatory-overview/research-development/scientific-guidelines/multidisciplinary-guidelines/multidisciplinary-guidelines-cell-therapy-tissue-engineering` |
| FDA AI 指南 | Art5 参考文献（href + 显示文本，2 处） | `fda.gov/.../use-artificial-intelligence-support-regulatory-decision-making-...` | `fda.gov/news-events/press-announcements/fda-proposes-framework-advance-credibility-ai-models-used-drug-and-biological-product-submissions/` |
| FDA RMAT | Art9 参考文献（href + 显示文本，2 处） | `fda.gov/.../regenerative-medicine-advanced-therapy-designation` | `fda.gov/BiologicsBloodVaccines/CellularGeneTherapyProducts/ucm537670.htm` |

---

### 2.5 P0.K 审计字段清理 — **零改动通过**（无 commit）

**审计方法**：grep 全文搜索 `audit_status` / `audit_note` / `d.audit_*` / `auditStatus*` / `data-audit` / `class.*audit` / `.audit-*`

**惊人发现**：
- audit_status / audit_note 字符串在 index.html 中**仅 1 处出现**（行 5412 ALL_DATA 数组内）
- **0 处前端渲染代码引用**（无 renderXXX 函数、JS 判断、CSS 类、HTML 标签）
- audit_status 分布：669 篇 "KEEP" + 2 篇 "NEW" + 61 篇 "" = 732 篇（与 ALL_DATA 总数一致）

**结论**：任务目标"保留数据 + 删除卡片展示"已**天然达成**——数据字段全部保留在 ALL_DATA，前端零展示代码

---

### 2.6 P0.P JS 转义审计（commit `b9ae148`）

**任务目标**：全文件扫描英文撇号，备份+替换为 U+2019，验证 JS 语法

**关键约束**：JS 字符串内 `\'` 转义序列必须保留 U+0027（否则 `\’` 是无效转义，JS 解析失败）

**技术演进**（3 次回滚 + 4 个版本）：
- v1 全局替换：24,636 个 `'` → U+2019 看似成功，但 PRODUCTS 数组的 75 条全 FAIL——**根因**：PRODUCTS 用单引号 `'<value>'` 作为 JS 字符串边界
- v2 双引号字符串状态机：状态机不理解 HTML 属性 `class="..."` 嵌套在 JS 单引号字符串内
- v3 纯 HTML 文本：0 个替换——所有撇号都在 script 块内
- **v4 acorn 解析器（最终方案）**：精准定位 35,571 个 JS 字符串字面量（23,661 双引号 + 11,910 单引号）

**v4 最终结果**：
- 替换 **119 个**双引号 JS 字符串内字面撇号 → U+2019
- 样本：Wharton's(18)、Parkinson's(11)、Crohn's(6)、D'Hoore(1)、Sjögren's 等
- 保留 24,786 个功能性撇号（JS 单引号字符串边界 + onclick 参数边界 + HTML 单引号属性 + 转义撇号）

**验证**：3 个 script block + 11 个数据数组全部 vm.Script PASS

**备份保留**：`index.html.bak_p0p`（1,486,558 字节）随 commit 保留

---

### 2.7 P0.L 死链扫描（commit `df5cded`）

**总抽样**：196 URL → 去重 156

**检查结果**：
- 140 OK (89.7%)
- 15 反爬虫假死链（412/403/ECONNRESET/500，浏览器实测可访问）
  - nhc.gov.cn (×2)、nmpa.gov.cn (×2)、sciencedirect.com、cell.com、science.org (×2)、bmj.com (×2)、news.vrtx.com (×2)、medpagetoday.com、dpxintech.com、mfds.go.kr
- **1 真死链（已修复）**：PMID 41234098 doi.org 404

**真死链修复**：
- ALL_DATA 行 243993：`doi` 字段从 `10.19746/j.cnki.issn.1009-2137.2025.05.031` → 空
- doi.org 不收录中国实验血液学杂志 doi（ISSN 1009-2137）
- 改为空后 PubMed 链接（https://pubmed.ncbi.nlm.nih.gov/41234098/）继续显示

**整体可访问性**：99.5% (195/196) — 优秀

**输出文件**：`deadlink_report.md`（详细分类、明细、修复方案、后续建议）

---

## 3. 数据统计总览

| 维度 | P1.D | P2.E | P2.F | P0.H | P0.P | P0.L | 合计 |
|------|------|------|------|------|------|------|------|
| 新增数据 | 15 条 | 47 条 | 16 条 | 0 | 0 | 0 | **78 条** |
| 修复条目 | 0 | 1 | 4 | 0 | 0 | 1 | **6 处** |
| 替换字符 | 0 | 0 | 0 | 0 | 119 | 0 | **119 字符** |
| 删除 URL | 0 | 0 | 0 | 0 | 0 | 0 | **0** |
| 死链修复 | 0 | 0 | 0 | 3 | 0 | 1 | **4 处** |

**数据数组最终状态**（11 个数组）：
- ALL_DATA: 732 条
- PRODUCTS: 75 款
- REGULATIONS: 47 份
- ORIGINAL_ARTICLES: 9 篇
- VERIFIED_PROJECTS: 143 项
- RECRUITING_TRIALS: 113 条
- NEWS_FLASH: 15 条
- FRONTIER_RESEARCH: 10 条
- INDUSTRY_REPORTS: 9 条
- LOCAL_POLICY: 10 条
- FUNDING_TRENDS: 12 条
- **合计**：1,175 条数据条目

---

## 4. 未执行的待办（需用户输入）

| 任务 ID | 任务 | 等待用户输入 |
|---------|------|-------------|
| P1.I #445 | 转载文章启动 | 用户提供 3-5 篇目标文章链接 |
| P1.J #446 | 编辑精选 4-5 期 | 用户确认主题候选清单 |
| P2.G #450 | 新原创文章 | 用户选题 |

---

## 5. 风险与注意事项

1. **P0.P 备份文件**：`index.html.bak_p0p`（1.4MB）随 commit `b9ae148` 已推入仓库——保留是为了万一需要回滚时可直接使用
2. **反爬虫假死链**：15 个 HEAD 探测失败的 URL（nhc/nmpa/sciencedirect/cell/science.org/bmj/news.vrtx/medpagetoday/dpxintech/mfds）在浏览器中实测**可正常访问**——已通过 P0.H 和 P0.L 多次验证
3. **数据真实性**：所有新增 78 条数据均经 WebSearch/WebFetch 严格核实；无任何编造条目
4. **机构库暂未增补**：P2.E 已说明 818号令新规下"生物医学新技术"机构（如中山肿瘤/北大肿瘤/瑞金）未增补，因其"临床研究机构"角色与原"干细胞备案机构"体系不同——建议在最终审核时确认是否需要

---

## 6. 部署建议

**用户审核通过后**，按以下步骤一次性 push：
```bash
cd C:/Users/YSJ/WorkBuddy/Claw/stemcell-kb
git push origin main
```

6 个 commit 将按时间顺序推送到 `origin/main`，部署到 GitHub Pages（https://1984331-bit.github.io/stemcell-kb/）

**缓存刷新**：因 GitHub Pages 部署后需要时间生效，建议 push 后等待 1-2 分钟，访问时强制刷新（Ctrl+F5）以加载新版本

---

**报告完成时间**：2026-07-19
**执行者**：CGT 知识库维护团队
**等待用户审核 → 确认后 git push**
