export const ipcAPI = (window as any).electronAPI;

// Generic helper
export const invokeIPC = async <T>(channel: string, data?: any): Promise<T> => {
  if (!ipcAPI) {
    console.warn(`IPC not available, channel: ${channel}`);
    return null as any;
  }
  return await ipcAPI.invoke(channel, data);
};
