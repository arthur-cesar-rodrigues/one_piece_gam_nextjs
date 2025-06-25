'use client';

import { useEffect, useState } from 'react';

export default function Character({ data, isHero, onAction, isHeroTurn, damage = 0 }) {
  const lifePercent = Math.max(0, (data.life / data.maxLife) * 100) + '%';
  const [showDamage, setShowDamage] = useState(false);

  useEffect(() => {
    if (damage !== 0) {
      setShowDamage(true);
      const timer = setTimeout(() => setShowDamage(false), 700);
      return () => clearTimeout(timer);
    }
  }, [damage]);

  return (
    <div className={`character ${isHero ? 'hero' : 'villain'}`} style={{ position: 'relative' }}>
      <h2>{data.name}</h2>

      <div className="life-bar">
        <div
          className="life-fill"
          style={{
            width: lifePercent,
            backgroundColor: data.life < 30 ? 'red' : isHero ? '#4CAF50' : '#f44336'
          }}
        ></div>
        <span className="life-text">{data.life}/{data.maxLife}</span>
      </div>

      <div className="sprite">
        <img 
            src={data.image} 
            alt={data.name} 
            width="400"  
            height="400"
        />
      </div>

      {/* Dano flutuante */}
      {showDamage && (
        <div
          className="damage-float"
          style={{ color: damage > 0 ? 'red' : 'green' }}
        >
          {(damage > 0 ? '-' : '+') + Math.abs(damage)}
        </div>
      )}

      {isHero && onAction && (
        <div className="actions">
          <button 
            disabled={!isHeroTurn}
            onClick={() => onAction("attack")}
            className="action-btn attack"
          >
            Atacar
          </button>
          <button 
            disabled={!isHeroTurn}
            onClick={() => onAction("defense")}
            className="action-btn defense"
          >
            Defender
          </button>
          <button 
            disabled={!isHeroTurn || data.potions <= 0}
            onClick={() => onAction("usePotion")}
            className="action-btn potion"
          >
            Poção ({data.potions})
          </button>
          <button 
            disabled={!isHeroTurn}
            onClick={() => onAction("flee")}
            className="action-btn flee"
          >
            Fugir
          </button>
        </div>
      )}
    </div>
  );
}
