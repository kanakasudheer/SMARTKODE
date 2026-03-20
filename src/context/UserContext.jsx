import React, { createContext, useState, useEffect } from 'react';
import { loadUserData, saveUserData, initializeUser } from '../utils/storage';
import { sfx } from '../utils/audioEngine';

export const UserContext = createContext();

export const BADGE_DEFS = {
  first_blood: { id: 'first_blood', name: 'First Blood', desc: 'Complete your first interaction in the Arena.', icon: '🩸' },
  combo_king: { id: 'combo_king', name: 'Combo King', desc: 'Achieve a 3x Combo streak in a single quiz run.', icon: '🔥' },
  speed_demon: { id: 'speed_demon', name: 'Speed Demon', desc: 'Answer correctly with more than 12s remaining.', icon: '⚡' },
  boss_slayer: { id: 'boss_slayer', name: 'Boss Slayer', desc: 'Defeat the Frontend Gauntlet boss mission.', icon: '🐉' },
  rich_hacker: { id: 'rich_hacker', name: 'Rich Hacker', desc: 'Accumulate over 500 Credits.', icon: '💰' }
};

export const UserProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    const saved = loadUserData();
    return {
      ...initializeUser(),
      ...saved,
      currency: saved?.currency || 0,
      badges: saved?.badges || [],
      shopPurchases: saved?.shopPurchases || [],
      activeColor: saved?.activeColor || 'indigo',
      crtMode: saved?.crtMode || false,
      lastLootDate: saved?.lastLootDate || null,
      skillPoints: saved?.skillPoints || 0,
      skills: saved?.skills || [],
      bossHealth: 100000, 
      dataShopUnlocked: saved?.dataShopUnlocked || false,
      atmosphere: 'void'
    };
  });
  
  const [leveledUp, setLeveledUp] = useState(false);
  const [newBadge, setNewBadge] = useState(null);

  useEffect(() => {
    saveUserData(user);
    if (user.currency >= 500) unlockBadge('rich_hacker');
  }, [user]);

  const loginUser = (username, avatar) => {
    sfx.levelUp();
    setUser(prev => ({
      ...prev,
      username,
      avatar,
      isLoggedIn: true,
      lastActiveDate: new Date().toDateString()
    }));
  };

  const logoutUser = () => {
    sfx.click();
    setUser(prev => ({ ...prev, isLoggedIn: false }));
  };

  const addXP = (amount) => {
    setUser(prev => {
      const multiplier = prev.skills.includes('xp_buff') ? 1.25 : 1;
      const boostedAmount = Math.round(amount * multiplier);
      const newXp = prev.xp + boostedAmount;
      const newLevel = Math.floor(newXp / 500) + 1;
      
      const leveled = newLevel > prev.level;
      if (leveled) {
        setLeveledUp(true);
        sfx.levelUp();
        setTimeout(() => setLeveledUp(false), 5000); 
      }

      return { 
        ...prev, 
        xp: newXp, 
        level: newLevel,
        skillPoints: leveled ? prev.skillPoints + 1 : prev.skillPoints 
      };
    });
  };

  const addCurrency = (amount) => {
    setUser(prev => ({ ...prev, currency: prev.currency + (prev.skills.includes('credit_buff') ? Math.round(amount * 1.5) : amount) }));
  };

  const unlockBadge = (badgeId) => {
    setUser(prev => {
      if (prev.badges.includes(badgeId)) return prev;
      setNewBadge(BADGE_DEFS[badgeId]);
      sfx.unlock();
      setTimeout(() => setNewBadge(null), 4000);
      return { ...prev, badges: [...prev.badges, badgeId] };
    });
  };

  const purchaseItem = (itemId, cost, type) => {
    if (user.currency >= cost && !user.shopPurchases.includes(itemId)) {
      sfx.unlock();
      setUser(prev => ({
        ...prev,
        currency: prev.currency - cost,
        shopPurchases: [...prev.shopPurchases, itemId],
        activeColor: type === 'color' ? itemId : prev.activeColor
      }));
      return true;
    }
    sfx.wrong();
    return false;
  };

  const equipColor = (color) => {
    if (user.shopPurchases.includes(color) || color === 'indigo') {
      sfx.click();
      setUser(prev => ({ ...prev, activeColor: color }));
    }
  };

  const completeMission = (missionId, topic) => {
    unlockBadge('first_blood');
    if (missionId === 'boss_1') unlockBadge('boss_slayer');
    
    setUser(prev => {
      if (prev.completedMissions.includes(missionId)) return prev;
      const isNewDay = prev.lastActiveDate !== new Date().toDateString();
      const newStreak = isNewDay ? prev.streak + 1 : prev.streak;
      return {
        ...prev,
        completedMissions: [...prev.completedMissions, missionId],
        streak: newStreak,
        lastActiveDate: new Date().toDateString(),
        weakTopics: prev.weakTopics.filter(t => t !== topic)
      };
    });
  };

  const toggleCRTMode = () => {
    sfx.click();
    setUser(prev => ({ ...prev, crtMode: !prev.crtMode }));
  };

  const addWeakTopic = (topic) => {
    setUser(prev => {
      if (!prev.weakTopics.includes(topic)) {
        return { ...prev, weakTopics: [...prev.weakTopics, topic] };
      }
      return prev;
    });
  };

  const unlockSkill = (skillId, cost) => {
    if (user.skillPoints >= cost && !user.skills.includes(skillId)) {
      sfx.unlock();
      setUser(prev => ({
        ...prev,
        skillPoints: prev.skillPoints - cost,
        skills: [...prev.skills, skillId]
      }));
      return true;
    }
    sfx.wrong();
    return false;
  };

  const damageBoss = (dmg) => {
    setUser(prev => ({ ...prev, bossHealth: Math.max(0, prev.bossHealth - dmg) }));
  };

  const updateAtmosphere = () => {
    const hour = new Date().getHours();
    let atmo = 'void';
    if (hour >= 5 && hour < 10) atmo = 'horizon';
    else if (hour >= 10 && hour < 17) atmo = 'solar';
    else if (hour >= 17 && hour < 21) atmo = 'sunset';
    else atmo = 'midnight';
    setUser(prev => ({ ...prev, atmosphere: atmo }));
  };

  useEffect(() => {
    updateAtmosphere();
  }, [user.isLoggedIn]);

  return (
    <UserContext.Provider value={{ 
      user, addXP, addCurrency, completeMission, addWeakTopic, setUser, loginUser, logoutUser, leveledUp,
      unlockBadge, newBadge, purchaseItem, equipColor, toggleCRTMode, unlockSkill, damageBoss
    }}>
      {children}
    </UserContext.Provider>
  );
};
