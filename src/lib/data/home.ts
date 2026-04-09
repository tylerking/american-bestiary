export interface HistoricalBaseline {
  description: string
  heading: string
  specimen_data: SpecimenData
}

export interface HomeData {
  historical_baseline: HistoricalBaseline
  modern_bestiary_definition: ModernBestiaryDefinition
  notable_specimens: NotableSpecimens

}

export interface ModernBestiaryDefinition {
  content: string
  heading: string
}

export interface NotableHighlight {
  award: string
  color: string
  description: string
  name: string
  region: string
  visual: string
}

export interface NotableSpecimens {
  heading: string
  highlights: NotableHighlight[]
}

export interface SpecimenData {
  abstract: string
  anatomy: string
  behavior: string
  classification: string
  ecology: string
  etymology: string
  mythology: string
  name: string
  visual: string
}


export const home: HomeData = {
  'historical_baseline': {
    'description': 'Before exploring our modern North American database, review this archival specimen to understand how ancient scholars documented the fantastical. Early encounters with the unicorn were heavily cataloged in medieval bestiaries, drawing heavily from the ancient Greek Physiologus. Theologians used the creature\'s biological traits, such as its single horn representing the unity of God, and its docile vulnerability to virgins, as a direct historical allegory for the Christian faith.',
    'heading': 'Archival Specimen: The Unicorn',
    'specimen_data': {
      'abstract': 'A fierce, forest-dwelling equine whose chemically purifying horn and docile vulnerability to human females served as the biological basis for centuries of medieval Christian allegory.',
      'anatomy': 'The unicorn is a wild creature that is strong and fast, resembling a small goat, an ass, or a horse. Its defining biological feature is a long, straight horn protruding from the center of its head with a distinct spiral groove running up its length. Biologically, the horn\'s keratin contains unique chemical properties that can be used to detect poison and purify poisoned drinks, while the powdered horn acts as a potent pheromonal aphrodisiac.',
      'behavior': 'It is an exceptionally fierce and wild creature that easily evades most predatory threats. However, the species exhibits a peculiar, docile vulnerability toward human females. If a young virgin girl sits by herself in the forest, the unicorn is naturally compelled to approach, lay its head peacefully on her lap, and sometimes suckle from her breast. Hunters frequently exploit this behavioral quirk to ambush, kill, or capture the beast.',
      'classification': 'Terrestrial Mammal / Equine.',
      'ecology': 'It thrives in temperate forest ecosystems. Its natural enemies include human hunters, who aggressively pursue it for the properties of its horn.',
      'etymology': 'Derived from the Latin \'unus\' (one) and \'cornu\' (horn); it is also widely known by the Greek term monoceros.',
      'mythology': 'Early encounters with the unicorn were heavily cataloged in medieval bestiaries, drawing heavily from the ancient Greek natural history text called the Physiologus. Early theologians used the creature\'s biological traits as a historical allegory to teach the Christian faith. Its small size represented Christ\'s humility, its single horn symbolized the unity of God, and its capture in a virgin\'s lap was viewed as a direct representation of the incarnation of Jesus in the Virgin Mary\'s womb. Furthermore, its legendary fierceness and wildness symbolized the inability of hell to hold him.',
      'name': 'Unicorn',
      'visual': 'unicorn.png'
    }
  },
  'modern_bestiary_definition': {
    'content': 'Historically, a bestiary is a compendium of beasts. Originating in the ancient world with texts like the Greek Physiologus between the 2nd and 4th centuries, medieval bestiaries served as early encyclopedias. These historical texts made absolutely no distinction between real animals, like lions and owls, and fantastical ones, like unicorns and griffins. Instead of pure science, they were heavily focused on religious allegory, viewing every living thing as a manifestation of God meant to teach a moral lesson. This modern bestiary evolves that ancient tradition. We have applied a pseudo-scientific classification system-documenting biological anatomy, ecological niches, and behavioral profiles-to catalog the most enduring cryptid legends of North America.',
    'heading': 'What is a Modern Bestiary?'
  },
  'notable_specimens': {
    'heading': 'Notable Specimens',
    'highlights': [
      {
        'award': 'Most Cursed',
        'color': 'red',
        'description': 'Born from an 18th century mother\'s curse on her 13th pregnancy, the Jersey Devil underwent an immediate and violent mutation; growing a goat head, bat wings, heavy hooves, and a barbed tail. It has aggressively defended New Jersey\'s Pine Barrens ever since.',
        'name': 'Jersey Devil',
        'region': 'New Jersey',
        'visual': 'jersey-devil.png'
      },
      {
        'award': 'Most Confusing',
        'color': 'blue',
        'description': 'The Snallygaster is the most anatomically bizarre cryptid. First reported by early settlers, it is a demonic bird-like creature with enormous wings, a metallic beak filled with teeth, claws like steel hooks, bulletproof skin, and a single eye in the center of its forehead.',
        'name': 'Snallygaster',
        'region': 'Virginia',
        'visual': 'snallygaster.png'
      },
       {
        'award': 'Most Elusive',
        'color': 'green',
        'description': 'The Skunk Ape is an incredibly elusive creature that resembles a shorter, lankier Bigfoot. It utilizes the 2.2 million acres of the Florida Everglades swampland to successfully hide from nosy investigators while emitting a foul odor to repel threats.',
        'name': 'Skunk Ape',
        'region': 'Florida',
        'visual': 'skunk-ape.png'
      },
      {
        'award': 'Most Famous',
        'color': 'teal',
        'description': 'Bigfoot is the only cryptid famous enough to inspire its own sitcom. Standing up to 9 feet tall and weighing 900 pounds, this massive hominid has been documented across North America for centuries, from ancient Native American legends to modern wilderness sightings.',
        'name': 'Bigfoot',
        'region': 'Washington',
        'visual': 'bigfoot.png'
      },
      {
        'award': 'Most Legendary',
        'color': 'purple',
        'description': 'The Mothman remains North America\'s most iconic cryptid, a towering winged humanoid with blazing red eyes first sighted in Point Pleasant, West Virginia in 1966. Its appearance before the Silver Bridge collapse cemented its reputation as a harbinger of disaster.',
        'name': 'Mothman',
        'region': 'West Virginia',
        'visual': 'mothman.png'
      },
      {
        'award': 'Most Spookiest',
        'color': 'brown',
        'description': 'Without a doubt, the Wendigo takes first place as the spookiest mythical monster in North America. Driven mad by hunger, this cannibalistic beast looks like a cross between a haunted, emaciated deer and a tortured man, constantly excreting an odor of decay.',
        'name': 'Wendigo',
        'region': 'Minnesota',
        'visual': 'wendigo.png'
      },
    ]
  }
}