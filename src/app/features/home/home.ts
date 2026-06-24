/* src/app/features/home/home.ts */
import { Component, signal, inject, OnInit, OnDestroy, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { SupabaseService } from '../../core/services/supabase';
import { RealtimeChannel } from '@supabase/supabase-js';

interface SystemProcess {
  id: string;
  title: string;
  status: 'ACTIVE' | 'TRACKING' | 'IDLE';
  message: string;
}

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [],
  templateUrl: './home.html',
  styleUrl: './home.scss'
})
export default class Home implements OnInit, OnDestroy {
  private database = inject(SupabaseService);
  private platformId = inject(PLATFORM_ID);
  private realtimeChannel!: RealtimeChannel;

  liveProcesses = signal<SystemProcess[]>([]);
  isLoading = signal(true);

  async ngOnInit() {
    if (isPlatformBrowser(this.platformId)) {
      await this.fetchInitialProcesses();
      this.setupRealtimeSubscription();
    } else {
      this.isLoading.set(false);
    }
  }

  async fetchInitialProcesses() {
    try {
      const { data, error } = await this.database.client
        .from('processes')
        .select('*');
      
      if (error) throw error;
      this.liveProcesses.set(data as SystemProcess[]);
    } catch (err) {
      console.error('[SYS_ERR] Realtime baseline fetch dropped:', err);
    } finally {
      this.isLoading.set(false);
    }
  }

  setupRealtimeSubscription() {
    this.realtimeChannel = this.database.client
      .channel('public:processes')
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'processes' },
        (payload) => {
          this.handleLivePayload(payload);
        }
      )
      .subscribe();
  }

  private handleLivePayload(payload: any) {
    const current = [...this.liveProcesses()];
    
    if (payload.eventType === 'INSERT') {
      this.liveProcesses.set([...current, payload.new as SystemProcess]);
    } else if (payload.eventType === 'UPDATE') {
      const updated = current.map(p => p.id === payload.new.id ? (payload.new as SystemProcess) : p);
      this.liveProcesses.set(updated);
    } else if (payload.eventType === 'DELETE') {
      this.liveProcesses.set(current.filter(p => p.id !== payload.old.id));
    }
  }

  ngOnDestroy() {
    if (this.realtimeChannel) {
      this.database.client.removeChannel(this.realtimeChannel);
    }
  }
}