import {Image} from '@shopify/hydrogen';
import React from 'react';
import './newRecipesBlog.css';
import {Link} from '@remix-run/react';
import AppButton from '../common/AppButton';
const NewRecipesBlog = ({newRecipesBlog}) => {
  if (!newRecipesBlog) return null;
  const {blog} = newRecipesBlog;
  const {articles} = blog;
  const {edges} = articles;

  return (
    <div>
      <header className="home-page-title">
        <h3 className="h2">{blog.title}</h3>
      </header>
      <div className="recipes-container">
        {edges.map((recipe, index) => {
          return (
            <div key={index} className="recipe-section">
              <Link
                aria-label={`Shop ${recipe.node.title}`}
                to={`/blogs/${blog.handle}/${recipe.node.handle}`}
                className="recipe-image-link"
              >
                <Image
                  alt="recipe image"
                  aria-label="Recipe Image"
                  className={`recipe-image`}
                  src={recipe.node.image.url}
                  data={recipe.node.image.url}
                  sizes="(max-width: 600px) 100vw, 50vw"
                />{' '}
              </Link>
              <Link
                to={`/blogs/${blog.handle}/${recipe.node.handle}`}
                aria-label={`Shop ${recipe.node.title}`}
                className="recipe-title-link"
              >
                <h3 className="recipe-title">{recipe.node.title}</h3>
              </Link>
              <Link
                aria-label={`Shop ${recipe.node.title}`}
                to={`/blogs/${blog.handle}/${recipe.node.handle}`}
                // className="recipe-title-link"
              >
                <AppButton
                  title={'READ MORE'}
                  btnClassName={'new-recipe-read-more-button'}
                />
              </Link>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default NewRecipesBlog;
