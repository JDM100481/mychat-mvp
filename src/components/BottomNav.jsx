import { useStore } from '../store/useStore';
import { IconChats, IconCircles, IconGene, IconProfile, IconPlus } from './Icons';
import './BottomNav.css';

export default function BottomNav() {
  const { activeTab, setTab, navigate, openSheet } = useStore();

  function go(tab, screen) {
    setTab(tab);
    navigate(screen);
  }

  return (
    <nav className="bnav">
      <button className={`ntab ${activeTab === 'chats' ? 'active' : ''}`} onClick={() => go('chats', 'home')}>
        <IconChats active={activeTab === 'chats'} />
        <span>Chats</span>
      </button>
      <button className={`ntab ${activeTab === 'circles' ? 'active' : ''}`} onClick={() => go('circles', 'circles')}>
        <IconCircles active={activeTab === 'circles'} />
        <span>Circles</span>
      </button>
      <button className="nfab" onClick={openSheet}>
        <IconPlus />
      </button>
      <button className={`ntab ${activeTab === 'mygene' ? 'active' : ''}`} onClick={() => go('mygene', 'mygene')}>
        <IconGene active={activeTab === 'mygene'} />
        <span>myGENE</span>
      </button>
      <button className={`ntab ${activeTab === 'profile' ? 'active' : ''}`} onClick={() => go('profile', 'profile')}>
        <IconProfile active={activeTab === 'profile'} />
        <span>Profile</span>
      </button>
    </nav>
  );
}
