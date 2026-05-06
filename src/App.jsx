import { useEffect } from 'react';
import { useStore } from './store/useStore';
import { restoreSession, startSync } from './lib/matrix';

import LoginScreen from './screens/Login';
import HomeScreen from './screens/Home';
import ChatScreen from './screens/Chat';
import { CirclesScreen, CircleDetailScreen } from './screens/Circles';
import GeneScreen from './screens/Gene';
import SearchScreen from './screens/Search';
import ProfileScreen from './screens/Profile';
import TrustGraphScreen from './screens/TrustGraph';

import BottomNav from './components/BottomNav';
import ActionSheet from './components/ActionSheet';

import './styles/tokens.css';
import './App.css';

export default function App() {
  const { loggedIn, setLoggedIn, setRooms, appendMessage, screen } = useStore();

  useEffect(() => {
    (async () => {
      try {
        const client = await restoreSession();
        if (!client) return;
        await startSync((event, room) => {
          if (['m.room.message','xyz.mychat.action','xyz.mychat.receipt'].includes(event.getType())) {
            appendMessage(room.roomId, event);
          }
        });
        setRooms(client.getRooms());
        setLoggedIn(client.getUserId());
      } catch (e) {
        console.warn('Session restore failed:', e.message);
      }
    })();
  }, []);

  if (!loggedIn) return <LoginScreen />;

  const showNav = !['chat','circle'].includes(screen);

  return (
    <div className="app">
      <div className="screen-wrap">
        {screen === 'home'    && <HomeScreen />}
        {screen === 'chat'    && <ChatScreen />}
        {screen === 'circles' && <CirclesScreen />}
        {screen === 'circle'  && <CircleDetailScreen />}
        {screen === 'mygene'  && <GeneScreen />}
        {screen === 'search'  && <SearchScreen />}
        {screen === 'profile'     && <ProfileScreen />}
        {screen === 'trust-graph' && <TrustGraphScreen />}
      </div>
      {showNav && <BottomNav />}
      <ActionSheet />
    </div>
  );
}
