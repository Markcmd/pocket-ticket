// Menu data. No prices — guests see them on the printed menu.
// Special A and Special B share numbering 1–22; B continues to 36.

const MEATS = [
  { id: "m1", no: 1, en: "Sliced Beef Brisket", zh: "肥牛" },
  { id: "m2", no: 2, en: "Thin Sliced Beef Belly", zh: "牛五花" },
  { id: "m3", no: 3, en: "Beef Bulgogi", zh: "腌牛肉片" },
  { id: "m4", no: 4, en: "Garlic Sauce Chicken", zh: "蒜蓉鸡腿肉" },
  { id: "m5", no: 5, en: "Spicy Chicken Bulgogi", zh: "香辣鸡腿肉", spicy: true },
  { id: "m6", no: 6, en: "Garlic Sauce Pork Bulgogi", zh: "蒜蓉腌猪肉" },
  { id: "m7", no: 7, en: "Spicy Pork Bulgogi", zh: "香辣腌猪肉", spicy: true },
  { id: "m8", no: 8, en: "Pork Steak", zh: "猪颈肉" },
  { id: "m9", no: 9, en: "Marinated Pork Steak", zh: "腌猪颈肉" },
  { id: "m10", no: 10, en: "Pork Jowl", zh: "猪颊肉" },
  { id: "m11", no: 11, en: "Thin Sliced Pork Belly", zh: "超薄五花肉" },
  { id: "m12", no: 12, en: "Unmarinated Pork Belly", zh: "五花肉" },
  { id: "m13", no: 13, en: "Garlic Sauce Pork Belly", zh: "蒜蓉五花肉" },
  { id: "m14", no: 14, en: "House Sauce Pork Belly", zh: "白宫五花肉" },
  { id: "m15", no: 15, en: "Spicy Pork Belly", zh: "香辣五花肉", spicy: true },
  { id: "m16", no: 16, en: "Squid", zh: "鱿鱼" },
  { id: "m17", no: 17, en: "Spicy Squid", zh: "香辣鱿鱼", spicy: true },
  { id: "m18", no: 18, en: "King Mushroom", zh: "蘑菇" },
  { id: "m19", no: 19, en: "Steamed Egg", zh: "蒸鸡蛋", tip: "1份/2人" },
  { id: "m20", no: 20, en: "Bean Paste Stew", zh: "豆瓣酱炖菜", tip: "1份/2人" },
  { id: "m21", no: 21, en: "Steamed Rice", zh: "米饭" },
  { id: "m22", no: 22, en: "Vegetable Salad", zh: "蔬菜沙拉" },
  { id: "m23", no: 23, en: "Corn Cheese", zh: "芝士玉米", tip: "1份/2人" },
  { id: "m24", no: 24, en: "Beef Jumulleok", zh: "腌排骨肉" },
  { id: "m25", no: 25, en: "Beef Rib Finger", zh: "牛肋间" },
  { id: "m26", no: 26, en: "Marinated Rib Finger", zh: "腌牛肋间" },
  { id: "m27", no: 27, en: "Beef Steak", zh: "白宫牛排" },
  { id: "m28", no: 28, en: "Marinated Beef Steak", zh: "腌白宫牛排" },
  { id: "m29", no: 29, en: "Beef Sirloin", zh: "生牛扒" },
  { id: "m30", no: 30, en: "L.A Short Rib", zh: "腌牛仔骨" },
  { id: "m31", no: 31, en: "Beef Tongue", zh: "牛舌" },
  { id: "m32", no: 32, en: "Beef Small Intestine", zh: "牛小肠" },
  { id: "m33", no: 33, en: "Shrimp", zh: "虾" },
  { id: "m34", no: 34, en: "Spicy Shrimp", zh: "香辣虾", spicy: true },
  { id: "m35", no: 35, en: "Baby Octopus", zh: "小八爪鱼" },
  { id: "m36", no: 36, en: "Spicy Baby Octopus", zh: "香辣小八爪鱼", spicy: true },
];

const PREMIUM = [
  { id: "pA", no: "A", en: "Premium Boneless Short Rib", zh: "雪花牛肉" },
  { id: "pB", no: "B", en: "Woodae Galbi", zh: "优质带骨牛肋骨" },
  { id: "pC", no: "C", en: "Tower Galbi", zh: "塔楼排骨" },
  { id: "pD", no: "D", en: "Prime Rib Eye", zh: "雪花牛排" },
];

