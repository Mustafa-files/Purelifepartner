/**
 * All-religion city pages (/marriage/[slug]), focused on the United States.
 * Separate from the Muslim section in lib/cities.ts. Each city has its own
 * written content so the pages are genuinely local, not a swapped template.
 *
 * City names match the suggested US cities in lib/locations.ts, so members'
 * city entries line up with these pages. House rules: say "marriage" (not
 * faith-specific terms for it), and no em dashes.
 */
export type MarriageCity = {
  slug: string;
  name: string;
  state: string;
  stateShort: string;
  /** Spellings members type into their city field (exact match) */
  aliases: string[];
  intro: string;
  faith: string;
  /** Faith communities with a strong local presence, shown as chips */
  faiths: string[];
  areas: string[];
  landmarks: string[];
  localNote: string;
  faqs: { q: string; a: string }[];
  nearby: string[];
  /** Matching page in the Muslim section, if there is one */
  muslimSlug?: string;
};

export const COUNTRY = "United States";

export const MARRIAGE_CITIES: MarriageCity[] = [
  {
    slug: "new-york",
    name: "New York",
    state: "New York",
    stateShort: "NY",
    aliases: ["New York", "New York City", "NYC", "Brooklyn", "Queens", "Bronx", "Manhattan", "Staten Island", "Jersey City"],
    intro:
      "New York has more singles than almost anywhere in America, yet many say it is the hardest place to meet someone who is serious about marriage. Long hours and endless dating apps leave little room for introductions that lead somewhere. PureLifePartner is a marriage website for New Yorkers of every faith who want a committed partner, with verified profiles and families welcome to take part.",
    faith:
      "Few cities are as religiously diverse. New York has the largest Jewish community of any city outside Israel, large Catholic, Protestant and Orthodox Christian congregations, and major Muslim, Hindu, Sikh and Buddhist communities across Queens, Brooklyn and New Jersey. Whatever your faith, you can look for someone who shares it, or someone who shares your values across faiths.",
    faiths: ["Catholic", "Protestant", "Jewish", "Muslim", "Hindu", "Sikh", "Orthodox Christian", "Buddhist"],
    areas: ["Manhattan", "Brooklyn", "Queens", "The Bronx", "Staten Island", "Long Island", "Jersey City"],
    landmarks: ["St. Patrick's Cathedral", "Temple Emanu-El", "Islamic Cultural Center of New York", "Sikh Cultural Society, Richmond Hill"],
    localNote:
      "Many New York members are open to partners across the tri-state area, including New Jersey, Long Island and Westchester.",
    faqs: [
      {
        q: "Is PureLifePartner a dating app?",
        a: "No. It is a marriage website. Profiles focus on faith, family, education and what each person wants in a spouse, and contact details stay private until both members are verified.",
      },
      {
        q: "Can I find someone from my own community in New York?",
        a: "Yes. Members list their religion, background and languages, so you can search for someone from your faith or culture anywhere in the five boroughs and beyond.",
      },
    ],
    nearby: ["philadelphia", "boston", "washington-dc"],
    muslimSlug: "new-york",
  },
  {
    slug: "los-angeles",
    name: "Los Angeles",
    state: "California",
    stateShort: "CA",
    aliases: ["Los Angeles", "LA", "Long Beach", "Pasadena", "Glendale", "Santa Monica", "Irvine", "Anaheim", "Orange County"],
    intro:
      "Los Angeles is a city of people who came from somewhere else, which can make finding a partner who shares your values and background surprisingly hard. PureLifePartner helps Angelenos of every religion find a life partner for marriage, through verified, private profiles rather than casual swiping.",
    faith:
      "Southern California is home to large Catholic and evangelical Christian communities, one of the biggest Jewish populations in the country, Armenian Orthodox families in Glendale, and major Muslim, Hindu, Sikh and Buddhist communities. Many families here balance faith traditions with life in one of the world's most diverse cities.",
    faiths: ["Catholic", "Evangelical", "Jewish", "Armenian Orthodox", "Muslim", "Hindu", "Sikh", "Buddhist"],
    areas: ["Santa Monica", "Pasadena", "Glendale", "San Fernando Valley", "Long Beach", "Irvine", "Artesia"],
    landmarks: ["Cathedral of Our Lady of the Angels", "Wilshire Boulevard Temple", "King Fahad Mosque, Culver City", "Hsi Lai Temple, Hacienda Heights"],
    localNote:
      "Many Los Angeles members are open to partners across Southern California, from Orange County to San Diego.",
    faqs: [
      {
        q: "Does the Los Angeles page include Orange County?",
        a: "Yes. Members in Orange County, Long Beach, Pasadena, Glendale and the wider LA area are all included.",
      },
      {
        q: "Can I search for a partner from a specific culture in Los Angeles?",
        a: "Yes. Members share their religion, ethnicity and languages, so you can look for someone Armenian, Latino, South Asian, Korean or from any other background.",
      },
    ],
    nearby: ["san-diego", "las-vegas", "phoenix", "san-francisco"],
    muslimSlug: "los-angeles",
  },
  {
    slug: "chicago",
    name: "Chicago",
    state: "Illinois",
    stateShort: "IL",
    aliases: ["Chicago", "Evanston", "Naperville", "Schaumburg", "Skokie", "Oak Park"],
    intro:
      "Chicago is known for strong neighbourhoods and close families, and many Chicagoans still want a partner their family will welcome. PureLifePartner helps singles across Chicagoland find a spouse for marriage, with verified profiles and room for parents to be involved.",
    faith:
      "Chicago has one of the largest Catholic communities in America, with Polish, Irish, Mexican and Filipino parishes, alongside Protestant churches, historic Black churches, a large Jewish community, Greek Orthodox families and major Muslim, Hindu and Sikh communities in the suburbs. The Bahá'í House of Worship in Wilmette is one of the region's best-known landmarks.",
    faiths: ["Catholic", "Protestant", "Jewish", "Greek Orthodox", "Muslim", "Hindu", "Sikh", "Bahá'í"],
    areas: ["Lincoln Park", "Lakeview", "Evanston", "Oak Park", "Naperville", "Schaumburg", "Skokie"],
    landmarks: ["Holy Name Cathedral", "Bahá'í House of Worship, Wilmette", "Hindu Temple of Greater Chicago, Lemont", "Mosque Foundation, Bridgeview"],
    localNote:
      "Chicago members often widen their search across the Midwest, including Milwaukee, Detroit and Minneapolis.",
    faqs: [
      {
        q: "Does the Chicago page include the suburbs?",
        a: "Yes. Members in Evanston, Naperville, Schaumburg, Skokie, Oak Park and the rest of Chicagoland are included.",
      },
      {
        q: "Can my parents help me find a partner in Chicago?",
        a: "Yes. Families are welcome to take part. Profiles include family details so both sides can understand each other's background before anyone shares contact details.",
      },
    ],
    nearby: ["detroit", "minneapolis", "denver"],
    muslimSlug: "chicago",
  },
  {
    slug: "houston",
    name: "Houston",
    state: "Texas",
    stateShort: "TX",
    aliases: ["Houston", "Sugar Land", "Katy", "The Woodlands", "Pearland", "Spring", "Bellaire"],
    intro:
      "Houston is one of the most diverse cities in the United States, and one of the fastest growing. PureLifePartner helps Houstonians of every faith and background find a life partner for marriage through verified, private profiles and family involvement.",
    faith:
      "Houston is home to some of the largest churches in America, a large Catholic community, and major Hindu, Muslim, Sikh, Buddhist and Jewish communities. The suburbs of Sugar Land and Katy in particular have large Indian, Pakistani, Nigerian, Vietnamese and Chinese American families.",
    faiths: ["Catholic", "Evangelical", "Baptist", "Hindu", "Muslim", "Sikh", "Buddhist", "Jewish"],
    areas: ["Sugar Land", "Katy", "The Woodlands", "Pearland", "Bellaire", "Memorial", "Spring"],
    landmarks: ["Lakewood Church", "BAPS Shri Swaminarayan Mandir, Stafford", "Co-Cathedral of the Sacred Heart", "Islamic Society of Greater Houston"],
    localNote:
      "Houston members are often open to partners in Dallas, Austin and San Antonio, all within driving distance.",
    faqs: [
      {
        q: "Are there already PureLifePartner members in Houston?",
        a: "Yes, and the community is growing. The profiles section on this page shows members in and around Houston as they join.",
      },
      {
        q: "Can I find an Indian or Nigerian partner in Houston?",
        a: "Yes. Houston has large Indian and Nigerian communities, and members can share their heritage, religion and languages so you can search with that in mind.",
      },
    ],
    nearby: ["dallas", "austin", "atlanta"],
    muslimSlug: "houston",
  },
  {
    slug: "dallas",
    name: "Dallas",
    state: "Texas",
    stateShort: "TX",
    aliases: ["Dallas", "Plano", "Frisco", "Irving", "Richardson", "Arlington", "Fort Worth", "McKinney"],
    intro:
      "Dallas Fort Worth has grown into one of America's largest metro areas, drawing young professionals from across the country and the world. PureLifePartner helps DFW singles of every faith find a spouse who shares their values, without the noise of dating apps.",
    faith:
      "DFW has a strong Christian identity, with large Baptist, Methodist, Catholic and non-denominational churches, alongside fast-growing Hindu, Muslim, Sikh and Jewish communities in Plano, Frisco, Irving and Richardson.",
    faiths: ["Baptist", "Methodist", "Catholic", "Non-denominational", "Hindu", "Muslim", "Sikh", "Jewish"],
    areas: ["Plano", "Frisco", "Irving", "Richardson", "Arlington", "Fort Worth", "McKinney"],
    landmarks: ["Cathedral Shrine of the Virgin of Guadalupe", "Highland Park United Methodist Church", "DFW Hindu Temple, Irving", "East Plano Islamic Center"],
    localNote:
      "Dallas members often include Houston and Austin in their search, which brings in many more Texas profiles.",
    faqs: [
      {
        q: "Does the Dallas page include Fort Worth?",
        a: "Yes. Members anywhere in the DFW metroplex appear here, from Fort Worth and Arlington to Plano and Frisco.",
      },
      {
        q: "I moved to Dallas for work. Can my family back home still be involved?",
        a: "Yes. Families can take part from anywhere, and our WhatsApp support helps everyone stay in touch across states and countries.",
      },
    ],
    nearby: ["houston", "austin", "denver"],
    muslimSlug: "dallas",
  },
  {
    slug: "phoenix",
    name: "Phoenix",
    state: "Arizona",
    stateShort: "AZ",
    aliases: ["Phoenix", "Scottsdale", "Tempe", "Mesa", "Chandler", "Gilbert", "Glendale AZ"],
    intro:
      "Phoenix is one of the fastest-growing cities in America, full of people who moved for work, family or the sunshine and are now ready to settle down. PureLifePartner helps singles across the Valley of the Sun find a partner for marriage, whatever their faith.",
    faith:
      "The Phoenix area has a large Catholic community, many evangelical and non-denominational churches, and one of the country's largest Latter-day Saint communities, centred on Mesa. It also has growing Jewish, Muslim, Hindu and Sikh communities, especially in Chandler, Tempe and Scottsdale.",
    faiths: ["Catholic", "Evangelical", "Latter-day Saint", "Jewish", "Muslim", "Hindu", "Sikh"],
    areas: ["Scottsdale", "Tempe", "Mesa", "Chandler", "Gilbert", "Peoria", "Glendale"],
    landmarks: ["St. Mary's Basilica", "Mesa Arizona Temple"],
    localNote:
      "Phoenix members are often open to partners elsewhere in the Southwest, including Las Vegas, San Diego and Los Angeles.",
    faqs: [
      {
        q: "Does the Phoenix page include Scottsdale, Tempe and Mesa?",
        a: "Yes. Members across the Valley, including Scottsdale, Tempe, Mesa, Chandler and Gilbert, are included.",
      },
      {
        q: "Can I find a partner of the same faith in Phoenix?",
        a: "Yes. Members list their religion and how they practise, so you can focus on people whose faith matches yours.",
      },
    ],
    nearby: ["las-vegas", "los-angeles", "san-diego", "denver"],
  },
  {
    slug: "philadelphia",
    name: "Philadelphia",
    state: "Pennsylvania",
    stateShort: "PA",
    aliases: ["Philadelphia", "Philly", "King of Prussia", "Cherry Hill", "Camden"],
    intro:
      "Philadelphia combines big-city life with a strong sense of family and neighbourhood. PureLifePartner helps Philadelphians of every faith find a spouse who shares their values, with verified profiles and families welcome to take part.",
    faith:
      "Philadelphia has a large Catholic community, historic Protestant and Quaker roots, one of the oldest Black church traditions in America, and long-established Jewish neighbourhoods. It is also home to one of the largest Muslim communities in the Northeast, along with growing Hindu and Sikh communities in the suburbs.",
    faiths: ["Catholic", "Protestant", "AME and Black church", "Jewish", "Muslim", "Quaker", "Hindu"],
    areas: ["Center City", "Main Line", "Northeast Philadelphia", "King of Prussia", "Cherry Hill, NJ", "Delaware County"],
    landmarks: ["Cathedral Basilica of Saints Peter and Paul", "Mother Bethel AME Church", "Congregation Mikveh Israel"],
    localNote:
      "Philadelphia members often include New York, New Jersey and Washington DC in their search.",
    faqs: [
      {
        q: "Does the Philadelphia page include South Jersey?",
        a: "Yes. Members in Cherry Hill, Camden and nearby South Jersey towns are included alongside the city and its Pennsylvania suburbs.",
      },
      {
        q: "Is PureLifePartner only for one religion?",
        a: "No. PureLifePartner is open to people of every religion. You can search for someone of your own faith or be open to others.",
      },
    ],
    nearby: ["new-york", "washington-dc", "boston"],
  },
  {
    slug: "san-diego",
    name: "San Diego",
    state: "California",
    stateShort: "CA",
    aliases: ["San Diego", "La Jolla", "Chula Vista", "Carlsbad", "Escondido", "El Cajon", "Oceanside"],
    intro:
      "San Diego is a relaxed, family-friendly city with a large military community and many young professionals. PureLifePartner helps San Diegans of every faith find a partner who wants marriage, not just another date.",
    faith:
      "San Diego has a large Catholic community with deep Mexican roots, many evangelical churches, a large Jewish community in La Jolla and University City, and one of the largest Chaldean Catholic communities in America, centred on El Cajon. It also has growing Muslim, Hindu and Buddhist communities.",
    faiths: ["Catholic", "Chaldean Catholic", "Evangelical", "Jewish", "Muslim", "Hindu", "Buddhist"],
    areas: ["La Jolla", "Chula Vista", "Carlsbad", "Escondido", "El Cajon", "Mira Mesa", "Oceanside"],
    landmarks: ["Mission Basilica San Diego de Alcalá"],
    localNote:
      "San Diego members are often open to partners in Los Angeles, Orange County and Phoenix.",
    faqs: [
      {
        q: "I am in the military in San Diego. Can I use PureLifePartner?",
        a: "Yes. Service members can join for free, and you can say on your profile whether you expect to move with your posting.",
      },
      {
        q: "Are there Chaldean families on PureLifePartner?",
        a: "San Diego has a large Chaldean community, and members can share their heritage and faith on their profile so others from the same background can find them.",
      },
    ],
    nearby: ["los-angeles", "phoenix", "las-vegas"],
  },
  {
    slug: "san-francisco",
    name: "San Francisco",
    state: "California",
    stateShort: "CA",
    aliases: ["San Francisco", "SF", "San Jose", "Fremont", "Oakland", "Palo Alto", "Sunnyvale", "Santa Clara", "Bay Area"],
    intro:
      "The San Francisco Bay Area is full of ambitious professionals who often put work first for years, then find it hard to meet a serious partner. PureLifePartner helps Bay Area singles of every faith find a spouse for marriage, with verified profiles and family involvement.",
    faith:
      "The Bay Area has Catholic and Protestant churches, a long-established Jewish community, and very large Hindu, Sikh and Muslim communities in the South Bay and Fremont, which is also home to one of the largest Afghan communities in America. Buddhist temples serve Chinese, Vietnamese and Japanese American families across the region.",
    faiths: ["Catholic", "Protestant", "Jewish", "Hindu", "Sikh", "Muslim", "Buddhist"],
    areas: ["San Francisco", "San Jose", "Fremont", "Oakland", "Palo Alto", "Sunnyvale", "Santa Clara"],
    landmarks: ["Grace Cathedral", "Congregation Emanu-El", "Gurdwara Sahib of San Jose"],
    localNote:
      "This page covers the whole Bay Area, and many members are also open to partners in Los Angeles and Seattle.",
    faqs: [
      {
        q: "Does the San Francisco page include San Jose and Fremont?",
        a: "Yes. Members across the Bay Area, including San Jose, Fremont, Oakland and Silicon Valley, are included.",
      },
      {
        q: "I work long hours in tech. How much time does PureLifePartner take?",
        a: "Very little. Create your profile once, and automatic matching suggests members based on your requirements, so you can review a few strong matches instead of endless swiping.",
      },
    ],
    nearby: ["los-angeles", "seattle", "san-diego"],
  },
  {
    slug: "austin",
    name: "Austin",
    state: "Texas",
    stateShort: "TX",
    aliases: ["Austin", "Round Rock", "Cedar Park", "Pflugerville", "Georgetown"],
    intro:
      "Austin has attracted young professionals from all over the world, and many arrive without the family networks that once made introductions easy. PureLifePartner helps Austin singles of every faith find a life partner for marriage.",
    faith:
      "Austin has a large Catholic community, many Baptist and non-denominational churches, and fast-growing Hindu, Muslim, Sikh and Jewish communities, many of them families who moved for the city's tech industry.",
    faiths: ["Catholic", "Baptist", "Non-denominational", "Hindu", "Muslim", "Sikh", "Jewish"],
    areas: ["Round Rock", "Cedar Park", "Pflugerville", "Georgetown", "South Austin", "Downtown"],
    landmarks: ["St. Mary Cathedral", "Radha Madhav Dham"],
    localNote:
      "Austin members often include San Antonio, Houston and Dallas in their search.",
    faqs: [
      {
        q: "I recently moved to Austin. Can I still find someone from my background?",
        a: "Yes. Members share their religion, culture and languages, and you can widen your search across Texas to include Houston and Dallas.",
      },
      {
        q: "Does the Austin page include Round Rock?",
        a: "Yes. Members in Round Rock, Cedar Park, Pflugerville and Georgetown are included.",
      },
    ],
    nearby: ["houston", "dallas", "phoenix"],
  },
  {
    slug: "atlanta",
    name: "Atlanta",
    state: "Georgia",
    stateShort: "GA",
    aliases: ["Atlanta", "Alpharetta", "Marietta", "Decatur", "Duluth", "Sandy Springs", "Lilburn"],
    intro:
      "Atlanta is the heart of the South and one of America's fastest-growing cities, with a strong church culture and a growing international community. PureLifePartner helps Atlanta singles of every faith find a spouse who shares their values.",
    faith:
      "Atlanta is known for its historic Black churches and large Baptist, Methodist and non-denominational congregations, alongside a large Catholic community. Its suburbs also have major Hindu, Muslim, Jewish and Korean Christian communities, especially in Gwinnett County.",
    faiths: ["Baptist", "Methodist", "Non-denominational", "Catholic", "Korean Christian", "Hindu", "Muslim", "Jewish"],
    areas: ["Buckhead", "Decatur", "Alpharetta", "Marietta", "Duluth", "Sandy Springs", "Lilburn"],
    landmarks: ["Ebenezer Baptist Church", "BAPS Shri Swaminarayan Mandir, Lilburn", "Al-Farooq Masjid"],
    localNote:
      "Atlanta members are often open to partners across the Southeast, including Charlotte and Orlando.",
    faqs: [
      {
        q: "Can I find a partner from my church community in Atlanta?",
        a: "Yes. Members list their religion and denomination, so you can look for someone who shares your faith and church background.",
      },
      {
        q: "Does the Atlanta page include Gwinnett County?",
        a: "Yes. Members in Duluth, Lilburn and the rest of Gwinnett are included, along with Alpharetta, Marietta and Decatur.",
      },
    ],
    nearby: ["charlotte", "orlando", "miami"],
  },
  {
    slug: "washington-dc",
    name: "Washington DC",
    state: "District of Columbia",
    stateShort: "DC",
    aliases: ["Washington DC", "Washington D.C.", "DC", "Arlington", "Alexandria", "Fairfax", "Bethesda", "Silver Spring"],
    intro:
      "Washington DC draws ambitious people from every state and country, many of them busy professionals who want a serious relationship but struggle to find the time. PureLifePartner helps singles across the DMV find a partner for marriage, with verified profiles and families welcome.",
    faith:
      "The DC area is home to two of America's best-known houses of worship, Washington National Cathedral and the Basilica of the National Shrine of the Immaculate Conception. It also has large Jewish, Muslim, Hindu, Sikh, Ethiopian Orthodox and Korean Christian communities across Maryland and Northern Virginia.",
    faiths: ["Catholic", "Episcopal", "Baptist", "Ethiopian Orthodox", "Jewish", "Muslim", "Hindu", "Sikh"],
    areas: ["Arlington", "Alexandria", "Fairfax", "Bethesda", "Silver Spring", "Loudoun County"],
    landmarks: ["Washington National Cathedral", "Basilica of the National Shrine of the Immaculate Conception", "Islamic Center of Washington"],
    localNote:
      "This page covers DC, Northern Virginia and Maryland, and many members also consider partners in Philadelphia and New York.",
    faqs: [
      {
        q: "Does the Washington DC page include Northern Virginia and Maryland?",
        a: "Yes. Members in Arlington, Alexandria, Fairfax, Bethesda, Silver Spring and the wider DMV are included.",
      },
      {
        q: "Is my profile private if I work in a public role?",
        a: "Yes. Your real name and phone numbers are never shown publicly, and you can limit your photos to verified members only.",
      },
    ],
    nearby: ["philadelphia", "new-york", "charlotte"],
  },
  {
    slug: "boston",
    name: "Boston",
    state: "Massachusetts",
    stateShort: "MA",
    aliases: ["Boston", "Cambridge", "Brookline", "Newton", "Quincy", "Somerville", "Waltham"],
    intro:
      "Boston is full of students, doctors, researchers and young professionals, many of whom arrived for study and stayed. PureLifePartner helps Bostonians of every faith find a partner for marriage once they are ready to settle down.",
    faith:
      "Boston has deep Catholic and Protestant roots, a large Jewish community in Brookline and Newton, Greek and Armenian Orthodox families, and growing Muslim, Hindu and Buddhist communities, many connected to the region's universities and hospitals.",
    faiths: ["Catholic", "Protestant", "Jewish", "Greek Orthodox", "Armenian Orthodox", "Muslim", "Hindu"],
    areas: ["Cambridge", "Brookline", "Newton", "Quincy", "Somerville", "Waltham"],
    landmarks: ["Cathedral of the Holy Cross", "Trinity Church, Copley Square", "Islamic Society of Boston Cultural Center"],
    localNote:
      "Boston members are often open to partners in New York and across New England.",
    faqs: [
      {
        q: "I came to Boston to study. Can I find a spouse here?",
        a: "Yes. Many members came to Boston for university or work, and you can say on your profile whether you plan to stay in Boston or move.",
      },
      {
        q: "Does the Boston page include Cambridge?",
        a: "Yes. Members in Cambridge, Brookline, Newton, Somerville and the wider Boston area are included.",
      },
    ],
    nearby: ["new-york", "philadelphia"],
  },
  {
    slug: "seattle",
    name: "Seattle",
    state: "Washington",
    stateShort: "WA",
    aliases: ["Seattle", "Bellevue", "Redmond", "Kirkland", "Renton", "Tacoma", "Bothell"],
    intro:
      "Seattle's tech boom has brought professionals from all over the world, many far from the families who would once have helped them find a spouse. PureLifePartner helps Seattle singles of every faith find a partner for marriage, with families welcome to take part.",
    faith:
      "Seattle has Catholic, Lutheran and evangelical churches, a long-established Jewish community, and large Hindu, Sikh and Muslim communities on the Eastside in Bellevue, Redmond and Bothell. Buddhist temples serve the city's Chinese, Vietnamese, Japanese and Korean American families.",
    faiths: ["Catholic", "Lutheran", "Evangelical", "Jewish", "Hindu", "Sikh", "Muslim", "Buddhist"],
    areas: ["Bellevue", "Redmond", "Kirkland", "Bothell", "Renton", "Tacoma"],
    landmarks: ["St. James Cathedral", "Hindu Temple and Cultural Center, Bothell"],
    localNote:
      "Seattle members are often open to partners in the Bay Area, Portland and Vancouver.",
    faqs: [
      {
        q: "Does the Seattle page include Bellevue and Redmond?",
        a: "Yes. Members on the Eastside, including Bellevue, Redmond, Kirkland and Bothell, are included.",
      },
      {
        q: "I am on a work visa in Seattle. Can I join?",
        a: "Yes. Anyone looking for marriage can join, and you can share where you plan to live long term on your profile.",
      },
    ],
    nearby: ["san-francisco", "denver", "minneapolis"],
  },
  {
    slug: "miami",
    name: "Miami",
    state: "Florida",
    stateShort: "FL",
    aliases: ["Miami", "Miami Beach", "Coral Gables", "Doral", "Hialeah", "Kendall", "Fort Lauderdale", "Aventura"],
    intro:
      "Miami is one of America's great international cities, where family and faith still matter to many singles. PureLifePartner helps people across South Florida find a partner for marriage, whatever their religion or background.",
    faith:
      "Miami has a large Catholic community with Cuban, Venezuelan, Colombian and Puerto Rican roots, Haitian Catholic and Protestant churches, many evangelical congregations, and large Jewish communities in Miami Beach and Aventura. It also has growing Muslim and Hindu communities across Broward and Miami-Dade.",
    faiths: ["Catholic", "Evangelical", "Jewish", "Haitian Christian", "Protestant", "Muslim", "Hindu"],
    areas: ["Miami Beach", "Coral Gables", "Doral", "Kendall", "Hialeah", "Aventura", "Fort Lauderdale"],
    landmarks: ["Shrine of Our Lady of Charity (La Ermita de la Caridad)", "Large Jewish communities in Miami Beach and Aventura"],
    localNote:
      "Miami members are often open to partners in Orlando, Atlanta and across Latin America and the Caribbean.",
    faqs: [
      {
        q: "Can I find a Spanish-speaking partner in Miami?",
        a: "Yes. Many Miami members speak Spanish, and you can list the languages you speak and want in a spouse on your profile.",
      },
      {
        q: "Does the Miami page include Fort Lauderdale?",
        a: "Yes. Members across South Florida, including Fort Lauderdale and Broward County, are included.",
      },
    ],
    nearby: ["orlando", "atlanta", "charlotte"],
  },
  {
    slug: "denver",
    name: "Denver",
    state: "Colorado",
    stateShort: "CO",
    aliases: ["Denver", "Aurora", "Lakewood", "Boulder", "Littleton", "Highlands Ranch"],
    intro:
      "Denver attracts active, outdoorsy professionals from across the country, and many are ready to trade dating apps for something more serious. PureLifePartner helps Denver singles of every faith find a partner for marriage.",
    faith:
      "Denver has a large Catholic community, many evangelical and non-denominational churches, a long-established Jewish community, and growing Muslim, Hindu, Buddhist and Ethiopian Orthodox communities, especially in Aurora.",
    faiths: ["Catholic", "Evangelical", "Non-denominational", "Jewish", "Ethiopian Orthodox", "Muslim", "Hindu", "Buddhist"],
    areas: ["Aurora", "Lakewood", "Boulder", "Littleton", "Highlands Ranch", "Downtown Denver"],
    landmarks: ["Cathedral Basilica of the Immaculate Conception"],
    localNote:
      "Denver members are often open to partners in Phoenix, Dallas and across the Mountain West.",
    faqs: [
      {
        q: "Does the Denver page include Boulder and Aurora?",
        a: "Yes. Members across the Denver metro area, including Boulder, Aurora, Lakewood and Littleton, are included.",
      },
      {
        q: "Can I find someone who shares my faith in Denver?",
        a: "Yes. Members list their religion and how they practise, so you can focus on people whose faith matches yours.",
      },
    ],
    nearby: ["phoenix", "dallas", "seattle"],
  },
  {
    slug: "detroit",
    name: "Detroit",
    state: "Michigan",
    stateShort: "MI",
    aliases: ["Detroit", "Dearborn", "Troy", "Sterling Heights", "Southfield", "Ann Arbor", "Novi", "Hamtramck"],
    intro:
      "Metro Detroit is a place of strong families and close communities, where introductions through relatives still matter. PureLifePartner helps singles across Southeast Michigan find a partner for marriage, with families welcome at every step.",
    faith:
      "Metro Detroit has historic Black churches, a large Catholic community, and the largest Arab American community in the country, centred on Dearborn. It is also home to a large Chaldean Catholic community in Sterling Heights and West Bloomfield, a long-established Jewish community, and growing Hindu and Bangladeshi Muslim communities.",
    faiths: ["Catholic", "Chaldean Catholic", "Baptist", "Muslim", "Jewish", "Hindu", "Orthodox Christian"],
    areas: ["Dearborn", "Troy", "Sterling Heights", "Southfield", "Ann Arbor", "Novi", "Hamtramck"],
    landmarks: ["Cathedral of the Most Blessed Sacrament", "Islamic Center of America, Dearborn"],
    localNote:
      "Detroit members are often open to partners in Chicago and across the Midwest.",
    faqs: [
      {
        q: "Are there Arab American and Chaldean families on PureLifePartner?",
        a: "Metro Detroit has the largest Arab American community in the country and a large Chaldean community. Members can share their heritage and faith so families from the same background can find them.",
      },
      {
        q: "Does the Detroit page include Dearborn and Ann Arbor?",
        a: "Yes. Members across Metro Detroit, including Dearborn, Troy, Sterling Heights and Ann Arbor, are included.",
      },
    ],
    nearby: ["chicago", "minneapolis"],
  },
  {
    slug: "minneapolis",
    name: "Minneapolis",
    state: "Minnesota",
    stateShort: "MN",
    aliases: ["Minneapolis", "St. Paul", "Saint Paul", "Bloomington", "Edina", "Eden Prairie", "Maple Grove"],
    intro:
      "The Twin Cities combine Midwestern family values with a surprisingly international population. PureLifePartner helps singles across Minneapolis and St. Paul find a partner for marriage, whatever their faith.",
    faith:
      "Minnesota has deep Lutheran and Catholic roots, alongside the largest Somali community in America, a large Hmong community in St. Paul, a long-established Jewish community, and growing Hindu and Ethiopian Orthodox communities.",
    faiths: ["Lutheran", "Catholic", "Muslim", "Hmong", "Jewish", "Hindu", "Ethiopian Orthodox"],
    areas: ["St. Paul", "Bloomington", "Edina", "Eden Prairie", "Maple Grove", "Cedar-Riverside"],
    landmarks: ["Basilica of St. Mary", "Cathedral of Saint Paul"],
    localNote:
      "Twin Cities members are often open to partners in Chicago, Detroit and across the Midwest.",
    faqs: [
      {
        q: "Does the Minneapolis page include St. Paul?",
        a: "Yes. Members across the Twin Cities, including St. Paul, Bloomington and Edina, are included.",
      },
      {
        q: "Are there Somali and Hmong families on PureLifePartner?",
        a: "Minneapolis and St. Paul have large Somali and Hmong communities, and members can share their heritage so others from the same background can find them.",
      },
    ],
    nearby: ["chicago", "detroit", "denver"],
  },
  {
    slug: "orlando",
    name: "Orlando",
    state: "Florida",
    stateShort: "FL",
    aliases: ["Orlando", "Kissimmee", "Winter Park", "Lake Mary", "Sanford"],
    intro:
      "Orlando is a fast-growing city where many young families and professionals have recently arrived. PureLifePartner helps Orlando singles of every faith find a partner for marriage, with verified profiles and family involvement.",
    faith:
      "Orlando has large Catholic communities with Puerto Rican and Latin American roots, many evangelical and Baptist churches, and growing Hindu, Muslim, Jewish and Haitian Christian communities across Central Florida.",
    faiths: ["Catholic", "Evangelical", "Baptist", "Haitian Christian", "Hindu", "Muslim", "Jewish"],
    areas: ["Kissimmee", "Winter Park", "Lake Mary", "Sanford", "Dr. Phillips", "Lake Nona"],
    landmarks: ["Basilica of the National Shrine of Mary, Queen of the Universe"],
    localNote:
      "Orlando members are often open to partners in Tampa, Miami and Atlanta.",
    faqs: [
      {
        q: "Can I find a Puerto Rican or Latino partner in Orlando?",
        a: "Yes. Orlando has a large Puerto Rican and Latino community, and members can share their heritage and languages on their profile.",
      },
      {
        q: "Does the Orlando page include Kissimmee?",
        a: "Yes. Members across Central Florida, including Kissimmee, Winter Park and Lake Mary, are included.",
      },
    ],
    nearby: ["miami", "atlanta", "charlotte"],
  },
  {
    slug: "charlotte",
    name: "Charlotte",
    state: "North Carolina",
    stateShort: "NC",
    aliases: ["Charlotte", "Matthews", "Huntersville", "Concord", "Gastonia"],
    intro:
      "Charlotte has grown into a major banking and business centre, bringing in young professionals from across America and abroad. PureLifePartner helps Charlotte singles of every faith find a spouse who shares their values.",
    faith:
      "Charlotte has a strong church culture, with large Baptist, Presbyterian, Methodist and non-denominational congregations, a growing Catholic community, and expanding Hindu, Muslim and Jewish communities across the metro area.",
    faiths: ["Baptist", "Presbyterian", "Methodist", "Non-denominational", "Catholic", "Hindu", "Muslim", "Jewish"],
    areas: ["Ballantyne", "SouthPark", "Matthews", "Huntersville", "Concord", "University City"],
    landmarks: ["Many historic Presbyterian and Baptist churches across the city"],
    localNote:
      "Charlotte members are often open to partners in Atlanta, Raleigh and Washington DC.",
    faqs: [
      {
        q: "Can I find a Christian partner in Charlotte?",
        a: "Yes. Charlotte has a large Christian community, and members list their denomination, so you can search for someone who shares your church background.",
      },
      {
        q: "Is PureLifePartner free to join in Charlotte?",
        a: "Yes. Creating a profile and browsing members is free. Verification is a one-off paid step that unlocks contact details.",
      },
    ],
    nearby: ["atlanta", "washington-dc", "orlando"],
  },
  {
    slug: "las-vegas",
    name: "Las Vegas",
    state: "Nevada",
    stateShort: "NV",
    aliases: ["Las Vegas", "Henderson", "North Las Vegas", "Summerlin"],
    intro:
      "Las Vegas is better known for quick weddings than lasting ones, but most people who live here want the same thing as everyone else: a committed partner and a stable family. PureLifePartner helps Las Vegas singles of every faith find exactly that.",
    faith:
      "Las Vegas has a large Catholic community, many evangelical churches, a large Latter-day Saint community, and growing Filipino Christian, Jewish, Muslim, Hindu and Buddhist communities.",
    faiths: ["Catholic", "Evangelical", "Latter-day Saint", "Filipino Christian", "Jewish", "Muslim", "Buddhist"],
    areas: ["Henderson", "Summerlin", "North Las Vegas", "Spring Valley", "Enterprise"],
    landmarks: ["Guardian Angel Cathedral"],
    localNote:
      "Las Vegas members are often open to partners in Phoenix, Los Angeles and San Diego.",
    faqs: [
      {
        q: "Does the Las Vegas page include Henderson?",
        a: "Yes. Members in Henderson, Summerlin, North Las Vegas and across the valley are included.",
      },
      {
        q: "How is PureLifePartner different from dating in Las Vegas?",
        a: "Every member is here for marriage. Profiles focus on faith, family and goals, and contact details are only shared once both members are verified.",
      },
    ],
    nearby: ["phoenix", "los-angeles", "san-diego"],
  },
];

export function getMarriageCity(slug: string) {
  return MARRIAGE_CITIES.find((c) => c.slug === slug);
}

export function marriageCityTitle(c: MarriageCity) {
  // "Washington DC" already ends with its state code
  const place = c.name.endsWith(c.stateShort) ? c.name : `${c.name}, ${c.stateShort}`;
  return `Marriage & Matrimony in ${place} | PureLifePartner`;
}
