import React, { useEffect, useState } from 'react';

const FloatingParticles = ({ count = 50 }) => {
  const [particles, setParticles] = useState([]);

  useEffect(() => {
    const newParticles = [];
    for (let i = 0; i < count; i++) {
      newParticles.push({
        id: i,
        left: Math.random() * 100,
        animationDelay: Math.random() * 6,
        animationDuration: 4 + Math.random() * 4,
      });
    }
    setParticles(newParticles);
  }, [count]);

  return (
    <div className="floating-particles">
      {particles.map((particle) => (
        <div
          key={particle.id}
          className="particle"
          style={{
            left: `${particle.left}%`,
            animationDelay: `${particle.animationDelay}s`,
            animationDuration: `${particle.animationDuration}s`,
          }}
        />
      ))}
    </div>
  );
};

export default FloatingParticles;
