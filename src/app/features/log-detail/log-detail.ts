import { Component, inject, signal, OnInit } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { SupabaseService } from '../../core/services/supabase';

interface DetailedLog {
  id: string;
  title: string;
  timestamp: string;
  author: string;
  read_time: number;
  tags: string[];
}

@Component({
  selector: 'app-log-detail',
  standalone: true,
  imports: [RouterLink],
  templateUrl: './log-detail.html',
  styleUrl: './log-detail.scss'
})
export default class LogDetail implements OnInit {
  private route = inject(ActivatedRoute);
  private database = inject(SupabaseService);

  logId = signal<string | null>(null);
  logData = signal<DetailedLog | null>(null);
  isLoading = signal(true);
  systemError = signal<string | null>(null);

  async ngOnInit() {
    this.route.paramMap.subscribe(async params => {
      const id = params.get('id');
      this.logId.set(id);
      if (id) {
        await this.fetchLogContents(id);
      }
    });
  }

  async fetchLogContents(id: string) {
    try {
      this.isLoading.set(true);
      this.systemError.set(null);

      if (!this.database.client) {
        throw new Error('CORE_DATABASE_SOCKET_UNINITIALIZED');
      }

      const { data, error } = await this.database.client
        .from('logs')
        .select('*')
        .eq('id', id)
        .single();

      if (error) throw error;
      this.logData.set(data as DetailedLog);
    } catch (err: any) {
      console.error('[SYS_ERR] Object lookup aborted:', err);
      this.systemError.set(err.message || 'FILE_NOT_FOUND');
    } finally {
      this.isLoading.set(false);
    }
  }
}