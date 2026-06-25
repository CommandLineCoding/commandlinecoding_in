/* src/app/features/home/home.ts */
import { Component, OnInit, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SupabaseService } from '../../core/services/supabase';

interface LiveProcess {
  id: string;
  process_name: string;
  status: 'ACTIVE' | 'TRACKING' | 'IDLE';
  meta_details: string;
  created_at: string;
}

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './home.html',
  styleUrl: './home.scss'
})
export default class HomeComponent implements OnInit {
  private supabase = inject(SupabaseService);
  
  // Reactive container matching database schema
  liveProcesses = signal<LiveProcess[]>([]);

  ngOnInit() {
    this.fetchTelemetry();
  }

  async fetchTelemetry() {
    const { data, error } = await this.supabase.client
      .from('live_processes')
      .select('*')
      .order('created_at', { ascending: true });

    if (error) {
      console.error('[SYS_WARN] Telemetry pipeline offline:', error);
      return;
    }

    if (data) {
      this.liveProcesses.set(data as LiveProcess[]);
    }
  }
}