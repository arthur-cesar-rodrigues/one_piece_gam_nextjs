'use client';

import { useGameManager } from '../hooks/gameManager';
import Character from './Character';

export default function Game() {
  const {
    hero,
    villain,
    handleHeroAction,
    isHeroTurn,
    logs,
    gameOver,
    resetGame
  } = useGameManager();

  return (
    <div className="game-container">
      <h1>Batalha Épica: {hero.name} vs {villain.name}</h1>

      {gameOver && (
        <div className="game-over">
          <h2>{gameOver}</h2>
          <button onClick={resetGame}>Jogar Novamente</button>
        </div>
      )}

      <div className="battle-area">
        <Character 
          data={hero} 
          isHero={true} 
          onAction={handleHeroAction} 
          isHeroTurn={isHeroTurn} 
        />

        <div className="vs">VS</div>

        <Character 
          data={villain} 
          isHero={false} 
          isHeroTurn={isHeroTurn} 
        />
      </div>

      <div className="log-container">
        <h3>Histórico de Batalha</h3>
        <div className="log-content">
          {logs.map((log, index) => (
            <div key={index} className="log-entry">{log}</div>
          ))}
        </div>
      </div>
    </div>
  );
}

