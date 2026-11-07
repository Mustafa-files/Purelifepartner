/**
 * Guides at /blog/[slug]. Content lives here as data so each article gets a
 * static page, Article and FAQ structured data, and a sitemap entry.
 * House rule: no em dashes anywhere in the copy.
 */
export type Section = {
  heading: string;
  paragraphs?: string[];
  bullets?: string[];
  /** Paragraphs shown after the bullets */
  after?: string[];
};

export type Article = {
  slug: string;
  title: string;
  /** <title> tag; keep under about 60 characters */
  metaTitle: string;
  description: string;
  category: "Before Nikah" | "Islamic Guidance" | "Using PureLifePartner";
  published: string;
  updated: string;
  readMinutes: number;
  /** Two or three sentence direct answer, shown first (answer-first for AI search) */
  summary: string;
  sections: Section[];
  faqs: { q: string; a: string }[];
  /** Religious topics carry a "speak to a scholar" note */
  scholarNote?: boolean;
  related: string[];
};

export const ARTICLES: Article[] = [
  {
    slug: "questions-to-ask-before-nikah",
    title: "50 Questions to Ask Before Nikah",
    metaTitle: "50 Questions to Ask Before Nikah | PureLifePartner",
    description:
      "The questions Muslim couples and families should ask before nikah, covering deen, family, money, children, career, living arrangements and more.",
    category: "Before Nikah",
    published: "2026-11-07",
    updated: "2026-11-07",
    readMinutes: 9,
    summary:
      "Before nikah, ask about deen, family expectations, money, children, career, where you will live and how each of you handles conflict. The goal is not to interrogate each other but to find out early whether your values and plans fit, with your families or a wali involved where possible.",
    sections: [
      {
        heading: "Why these conversations matter",
        paragraphs: [
          "Many marriages run into trouble not because either person is bad, but because important expectations were never discussed. Who will manage the money? Will you live with your in-laws? How soon do you want children? These questions feel awkward on a first meeting, but they are far more awkward to discover after the nikah.",
          "Islam encourages both sides to know each other well enough to make an informed decision. Meetings should stay within halal limits: in a public place or with a mahram or family member present, and with honest, respectful conversation. You do not need to ask all fifty questions at once. Use this list as a guide across several meetings and calls.",
        ],
      },
      {
        heading: "Deen and practice",
        bullets: [
          "How important is Islam in your daily life, and how do you practise it?",
          "Do you pray five times a day? How do you feel about praying together at home?",
          "Which school of thought or community do you follow, if any?",
          "How do you feel about hijab, beard and modest dress in the family?",
          "What role do you want Islam to play in raising our children?",
          "Are there religious practices you hope your spouse will share or grow into?",
          "How do you keep learning about the deen: classes, a masjid, a teacher, online?",
          "How do you approach Ramadan, Eid and other Islamic occasions with family?",
        ],
      },
      {
        heading: "Family and in-laws",
        bullets: [
          "How involved are your parents in your decisions, and how involved will they be in our marriage?",
          "Do you expect us to live with, or close to, your family?",
          "What are your responsibilities towards your parents and siblings, financially or otherwise?",
          "How would you handle a disagreement between me and your family?",
          "How often do you expect to visit family, including relatives abroad?",
          "Are there family traditions or cultural expectations around the wedding I should know about?",
          "What qualities are your parents hoping for in your spouse?",
        ],
      },
      {
        heading: "Money and mahr",
        bullets: [
          "What do you expect the mahr to be, and how will it be given?",
          "What are your current income, savings and any debts?",
          "How do you feel about interest-based loans and mortgages?",
          "Will we combine our money, keep it separate, or a mix of both?",
          "Do you expect your spouse to work, and how will a wife's own income be treated?",
          "What are your spending habits? Are you a saver or a spender?",
          "Do you send money to family regularly, and will that continue?",
          "How do you approach zakat and sadaqah as a household?",
        ],
      },
      {
        heading: "Career, education and ambitions",
        bullets: [
          "What are your career plans for the next five years?",
          "Are you happy in your current work, or planning a change?",
          "Do you plan further study, and how would it affect our family life?",
          "Would you consider moving city or country for work?",
          "How do you balance work with family and worship?",
          "What are your hopes and goals outside of work?",
        ],
      },
      {
        heading: "Children and parenting",
        bullets: [
          "Do you want children, and if so, roughly how many and how soon?",
          "How do you feel about family planning?",
          "What kind of schooling would you want: Islamic school, state school or home education?",
          "How were you raised, and what would you do the same or differently?",
          "How should parenting duties be shared between us?",
          "If you have children from a previous marriage, how do you see our family working?",
        ],
      },
      {
        heading: "Home, lifestyle and health",
        bullets: [
          "Where do you want to live after nikah, and is that flexible?",
          "How should household chores be shared?",
          "What does a normal weekday and weekend look like for you?",
          "How do you like to spend free time and holidays?",
          "Do you have any health conditions, physical or mental, that your spouse should know about?",
          "Do you smoke, and how do you feel about it?",
          "What are your expectations around social media and privacy as a couple?",
        ],
      },
      {
        heading: "Character, communication and the past",
        bullets: [
          "How do you handle stress and anger?",
          "How do you prefer to resolve disagreements?",
          "What do you think a husband and wife owe each other?",
          "What are your strengths, and what are you working on improving in yourself?",
          "Have you been married or engaged before? What did you learn from it?",
          "Is there anything about your past you feel your spouse should hear from you first?",
          "Who would we turn to for advice if we struggled in our marriage?",
          "What does a happy marriage look like to you in ten years?",
        ],
      },
      {
        heading: "How to use these questions well",
        bullets: [
          "Spread them over several conversations rather than one long interview.",
          "Answer the questions yourself first, honestly, before asking them.",
          "Involve your wali or family, especially for money, mahr and living arrangements.",
          "Listen for values and attitudes, not perfect answers.",
          "Pray istikhara and seek advice from people who know you both.",
        ],
        after: [
          "On PureLifePartner, members describe their religion, family, education, work and what they are looking for in a spouse, so many of these answers are clear before you even make contact. That leaves your conversations for the questions that matter most to you.",
        ],
      },
    ],
    faqs: [
      {
        q: "How many times should we meet before nikah?",
        a: "There is no fixed number. Many couples meet several times with family present, plus supervised calls, until both feel they can make an informed decision. Take the time you need, but avoid dragging it out without commitment.",
      },
      {
        q: "Is it okay to ask about money and salary before nikah?",
        a: "Yes. Money is one of the most common causes of conflict in marriage. Asking politely about income, debts and expectations, ideally with family involved, is sensible and respectful.",
      },
      {
        q: "Should our parents be part of these conversations?",
        a: "Ideally, yes, especially for mahr, living arrangements and family expectations. Parents and a wali bring experience and can spot issues a couple may miss.",
      },
    ],
    related: ["wali-role-in-online-muslim-marriage", "is-online-muslim-matchmaking-halal"],
  },
  {
    slug: "wali-role-in-online-muslim-marriage",
    title: "The Wali's Role in Online Muslim Marriage",
    metaTitle: "The Wali's Role in Online Muslim Marriage | PureLifePartner",
    description:
      "What a wali is, why the wali matters in nikah, and how to involve your wali when searching for a spouse on a Muslim marriage website.",
    category: "Islamic Guidance",
    published: "2026-11-07",
    updated: "2026-11-07",
    readMinutes: 7,
    summary:
      "A wali is a woman's guardian in marriage, usually her father, who protects her interests and takes part in her nikah. Searching online does not change his role: the safest approach is to involve your wali from the start, from reviewing profiles to the first meetings and the final decision.",
    scholarNote: true,
    sections: [
      {
        heading: "What is a wali?",
        paragraphs: [
          "In Islamic law, the wali is a woman's guardian for the purposes of marriage. He is normally her father. If her father has passed away or cannot act, the role usually passes to other close male relatives, such as her paternal grandfather, adult brother or paternal uncle, following an order of priority set out by the scholars. Where a woman has no suitable male relative, for example many reverts, an imam or Islamic authority can act as her wali.",
          "The wali's purpose is protection, not control. He makes sure the proposed husband is suitable, that the woman's rights are respected, and that the marriage is entered into properly. He cannot force her to marry someone she does not want: her consent is required for a valid nikah.",
        ],
      },
      {
        heading: "Why the wali matters in nikah",
        paragraphs: [
          "The Prophet Muhammad, peace be upon him, said: \"There is no marriage except with a wali.\" This hadith is reported in the collections of Abu Dawud, at-Tirmidhi and Ibn Majah. Based on it, the majority of scholars, including the Maliki, Shafi'i and Hanbali schools, hold that a woman's nikah requires her wali's involvement.",
          "The Hanafi school allows an adult woman to conclude her own marriage contract, but it still strongly recommends her family's involvement and gives the wali a say where the match is clearly unsuitable. Whichever view you follow, every school agrees that involving family brings blessing, protection and wisdom to the process.",
        ],
      },
      {
        heading: "How a wali can help when searching online",
        bullets: [
          "Reviewing profiles: your wali can look through profiles with you and spot things you might overlook.",
          "Making first contact: some families prefer the wali or a parent to make the first approach on a woman's behalf.",
          "Asking the hard questions: a wali can raise topics like mahr, finances and living arrangements that can feel awkward to ask yourself.",
          "Checking background: he can speak to the man's family, his imam or people who know him.",
          "Supervising meetings: he or another mahram can be present, keeping meetings within halal limits.",
          "Guiding the decision: he can advise you honestly, while the final consent remains yours.",
        ],
      },
      {
        heading: "Practical tips for sisters",
        bullets: [
          "Tell your wali early that you are searching online, so he is part of the process rather than surprised by it.",
          "Share profiles you are interested in with him before you exchange contact details.",
          "Agree together on what information you are comfortable sharing and when.",
          "If your father is not Muslim, or you have no male relatives, speak to your local masjid about a wali.",
          "Be wary of anyone who wants to keep the relationship secret from your family. That is a red flag.",
        ],
      },
      {
        heading: "Practical tips for brothers",
        bullets: [
          "Ask early who her wali is and how her family would like to be involved.",
          "Be ready to speak to her wali directly and answer his questions honestly.",
          "Involve your own family too: it shows seriousness and builds trust between the two families.",
          "Respect the pace the family sets; it is a sign of care, not suspicion.",
        ],
      },
      {
        heading: "How PureLifePartner supports wali involvement",
        paragraphs: [
          "PureLifePartner was built with families in mind. Members' real names and phone numbers are never shown publicly, profiles include family details so both sides can understand each other's background, and contact details are only released when both members are verified. Many profiles are created and managed with a parent's help, and our team can be reached on WhatsApp by members and their families alike.",
        ],
      },
    ],
    faqs: [
      {
        q: "Can a woman search for a spouse online without her wali?",
        a: "She can browse, but most scholars advise involving the wali before serious contact and certainly before nikah. Involving him early protects her and avoids problems later.",
      },
      {
        q: "Who is the wali for a revert sister?",
        a: "If a revert has no Muslim male relatives to act as her wali, an imam or a trusted Islamic authority can take on the role. Your local masjid can advise you.",
      },
      {
        q: "Can a wali force a woman to marry?",
        a: "No. A woman's consent is required for a valid nikah. The wali's role is to protect and advise, not to compel.",
      },
    ],
    related: ["is-online-muslim-matchmaking-halal", "questions-to-ask-before-nikah"],
  },
  {
    slug: "is-online-muslim-matchmaking-halal",
    title: "Is Online Muslim Matchmaking Halal?",
    metaTitle: "Is Online Muslim Matchmaking Halal? | PureLifePartner",
    description:
      "Is it halal to look for a spouse online? The Islamic principles that make online Muslim matchmaking permissible, and the lines to avoid crossing.",
    category: "Islamic Guidance",
    published: "2026-11-07",
    updated: "2026-11-07",
    readMinutes: 6,
    summary:
      "Looking for a spouse online is generally considered permissible, because it is simply a modern way of making introductions for marriage. What makes it halal or not is how it is done: a sincere intention to marry, modest and honest communication, no secret relationships, and families or a wali involved.",
    scholarNote: true,
    sections: [
      {
        heading: "Introductions have always been part of Muslim marriage",
        paragraphs: [
          "Muslims have always relied on introductions to find a spouse. Families asked relatives and friends, imams kept an ear out, and matchmakers connected households. A Muslim marriage website does the same job at a much larger scale, which matters for Muslims living in places where families no longer have wide local networks.",
          "Scholars generally treat the method of introduction as a means. It takes the ruling of what it leads to and how it is used. Used to find a spouse in a dignified way, it is permissible. Used for casual chatting or relationships outside marriage, it is not.",
        ],
      },
      {
        heading: "What keeps online matchmaking halal",
        bullets: [
          "A sincere intention: you are there to find a spouse for nikah, not for entertainment or casual relationships.",
          "Honesty: your profile, photos and answers truthfully represent who you are.",
          "Modesty: photos, language and conversations stay respectful and appropriate.",
          "No khalwah: meetings take place in public or with a mahram or family member present, not alone in private.",
          "Purposeful communication: conversations focus on getting to know each other for marriage.",
          "Family involvement: parents and, for a woman, her wali are part of the process.",
          "Moving forward: once you know enough, you either proceed towards nikah or kindly end things.",
        ],
      },
      {
        heading: "The lines to avoid crossing",
        bullets: [
          "Long, aimless private chats with no plan or family knowledge.",
          "Secret relationships hidden from your family.",
          "Flirtatious or intimate messages, photos or video calls.",
          "Meeting alone in private before nikah.",
          "Talking to several people in a misleading way, or leading someone on.",
          "Misrepresenting your age, marital status, deen or circumstances.",
        ],
        after: [
          "These are exactly the problems that make many Muslims uneasy about dating apps. The difference is not the internet itself, but whether the platform and the people using it are focused on marriage.",
        ],
      },
      {
        heading: "Marriage platform or dating app?",
        paragraphs: [
          "A dating app is built around swiping and chatting, and marriage is at best one possible outcome. A Muslim marriage platform is built around nikah from the start. On PureLifePartner, profiles focus on deen, family, education and what each person is looking for in a spouse. Real names and phone numbers stay private, photos can be limited to verified members, and contact details are only shared once both members are verified, which encourages serious, accountable introductions.",
        ],
      },
      {
        heading: "Make dua and pray istikhara",
        paragraphs: [
          "Whatever route you take, rely on Allah. Make dua for a righteous spouse, consult people you trust, and pray istikhara before making a decision. The Prophet, peace be upon him, taught that a person is married for their wealth, lineage, beauty or religion, and advised choosing the one with religion (Sahih al-Bukhari and Sahih Muslim). Let that guide what you look for, online or off.",
        ],
      },
    ],
    faqs: [
      {
        q: "Is it haram to use a Muslim marriage app?",
        a: "Using a platform to find a spouse is generally considered permissible, as long as the intention is marriage and the interaction stays within Islamic limits: modest, honest and with family involvement.",
      },
      {
        q: "Can I talk to someone before nikah?",
        a: "Yes, purposeful conversation to assess suitability for marriage is permitted, ideally with family aware or involved. Avoid flirtatious talk, secrecy and meeting alone in private.",
      },
      {
        q: "Is it okay to share photos on a Muslim marriage website?",
        a: "Many scholars allow seeing a prospective spouse for the purpose of marriage. Choose modest photos, and on PureLifePartner you can restrict them to verified members only.",
      },
    ],
    related: ["wali-role-in-online-muslim-marriage", "how-to-write-a-muslim-marriage-profile"],
  },
  {
    slug: "how-to-write-a-muslim-marriage-profile",
    title: "How to Write a Muslim Marriage Profile That Gets Responses",
    metaTitle: "How to Write a Muslim Marriage Profile | PureLifePartner",
    description:
      "Practical tips for writing a Muslim marriage profile: what to include about your deen, family and goals, how to choose photos, and mistakes to avoid.",
    category: "Using PureLifePartner",
    published: "2026-11-07",
    updated: "2026-11-07",
    readMinutes: 6,
    summary:
      "A good Muslim marriage profile is honest, specific and complete. Describe how you practise your deen, your family, your work and your plans, say clearly what you are looking for in a spouse, and add a modest, recent photo. Complete profiles get far more interest than half-finished ones.",
    sections: [
      {
        heading: "Fill in every section",
        paragraphs: [
          "The single biggest improvement most people can make is simply finishing their profile. When a family is choosing between two profiles, the one with clear information about religion, education, work and family almost always wins. Blank fields make people wonder what you are hiding, even when you are not hiding anything.",
          "On PureLifePartner, completing every registration step also makes automatic matching work better, because your requirements are used to suggest suitable members to you and you to them.",
        ],
      },
      {
        heading: "Describe your deen honestly",
        paragraphs: [
          "Be specific about how you practise. \"Practising\" means very different things to different people. It is more helpful to say, for example, that you pray five times a day, attend the masjid on Fridays, are learning Quran, or wear hijab. Honesty here saves both sides time and avoids disappointment later.",
        ],
      },
      {
        heading: "Use the family details box well",
        bullets: [
          "Who is in your family: parents, siblings and whether they are married.",
          "Where your family is from and where they live now.",
          "What your parents do, if you are comfortable sharing.",
          "How involved your family will be in the process.",
          "Your family's values and what kind of family you hope to join.",
        ],
        after: [
          "Families read this section closely. A warm, clear description of your family often does more than anything else on your profile.",
        ],
      },
      {
        heading: "Say what you are looking for, clearly",
        paragraphs: [
          "Be clear about what matters most, such as level of practice, age range, location, education or willingness to relocate. Focus on your genuine priorities rather than a long list of everything you might like. A few clear priorities attract the right people; a list of twenty demands puts everyone off.",
        ],
      },
      {
        heading: "Choosing photos",
        bullets: [
          "Use a recent, clear photo of your face with good lighting.",
          "Keep it modest and dignified, as you would want your future in-laws to see you.",
          "Avoid heavy filters, sunglasses and group photos where it is unclear which person is you.",
          "If you prefer privacy, restrict your photos to verified members only in Privacy Settings.",
        ],
      },
      {
        heading: "Mistakes to avoid",
        bullets: [
          "Copying a generic bio that could describe anyone.",
          "Leaving important fields like marital status or location empty.",
          "Being negative about past experiences or the opposite gender.",
          "Exaggerating your income, height, education or practice.",
          "Sharing your phone number, email or social media in your bio. Keep contact private until both sides are verified.",
        ],
      },
      {
        heading: "Keep it fresh",
        paragraphs: [
          "Update your profile when something changes, such as a new job, a move or a shift in what you are looking for. A recently updated profile shows you are still actively searching, and you can edit any section at any time from My Profile.",
        ],
      },
    ],
    faqs: [
      {
        q: "Should I add a photo to my Muslim marriage profile?",
        a: "Profiles with a clear, modest photo get more interest. If privacy is a concern, you can limit your photos to verified members only.",
      },
      {
        q: "How long should my profile description be?",
        a: "A few short paragraphs is enough: who you are, how you practise, your family and what you are looking for. Be specific rather than long.",
      },
      {
        q: "Can my parents write my profile for me?",
        a: "Yes, many profiles are written with a parent's help. Make sure it still sounds like you and that the information is accurate.",
      },
    ],
    related: ["questions-to-ask-before-nikah", "is-online-muslim-matchmaking-halal"],
  },
];

export function getArticle(slug: string) {
  return ARTICLES.find((a) => a.slug === slug);
}

export function formatArticleDate(iso: string) {
  return new Date(iso + "T00:00:00Z").toLocaleDateString("en-GB", {
    day: "numeric",
    month: "long",
    year: "numeric",
    timeZone: "UTC",
  });
}
