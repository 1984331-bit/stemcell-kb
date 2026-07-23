#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""替换index.html中的VERIFIED_PROJECTS数组"""

import re

# 读取生成的86项
with open('C:/Users/YSJ/WorkBuddy/Claw/stemcell-kb/projects_output.js', 'r', encoding='utf-8') as f:
    generated = f.read()

# 去掉末尾的];和统计信息，保留数组内容
# 找到var VERIFIED_PROJECTS = [ 和 ];
match = re.search(r'(var VERIFIED_PROJECTS = \[)', generated)
array_start = match.group(1)
# 找到最后一项的结尾（在];之前）
array_body = generated[generated.index('[')+1:generated.rindex('];')]

# 2024-2025年近期项目（保留原有的7项，补充filingNo等字段）
recent_projects = """
  // === 近期获批备案项目（2024-2025）===
  {institution:'中国医学科学院阜外医院', name:'人脐带间充质干细胞膜片治疗低射血分数冠心病', cell:'UC-MSC膜片', phase:'I期', city:'北京', region:'华北', batch:'近期(2024)', filingNo:'ChiCTR2400092039', source:'https://www.chictr.org.cn/hvshowprojectEN.html?id=263343'},
  {institution:'上海市东方医院（同济大学附属东方医院）', name:'iPSC分化的多巴胺能神经前体细胞治疗帕金森病（全国首个iPSC国家级备案项目）', cell:'iPSC', phase:'I期', city:'上海', region:'华东', batch:'近期(2025)', source:'https://www.shobserver.com/wx/detail.do?id=840711'},
  {institution:'华中科技大学同济医学院附属同济医院', name:'人脐带间充质干细胞移植治疗亚急性期脑出血', cell:'UC-MSC', phase:'I期', city:'武汉', region:'华中', batch:'近期(2025)', filingNo:'MR-42-25-002783', pi:'唐洲平教授', source:'https://tjh.com.cn/contents/1387/55080.html'},
  {institution:'深圳市第三人民医院', name:'NK010注射液在阿尔茨海默病中的安全性及初步疗效（开放、对照）', cell:'NK', phase:'I/II期', city:'深圳', region:'华南', batch:'近期(2025)', pi:'赵宇、张政', source:'https://www.dutenews.com/n/article/10623230'},
  {institution:'新乡医学院第一附属医院', name:'自体骨髓间充质干细胞体外构建骨修复四肢长管状骨缺损', cell:'BM-MSC', phase:'I期', city:'新乡', region:'华中', batch:'近期(2025)', source:'https://www.toutiao.com/article/7472295184139665960'},
  {institution:'高州市人民医院', name:'骨髓间充质干细胞治疗缺血性心肌病（随机对照）— 全国县级首家双备案', cell:'BM-MSC', phase:'I期', city:'高州', region:'华南', batch:'近期(2024)', source:'http://www.gaozhou.gov.cn/ztzl/zwwgk/fwgk/content/post_1300227.html'},
  {institution:'苏北人民医院', name:'人脐带间充质干细胞治疗肩袖损伤（前瞻性、随机、对照）', cell:'UC-MSC', phase:'I期', city:'扬州', region:'华东', batch:'近期(2025)', source:'https://wjw.yangzhou.gov.cn/xwzx/gzdt/art/2025/art_8131a505b36741c88177cf5e472cc04b.html'},
  {institution:'赣南医科大学第一附属医院', name:'骨髓间充质干细胞治疗乙肝相关慢加急性肝衰竭(ACLF) — 江西省首家双备案', cell:'BM-MSC', phase:'I/II期', city:'赣州', region:'华东', batch:'近期(2024)', source:'https://www.gmu.edu.cn/info/1003/14553.htm'},
  {institution:'中国医学科学院北京协和医院', name:'人脂肪间充质干细胞注射液局部注射治疗系统性硬化症手部皮肤病变', cell:'AD-MSC', phase:'I期', city:'北京', region:'华北', batch:'近期(2023)', filingNo:'伦理批号KS20231294', source:'https://www.chictr.org.cn/showproj.html?proj=208895'},
  {institution:'徐州医科大学附属医院', name:'人脐带间充质干细胞注射液治疗糖尿病足创面的前瞻性、随机、对照临床研究（全国首个糖尿病足干细胞备案项目）', cell:'UC-MSC', phase:'I/II期', city:'徐州', region:'华东', batch:'近期(2021)', source:'https://jsnews.jschina.com.cn/xz/a/202112/t20211206_2906298.shtml'}"""

# 组合完整数组
# 86项的最后一项不需要逗号，但加上后续项目需要逗号
# 找到86项的最后一行，加上逗号
array_body_stripped = array_body.rstrip()
if array_body_stripped.endswith('}'):
    array_body_stripped += ','

full_array = array_start + array_body_stripped + recent_projects + "\n];"

# 读取index.html
with open('C:/Users/YSJ/WorkBuddy/Claw/stemcell-kb/index.html', 'r', encoding='utf-8') as f:
    html = f.read()

# 找到旧数组的起止位置
old_start_marker = '// 备案项目数据（来源：国家卫健委干细胞临床研究备案公示、ChiCTR、各医院公告）'
old_end_marker = '];\n\n// Helper: get verified projects for a given institution'

start_idx = html.index(old_start_marker)
end_idx = html.index(old_end_marker) + len('];')

old_block = html[start_idx:end_idx]
new_block = full_array

# 替换
new_html = html[:start_idx] + new_block + html[end_idx:]

# 写回
with open('C:/Users/YSJ/WorkBuddy/Claw/stemcell-kb/index.html', 'w', encoding='utf-8') as f:
    f.write(new_html)

# 统计
total = 86 + 10  # 86项官方 + 10项近期
print(f"替换完成！")
print(f"  旧数组长度: {len(old_block)} chars")
print(f"  新数组长度: {len(new_block)} chars")
print(f"  总项目数: {total} 项 (86项官方备案 + 10项近期)")
print(f"  HTML文件大小: {len(new_html)} chars")
