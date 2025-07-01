export const formatMessageDateTime = (created_at: string): string => {
  const date = new Date(created_at);
  if (!isNaN(date.getTime())) {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    const hours = String(date.getHours()).padStart(2, '0');
    const minutes = String(date.getMinutes()).padStart(2, '0');
    return `${year}-${month}-${day} ${hours}:${minutes}`;
  }
  return created_at;
};

export const autoLinkUrls = (text: string): string => {
  return text.replace(/(https?:\/\/[^\s]+)/g, (url) => {
    if (/\]\([^)]+$/.test(url)) return url;
    return `[${url}](${url})`;
  });
};
