import { ref } from 'vue';
import type { Series } from '../data/posts';

export function useSeries() {
  const series = ref<Series[]>([]);
  const activeSeriesTab = ref<'list' | 'create' | 'edit'>('list');
  const selectedSeries = ref<Series | null>(null);

  const fetchSeries = async () => {
    try {
      const res = await fetch('/api/series');
      series.value = await res.json();
    } catch (error) {
      console.error('Failed to fetch series:', error);
    }
  };

  const handleCreateNewSeries = () => {
    selectedSeries.value = null;
    activeSeriesTab.value = 'create';
  };

  const handleEditSeries = (seriesItem: Series) => {
    selectedSeries.value = seriesItem;
    activeSeriesTab.value = 'edit';
  };

  const handleDeleteSeries = async (id: string) => {
    if (confirm('Are you sure you want to delete this series?')) {
      await fetch(`/api/series/${id}`, { method: 'DELETE' });
      fetchSeries(); // Refresh list
    }
  };

  const handleSubmitSeries = async (seriesData: any) => {
    const isEditing = !!selectedSeries.value?.id;
    const url = isEditing ? `/api/series/${selectedSeries.value!.id}` : '/api/series';
    const method = isEditing ? 'PUT' : 'POST';

    await fetch(url, {
      method,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(seriesData),
    });

    fetchSeries(); // Refresh list
    activeSeriesTab.value = 'list';
  };

  const handleCancelSeries = () => {
    activeSeriesTab.value = 'list';
  };

  return {
    series,
    activeSeriesTab,
    selectedSeries,
    fetchSeries,
    handleCreateNewSeries,
    handleEditSeries,
    handleDeleteSeries,
    handleSubmitSeries,
    handleCancelSeries,
  };
}
