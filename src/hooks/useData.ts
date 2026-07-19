import { useEffect, useState } from 'react';
import { supabase } from '../lib/supabase';
import type { Scheme, Scholarship, CitizenService, Policy, Blog, Notification, Category, State, District, Ministry, DocumentMaster, DataSyncJob } from '../types';

export function useSchemes() {
  const [schemes, setSchemes] = useState<Scheme[]>([]);
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    supabase
      .from('schemes')
      .select('*')
      .eq('published', true)
      .order('created_at', { ascending: false })
      .then(({ data, error }) => {
        if (!error && data) setSchemes(data as Scheme[]);
        setLoading(false);
      });
  }, []);
  return { schemes, loading };
}

export function useScheme(slug: string | undefined) {
  const [scheme, setScheme] = useState<Scheme | null>(null);
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    if (!slug) {
      setLoading(false);
      return;
    }
    supabase
      .from('schemes')
      .select('*')
      .eq('slug', slug)
      .eq('published', true)
      .maybeSingle()
      .then(({ data, error }) => {
        if (!error) setScheme(data as Scheme | null);
        setLoading(false);
      });
  }, [slug]);
  return { scheme, loading };
}

export function useScholarships() {
  const [items, setItems] = useState<Scholarship[]>([]);
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    supabase
      .from('scholarships')
      .select('*')
      .eq('published', true)
      .order('created_at', { ascending: false })
      .then(({ data, error }) => {
        if (!error && data) setItems(data as Scholarship[]);
        setLoading(false);
      });
  }, []);
  return { scholarships: items, loading };
}

export function useScholarship(slug: string | undefined) {
  const [item, setItem] = useState<Scholarship | null>(null);
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    if (!slug) {
      setLoading(false);
      return;
    }
    supabase
      .from('scholarships')
      .select('*')
      .eq('slug', slug)
      .eq('published', true)
      .maybeSingle()
      .then(({ data, error }) => {
        if (!error) setItem(data as Scholarship | null);
        setLoading(false);
      });
  }, [slug]);
  return { scholarship: item, loading };
}

export function useServices() {
  const [items, setItems] = useState<CitizenService[]>([]);
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    supabase
      .from('citizen_services')
      .select('*')
      .eq('published', true)
      .order('created_at', { ascending: false })
      .then(({ data, error }) => {
        if (!error && data) setItems(data as CitizenService[]);
        setLoading(false);
      });
  }, []);
  return { services: items, loading };
}

export function useService(slug: string | undefined) {
  const [item, setItem] = useState<CitizenService | null>(null);
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    if (!slug) {
      setLoading(false);
      return;
    }
    supabase
      .from('citizen_services')
      .select('*')
      .eq('slug', slug)
      .eq('published', true)
      .maybeSingle()
      .then(({ data, error }) => {
        if (!error) setItem(data as CitizenService | null);
        setLoading(false);
      });
  }, [slug]);
  return { service: item, loading };
}

export function usePolicies() {
  const [items, setItems] = useState<Policy[]>([]);
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    supabase
      .from('policies')
      .select('*')
      .eq('published', true)
      .order('created_at', { ascending: false })
      .then(({ data, error }) => {
        if (!error && data) setItems(data as Policy[]);
        setLoading(false);
      });
  }, []);
  return { policies: items, loading };
}

export function usePolicy(slug: string | undefined) {
  const [item, setItem] = useState<Policy | null>(null);
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    if (!slug) {
      setLoading(false);
      return;
    }
    supabase
      .from('policies')
      .select('*')
      .eq('slug', slug)
      .eq('published', true)
      .maybeSingle()
      .then(({ data, error }) => {
        if (!error) setItem(data as Policy | null);
        setLoading(false);
      });
  }, [slug]);
  return { policy: item, loading };
}

export function useBlogs() {
  const [items, setItems] = useState<Blog[]>([]);
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    supabase
      .from('blogs')
      .select('*')
      .eq('published', true)
      .order('created_at', { ascending: false })
      .then(({ data, error }) => {
        if (!error && data) setItems(data as Blog[]);
        setLoading(false);
      });
  }, []);
  return { blogs: items, loading };
}

export function useNotifications() {
  const [items, setItems] = useState<Notification[]>([]);
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    supabase
      .from('notifications')
      .select('*')
      .eq('published', true)
      .order('created_at', { ascending: false })
      .then(({ data, error }) => {
        if (!error && data) setItems(data as Notification[]);
        setLoading(false);
      });
  }, []);
  return { notifications: items, loading };
}

export function useCategories() {
  const [items, setItems] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    supabase
      .from('categories')
      .select('*')
      .order('id', { ascending: true })
      .then(({ data, error }) => {
        if (!error && data) setItems(data as Category[]);
        setLoading(false);
      });
  }, []);
  return { categories: items, loading };
}

export function useStates() {
  const [items, setItems] = useState<State[]>([]);
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    supabase
      .from('states')
      .select('*')
      .order('name', { ascending: true })
      .then(({ data, error }) => {
        if (!error && data) setItems(data as State[]);
        setLoading(false);
      });
  }, []);
  return { states: items, loading };
}

export function useMinistries() {
  const [items, setItems] = useState<Ministry[]>([]);
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    supabase
      .from('ministries')
      .select('*')
      .order('name', { ascending: true })
      .then(({ data, error }) => {
        if (!error && data) setItems(data as Ministry[]);
        setLoading(false);
      });
  }, []);
  return { ministries: items, loading };
}

export function useDocumentsMaster() {
  const [items, setItems] = useState<DocumentMaster[]>([]);
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    supabase
      .from('documents_master')
      .select('*')
      .order('name', { ascending: true })
      .then(({ data, error }) => {
        if (!error && data) setItems(data as DocumentMaster[]);
        setLoading(false);
      });
  }, []);
  return { documents: items, loading };
}

export function useSyncJobs() {
  const [items, setItems] = useState<DataSyncJob[]>([]);
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    supabase
      .from('data_sync_jobs')
      .select('*')
      .order('created_at', { ascending: false })
      .then(({ data, error }) => {
        if (!error && data) setItems(data as DataSyncJob[]);
        setLoading(false);
      });
  }, []);
  return { jobs: items, loading };
}

export function useDistricts(stateId: number | null) {
  const [items, setItems] = useState<District[]>([]);
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    if (!stateId) {
      setItems([]);
      setLoading(false);
      return;
    }
    supabase
      .from('districts')
      .select('*')
      .eq('state_id', stateId)
      .order('name', { ascending: true })
      .then(({ data, error }) => {
        if (!error && data) setItems(data as District[]);
        setLoading(false);
      });
  }, [stateId]);
  return { districts: items, loading };
}
