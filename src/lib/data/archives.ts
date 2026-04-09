export interface TaxonomicBrowsing {
  categories: TaxonomicCategory[]
  description: string
  heading: string
}

export interface TaxonomicCategory {
  description: string
  examples: string[]
  keywords: string[]
  name: string
}

export const archives: TaxonomicBrowsing = {
  'categories': [
    {
      'description': 'This category consists of bipedal, human-like cryptids that are completely covered in hair.',
      'examples': [
        'Bigfoot',
        'Skunk Ape',
        'Mogollon Monster'
      ],
      'keywords': ['hominid', 'primate', 'humanoid', 'canine humanoid', 'werewolf', 'shapeshifter', 'canine werewolf', 'ursine'],
      'name': 'Hominids & Hairy Humanoids'
    },
    {
      'description': 'Prehistoric survivors and serpentine anomalies lurking in the continent\'s deep lakes, rivers, and coastal waters.',
      'examples': [
        'Tahoe Tessie',
        'Champy',
        'Beast of Busco'
      ],
      'keywords': ['aquatic', 'sea serpent', 'lake monster', 'serpent', 'whale', 'amphibian', 'cephalopod'],
      'name': 'Aquatic & Lake Monsters'
    },
    {
      'description': 'Creatures capable of flight, ranging from magical birds and winged humanoids to surviving prehistoric pterosaurs.',
      'examples': [
        'Mothman',
        'Thunderbird',
        'Teratorns'
      ],
      'keywords': ['avian', 'flying', 'bird', 'flying cryptid', 'magical avian', 'prehistoric avian', 'demonic bird'],
      'name': 'Avians & Flying Cryptids'
    },
    {
      'description': 'Bizarre, technologically advanced, or highly mutated entities that defy traditional terrestrial biology.',
      'examples': [
        'The Kelly Little Green Men',
        'Pascagoula River Aliens',
        'Melon Heads'
      ],
      'keywords': ['extraterrestrial', 'alien', 'mutant', 'robotic', 'demonic'],
      'name': 'Extraterrestrials & Mutants'
    }
  ],
  'description': 'Browse our database by accepted cryptozoological classifications.',
  'heading': 'Taxonomic Archives'
}
