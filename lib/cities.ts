/**
 * City landing pages (/muslim-marriage/[slug]). Every city carries its own
 * written content so the pages are genuinely local, not one template with
 * the name swapped (Google treats that as doorway pages).
 *
 * `country` must match a value in COUNTRIES_BY_REGION (lib/constants.ts) so
 * the "browse" link can pre-filter search. `aliases` are the spellings
 * members type into their city field, used to find local profiles.
 */
export type City = {
  slug: string;
  name: string;
  country: string;
  /** Short country label for titles, e.g. "UK", "USA" */
  countryShort: string;
  aliases: string[];
  /** Extra keyword used in the title where people search it, e.g. "Rishta" */
  keyword?: string;
  intro: string;
  community: string;
  areas: string[];
  landmarks: string[];
  localNote: string;
  faqs: { q: string; a: string }[];
  nearby: string[];
};

export const CITIES: City[] = [
  // United Kingdom
  {
    slug: "london",
    name: "London",
    country: "United Kingdom",
    countryShort: "UK",
    aliases: ["London", "East London", "North London", "South London", "West London", "Southeast London", "Ilford", "Wembley", "Southall"],
    intro:
      "London is home to the largest Muslim population of any city in Western Europe, yet many single Muslims here say it is hard to meet someone serious about nikah. Busy careers, long commutes and a city of millions make introductions through family harder than they used to be. PureLifePartner gives London Muslims a private, halal way to find a spouse with their family involved from the start.",
    community:
      "London's Muslims come from almost every background: Bangladeshi families in Tower Hamlets, Pakistani and Indian communities in Redbridge, Newham and Southall, Somali, Arab, Turkish and North African families across the city, and a growing number of reverts. Whatever your heritage, you can search for someone who shares it, or simply shares your deen.",
    areas: ["Tower Hamlets", "Newham", "Redbridge and Ilford", "Waltham Forest", "Brent and Wembley", "Ealing and Southall", "Hounslow"],
    landmarks: ["East London Mosque", "London Central Mosque, Regent's Park", "North London Central Mosque, Finsbury Park"],
    localNote:
      "Many London members are open to matches elsewhere in the UK or abroad, so you can widen your search beyond the M25 with one filter.",
    faqs: [
      {
        q: "Can I search only for Muslims in a specific part of London?",
        a: "Yes. Members list their city and area, so you can look for someone in East, North, South or West London, or include nearby towns if you are open to a short move.",
      },
      {
        q: "Is it common for London Muslims to marry someone from abroad?",
        a: "Very common. Many London members are happy to marry someone from Pakistan, the Middle East, Europe or North America, and you can filter by country to see those profiles.",
      },
    ],
    nearby: ["birmingham", "leicester", "manchester", "paris", "amsterdam"],
  },
  {
    slug: "birmingham",
    name: "Birmingham",
    country: "United Kingdom",
    countryShort: "UK",
    aliases: ["Birmingham", "West Midlands", "Small Heath", "Sparkbrook", "Alum Rock"],
    intro:
      "Birmingham has one of the largest Muslim communities in Britain, and more than one in five people in the city is Muslim. Families here often still prefer introductions through relatives, and PureLifePartner keeps that spirit: verified profiles, privacy by default and space for parents and a wali to take part.",
    community:
      "Birmingham's Muslim community is rooted in Pakistani and Kashmiri families, many with ties to Mirpur, alongside Bangladeshi, Yemeni, Somali, Arab and Indian Muslims. Areas like Sparkbrook, Small Heath and Alum Rock are full of mosques, halal businesses and close family networks.",
    areas: ["Sparkbrook", "Small Heath", "Alum Rock", "Bordesley Green", "Moseley", "Handsworth", "Washwood Heath"],
    landmarks: ["Birmingham Central Mosque", "Green Lane Masjid, Small Heath"],
    localNote:
      "Birmingham members often search across the West Midlands, including Walsall, Wolverhampton and Coventry, so you see more people who are still close to home.",
    faqs: [
      {
        q: "Are there many Kashmiri and Mirpuri families on PureLifePartner in Birmingham?",
        a: "Birmingham has one of the UK's largest Kashmiri communities, and many members list their family's roots. You can mention your own background in your profile so like-minded families can find you.",
      },
      {
        q: "Can my parents help search for a match in Birmingham?",
        a: "Yes. Parents and a wali can be involved, and profiles show family details so both sides can decide together before anyone shares contact details.",
      },
    ],
    nearby: ["london", "leicester", "manchester", "bradford"],
  },
  {
    slug: "manchester",
    name: "Manchester",
    country: "United Kingdom",
    countryShort: "UK",
    aliases: ["Manchester", "Greater Manchester", "Oldham", "Bolton", "Rochdale", "Longsight", "Cheetham Hill"],
    intro:
      "Greater Manchester has a large and young Muslim population spread across the city and towns like Oldham, Bolton and Rochdale. If you are looking for a practising spouse in the North West, PureLifePartner helps you meet people who are serious about nikah, without the swiping culture of dating apps.",
    community:
      "Manchester's Muslims include long-established Pakistani and Bangladeshi families, a large Arab and Libyan community in South Manchester, Somali families and many international students who settled after university. The result is a mix of cultures with a shared focus on family and faith.",
    areas: ["Longsight", "Cheetham Hill", "Rusholme", "Levenshulme", "Didsbury", "Oldham", "Bolton", "Rochdale"],
    landmarks: ["Manchester Central Mosque, Victoria Park", "Didsbury Mosque"],
    localNote:
      "Because Manchester is close to Lancashire and West Yorkshire, many members happily consider matches in Blackburn, Bradford and Leeds too.",
    faqs: [
      {
        q: "Does the Manchester page include Oldham, Bolton and Rochdale?",
        a: "Yes. Members from across Greater Manchester appear here, and you can narrow your search to a single town if you prefer.",
      },
      {
        q: "I studied in Manchester and stayed. Can I find someone from a different background?",
        a: "Absolutely. Many Manchester members are open to marrying across cultures as long as they share the same values, and you can say so on your profile.",
      },
    ],
    nearby: ["bradford", "birmingham", "leicester", "london"],
  },
  {
    slug: "bradford",
    name: "Bradford",
    country: "United Kingdom",
    countryShort: "UK",
    aliases: ["Bradford", "Keighley", "Dewsbury", "Huddersfield", "Leeds", "West Yorkshire"],
    intro:
      "Bradford has one of the highest proportions of Muslim residents of any city in Britain, and a strong tradition of family-arranged marriage. PureLifePartner works with that tradition rather than against it, giving families and singles in West Yorkshire a respectful way to search for a rishta together.",
    community:
      "Most of Bradford's Muslims have Pakistani or Kashmiri heritage, many with family roots in Mirpur, alongside Bangladeshi, Indian Gujarati and newer Arab and African communities. Close-knit neighbourhoods like Manningham and Girlington mean family reputation and background matter, and our profiles make room for both.",
    areas: ["Manningham", "Girlington", "Heaton", "Little Horton", "Thornbury", "Keighley", "Dewsbury"],
    landmarks: ["Suffa-tul-Islam Grand Mosque, Horton Park", "Many local masjids across Manningham and Girlington"],
    localNote:
      "Bradford members often search across West Yorkshire, including Leeds, Dewsbury, Huddersfield and Keighley, all within a short drive.",
    faqs: [
      {
        q: "Can I find a rishta in Bradford through my family on PureLifePartner?",
        a: "Yes. Many profiles in Bradford are managed with parents involved, and families can review a profile together before contact details are shared.",
      },
      {
        q: "Will people in my community see my profile?",
        a: "Your real name and phone numbers are never shown publicly, and you can restrict your photos to verified members only, which matters in a close-knit city.",
      },
    ],
    nearby: ["manchester", "leicester", "birmingham", "london"],
  },
  {
    slug: "leicester",
    name: "Leicester",
    country: "United Kingdom",
    countryShort: "UK",
    aliases: ["Leicester", "Leicestershire", "Highfields", "Evington"],
    intro:
      "Leicester is one of the most diverse cities in Britain, with a large Muslim community that has grown over decades. Singles here often want a spouse with a similar family background and a shared commitment to deen, and PureLifePartner helps you find exactly that with verified, private profiles.",
    community:
      "Many of Leicester's Muslims are Gujarati Indian families, including those who came from Uganda, Kenya and Malawi, alongside Pakistani, Bangladeshi, Somali and Arab communities. Highfields, Evington and Spinney Hills are known for their mosques, madrasahs and strong community life.",
    areas: ["Highfields", "Evington", "Spinney Hills", "Belgrave", "Stoneygate", "Humberstone"],
    landmarks: ["Masjid Umar, Evington", "Dozens of local masjids and Islamic centres across the city"],
    localNote:
      "Leicester sits between London, Birmingham and Nottingham, so many members are open to matches anywhere in the Midlands.",
    faqs: [
      {
        q: "Are there Gujarati Muslim families on PureLifePartner in Leicester?",
        a: "Leicester has one of the UK's largest Gujarati Muslim communities. You can mention your heritage, language and family background on your profile so the right families find you.",
      },
      {
        q: "Can I look for someone in Leicester who also wants to stay local?",
        a: "Yes. Search by city, then read each profile's requirements to see whether they would rather stay in Leicester or are open to moving.",
      },
    ],
    nearby: ["birmingham", "london", "manchester", "bradford"],
  },

  // United States
  {
    slug: "new-york",
    name: "New York",
    country: "United States",
    countryShort: "USA",
    aliases: ["New York", "New York City", "NYC", "Brooklyn", "Queens", "Bronx", "Manhattan", "Staten Island", "Jersey City", "Paterson"],
    intro:
      "New York has the largest Muslim population of any US city, but meeting someone marriage-minded in a city this busy is not easy. PureLifePartner gives Muslims across the five boroughs and New Jersey a halal alternative to dating apps, built around nikah, family and privacy.",
    community:
      "New York's Muslims are remarkably diverse: Arab Americans in Bay Ridge and Astoria, Pakistani families on Coney Island Avenue, Bangladeshi communities in Jackson Heights and the Bronx, West African, Bosnian and Albanian Muslims, and generations of African American Muslims. You can search for someone from your heritage or simply someone with your values.",
    areas: ["Bay Ridge, Brooklyn", "Coney Island Avenue, Brooklyn", "Astoria, Queens", "Jackson Heights, Queens", "Parkchester, Bronx", "Jersey City and Paterson, NJ"],
    landmarks: ["Islamic Cultural Center of New York, Manhattan"],
    localNote:
      "Many New York members are open to matches across the Northeast, from New Jersey to Philadelphia and Boston, and some to Canada too.",
    faqs: [
      {
        q: "Does the New York page include New Jersey?",
        a: "Yes. Members in nearby New Jersey cities such as Jersey City and Paterson are included, since many families live on both sides of the Hudson.",
      },
      {
        q: "Is PureLifePartner different from Muslim dating apps in New York?",
        a: "Yes. PureLifePartner is a marriage platform, not a dating app. Profiles focus on deen, family and requirements, contact details stay private until both members are verified, and families can be involved.",
      },
    ],
    nearby: ["chicago", "toronto", "montreal", "houston"],
  },
  {
    slug: "chicago",
    name: "Chicago",
    country: "United States",
    countryShort: "USA",
    aliases: ["Chicago", "Bridgeview", "Lombard", "Villa Park", "Naperville", "Skokie", "Schaumburg"],
    intro:
      "Chicago and its suburbs have one of the most established Muslim communities in America, with strong mosques, schools and family networks. PureLifePartner helps Chicagoland Muslims find a spouse who is serious about marriage, with verified profiles and families involved.",
    community:
      "Chicago's Muslims include a large Palestinian and Arab community in the southwest suburbs, Indian and Pakistani families around Devon Avenue, Bosnian Muslims on the North Side and a long-rooted African American Muslim community. Suburbs like Lombard, Villa Park and Naperville have grown into major Muslim hubs.",
    areas: ["Bridgeview", "Devon Avenue, West Ridge", "Lombard and Villa Park", "Naperville", "Skokie", "Schaumburg"],
    landmarks: ["Mosque Foundation, Bridgeview"],
    localNote:
      "Chicago members often search across the Midwest, including Milwaukee, Detroit and Indianapolis, which opens up many more profiles.",
    faqs: [
      {
        q: "Does the Chicago page include the suburbs?",
        a: "Yes. Members in Bridgeview, Lombard, Naperville, Skokie and the rest of Chicagoland are included alongside the city itself.",
      },
      {
        q: "Can I find an Arab or South Asian spouse in Chicago?",
        a: "Yes. Chicago has large Arab and South Asian communities, and members can share their heritage on their profile so you can search with that in mind.",
      },
    ],
    nearby: ["new-york", "toronto", "dallas", "houston"],
  },
  {
    slug: "houston",
    name: "Houston",
    country: "United States",
    countryShort: "USA",
    aliases: ["Houston", "Sugar Land", "Katy", "Richmond", "Pearland", "Spring"],
    intro:
      "Houston has one of the largest and fastest-growing Muslim communities in the United States, with dozens of masjids across the metro area. PureLifePartner helps Houston Muslims find a spouse for nikah through verified profiles, privacy by default and room for family involvement.",
    community:
      "Houston's Muslims include large Pakistani and Indian communities, Arab families, a significant Nigerian and Somali presence and many reverts. Suburbs like Sugar Land, Katy and Richmond have become home to young families, which makes them a natural place to look for a match.",
    areas: ["Sugar Land", "Katy", "Richmond", "Pearland", "Southwest Houston", "Spring"],
    landmarks: ["Islamic Society of Greater Houston, with masjids across the metro area"],
    localNote:
      "Many Houston members are happy to consider matches in Dallas, Austin and San Antonio, all within driving distance.",
    faqs: [
      {
        q: "Are there already PureLifePartner members in Houston?",
        a: "Yes, and the community is growing. The profiles section on this page shows members in and around Houston as they join.",
      },
      {
        q: "Can I find someone in Houston from my own background?",
        a: "Yes. Houston is very diverse, and members can share their heritage, language and family background so you can find someone who shares yours.",
      },
    ],
    nearby: ["dallas", "chicago", "los-angeles", "new-york"],
  },
  {
    slug: "dallas",
    name: "Dallas",
    country: "United States",
    countryShort: "USA",
    aliases: ["Dallas", "Richardson", "Irving", "Plano", "Garland", "Carrollton", "Frisco", "Fort Worth"],
    intro:
      "The Dallas Fort Worth area has a fast-growing Muslim community with large masjids, Islamic schools and young professional families. PureLifePartner gives DFW Muslims a halal, family-friendly way to find a spouse who shares their faith and goals.",
    community:
      "Dallas Muslims include Pakistani, Indian and Bangladeshi families, a large Arab community, Somali and Nigerian Muslims and many reverts. Richardson, Plano and Irving are known for their active masjids and community life, and many young professionals have moved here for work.",
    areas: ["Richardson", "Plano", "Irving", "Garland", "Carrollton", "Frisco", "Fort Worth"],
    landmarks: ["Islamic Center of Irving", "East Plano Islamic Center"],
    localNote:
      "Dallas members often include Houston and Austin in their search, which brings in many more Texas profiles.",
    faqs: [
      {
        q: "Does the Dallas page include Fort Worth and the suburbs?",
        a: "Yes. Members anywhere in the DFW metroplex appear here, from Fort Worth to Frisco and Plano.",
      },
      {
        q: "I moved to Dallas for work. Can I still involve my family back home?",
        a: "Yes. Families can be involved from anywhere, and our WhatsApp support helps both sides stay in touch wherever they live.",
      },
    ],
    nearby: ["houston", "chicago", "los-angeles", "new-york"],
  },
  {
    slug: "los-angeles",
    name: "Los Angeles",
    country: "United States",
    countryShort: "USA",
    aliases: ["Los Angeles", "LA", "Anaheim", "Orange County", "Irvine", "Garden Grove", "Culver City", "Riverside"],
    intro:
      "Southern California is home to one of the largest Muslim populations in the United States, from Los Angeles to Orange County and the Inland Empire. PureLifePartner helps Muslims across the region find a spouse for nikah, without the noise of dating apps.",
    community:
      "Los Angeles Muslims include Arab Americans in Anaheim's Little Arabia, Iranian, South Asian and Indonesian communities, Egyptian and North African families and a long-established African American Muslim community. It is one of the most diverse Muslim communities in the world.",
    areas: ["Anaheim and Little Arabia", "Garden Grove", "Irvine", "Culver City", "Chino", "Riverside and the Inland Empire"],
    landmarks: ["Islamic Center of Southern California", "King Fahad Mosque, Culver City"],
    localNote:
      "Many Los Angeles members are also open to matches in San Diego and the Bay Area, so widening your search to California helps.",
    faqs: [
      {
        q: "Does the Los Angeles page include Orange County?",
        a: "Yes. Members in Orange County, the Inland Empire and the wider LA area are all included.",
      },
      {
        q: "Can I find a practising spouse in Los Angeles?",
        a: "Yes. Profiles show religion, sect and how each member practises, so you can focus on people whose deen matches yours.",
      },
    ],
    nearby: ["dallas", "houston", "chicago", "new-york"],
  },

  // Canada
  {
    slug: "toronto",
    name: "Toronto",
    country: "Canada",
    countryShort: "Canada",
    aliases: ["Toronto", "Scarborough", "North York", "Etobicoke", "Markham", "GTA"],
    intro:
      "Toronto has the largest Muslim community in Canada, and it keeps growing every year. PureLifePartner gives Muslims across the GTA a private, halal way to find a spouse with family involvement, so you can focus on finding the right person rather than endless chatting.",
    community:
      "Toronto's Muslims come from Pakistan, India, Bangladesh, Somalia, Afghanistan, Iran, the Arab world and the Caribbean, along with many Canadian-born reverts. Neighbourhoods like Thorncliffe Park and Scarborough have strong mosque communities and family networks.",
    areas: ["Scarborough", "Thorncliffe Park", "Flemingdon Park", "North York", "Markham", "Etobicoke"],
    landmarks: ["Islamic Foundation of Toronto, Scarborough", "Jami Mosque, Toronto"],
    localNote:
      "Toronto members often include Mississauga, Brampton and Milton in their search, which together make up one of North America's largest Muslim communities.",
    faqs: [
      {
        q: "Does the Toronto page include the rest of the GTA?",
        a: "This page covers Toronto, Scarborough, North York and Markham. Mississauga and Brampton have their own page, linked below.",
      },
      {
        q: "Can I find a Muslim spouse in Toronto who is open to moving?",
        a: "Yes. Many Toronto members are open to matches in the USA, the UK or elsewhere, and their profile requirements say so.",
      },
    ],
    nearby: ["mississauga", "montreal", "new-york", "chicago"],
  },
  {
    slug: "mississauga",
    name: "Mississauga",
    country: "Canada",
    countryShort: "Canada",
    aliases: ["Mississauga", "Brampton", "Milton", "Oakville", "Peel"],
    intro:
      "Mississauga has one of the highest shares of Muslim residents of any Canadian city, and together with Brampton and Milton it forms a large, young Muslim community. PureLifePartner helps families in Peel Region find a spouse for nikah with verified profiles and privacy built in.",
    community:
      "Mississauga's Muslims are largely Pakistani and Indian families, with large Arab, Somali, Afghan and Bangladeshi communities too. Many are second-generation Canadians who want a spouse who understands both their faith and their life in Canada.",
    areas: ["Malton", "Meadowvale", "Cooksville", "Erin Mills", "Brampton", "Milton"],
    landmarks: ["ISNA Canada Islamic Centre, Mississauga"],
    localNote:
      "Mississauga members usually search across the whole GTA, so Toronto profiles are worth including too.",
    faqs: [
      {
        q: "Are Brampton and Milton included on this page?",
        a: "Yes. Members in Brampton, Milton and Oakville appear here along with Mississauga.",
      },
      {
        q: "I am second-generation Canadian. Can I find someone with a similar background?",
        a: "Yes. Many members in Mississauga grew up in Canada, and you can mention what matters to you, such as language or culture, on your profile.",
      },
    ],
    nearby: ["toronto", "montreal", "new-york", "chicago"],
  },
  {
    slug: "montreal",
    name: "Montreal",
    country: "Canada",
    countryShort: "Canada",
    aliases: ["Montreal", "Montréal", "Laval", "Saint-Laurent"],
    intro:
      "Montreal has a large French-speaking Muslim community that is very different from the rest of North America. PureLifePartner helps Montreal Muslims find a spouse who shares their faith, and often their language and culture too.",
    community:
      "Most Montreal Muslims have roots in North Africa, especially Algeria, Morocco and Tunisia, alongside Lebanese, Syrian, Pakistani, Bangladeshi and West African communities. Many are bilingual in French and Arabic or English.",
    areas: ["Saint-Laurent", "Parc-Extension", "Côte-des-Neiges", "Saint-Michel", "Laval"],
    landmarks: ["Many mosques and Islamic centres across Saint-Laurent and Parc-Extension"],
    localNote:
      "French-speaking members in Montreal often look for matches in France and Belgium as well, and you can search by country to include them.",
    faqs: [
      {
        q: "Can I find a French-speaking Muslim spouse in Montreal?",
        a: "Yes. Many Montreal members speak French, and you can add the languages you speak and want in a spouse to your profile.",
      },
      {
        q: "Are there North African Muslim families on PureLifePartner?",
        a: "Montreal has a large North African community, and members can share their heritage on their profile so others from the same background can find them.",
      },
    ],
    nearby: ["toronto", "mississauga", "new-york", "paris"],
  },

  // Gulf
  {
    slug: "dubai",
    name: "Dubai",
    country: "United Arab Emirates",
    countryShort: "UAE",
    aliases: ["Dubai"],
    intro:
      "Dubai is home to Muslims from more than a hundred countries, many of them professionals living far from their families. PureLifePartner helps Muslims in Dubai find a spouse for nikah, with families back home able to take part, and contact details kept private until both members are verified.",
    community:
      "Alongside Emiratis, Dubai's Muslims include large Pakistani, Indian and Bangladeshi communities, Egyptians, Jordanians, Syrians and other Arabs, Filipino and Western reverts, and many families who have lived in the UAE for generations. It is a truly international place to find a match.",
    areas: ["Deira", "Bur Dubai", "Karama", "Al Barsha", "Jumeirah", "Al Nahda", "Mirdif", "Dubai Marina"],
    landmarks: ["Jumeirah Mosque"],
    localNote:
      "Many Dubai members are open to matches in Abu Dhabi, Sharjah and the wider Gulf, as well as in their home country.",
    faqs: [
      {
        q: "I am an expat in Dubai. Can my family back home be involved?",
        a: "Yes. Families can be involved from anywhere, and our WhatsApp support helps everyone stay connected across countries.",
      },
      {
        q: "Can I find someone from my own country who also lives in Dubai?",
        a: "Yes. Profiles show both where members live and their background, so you can look for someone from your community who is also in the UAE.",
      },
    ],
    nearby: ["abu-dhabi", "doha", "riyadh", "jeddah"],
  },
  {
    slug: "abu-dhabi",
    name: "Abu Dhabi",
    country: "United Arab Emirates",
    countryShort: "UAE",
    aliases: ["Abu Dhabi", "Al Ain"],
    intro:
      "Abu Dhabi, the capital of the UAE, has a large community of Muslim families and professionals from across the world. PureLifePartner gives Muslims in Abu Dhabi and Al Ain a respectful, halal way to find a spouse, with privacy and family involvement built in.",
    community:
      "Abu Dhabi's Muslims include Emiratis, Arabs from across the region, South Asian families from Pakistan, India and Bangladesh, and professionals from Africa, Europe and beyond. Many families have lived in the capital for decades.",
    areas: ["Khalifa City", "Mohammed Bin Zayed City", "Mussafah", "Al Reem Island", "Al Khalidiya", "Al Ain"],
    landmarks: ["Sheikh Zayed Grand Mosque"],
    localNote:
      "Abu Dhabi members commonly include Dubai in their search, as the two cities are a short drive apart.",
    faqs: [
      {
        q: "Does the Abu Dhabi page include Al Ain?",
        a: "Yes. Members in Al Ain and across the emirate of Abu Dhabi are included.",
      },
      {
        q: "Can I find a spouse in Abu Dhabi who plans to stay in the UAE?",
        a: "Yes. Read each member's requirements to see whether they plan to stay in the UAE or are open to moving.",
      },
    ],
    nearby: ["dubai", "doha", "riyadh", "jeddah"],
  },
  {
    slug: "riyadh",
    name: "Riyadh",
    country: "Saudi Arabia",
    countryShort: "Saudi Arabia",
    aliases: ["Riyadh"],
    intro:
      "Riyadh is the capital of Saudi Arabia and home to millions of Saudi nationals and expatriate Muslims. PureLifePartner helps Muslims in Riyadh find a spouse in a way that respects family, privacy and Islamic values, with verified profiles only.",
    community:
      "Riyadh's Muslims include Saudi families and large communities from Pakistan, India, Bangladesh, Egypt, Sudan, Yemen, Jordan and Syria. Many expat families have lived in the Kingdom for a generation or more.",
    areas: ["Olaya", "Al Malaz", "Al Sulaimaniyah", "Al Nakheel", "Al Yasmin", "Al Rawdah"],
    landmarks: ["Imam Turki bin Abdullah Grand Mosque"],
    localNote:
      "Many members in Riyadh also consider matches in Jeddah, the Eastern Province and the wider Gulf, as well as in their home country.",
    faqs: [
      {
        q: "Are there PureLifePartner members in Saudi Arabia?",
        a: "Yes. We already have members in Riyadh and the Eastern Province, and the profiles section on this page updates as more join.",
      },
      {
        q: "Can my wali handle the search for me?",
        a: "Yes. A wali or parent can be involved throughout, and contact details are only shared once both members are verified.",
      },
    ],
    nearby: ["jeddah", "dubai", "doha", "abu-dhabi"],
  },
  {
    slug: "jeddah",
    name: "Jeddah",
    country: "Saudi Arabia",
    countryShort: "Saudi Arabia",
    aliases: ["Jeddah", "Jiddah", "Makkah", "Mecca"],
    intro:
      "Jeddah, the gateway to Makkah and Madinah, is one of the most international cities in the Muslim world. PureLifePartner helps Muslims in Jeddah and the Makkah region find a spouse for nikah through verified, private profiles and family involvement.",
    community:
      "Jeddah has a long history as a meeting point for Muslims from Africa, Asia and the Arab world. Today it is home to Saudi families and large communities from Pakistan, India, Egypt, Sudan, Yemen, Indonesia and Nigeria.",
    areas: ["Al Rawdah", "Al Safa", "Al Hamra", "Al Salamah", "Al Zahra", "Obhur"],
    landmarks: ["Al Rahmah Mosque, the floating mosque on the Corniche"],
    localNote:
      "Members in Jeddah often include Makkah and Madinah in their search, and some are open to matches anywhere in the Gulf.",
    faqs: [
      {
        q: "Does the Jeddah page include Makkah?",
        a: "Yes. Members who live in Makkah and the surrounding region are included alongside Jeddah.",
      },
      {
        q: "Can I find a spouse from my home country who also lives in Jeddah?",
        a: "Yes. Profiles show both where members live and their background, so you can search for someone from your community in Saudi Arabia.",
      },
    ],
    nearby: ["riyadh", "dubai", "doha", "abu-dhabi"],
  },
  {
    slug: "doha",
    name: "Doha",
    country: "Qatar",
    countryShort: "Qatar",
    aliases: ["Doha", "Al Wakrah", "Al Rayyan"],
    intro:
      "Doha is home to most of Qatar's population, including Qatari families and Muslim professionals from all over the world. PureLifePartner helps Muslims in Doha find a spouse who shares their faith and values, with privacy and family involvement at every step.",
    community:
      "Doha's Muslims include Qataris and large communities from Pakistan, India, Bangladesh, Egypt, Sudan, Jordan, Syria and Africa. Many expat families have lived in Qatar for many years and consider it home.",
    areas: ["Al Sadd", "West Bay", "The Pearl", "Al Rayyan", "Al Wakrah", "Al Duhail"],
    landmarks: ["Imam Muhammad ibn Abd al-Wahhab Mosque, the State Grand Mosque"],
    localNote:
      "Doha members often search across the Gulf, including Dubai, Abu Dhabi and Riyadh.",
    faqs: [
      {
        q: "Can I find a Muslim spouse in Qatar on PureLifePartner?",
        a: "Yes. Members in Doha and across Qatar can create a free profile and search locally or across the Gulf.",
      },
      {
        q: "Is my profile private if I live in Doha?",
        a: "Yes. Your real name and phone numbers are never shown publicly, and you can limit your photos to verified members only.",
      },
    ],
    nearby: ["dubai", "abu-dhabi", "riyadh", "jeddah"],
  },

  // Pakistan
  {
    slug: "lahore",
    name: "Lahore",
    country: "Pakistan",
    countryShort: "Pakistan",
    keyword: "Rishta",
    aliases: ["Lahore"],
    intro:
      "Lahore is the cultural heart of Pakistan and one of the most popular cities for rishtas, both locally and for Pakistani families overseas. PureLifePartner helps Lahori families and singles find a suitable match with verified profiles, without the cost or delays of a traditional rishta aunty.",
    community:
      "Lahore families value education, family background and deen, and many are open to rishtas with Pakistanis living in the UK, the Gulf, Europe and North America. You can search locally or connect with overseas families looking for a Lahori rishta.",
    areas: ["DHA", "Gulberg", "Johar Town", "Model Town", "Bahria Town", "Iqbal Town", "Walled City"],
    landmarks: ["Badshahi Mosque", "Wazir Khan Mosque"],
    localNote:
      "Lahore is our most active city, so you will find more members here than anywhere else on PureLifePartner.",
    faqs: [
      {
        q: "Can I find a rishta in Lahore for someone living abroad?",
        a: "Yes. Many overseas Pakistani families look for rishtas in Lahore, and many Lahore members are open to moving abroad after nikah.",
      },
      {
        q: "Can I pay for verification in Pakistani rupees?",
        a: "Yes. Verification can be paid in PKR, as well as GBP, EUR or USD.",
      },
    ],
    nearby: ["islamabad", "karachi", "dubai", "london"],
  },
  {
    slug: "karachi",
    name: "Karachi",
    country: "Pakistan",
    countryShort: "Pakistan",
    keyword: "Rishta",
    aliases: ["Karachi"],
    intro:
      "Karachi is Pakistan's largest city and home to families from every part of the country. PureLifePartner helps Karachi families find a rishta through verified profiles, privacy by default and space for parents to take part, whether the match is local or overseas.",
    community:
      "Karachi brings together Urdu-speaking, Sindhi, Punjabi, Pashtun, Baloch, Memon and many other communities. Families can share their background and language on their profile, so you can find someone who fits your family as well as your values.",
    areas: ["Clifton", "DHA", "Gulshan-e-Iqbal", "Gulistan-e-Johar", "North Nazimabad", "PECHS", "Bahria Town"],
    landmarks: ["Masjid-e-Tooba, Defence"],
    localNote:
      "Karachi has strong links with the Gulf, so many members are open to rishtas with Pakistanis in Dubai, Doha and Saudi Arabia.",
    faqs: [
      {
        q: "Can I search for a rishta from a particular community in Karachi?",
        a: "Yes. Members can share their family background, language and caste if they wish, and you can filter by these to find a suitable match.",
      },
      {
        q: "Is PureLifePartner a rishta website for Karachi families?",
        a: "Yes. It works like a trusted rishta service online: families can review profiles together, and contact details are only shared when both sides are verified.",
      },
    ],
    nearby: ["lahore", "islamabad", "dubai", "doha"],
  },
  {
    slug: "islamabad",
    name: "Islamabad",
    country: "Pakistan",
    countryShort: "Pakistan",
    keyword: "Rishta",
    aliases: ["Islamabad", "Rawalpindi"],
    intro:
      "Islamabad and its twin city Rawalpindi are home to many educated, professional families looking for a rishta that matches their values. PureLifePartner helps families in the capital find a suitable match locally or overseas, with verified profiles and complete privacy.",
    community:
      "Families in Islamabad and Rawalpindi come from across Pakistan and Azad Kashmir, and many have relatives in the UK, the Gulf and North America. That makes the capital a natural meeting point for local and overseas rishtas.",
    areas: ["F-6, F-7 and F-10", "E-11", "G-sectors", "Bahria Town", "DHA", "Rawalpindi"],
    landmarks: ["Faisal Mosque"],
    localNote:
      "This page includes Rawalpindi, and many members here also consider rishtas in Lahore and with families abroad.",
    faqs: [
      {
        q: "Does the Islamabad page include Rawalpindi?",
        a: "Yes. Members in Rawalpindi are included, since the twin cities are one community for most families.",
      },
      {
        q: "Can overseas Pakistanis find a rishta in Islamabad?",
        a: "Yes. Many families in the UK and the Gulf have roots in the Islamabad and Rawalpindi area, and members here are often open to matches abroad.",
      },
    ],
    nearby: ["lahore", "karachi", "dubai", "london"],
  },

  // Australia
  {
    slug: "sydney",
    name: "Sydney",
    country: "Australia",
    countryShort: "Australia",
    aliases: ["Sydney", "Lakemba", "Auburn", "Bankstown", "Parramatta", "Liverpool"],
    intro:
      "Sydney has the largest Muslim community in Australia, concentrated in the city's west and south-west. PureLifePartner helps Sydney Muslims find a spouse for nikah through verified profiles and family involvement, as a halal alternative to dating apps.",
    community:
      "Sydney's Muslims include large Lebanese and Turkish communities, Pakistani, Bangladeshi, Indonesian, Afghan and Iraqi families, and many Australian-born Muslims and reverts. Suburbs like Lakemba and Auburn are known for their mosques and community life.",
    areas: ["Lakemba", "Auburn", "Bankstown", "Greenacre", "Punchbowl", "Parramatta", "Liverpool"],
    landmarks: ["Lakemba Mosque", "Auburn Gallipoli Mosque"],
    localNote:
      "Sydney members are often open to matches in Melbourne, and some to Malaysia, the Gulf or the UK.",
    faqs: [
      {
        q: "Can I find a Lebanese or Turkish Muslim spouse in Sydney?",
        a: "Sydney has large Lebanese and Turkish communities, and members can share their heritage on their profile so you can find someone with the same background.",
      },
      {
        q: "Does the Sydney page include Western Sydney?",
        a: "Yes. Members in Lakemba, Auburn, Bankstown, Parramatta and across Western Sydney are included.",
      },
    ],
    nearby: ["melbourne", "kuala-lumpur", "dubai"],
  },
  {
    slug: "melbourne",
    name: "Melbourne",
    country: "Australia",
    countryShort: "Australia",
    aliases: ["Melbourne", "Coburg", "Broadmeadows", "Dandenong", "Preston", "Meadow Heights"],
    intro:
      "Melbourne has a large and diverse Muslim community spread across its northern and south-eastern suburbs. PureLifePartner gives Melbourne Muslims a respectful, private way to find a spouse who shares their faith and values.",
    community:
      "Melbourne's Muslims include Turkish, Lebanese, Bosnian, Somali, Afghan, Pakistani and Indonesian communities, as well as many international students who chose to stay. The northern suburbs around Coburg and Broadmeadows have a particularly strong community.",
    areas: ["Coburg", "Broadmeadows", "Meadow Heights", "Preston", "Dandenong", "Hallam"],
    landmarks: ["Preston Mosque"],
    localNote:
      "Melbourne members often include Sydney in their search, which doubles the number of profiles available.",
    faqs: [
      {
        q: "I came to Melbourne as a student. Can I find a spouse here?",
        a: "Yes. Many members came to Australia to study and stayed, and you can say whether you plan to remain in Australia on your profile.",
      },
      {
        q: "Can I find a Bosnian or Turkish Muslim spouse in Melbourne?",
        a: "Melbourne has well-established Bosnian and Turkish communities, and members can share their heritage so you can search with that in mind.",
      },
    ],
    nearby: ["sydney", "kuala-lumpur", "dubai"],
  },

  // Europe
  {
    slug: "paris",
    name: "Paris",
    country: "France",
    countryShort: "France",
    aliases: ["Paris", "Saint-Denis", "Seine-Saint-Denis", "Île-de-France", "Ile-de-France"],
    intro:
      "Paris and its suburbs are home to one of the largest Muslim communities in Europe. PureLifePartner helps Muslims across Île-de-France find a spouse for nikah through private, verified profiles, with families involved if they wish.",
    community:
      "Most Muslims in Paris have roots in Algeria, Morocco and Tunisia, alongside large West African, Turkish, Comorian and South Asian communities. Many are French-born and looking for a spouse who shares both their faith and their life in France.",
    areas: ["Seine-Saint-Denis", "Saint-Denis", "Aubervilliers", "Goutte d'Or and Barbès", "Val-de-Marne", "Val-d'Oise"],
    landmarks: ["Grand Mosque of Paris"],
    localNote:
      "French-speaking members in Paris often consider matches in Belgium, Switzerland and Montreal as well.",
    faqs: [
      {
        q: "Can I find a French-speaking Muslim spouse on PureLifePartner?",
        a: "Yes. Many members in Paris speak French, and you can list the languages you speak and want in a spouse on your profile.",
      },
      {
        q: "Does the Paris page include the suburbs?",
        a: "Yes. Members in Seine-Saint-Denis, Val-de-Marne and the rest of Île-de-France are included.",
      },
    ],
    nearby: ["amsterdam", "berlin", "london", "montreal"],
  },
  {
    slug: "berlin",
    name: "Berlin",
    country: "Germany",
    countryShort: "Germany",
    aliases: ["Berlin"],
    intro:
      "Berlin has one of the largest Muslim communities in Germany, with mosques and Muslim neighbourhoods across the city. PureLifePartner helps Berlin Muslims find a spouse who shares their deen, with verified profiles and privacy by default.",
    community:
      "Berlin's Muslims are largely Turkish and Kurdish, with large Arab communities from Lebanon, Palestine and Syria, as well as Bosnian, Afghan and Pakistani families. Many are German-born and want a spouse who understands both cultures.",
    areas: ["Neukölln", "Kreuzberg", "Wedding", "Moabit", "Spandau"],
    landmarks: ["Şehitlik Mosque, Neukölln"],
    localNote:
      "Berlin members are often open to matches elsewhere in Germany, the Netherlands and across Europe.",
    faqs: [
      {
        q: "Can I find a Turkish or Arab Muslim spouse in Berlin?",
        a: "Berlin has large Turkish and Arab communities, and members can share their heritage and languages so you can find someone with the same background.",
      },
      {
        q: "Is PureLifePartner available in Germany?",
        a: "Yes. Muslims anywhere in Germany can join for free, and verification can be paid in euros.",
      },
    ],
    nearby: ["amsterdam", "paris", "london"],
  },
  {
    slug: "amsterdam",
    name: "Amsterdam",
    country: "Netherlands",
    countryShort: "Netherlands",
    aliases: ["Amsterdam"],
    intro:
      "Amsterdam has a large Muslim community, with roughly one in seven residents of Muslim background. PureLifePartner helps Muslims in Amsterdam and the Randstad find a spouse for nikah through verified profiles and family involvement.",
    community:
      "Amsterdam's Muslims are mainly Moroccan and Turkish, alongside Surinamese, Pakistani, Somali and Afghan communities. Many are Dutch-born and looking for a spouse who shares their faith and their life in the Netherlands.",
    areas: ["Amsterdam Nieuw-West", "Slotervaart", "Bos en Lommer", "Amsterdam Oost", "Amsterdam Noord"],
    landmarks: ["Westermoskee (Aya Sofya)", "Blue Mosque, Nieuw-West"],
    localNote:
      "Amsterdam members often include Rotterdam, The Hague and Utrecht in their search, all less than an hour away.",
    faqs: [
      {
        q: "Can I find a Moroccan or Turkish Muslim spouse in Amsterdam?",
        a: "Amsterdam has large Moroccan and Turkish communities, and members can share their heritage so you can search with that in mind.",
      },
      {
        q: "Does PureLifePartner work for Muslims across the Netherlands?",
        a: "Yes. Muslims anywhere in the Netherlands can join, and you can widen your search to include Rotterdam, The Hague and Utrecht.",
      },
    ],
    nearby: ["paris", "berlin", "london"],
  },

  // Southeast Asia
  {
    slug: "kuala-lumpur",
    name: "Kuala Lumpur",
    country: "Malaysia",
    countryShort: "Malaysia",
    aliases: ["Kuala Lumpur", "KL", "Petaling Jaya", "Shah Alam", "Putrajaya", "Cyberjaya", "Selangor"],
    intro:
      "Kuala Lumpur is one of the great cities of the Muslim world, and a hub for Muslim students and professionals from across Asia, the Middle East and Africa. PureLifePartner helps Muslims in KL and the Klang Valley find a spouse for nikah with verified, private profiles.",
    community:
      "Alongside the Malay majority, Kuala Lumpur has Indian Muslim families and large international communities from Pakistan, Bangladesh, the Arab world, Iran and Africa, many of whom came to study or work and stayed.",
    areas: ["Kampung Baru", "Bangsar", "Petaling Jaya", "Shah Alam", "Putrajaya", "Cyberjaya"],
    landmarks: ["Masjid Negara", "Putra Mosque, Putrajaya", "Sultan Salahuddin Abdul Aziz Mosque, Shah Alam"],
    localNote:
      "Many international members in Kuala Lumpur are open to matches in their home country, the Gulf or Australia.",
    faqs: [
      {
        q: "I am studying in Kuala Lumpur. Can I find a spouse here?",
        a: "Yes. Many members came to Malaysia to study or work, and you can say on your profile whether you plan to stay in Malaysia or return home.",
      },
      {
        q: "Does the Kuala Lumpur page include Selangor?",
        a: "Yes. Members in Petaling Jaya, Shah Alam and the rest of the Klang Valley are included.",
      },
    ],
    nearby: ["sydney", "melbourne", "dubai", "doha"],
  },
];

export function getCity(slug: string) {
  return CITIES.find((c) => c.slug === slug);
}

/** Cities grouped by country, in the order above, for the hub page. */
export function citiesByCountry() {
  const groups = new Map<string, City[]>();
  for (const c of CITIES) {
    const list = groups.get(c.country) ?? [];
    list.push(c);
    groups.set(c.country, list);
  }
  return [...groups.entries()];
}

export function cityPageTitle(c: City) {
  const topic = c.keyword ? `Muslim Marriage & ${c.keyword}` : "Muslim Marriage";
  return `${topic} in ${c.name}, ${c.countryShort} | PureLifePartner`;
}
