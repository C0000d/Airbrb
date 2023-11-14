const embedVideoUrl = (url: string) => {
  const youtubeEmbededUrl = 'https://www.youtube.com/embed/';

  const urlSplit = url.split('/');
  const id = urlSplit[urlSplit.length - 1];

  return youtubeEmbededUrl + id;
};

export default embedVideoUrl;
