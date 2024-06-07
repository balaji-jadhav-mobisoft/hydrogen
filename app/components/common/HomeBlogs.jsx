import {Image} from '@shopify/hydrogen';
import React, {useEffect, useState} from 'react';
import './homeBlogs.css';
import AppButton from './AppButton';

const HomeBlogs = ({homeBlogs, reverseOrder = false, btnTitle}) => {
  if (!homeBlogs) return null;
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);
  return (
    <div>
      {homeBlogs?.map((blog) => (
        <div
          key={blog.node.title}
          className={`home-blog-container ${
            reverseOrder ? 'reverse' : 'reverse-blog'
          }`}
        >
          <div className=" blog-content">
            <p
              dangerouslySetInnerHTML={{
                __html: isClient ? blog.node.contentHtml : '',
              }}
            ></p>
            <AppButton btnClassName={'our-farm-btn'} title={btnTitle} />
          </div>
          <Image
            alt="blog image"
            aria-label="Blog image"
            className={`blog-image`}
            src={blog.node.image.url}
            data={blog.node.image.url}
            sizes="(max-width: 600px) 100vw, 50vw"
          />
        </div>
      ))}
    </div>
  );
};

export default HomeBlogs;
