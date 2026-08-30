import type { Story } from "../storyTypes";
import { stories as beginnerLifeInChina } from "./beginner-life-in-china";

const storyModules: Story[][] = [beginnerLifeInChina];

export const stories: Story[] = storyModules.flat();

export function getStory(slug: string): Story | undefined {
  return stories.find((s) => s.slug === slug);
}
