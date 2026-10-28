const PROFILE = {
  nameEn: "Jiang Zhang",
  nameZh: "張江",
  motto: "I am not what I was.",
  roleEn: "Artificial Intelligence Practitioner & Builder",
  roleZh: "人工智能实践者与开发者",
  introEn:
    "I am a retired educator based in Edmonton, Canada, with an academic background in mathematics and computer networking. My career spans mathematics and computing education in China and Canada, business development consulting, investment, and technology project coordination. I now continue to explore programming and artificial intelligence, turning decades of teaching and practical experience into useful systems.",
  introZh:
    "我是一名居住在加拿大埃德蒙顿的退休教师，拥有数学与计算机网络教育背景。我的经历横跨中加两地的数学与计算机教学、企业发展咨询、投资与技术项目协调。退休之后，我继续学习编程和人工智能，并尝试把长期积累的教学经验与实践认知转化为真正有用的系统。",
};

const TYPED_LINES = [
  "Mathematics · Computing · Artificial Intelligence",
  "Teach · Build · Keep learning",
  "I am not what I was.",
  "The Laozi Decision Support System",
];

const TYPED_LINES_ZH = [
  "数学 · 计算机 · 人工智能",
  "教学 · 实践 · 终身学习",
  "今日之我，已非昨日之我",
  "《老子》决策支持系统",
];

const TYPED_PASSAGE_ZH = [
  "什么是道？",
  "老子说：\"道，可道也，非恒道也\"。\"天象无形，道隐无名\"，\"吾不知其谁之子，象帝之先\"。\"视之不见，名之曰微；听之不闻，名之曰希；搏之不得，名之曰夷。三者不可至计，故混而为一。一者，其上不皦，其下不昧。无物之象，是谓芴芒\"，\"道之为状，唯芒唯芴\"。\"随而不见其后，迎而不见其首\"。\"寻寻不可名，复归于无物，是谓无状之状\"。\"有状混成，先天地生。寂兮寥兮，独立而不改，周行而不殆，可以为天地母。吾不知其名，字之曰道，强为之名曰大。大曰逝，逝曰远，远曰反\"。\"反者道之动，弱者道之用\"。\"人法地，地法天，天法道，道法自然\"。\"视之不足见，听之不足闻，用之不可既也\"。\"道冲，而用之有不盈也。渊兮，似万物之宗\"。\"道生一，一生二，二生三，三生万物\"。\"天之道，不争而善胜，不言而善应，不召而自来，默然而善谋\"。\"天之道，犹张弓者也。高者抑之，下者举之。有余者损之，不足者补之。故天之道，损有余而益不足\"。\"故恒无，欲以观其妙；恒有，欲以观其所窍。两者同出，异名同谓；玄之又玄，众妙之门\"。",
];

const SKILL_GROUPS = [
  {
    titleEn: "Mathematics",
    titleZh: "数学",
    items: [
      ["Calculus", "微积分", 4],
      ["Linear algebra", "线性代数", 4],
      ["Probability & statistics", "概率统计", 4],
    ],
  },
  {
    titleEn: "Computing",
    titleZh: "计算机",
    items: [
      ["Computer networks", "计算机网络", 4],
      ["Programming", "编程", 3],
      ["Software development", "软件开发", 3],
    ],
  },
  {
    titleEn: "AI & Systems",
    titleZh: "人工智能与系统",
    items: [
      ["AI applications", "人工智能应用", 3],
      ["System design", "系统设计", 3],
      ["Teaching & mentoring", "教学与辅导", 4],
    ],
  },
];

const EXPERIENCE = [
  {
    period: "1977–1982",
    place: "Yangzhou Teachers College",
    placeZh: "扬州师范学院",
    role: "BSc in Mathematics",
    roleZh: "数学专业本科学习",
  },
  {
    period: "1982–2004",
    place: "Yangzhou Industrial Vocational & Technical College",
    placeZh: "扬州工业职业技术学院",
    role: "Mathematics and Computing Educator",
    roleZh: "数学与计算机教学科研",
  },
  {
    period: "1997–1999",
    place: "Southeast University",
    placeZh: "东南大学",
    role: "Master's studies in Computer Network Applications",
    roleZh: "计算机网络应用专业硕士学习",
  },
  {
    period: "2004–2023",
    place: "Canada",
    placeZh: "加拿大",
    role: "Teaching, entrepreneurship, consulting and project coordination",
    roleZh: "教学、创业、企业咨询与项目协调",
  },
];

const PROJECTS = [
  {
    code: "LOG-01",
    year: "CURRENT",
    yearZh: "进行中",
    titleEn: "Signals API",
    titleZh: "Signals API",
    summaryEn:
      "An API-oriented project for working with structured signals in intelligent systems. Public documentation and demonstrations are being prepared.",
    summaryZh: "面向智能系统结构化信号处理的接口项目。公开说明和演示材料正在整理中。",
    tags: ["API", "Signals", "Systems"],
    tagsZh: ["接口", "信号", "系统"],
    url: "",
  },
  {
    code: "LOG-02",
    year: "CURRENT",
    yearZh: "进行中",
    titleEn: "AI Supermarket",
    titleZh: "AI Supermarket",
    summaryEn:
      "An exploration of how artificial-intelligence tools and services can be organized into a practical, accessible product environment.",
    summaryZh: "探索如何把人工智能工具与服务组织成实用、易用的产品环境。",
    tags: ["AI", "Product", "Platform"],
    tagsZh: ["人工智能", "产品", "平台"],
    url: "",
  },
  {
    code: "LOG-03",
    year: "CURRENT",
    yearZh: "进行中",
    titleEn: "Laozi Decision Support System",
    titleZh: "《老子》决策支持系统",
    summaryEn:
      "A long-term project that turns ideas from the Laozi into a structured resource for analysis and decision support, connecting classical thought with modern AI tools.",
    summaryZh: "将《老子》的思想资源转化为结构化分析与决策支持工具，探索经典思想与现代人工智能的结合。",
    tags: ["Laozi", "Decision Support", "AI"],
    tagsZh: ["《老子》", "决策支持", "人工智能"],
    url: "",
  },
];

const WRITING = [];

const LINKS = [
  { label: "GitHub", labelZh: "GitHub", value: "@jiangzhangai", url: "https://github.com/jiangzhangai" },
  { label: "Email", labelZh: "邮箱", value: "john@jiangzhang.ca", url: "mailto:john@jiangzhang.ca" },
  { label: "Domain", labelZh: "网址", value: "jiangzhang.ca", url: "https://jiangzhang.ca" },
];
