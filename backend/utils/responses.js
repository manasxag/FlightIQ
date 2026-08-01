export const sendSuccess = (response, data, meta) => {
  response.json({ success: true, data, ...(meta ? { meta } : {}) });
};
