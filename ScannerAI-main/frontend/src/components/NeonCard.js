import React from 'react';
import { useNavigate } from 'react-router-dom';

const NeonCard = ({ 
  title, 
  description, 
  icon: Icon, 
  color = 'blue', 
  path, 
  className = '' 
}) => {
  const navigate = useNavigate();

  const colorClasses = {
    blue: 'neon-glow-blue border-neon-blue hover:bg-neon-blue/10',
    yellow: 'neon-glow-yellow border-neon-yellow hover:bg-neon-yellow/10',
    green: 'neon-glow-green border-neon-green hover:bg-neon-green/10',
    purple: 'neon-glow-purple border-purple-500 hover:bg-purple-500/10'
  };

  const iconColorClasses = {
    blue: 'text-neon-blue',
    yellow: 'text-neon-yellow',
    green: 'text-neon-green',
    purple: 'text-purple-500'
  };

  const handleClick = () => {
    if (path) {
      navigate(path);
    }
  };

  return (
    <div
      className={`
        glass rounded-xl p-6 cursor-pointer transition-all duration-300
        card-hover border-2 ${colorClasses[color]}
        ${className}
      `}
      onClick={handleClick}
    >
      <div className="flex flex-col items-center text-center space-y-4">
        {Icon && (
          <div className={`${iconColorClasses[color]} text-4xl animate-pulse-slow`}>
            <Icon size={48} />
          </div>
        )}
        <h3 className="text-xl font-semibold text-white">
          {title}
        </h3>
        <p className="text-gray-300 text-sm leading-relaxed">
          {description}
        </p>
      </div>
    </div>
  );
};

export default NeonCard;


