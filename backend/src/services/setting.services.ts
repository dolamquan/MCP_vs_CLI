export interface AppSettings {
    defaultModelId: string;
    defaultExportFormat: "json" | "csv";
    saveHistory: boolean;
    enableCliExecution: boolean;
    enableMCPExecution: boolean;
    MaxHistoryItems: number; // New setting for maximum history items
}

let appSettings: AppSettings = {
    defaultModelId: "gpt-4.1-mini",
    defaultExportFormat: "json",
    saveHistory: true,
    enableCliExecution: true,
    enableMCPExecution: true,
    MaxHistoryItems: 100 // Default value for maximum history items
};

export const getAppSettings = (): AppSettings => {
    return appSettings;
};


//Partial: This utility type allows us to create a new type where all properties of AppSettings are optional. This is useful for the updateAppSettings function, where we only want to update specific settings without needing to provide all of them.
export const updateAppSettings = (
    updates: Partial<AppSettings>
): AppSettings => {
    appSettings = { ...appSettings, ...updates };
    return appSettings;
};

