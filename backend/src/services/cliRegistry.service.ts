import path from "path";
import {
  CliProfile,
  CliProfilesFile,
  CliRules
} from "../types/registry.types";
import { readJsonFile, writeJsonFile } from "./jsonFile.service";

const CLI_RULES_PATH =
  process.env.CLI_RULES_PATH ||
  path.join(process.cwd(), "config", "cli-rules.json");

const CLI_PROFILES_PATH =
  process.env.CLI_PROFILES_PATH ||
  path.join(process.cwd(), "config", "cli-profiles.json");

const fallbackCliRules: CliRules = {
  allowedCommands: ["node", "npm", "npx", "git"],
  blockedCommands: ["rm", "del", "format", "shutdown", "reboot", "sudo"],
  blockedPatterns: ["rm -rf", "&&", "||", ";", "|"],
  maxCommandLength: 300,
  executionTimeoutMs: 10000
};

const fallbackCliProfiles: CliProfilesFile = {
  profiles: []
};

export const getCliRules = (): CliRules => {
  return readJsonFile<CliRules>(CLI_RULES_PATH, fallbackCliRules);
};

export const updateCliRules = (updates: Partial<CliRules>): CliRules => {
  const current = getCliRules();

  const nextRules: CliRules = {
    ...current,
    ...updates
  };

  return writeJsonFile<CliRules>(CLI_RULES_PATH, nextRules);
};

export const getCliProfilesFile = (): CliProfilesFile => {
  return readJsonFile<CliProfilesFile>(
    CLI_PROFILES_PATH,
    fallbackCliProfiles
  );
};

export const listCliProfiles = (): CliProfile[] => {
  return getCliProfilesFile().profiles;
};

export const addCliProfile = (profile: CliProfile): CliProfile => {
  const file = getCliProfilesFile();

  const exists = file.profiles.some((item) => item.id === profile.id);

  if (exists) {
    throw new Error(`CLI profile already exists: ${profile.id}`);
  }

  file.profiles.push(profile);
  writeJsonFile<CliProfilesFile>(CLI_PROFILES_PATH, file);

  return profile;
};

export const updateCliProfile = (
  profileId: string,
  updates: Partial<CliProfile>
): CliProfile => {
  const file = getCliProfilesFile();

  const index = file.profiles.findIndex((profile) => profile.id === profileId);

  if (index === -1) {
    throw new Error(`CLI profile not found: ${profileId}`);
  }

  const updatedProfile: CliProfile = {
    ...file.profiles[index],
    ...updates,
    id: profileId
  };

  file.profiles[index] = updatedProfile;
  writeJsonFile<CliProfilesFile>(CLI_PROFILES_PATH, file);

  return updatedProfile;
};

export const deleteCliProfile = (profileId: string): void => {
  const file = getCliProfilesFile();

  const nextProfiles = file.profiles.filter(
    (profile) => profile.id !== profileId
  );

  if (nextProfiles.length === file.profiles.length) {
    throw new Error(`CLI profile not found: ${profileId}`);
  }

  writeJsonFile<CliProfilesFile>(CLI_PROFILES_PATH, {
    profiles: nextProfiles
  });
};