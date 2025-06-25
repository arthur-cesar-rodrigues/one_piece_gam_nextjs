import { useState } from "react";

const villainsList = [
  { name: 'Buggy, o Palhaço', life: 80, maxLife: 80, image: '/sprites/buggy.png' },
  { name: 'Crocodile', life: 100, maxLife: 100, image: '/sprites/crocodile.png' },
  { name: 'Enel', life: 120, maxLife: 120, image: '/sprites/enel.png' },
  { name: 'Rob Lucci', life: 140, maxLife: 140, image: '/sprites/lucci.png' },
  { name: 'Donquixote Doflamingo', life: 160, maxLife: 160, image: '/sprites/doflamingo.png' },
  { name: 'Kaido das Cem Feras', life: 200, maxLife: 200, image: '/sprites/kaido.png' },
];

const initialHero = { 
  name: 'Monkey D. Luffy',
  life: 150,
  maxLife: 150,
  potions: 3,
  isDefending: false,
  damage: 0,       // Inicializa o dano como 0
  image: '/sprites/luffy.png'
};

export function useGameManager() {
  const [hero, setHero] = useState(initialHero);
  const [currentVillainIndex, setCurrentVillainIndex] = useState(0);
  const [villain, setVillain] = useState({...villainsList[0], damage: 0});
  const [isHeroTurn, setIsHeroTurn] = useState(true);
  const [logs, setLogs] = useState([]);
  const [gameOver, setGameOver] = useState(null);

  const addLog = (message) => {
    setLogs(prev => [...prev, message]);
  };

  // Função para modificar vida e setar dano recebido
  const modifyLife = (target, amount, damage = 0) => {
    const setter = target === "hero" ? setHero : setVillain;
    setter(prev => ({ 
      ...prev,  
      life: Math.max(0, Math.min(prev.maxLife, prev.life + amount)),
      damage: damage
    }));

    // Limpar dano após 700ms (tempo da animação do dano flutuante)
    setTimeout(() => {
      setter(prev => ({ ...prev, damage: 0 }));
    }, 700);
  };

  const checkGameOver = () => {
    if (hero.life <= 0) {
      setGameOver("Você foi derrotado!");
      return true;
    } else if (villain.life <= 0) {
      if (currentVillainIndex < villainsList.length - 1) {
        addLog(`Você derrotou ${villain.name}! Próxima luta chegando...`);

        const nextIndex = currentVillainIndex + 1;
        setTimeout(() => {
          setCurrentVillainIndex(nextIndex);
          setVillain({ ...villainsList[nextIndex], isDefending: false, damage: 0 });
          setHero(prev => ({
            ...prev,
            life: prev.maxLife,
            isDefending: false,
            damage: 0
          }));
          setIsHeroTurn(true);
        }, 1500);
      } else {
        setGameOver("Parabéns! Você derrotou todos os vilões e se tornou o Rei dos Piratas! 🏴‍☠️👑");
      }
      return true;
    }
    return false;
  };

  const resetGame = () => {
    setHero(initialHero);
    setCurrentVillainIndex(0);
    setVillain({...villainsList[0], damage: 0});
    setIsHeroTurn(true);
    setLogs([]);
    setGameOver(null);
  };

  const handleHeroAction = (action) => {
    if (!isHeroTurn || gameOver) return;

    switch(action) {
      case "attack": {
        const damage = Math.floor(Math.random() * 15) + 10;
        modifyLife("villain", -damage, damage);
        addLog(`${hero.name} atacou ${villain.name} causando ${damage} de dano!`);
        break;
      }

      case "defense":
        setHero(prev => ({ ...prev, isDefending: true }));
        addLog(`${hero.name} está se defendendo!`);
        break;

      case "usePotion":
        if (hero.potions > 0) {
          const heal = Math.floor(Math.random() * 20) + 15;
          modifyLife("hero", heal); // cura, não é dano, então damage fica 0 por padrão
          setHero(prev => ({ ...prev, potions: prev.potions - 1 }));
          addLog(`${hero.name} usou uma poção e recuperou ${heal} de vida!`);
        } else {
          addLog("Sem poções disponíveis!");
          return;
        }
        break;

      case "flee":
        if (Math.random() < 0.3) {
          addLog(`${hero.name} fugiu da batalha!`);
          setGameOver("Você fugiu!");
          return;
        } else {
          addLog("Falha ao tentar fugir!");
        }
        break;
    }

    setIsHeroTurn(false);

    if (!checkGameOver()) {
      setTimeout(() => {
        villainTurn();
        setIsHeroTurn(true);
      }, 1500);
    }
  };

  const villainTurn = () => {
    if (gameOver) return;

    const actions = ['attack', 'attack', 'defense'];
    const action = actions[Math.floor(Math.random() * actions.length)];

    switch(action) {
      case 'attack': {
        const damage = Math.floor(Math.random() * 12) + 8;
        const isHeroDefending = hero.isDefending;
        const finalDamage = isHeroDefending ? Math.floor(damage * 0.5) : damage;
        modifyLife("hero", -finalDamage, finalDamage);
        addLog(`${villain.name} atacou ${hero.name} causando ${finalDamage} de dano${isHeroDefending ? ' (defendido)' : ''}!`);
        break;
      }

      case 'defense':
        setVillain(prev => ({...prev, isDefending: true }));
        addLog(`${villain.name} está se defendendo!`);
        break;
    }

    setHero(prev => ({...prev, isDefending: false}));
    checkGameOver();
  };

  return {
    hero,
    villain,
    handleHeroAction,
    isHeroTurn,
    logs,
    gameOver,
    resetGame
  };
}
