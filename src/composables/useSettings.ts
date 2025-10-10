import { ref, onMounted, Ref } from 'vue';
import axios from 'axios';

interface Settings {
  blog_title: string;
  footer_text: string;
}

export function useSettings() {
  const settings: Ref<Settings> = ref<Settings>({ blog_title: '', footer_text: '' });

  const fetchSettings = async () => {
    try {
      const { data } = await axios.get<Settings>('/api/settings');
      settings.value = data;
    } catch (error) {
      console.error('Error fetching settings:', error);
    }
  };

  const updateSettings = async (newSettings: Settings) => {
    try {
      await axios.put('/api/settings', newSettings);
    } catch (error) {
      console.error('Error updating settings:', error);
    }
  };

  onMounted(fetchSettings);

  return {
    settings,
    fetchSettings,
    updateSettings,
  };
}
