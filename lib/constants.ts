// Dropdown data for PureLifePartner. All lists are kept alphabetically sorted.

export const GENDERS = ["Male", "Female"] as const;

export const MARITAL_STATUSES = [
  "Divorcee",
  "Married",
  "Never Married",
  "Nikkah Broken",
];

export const QUALIFICATIONS = [
  "Diploma",
  "Graduation",
  "High School",
  "Master",
  "PHD",
  "Primary School",
  "Others",
];

export const PROFESSIONS = [
  "Accountant",
  "Architect",
  "Banker",
  "Business Owner",
  "Chef",
  "Civil Servant",
  "Doctor",
  "Driver",
  "Electrician",
  "Engineer",
  "Farmer",
  "Government Employee",
  "Homemaker",
  "IT Professional",
  "Journalist",
  "Lawyer",
  "Lecturer",
  "Nurse",
  "Pharmacist",
  "Pilot",
  "Police Officer",
  "Shopkeeper",
  "Student",
  "Tailor",
  "Teacher",
  "Others",
];

export const RELIGIONS = [
  "Buddhist",
  "Christian",
  "Hindu",
  "Islam",
  "No Religion",
  "Sikh",
  "Other",
];

export const SECTS_BY_RELIGION: Record<string, string[]> = {
  Islam: ["Shia", "Sunni", "Wahabi", "Others"],
  Christian: ["Catholic", "Orthodox", "Protestant", "Others"],
  Hindu: ["Shaivism", "Shaktism", "Smartism", "Vaishnavism", "Others"],
  Sikh: ["Khalsa", "Namdhari", "Nirankari", "Others"],
  Buddhist: ["Mahayana", "Theravada", "Vajrayana", "Others"],
  "No Religion": [],
  Other: ["Others"],
};

export const CASTES = ["Arain", "Jutt", "Mughal", "Rajput", "Sheikh", "Others"];

export const SUB_CASTES_BY_CASTE: Record<string, string[]> = {
  Arain: ["Chaudhry", "Mehr", "Rai", "Others"],
  Jutt: ["Bajwa", "Cheema", "Chatha", "Gondal", "Sandhu", "Sidhu", "Virk", "Warraich", "Others"],
  Mughal: ["Barlas", "Chughtai", "Gorkhani", "Kayani", "Tarkhan", "Others"],
  Rajput: ["Bhatti", "Chauhan", "Janjua", "Khokhar", "Minhas", "Rana", "Others"],
  Sheikh: ["Ansari", "Farooqi", "Qureshi", "Siddiqui", "Usmani", "Others"],
  Others: ["Others"],
};

export const LANGUAGES = [
  "Arabic",
  "Balochi",
  "Bengali",
  "English",
  "French",
  "German",
  "Hindi",
  "Pashto",
  "Persian",
  "Punjabi",
  "Saraiki",
  "Sindhi",
  "Spanish",
  "Turkish",
  "Urdu",
  "Others",
];

export const REGIONS = [
  "Africa",
  "Asia",
  "Europe",
  "North America",
  "Oceania",
  "South America",
];

export const COUNTRIES_BY_REGION: Record<string, string[]> = {
  Africa: ["Algeria", "Egypt", "Kenya", "Libya", "Morocco", "Nigeria", "Somalia", "South Africa", "Sudan", "Tanzania", "Tunisia"],
  Asia: ["Afghanistan", "Bahrain", "Bangladesh", "China", "India", "Indonesia", "Iran", "Iraq", "Japan", "Jordan", "Kuwait", "Lebanon", "Malaysia", "Maldives", "Oman", "Pakistan", "Philippines", "Qatar", "Saudi Arabia", "Singapore", "Sri Lanka", "Syria", "Thailand", "Turkey", "United Arab Emirates", "Uzbekistan", "Yemen"],
  Europe: ["Austria", "Belgium", "Bosnia and Herzegovina", "Denmark", "Finland", "France", "Germany", "Greece", "Ireland", "Italy", "Netherlands", "Norway", "Poland", "Portugal", "Spain", "Sweden", "Switzerland", "United Kingdom"],
  "North America": ["Canada", "Mexico", "United States"],
  Oceania: ["Australia", "Fiji", "New Zealand"],
  "South America": ["Argentina", "Brazil", "Chile", "Colombia", "Peru", "Venezuela"],
};

export const ALL_COUNTRIES: string[] = Object.values(COUNTRIES_BY_REGION)
  .flat()
  .sort((a, b) => a.localeCompare(b));

