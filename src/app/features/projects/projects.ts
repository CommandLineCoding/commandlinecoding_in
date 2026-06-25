/* src/app/features/projects/projects.ts */
import { Component, OnInit, inject, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SupabaseService } from '../../core/services/supabase';

export interface ProjectNode {
  id: string;
  title: string;
  description: string;
  status: 'ACTIVE' | 'STABLE' | 'BETA' | 'EXPERIMENTAL' | 'DEPRECATED';
  tags: string[];
  src_url: string;
  node_url: string;
}

@Component({
  selector: 'app-projects',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './projects.html',
  styleUrl: './projects.scss'
})
export default class ProjectsComponent implements OnInit {
  private supabase = inject(SupabaseService);

  // Core data signals
  projects = signal<ProjectNode[]>([]);
  localSearchQuery = signal<string>('');

  totalNodes = computed(() => this.projects().length);
  
  filteredProjects = computed(() => {
    const query = this.localSearchQuery().toLowerCase().trim();
    if (!query) return this.projects();
    
    return this.projects().filter(p => 
      p.title.toLowerCase().includes(query) || 
      p.description.toLowerCase().includes(query) ||
      p.tags.some(t => t.toLowerCase().includes(query))
    );
  });

  ngOnInit() {
    this.pullRegistryData();
  }

  async pullRegistryData() {
    const { data, error } = await this.supabase.client
      .from('projects')
      .select('*')
      .order('id', { ascending: true });

    if (error) {
      console.error('[SYS_ERR] Failed to pull execution registry:', error);
      return;
    }

    if (data) {
      this.projects.set(data as ProjectNode[]);
    }
  }

  onFilterChange(event: Event) {
    const inputElement = event.target as HTMLInputElement;
    this.localSearchQuery.set(inputElement.value);
  }
}