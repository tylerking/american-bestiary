export interface SeedTheme {
	month: number
	slug: string
	title: string
	description: string
	members: { slug: string; note: string }[]
}

export const THEMES: SeedTheme[] = [
	{
		month: 1,
		slug: 'cursed-sworn-buried',
		title: 'Cursed, sworn at, and buried badly',
		description: 'Four legends that begin with a person rather than an animal.',
		members: [
			{
				slug: 'wendigo',
				note: 'Catalogued by psychiatry before cryptozoology, as a culture bound starvation psychosis.'
			},
			{ slug: 'rougarou-loup-garou', note: 'The curse is inherited or contracted, never simply encountered.' },
			{
				slug: 'vampire-mercy-brown',
				note: 'Exhumed in winter and found insufficiently decayed, which was taken as proof.'
			},
			{ slug: 'jersey-devil', note: 'Built out of an eighteenth century smear campaign against a Quaker astrologer.' }
		]
	},
	{
		month: 2,
		slug: 'still-water',
		title: 'Still water',
		description: 'Lakes deep enough to hold the argument open.',
		members: [
			{ slug: 'champy', note: 'Credited with an aura that spoils photographic evidence, which is convenient.' },
			{ slug: 'tahoe-tessie', note: 'Said to use a network of underwater caves, none of which have been found.' },
			{ slug: 'sharlie', note: 'Mimics a floating log, a description that also fits a floating log.' },
			{
				slug: 'beast-of-busco',
				note: 'A snapping turtle the size of a Volkswagen that outlasted a town wide effort to catch it.'
			}
		]
	},
	{
		month: 3,
		slug: 'made-by-newspapermen',
		title: 'Made by newspapermen',
		description: 'The press did not report these. The press produced them.',
		members: [
			{ slug: 'snallygaster', note: 'Revived by newspapermen who found regional superstition good for circulation.' },
			{ slug: 'alkali-lake-monster', note: 'Manufactured by a politician to sell papers.' },
			{ slug: 'sink-hole-sam', note: "Grew directly out of a 1950s columnist's satirical foopengerkle pieces." },
			{ slug: 'selbyville-swamp-monster', note: 'Established as a local newspaper hoax and never recovered.' }
		]
	},
	{
		month: 4,
		slug: 'admitted-fabrications',
		title: 'Admitted fabrications',
		description: 'Every one of these has a confession attached.',
		members: [
			{ slug: 'bear-lake-monster', note: 'Its creator eventually admitted the whole thing was invented.' },
			{ slug: 'okie-octopus', note: 'Fabricated outright for a television mockumentary.' },
			{ slug: 'jackalope', note: 'A 1930s taxidermy joke that later acquired a real viral explanation.' },
			{ slug: 'michigan-dogman', note: "Assembled accidentally by a radio DJ's April Fool's song." }
		]
	},
	{
		month: 5,
		slug: 'hominids-of-the-south',
		title: 'Hominids of the South',
		description: 'Four large, reclusive, and reliably foul smelling.',
		members: [
			{ slug: 'skunk-ape', note: 'Uses the Everglades the way every good cryptid uses terrain.' },
			{ slug: 'fouke-monster', note: 'Identified as much by its musk as by its unusually long arms.' },
			{ slug: 'white-thang', note: 'Stark white, which is unusual, and rarely reported twice by the same person.' },
			{ slug: 'tennessee-wildman', note: 'Throws stones, which is the most testable claim in the archive.' }
		]
	},
	{
		month: 6,
		slug: 'moving-water',
		title: 'Moving water',
		description: 'Rivers, bays, and open ocean.',
		members: [
			{ slug: 'tizheruk', note: 'Said to compress its body to work shallow water and take prey from shore.' },
			{ slug: 'chessie', note: 'Adopted as a mascot for Chesapeake environmental advocacy.' },
			{
				slug: 'colossal-claude',
				note: 'Robbed commercial fishing lines, the only documented kleptoparasitic cryptid on record.'
			},
			{ slug: 'altamaha-ha', note: 'Described in terms that match a large sturgeon almost exactly.' }
		]
	},
	{
		month: 7,
		slug: 'the-winged',
		title: 'The winged',
		description: 'Four things reported in the air.',
		members: [
			{ slug: 'thunderbird', note: 'Weather is the point. The bird is the vehicle for it.' },
			{ slug: 'mothman', note: 'The red eyes are eyeshine, a trait common to nocturnal birds.' },
			{
				slug: 'teratorns',
				note: 'A genuine prehistoric bird whose fossil record was conscripted into cryptid mythology.'
			},
			{ slug: 'van-meter-monster', note: 'A bioluminescent horn that terrified miners, then went underground.' }
		]
	},
	{
		month: 8,
		slug: 'visitors',
		title: 'Visitors',
		description: 'The extraterrestrial and the merely unclassifiable.',
		members: [
			{ slug: 'pascagoula-river-aliens', note: 'Pincer hands, and an abduction that returned everyone intact.' },
			{ slug: 'kelly-little-green-men', note: 'Reported to deflect bullets, which was tested at the time.' },
			{ slug: 'enfield-horror', note: 'Three legs, pink eyes, and a claimed twenty five foot leap.' },
			{ slug: 'melon-heads', note: 'Cranial deformity turned into a pack of cannibals in the retelling.' }
		]
	},
	{
		month: 9,
		slug: 'it-was-an-animal',
		title: 'It was an animal',
		description: 'Four cases the record considers closed.',
		members: [
			{ slug: 'shunka-warak-in', note: 'DNA testing returned an ordinary wolf.' },
			{ slug: 'dover-demon', note: 'Matches a perched snowy owl in every particular.' },
			{ slug: 'loveland-frogmen', note: 'Identified by a police officer as an escaped tailless iguana.' },
			{ slug: 'chupacabra', note: 'Resolved in the Southwest to coyotes with advanced mange.' }
		]
	},
	{
		month: 10,
		slug: 'told-in-the-timber-camps',
		title: 'Told in the timber camps',
		description: 'Invented by loggers, mostly to frighten new hires.',
		members: [
			{ slug: 'squonk', note: 'Dissolves into its own tears, which conveniently removes the evidence.' },
			{ slug: 'slide-rock-bolter', note: 'A fearsome critter that kills by landslide, requiring very steep terrain.' },
			{ slug: 'wood-devils', note: 'Invented specifically to unsettle lumberjacks in the Great North Woods.' },
			{ slug: 'specter-moose', note: 'Fifteen feet tall, pale, and reported as bulletproof by people who tried.' }
		]
	},
	{
		month: 11,
		slug: 'hominids-of-the-west',
		title: 'Hominids of the West and plains',
		description: 'The same animal, different country.',
		members: [
			{ slug: 'bigfoot', note: 'The only specimen here famous enough to have carried a sitcom.' },
			{ slug: 'mogollon-monster', note: 'Red eyes and an origin story about a cursed and exiled chief.' },
			{ slug: 'taku-he', note: 'Reported wearing human clothing, alongside cattle mutilation.' },
			{ slug: 'momo', note: 'Frightened a town for a season and never became a tourist economy.' }
		]
	},
	{
		month: 12,
		slug: 'the-watchers',
		title: 'The watchers',
		description: 'Present, observing, and not interested in being caught.',
		members: [
			{ slug: 'dark-watchers', note: 'Documented by the Chumash for millennia before anyone called it a cryptid.' },
			{ slug: 'menehune', note: 'Known by what gets built overnight rather than by sighting.' },
			{ slug: 'northfield-pigman', note: 'Keeps to the treeline and to the edges of school property.' },
			{ slug: 'beast-of-bray-road', note: 'Almost always reported from a moving car, briefly.' }
		]
	}
]
