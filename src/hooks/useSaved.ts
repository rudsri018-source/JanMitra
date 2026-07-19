import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import type { SavedItem } from '../types';
import { useAuth } from '../context/AuthContext';

export function useSavedItems() {
  const { user } = useAuth();
  const [savedItems, setSavedItems] = useState<SavedItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) {
      setSavedItems([]);
      setLoading(false);
      return;
    }
    supabase
      .from('saved_items')
      .select('*')
      .eq('user_id', user.id)
      .order('created_at', { ascending: false })
      .then(({ data, error }) => {
        if (!error && data) setSavedItems(data as SavedItem[]);
        setLoading(false);
      });
  }, [user]);

  const isSaved = (itemType: string, itemId: string) =>
    savedItems.some((s) => s.item_type === itemType && s.item_id === itemId);

  const toggleSave = async (itemType: string, itemId: string, itemTitle: string) => {
    if (!user) return;
    const existing = savedItems.find((s) => s.item_type === itemType && s.item_id === itemId);
    if (existing) {
      await supabase.from('saved_items').delete().eq('id', existing.id);
      setSavedItems((prev) => prev.filter((s) => s.id !== existing.id));
    } else {
      const { data } = await supabase
        .from('saved_items')
        .insert({ user_id: user.id, item_type: itemType, item_id: itemId, item_title: itemTitle })
        .select()
        .single();
      if (data) setSavedItems((prev) => [data as SavedItem, ...prev]);
    }
  };

  return { savedItems, loading, isSaved, toggleSave };
}

export function useRecentlyViewed() {
  const [recent, setRecent] = useState<{ type: string; id: string; title: string; slug: string }[]>([]);

  useEffect(() => {
    const stored = localStorage.getItem('janmitra_recent');
    if (stored) {
      try {
        setRecent(JSON.parse(stored));
      } catch {
        // ignore
      }
    }
  }, []);

  const addRecent = (type: string, id: string, title: string, slug: string) => {
    setRecent((prev) => {
      const filtered = prev.filter((r) => r.id !== id);
      const updated = [{ type, id, title, slug }, ...filtered].slice(0, 8);
      localStorage.setItem('janmitra_recent', JSON.stringify(updated));
      return updated;
    });
  };

  return { recent, addRecent };
}
