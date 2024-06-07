import React from 'react';
import HomeBlogs from '../common/HomeBlogs';

const PowerOfCoOpBlog = ({thePowerOfCoOpBlog}) => {
  if (!thePowerOfCoOpBlog) return null;
  const {blog} = thePowerOfCoOpBlog;
  const {articles} = blog;
  const {edges} = articles;
  return (
    <div>
      <HomeBlogs homeBlogs={edges} btnTitle={'Our Farms'} />
    </div>
  );
};

export default PowerOfCoOpBlog;
