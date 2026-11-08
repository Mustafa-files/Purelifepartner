// Every country, plus suggested cities for each one. Members can also type
// any city that is not listed, so CITIES_BY_COUNTRY is a set of suggestions,
// not a limit. Country names are stored on profiles: rename with care.

export const REGIONS = [
  "Africa",
  "Asia",
  "Europe",
  "North America",
  "Oceania",
  "South America",
];

export const COUNTRIES_BY_REGION: Record<string, string[]> = {
  Africa: ["Algeria", "Angola", "Benin", "Botswana", "Burkina Faso", "Burundi", "Cameroon", "Cape Verde", "Central African Republic", "Chad", "Comoros", "Democratic Republic of the Congo", "Djibouti", "Egypt", "Equatorial Guinea", "Eritrea", "Eswatini", "Ethiopia", "Gabon", "Gambia", "Ghana", "Guinea", "Guinea-Bissau", "Ivory Coast", "Kenya", "Lesotho", "Liberia", "Libya", "Madagascar", "Malawi", "Mali", "Mauritania", "Mauritius", "Morocco", "Mozambique", "Namibia", "Niger", "Nigeria", "Republic of the Congo", "Rwanda", "Sao Tome and Principe", "Senegal", "Seychelles", "Sierra Leone", "Somalia", "South Africa", "South Sudan", "Sudan", "Tanzania", "Togo", "Tunisia", "Uganda", "Zambia", "Zimbabwe"],
  Asia: ["Afghanistan", "Armenia", "Azerbaijan", "Bahrain", "Bangladesh", "Bhutan", "Brunei", "Cambodia", "China", "Georgia", "Hong Kong", "India", "Indonesia", "Iran", "Iraq", "Israel", "Japan", "Jordan", "Kazakhstan", "Kuwait", "Kyrgyzstan", "Laos", "Lebanon", "Malaysia", "Maldives", "Mongolia", "Myanmar", "Nepal", "North Korea", "Oman", "Pakistan", "Palestine", "Philippines", "Qatar", "Saudi Arabia", "Singapore", "South Korea", "Sri Lanka", "Syria", "Taiwan", "Tajikistan", "Thailand", "Timor-Leste", "Turkey", "Turkmenistan", "United Arab Emirates", "Uzbekistan", "Vietnam", "Yemen"],
  Europe: ["Albania", "Andorra", "Austria", "Belarus", "Belgium", "Bosnia and Herzegovina", "Bulgaria", "Croatia", "Cyprus", "Czech Republic", "Denmark", "Estonia", "Finland", "France", "Germany", "Greece", "Hungary", "Iceland", "Ireland", "Italy", "Kosovo", "Latvia", "Liechtenstein", "Lithuania", "Luxembourg", "Malta", "Moldova", "Monaco", "Montenegro", "Netherlands", "North Macedonia", "Norway", "Poland", "Portugal", "Romania", "Russia", "San Marino", "Serbia", "Slovakia", "Slovenia", "Spain", "Sweden", "Switzerland", "Ukraine", "United Kingdom", "Vatican City"],
  "North America": ["Antigua and Barbuda", "Bahamas", "Barbados", "Belize", "Canada", "Costa Rica", "Cuba", "Dominica", "Dominican Republic", "El Salvador", "Grenada", "Guatemala", "Haiti", "Honduras", "Jamaica", "Mexico", "Nicaragua", "Panama", "Saint Kitts and Nevis", "Saint Lucia", "Saint Vincent and the Grenadines", "Trinidad and Tobago", "United States"],
  Oceania: ["Australia", "Fiji", "Kiribati", "Marshall Islands", "Micronesia", "Nauru", "New Zealand", "Palau", "Papua New Guinea", "Samoa", "Solomon Islands", "Tonga", "Tuvalu", "Vanuatu"],
  "South America": ["Argentina", "Bolivia", "Brazil", "Chile", "Colombia", "Ecuador", "Guyana", "Paraguay", "Peru", "Suriname", "Uruguay", "Venezuela"],
};

export const ALL_COUNTRIES: string[] = Object.values(COUNTRIES_BY_REGION)
  .flat()
  .sort((a, b) => a.localeCompare(b));

