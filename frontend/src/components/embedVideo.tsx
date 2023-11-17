const embedVideoUrl = (url: string) => {
  const youtubeEmbededUrl = 'https://www.youtube.com/embed/';

  const urlSplit = url.split('/');
  let id = urlSplit[urlSplit.length - 1];

  if (id?.includes('watch')) {
    const idSplit = id.split('=');
    id = idSplit[idSplit.length - 1];
  }

  return youtubeEmbededUrl + id;
};

export default embedVideoUrl;
