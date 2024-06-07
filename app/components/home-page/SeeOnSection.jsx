import React from 'react';
import './seeOnSection.css';
import ForbLogo from '~/assets/forbes-logo.webp';
import FoodNetworkLogo from '../../assets/food_network_logo.webp';
import CivilEatLogo from '../../assets/civil_eat_logo.webp';
import GoopLogo from '../../assets/goop_logo.webp';
import BulletProofLogo from '../../assets/bulletproof_Logo.webp';
import SeeMoreLogo from '../../assets/see_more.webp';

const logos = [
  {src: ForbLogo, alt: 'Forbes Logo'},
  {src: FoodNetworkLogo, alt: 'Food Network Logo'},
  {src: CivilEatLogo, alt: 'Civil Eats Logo'},
  {src: GoopLogo, alt: 'Goop Logo'},
  {src: BulletProofLogo, alt: 'Bulletproof Logo'},
  {src: SeeMoreLogo, alt: 'See More Logo'},
];

const SeeOnSection = () => {
  return (
    <div className="logos-section">
      {logos.map((logo, index) => (
        <img aria-label='See On Image'
          key={index}
          className="logo-image"
          src={logo.src}
          data={logo.src}
          alt={logo.alt}
          sizes="(max-width: 600px) 100vw, 50vw"
        />
      ))}
    </div>
  );
};

export default SeeOnSection;