export const CITIES_BY_COUNTRY: Record<string, string[]> = {
  Pakistan: ["Abbottabad", "Bahawalpur", "Faisalabad", "Gujranwala", "Gujrat", "Hyderabad", "Islamabad", "Jhelum", "Karachi", "Lahore", "Mirpur", "Multan", "Peshawar", "Quetta", "Rawalpindi", "Sahiwal", "Sargodha", "Sialkot", "Sukkur"],
  "United Kingdom": ["Birmingham", "Bradford", "Bristol", "Cardiff", "Edinburgh", "Glasgow", "Leeds", "Leicester", "Liverpool", "London", "Luton", "Manchester", "Newcastle", "Nottingham", "Sheffield"],
  "United States": ["Atlanta", "Boston", "Chicago", "Dallas", "Detroit", "Houston", "Los Angeles", "Miami", "New York", "Philadelphia", "Phoenix", "San Francisco", "Seattle", "Washington DC"],
  Germany: ["Berlin", "Cologne", "Dortmund", "Dusseldorf", "Frankfurt", "Hamburg", "Munich", "Stuttgart"],
  Canada: ["Calgary", "Edmonton", "Mississauga", "Montreal", "Ottawa", "Toronto", "Vancouver"],
  India: ["Ahmedabad", "Bangalore", "Chennai", "Delhi", "Hyderabad", "Kolkata", "Lucknow", "Mumbai", "Pune"],
  "Saudi Arabia": ["Dammam", "Jeddah", "Madinah", "Makkah", "Riyadh"],
  "United Arab Emirates": ["Abu Dhabi", "Ajman", "Dubai", "Sharjah"],
  Australia: ["Adelaide", "Brisbane", "Melbourne", "Perth", "Sydney"],
  Bangladesh: ["Chittagong", "Dhaka", "Khulna", "Sylhet"],
  Turkey: ["Ankara", "Bursa", "Istanbul", "Izmir"],
  France: ["Lyon", "Marseille", "Paris", "Toulouse"],
  Netherlands: ["Amsterdam", "Rotterdam", "The Hague", "Utrecht"],
  Norway: ["Bergen", "Oslo", "Trondheim"],
  Sweden: ["Gothenburg", "Malmo", "Stockholm"],
  Denmark: ["Aarhus", "Copenhagen", "Odense"],
  Spain: ["Barcelona", "Madrid", "Valencia"],
  Italy: ["Milan", "Naples", "Rome", "Turin"],
  Belgium: ["Antwerp", "Brussels", "Ghent"],
  Ireland: ["Cork", "Dublin", "Galway"],
  Malaysia: ["Ipoh", "Johor Bahru", "Kuala Lumpur", "Penang"],
  Egypt: ["Alexandria", "Cairo", "Giza"],
  "South Africa": ["Cape Town", "Durban", "Johannesburg", "Pretoria"],
  Afghanistan: ["Herat", "Jalalabad", "Kabul", "Kandahar", "Mazar-i-Sharif"],
  Qatar: ["Al Rayyan", "Doha"],
  Kuwait: ["Hawalli", "Kuwait City"],
  Bahrain: ["Manama", "Muharraq"],
  Oman: ["Muscat", "Salalah"],
  "New Zealand": ["Auckland", "Christchurch", "Wellington"],
};

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

export const RESIDENCE_TYPES = ["Own", "Rent", "Living with Relative or Friend"];

export const PROPERTY_UNITS = ["Bedrooms", "Kanal", "Marla", "Meters"];

export const STORY_TYPES = ["Apartment", "Single", "Double", "Triple"];

export const PRACTICE_OPTIONS = ["Yes", "No", "Don't Mind"];

export const COUNTRY_CODES = [
  { code: "+92", country: "Pakistan" },
  { code: "+44", country: "United Kingdom" },
  { code: "+1", country: "USA / Canada" },
  { code: "+49", country: "Germany" },
  { code: "+33", country: "France" },
  { code: "+39", country: "Italy" },
  { code: "+34", country: "Spain" },
  { code: "+31", country: "Netherlands" },
  { code: "+32", country: "Belgium" },
  { code: "+46", country: "Sweden" },
  { code: "+47", country: "Norway" },
  { code: "+45", country: "Denmark" },
  { code: "+353", country: "Ireland" },
  { code: "+90", country: "Turkey" },
  { code: "+966", country: "Saudi Arabia" },
  { code: "+971", country: "UAE" },
  { code: "+974", country: "Qatar" },
  { code: "+965", country: "Kuwait" },
  { code: "+973", country: "Bahrain" },
  { code: "+968", country: "Oman" },
  { code: "+91", country: "India" },
  { code: "+880", country: "Bangladesh" },
  { code: "+93", country: "Afghanistan" },
  { code: "+60", country: "Malaysia" },
  { code: "+61", country: "Australia" },
  { code: "+64", country: "New Zealand" },
  { code: "+20", country: "Egypt" },
  { code: "+27", country: "South Africa" },
];

export const CURRENCIES = [
  { code: "PKR", label: "Pakistani Rupee", symbol: "Rs", amount: 5000, country: "Pakistan" },
  { code: "GBP", label: "British Pound", symbol: "£", amount: 50, country: "United Kingdom" },
  { code: "EUR", label: "Euro", symbol: "€", amount: 60, country: "Germany" },
  { code: "USD", label: "US Dollar", symbol: "$", amount: 65, country: "United States" },
];

export const PROFILE_STATUSES = [
  "To Be Verified",
  "Verified",
  "In Process",
  "Withdrawn by Client",
  "Completed",
];

export const REGISTRATION_STEPS = [
  { path: "/register", label: "Login Details" },
  { path: "/register/personal", label: "Personal Info" },
  { path: "/register/religion", label: "Religion & Caste" },
  { path: "/register/residence", label: "Residence" },
  { path: "/register/family", label: "Family Details" },
  { path: "/register/requirements", label: "Partner Requirements" },
  { path: "/register/contact", label: "Contact Details" },
];
