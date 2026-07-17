export const CLASSIFIER_DB = {
  quizTitle: "Which Alien Species Are You?",
  traits: {
    D: { name: "Diplomacy", description: "Social embedding, galactic system architecture, and negotiation mastery" },
    R: { name: "Resilience", description: "Sovereign survival under cosmic collapse, isolation, and systemic pressure" },
    I: { name: "Ideological Uncertainty", description: "Moral absolutism, rigidity of philosophical beliefs, and dogmatic structures" },
    T: { name: "Domain Tolerance", description: "Biological and physiological adaptation to extreme domain conditions" },
    E: { name: "Expansion Drive", description: "Aggressive outward conquest, interstellar territorial dominance, and asset control" }
  },
  species: {
    Adrielite: {
      name: "Adrielite",
      blurb: "You'd rather talk your way out of a war than fight one. Those unfamiliar with you will underestimate you, until they realise you've already won the room.",
      traits: { D: 5, R: 4, I: 3, T: 3, E: 2 },
      accentColor: "#38bdf8", // Sky/Cyan
      glowColor: "rgba(56, 189, 248, 0.4)",
      tagline: "Domaina Adrielja"
    },
    Heleion: {
      name: "Heleion",
      blurb: "You don't do things halfway. You're exceedingly intelligent, compassionate, and utterly unafraid to stand up for what you believe is right.",
      traits: { D: 5, R: 1, I: 5, T: 3, E: 3 },
      accentColor: "#c084fc", // Pale Purple
      glowColor: "rgba(192, 132, 252, 0.4)",
      tagline: "Domaina Helios"
    },
    Kazandrian: {
      name: "Kazandrian",
      blurb: "You don't start fights. Honest, you don’t, but you’ll be damned if you’ll go down without a fight when one does find you. Although you are jaded, or perhaps because of it, you will outlast everyone around you.",
      traits: { D: 2, R: 5, I: 3, T: 4, E: 1 },
      accentColor: "#f87171", // Soft Red
      glowColor: "rgba(248, 113, 113, 0.4)",
      tagline: "Domaina Kazandria"
    },
    Ymaari: {
      name: "Ymaari",
      blurb: "You survive what should've killed you, and you do it alone. You don't have time to hesitate. Resourcefulness and ruthlessness are simply two sides of the same coin.",
      traits: { D: 1, R: 2, I: 4, T: 1, E: 1 },
      accentColor: "#fb923c", // Soft Orange
      glowColor: "rgba(251, 146, 60, 0.4)",
      tagline: "Domaina Ymaar"
    },
    Elysian: {
      name: "Elysian",
      blurb: "You act first and justify it after– usually by convincing yourself it was never a choice. Contrary to popular belief, it’s not actually power that you covet. You chase certainty, no matter the cost.",
      traits: { D: 2, R: 2, I: 5, T: 2, E: 5 },
      accentColor: "#fbbf24", // Premium Gold
      glowColor: "rgba(251, 191, 36, 0.4)",
      tagline: "Domaina Elysia"
    },
    Naphimai: {
      name: "Naphimai",
      blurb: "ERROR: WANTED SPECIES. DEAD OR ALIVE. You're the last of a species long believed to have gone extinct, and what exactly that means for you is something you don't fully understand yet. You are invaluable and inimical, all at once. Get ready to run.",
      traits: { D: 3, R: 1, I: 4, T: 1, E: 1 },
      accentColor: "#fda4af", // Soft rose gold
      glowColor: "rgba(253, 164, 175, 0.5)",
      tagline: "Domaina Naphemeia"
    }
  },

  questions: [
    {
      id: "ideal_superpower",
      question: "What is your ideal superpower?",
      answers: [
        { text: "Invisibility", species: "Heleion" },
        { text: "Healing", species: "Adrielite" },
        { text: "Illusion creation", species: "Elysian" },
        { text: "Precognition", species: "Kazandrian" }
      ]
    },
    {
      id: "childhood_tv",
      question: "What was your favourite childhood TV show?",
      answers: [
        { text: "Wild Kratts", species: "Heleion" },
        { text: "Battlestar Galactica (2004 reboot)", species: "Elysian" },
        { text: "Star Wars: The Clone Wars", species: "Kazandrian" },
        { text: "The 100", species: "Ymaari" }
      ]
    },
    {
      id: "creature_identity",
      question: "What creature do you most identify with?",
      answers: [
        { text: "Mermaid", species: "Adrielite" },
        { text: "Phoenix", species: "Elysian" },
        { text: "Sphinx", species: "Kazandrian" },
        { text: "Alien", species: "Ymaari" }
      ]
    },
    {
      id: "power_source",
      question: "Which power source feels most aligned with your beliefs?",
      answers: [
        { text: "Religion", species: "Heleion" },
        { text: "Science", species: "Elysian" },
        { text: "Magic", species: "Adrielite" },
        { text: "Spite", species: "Kazandrian" }
      ]
    },
    {
      id: "candy_aura",
      question: "What candy has the most aura?",
      answers: [
        { text: "Warheads", species: "Elysian" },
        { text: "Jawbreakers", species: "Ymaari" },
        { text: "Swedish Fish", species: "Adrielite" },
        { text: "Reese’s Peanut Butter Cups", species: "Heleion" }
      ]
    },
    {
      id: "meme_song",
      question: "What meme song lives in your head rent-free?",
      answers: [
        {
          text: "We Are Charlie Kirk",
          url: "https://www.youtube.com/watch?v=I0RC2Z-V1I0",
          audioUrl: "/audio-option-a.mp3",
          species: "Elysian"
        },
        {
          text: "Xue Hua Piao Piao",
          url: "https://www.youtube.com/watch?v=UFQkmCDa93o",
          audioUrl: "/audio-option-b.mp3",
          species: "Nephimai",
          override: true
        },
        {
          text: "Never Gonna Give You Up",
          url: "https://www.youtube.com/watch?v=dQw4w9WgXcQ",
          audioUrl: "/audio-option-c.mp3",
          species: "Kazandrian"
        },
        {
          text: "River Flows in You",
          url: "https://www.youtube.com/watch?v=fP0fQzvtzF0",
          audioUrl: "/audio-option-d.mp3",
          species: "Heleion"
        },
        {
          text: "Mundian To Bach Ke",
          url: "https://www.youtube.com/watch?v=x9WO2ieJMYk",
          audioUrl: "/audio-option-e.mp3",
          species: "Ymaari"
        }
      ]
    },
    {
      id: "proverb",
      question: "What proverb resonates with you the most?",
      answers: [
        { text: "Compassion is only virtuous when applied unilaterally.", species: "Adrielite" },
        { text: "We must create our own luck.", species: "Elysian" },
        { text: "A mouth that speaks wisdom is more powerful than a hand that wields a sword.", species: "Heleion" },
        { text: "Survival is a 4-letter word.", species: "Ymaari" }
      ]
    },
    {
      id: "injured_teammate",
      question: "Your teammate is hurt, your enemies are closing in, and only you can save them. What’s your next move?",
      answers: [
        { text: "Drag them into cover and burn your last resources to keep them breathing.", species: "Adrielite" },
        { text: "Get them to a safehouse, then launch a counterattack against your enemies.", species: "Kazandrian" },
        { text: "Abandon them — your safety is more important than theirs.", species: "Elysian" },
        { text: "Shield them as you manoeuvre to evade your would-be captors, without compromising the mission.", species: "Ymaari" }
      ]
    },
    {
      id: "hiding_room",
      question: "You're hiding from your enemies, waiting for the danger to pass. Which room calls to you?",
      display: "image-grid",
      answers: [
        {
          text: "Room A - Underground Cave",
          image: "/rooms/room-a.JPG",
          alt: "A warm, sandy stone cave bedroom with a low cream-coloured bed, looking out at a desert pool and a misty waterfall.",
          species: "Kazandrian"
        },
        {
          text: "Room B - Underwater Chamber",
          image: "/rooms/room-b.jpg",
          alt: "A sleek, blue-lit futuristic bedroom with a canopy bed facing a massive window view of a bioluminescent underwater city.",
          species: "Adrielite"
        },
        {
          text: "Room C - Industrial Sleeping Pod",
          image: "/rooms/room-c.JPG",
          alt: "A metallic, industrial spaceship sleeping pod with a messy bed and a window overlooking a rainy, neon cyberpunk city.",
          species: "Ymaari"
        },
        {
          text: "Room D - Forest Waterfall Suite",
          image: "/rooms/room-4.JPG",
          alt: "A dark stone bedroom with a low slate-blue bed and floor-to-ceiling glass showcasing a lush, cascading rainforest waterfall",
          species: "Heleion"
        }
      ]
    }
  ],

  tieBreakerQuestion: {
    id: "tie_breaker",
    trigger: "only_if_top_species_are_tied",
    question: "TIE-BREAKER DETECTED: Your entire civilization is under immediate threat. What matters most to you?",
    answers: [
      { text: "Using alliances and unity to garner support for your cause.", species: "Adrielite" },
      { text: "Calculating a path of absolute structural harmony that incurs no karmic or material fallout.", species: "Heleion" },
      { text: "Leaving no one behind, and rebuilding what you can from the ashes.", species: "Kazandrian" },
      { text: "Escaping, adapting, and reinventing yourself.", species: "Ymaari" },
      { text: "Expanding your influence before others can threaten you– you know better than to bleed in front of a shark.", species: "Elysian" }
    ]
  }
};
