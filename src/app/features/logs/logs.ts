import { Component, signal, computed, inject, OnInit } from '@angular/core';
import { RouterLink } from '@angular/router';
import { SupabaseService } from '../../core/services/supabase';

interface LogEntry {
  id: string;
  timestamp: string;
  author: string;
  title: string;
  read_time: number;
  tags: string[];
}

@Component({
  selector: 'app-logs',
  standalone: true,
  imports: [RouterLink],
  templateUrl: './logs.html',
  styleUrl: './logs.scss'
})
export default class Logs implements OnInit {
  private database = inject(SupabaseService);

  categories = [
    { code: 'ARCH', label: 'SYSTEM_ARCHITECTURE' },
    { code: 'SEC', label: 'SECURITY_PROTOCOLS' },
    { code: 'OPT', label: 'PERF_OPTIMIZATION' },
    { code: 'DEV', label: 'TOOLING_&_CI/CD' },
    { code: 'LOG', label: 'POST_MORTEMS' }
  ];

  selectedTag = signal<string | null>(null);
  allLogs = signal<LogEntry[]>([]);
  isLoading = signal(true);
  systemError = signal<string | null>(null);

  filteredLogs = computed(() => {
    const tag = this.selectedTag();
    if (!tag) return this.allLogs();
    return this.allLogs().filter(log => log.tags.includes(tag));
  });

  async ngOnInit() {
    await this.fetchTechnicalArchive();
  }

  async fetchTechnicalArchive() {
    try {
      this.isLoading.set(true);
      
      if (!this.database.client) {
        this.systemError.set('CORE_DATABASE_SOCKET_UNINITIALIZED');
        return;
      }

      const { data, error } = await this.database.client
        .from('logs')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;

      this.allLogs.set(data as LogEntry[]);
    } catch (err: any) {
      console.error('[SYS_ERR] Technical feed pull failed:', err);
      this.systemError.set(err.message || 'ARCHIVE_SOCKET_TIMEOUT');
    } finally {
      this.isLoading.set(false);
    }
  }

  toggleTag(tagCode: string) {
    if (this.selectedTag() === tagCode) {
      this.selectedTag.set(null);
    } else {
      this.selectedTag.set(tagCode);
    }
  }
}