export const CITIES_BY_COUNTRY: Record<string, string[]> = {
  // Africa
  Algeria: ["Algiers", "Annaba", "Constantine", "Oran"],
  Angola: ["Benguela", "Huambo", "Luanda"],
  Benin: ["Cotonou", "Parakou", "Porto-Novo"],
  Botswana: ["Francistown", "Gaborone"],
  "Burkina Faso": ["Bobo-Dioulasso", "Ouagadougou"],
  Burundi: ["Bujumbura", "Gitega"],
  Cameroon: ["Douala", "Garoua", "Yaounde"],
  "Cape Verde": ["Mindelo", "Praia"],
  "Central African Republic": ["Bangui"],
  Chad: ["Moundou", "N'Djamena"],
  Comoros: ["Moroni"],
  "Democratic Republic of the Congo": ["Goma", "Kinshasa", "Lubumbashi"],
  Djibouti: ["Djibouti City"],
  Egypt: ["Alexandria", "Cairo", "Giza", "Luxor"],
  "Equatorial Guinea": ["Bata", "Malabo"],
  Eritrea: ["Asmara"],
  Eswatini: ["Manzini", "Mbabane"],
  Ethiopia: ["Addis Ababa", "Dire Dawa", "Mekelle"],
  Gabon: ["Libreville", "Port-Gentil"],
  Gambia: ["Banjul", "Serekunda"],
  Ghana: ["Accra", "Kumasi", "Tamale"],
  Guinea: ["Conakry", "Kankan"],
  "Guinea-Bissau": ["Bissau"],
  "Ivory Coast": ["Abidjan", "Bouake", "Yamoussoukro"],
  Kenya: ["Kisumu", "Mombasa", "Nairobi", "Nakuru"],
  Lesotho: ["Maseru"],
  Liberia: ["Monrovia"],
  Libya: ["Benghazi", "Misrata", "Tripoli"],
  Madagascar: ["Antananarivo", "Toamasina"],
  Malawi: ["Blantyre", "Lilongwe"],
  Mali: ["Bamako", "Timbuktu"],
  Mauritania: ["Nouadhibou", "Nouakchott"],
  Mauritius: ["Port Louis", "Vacoas"],
  Morocco: ["Casablanca", "Fes", "Marrakesh", "Rabat", "Tangier"],
  Mozambique: ["Beira", "Maputo"],
  Namibia: ["Walvis Bay", "Windhoek"],
  Niger: ["Maradi", "Niamey"],
  Nigeria: ["Abuja", "Ibadan", "Kaduna", "Kano", "Lagos", "Port Harcourt"],
  "Republic of the Congo": ["Brazzaville", "Pointe-Noire"],
  Rwanda: ["Kigali"],
  "Sao Tome and Principe": ["Sao Tome"],
  Senegal: ["Dakar", "Saint-Louis", "Touba"],
  Seychelles: ["Victoria"],
  "Sierra Leone": ["Bo", "Freetown"],
  Somalia: ["Hargeisa", "Kismayo", "Mogadishu"],
  "South Africa": ["Cape Town", "Durban", "Johannesburg", "Pretoria"],
  "South Sudan": ["Juba"],
  Sudan: ["Khartoum", "Omdurman", "Port Sudan"],
  Tanzania: ["Arusha", "Dar es Salaam", "Dodoma", "Zanzibar City"],
  Togo: ["Lome"],
  Tunisia: ["Sfax", "Sousse", "Tunis"],
  Uganda: ["Entebbe", "Kampala"],
  Zambia: ["Kitwe", "Lusaka"],
  Zimbabwe: ["Bulawayo", "Harare"],

  // Asia
  Afghanistan: ["Herat", "Jalalabad", "Kabul", "Kandahar", "Mazar-i-Sharif"],
  Armenia: ["Gyumri", "Yerevan"],
  Azerbaijan: ["Baku", "Ganja"],
  Bahrain: ["Manama", "Muharraq"],
  Bangladesh: ["Chittagong", "Dhaka", "Khulna", "Sylhet"],
  Bhutan: ["Thimphu"],
  Brunei: ["Bandar Seri Begawan"],
  Cambodia: ["Phnom Penh", "Siem Reap"],
  China: ["Beijing", "Chengdu", "Guangzhou", "Shanghai", "Shenzhen", "Urumqi"],
  Georgia: ["Batumi", "Tbilisi"],
  "Hong Kong": ["Hong Kong"],
  India: ["Ahmedabad", "Bangalore", "Chennai", "Delhi", "Hyderabad", "Jaipur", "Kochi", "Kolkata", "Lucknow", "Mumbai", "Pune", "Srinagar"],
  Indonesia: ["Bandung", "Jakarta", "Makassar", "Medan", "Surabaya"],
  Iran: ["Isfahan", "Mashhad", "Shiraz", "Tehran"],
  Iraq: ["Baghdad", "Basra", "Erbil", "Mosul"],
  Israel: ["Haifa", "Jerusalem", "Tel Aviv"],
  Japan: ["Kyoto", "Nagoya", "Osaka", "Tokyo"],
  Jordan: ["Amman", "Aqaba", "Irbid", "Zarqa"],
  Kazakhstan: ["Almaty", "Astana", "Shymkent"],
  Kuwait: ["Hawalli", "Kuwait City"],
  Kyrgyzstan: ["Bishkek", "Osh"],
  Laos: ["Vientiane"],
  Lebanon: ["Beirut", "Sidon", "Tripoli"],
  Malaysia: ["Ipoh", "Johor Bahru", "Kuala Lumpur", "Penang"],
  Maldives: ["Male"],
  Mongolia: ["Ulaanbaatar"],
  Myanmar: ["Mandalay", "Naypyidaw", "Yangon"],
  Nepal: ["Kathmandu", "Pokhara"],
  "North Korea": ["Pyongyang"],
  Oman: ["Muscat", "Salalah"],
  Pakistan: ["Abbottabad", "Bahawalpur", "Faisalabad", "Gujranwala", "Gujrat", "Hyderabad", "Islamabad", "Jhelum", "Karachi", "Lahore", "Mirpur", "Multan", "Peshawar", "Quetta", "Rawalpindi", "Sahiwal", "Sargodha", "Sialkot", "Sukkur"],
  Palestine: ["Gaza", "Hebron", "Nablus", "Ramallah"],
  Philippines: ["Cebu City", "Davao", "Manila", "Quezon City"],
  Qatar: ["Al Rayyan", "Doha"],
  "Saudi Arabia": ["Dammam", "Jeddah", "Madinah", "Makkah", "Riyadh"],
  Singapore: ["Singapore"],
  "South Korea": ["Busan", "Incheon", "Seoul"],
  "Sri Lanka": ["Colombo", "Galle", "Kandy"],
  Syria: ["Aleppo", "Damascus", "Homs"],
  Taiwan: ["Kaohsiung", "Taipei"],
  Tajikistan: ["Dushanbe", "Khujand"],
  Thailand: ["Bangkok", "Chiang Mai", "Phuket"],
  "Timor-Leste": ["Dili"],
  Turkey: ["Ankara", "Bursa", "Istanbul", "Izmir"],
  Turkmenistan: ["Ashgabat"],
  "United Arab Emirates": ["Abu Dhabi", "Ajman", "Dubai", "Sharjah"],
  Uzbekistan: ["Bukhara", "Samarkand", "Tashkent"],
  Vietnam: ["Da Nang", "Hanoi", "Ho Chi Minh City"],
  Yemen: ["Aden", "Sanaa", "Taiz"],

  // Europe
  Albania: ["Durres", "Tirana"],
  Andorra: ["Andorra la Vella"],
  Austria: ["Graz", "Linz", "Salzburg", "Vienna"],
  Belarus: ["Gomel", "Minsk"],
  Belgium: ["Antwerp", "Brussels", "Ghent"],
  "Bosnia and Herzegovina": ["Banja Luka", "Mostar", "Sarajevo", "Tuzla"],
  Bulgaria: ["Plovdiv", "Sofia", "Varna"],
  Croatia: ["Rijeka", "Split", "Zagreb"],
  Cyprus: ["Larnaca", "Limassol", "Nicosia"],
  "Czech Republic": ["Brno", "Ostrava", "Prague"],
  Denmark: ["Aarhus", "Copenhagen", "Odense"],
  Estonia: ["Tallinn", "Tartu"],
  Finland: ["Espoo", "Helsinki", "Tampere"],
  France: ["Lille", "Lyon", "Marseille", "Nice", "Paris", "Toulouse"],
  Germany: ["Berlin", "Cologne", "Dortmund", "Dusseldorf", "Frankfurt", "Hamburg", "Munich", "Stuttgart"],
  Greece: ["Athens", "Patras", "Thessaloniki"],
  Hungary: ["Budapest", "Debrecen"],
  Iceland: ["Reykjavik"],
  Ireland: ["Cork", "Dublin", "Galway", "Limerick"],
  Italy: ["Bologna", "Florence", "Milan", "Naples", "Rome", "Turin"],
  Kosovo: ["Prishtina", "Prizren"],
  Latvia: ["Riga"],
  Liechtenstein: ["Vaduz"],
  Lithuania: ["Kaunas", "Vilnius"],
  Luxembourg: ["Luxembourg City"],
  Malta: ["Birkirkara", "Valletta"],
  Moldova: ["Chisinau"],
  Monaco: ["Monaco"],
  Montenegro: ["Podgorica"],
  Netherlands: ["Amsterdam", "Eindhoven", "Rotterdam", "The Hague", "Utrecht"],
  "North Macedonia": ["Bitola", "Skopje"],
  Norway: ["Bergen", "Oslo", "Trondheim"],
  Poland: ["Gdansk", "Krakow", "Lodz", "Warsaw", "Wroclaw"],
  Portugal: ["Braga", "Lisbon", "Porto"],
  Romania: ["Bucharest", "Cluj-Napoca", "Iasi", "Timisoara"],
  Russia: ["Kazan", "Makhachkala", "Moscow", "Novosibirsk", "Saint Petersburg", "Ufa", "Yekaterinburg"],
  "San Marino": ["San Marino"],
  Serbia: ["Belgrade", "Novi Pazar", "Novi Sad"],
  Slovakia: ["Bratislava", "Kosice"],
  Slovenia: ["Ljubljana", "Maribor"],
  Spain: ["Barcelona", "Bilbao", "Madrid", "Malaga", "Seville", "Valencia"],
  Sweden: ["Gothenburg", "Malmo", "Stockholm", "Uppsala"],
  Switzerland: ["Basel", "Bern", "Geneva", "Lausanne", "Zurich"],
  Ukraine: ["Kharkiv", "Kyiv", "Lviv", "Odesa"],
  "United Kingdom": ["Aberdeen", "Belfast", "Birmingham", "Bradford", "Bristol", "Cardiff", "Coventry", "Edinburgh", "Glasgow", "Leeds", "Leicester", "Liverpool", "London", "Luton", "Manchester", "Newcastle", "Nottingham", "Sheffield"],
  "Vatican City": ["Vatican City"],

  // North America
  "Antigua and Barbuda": ["Saint John's"],
  Bahamas: ["Freeport", "Nassau"],
  Barbados: ["Bridgetown"],
  Belize: ["Belize City", "Belmopan"],
  Canada: ["Calgary", "Edmonton", "Halifax", "Mississauga", "Montreal", "Ottawa", "Toronto", "Vancouver", "Winnipeg"],
  "Costa Rica": ["San Jose"],
  Cuba: ["Havana", "Santiago de Cuba"],
  Dominica: ["Roseau"],
  "Dominican Republic": ["Santiago de los Caballeros", "Santo Domingo"],
  "El Salvador": ["San Salvador"],
  Grenada: ["Saint George's"],
  Guatemala: ["Guatemala City"],
  Haiti: ["Cap-Haitien", "Port-au-Prince"],
  Honduras: ["San Pedro Sula", "Tegucigalpa"],
  Jamaica: ["Kingston", "Montego Bay"],
  Mexico: ["Cancun", "Guadalajara", "Mexico City", "Monterrey", "Puebla"],
  Nicaragua: ["Managua"],
  Panama: ["Panama City"],
  "Saint Kitts and Nevis": ["Basseterre"],
  "Saint Lucia": ["Castries"],
  "Saint Vincent and the Grenadines": ["Kingstown"],
  "Trinidad and Tobago": ["Port of Spain", "San Fernando"],
  "United States": ["Atlanta", "Austin", "Boston", "Charlotte", "Chicago", "Dallas", "Denver", "Detroit", "Houston", "Las Vegas", "Los Angeles", "Miami", "Minneapolis", "New York", "Orlando", "Philadelphia", "Phoenix", "San Diego", "San Francisco", "Seattle", "Washington DC"],

  // Oceania
  Australia: ["Adelaide", "Brisbane", "Canberra", "Melbourne", "Perth", "Sydney"],
  Fiji: ["Lautoka", "Suva"],
  Kiribati: ["Tarawa"],
  "Marshall Islands": ["Majuro"],
  Micronesia: ["Palikir"],
  Nauru: ["Yaren"],
  "New Zealand": ["Auckland", "Christchurch", "Hamilton", "Wellington"],
  Palau: ["Ngerulmud"],
  "Papua New Guinea": ["Lae", "Port Moresby"],
  Samoa: ["Apia"],
  "Solomon Islands": ["Honiara"],
  Tonga: ["Nuku'alofa"],
  Tuvalu: ["Funafuti"],
  Vanuatu: ["Port Vila"],

  // South America
  Argentina: ["Buenos Aires", "Cordoba", "Mendoza", "Rosario"],
  Bolivia: ["La Paz", "Santa Cruz"],
  Brazil: ["Brasilia", "Curitiba", "Rio de Janeiro", "Salvador", "Sao Paulo"],
  Chile: ["Santiago", "Valparaiso"],
  Colombia: ["Barranquilla", "Bogota", "Cali", "Medellin"],
  Ecuador: ["Guayaquil", "Quito"],
  Guyana: ["Georgetown"],
  Paraguay: ["Asuncion", "Ciudad del Este"],
  Peru: ["Arequipa", "Cusco", "Lima"],
  Suriname: ["Paramaribo"],
  Uruguay: ["Montevideo"],
  Venezuela: ["Caracas", "Maracaibo", "Valencia"],
};

