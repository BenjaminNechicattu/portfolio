// This file is no longer needed as blogs are fetched dynamically
// The total count is now stored in count.txt
export const BLOG_COUNT_URL = {
  local: '/src/data/blogs/count.txt',
  remote: 'https://raw.githubusercontent.com/BenjaminNechicattu/portfolio/main/src/data/blogs/count.txt'
};

export const getBlogUrl = (blogId: number, isLocal: boolean = false) => {
  return isLocal 
    ? `/src/data/blogs/${blogId}.json`
    : `https://raw.githubusercontent.com/BenjaminNechicattu/portfolio/main/src/data/blogs/${blogId}.json`;
};