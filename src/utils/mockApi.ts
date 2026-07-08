import type { GeneratedContent } from '../types';

export const generateContent = async (topic: string): Promise<GeneratedContent> => {
  // Simulate network delay
  await new Promise(resolve => setTimeout(resolve, 800));

  const lowerTopic = topic.toLowerCase();

  if (lowerTopic.includes('dot product')) {
    return {
      id: `sim-${Date.now()}`,
      topic,
      simulationType: 'dot-product',
      infographic: {
        title: "The Dot Product",
        keyConcept: "Measuring Directional Alignment",
        mainIdea: "The dot product tells us how much of one vector goes in the same direction as another vector.",
        importantFormula: "A · B = |A| |B| cos(θ)",
        visualExplanation: "Imagine pulling a cart. If you pull straight forward (0°), all your effort goes into moving it. If you pull sideways (90°), none of your effort moves the cart forward.",
        oneLineSummary: "Maximum at 0° (aligned), Zero at 90° (perpendicular).",
        keyTakeaway: "It represents projection and alignment in physics and math.",
        doYouKnow: "In video games, the dot product is used to check if a character is facing an enemy!",
        realLifeExample: "Calculating mechanical work: Work = Force · Distance"
      }
    };
  }

  if (lowerTopic.includes('pendulum') || lowerTopic.includes('oscillation')) {
    return {
      id: `sim-${Date.now()}`,
      topic,
      simulationType: 'pendulum',
      infographic: {
        title: "The Simple Pendulum",
        keyConcept: "Harmonic Motion & Energy Exchange",
        mainIdea: "A swinging pendulum constantly trades potential energy for kinetic energy, back and forth.",
        importantFormula: "T = 2π√(L/g)",
        visualExplanation: "At the highest point, it stops (zero kinetic energy) but has maximum height (max potential energy). At the bottom, it's moving fastest.",
        oneLineSummary: "Gravity restores the mass to the center, while momentum carries it past.",
        keyTakeaway: "The period depends ONLY on length and gravity, NOT the mass!",
        doYouKnow: "Foucault used a giant pendulum in 1851 to prove the Earth rotates.",
        realLifeExample: "Grandfather clocks use pendulum swings to keep precise time."
      }
    };
  }

  // Default / Unknown
  return {
    id: `sim-${Date.now()}`,
    topic,
    simulationType: 'unknown',
    infographic: {
      title: "Exploring Physics",
      keyConcept: "Understanding the Universe",
      mainIdea: "Physics helps us understand how the universe behaves through fundamental laws.",
      visualExplanation: "We observe phenomena, build models, and test them.",
      oneLineSummary: "Science is a systematic enterprise that builds and organizes knowledge.",
      keyTakeaway: "Keep asking 'Why?'",
      doYouKnow: "We currently don't have a specific simulation for this exact topic.",
      realLifeExample: "Everything around you!"
    }
  };
};
