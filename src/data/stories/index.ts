import type { Story } from "../storyTypes";
import { stories as beginnerLifeInChina } from "./beginner-life-in-china";
import { stories as dailyAdventures } from "./daily-adventures";
import { stories as cityLife } from "./city-life";
import { stories as reflections } from "./reflections";

const storyModules: Story[][] = [
  beginnerLifeInChina,
  dailyAdventures,
  cityLife,
  reflections,
];

export const stories: Story[] = storyModules.flat();

export function getStory(slug: string): Story | undefined {
  return stories.find((s) => s.slug === slug);
}
