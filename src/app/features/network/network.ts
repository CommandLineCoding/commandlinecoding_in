/* src/app/features/network/network.ts */
import { Component, signal, inject, OnInit } from '@angular/core';
import { SupabaseService } from '../../core/services/supabase';

interface ContributorNode {
  id: string;
  handle: string;
  role: 'ROOT ADMIN' | 'SUDO USER' | 'CONTRIBUTOR';
  class: string;
  status: 'ONLINE' | 'OFFLINE' | 'IDLE';
  ledger: string[];
}

@Component({
  selector: 'app-network',
  standalone: true,
  imports: [],
  templateUrl: './network.html',
  styleUrl: './network.scss'
})
export default class Network implements OnInit {
  private database = inject(SupabaseService);

  contributors = signal<ContributorNode[]>([]);
  isLoading = signal(true);
  systemError = signal<string | null>(null);

  async ngOnInit() {
    await this.fetchContributorDirectory();
  }

  async fetchContributorDirectory() {
    try {
      this.isLoading.set(true);
      
      const { data, error } = await this.database.client
        .from('contributors')
        .select('*');

      if (error) throw error;

      this.contributors.set(data as ContributorNode[]);
    } catch (err: any) {
      console.error('[SYS_ERR] Network lookup failed:', err);
      this.systemError.set(err.message || 'NET_SOCKET_REJECTED');
    } finally {
      this.isLoading.set(false);
    }
  }
}