const COURSES = {
  A: { name: "Special A", short: "A", meats: MEATS.slice(0, 22) },
  B: { name: "Special B", short: "B", meats: MEATS },
  P: { name: "Special Premium", short: "P", meats: MEATS, premium: true },
};

const DRINK_GROUPS = [
  {
    key: "soju", label: "烧酒 Soju", items: [
      { id: "d_saero_o", en: "Saero Original", zh: "Saero 原味" },
      { id: "d_saero_a", en: "Saero Apricot", zh: "Saero 杏子" },
      { id: "d_saero_k", en: "Saero Kiwi", zh: "Saero 奇异果" },
      { id: "d_chum", en: "Chum Churum", zh: "初饮初乐" },
      { id: "d_chamisul_o", en: "Chamisul Original", zh: "真露 Original" },
      { id: "d_chamisul_f", en: "Chamisul Fresh", zh: "真露 Fresh" },
      { id: "d_jinro", en: "Jinro", zh: "Jinro" },
    ],
  },
  {
    key: "fsoju", label: "果味烧酒", items: [
      { id: "d_f_peach", en: "Peach", zh: "桃子" },
      { id: "d_f_grapefruit", en: "Grapefruit", zh: "西柚" },
      { id: "d_f_apple", en: "Apple", zh: "苹果" },
      { id: "d_f_greengrape", en: "Green Grape", zh: "青葡萄" },
      { id: "d_f_yogurt", en: "Yogurt", zh: "酸奶" },
      { id: "d_f_applemango", en: "Apple Mango", zh: "芒果" },
      { id: "d_f_strawberry", en: "Strawberry", zh: "草莓" },
      { id: "d_f_lychee", en: "Lychee", zh: "荔枝" },
      { id: "d_f_plum", en: "Plum", zh: "梅子" },
    ],
  },
  {
    key: "beer", label: "啤酒 Beer", items: [
      { id: "d_somaek", en: "Somaek Tower", zh: "啤酒塔 (3啤+1烧酒)" },
      { id: "d_krush", en: "Krush", zh: "Krush" },
      { id: "d_kloud", en: "Kloud", zh: "Kloud" },
      { id: "d_terra", en: "Terra", zh: "Terra" },
      { id: "d_sapporo", en: "Sapporo", zh: "Sapporo" },
      { id: "d_corona", en: "Corona", zh: "Corona" },
      { id: "d_modelo", en: "Modelo", zh: "Modelo" },
      { id: "d_nabeer", en: "Non Alcoholic Beer", zh: "无酒精啤酒" },
    ],
  },
  {
    key: "wine", label: "酒 Wine", items: [
      { id: "d_bokbunja", en: "Raspberry Wine", zh: "覆盆子酒" },
      { id: "d_baekseju", en: "Herbal Wine", zh: "百岁酒" },
      { id: "d_makgeolli", en: "Korean Rice Wine", zh: "米酒" },
      { id: "d_house_btl", en: "House Wine Bottle", zh: "红酒 整瓶" },
      { id: "d_house_gls", en: "House Wine Glass", zh: "红酒 一杯" },
    ],
  },
  {
    key: "soft", label: "饮料", items: [
      { id: "d_coke", en: "Coke", zh: "可乐" },
      { id: "d_dietcoke", en: "Diet Coke", zh: "健怡可乐" },
      { id: "d_cokezero", en: "Coke Zero", zh: "零度可乐" },
      { id: "d_sprite", en: "Sprite", zh: "雪碧" },
      { id: "d_applejuice", en: "Apple Juice", zh: "苹果汁" },
      { id: "d_tea_passion", en: "Ice Tea Passion Fruit", zh: "冰茶 百香果" },
      { id: "d_tea_peach", en: "Ice Tea Peach", zh: "冰茶 桃子" },
      { id: "d_tea_tropical", en: "Ice Tea Tropical", zh: "冰茶 热带" },
      { id: "d_lemonade", en: "Lemonade", zh: "柠檬水" },
      { id: "d_sparkling", en: "Sparkling Water", zh: "气泡水" },
      { id: "d_water", en: "Bottle Water", zh: "瓶装水" },
    ],
  },
];

const TABLE_COUNT = 17;

// Lookup by id across every list.
const ITEM_INDEX = {};
for (const it of MEATS) ITEM_INDEX[it.id] = { ...it, group: "meat" };
for (const it of PREMIUM) ITEM_INDEX[it.id] = { ...it, group: "premium" };
for (const g of DRINK_GROUPS) for (const it of g.items) ITEM_INDEX[it.id] = { ...it, group: g.key };
