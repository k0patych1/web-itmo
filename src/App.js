import {useEffect, useState} from 'react';
import bridge from '@vkontakte/vk-bridge';
import {ScreenSpinner, SplitCol, SplitLayout, View} from '@vkontakte/vkui';
import {useActiveVkuiLocation} from '@vkontakte/vk-mini-apps-router';

import {Home, Persik} from './panels';
import {DEFAULT_VIEW_PANELS} from './routes';

export const App = () => {
  const { panel: activePanel = DEFAULT_VIEW_PANELS.HOME } = useActiveVkuiLocation();
  const [fetchedUser, setUser] = useState();
  const [popout, setPopout] = useState(<ScreenSpinner size="large" />);

  const openStoryEditor = async () => {
    try {
      const response = await fetch('https://api.unsplash.com/photos/random?client_id=-Rfz13PB4gekk53Uqz9XTkhSbPYpbIOZw47NVULs-OU')
      const data = await response.json();
      const imageUrl = data.urls?.regular;
      await bridge.send('VKWebAppShowStoryBox', {
        background_type: 'image',
        url: imageUrl,
      })

    } catch (error) {
      console.error('Error opening story editor:', error);
    }
  };

  useEffect(() => {
    async function fetchData() {
      const user = await bridge.send('VKWebAppGetUserInfo');
      setUser(user);
      setPopout(null);
    }
    fetchData();
  }, []);

  return (
      <SplitLayout popout={popout}>
        <SplitCol>
          <View activePanel={activePanel}>
            <Home id="home" fetchedUser={fetchedUser} openStoryEditor={openStoryEditor} />
            <Persik id="persik" />
          </View>
        </SplitCol>
      </SplitLayout>
  );
};