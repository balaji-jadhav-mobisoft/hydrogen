import React from 'react';
import HomeBlogs from '../common/HomeBlogs';

const CoOpBlog = ({coOpBlog}) => {
  if (!coOpBlog) return null;
  const {blog} = coOpBlog;
  const {articles} = blog;
  const {edges} = articles;
  return (
    <div style={{marginTop: '50px'}}>
      <HomeBlogs
        homeBlogs={edges}
        reverseOrder={true}
        btnTitle={'Find out more'}
      />
    </div>
  );
};

export default CoOpBlog;
