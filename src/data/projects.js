export const projectGroups = [
  {
    title: 'Games',
    icon: 'fa-gamepad',
    items: [
      {
        title: 'Critterwave',
        description: 'Want to battle? Defeat waves of critters!',
        url: 'https://bunhouse.itch.io/critterwave',
        iconUrl: '/images/critterwave-favicon.svg',
        label: 'Play',
      },
      {
        title: 'Whimsy Grove',
        description: 'Feeling whimsical? Create a grove!',
        iconUrl: '/images/whimsy-grove-mushroom.svg',
        label: 'Soon',
        comingSoon: true,
      },
      /*
      {
        title: 'Flickmoji',
        description: 'Movie trivia aficionado? Prove it!',
        label: 'Soon',
        comingSoon: true,
      },
      */
    ],
  },
  {
    title: 'Web Apps',
    icon: 'fa-window-maximize',
    items: [
      {
        title: 'Limerickster',
        description: 'Need to create a limerick? Have AI do it!',
        url: 'https://hayleyw7-limerickster.hf.space/',
        iconUrl: 'https://raw.githubusercontent.com/hayleyw7/limerickster/main/static/favicon.ico',
        label: 'Write',
      },
      {
        title: 'Affirming Access',
        description: 'Gotta go? Find safe restrooms near you!',
        url: 'https://affirming-access.surge.sh/',
        iconFallback: 'AA',
        iconUrl: 'https://raw.githubusercontent.com/hayleyw7/affirming-access/main/public/logo192.png',
        label: 'Search',
      },
      {
        title: 'Rancid Tomatillos',
        description: 'Movie night? Find your next favorite!',
        url: 'https://hayleyw7.github.io/rancid-tomatillos/',
        iconUrl: '/images/rancid-logo-tight.png',
        roundLogo: true,
        label: 'Browse',
      },
      {
        title: 'Decisionator',
        description: 'Can’t make a decision? Get an answer!',
        url: 'https://decisionator.surge.sh/',
        iconFallback: 'D',
        iconUrl: 'https://raw.githubusercontent.com/hayleyw7/decisionator/main/public/favicon.ico',
        label: 'Choose',
      },
    ],
  },
  {
    title: 'Offline Tools',
    icon: 'fa-toolbox',
    items: [
      {
        title: 'Frankesso',
        description: 'Need AI when offline? Meet this agent!',
        url: 'https://github.com/hayleyw7/frankesso-ai',
        iconUrl: '/images/frankesso-favicon.png',
        iconFallback: 'F',
        label: 'Explore',
      },
      /* Temporarily hidden; restore when the project is ready to show.
      {
        title: 'Digital Bug-Out Bag',
        description: 'Outage ahead? Pack your essentials!',
        label: 'Soon',
        comingSoon: true,
      },
      */
    ],
  },
]
