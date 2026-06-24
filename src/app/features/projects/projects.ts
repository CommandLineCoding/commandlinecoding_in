/* src/app/features/projects/projects.ts */
import { Component, signal, computed, inject, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { SupabaseService } from '../../core/services/supabase';

interface ProjectNode {
  id: string;
  title: string;
  description: string;
  status: 'ACTIVE' | 'STABLE' | 'BETA' | 'EXPERIMENTAL' | 'DEPRECATED';
  tags: string[];
}

@Component({
  selector: 'app-projects',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './projects.html',
  styleUrl: './projects.scss'
})
export default class Projects implements OnInit {
  private database = inject(SupabaseService);
  
  searchQuery = signal('');
  allNodes = signal<ProjectNode[]>([]);
  isLoading = signal(true);
  systemError = signal<string | null>(null);

  // Computed state stream filters live rows instantly
  filteredNodes = computed(() => {
    const query = this.searchQuery().toLowerCase().trim();
    if (!query) return this.allNodes();
    
    return this.allNodes().filter(node => 
      node.title.toLowerCase().includes(query) || 
      node.description.toLowerCase().includes(query) ||
      node.tags.some(t => t.toLowerCase().includes(query))
    );
  });

  async ngOnInit() {
    await this.fetchRegistryNodes();
  }

  async fetchRegistryNodes() {
    try {
      this.isLoading.set(true);
      
      const { data, error } = await this.database.client
        .from('projects')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      
      this.allNodes.set(data as ProjectNode[]);
    } catch (err: any) {
      console.error('[SYS_ERR] Registry pull dropped:', err);
      this.systemError.set(err.message || 'RUNTIME_SOCKET_TIMEOUT');
    } finally {
      this.isLoading.set(false);
    }
  }
}