export const getCleanUrl = (url: string) => {
  if (!url) return "";
  return url.replace("http://", "").replace("https://", "").replace("www.", "");
};