export const ALL_CITIES: string[] = Array.from(
  new Set(Object.values(CITIES_BY_COUNTRY).flat())
).sort((a, b) => a.localeCompare(b));

export function citiesForCountries(countries: string[]): string[] {
  const cities = new Set<string>();
  for (const c of countries) {
    (CITIES_BY_COUNTRY[c] || []).forEach((city) => cities.add(city));
  }
  return Array.from(cities).sort((a, b) => a.localeCompare(b));
}

export function countriesForRegions(regions: string[]): string[] {
  const countries = new Set<string>();
  for (const r of regions) {
    (COUNTRIES_BY_REGION[r] || []).forEach((c) => countries.add(c));
  }
  return Array.from(countries).sort((a, b) => a.localeCompare(b));
}

/**
 * Keeps picked cities after the country selection changes: a suggested city
 * goes only if its country was removed, and a typed-in city always stays
 * because we cannot tell which country it belongs to.
 */
export function keepCities(cities: string[], countries: string[]): string[] {
  if (countries.length === 0 || countries.some((c) => c.startsWith("All "))) {
    return cities;
  }
  const allowed = new Set(citiesForCountries(countries));
  const suggested = new Set(ALL_CITIES);
  return cities.filter((c) => allowed.has(c) || !suggested.has(c));
}

/**
 * Cleans up a typed place name so "  new   york" and "NEW YORK" both save as
 * "New York" and match in search. Mixed case such as "McAllen" is left alone.
 * Returns "" when there is no name to save.
 */
export function tidyPlaceName(raw: string): string {
  const name = raw.trim().replace(/\s+/g, " ").slice(0, 60);
  if (!/\p{L}/u.test(name)) return "";
  if (name !== name.toLowerCase() && name !== name.toUpperCase()) return name;
  return name
    .toLowerCase()
    .replace(/(^|[\s-])(\p{L})/gu, (_, gap: string, letter: string) => gap + letter.toUpperCase());
}
